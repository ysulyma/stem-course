import "mathquill.d.ts";

import { $ } from "/lib/utils.js";

import * as api3 from "./api-three.js";
import * as api2 from "./api-two.js";
import type { Settings } from "./types.js";

const TWOPI = 2 * Math.PI;

const input = $("#function-input")!;

const settings: Settings = {
  a: -2,
  b: 2,
  fn: (x: number) => Math.cos(x) + Math.sin(x) + 2,
  showGraph: true,
  slices: 10,
};

/* attach behaviors */
const MQ = MathQuill.getInterface(2); // for backcompat
const mathField = MQ.MathField(input, {
  handlers: {
    enter() {
      try {
        const fn = math.compile(text(mathField.__controller.root));
        settings.fn = (x) => fn.evaluate({ x });

        api3.update({ fn: settings.fn });
        api2.update({ fn: settings.fn });
        updateVolume();
      } catch (e) {
        console.error(e);
      }
    },
  },
  spaceBehavesLikeTab: true, // configurable
});

$("textarea")!.setAttribute("tabindex", "1");

$("#input-a")!.addEventListener("change", (e) => {
  settings.a = (e.target as HTMLInputElement).valueAsNumber;
  api3.update({ a: settings.a });
  api2.update({ a: settings.a });
  updateVolume();
});

$("#input-b")!.addEventListener("change", (e) => {
  settings.b = (e.target as HTMLInputElement).valueAsNumber;
  api3.update({ b: settings.b });
  api2.update({ b: settings.b });
  updateVolume();
});

$("#slices")!.addEventListener("change", (e) => {
  settings.slices = (e.target as HTMLInputElement).valueAsNumber;
  api3.update({ slices: settings.slices });
  updateVolume();
});

$("#graph-text")!.addEventListener("click", () => {
  settings.showGraph = true;
  updateGraphToggle();
  api3.update({ showGraph: settings.showGraph });
});

$("#disks-text")!.addEventListener("click", () => {
  settings.showGraph = false;
  updateGraphToggle();
  api3.update({ showGraph: settings.showGraph });
});

$("#toggle-graph")!.addEventListener("click", () => {
  settings.showGraph = !settings.showGraph;
  updateGraphToggle();
  api3.update({ showGraph: settings.showGraph });
});

$("#animate")!.addEventListener("click", () => {
  api3.animate();
});

/* miscellaneous other init */
updateVolume();

function updateGraphToggle() {
  $("#toggle-graph > rect")!.setAttribute(
    "fill",
    settings.showGraph ? "#00AEFF" : "#5CC26D",
  );
  $("#toggle-graph > circle")!.setAttribute(
    "cx",
    String(settings.showGraph ? 20 : 60),
  );
}

function updateVolume() {
  const { a, b, fn, slices } = settings;

  function estimateVolume(n: number) {
    const width = (b - a) / n;
    let volume = 0;
    for (let i = 0; i < n; ++i) {
      const p = a + i * width;

      volume += (fn(p) * fn(p) * width * TWOPI) / 2;
    }

    return volume;
  }

  katex.render(
    `
      \\begin{align*}
        \\pi\\sum_{i=1}^{\\mathsf{\\#disks}} f(x_i)\\,\\Delta x &= ${estimateVolume(slices).toFixed(4)}\\\\
        \\pi\\int_a^b f(x)^2\\,dx &= ${estimateVolume(100000).toFixed(4)}
      \\end{align*}
    `,
    $("#volume-calc")!,
    {
      displayMode: true,
    },
  );
}

/* super hacky, may not work */
function text(node) {
  if (node.letter) return node.letter;
  if (node.ctrlSeq === "\\cdot ") return "*";
  if (node.blocks) {
    switch (node.ctrlSeq) {
      case "\\sqrt":
        return "sqrt(" + text(node.blocks[0]) + ")";
      case "\\frac":
        return (
          "(" + text(node.blocks[0]) + ") / (" + text(node.blocks[1]) + ")"
        );
      case "_{...}^{...}":
        return "^(" + text(node.blocks[0]) + ")";
      case "\\left(":
        return "(" + text(node.blocks[0]) + ")";
      case "\\left|":
        return "abs(" + text(node.blocks[0]) + ")";
    }
  }

  const finalLatex = node.foldChildren(
    node.ctrlSeq || "",
    (latex, child) => latex + text(child),
  );

  return finalLatex;
}
