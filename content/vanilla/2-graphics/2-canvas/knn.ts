const TURN = 2 * Math.PI;

interface Point {
	x: number;
	y: number;
}

interface ColoredPoint extends Point {
	color: string;
}

const config = {
	dotRadius: 1,
	drawRadius: 5,
	granularity: 3,
};

interface State {
	color: string;
	k: number;
	points: ColoredPoint[];
}

/* state */
const state: State = {
	color: "red",
	k: 1,
	points: [],
};

/** add selection functionality to the buttons */
function wireUpButtons() {
	for (const btn of $$(".color-selection") as HTMLButtonElement[]) {
		const color = btn.dataset.color;
		if (!color) {
			console.warn("missing color on ", btn);
			continue;
		}
		btn.addEventListener("click", () => {
			state.color = btn.dataset.color!;
			$("#cursor circle")?.setAttribute("fill", state.color);
			redrawButtons();
		});
	}

	function redrawButtons() {
		for (const btn of $$(".color-selection") as HTMLButtonElement[]) {
			const buttonColor = btn.dataset.color!;

			btn.ariaChecked = buttonColor === state.color ? "" : null;
		}
	}
}

function wireUpKSelector() {
	const kInput = $("#input-k") as HTMLInputElement;
	const kValue = $("#value-k") as HTMLInputElement;

	state.k = parseInt(kInput.value);
	kValue.textContent = String(state.k);

	kInput.addEventListener("input", () => {
		state.k = parseInt(kInput.value);
		kValue.textContent = String(state.k);

		redrawPoints();
	});
}

function wireUpCanvas() {
	const drawingCanvas = $("#layer-drawing") as HTMLCanvasElement;
	let rect = drawingCanvas.getBoundingClientRect();

	const ctx = drawingCanvas.getContext("2d")!;

	drawingCanvas.addEventListener("click", (e) => {
		// convert event coordinates to canvas coordinates
		const rect = drawingCanvas.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		state.points.push({ color: state.color, x, y });

		ctx.beginPath();
		ctx.fillStyle = state.color;
		ctx.arc(x, y, config.drawRadius, 0, 2 * Math.PI);
		ctx.fill();

		redrawPoints();
	});

	drawingCanvas.addEventListener("mousemove", (e) => {
		// convert event coordinates to canvas coordinates
		const rect = drawingCanvas.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		drawCursor(x, y);
	});
}

function wireUpClear() {
	$("#clear")?.addEventListener("click", () => {
		state.points = [];
		redrawPoints();
	});
}

document.addEventListener("DOMContentLoaded", () => {
	wireUpButtons();
	wireUpCanvas();
	resizeCanvases();
	wireUpKSelector();
	wireUpClear();

	window.addEventListener("resize", resizeCanvases);
});

/** resize all canvases when the window is resized */
function resizeCanvases() {
	for (const canvas of $$("canvas") as HTMLCanvasElement[]) {
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		canvas.height = height;
		canvas.width = width;
	}

	redrawPoints();
}

/** move the cursor dot */
function drawCursor(x: number, y: number) {
	const cursor = $("#cursor") as SVGSVGElement;

	Object.assign(cursor.style, {
		translate: `calc(${x}px - 50%) calc(${y}px - 50%)`,
	});
}

/** redraw the KNN canvas */
function redrawPoints() {
	const dotsCanvas = $("#layer-dots") as HTMLCanvasElement;
	const ctx = dotsCanvas.getContext("2d");

	if (!ctx) return;

	// clear the canvas
	ctx.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);

	// early exit if no points
	if (state.points.length === 0) return;

	console.log(findNearestNeighbors({ x: 1500, y: 300 }, state.points, state.k));

	// draw the points
	for (
		let x = config.granularity;
		x < dotsCanvas.width;
		x += config.granularity
	) {
		for (
			let y = config.granularity;
			y < dotsCanvas.height;
			y += config.granularity
		) {
			const nearestNeighbors = findNearestNeighbors(
				{ x, y },
				state.points,
				state.k,
			);

			const colorCounts = nearestNeighbors.reduce(
				(acc, curr) => {
					if (!acc[curr.color]) {
						acc[curr.color] = 0;
					}
					acc[curr.color]++;
					return acc;
				},
				{} as Record<string, number>,
			);

			let winner;
			let max = -1;

			for (const color in colorCounts) {
				const count = colorCounts[color];
				if (count > max) {
					max = count;
					winner = color;
				}
			}

			ctx.beginPath();
			ctx.fillStyle = winner;
			ctx.arc(x, y, config.dotRadius, 0, TURN);
			ctx.fill();
		}
	}
}

/**
 * Find the nearest neighbor of a point in a set of points
 * @param pt - The point to find the nearest neighbor of
 * @param points - The set of points to find the nearest neighbor in
 * @returns The nearest neighbor of the point
 */
function findNearestNeighbors<T extends Point>(
	pt: Point,
	points: T[],
	k: number,
): T[] {
	const log = (...args) => {
		if (pt.x === 1500 && pt.y === 300) {
			console.log(...args);
		}
	};
	let distanceCutoff = Number.POSITIVE_INFINITY;

	let nearestNeighborsWithDistances: [T, number][] = [];

	for (const p of points) {
		const distance = Math.hypot(pt.x - p.x, pt.y - p.y);

		if (nearestNeighborsWithDistances.length < k) {
			let closerThanExisting = false;
			// figure out where to insert it
			for (let i = 0; i < nearestNeighborsWithDistances.length; ++i) {
				const otherDistance = nearestNeighborsWithDistances[i][1];
				if (distance <= otherDistance) {
					closerThanExisting = true;
					nearestNeighborsWithDistances.splice(i, 0, [p, distance]);
					break;
				}
			}
			if (!closerThanExisting) {
				nearestNeighborsWithDistances.push([p, distance]);
			}
			distanceCutoff = nearestNeighborsWithDistances.at(-1)[1];
			log({
				closerThanExisting,
				distanceCutoff,
				nearestNeighborsWithDistances: nearestNeighborsWithDistances.slice(),
			});
		} else {
			if (distance < distanceCutoff) {
				// figure out where to insert it
				for (let i = 0; i < k; ++i) {
					const otherDistance = nearestNeighborsWithDistances[i][1];
					if (distance <= otherDistance) {
						nearestNeighborsWithDistances.splice(i, 0, [p, distance]);
						nearestNeighborsWithDistances.pop();
						break;
					}
				}
			}
		}
	}

	log({ nearestNeighborsWithDistances });

	return nearestNeighborsWithDistances.map(([pt, _dist]) => pt);
}



function $$(selector: string, target = document) {
	return Array.from(target.querySelectorAll(selector));
}
