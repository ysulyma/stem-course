import * as THREE from "three";

/** point in R^3 */
export type Pt3 = [number, number, number];

interface PointLightConfig {
  kind: "point";

  color?: THREE.ColorRepresentation;
  decay?: number;
  distance?: number;
  intensity?: number;
  position: Pt3;
}

interface AmbientLightConfig {
  kind: "ambient";

  color?: THREE.ColorRepresentation;
  intensity?: number;
}

type LightConfig = AmbientLightConfig | PointLightConfig;

/**
 * Boilerplate to create a THREE.js scene
 */
export function makeScene<TEventMap extends {}>({
  animate: animationFn,
  camera: cameraConfig = {},
  container = document.body,
  controls: controlsConstructor,
  lights = [],
}: {
  animate?: () => void;
  camera?: {
    position?: Pt3;
    up?: Pt3;
  };
  container?: Element;
  controls?: {
    new (
      object: THREE.Camera,
      domElement?: HTMLElement | SVGElement | null,
    ): THREE.Controls<TEventMap>;
  };
  lights?: LightConfig[];
} = {}) {
  // create a scene
  const scene = new THREE.Scene();

  // create a camera
  const rect = container.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(
    75,
    rect.width / rect.height,
    0.1,
    1000,
  );

  // set camera up direction
  if (cameraConfig.up) {
    camera.up.set(...cameraConfig.up);
  }

  // set camera position
  if (cameraConfig.position) {
    camera.position.set(...cameraConfig.position);
  }

  // create a renderer and add it to the document
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setSize(rect.width, rect.height);
  container.appendChild(renderer.domElement);

  // lighting
  for (const config of lights) {
    switch (config.kind) {
      case "ambient": {
        const ambientLight = new THREE.AmbientLight(
          config.color,
          config.intensity,
        );
        scene.add(ambientLight);
        break;
      }

      case "point": {
        const pointLight = new THREE.PointLight(
          config.color,
          config.intensity,
          config.distance,
          config.decay,
        );
        pointLight.position.set(...config.position);
        scene.add(pointLight);
        break;
      }
    }
  }

  // controls
  // biome-ignore lint/suspicious/noExplicitAny: this is complicated/annoying to type
  let controls: any;
  if (controlsConstructor) {
    controls = new controlsConstructor(camera, renderer.domElement);
  }

  // handle resizing
  window.addEventListener("resize", () => {
    const { height, width } = container.getBoundingClientRect();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // animation loop
  function animate() {
    animationFn?.();

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls?.update();
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  // camera helper
  document.body.addEventListener("click", (e) => {
    if (e.shiftKey) {
      let { x, y, z } = camera.position;
      [x, y, z] = [x, y, z].map((t) => truncate(t)) as Pt3;
      console.log(`camera position: [${x}, ${y}, ${z}]`);

      // copy to clipboard
      navigator.clipboard.writeText([x, y, z].join(", ")).then(() => {
        console.log("copied camera coords to clipboard!");
      });
    }
  });

  // return values
  return { camera, controls, renderer, scene };
}

/**
 * Truncate a number to 2 decimal digits of precision
 */
export function truncate(x: number, precision = 2) {
  return parseFloat(x.toFixed(precision));
}

/**
 * Linear interpolation from a to b
 */
export function lerp(
  /** starting point */
  a: number,
  /** ending point */
  b: number,
  /** progress (usually between 0 and 1) */
  t: number,
) {
  return a + t * (b - a);
}
