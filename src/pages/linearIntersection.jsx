import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   Chart.js CDN loader
   ══════════════════════════════════════════════════════════════ */
function useChartJS(cb) {
  useEffect(() => {
    if (window.Chart) { cb(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = cb;
    document.head.appendChild(s);
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   Formato numérico y de ecuaciones
   ══════════════════════════════════════════════════════════════ */
const EPS = 1e-9;

function fmtNum(n) {
  if (Math.abs(n) < EPS) return "0";
  const r = Math.round(n * 10000) / 10000;
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function fmtEq(coefs, names, rhs) {
  let out = "";
  let any = false;
  for (let i = 0; i < coefs.length; i++) {
    const c = coefs[i];
    if (Math.abs(c) < EPS) continue;
    const abs = Math.abs(c);
    const sign = c < 0 ? "−" : "+";
    const mag = Math.abs(abs - 1) < EPS ? "" : fmtNum(abs);
    if (!any) { out += (c < 0 ? "−" : "") + mag + names[i]; any = true; }
    else out += ` ${sign} ${mag}${names[i]}`;
  }
  if (!any) out = "0";
  return `${out} = ${fmtNum(rhs)}`;
}

// Expresión despejada, normalizada para que el denominador salga siempre positivo
function fmtExpr(coefs, names, rhs, denom) {
  const sgn = denom < 0 ? -1 : 1;
  const dRhs = rhs * sgn, dDenom = denom * sgn;
  let inner = fmtNum(dRhs);
  for (let i = 0; i < coefs.length; i++) {
    const c = coefs[i] * sgn;
    if (Math.abs(c) < EPS) continue;
    const sign = c < 0 ? "+" : "−";
    const mag = Math.abs(Math.abs(c) - 1) < EPS ? "" : fmtNum(Math.abs(c));
    inner += ` ${sign} ${mag}${names[i]}`;
  }
  const div = Math.abs(dDenom - 1) < EPS ? "" : ` / ${fmtNum(dDenom)}`;
  return div ? `(${inner})${div}` : inner;
}

function rowOpText(rIdx, kIdx, factor) {
  if (factor >= 0) return `F${rIdx} = F${rIdx} − (${fmtNum(factor)})·F${kIdx}`;
  return `F${rIdx} = F${rIdx} + (${fmtNum(-factor)})·F${kIdx}`;
}

function getVarNames(n) {
  if (n === 2) return ["x", "y"];
  if (n === 3) return ["x", "y", "z"];
  return ["x₁", "x₂", "x₃", "x₄"];
}

function isValidNum(str) {
  const t = (str ?? "").trim();
  if (t === "") return false;
  return Number.isFinite(Number(t));
}

function defaultSystem(n) {
  if (n === 2) return { matrix: [["2", "1"], ["1", "-1"]], consts: ["5", "1"] };
  if (n === 3) return { matrix: [["2", "1", "-1"], ["-3", "-1", "2"], ["-2", "1", "2"]], consts: ["8", "-11", "-3"] };
  return {
    matrix: [["1", "1", "1", "1"], ["2", "1", "-1", "1"], ["1", "-2", "3", "-1"], ["-1", "1", "2", "-1"]],
    consts: ["10", "5", "2", "3"],
  };
}

function toRows(A, b) { return A.map((coeffs, i) => ({ coeffs: coeffs.slice(), rhs: b[i] })); }

/* ══════════════════════════════════════════════════════════════
   Solución de referencia — Gauss-Jordan con pivoteo parcial
   Clasifica: unique | none | infinite
   ══════════════════════════════════════════════════════════════ */
function gaussSolve(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);
  let rank = 0;
  for (let col = 0; col < n && rank < n; col++) {
    let piv = rank;
    for (let r = rank + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < EPS) continue;
    [M[rank], M[piv]] = [M[piv], M[rank]];
    for (let r = 0; r < n; r++) {
      if (r === rank) continue;
      const factor = M[r][col] / M[rank][col];
      if (Math.abs(factor) < EPS) continue;
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[rank][c];
    }
    rank++;
  }
  for (let r = rank; r < n; r++) if (Math.abs(M[r][n]) > EPS) return { type: "none" };
  if (rank < n) return { type: "infinite" };
  const x = new Array(n).fill(0);
  for (let i = 0; i < n; i++)
    for (let c = 0; c < n; c++)
      if (Math.abs(M[i][c]) > EPS) { x[c] = M[i][n] / M[i][c]; break; }
  return { type: "unique", x };
}

/* ══════════════════════════════════════════════════════════════
   MÉTODO 1 — REDUCCIÓN
   Eliminación gaussiana hacia adelante (combinación lineal de
   ecuaciones) + sustitución hacia atrás.
   ══════════════════════════════════════════════════════════════ */
function buildReduccion(A, b, names) {
  const n = A.length;
  const M = A.map((r) => r.slice());
  const rhs = b.slice();
  const steps = [];
  steps.push({ label: "Sistema original", lines: M.map((row, i) => `Ec.${i + 1}:  ${fmtEq(row, names, rhs[i])}`) });

  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let r = k + 1; r < n; r++) if (Math.abs(M[r][k]) > Math.abs(M[piv][k])) piv = r;
    if (Math.abs(M[piv][k]) < EPS) {
      steps.push({ label: "Sistema singular", lines: [`No hay pivote disponible para ${names[k]} — este camino de reducción no continúa.`] });
      return { steps, x: null, singular: true };
    }
    if (piv !== k) {
      [M[k], M[piv]] = [M[piv], M[k]];
      [rhs[k], rhs[piv]] = [rhs[piv], rhs[k]];
      steps.push({ label: "Intercambio de filas", lines: [`F${k + 1} ↔ F${piv + 1}  (mayor pivote para ${names[k]})`] });
    }
    const lines = [];
    for (let r = k + 1; r < n; r++) {
      const factor = M[r][k] / M[k][k];
      if (Math.abs(factor) < EPS) continue;
      for (let c = k; c < n; c++) M[r][c] -= factor * M[k][c];
      rhs[r] -= factor * rhs[k];
      lines.push(`${rowOpText(r + 1, k + 1, factor)}  →  ${fmtEq(M[r], names, rhs[r])}`);
    }
    if (lines.length) steps.push({ label: `Eliminar ${names[k]}  (columna ${k + 1})`, lines });
  }

  const x = new Array(n).fill(0);
  const backLines = [];
  for (let i = n - 1; i >= 0; i--) {
    let sum = rhs[i];
    for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
    x[i] = sum / M[i][i];
    backLines.push(`${names[i]} = ${fmtExpr(M[i].slice(i + 1), names.slice(i + 1), rhs[i], M[i][i])} = ${fmtNum(x[i])}`);
  }
  steps.push({ label: "Sustitución hacia atrás", lines: backLines });
  return { steps, x, singular: false };
}

/* ══════════════════════════════════════════════════════════════
   MÉTODO 2 — SUSTITUCIÓN
   Aísla una variable en una ecuación y la sustituye de inmediato
   en TODAS las demás; recurre sobre el sistema más pequeño.
   ══════════════════════════════════════════════════════════════ */
function buildSustitucion(rows, varIdx, names) {
  const m = rows.length;
  if (m === 1) {
    if (Math.abs(rows[0].coeffs[0]) < EPS) {
      return { steps: [{ label: "Sistema singular", lines: [`No es posible aislar ${names[varIdx[0]]}: coeficiente 0.`] }], solution: null, singular: true };
    }
    const v = rows[0].rhs / rows[0].coeffs[0];
    return {
      steps: [{ label: "Última variable", lines: [`${names[varIdx[0]]} = ${fmtNum(rows[0].rhs)} / ${fmtNum(rows[0].coeffs[0])} = ${fmtNum(v)}`] }],
      solution: { [varIdx[0]]: v }, singular: false,
    };
  }
  let srcI = 0;
  for (let i = 1; i < m; i++) if (Math.abs(rows[i].coeffs[0]) > Math.abs(rows[srcI].coeffs[0])) srcI = i;
  const src = rows[srcI];
  if (Math.abs(src.coeffs[0]) < EPS) {
    return { steps: [{ label: "Sistema singular", lines: [`Ninguna ecuación permite aislar ${names[varIdx[0]]}.`] }], solution: null, singular: true };
  }
  const restNames = varIdx.slice(1).map((i) => names[i]);
  const isolateLine = `Despejamos ${names[varIdx[0]]}:  ${names[varIdx[0]]} = ${fmtExpr(src.coeffs.slice(1), restNames, src.rhs, src.coeffs[0])}`;

  const newRows = [];
  const subLines = [];
  for (let i = 0; i < m; i++) {
    if (i === srcI) continue;
    const o = rows[i];
    const factor = o.coeffs[0] / src.coeffs[0];
    const coeffs = [];
    for (let j = 1; j < src.coeffs.length; j++) coeffs.push(o.coeffs[j] - factor * src.coeffs[j]);
    const rhs = o.rhs - factor * src.rhs;
    newRows.push({ coeffs, rhs });
    subLines.push(`Sustituimos en otra ecuación  →  ${fmtEq(coeffs, restNames, rhs)}`);
  }
  const forwardStep = { label: `Aislar y sustituir ${names[varIdx[0]]}`, lines: [isolateLine, ...subLines] };
  const inner = buildSustitucion(newRows, varIdx.slice(1), names);
  if (inner.singular) return { steps: [forwardStep, ...inner.steps], solution: null, singular: true };

  let sum = src.rhs;
  for (let j = 1; j < src.coeffs.length; j++) sum -= src.coeffs[j] * inner.solution[varIdx[j]];
  const v0 = sum / src.coeffs[0];
  const backStep = { label: `Volver a ${names[varIdx[0]]}`, lines: [`${names[varIdx[0]]} = ${fmtExpr(src.coeffs.slice(1), restNames, src.rhs, src.coeffs[0])} = ${fmtNum(v0)}`] };
  return { steps: [forwardStep, ...inner.steps, backStep], solution: { [varIdx[0]]: v0, ...inner.solution }, singular: false };
}

/* ══════════════════════════════════════════════════════════════
   MÉTODO 3 — IGUALACIÓN
   Aísla la MISMA variable en cada ecuación e iguala las
   expresiones dos a dos; recurre sobre el sistema más pequeño.
   ══════════════════════════════════════════════════════════════ */
function buildIgualacion(rows, varIdx, names) {
  const m = rows.length;
  if (m === 1) {
    if (Math.abs(rows[0].coeffs[0]) < EPS) {
      return { steps: [{ label: "Sistema singular", lines: [`No es posible aislar ${names[varIdx[0]]}: coeficiente 0.`] }], solution: null, singular: true };
    }
    const v = rows[0].rhs / rows[0].coeffs[0];
    return {
      steps: [{ label: "Última variable", lines: [`${names[varIdx[0]]} = ${fmtNum(rows[0].rhs)} / ${fmtNum(rows[0].coeffs[0])} = ${fmtNum(v)}`] }],
      solution: { [varIdx[0]]: v }, singular: false,
    };
  }
  let refI = 0;
  for (let i = 1; i < m; i++) if (Math.abs(rows[i].coeffs[0]) > Math.abs(rows[refI].coeffs[0])) refI = i;
  const ref = rows[refI];
  if (Math.abs(ref.coeffs[0]) < EPS) {
    return { steps: [{ label: "Sistema singular", lines: [`Ninguna ecuación permite aislar ${names[varIdx[0]]}.`] }], solution: null, singular: true };
  }
  const restNames = varIdx.slice(1).map((i) => names[i]);
  const lines = [`Despejamos ${names[varIdx[0]]} en cada ecuación:`];
  const eqLabels = [];
  for (let i = 0; i < m; i++) {
    const label = String.fromCharCode(65 + i);
    eqLabels.push(label);
    const line = Math.abs(rows[i].coeffs[0]) < EPS
      ? `  ${label})  (el coeficiente de ${names[varIdx[0]]} es 0 aquí — no se puede despejar)`
      : `  ${label})  ${names[varIdx[0]]} = ${fmtExpr(rows[i].coeffs.slice(1), restNames, rows[i].rhs, rows[i].coeffs[0])}`;
    lines.push(line);
  }
  lines.push("Igualamos las expresiones:");
  const newRows = [];
  for (let i = 0; i < m; i++) {
    if (i === refI) continue;
    const o = rows[i];
    const coeffs = [];
    for (let j = 1; j < ref.coeffs.length; j++) coeffs.push(ref.coeffs[0] * o.coeffs[j] - o.coeffs[0] * ref.coeffs[j]);
    const rhs = ref.coeffs[0] * o.rhs - o.coeffs[0] * ref.rhs;
    newRows.push({ coeffs, rhs });
    lines.push(`  ${eqLabels[refI]} = ${eqLabels[i]}  →  ${fmtEq(coeffs, restNames, rhs)}`);
  }
  const forwardStep = { label: `Igualar expresiones de ${names[varIdx[0]]}`, lines };
  const inner = buildIgualacion(newRows, varIdx.slice(1), names);
  if (inner.singular) return { steps: [forwardStep, ...inner.steps], solution: null, singular: true };

  let sum = ref.rhs;
  for (let j = 1; j < ref.coeffs.length; j++) sum -= ref.coeffs[j] * inner.solution[varIdx[j]];
  const v0 = sum / ref.coeffs[0];
  const backStep = { label: `Volver a ${names[varIdx[0]]}`, lines: [`${names[varIdx[0]]} = ${fmtExpr(ref.coeffs.slice(1), restNames, ref.rhs, ref.coeffs[0])} = ${fmtNum(v0)}`] };
  return { steps: [forwardStep, ...inner.steps, backStep], solution: { [varIdx[0]]: v0, ...inner.solution }, singular: false };
}

/* ══════════════════════════════════════════════════════════════
   MÉTODO 4 — GRÁFICO
   n = 2 → las dos rectas exactas.
   n > 2 → corte 2D: se fijan las demás variables en el valor de
   la solución y se grafican las rectas resultantes en el plano
   de las dos variables elegidas (todas pasan por la solución).
   ══════════════════════════════════════════════════════════════ */
const LINE_COLORS = ["#f97316", "#38bdf8", "#22c55e", "#f472b6"];
let sliceChartInst = null;

function computeRange(lines, px, py) {
  let R = 8;
  const consider = (v) => { if (Number.isFinite(v)) R = Math.max(R, Math.abs(v)); };
  consider(px); consider(py);
  for (const { a, b, c } of lines) {
    if (Math.abs(b) > EPS) consider(c / b);
    if (Math.abs(a) > EPS) consider(c / a);
  }
  return Math.min(200, Math.ceil(R * 1.5));
}

function renderSliceChart(canvasRef, n, equations, pIdx, qIdx, fixedSolution, names) {
  if (!canvasRef.current || !window.Chart) return;

  const lines = equations.map((eq) => {
    let c = eq.rhs;
    for (let k = 0; k < n; k++) {
      if (k === pIdx || k === qIdx) continue;
      c -= eq.coeffs[k] * (fixedSolution ? fixedSolution[k] : 0);
    }
    return { a: eq.coeffs[pIdx], b: eq.coeffs[qIdx], c };
  });

  const solP = fixedSolution ? fixedSolution[pIdx] : undefined;
  const solQ = fixedSolution ? fixedSolution[qIdx] : undefined;
  const R = computeRange(lines, solP, solQ);
  const xs = [];
  for (let x = -R; x <= R; x += R / 60) xs.push(parseFloat(x.toFixed(3)));

  const datasets = lines
    .map(({ a, b, c }, i) => {
      const color = LINE_COLORS[i % LINE_COLORS.length];
      const dash = i >= 2 ? { borderDash: [7, 4] } : {};
      if (Math.abs(b) < EPS) {
        if (Math.abs(a) < EPS) return null; // esta ecuación no depende de ninguno de los dos ejes elegidos
        const xConst = c / a;
        return { label: `Ec.${i + 1}`, data: [{ x: xConst, y: -R }, { x: xConst, y: R }], borderColor: color, borderWidth: 2.5, pointRadius: 0, tension: 0, order: i + 1, ...dash };
      }
      const data = xs.map((x) => ({ x, y: (c - a * x) / b }));
      return { label: `Ec.${i + 1}`, data, borderColor: color, borderWidth: 2.5, pointRadius: 0, tension: 0, order: i + 1, ...dash };
    })
    .filter(Boolean);

  const ptDataset = fixedSolution ? [{
    label: "Solución", data: [{ x: solP, y: solQ }], type: "scatter",
    pointRadius: 9, pointHoverRadius: 11, pointBackgroundColor: "rgba(167,139,250,0.25)",
    pointBorderColor: "#a78bfa", pointBorderWidth: 2.5, showLine: false, order: 0,
  }] : [];

  const gridC = "rgba(148,163,184,0.1)", axisC = "rgba(148,163,184,0.5)", tickC = "rgba(148,163,184,0.65)";
  const axisPlugin = {
    id: "axes",
    afterDraw(chart) {
      const ctx = chart.ctx, xsc = chart.scales.x, ysc = chart.scales.y;
      const x0 = xsc.getPixelForValue(0), y0 = ysc.getPixelForValue(0);
      ctx.save(); ctx.strokeStyle = axisC; ctx.lineWidth = 2;
      if (y0 >= ysc.top && y0 <= ysc.bottom) {
        ctx.beginPath(); ctx.moveTo(xsc.left, y0); ctx.lineTo(xsc.right, y0); ctx.stroke();
        ctx.fillStyle = tickC; ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
        ctx.fillText(names[pIdx], xsc.right + 12, y0 + 4);
      }
      if (x0 >= xsc.left && x0 <= xsc.right) {
        ctx.beginPath(); ctx.moveTo(x0, ysc.top); ctx.lineTo(x0, ysc.bottom); ctx.stroke();
        ctx.fillStyle = tickC; ctx.font = "bold 11px monospace"; ctx.textAlign = "left";
        ctx.fillText(names[qIdx], x0 + 4, ysc.top - 6);
      }
      ctx.restore();
    },
  };

  if (sliceChartInst) { sliceChartInst.destroy(); sliceChartInst = null; }
  sliceChartInst = new window.Chart(canvasRef.current, {
    type: "line", plugins: [axisPlugin],
    data: { datasets: [...datasets, ...ptDataset] },
    options: {
      responsive: true, maintainAspectRatio: false, parsing: false, animation: { duration: 450 },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "rgba(2,6,23,0.92)", titleColor: "#94a3b8", bodyColor: "#e2e8f0", borderColor: "rgba(148,163,184,0.2)", borderWidth: 1, callbacks: { label: (c) => `(${fmtNum(c.raw.x)}, ${fmtNum(c.raw.y)})` } },
      },
      scales: {
        x: { type: "linear", min: -R, max: R, grid: { color: (c) => (c.tick.value === 0 ? "transparent" : gridC) }, border: { display: false }, ticks: { color: tickC, font: { size: 10, family: "monospace" }, maxTicksLimit: 12 } },
        y: { type: "linear", min: -R, max: R, grid: { color: (c) => (c.tick.value === 0 ? "transparent" : gridC) }, border: { display: false }, ticks: { color: tickC, font: { size: 10, family: "monospace" }, maxTicksLimit: 12 } },
      },
    },
  });
}

/* ══════════════════════════════════════════════════════════════
   Typewriter — revela los pasos carácter por carácter
   ══════════════════════════════════════════════════════════════ */
function useTypewriter(steps, active, onDone) {
  const [rendered, setRendered] = useState([]);
  const timerRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || !steps || !steps.length) return;
    doneRef.current = false;
    setRendered([]);
    const pos = { si: 0, li: 0, ci: 0 };

    function advance() {
      if (doneRef.current) return;
      const step = steps[pos.si];
      if (!step) { doneRef.current = true; onDone(); return; }
      const chars = [...(step.lines[pos.li] ?? "")];

      setRendered((prev) => {
        const next = [...prev];
        if (!next[pos.si]) next[pos.si] = { label: step.label, lines: [] };
        const lines = [...next[pos.si].lines];
        if (lines[pos.li] === undefined) lines[pos.li] = "";
        next[pos.si] = { ...next[pos.si], lines };
        return next;
      });

      if (pos.ci < chars.length) {
        const si = pos.si, li = pos.li, ch = chars[pos.ci];
        setRendered((prev) => {
          const next = [...prev];
          const lines = [...(next[si]?.lines ?? [])];
          lines[li] = (lines[li] ?? "") + ch;
          next[si] = { ...next[si], lines };
          return next;
        });
        pos.ci++;
        timerRef.current = setTimeout(advance, 8 + Math.random() * 10);
      } else {
        pos.li++; pos.ci = 0;
        if (pos.li >= step.lines.length) {
          pos.li = 0; pos.si++;
          if (pos.si >= steps.length) { doneRef.current = true; onDone(); return; }
          timerRef.current = setTimeout(advance, 220);
        } else {
          timerRef.current = setTimeout(advance, 40);
        }
      }
    }

    timerRef.current = setTimeout(advance, 150);
    return () => { clearTimeout(timerRef.current); doneRef.current = true; };
  }, [active, steps]);

  return rendered;
}

/* ══════════════════════════════════════════════════════════════
   Panel de método (terminal con typewriter + resultado)
   ══════════════════════════════════════════════════════════════ */
function MethodPanel({ title, subtitle, accent, dot, steps, active, onDone, names, solution, singular, empty }) {
  const bodyRef = useRef(null);
  const rendered = useTypewriter(steps, active, onDone || (() => {}));

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [rendered]);

  const isTyping = active && (rendered.length < (steps?.length || 0) ||
    (rendered[(steps?.length || 1) - 1]?.lines?.join("").length < steps?.[steps.length - 1]?.lines?.join("").length));

  return (
    <div style={s.quadCard}>
      <div style={{ ...s.quadHeader, borderBottomColor: `${accent}33` }}>
        <span style={{ ...s.quadDot, background: dot }} />
        <div>
          <div style={{ ...s.quadTitle, color: accent }}>{title}</div>
          <div style={s.quadSubtitle}>{subtitle}</div>
        </div>
        {isTyping && <span style={{ ...s.pulseDot, background: accent }} />}
      </div>

      {empty ? (
        <div style={s.quadEmpty}>Ingresa el sistema y presiona “Resolver sistema” para ver este método.</div>
      ) : (
        <>
          <div ref={bodyRef} style={s.quadBody}>
            {rendered.map((step, si) => (
              <div key={si} style={s.logStep}>
                <div style={{ ...s.logStepLabel, color: accent }}>{step.label}</div>
                {step.lines.map((line, li) => (
                  <div key={li} style={s.logLine}>
                    <span style={{ ...s.logPrompt, color: accent }}>›</span>
                    <span style={{ whiteSpace: "pre-wrap" }}>
                      {line}
                      {si === rendered.length - 1 && li === step.lines.length - 1 && isTyping && <span style={s.cursor}>▍</span>}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {!isTyping && !singular && solution && (
            <div style={{ ...s.quadResult, borderTopColor: `${accent}33` }}>
              {names.map((nm, i) => (
                <span key={i} style={s.quadResultChip}>
                  <span style={{ color: accent }}>{nm}</span> = {fmtNum(solution[i])}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Panel gráfico
   ══════════════════════════════════════════════════════════════ */
function GraphPanel({ n, names, equations, groundTruth, axisP, axisQ, setAxisP, setAxisQ, cjsReady, solved }) {
  const canvasRef = useRef(null);
  const accent = "#a78bfa";
  const canPlot = solved && (n === 2 || groundTruth?.type === "unique");

  useEffect(() => {
    if (!canPlot || !cjsReady) return;
    const t = setTimeout(() => renderSliceChart(canvasRef, n, equations, axisP, axisQ, groundTruth?.x || null, names), 60);
    return () => clearTimeout(t);
  }, [canPlot, cjsReady, axisP, axisQ, n, equations, groundTruth, names]);

  const subtitle = n === 2 ? "Intersección de dos rectas" : `Corte 2D fijando las demás variables`;

  return (
    <div style={s.quadCard}>
      <div style={{ ...s.quadHeader, borderBottomColor: `${accent}33` }}>
        <span style={{ ...s.quadDot, background: accent }} />
        <div>
          <div style={{ ...s.quadTitle, color: accent }}>Método gráfico</div>
          <div style={s.quadSubtitle}>{subtitle}</div>
        </div>
      </div>

      {n > 2 && (
        <div style={s.axisRow}>
          <label style={s.axisLabel}>
            Eje horizontal
            <select style={s.axisSelect} value={axisP} onChange={(e) => setAxisP(Number(e.target.value))}>
              {names.map((nm, i) => i === axisQ ? null : <option key={i} value={i}>{nm}</option>)}
            </select>
          </label>
          <label style={s.axisLabel}>
            Eje vertical
            <select style={s.axisSelect} value={axisQ} onChange={(e) => setAxisQ(Number(e.target.value))}>
              {names.map((nm, i) => i === axisP ? null : <option key={i} value={i}>{nm}</option>)}
            </select>
          </label>
        </div>
      )}

      {!solved ? (
        <div style={s.quadEmpty}>Ingresa el sistema y presiona “Resolver sistema” para ver la gráfica.</div>
      ) : !canPlot ? (
        <div style={s.quadEmpty}>
          El corte 2D necesita una solución única para fijar las demás variables. Este sistema es {groundTruth?.type === "none" ? "inconsistente (sin solución)." : "dependiente (infinitas soluciones)."}
        </div>
      ) : (
        <>
          <div style={s.legendRow}>
            {equations.map((_, i) => (
              <span key={i} style={s.legItem}>
                <span style={{ ...s.legLine, background: LINE_COLORS[i % LINE_COLORS.length], ...(i >= 2 ? { background: "transparent", borderTop: `2.5px dashed ${LINE_COLORS[i % LINE_COLORS.length]}`, height: 0 } : {}) }} />
                Ec.{i + 1}
              </span>
            ))}
            {groundTruth?.x && <span style={s.legItem}><span style={s.legDot} />({fmtNum(groundTruth.x[axisP])}, {fmtNum(groundTruth.x[axisQ])})</span>}
          </div>
          <div style={s.chartWrap}>
            <canvas ref={canvasRef} role="img" aria-label="Gráfica del sistema" />
          </div>
          {n > 2 && <p style={s.graphNote}>Todas las ecuaciones se evalúan fijando {names.filter((_, i) => i !== axisP && i !== axisQ).join(", ")} en el valor de la solución, así que las {equations.length} rectas de este corte se cruzan exactamente en ese punto.</p>}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Input de coeficiente
   ══════════════════════════════════════════════════════════════ */
function Cell({ value, onChange, placeholder, invalid, width }) {
  return (
    <input
      type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...s.coeff, width, ...(invalid ? s.coeffInvalid : null) }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   Panel central — selector de tamaño + inputs + resumen
   ══════════════════════════════════════════════════════════════ */
function CenterPanel({ n, onSizeChange, matrix, consts, onCell, onConst, valid, onSolve, solved, groundTruth, names }) {
  const inputW = n === 4 ? 44 : n === 3 ? 54 : 62;
  const gap = n === 4 ? 6 : 8;

  return (
    <div style={s.centerWrap}>
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Sistema de Ecuaciones Lineales</h1>
          <p style={s.subtitle}>4 métodos de resolución, lado a lado</p>
        </div>
        <select style={s.sizeSelect} value={n} onChange={(e) => onSizeChange(Number(e.target.value))}>
          <option value={2}>2 × 2</option>
          <option value={3}>3 × 3</option>
          <option value={4}>4 × 4</option>
        </select>
      </div>

      <div style={s.card}>
        <p style={s.cardLabel}>Coeficientes</p>
        {matrix.map((row, i) => (
          <div key={i} style={{ ...s.eqRow, marginBottom: i === n - 1 ? 0 : 10 }}>
            <span style={s.eqTag}>Ec.{i + 1}</span>
            <div style={{ ...s.eqInline, gap }}>
              {row.map((val, j) => (
                <span key={j} style={s.eqInline}>
                  <Cell value={val} onChange={(v) => onCell(i, j, v)} placeholder={`a${j + 1}`} invalid={!isValidNum(val)} width={inputW} />
                  <span style={{ ...s.varLabel, color: LINE_COLORS[j % LINE_COLORS.length] }}>{names[j]}</span>
                  {j < n - 1 && <span style={s.op}>+</span>}
                </span>
              ))}
              <span style={s.eqSign}>=</span>
              <Cell value={consts[i]} onChange={(v) => onConst(i, v)} placeholder="k" invalid={!isValidNum(consts[i])} width={inputW} />
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSolve} disabled={!valid} style={{ ...s.btn, opacity: !valid ? 0.45 : 1 }}>
        Resolver sistema
      </button>
      {!valid && <p style={s.validHint}>Completa todos los coeficientes con números válidos.</p>}

      {solved && groundTruth && (
        <div style={s.summaryCard}>
          {groundTruth.type === "unique" && (
            <>
              <span style={{ ...s.resBadge, ...s.badgePoint }}>✦ Solución única</span>
              <div style={s.coordRow}>
                {names.map((nm, i) => (
                  <div key={i} style={s.coordBox}>
                    <div style={s.coordLabel}>{nm}</div>
                    <div style={s.coordVal}>{fmtNum(groundTruth.x[i])}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {groundTruth.type === "none" && <span style={{ ...s.resBadge, ...s.badgeNone }}>✕ Sin solución — sistema inconsistente</span>}
          {groundTruth.type === "infinite" && <span style={{ ...s.resBadge, ...s.badgeInf }}>∞ Infinitas soluciones — sistema dependiente</span>}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Componente principal
   ══════════════════════════════════════════════════════════════ */
export default function LinearSystemLab() {
  const [n, setN] = useState(2);
  const [matrix, setMatrix] = useState(defaultSystem(2).matrix);
  const [consts, setConsts] = useState(defaultSystem(2).consts);
  const [solved, setSolved] = useState(false);
  const [groundTruth, setGroundTruth] = useState(null);
  const [methodResults, setMethodResults] = useState(null);
  const [axisP, setAxisP] = useState(0);
  const [axisQ, setAxisQ] = useState(1);
  const [cjsReady, setCjsReady] = useState(false);
  useChartJS(() => setCjsReady(true));

  const names = getVarNames(n);
  const valid = matrix.every((row) => row.every(isValidNum)) && consts.every(isValidNum);

  function resetResults() { setSolved(false); setGroundTruth(null); setMethodResults(null); }

  function handleSizeChange(newN) {
    const d = defaultSystem(newN);
    setN(newN); setMatrix(d.matrix); setConsts(d.consts);
    setAxisP(0); setAxisQ(1);
    resetResults();
  }
  function handleCell(i, j, v) {
    setMatrix((prev) => prev.map((row, ri) => (ri === i ? row.map((c, ci) => (ci === j ? v : c)) : row)));
    resetResults();
  }
  function handleConst(i, v) {
    setConsts((prev) => prev.map((c, ci) => (ci === i ? v : c)));
    resetResults();
  }

  function handleSolve() {
    if (!valid) return;
    const A = matrix.map((row) => row.map(Number));
    const b = consts.map(Number);
    const idx = Array.from({ length: n }, (_, i) => i);
    const gt = gaussSolve(A, b);
    const red = buildReduccion(A, b, names);
    const sus = buildSustitucion(toRows(A, b), idx, names);
    const igu = buildIgualacion(toRows(A, b), idx, names);
    setGroundTruth(gt);
    setMethodResults({ reduccion: red, sustitucion: sus, igualacion: igu });
    setSolved(true);
  }

  const equations = matrix.map((row, i) => ({ coeffs: row.map(Number), rhs: Number(consts[i]) }));

  return (
    <div style={s.page}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        input[type=text]:focus, select:focus { outline:none; border-color:rgba(56,189,248,.5)!important; box-shadow:0 0 0 2px rgba(56,189,248,.12); }
        select { font-family:'Courier New', monospace; }
        .lsl-grid { display:grid; grid-template-columns: 1fr; gap:18px; grid-template-areas: "center" "tl" "tr" "bl" "br"; }
        @media (min-width: 1000px) {
          .lsl-grid { grid-template-columns: minmax(0,1fr) minmax(320px,440px) minmax(0,1fr); gap:22px; grid-template-areas: "tl center tr" "bl center br"; }
        }
        .lsl-tl { grid-area: tl; } .lsl-tr { grid-area: tr; } .lsl-bl { grid-area: bl; } .lsl-br { grid-area: br; } .lsl-center { grid-area: center; }
      `}</style>

      <div style={s.wrap}>
        <div className="lsl-grid">
          <div className="lsl-center" style={s.centerCell}>
            <CenterPanel
              n={n} onSizeChange={handleSizeChange} matrix={matrix} consts={consts}
              onCell={handleCell} onConst={handleConst} valid={valid} onSolve={handleSolve}
              solved={solved} groundTruth={groundTruth} names={names}
            />
          </div>

          <div className="lsl-tl">
            <MethodPanel
              title="Sustitución" subtitle="Aísla una variable y sustituye" accent="#2dd4bf" dot="#2dd4bf"
              steps={methodResults?.sustitucion.steps} active={solved} names={names}
              solution={methodResults?.sustitucion.solution} singular={methodResults?.sustitucion.singular}
              empty={!solved}
            />
          </div>
          <div className="lsl-tr">
            <MethodPanel
              title="Igualación" subtitle="Iguala expresiones de la misma variable" accent="#fbbf24" dot="#fbbf24"
              steps={methodResults?.igualacion.steps} active={solved} names={names}
              solution={methodResults?.igualacion.solution} singular={methodResults?.igualacion.singular}
              empty={!solved}
            />
          </div>
          <div className="lsl-bl">
            <MethodPanel
              title="Reducción" subtitle="Elimina variables por combinación lineal" accent="#38bdf8" dot="#38bdf8"
              steps={methodResults?.reduccion.steps} active={solved} names={names}
              solution={methodResults?.reduccion.x} singular={methodResults?.reduccion.singular}
              empty={!solved}
            />
          </div>
          <div className="lsl-br">
            <GraphPanel
              n={n} names={names} equations={equations} groundTruth={groundTruth}
              axisP={axisP} axisQ={axisQ} setAxisP={setAxisP} setAxisQ={setAxisQ}
              cjsReady={cjsReady} solved={solved}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Estilos
   ══════════════════════════════════════════════════════════════ */
const BG = `
  radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
  radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
  #020617
`;

const s = {
  page: { minHeight: "100vh", background: BG, padding: "2rem 1rem", boxSizing: "border-box" },
  wrap: { maxWidth: 1360, margin: "0 auto", fontFamily: "'Courier New', monospace" },
  centerCell: { display: "flex", alignItems: "flex-start", justifyContent: "center" },

  /* Center panel */
  centerWrap: { width: "100%", maxWidth: 440 },
  headerRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 },
  title: { fontSize: 19, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.25 },
  subtitle: { fontSize: 11, color: "#475569", marginTop: 4, letterSpacing: "0.03em" },
  sizeSelect: { fontSize: 13, color: "#93c5fd", border: "0.5px solid rgba(56,189,248,0.35)", borderRadius: 8, padding: "6px 10px", background: "rgba(56,189,248,0.08)", cursor: "pointer" },

  card: { background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 14, padding: "18px 18px", marginBottom: 14 },
  cardLabel: { fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 },
  eqRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  eqTag: { fontSize: 10, color: "#475569", letterSpacing: "0.04em", minWidth: 30 },
  eqInline: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  coeff: { height: 38, textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 600, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(148,163,184,0.2)", borderRadius: 8, color: "#e2e8f0", boxSizing: "border-box" },
  coeffInvalid: { borderColor: "rgba(248,113,113,0.6)", background: "rgba(248,113,113,0.08)" },
  varLabel: { fontSize: 15, fontWeight: 700, fontStyle: "italic" },
  op: { fontSize: 14, color: "#475569" },
  eqSign: { fontSize: 16, color: "#94a3b8", fontWeight: 300 },

  btn: { width: "100%", height: 42, borderRadius: 10, cursor: "pointer", background: "rgba(37,99,235,0.18)", border: "0.5px solid rgba(37,99,235,0.5)", color: "#93c5fd", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6, fontFamily: "'Courier New', monospace" },
  validHint: { fontSize: 11, color: "#fb923c", margin: "0 0 14px", textAlign: "center" },

  summaryCard: { background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 14, padding: "16px 18px", marginTop: 10 },
  resBadge: { display: "inline-block", fontSize: 12, fontWeight: 600, padding: "3px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: "0.03em" },
  badgePoint: { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "0.5px solid rgba(139,92,246,0.3)" },
  badgeNone: { background: "rgba(249,115,22,0.12)", color: "#fb923c", border: "0.5px solid rgba(249,115,22,0.3)" },
  badgeInf: { background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "0.5px solid rgba(56,189,248,0.25)" },
  coordRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  coordBox: { background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 10, padding: "8px 14px", minWidth: 64, textAlign: "center" },
  coordLabel: { fontSize: 10, color: "#475569", marginBottom: 2 },
  coordVal: { fontSize: 18, fontWeight: 700, color: "#a78bfa" },

  /* Quadrant cards */
  quadCard: { background: "rgba(2,6,23,0.55)", border: "0.5px solid rgba(148,163,184,0.14)", borderRadius: 14, overflow: "hidden", height: "100%", minHeight: 260, display: "flex", flexDirection: "column" },
  quadHeader: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "0.5px solid" },
  quadDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  quadTitle: { fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" },
  quadSubtitle: { fontSize: 10, color: "#475569", marginTop: 1 },
  pulseDot: { width: 6, height: 6, borderRadius: "50%", marginLeft: "auto", animation: "pulse 1s infinite" },
  quadEmpty: { padding: "24px 18px", fontSize: 12, color: "#475569", lineHeight: 1.6, flex: 1, display: "flex", alignItems: "center" },
  quadBody: { padding: "14px 16px", overflowY: "auto", flex: 1, maxHeight: 320 },
  logStep: { marginBottom: 14 },
  logStepLabel: { fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5 },
  logLine: { fontSize: 12, color: "#94a3b8", lineHeight: 1.75, display: "flex", gap: 7 },
  logPrompt: { flexShrink: 0, userSelect: "none" },
  cursor: { display: "inline-block", color: "#e2e8f0", animation: "blink 0.7s step-end infinite" },
  quadResult: { display: "flex", flexWrap: "wrap", gap: "6px 14px", padding: "10px 16px", borderTop: "0.5px solid" },
  quadResultChip: { fontSize: 12, color: "#e2e8f0", fontWeight: 600 },

  /* Graph panel extras */
  axisRow: { display: "flex", gap: 10, padding: "10px 16px 0" },
  axisLabel: { fontSize: 10, color: "#475569", display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  axisSelect: { fontSize: 12, color: "#e2e8f0", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(148,163,184,0.2)", borderRadius: 7, padding: "5px 6px" },
  legendRow: { display: "flex", gap: 12, padding: "10px 16px 0", flexWrap: "wrap" },
  legItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" },
  legLine: { width: 16, height: 2.5, borderRadius: 2, display: "inline-block" },
  legDot: { width: 9, height: 9, borderRadius: "50%", border: "2px solid #a78bfa", background: "rgba(139,92,246,0.2)", display: "inline-block" },
  chartWrap: { margin: "8px 16px 4px", height: 240, border: "0.5px solid rgba(148,163,184,0.12)", borderRadius: 10, overflow: "hidden", background: "rgba(2,6,23,0.4)" },
  graphNote: { fontSize: 10, color: "#475569", lineHeight: 1.6, padding: "0 16px 14px", margin: 0 },
};