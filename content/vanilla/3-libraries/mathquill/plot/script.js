import * as Plot from "@observablehq/plot";
import { evaluateTex } from "https://esm.sh/tex-math-parser";
// Any function (x: number) => number
const f = (x) => Math.sin(x) + 0.2 * x;
const mathFieldSpan = document.getElementById("math-field");
const latexSpan = document.getElementById("latex");
const MQ = MathQuill.getInterface(2); // for backcompat
const mathField = MQ.MathField(mathFieldSpan, {
    handlers: {
        edit: () => {
            mathField.latex(); // simple API
        },
    },
    spaceBehavesLikeTab: true, // configurable
});
function plotFunction(f, { xmin = -10, xmax = 10, samples = 1000, width = 800, height = 400 } = {}) {
    // Sample the function into points
    const data = Array.from({ length: samples + 1 }, (_, i) => {
        const x = xmin + (i / samples) * (xmax - xmin);
        const y = f(x);
        return { x, y };
    })
        // Optional: avoid drawing through NaN/Infinity
        .filter((d) => Number.isFinite(d.y));
    return Plot.plot({
        grid: true,
        height,
        marks: [
            Plot.ruleY([0]), // x-axis line at y=0
            Plot.ruleX([0]), // y-axis line at x=0
            Plot.line(data, { x: "x", y: "y" }),
        ],
        width,
        x: { domain: [xmin, xmax], label: "x" },
        y: { label: "f(x)" },
    });
}
const chartEl = document.getElementById("chart");
chartEl.append(plotFunction(f, { samples: 1500, xmax: 12, xmin: -12 }));
//# sourceMappingURL=script.js.map