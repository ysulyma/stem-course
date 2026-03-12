import type katexTypes from "katex";

declare const katex:  typeof katexTypes;

const svg = document.getElementById("svg") as unknown as SVGSVGElement;
const slider = document.getElementById("slider") as HTMLInputElement;
const nValueEl = document.getElementById("nValue")!;
const equationEl = document.getElementById("equation")!;

const W = 600,
  H = 400,
  MARGIN = 60;

// Soothing 7-color palette: COLORS[0] for x^n, COLORS[n] for y^n
const COLORS = [
  "#5b8c85", // teal
  "#7eb77f", // sage green
  "#6a7fdb", // periwinkle
  "#b565a7", // orchid
  "#4a90a4", // steel blue
  "#c9a227", // golden
  "#e07b53", // coral
];

function binomial(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}

// termTeX(n, xPow) - generates term with xPow x's and (n-xPow) y's
function termTeX(n: number, xPow: number): string {
  const yPow = n - xPow;
  const coef = binomial(n, xPow);
  let s = coef > 1 ? String(coef) : "";
  if (xPow > 0) s += xPow === 1 ? "x" : `x^${xPow}`;
  if (yPow > 0) s += yPow === 1 ? "y" : `y^${yPow}`;
  return s || "1";
}

// Generate all 2^n paths, each path is array of 0 (y/flat) or 1 (x/up)
// Ordered so xxx...x comes first (all 1s), then descending
function generateAllPaths(n: number): number[][] {
  const total = 2 ** n;
  const results: number[][] = [];
  for (let i = total - 1; i >= 0; i--) {
    const path: number[] = [];
    for (let j = n - 1; j >= 0; j--) path.push(Math.floor(i / 2 ** j) % 2);
    results.push(path);
  }
  return results;
}

// Convert path to TeX string like "xyx" (ungrouped)
function pathToTeX(path: number[]): string {
  return path.map((s) => (s === 1 ? "x" : "y")).join("");
}

// Count x's in path
function countX(path: number[]): number {
  return path.filter((s) => s === 1).length;
}

// Get color index: x^n -> 0, x^{n-1}y -> 1, ..., y^n -> n
function colorIndex(n: number, xCount: number): number {
  return n - xCount;
}

// Create SVG path d attribute from a path array
function pathToD(
  path: number[],
  startX: number,
  startY: number,
  stepX: number,
  stepY: number,
): string {
  let d = `M ${startX} ${startY}`;
  let x = startX,
    y = startY;
  for (const step of path) {
    x += stepX;
    if (step === 1) y -= stepY;
    d += ` L ${x} ${y}`;
  }
  return d;
}

function render(n: number) {
  svg.innerHTML = "";
  svg.setAttribute("width", String(W));
  svg.setAttribute("height", String(H));
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const stepX = (W - 2 * MARGIN) / n;
  const stepY = (H - 2 * MARGIN) / n;
  const startX = MARGIN,
    startY = H - MARGIN;

  const allPaths = generateAllPaths(n);

  // Draw minimal grid
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.classList.add("grid");

  for (let col = 0; col < n; col++) {
    for (let row = 0; row <= col; row++) {
      const x1 = startX + col * stepX;
      const y1 = startY - row * stepY;
      // Flat edge (y move)
      const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line1.setAttribute("x1", String(x1));
      line1.setAttribute("y1", String(y1));
      line1.setAttribute("x2", String(x1 + stepX));
      line1.setAttribute("y2", String(y1));
      line1.classList.add("grid-line");
      gridGroup.appendChild(line1);
      // Up edge (x move)
      const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line2.setAttribute("x1", String(x1));
      line2.setAttribute("y1", String(y1));
      line2.setAttribute("x2", String(x1 + stepX));
      line2.setAttribute("y2", String(y1 - stepY));
      line2.classList.add("grid-line");
      gridGroup.appendChild(line2);
    }
  }
  svg.appendChild(gridGroup);

  // Y-axis labels: x^n at top (k=n x's), y^n at bottom (k=0 x's)
  for (let xPow = n; xPow >= 0; xPow--) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const yPos = startY - xPow * stepY;
    text.setAttribute("x", String(W - MARGIN + 10));
    text.setAttribute("y", String(yPos + 5));
    text.setAttribute("fill", COLORS[colorIndex(n, xPow)]);
    text.classList.add("axis-label");
    text.textContent = termTeX(n, xPow).replace(
      /\^(\d+)/g,
      (_, p) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[p] || `^${p}`,
    );
    text.dataset.xpow = String(xPow);
    svg.appendChild(text);
  }

  // Group to hold highlighted paths
  const highlightGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  highlightGroup.classList.add("highlight-group");
  svg.appendChild(highlightGroup);

  // Build equation display
  equationEl.innerHTML = "";

  let ungroupedTeX: string;
  if (n === 1) {
    const terms = allPaths.map((p, idx) => {
      const xPow = countX(p);
      return `\\htmlClass{ungrouped-term ungrouped-${idx}}{\\color{${COLORS[colorIndex(n, xPow)]}}{${pathToTeX(p)}}}`;
    });
    ungroupedTeX = `\\sum\\left(${terms.join(" + ")}\\right)`;
  } else {
    const numRows = 2 ** Math.floor(n / 2);
    const numCols = 2 ** Math.ceil(n / 2);
    const rows: string[] = [];
    for (let r = 0; r < numRows; r++) {
      const rowTerms: string[] = [];
      for (let c = 0; c < numCols; c++) {
        const idx = r * numCols + c;
        const xPow = countX(allPaths[idx]);
        rowTerms.push(
          `\\htmlClass{ungrouped-term ungrouped-${idx}}{\\color{${COLORS[colorIndex(n, xPow)]}}{${pathToTeX(allPaths[idx])}}}`,
        );
      }
      rows.push(rowTerms.join(" & "));
    }
    ungroupedTeX = `\\sum\\left(\\begin{array}{${"c".repeat(numCols)}}${rows.join(" \\\\ ")}\\end{array}\\right)`;
  }

  // Grouped terms: x^n first (xPow=n), y^n last (xPow=0)
  const groupedTermsTeX: string[] = [];
  for (let xPow = n; xPow >= 0; xPow--) {
    groupedTermsTeX.push(
      `\\htmlClass{grouped-term grouped-${xPow}}{\\color{${COLORS[colorIndex(n, xPow)]}}{${termTeX(n, xPow)}}}`,
    );
  }
  const groupedTeX = groupedTermsTeX.join(" + ");

  let fullTeX: string;
  if (n === 1) {
    fullTeX = `(x + y)^${n} = ${ungroupedTeX} = ${groupedTeX}`;
  } else {
    fullTeX = `\\begin{aligned}(x + y)^${n} &= ${ungroupedTeX} \\\\ &= ${groupedTeX}\\end{aligned}`;
  }

  katex.render(fullTeX, equationEl, { trust: true });

  // Hover: draw colored path on top
  function showPath(idx: number) {
    const path = allPaths[idx];
    const xPow = countX(path);
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathEl.setAttribute("d", pathToD(path, startX, startY, stepX, stepY));
    pathEl.setAttribute("stroke", COLORS[colorIndex(n, xPow)]);
    pathEl.classList.add("highlight-path");
    highlightGroup.appendChild(pathEl);
  }

  function showGroup(xPow: number) {
    allPaths.forEach((path, ) => {
      if (countX(path) === xPow) {
        const pathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        pathEl.setAttribute("d", pathToD(path, startX, startY, stepX, stepY));
        pathEl.setAttribute("stroke", COLORS[colorIndex(n, xPow)]);
        pathEl.classList.add("highlight-path");
        highlightGroup.appendChild(pathEl);
      }
    });
    // Highlight ungrouped terms
    allPaths.forEach((p, idx) => {
      const el = equationEl.querySelector(`.ungrouped-${idx}`);
      if (el) el.classList.toggle("active", countX(p) === xPow);
    });
    // Highlight grouped term
    for (let i = 0; i <= n; i++) {
      const el = equationEl.querySelector(`.grouped-${i}`);
      if (el) el.classList.toggle("active", i === xPow);
    }
    svg.querySelectorAll(".axis-label").forEach((el) => {
      (el as SVGElement).classList.toggle(
        "active",
        (el as SVGElement).dataset.xpow === String(xPow),
      );
    });
  }

  function clearHighlights() {
    highlightGroup.innerHTML = "";
    equationEl.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });
    svg.querySelectorAll(".axis-label.active").forEach((el) => {
      el.classList.remove("active");
    });
  }

  // Ungrouped terms: hover shows single path
  allPaths.forEach((_, idx) => {
    const el = equationEl.querySelector(`.ungrouped-${idx}`);
    if (el) {
      el.addEventListener("mouseenter", () => showPath(idx));
      el.addEventListener("mouseleave", clearHighlights);
    }
  });

  // Grouped terms: hover shows all matching paths
  for (let xPow = n; xPow >= 0; xPow--) {
    const el = equationEl.querySelector(`.grouped-${xPow}`);
    if (el) {
      const xPowVal = xPow;
      el.addEventListener("mouseenter", () => showGroup(xPowVal));
      el.addEventListener("mouseleave", clearHighlights);
    }
  }

  // Axis labels
  svg.querySelectorAll(".axis-label").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      showGroup(parseInt((el as SVGElement).dataset.xpow!, 10)),
    );
    el.addEventListener("mouseleave", clearHighlights);
  });
}

slider.addEventListener("input", () => {
  const n = slider.valueAsNumber;
  nValueEl.textContent = String(n);
  render(n);
});

window.addEventListener("load", () => render(3));
