import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { lerp, makeScene } from "./three-utils.js";

// create scene
const { scene } = makeScene({
	camera: {
		position: [6.12, 3.59, 5.43],
		up: [0, 0, 1], // math convention
	},
	container: document.querySelector("#container"),
	controls: OrbitControls,
});

// add lights
const ambientLight = new THREE.AmbientLight(undefined, 0.1);
scene.add(ambientLight);

const pointLights = [
	{ position: [0, 5, 5], intensity: Math.PI, decay: 0 },
	{ position: [0, 0, -2], intensity: Math.PI },
];

for (const config of pointLights) {
	const pointLight = new THREE.PointLight(
		config.color,
		config.intensity,
		config.distance,
		config.decay,
	);
	pointLight.position.set(...config.position);
	scene.add(pointLight);
}

// axes helper
scene.add(new THREE.AxesHelper(5));

// parametric geometry
const fn = (x, y) => Math.cos(2 * x) * Math.sin(y);

const parametrization = (u, v, target) => {
	const x = lerp(-5, 5, u);
	const y = lerp(-5, 5, v);
	const z = fn(x, y);

	target.set(x, y, z);
};
{
	const geometry = new ParametricGeometry(parametrization, 32, 32);
	const material = new THREE.MeshPhongMaterial({
		transparent: true,
		color: 0x00ff00,
		opacity: 0.5,
	});
	material.side = THREE.DoubleSide;
	const surface = new THREE.Mesh(geometry, material);
	scene.add(surface);
}

// input point
let input;
{
	const geometry = new THREE.SphereGeometry(0.1);
	const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
	material.side = THREE.DoubleSide;
	input = new THREE.Mesh(geometry, material);
	scene.add(input);
}

// output point
let output;
function placeOutput() {
	const { x, y } = input.position;
	output.position.set(x, y, fn(x, y));
}
{
	const geometry = new THREE.SphereGeometry(0.1);
	const material = new THREE.MeshPhongMaterial({ color: 0x1a69b5 });
	material.side = THREE.DoubleSide;
	output = new THREE.Mesh(geometry, material);
	placeOutput();
	scene.add(output);
}

// shortcuts
const controls = {
	announce: ";",
	down: "ArrowDown",
	left: "ArrowLeft",
	mute: "m",
	toggleHelp: "?",
	right: "ArrowRight",
	up: "ArrowUp",
};

// step size for movement
const step = 0.1;

document.body.addEventListener("keydown", (e) => {
	switch (e.key) {
		case controls.toggleHelp:
			document.querySelector("#controls").classList.toggle("hidden");
			break;
		case controls.left:
			input.position.setX(input.position.x - step);
			placeOutput();
			break;
		case controls.right:
			input.position.setX(input.position.x + step);
			placeOutput();
			break;
		case controls.up:
			input.position.setY(input.position.y + step);
			placeOutput();
			break;
		case controls.down:
			input.position.setY(input.position.y - step);
			placeOutput();
			break;
	}
});
