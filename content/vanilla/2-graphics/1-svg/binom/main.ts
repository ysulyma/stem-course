declare const katex: {
  render: (tex: string, el: HTMLElement, opts?: object) => void;
};

const svg = document.getElementById("svg") as unknown as SVGSVGElement;
const slider = document.getElementById("slider") as HTMLInputElement;
const nValueEl = document.getElementById("nValue")!;
const equationEl = document.getElementById("equation")!;

const W = 600,
  H = 400,
  MARGIN = 60;

// Soothing 7-color palette for k=0 to k=6
const COLORS = [
  "#5b8c85", // teal
  "#7eb77f", // sage green
  "#c9a227", // golden
  "#e07b53", // coral
  "#b565a7", // orchid
  "#6a7fdb", // periwinkle
  "#4a90a4", // steel blue
];

function binomial(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}

function termTeX(n: number, k: number): string {
  const xPow = n - k,
    yPow = k;
  const coef = binomial(n, k);
  let s = coef > 1 ? String(coef) : "";
  if (xPow > 0) s += xPow === 1 ? "x" : `x^${xPow}`;
  if (yPow > 0) s += yPow === 1 ? "y" : `y^${yPow}`;
  return s || "1";
}

// Generate all 2^n paths, each path is array of 0 (y/flat) or 1 (x/up)
// Ordered so xxx...x comes first (all 1s), then descending
function generateAllPaths(n: number): number[][] {
  const results: number[][] = [];
  for (let i = (1 << n) - 1; i >= 0; i--) {
    const path: number[] = [];
    for (let j = n - 1; j >= 0; j--) path.push((i >> j) & 1);
    results.push(path);
  }
  return results;
}

// Convert path to TeX string like "xyx" (ungrouped)
function pathToTeX(path: number[]): string {
  return path.map((s) => (s === 1 ? "x" : "y")).join("");
}

// Count y's in path (for grouping by k)
function countY(path: number[]): number {
  return path.filter((s) => s === 0).length;
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

  // Draw minimal grid: horizontal and diagonal lines forming the lattice
  // We need n+1 horizontal levels and diagonal connections
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.classList.add("grid");

  // Draw grid edges - each node (i,j) connects to (i+1,j) [flat] and (i+1,j+1) [up]
  for (let col = 0; col < n; col++) {
    for (let row = 0; row <= col; row++) {
      const x1 = startX + col * stepX;
      const y1 = startY - row * stepY;
      // Flat edge (y move): go right
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
      // Up edge (x move): go right and up
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

  // Y-axis labels with colors
  for (let k = 0; k <= n; k++) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const yPos = startY - (n - k) * stepY;
    text.setAttribute("x", String(W - MARGIN + 10));
    text.setAttribute("y", String(yPos + 5));
    text.setAttribute("fill", COLORS[k]);
    text.classList.add("axis-label");
    text.textContent = termTeX(n, k).replace(
      /\^(\d+)/g,
      (_, p) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[p] || `^${p}`,
    );
    text.dataset.k = String(k);
    svg.appendChild(text);
  }

  // Group to hold highlighted paths (added/removed on hover)
  const highlightGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );
  highlightGroup.classList.add("highlight-group");
  svg.appendChild(highlightGroup);

  // Build equation display as single KaTeX expression
  equationEl.innerHTML = "";

  let ungroupedTeX: string;
  if (n === 1) {
    const terms = allPaths.map((p, idx) => {
      const k = countY(p);
      return `\\htmlClass{ungrouped-term ungrouped-${idx}}{\\color{${COLORS[k]}}{${pathToTeX(p)}}}`;
    });
    ungroupedTeX = `\\sum\\left(${terms.join(" + ")}\\right)`;
  } else {
    const numRows = 1 << Math.floor(n / 2);
    const numCols = 1 << Math.ceil(n / 2);
    const rows: string[] = [];
    for (let r = numRows - 1; r >= 0; r--) {
      const rowTerms: string[] = [];
      for (let c = numCols - 1; c >= 0; c--) {
        const idx = r * numCols + c;
        const k = countY(allPaths[idx]);
        rowTerms.push(
          `\\htmlClass{ungrouped-term ungrouped-${idx}}{\\color{${COLORS[k]}}{${pathToTeX(allPaths[idx])}}}`,
        );
      }
      rows.push(rowTerms.join(" & "));
    }
    ungroupedTeX = `\\sum\\left(\\begin{array}{${"c".repeat(numCols)}}${rows.join(" \\\\ ")}\\end{array}\\right)`;
  }

  const groupedTermsTeX: string[] = [];
  for (let k = 0; k <= n; k++) {
    groupedTermsTeX.push(
      `\\htmlClass{grouped-term grouped-${k}}{\\color{${COLORS[k]}}{${termTeX(n, k)}}}`,
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

  // Hover: draw colored path on top, remove on leave
  function showPath(idx: number) {
    const path = allPaths[idx];
    const k = countY(path);
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathEl.setAttribute("d", pathToD(path, startX, startY, stepX, stepY));
    pathEl.setAttribute("stroke", COLORS[k]);
    pathEl.classList.add("highlight-path");
    highlightGroup.appendChild(pathEl);
  }

  function showGroup(k: number) {
    allPaths.forEach((path, idx) => {
      if (countY(path) === k) {
        const pathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        pathEl.setAttribute("d", pathToD(path, startX, startY, stepX, stepY));
        pathEl.setAttribute("stroke", COLORS[k]);
        pathEl.classList.add("highlight-path");
        highlightGroup.appendChild(pathEl);
      }
    });
    // Highlight ungrouped terms
    allPaths.forEach((p, idx) => {
      const el = equationEl.querySelector(`.ungrouped-${idx}`);
      if (el) el.classList.toggle("active", countY(p) === k);
    });
    // Highlight grouped term
    for (let i = 0; i <= n; i++) {
      const el = equationEl.querySelector(`.grouped-${i}`);
      if (el) el.classList.toggle("active", i === k);
    }
    svg.querySelectorAll(".axis-label").forEach((el) => {
      (el as SVGElement).classList.toggle(
        "active",
        (el as SVGElement).dataset.k === String(k),
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
  for (let k = 0; k <= n; k++) {
    const el = equationEl.querySelector(`.grouped-${k}`);
    if (el) {
      const kVal = k;
      el.addEventListener("mouseenter", () => showGroup(kVal));
      el.addEventListener("mouseleave", clearHighlights);
    }
  }

  // Axis labels: same as grouped
  svg.querySelectorAll(".axis-label").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      showGroup(parseInt((el as SVGElement).dataset.k!)),
    );
    el.addEventListener("mouseleave", clearHighlights);
  });
}

slider.addEventListener("input", () => {
  const n = parseInt(slider.value);
  nValueEl.textContent = String(n);
  render(n);
});

window.addEventListener("load", () => render(3));
