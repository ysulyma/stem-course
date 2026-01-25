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
	points: ColoredPoint[];
}

/* state */
const state: State = {
	color: "red",
	points: [],
};

function wireUpButtons() {
	for (const btn of $$(".color-selection") as HTMLButtonElement[]) {
		const color = btn.dataset.color;
		if (!color) {
			console.warn("missing color on ", btn);
			continue;
		}
		btn.addEventListener("click", () => {
			state.color = btn.dataset.color!;
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

function wireUpCanvas() {
	const drawingCanvas = $("#layer-drawing") as HTMLCanvasElement;
	const ctx = drawingCanvas.getContext("2d")!;
	console.log(drawingCanvas);

	drawingCanvas.addEventListener("click", (e) => {
		console.log(e);
		// convert event coordinates to canvas coordinates
		const rect = drawingCanvas.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		state.points.push({ color: state.color, x, y });

		ctx.beginPath();
		ctx.fillStyle = state.color;
		ctx.arc(x, y, config.drawRadius, 0, 2 * Math.PI);
		ctx.fill();
	});

	drawingCanvas.addEventListener("mousemove", (e) => {
		console.log(e);
		// convert event coordinates to canvas coordinates
		const rect = drawingCanvas.getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		drawCursor(x, y);
	});
}

document.addEventListener("DOMContentLoaded", () => {
	wireUpButtons();
	wireUpCanvas();
	resizeCanvases();

	window.addEventListener("resize", resizeCanvases);
});

function resizeCanvases() {
	for (const canvas of $$("canvas") as HTMLCanvasElement[]) {
		const rect = canvas.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		canvas.height = height;
		canvas.width = width;
	}
}

function drawCursor(x: number, y: number) {
	const cursor = $("#cursor") as SVGSVGElement;

	Object.assign(cursor.style, {
		left: `${x}px`,
		top: `${y}px`,
	});
}

// export function ClientContent() {
//   const [selectedColor, setColor] = useState<Color>("red");
//   const canvas = useRef<CanvasRef>(null);
//
//   return (
//     <div className="h-screen w-screen rounded-md p-2">
//       <div className="flex items-center gap-2">
//         {COLORS.map((color) => (
//           // biome-ignore lint/a11y/useSemanticElements: no it can't
//           <button
//             aria-checked={color === selectedColor}
//             role="radio"
//             className="h-6 w-6 border border-solid opacity-30 aria-checked:opacity-100"
//             key={color}
//
// const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas(
//   { color },
//   ref,
// ) {
//   // canvases
//   const dotsLayer = useRef<HTMLCanvasElement>(null);
//   const drawingLayer = useRef<HTMLCanvasElement>(null);
//   useSetCanvasSize(dotsLayer);
//   useSetCanvasSize(drawingLayer);
//
//   /** Points drawn on the canvas */
//   const points = useRef<ColoredPoint[]>([]);
//
//   /** Redraw the KNN canvas */
//   const redrawKNN = useCallback(() => {
//     const dotsCanvas = dotsLayer.current;
//     if (!dotsCanvas) return;
//
//     const ctx = dotsCanvas.getContext("2d");
//     if (!ctx) return;
//
//     console.log(points);
//
//     // clear the canvas
//     ctx.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
//
//     // early exit if there are no points
//     if (points.current.length === 0) return;
//
//     // draw the points
//     for (
//       let x = config.granularity;
//       x < dotsCanvas.width;
//       x += config.granularity
//     ) {
//       for (
//         let y = config.granularity;
//         y < dotsCanvas.height;
//         y += config.granularity
//       ) {
//         const nearestNeighbor = findNearestNeighbor({ x, y }, points.current);
//
//         ctx.beginPath();
//         ctx.fillStyle = nearestNeighbor.color;
//         ctx.arc(x, y, config.dotRadius, 0, TURN);
//         ctx.fill();
//       }
//     }
//   }, []);
//
//
//   // component api
//   useImperativeHandle(ref, () => ({
//     clear: () => {
//       // reset the points
//       points.current = [];
//
//       // clear the dots canvas
//       redrawKNN();
//
//       // clear the drawing canvas
//       const drawingCanvas = drawingLayer.current;
//       if (!drawingCanvas) return;
//
//       drawingCanvas
//         .getContext("2d")
//         ?.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
//     },
//   }));
//
//   return (
//     <div className="relative h-80 w-full border border-gray-600 border-solid">
//       <canvas
//         className="pointer-events-none absolute h-full w-full opacity-50"
//         ref={dotsLayer}
//       />
//       <canvas
//         className="absolute h-full w-full"
//         onPointerDown={addPoint}
//         ref={drawingLayer}
//       />
//     </div>
//   );
// });
//
// /**
//  * Find the nearest neighbor of a point in a set of points
//  * @param pt - The point to find the nearest neighbor of
//  * @param points - The set of points to find the nearest neighbor in
//  * @returns The nearest neighbor of the point
//  */
// function findNearestNeighbor<T extends Point>(pt: Point, points: T[]): T {
//   let minDistance = Number.POSITIVE_INFINITY;
//
//   let nearestNeighbor: T | undefined;
//
//   for (const p of points) {
//     const distance = Math.hypot(pt.x - p.x, pt.y - p.y);
//
//     if (distance < minDistance) {
//       minDistance = distance;
//       nearestNeighbor = p;
//     }
//   }
//
//   if (!nearestNeighbor) {
//     throw new Error("Empty array of points");
//   }
//
//   return nearestNeighbor;
// }
//
//
//
function $(selector: string, target = document) {
	return target.querySelector(selector);
}

function $$(selector: string, target = document) {
	return Array.from(target.querySelectorAll(selector));
}
