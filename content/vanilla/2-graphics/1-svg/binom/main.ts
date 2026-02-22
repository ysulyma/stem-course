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
function generateAllPaths(n: number): number[][] {
  const results: number[][] = [];
  for (let i = 0; i < 1 << n; i++) {
    const path: number[] = [];
    for (let j = n - 1; j >= 0; j--) path.push((i >> j) & 1);
    results.push(path);
  }
  return results;
}

// Convert path to TeX string like "x^2y" or "xyx" (ungrouped)
function pathToTeX(path: number[]): string {
  return path.map((s) => (s === 1 ? "x" : "y")).join("");
}

// Count x's in path (for grouping by k)
function countY(path: number[]): number {
  return path.filter((s) => s === 0).length;
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
  const pathElements: SVGPathElement[] = [];

  // Draw all paths
  allPaths.forEach((p, idx) => {
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    let d = `M ${startX} ${startY}`;
    let x = startX,
      y = startY;
    for (const step of p) {
      x += stepX;
      if (step === 1) y -= stepY;
      d += ` L ${x} ${y}`;
    }
    pathEl.setAttribute("d", d);
    pathEl.classList.add("path");
    pathEl.dataset.idx = String(idx);
    pathEl.dataset.k = String(countY(p));
    svg.appendChild(pathEl);
    pathElements.push(pathEl);
  });

  // Y-axis labels
  for (let k = 0; k <= n; k++) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const yPos = startY - (n - k) * stepY;
    text.setAttribute("x", String(W - MARGIN + 10));
    text.setAttribute("y", String(yPos + 5));
    text.classList.add("axis-label");
    text.textContent = termTeX(n, k).replace(
      /\^(\d+)/g,
      (_, p) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[p] || `^${p}`,
    );
    text.dataset.k = String(k);
    svg.appendChild(text);
  }

  // Build equation display
  equationEl.innerHTML = "";

  const lhs = document.createElement("span");
  katex.render(`(x + y)^${n} = `, lhs);
  equationEl.appendChild(lhs);

  const isSquare = n > 1 && Number.isInteger(Math.sqrt(1 << n));
  const ungroupedTerms: HTMLElement[] = [];

  if (isSquare) {
    // Matrix layout for ungrouped terms
    const cols = Math.sqrt(1 << n);
    const grid = document.createElement("div");
    grid.className = "ungrouped-grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, auto)`;

    allPaths.forEach((p, idx) => {
      const cell = document.createElement("span");
      cell.className = "ungrouped-term";
      cell.dataset.idx = String(idx);
      cell.dataset.k = String(countY(p));
      katex.render(pathToTeX(p), cell);
      grid.appendChild(cell);
      ungroupedTerms.push(cell);
    });
    equationEl.appendChild(grid);
  } else {
    // Single line for non-square (including n=1)
    const line = document.createElement("span");
    line.className = "ungrouped-line";
    allPaths.forEach((p, idx) => {
      if (idx > 0) line.appendChild(document.createTextNode(" + "));
      const span = document.createElement("span");
      span.className = "ungrouped-term";
      span.dataset.idx = String(idx);
      span.dataset.k = String(countY(p));
      katex.render(pathToTeX(p), span);
      line.appendChild(span);
      ungroupedTerms.push(span);
    });
    equationEl.appendChild(line);
  }

  // Second line: grouped expression
  const grouped = document.createElement("div");
  grouped.className = "grouped-line";
  const eq2 = document.createElement("span");
  katex.render("= ", eq2);
  grouped.appendChild(eq2);

  const groupedTerms: HTMLElement[] = [];
  for (let k = 0; k <= n; k++) {
    if (k > 0) grouped.appendChild(document.createTextNode(" + "));
    const span = document.createElement("span");
    span.className = "grouped-term";
    span.dataset.k = String(k);
    katex.render(termTeX(n, k), span);
    grouped.appendChild(span);
    groupedTerms.push(span);
  }
  equationEl.appendChild(grouped);

  // Hover logic
  function highlightPath(idx: string | null) {
    pathElements.forEach((p, i) => {
      p.classList.toggle("highlight", idx !== null && String(i) === idx);
    });
  }

  function highlightGroup(k: string | null) {
    pathElements.forEach((p) => {
      p.classList.toggle("highlight", k !== null && p.dataset.k === k);
    });
    ungroupedTerms.forEach((el) => {
      el.classList.toggle("active", k !== null && el.dataset.k === k);
    });
    groupedTerms.forEach((el) => {
      el.classList.toggle("active", k !== null && el.dataset.k === k);
    });
    svg.querySelectorAll(".axis-label").forEach((el) => {
      (el as SVGElement).classList.toggle(
        "active",
        k !== null && (el as SVGElement).dataset.k === k,
      );
    });
  }

  // Ungrouped terms: hover highlights single path
  ungroupedTerms.forEach((el) => {
    el.addEventListener("mouseenter", () => highlightPath(el.dataset.idx!));
    el.addEventListener("mouseleave", () => highlightPath(null));
  });

  // Grouped terms: hover highlights all matching ungrouped + paths
  groupedTerms.forEach((el) => {
    el.addEventListener("mouseenter", () => highlightGroup(el.dataset.k!));
    el.addEventListener("mouseleave", () => highlightGroup(null));
  });

  // Axis labels: same as grouped
  svg.querySelectorAll(".axis-label").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      highlightGroup((el as SVGElement).dataset.k!),
    );
    el.addEventListener("mouseleave", () => highlightGroup(null));
  });
}

slider.addEventListener("input", () => {
  const n = parseInt(slider.value);
  nValueEl.textContent = String(n);
  render(n);
});

window.addEventListener("load", () => render(3));
