import * as THREE from "three";
import {
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshPhongMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

import { makeScene, type Pt3 } from "/lib/three-utils.js";
import { $ } from "/lib/utils.js";

import type { Settings } from "./types";

const { cos, sin, PI } = Math,
  TWOPI = 2 * PI;

const settings: Settings = {
  a: -2,
  b: 2,
  fn: (x: number) => Math.cos(x) + Math.sin(x) + 2,
  showGraph: true,
  slices: 10,
};

// create scene
const { camera, scene } = makeScene({
  camera: {
    position: [0, -5, 10],
    up: [0, 0, 1],
  },
  container: $("#three-container")!,
  controls: OrbitControls,
  lights: [
    { color: 0x404040, kind: "ambient" },
    { decay: 0, intensity: PI, kind: "point", position: [0, 200, 0] },
    { decay: 0, intensity: PI, kind: "point", position: [100, 200, 100] },
    { decay: 0, intensity: PI, kind: "point", position: [-100, -200, -100] },
  ],
});

camera.lookAt(new THREE.Vector3(0, -3, 5));

/* ------------------------- populate scene ------------------------- */
// axes helper
scene.add(new THREE.AxesHelper(5));

// surface of revolution
let graph: Mesh;
{
  const geometry = revolutionGeometry();
  const material = new MeshPhongMaterial({
    color: 0x00aeff,
  });
  material.side = DoubleSide;
  graph = new Mesh(geometry, material);
  scene.add(graph);
}

// disk/washer method
const disks = new Group();
disks.visible = false; //!settings.showGraph;
scene.add(disks);

/**
 * Create a volume of revolution
 */
function revolutionGeometry(
  /**
   * Maximum angle to sweep through.
   * @default 2π
   */
  maxAngle = TWOPI,
) {
  const precision = 120;

  const surface = revolution(settings.fn, settings.a, settings.b, maxAngle);

  return new ParametricGeometry(
    (u, v, target) => {
      target.set(...surface(u, v));
    },
    precision,
    precision,
  );
}

/** Create the disks */
function populateDisks() {
  const { a, b, slices, fn } = settings;

  const width = (b - a) / slices;

  // clean up
  while (disks.children.length) disks.remove(disks.children.at(-1)!);

  // populate disks
  for (let i = 0; i < slices; ++i) {
    const p = a + i * width;

    const geometry = new CylinderGeometry(fn(p), fn(p), width, 50);
    const material = new MeshPhongMaterial({
      color: 0x5cc26d,
    });
    const mesh = new Mesh(geometry, material);

    mesh.position.set(p + width / 2, 0, 0);
    mesh.rotation.z = Math.PI / 2;

    disks.add(mesh);
  }
}

/**
 * Parametrize a surface of revolution
 */
function revolution(
  /** function to revolutionize */
  f: (x: number) => number,
  /** left endpoint */
  a: number,
  /** right endpoint */
  b: number,
  /**
   * max angle
   * @default 2π
   */
  maxAngle = TWOPI,
) {
  return (s: number, t: number): Pt3 => {
    const x = a + s * (b - a),
      angle = t * maxAngle;

    return [x, f(x) * cos(angle), f(x) * sin(angle)];
  };
}

/** for cancelling animations */
let animationRequest: number;

type EasingFunction = (t: number) => number;

export function animate({
  easing = (t: number) => t,
}: {
  easing?: EasingFunction;
} = {}) {
  const start = performance.now();

  /** duration in milliseconds */
  const duration = 2000;

  function update(t: number) {
    const progress = easing(Math.min((t - start) / duration, 1));

    graph.geometry = revolutionGeometry(progress * TWOPI);

    if (progress < 1) {
      animationRequest = requestAnimationFrame(update);
    }
  }

  // cancel previous animations
  if (animationRequest) {
    cancelAnimationFrame(animationRequest);
  }

  // start new animation
  animationRequest = requestAnimationFrame(update);
}
export function update(o: Partial<Settings>) {
  Object.assign(settings, o);

  if (o.a || o.b || o.fn) graph.geometry = revolutionGeometry();
  graph.visible = settings.showGraph;

  disks.visible = !settings.showGraph;
  if (disks.visible) populateDisks();
}

export { graph };
