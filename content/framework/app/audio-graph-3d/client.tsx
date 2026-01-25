"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, extend, type ThreeElement } from "@react-three/fiber";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlockMath } from "react-katex";
import { DoubleSide, NoToneMapping } from "three";
import { ParametricGeometry } from "three-stdlib";

extend({ ParametricGeometry });

// Add types to ThreeElements elements so primitives pick up on it
declare module "@react-three/fiber" {
  interface ThreeElements {
    parametricGeometry: ThreeElement<typeof ParametricGeometry>;
  }
}

type Parametrization = ConstructorParameters<typeof ParametricGeometry>[0];

const { cos, sin, PI } = Math;
const minFreq = 261.63; // Middle C (C4)
const maxFreq = 880.0; // High A (A5)

const fn = (x: number, y: number) => 3 * cos(2 * x) * sin(y);

const controls = {
  announce: ";",
  down: "s",
  left: "a",
  mute: "m",
  right: "d",
  toggleHelp: "?",
  up: "w",
};

const stylized = {
  down: "↓",
  left: "←",
  right: "→",
  up: "↑",
};

const labels = {
  toggleHelp: "toggle help",
} satisfies Partial<Record<keyof typeof controls, string>>;

const curve: Parametrization = (u, v, target) => {
  // we want to graph over [-π, π] x [-π, π]
  const s = lerp(-PI, PI, u);
  const t = lerp(-PI, PI, v);
  return target.set(s, t, fn(s, t));
};

export function ClientContent() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale] = useState(0.1);

  const [muted, setMuted] = useState(false);

  const z = fn(x, y);

  const audioRef = useRef<AudioContext>(null);
  const oscillatorRef = useRef<OscillatorNode>(null);
  const gainRef = useRef<GainNode>(null);

  const [helpVisible, setHelpVisible] = useState(true);

  const initAudio = useCallback(() => {
    if (audioRef.current) {
      return;
    }
    audioRef.current = new // biome-ignore lint/suspicious/noExplicitAny: safari
    (window.AudioContext || (window as any).webkitAudioContext)();

    const audioCtx = audioRef.current;

    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillatorRef.current = oscillator;

    oscillator.start();

    const gainNode = audioCtx.createGain();
    gainRef.current = gainNode;
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    oscillator.connect(gainNode).connect(audioCtx.destination);
  }, []);

  useEffect(() => {
    const audioCtx = audioRef.current;
    const oscillator = oscillatorRef.current;
    const gainNode = gainRef.current;

    if (!audioCtx || !oscillator || !gainNode) {
      return;
    }

    const frequency = minFreq + (z / 10) * (maxFreq - minFreq);

    oscillator.frequency.value = frequency;
  }, [z]);

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      initAudio();

      const z = fn(x, y);
      switch (e.key) {
        case controls.toggleHelp:
          setHelpVisible((prev) => !prev);
          return;
        case controls.left:
        case "ArrowLeft":
          setX((prev) => prev - scale);
          return;
        case controls.mute: {
          const gainNode = gainRef.current;
          const audioCtx = audioRef.current;
          if (!gainNode || !audioCtx) return;
          gainNode.gain.setValueAtTime(muted ? 0.2 : 0, audioCtx.currentTime);
          setMuted((prev) => !prev);
          return;
        }
        case controls.up:
        case "ArrowUp":
          setY((prev) => prev + scale);
          return;
        case controls.down:
        case "ArrowDown":
          setY((prev) => prev - scale);
          return;
        case controls.right:
        case "ArrowRight":
          setX((prev) => prev + scale);
          return;
        case controls.announce: {
          const synth = window.speechSynthesis;
          const voice =
            synth.getVoices().find((v) => v.name === "Ralph") ||
            // biome-ignore lint/style/noNonNullAssertion: default always exists
            synth.getVoices().find((v) => v.default)!;
          const utterThis = new SpeechSynthesisUtterance(
            `x: ${truncate(x)}, y: ${truncate(y)}, z: ${truncate(z)}`,
          );
          utterThis.voice = voice;
          synth.speak(utterThis);
          return;
        }
      }
    }

    document.body.addEventListener("keydown", handle);

    return () => {
      document.body.removeEventListener("keydown", handle);
    };
  }, [muted, x, y, initAudio, scale]);

  // useEffect(() => {
  //   let connected = false;
  //
  //   function gamePadConnected(e: GamepadEvent) {
  //     connected = true;
  //     const speed = 0.1;
  //
  //     function loop() {
  //       const gamepad = navigator.getGamepads()[0];
  //       if (!gamepad) return;
  //
  //       const [dx, dy] = gamepad.axes;
  //
  //       if (dx !== 0 || dy !== 0) {
  //         setX((prev) => prev + scale * speed * dx);
  //         setY((prev) => prev - scale * speed * dy);
  //       }
  //
  //       requestAnimationFrame(loop);
  //     }
  //
  //     loop();
  //   }
  //
  //   function gamePadDisconnected(e: GamepadEvent) {
  //     connected = false;
  //   }
  //
  //   window.addEventListener("gamepadconnected", gamePadConnected);
  //   window.addEventListener("gamepaddisconnected", gamePadDisconnected);
  //
  //   return () => {
  //     window.removeEventListener("gamepadconnected", gamePadConnected);
  //     window.removeEventListener("gamepaddisconnected", gamePadDisconnected);
  //   };
  // }, [scale]);

  return (
    <main>
      <KaTeXTags />
      <aside
        className={classNames(
          "fixed top-0 left-0 z-20 bg-black/10 dark:bg-black/70 px-1 rounded-b-sm",
        )}
      >
        <BlockMath>{String.raw`z = 3\cos(2x)\sin(y)`}</BlockMath>
      </aside>
      <GamepadControls />
      <aside
        className={classNames(
          "fixed top-0 right-0 z-20 bg-black/10 dark:bg-black/70 p-2 rounded-bl-sm",
          !helpVisible && "hidden",
        )}
      >
        <table>
          <caption className="font-bold">Controls</caption>
          <tbody>
            {(
              [
                "left",
                "right",
                "up",
                "down",
                "announce",
                "mute",
                "toggleHelp",
              ] as const satisfies (keyof typeof controls)[]
            ).map((key) => (
              <tr key={key}>
                <td className="pr-2 text-right">
                  {key in labels ? labels[key as keyof typeof labels] : key}
                </td>
                <td>
                  <kbd>
                    {key in stylized
                      ? stylized[key as keyof typeof stylized]
                      : controls[key]}
                  </kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
      <div className="bg-white h-screen w-screen">
        <Canvas
          camera={{ position: [1, -4.4, 2.22], up: [0, 0, 1] }}
          gl={{ antialias: true, toneMapping: NoToneMapping }}
        >
          <axesHelper />
          <CameraHelper />
          {/* lights */}
          <ambientLight intensity={1} />
          <pointLight decay={0} intensity={Math.PI} position={[0, 10, 10]} />
          <MoarControls />

          {/* camera */}
          <OrbitControls enableDamping={false} makeDefault />

          <mesh name="x" position={[x, y, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={0xae81ff} side={DoubleSide} />
          </mesh>

          <mesh name="z" position={[x, y, fn(x, y)]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={0xff0000} side={DoubleSide} />
          </mesh>

          <mesh name="graph">
            <parametricGeometry args={[curve, 32, 32]} />
            <meshPhongMaterial color={0x33ffaa} side={DoubleSide} />{" "}
          </mesh>
        </Canvas>
      </div>
    </main>
  );
}

function truncate(x: number, length = 1) {
  return parseFloat(x.toFixed(length));
}

/**
 * Linear interpolation from a to b.
 */
function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function KaTeXTags() {
  return (
    <>
      <link
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
        integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP"
        rel="stylesheet"
      />

      <script
        crossOrigin="anonymous"
        defer
        integrity="sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6"
        src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"
      />
    </>
  );
}

function CameraHelper() {
  // const { camera } = useThree();
  //
  // useEffect(() => {
  //   function log(e: KeyboardEvent) {
  //     if (e.key !== "c") return;
  //
  //     const { x, y, z } = camera.position;
  //     const position = [x, y, z].map(truncate);
  //     const text = "[" + position.join(", ") + "]";
  //     navigator.clipboard.writeText(text).then(() => {
  //       console.log(`copied coordinates to clipboard: ${text}`);
  //     });
  //   }
  //
  //   document.body.addEventListener("keydown", log);
  //
  //   return () => {
  //     document.body.removeEventListener("keydown", log);
  //   };
  // });

  return null;
}

function GamepadControls() {
  //   const [gamePadConnected, setGamePadConnected] = useState(false);
  //
  //   useEffect(() => {
  //     function gamePadConnected(e: GamepadEvent) {
  //       console.log(controls);
  //       setGamePadConnected(true);
  //     }
  //
  //     function gamePadDisconnected() {
  //       setGamePadConnected(false);
  //     }
  //
  //     window.addEventListener("gamepadconnected", gamePadConnected);
  //     window.addEventListener("gamepaddisconnected", gamePadDisconnected);
  //
  //     return () => {
  //       window.removeEventListener("gamepadconnected", gamePadConnected);
  //       window.removeEventListener("gamepaddisconnected", gamePadDisconnected);
  //     };
  //   }, []);
  //
  //   if (!gamePadConnected) return null;
  return null;
  //
  //   return (
  //     <aside className="absolute left-1/2 top-0 bg-black/10 z-20">
  //       <table>
  //         <caption>axes</caption>
  //         <tbody>
  //           <tr>
  //             <td>
  //               <span className="bg-blue-500 rounded-full p-1 text-white">X</span>
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </aside>
  //   );
}

// const xboxMapping = {
//   // xyab
//   a: 0,
//   b: 1,
//   x: 2,
//   y: 3,
//
//   // bumper/triggers
//   leftBumper: 4,
//   rightBumper: 5,
//   leftTrigger: 6,
//   rightTrigger: 7,
//
//   // back/start
//   back: 8,
//   start: 9,
//
//   // sticks
//   leftStick: 10,
//   rightStick: 11,
//
//   // d-pad
//   up: 12,
//   down: 13,
//   left: 14,
//   right: 15,
//
//   // special
//   xbox: 16,
// };

function MoarControls() {
  // const $three = useThree();

  // useEffect(() => {
  //   let connected = true;
  //   const speed = 0.1;
  //
  //   function loop() {
  //     if (!connected) return;
  //     const { controls } = $three;
  //     console.log($three);
  //
  //     const gamepad = navigator.getGamepads()[0];
  //
  //     if (gamepad && controls) {
  //       const [, , dx, dy] = gamepad.axes;
  //       console.log(dx, dy, controls);
  //       controls.setAzimuthalAngle(controls.getAzimuthalAngle() + speed * dx);
  //       controls.setPolarAngle(controls.getPolarAngle() + speed * dy);
  //     }
  //     requestAnimationFrame(loop);
  //   }
  //
  //   loop();
  //
  //   return () => {
  //     connected = false;
  //   };
  // }, [$three]);

  return null;
}
