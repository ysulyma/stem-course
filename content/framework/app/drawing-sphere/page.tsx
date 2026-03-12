"use client";

import { constrain } from "@liqvid/utils/misc";
import { onDrag } from "@liqvid/utils/react";
import { screenToSVG } from "@liqvid/utils/svg";
import { useMemo, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";

interface Pt {
  x: number;
  y: number;
}

const r = 45;

export default function DrawingSphere() {
  const [pt, setPt] = useState<Pt>({ x: 0, y: -30 });

  const events = useMemo(
    () =>
      onDrag(
        (_e, { x, y }) => {
          if (!svg.current) return;
          const [newX, newY] = screenToSVG(svg.current, x, y);
          setPt({ x: 0, y: constrain(-r, newY, r) });
        },
        () => {
          document.body.classList.add("dragging");
        },
        () => {
          document.body.classList.remove("dragging");
        },
      ),
    [],
  );

  const svg = useRef<SVGSVGElement>(null);

  const chordStart = {
    x: -Math.sqrt(r ** 2 - pt.y ** 2),
    y: pt.y,
  };

  const chordEnd = {
    x: Math.sqrt(r ** 2 - pt.y ** 2),
    y: pt.y,
  };

  const pPrimeAngle = Math.atan2(chordStart.y, chordStart.x);
  const eAngle = Math.PI / 2 - pPrimeAngle;

  const eStart: Pt = {
    x: r * Math.cos(eAngle),
    y: -r * Math.sin(eAngle),
  };

  const eEnd: Pt = {
    x: -eStart.x,
    y: -eStart.y,
  };

  const screenE = svg.current
    ? SVGToScreen(svg.current, { x: eStart.x * 1.05, y: eStart.y * 1.05 })
    : null;
  console.log(screenE);

  return (
    <main className="bg-white h-screen w-screen">
      <KaTeXTags />
      <style>{`body.dragging, body.dragging .cursor-grab { cursor: grabbing !important; }`}</style>
      <svg
        viewBox={`-50 -50 100 100`}
        className="bg-white w-200 mx-auto"
        ref={svg}
      >
        <title>drawing sphere</title>

        <line
          x1={pt.x}
          y1={pt.y}
          x2={0}
          y2={0}
          stroke="#eee"
          strokeDasharray="1 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* chord from p'  */}
        <line
          x1={chordStart.x}
          y1={chordStart.y}
          x2={chordEnd.x}
          y2={chordEnd.y}
          stroke="#eee"
          strokeWidth={0.5}
        />

        <line x1={-r} y1={0} x2={r} y2={0} stroke="#eee" strokeWidth={0.5} />
        <line
          x1={chordStart.x}
          y1={chordStart.y}
          x2={0}
          y2={0}
          stroke="#eee"
          strokeWidth={0.5}
        />

        <path
          d={`
M 0 ${t(eStart.y)}
L ${t(eStart.x)} ${t(eStart.y)}
L ${t(eEnd.x)} ${t(eEnd.y)}
L 0 ${t(eEnd.y)}
`}
          fill="none"
          stroke="#eee"
          strokeWidth={0.5}
        />

        <circle
          className="pointer-none"
          cx={0}
          cy={0}
          r={r}
          stroke="black"
          fill="none"
        />

        <circle cx={0} cy={0} r={1} fill="black" />
        <circle cx={chordStart.x} cy={chordStart.y} r={1} fill="black" />

        {/* ellipse */}
        <path
          d={`M ${-r} 0 A ${r} ${t(Math.abs(eStart.y))} 0 1 0 ${r} 0`}
          stroke="blue"
          fill="none"
        />
        <path
          d={`M ${-r} 0 A ${r} ${t(Math.abs(eStart.y))} 0 0 1 ${r} 0`}
          stroke="blue"
          strokeDasharray=".1 2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={t(eStart.x)} cy={t(eStart.y)} r={1} fill="black" />
        <circle
          className="cursor-grab"
          cx={pt.x}
          cy={pt.y}
          r={1}
          fill="red"
          {...events}
        />
      </svg>

      <AlignToSvg
        className="text-black text-xl -translate-x-1/2 -translate-y-1/2"
        pt={mult(eStart, 1.08)}
        svg={svg}
      >
        <InlineMath>E</InlineMath>
      </AlignToSvg>

      <AlignToSvg
        className="text-black text-xl -translate-x-1/2 -translate-y-1/2"
        pt={mult(chordStart, 1.08)}
        svg={svg}
      >
        <InlineMath>p'</InlineMath>
      </AlignToSvg>

      <AlignToSvg
        className="text-[#f00] text-xl bg-white"
        pt={{ x: pt.x + 1, y: pt.y + 1 }}
        svg={svg}
      >
        <InlineMath>p</InlineMath>
      </AlignToSvg>
    </main>
  );
}

function mult(pt: Pt, scale: number): Pt {
  return {
    x: pt.x * scale,
    y: pt.y * scale,
  };
}

function AlignToSvg({
  svg,
  pt,
  ...props
}: {
  svg: React.RefObject<SVGSVGElement | null>;
  pt: Pt;
} & React.HTMLAttributes<HTMLElement>) {
  if (!svg.current) return null;

  const { x, y } = SVGToScreen(svg.current, pt);

  return (
    <div
      style={{
        position: "absolute",
        left: `${t(x)}px`,
        top: `${t(y)}px`,
      }}
      {...props}
    />
  );
}

function t(x: number, precision = 8) {
  return parseFloat(x.toFixed(precision));
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

function SVGToScreen(svg: SVGSVGElement, svgPt: Pt): Pt {
  const p = svg.createSVGPoint();
  p.x = svgPt.x;
  p.y = svgPt.y;
  return p.matrixTransform(svg.getScreenCTM()!);
}
