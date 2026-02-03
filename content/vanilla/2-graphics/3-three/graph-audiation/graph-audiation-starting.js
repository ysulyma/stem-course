import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { lerp, makeScene } from "./three-utils.mjs";

const { controls, scene } = makeScene({
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
	{ position: [0, 5, 5], intensity: Math.PI },
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
{
	const pointLight = new THREE.PointLight(undefined, Math.PI, undefined, 0);
	pointLight.position.set(0, 5, 5);
	scene.add(pointLight);
}

// axes helper
scene.add(new THREE.AxesHelper(5));

// parametric geometry
const fn = (x, y) => Math.cos(x) * Math.sin(y);

const parametrization = (u, v, target) => {
	const x = lerp(-5, 5, u);
	const y = lerp(-5, 5, v);
	const z = fn(x, y);

	target.set(x, y, z);
};
const geometry = new ParametricGeometry(parametrization, 25, 25);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
material.side = THREE.DoubleSide;
const surface = new THREE.Mesh(geometry, material);
scene.add(surface);
