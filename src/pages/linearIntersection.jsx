import { useState, useEffect, useRef } from "react";

/* ─── Chart.js CDN ─────────────────────────────────────────── */
let chartInst = null;
function useChartJS(cb) {
  useEffect(() => {
    if (window.Chart) { cb(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    s.onload = cb;
    document.head.appendChild(s);
  }, []);
}

/* ─── Math ─────────────────────────────────────────────────── */
const fmt = (n, d = 4) => parseFloat(n.toFixed(d));
const frac = (n) => (Number.isInteger(n) ? `${n}` : fmt(n, 4).toString());

function solve(a1, b1, c1, a2, b2, c2) {
  const det = a1 * b2 - a2 * b1;
  if (det === 0) return a1 * c2 !== a2 * c1 ? { type: "none" } : { type: "infinite" };
  return { type: "point", x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det };
}

function buildSteps(a1, b1, c1, a2, b2, c2, result) {
  const steps = [];
  const bSign = (b) => (b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`);

  steps.push({
    label: "📋 Sistema original",
    lines: [
      `Ecuación 1:   ${a1}x ${bSign(b1)}y = ${c1}`,
      `Ecuación 2:   ${a2}x ${bSign(b2)}y = ${c2}`,
    ],
  });

  const det = a1 * b2 - a2 * b1;

  if (result.type === "none") {
    steps.push({ label: "🔍 Análisis", lines: [`det = ${a1}·${b2} − ${a2}·${b1} = ${det}`, `det = 0 → pendientes iguales, interceptos distintos.`] });
    steps.push({ label: "❌ Conclusión", lines: ["Sistema inconsistente. Sin solución."] });
    return steps;
  }
  if (result.type === "infinite") {
    steps.push({ label: "🔍 Análisis", lines: [`det = ${a1}·${b2} − ${a2}·${b1} = ${det}`, `det = 0 y ecuaciones proporcionales → misma recta.`] });
    steps.push({ label: "∞ Conclusión", lines: ["Sistema dependiente. Infinitas soluciones."] });
    return steps;
  }

  const mA1 = a2, mA2 = a1;
  const na1 = a1 * mA1, nb1 = b1 * mA1, nc1 = c1 * mA1;
  const na2 = a2 * mA2, nb2 = b2 * mA2, nc2 = c2 * mA2;
  const diffB = nb1 - nb2, diffC = nc1 - nc2;
  const y = diffC / diffB;
  const x = (c1 - b1 * y) / a1;

  steps.push({
    label: "⚙️  Paso 1 — Multiplicar para eliminar x",
    lines: [
      `Ec.1 × ${mA1}:   ${na1}x ${bSign(nb1)}y = ${nc1}`,
      `Ec.2 × ${mA2}:   ${na2}x ${bSign(nb2)}y = ${nc2}`,
    ],
  });

  steps.push({
    label: "➖  Paso 2 — Restar ecuaciones",
    lines: [
      `(${nb1}) − (${nb2})  =  ${diffB}`,
      `(${nc1}) − (${nc2})  =  ${diffC}`,
      `${diffB}y = ${diffC}`,
    ],
  });

  steps.push({
    label: "🎯  Paso 3 — Despejar y",
    lines: [`y = ${diffC} ÷ ${diffB}`, `y = ${frac(y)}`],
  });

  steps.push({
    label: "🔄  Paso 4 — Sustituir en Ec.1",
    lines: [
      `${a1}x + (${b1})(${frac(y)}) = ${c1}`,
      `${a1}x = ${c1} − ${frac(b1 * y)}`,
      `${a1}x = ${frac(c1 - b1 * y)}`,
      `x = ${frac(x)}`,
    ],
  });

  steps.push({
    label: "✅  Paso 5 — Verificación",
    lines: [
      `Ec.1: ${a1}(${frac(x)}) + ${b1}(${frac(y)}) = ${frac(a1 * x + b1 * y)}  ${Math.abs(a1 * x + b1 * y - c1) < 1e-9 ? "✓" : "✗"}`,
      `Ec.2: ${a2}(${frac(x)}) + ${b2}(${frac(y)}) = ${frac(a2 * x + b2 * y)}  ${Math.abs(a2 * x + b2 * y - c2) < 1e-9 ? "✓" : "✗"}`,
    ],
  });

  return steps;
}

/* ─── Chart ────────────────────────────────────────────────── */
function renderChart(canvasRef, a1, b1, c1, a2, b2, c2, result) {
  if (!canvasRef.current || !window.Chart) return;
  const R = 12;
  const xs = [];
  for (let i = -R; i <= R; i += 0.2) xs.push(parseFloat(i.toFixed(1)));
  const line = (a, b, c) => b === 0 ? null : xs.map((x) => ({ x, y: (c - a * x) / b }));
  const d1 = line(a1, b1, c1), d2 = line(a2, b2, c2);
  const gridC = "rgba(148,163,184,0.1)", axisC = "rgba(148,163,184,0.5)", tickC = "rgba(148,163,184,0.65)";

  const axisPlugin = {
    id: "axes",
    afterDraw(chart) {
      const ctx = chart.ctx, xs = chart.scales.x, ys = chart.scales.y;
      const x0 = xs.getPixelForValue(0), y0 = ys.getPixelForValue(0);
      ctx.save(); ctx.strokeStyle = axisC; ctx.lineWidth = 2;
      if (y0 >= ys.top && y0 <= ys.bottom) {
        ctx.beginPath(); ctx.moveTo(xs.left, y0); ctx.lineTo(xs.right, y0); ctx.stroke();
        ctx.fillStyle = tickC; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.fillText("x", xs.right + 10, y0 + 4);
      }
      if (x0 >= xs.left && x0 <= xs.right) {
        ctx.beginPath(); ctx.moveTo(x0, ys.top); ctx.lineTo(x0, ys.bottom); ctx.stroke();
        ctx.fillStyle = tickC; ctx.font = "bold 11px monospace"; ctx.textAlign = "left"; ctx.fillText("y", x0 + 4, ys.top - 6);
      }
      ctx.restore();
    },
  };

  const ptDataset = result?.type === "point" ? [{
    label: "Intersección", data: [{ x: result.x, y: result.y }], type: "scatter",
    pointRadius: 10, pointHoverRadius: 12,
    pointBackgroundColor: "rgba(139,92,246,0.2)", pointBorderColor: "#a78bfa", pointBorderWidth: 2.5,
    showLine: false, order: 0,
  }] : [];

  if (chartInst) { chartInst.destroy(); chartInst = null; }
  chartInst = new window.Chart(canvasRef.current, {
    type: "line", plugins: [axisPlugin],
    data: {
      datasets: [
        ...(d1 ? [{ label: "Ec.1", data: d1, borderColor: "#f97316", borderWidth: 2.5, pointRadius: 0, tension: 0, order: 1 }] : []),
        ...(d2 ? [{ label: "Ec.2", data: d2, borderColor: "#38bdf8", borderWidth: 2.5, pointRadius: 0, tension: 0, order: 2, borderDash: [7, 4] }] : []),
        ...ptDataset,
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false, parsing: false, animation: { duration: 500 },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "rgba(2,6,23,0.92)", titleColor: "#94a3b8", bodyColor: "#e2e8f0", borderColor: "rgba(148,163,184,0.2)", borderWidth: 1, callbacks: { label: (c) => `(${fmt(c.raw.x, 2)}, ${fmt(c.raw.y, 2)})` } },
      },
      scales: {
        x: { type: "linear", min: -R, max: R, grid: { color: (c) => c.tick.value === 0 ? "transparent" : gridC }, border: { display: false }, ticks: { stepSize: 1, color: tickC, font: { size: 10, family: "monospace" }, autoSkip: false, maxTicksLimit: 25, callback: (v) => Number.isInteger(v) && v !== 0 ? v : "" } },
        y: { type: "linear", min: -R, max: R, grid: { color: (c) => c.tick.value === 0 ? "transparent" : gridC }, border: { display: false }, ticks: { stepSize: 1, color: tickC, font: { size: 10, family: "monospace" }, autoSkip: false, maxTicksLimit: 25, callback: (v) => Number.isInteger(v) && v !== 0 ? v : "" } },
      },
    },
  });
}

/* ─── Typewriter hook ──────────────────────────────────────── */
function useTypewriter(steps, active, onDone) {
  const [rendered, setRendered] = useState([]);
  const timerRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || !steps.length) return;
    doneRef.current = false;
    setRendered([]);
    const pos = { si: 0, li: 0, ci: 0 };

    function advance() {
      if (doneRef.current) return;
      const step = steps[pos.si];
      if (!step) { doneRef.current = true; onDone(); return; }

      const chars = [...(step.lines[pos.li] ?? "")]; // spread handles multibyte/emoji

      // Ensure slot exists
      setRendered((prev) => {
        const next = [...prev];
        if (!next[pos.si]) next[pos.si] = { label: step.label, lines: [] };
        const lines = [...next[pos.si].lines];
        if (lines[pos.li] === undefined) lines[pos.li] = "";
        next[pos.si] = { ...next[pos.si], lines };
        return next;
      });

      if (pos.ci < chars.length) {
        // Write one character
        const si = pos.si, li = pos.li, ch = chars[pos.ci];
        setRendered((prev) => {
          const next = [...prev];
          const lines = [...(next[si]?.lines ?? [])];
          lines[li] = (lines[li] ?? "") + ch;
          next[si] = { ...next[si], lines };
          return next;
        });
        pos.ci++;
        timerRef.current = setTimeout(advance, 18 + Math.random() * 20);
      } else {
        // Line finished — move to next line or next step
        pos.li++;
        pos.ci = 0;
        if (pos.li >= step.lines.length) {
          pos.li = 0;
          pos.si++;
          if (pos.si >= steps.length) { doneRef.current = true; onDone(); return; }
          timerRef.current = setTimeout(advance, 320);
        } else {
          timerRef.current = setTimeout(advance, 55);
        }
      }
    }

    timerRef.current = setTimeout(advance, 250);
    return () => { clearTimeout(timerRef.current); doneRef.current = true; };
  }, [active, steps]);

  return rendered;
}

/* ─── AI Log ───────────────────────────────────────────────── */
function AILog({ steps, onDone }) {
  const [active, setActive] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => { setActive(true); }, []);

  const rendered = useTypewriter(steps, active, onDone);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [rendered]);

  // Blinking cursor visible while typing
  const isTyping = rendered.length < steps.length ||
    (rendered[steps.length - 1]?.lines?.join("").length <
      steps[steps.length - 1]?.lines?.join("").length);

  return (
    <div style={s.logWrap}>
      <div style={s.logHeader}>
        <span style={s.dot1} /><span style={s.dot2} /><span style={s.dot3} />
        <span style={s.logTitle}>solver.reduction</span>
        {isTyping && <span style={s.pulseDot} />}
      </div>
      <div ref={bodyRef} style={s.logBody}>
        {rendered.map((step, si) => (
          <div key={si} style={s.logStep}>
            <div style={s.logStepLabel}>{step.label}</div>
            {step.lines.map((line, li) => (
              <div key={li} style={s.logLine}>
                <span style={s.logPrompt}>›</span>
                <span>{line}
                  {/* cursor only on the last visible char of the last line of the last step */}
                  {si === rendered.length - 1 && li === step.lines.length - 1 && isTyping && (
                    <span style={s.cursor}>▍</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Coefficient input ─────────────────────────────────────── */
function CoeffInput({ value, onChange, placeholder }) {
  return (
    <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} step="any" style={s.coeff} />
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function LinearSystem() {
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("1");
  const [c1, setC1] = useState("5");
  const [a2, setA2] = useState("1");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("1");

  const [phase, setPhase] = useState("idle"); // idle | logging | done
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [cjsReady, setCjsReady] = useState(false);
  const canvasRef = useRef(null);

  useChartJS(() => setCjsReady(true));

  const pa1 = parseFloat(a1), pb1 = parseFloat(b1), pc1 = parseFloat(c1);
  const pa2 = parseFloat(a2), pb2 = parseFloat(b2), pc2 = parseFloat(c2);
  const valid = [pa1, pb1, pc1, pa2, pb2, pc2].every((n) => !isNaN(n));

  function handleCalculate() {
    if (!valid) return;
    const res = solve(pa1, pb1, pc1, pa2, pb2, pc2);
    setResult(res);
    setSteps(buildSteps(pa1, pb1, pc1, pa2, pb2, pc2, res));
    setPhase("logging");
  }

  function handleLogDone() {
    setPhase("done");
    setTimeout(() => {
      if (cjsReady) renderChart(canvasRef, pa1, pb1, pc1, pa2, pb2, pc2, result);
    }, 120);
  }

  useEffect(() => {
    if (phase === "done" && cjsReady)
      renderChart(canvasRef, pa1, pb1, pc1, pa2, pb2, pc2, result);
  }, [cjsReady, phase]);

  const eqLabel = (a, b, c) => {
    const bSign = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
    return `${a}x ${bSign}y = ${c}`;
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        input:focus{outline:none;border-color:rgba(56,189,248,.5)!important;box-shadow:0 0 0 2px rgba(56,189,248,.12)}
      `}</style>

      <div style={s.wrap}>
        {/* Header */}
        <div style={s.headerRow}>
          <div>
            <h1 style={s.title}>Sistema Lineal 2×2</h1>
            <p style={s.subtitle}>Método de reducción — eliminación de Gauss</p>
          </div>
          <div style={s.topBadge}>ax + by = k</div>
        </div>

        {/* Inputs */}
        <div style={s.card}>
          <p style={s.cardLabel}>Coeficientes del sistema</p>
          {[
            { tag: "Ec. 1", a: a1, setA: setA1, b: b1, setB: setB1, c: c1, setC: setC1 },
            { tag: "Ec. 2", a: a2, setA: setA2, b: b2, setB: setB2, c: c2, setC: setC2 },
          ].map(({ tag, a, setA, b, setB, c, setC }, i) => (
            <div key={i} style={{ ...s.eqRow, marginBottom: i === 0 ? 16 : 0 }}>
              <span style={s.eqTag}>{tag}</span>
              <div style={s.eqInline}>
                <CoeffInput value={a} onChange={setA} placeholder="a" />
                <span style={s.varX}>x</span>
                <span style={s.op}>+</span>
                <CoeffInput value={b} onChange={setB} placeholder="b" />
                <span style={s.varY}>y</span>
                <span style={s.eqSign}>=</span>
                <CoeffInput value={c} onChange={setC} placeholder="k" />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleCalculate} disabled={!valid || phase === "logging"}
          style={{ ...s.btn, opacity: !valid || phase === "logging" ? 0.45 : 1 }}>
          {phase === "logging" ? "Resolviendo…" : "Resolver sistema"}
        </button>

        {/* AI Log with typewriter */}
        {(phase === "logging" || phase === "done") && steps.length > 0 && (
          <AILog steps={steps} onDone={handleLogDone} />
        )}

        {/* Chart */}
        {phase === "done" && (
          <div style={{ marginTop: 20, animation: "fadeUp .5s ease both" }}>
            <div style={s.legendRow}>
              <span style={s.legItem}><span style={{ ...s.legLine, background: "#f97316" }} />{valid ? eqLabel(pa1, pb1, pc1) : "Ec. 1"}</span>
              <span style={s.legItem}><span style={{ ...s.legLine, background: "transparent", borderTop: "2.5px dashed #38bdf8", height: 0 }} />{valid ? eqLabel(pa2, pb2, pc2) : "Ec. 2"}</span>
              {result?.type === "point" && (
                <span style={s.legItem}><span style={s.legDot} />({fmt(result.x, 3)}, {fmt(result.y, 3)})</span>
              )}
            </div>
            <div style={s.chartWrap}>
              <canvas ref={canvasRef} role="img" aria-label="Gráfica del sistema de ecuaciones" />
            </div>
          </div>
        )}

        {/* Result + Conclusions */}
        {phase === "done" && result && (
          <div style={{ ...s.resultCard, animation: "fadeUp .6s .1s ease both" }}>
            {result.type === "point" && (
              <>
                <span style={{ ...s.resBadge, ...s.badgePoint }}>✦ Solución única</span>
                <div style={s.coordRow}>
                  <div style={s.coordBox}><div style={s.coordLabel}>x</div><div style={s.coordVal}>{frac(result.x)}</div></div>
                  <div style={s.coordBox}><div style={s.coordLabel}>y</div><div style={s.coordVal}>{frac(result.y)}</div></div>
                </div>
                <div style={s.divider} />
                <p style={s.concTitle}>Conclusiones</p>
                <ul style={s.concList}>
                  {[
                    <>Sistema <strong style={s.hl}>consistente e independiente</strong>: exactamente una solución.</>,
                    <>Las rectas se intersectan en <strong style={s.hl}>({frac(result.x)}, {frac(result.y)})</strong>.</>,
                    <>El determinante es <strong style={s.hl}>det ≠ 0</strong>, lo que garantiza la unicidad.</>,
                    <>El método de reducción eliminó <strong style={s.hl}>x</strong> multiplicando por coeficientes cruzados.</>,
                  ].map((text, i) => (
                    <li key={i} style={s.concItem}><span style={s.concNum}>0{i + 1}</span>{text}</li>
                  ))}
                </ul>
              </>
            )}
            {result.type === "none" && (
              <>
                <span style={{ ...s.resBadge, ...s.badgeNone }}>✕ Sin solución</span>
                <div style={s.divider} />
                <p style={s.concTitle}>Conclusiones</p>
                <ul style={s.concList}>
                  {[
                    <>Sistema <strong style={s.hl}>inconsistente</strong>: no tiene solución.</>,
                    <>Las rectas son <strong style={s.hl}>paralelas</strong>: misma pendiente, distinto intercepto.</>,
                    <>El determinante es <strong style={s.hl}>0</strong>: no existe solución única.</>,
                    <>Geométricamente, las rectas <strong style={s.hl}>nunca se cruzan</strong>.</>,
                  ].map((text, i) => (
                    <li key={i} style={s.concItem}><span style={s.concNum}>0{i + 1}</span>{text}</li>
                  ))}
                </ul>
              </>
            )}
            {result.type === "infinite" && (
              <>
                <span style={{ ...s.resBadge, ...s.badgeInf }}>∞ Infinitas soluciones</span>
                <div style={s.divider} />
                <p style={s.concTitle}>Conclusiones</p>
                <ul style={s.concList}>
                  {[
                    <>Sistema <strong style={s.hl}>consistente y dependiente</strong>.</>,
                    <>Ambas ecuaciones describen la <strong style={s.hl}>misma recta</strong>.</>,
                    <>Cada punto de la recta es una <strong style={s.hl}>solución válida</strong>.</>,
                    <>Los coeficientes de las ecuaciones son <strong style={s.hl}>proporcionales</strong>.</>,
                  ].map((text, i) => (
                    <li key={i} style={s.concItem}><span style={s.concNum}>0{i + 1}</span>{text}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ───────────────────────────────────────────────── */
const BG = `
  radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
  radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
  #020617
`;

const s = {
  page: { minHeight: "100vh", background: BG, padding: "2rem 1rem", boxSizing: "border-box" },
  wrap: { maxWidth: 660, margin: "0 auto", fontFamily: "'Courier New', monospace" },

  headerRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em", margin: 0 },
  subtitle: { fontSize: 12, color: "#475569", marginTop: 4, letterSpacing: "0.04em" },
  topBadge: { fontSize: 13, color: "#38bdf8", border: "0.5px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "4px 14px", background: "rgba(56,189,248,0.08)", letterSpacing: "0.08em" },

  card: { background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 14, padding: "20px 24px", marginBottom: 14 },
  cardLabel: { fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 },
  eqRow: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  eqTag: { fontSize: 10, color: "#475569", letterSpacing: "0.06em", minWidth: 36 },
  eqInline: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  coeff: { width: 62, height: 40, textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: 16, fontWeight: 600, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(148,163,184,0.2)", borderRadius: 8, color: "#e2e8f0", boxSizing: "border-box" },
  varX: { fontSize: 18, color: "#f97316", fontWeight: 700, fontStyle: "italic", minWidth: 12 },
  varY: { fontSize: 18, color: "#38bdf8", fontWeight: 700, fontStyle: "italic", minWidth: 12 },
  op: { fontSize: 16, color: "#475569" },
  eqSign: { fontSize: 18, color: "#94a3b8", fontWeight: 300 },

  btn: { width: "100%", height: 44, borderRadius: 10, cursor: "pointer", background: "rgba(37,99,235,0.18)", border: "0.5px solid rgba(37,99,235,0.5)", color: "#93c5fd", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 20, transition: "background .2s", fontFamily: "'Courier New', monospace" },

  /* Log */
  logWrap: { background: "rgba(2,6,23,0.75)", border: "0.5px solid rgba(148,163,184,0.12)", borderRadius: 12, overflow: "hidden", marginBottom: 4 },
  logHeader: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.04)", borderBottom: "0.5px solid rgba(148,163,184,0.1)" },
  dot1: { width: 10, height: 10, borderRadius: "50%", background: "#ef4444" },
  dot2: { width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" },
  dot3: { width: 10, height: 10, borderRadius: "50%", background: "#22c55e" },
  logTitle: { fontSize: 11, color: "#475569", marginLeft: 6, letterSpacing: "0.04em" },
  pulseDot: { width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", marginLeft: "auto", animation: "pulse 1s infinite" },
  logBody: { padding: "14px 18px", maxHeight: 340, overflowY: "auto" },
  logStep: { marginBottom: 16 },
  logStepLabel: { fontSize: 11, color: "#38bdf8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 },
  logLine: { fontSize: 13, color: "#94a3b8", lineHeight: 1.9, display: "flex", gap: 8 },
  logPrompt: { color: "#2563eb", flexShrink: 0, userSelect: "none" },
  cursor: { display: "inline-block", color: "#e2e8f0", animation: "blink 0.7s step-end infinite" },

  /* Chart */
  legendRow: { display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" },
  legItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" },
  legLine: { width: 18, height: 2.5, borderRadius: 2, display: "inline-block" },
  legDot: { width: 10, height: 10, borderRadius: "50%", border: "2px solid #a78bfa", background: "rgba(139,92,246,0.2)", display: "inline-block" },
  chartWrap: { width: "100%", height: 340, border: "0.5px solid rgba(148,163,184,0.12)", borderRadius: 12, overflow: "hidden", background: "rgba(2,6,23,0.55)" },

  /* Result */
  resultCard: { background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 14, padding: "20px 24px", marginTop: 16 },
  resBadge: { display: "inline-block", fontSize: 12, fontWeight: 600, padding: "3px 14px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.04em" },
  badgePoint: { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "0.5px solid rgba(139,92,246,0.3)" },
  badgeNone: { background: "rgba(249,115,22,0.12)", color: "#fb923c", border: "0.5px solid rgba(249,115,22,0.3)" },
  badgeInf: { background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "0.5px solid rgba(56,189,248,0.25)" },
  coordRow: { display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" },
  coordBox: { background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(148,163,184,0.15)", borderRadius: 10, padding: "10px 20px", minWidth: 90, textAlign: "center" },
  coordLabel: { fontSize: 11, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" },
  coordVal: { fontSize: 28, fontWeight: 700, color: "#a78bfa" },
  divider: { height: "0.5px", background: "rgba(148,163,184,0.1)", margin: "4px 0 16px" },
  concTitle: { fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 },
  concList: { listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 },
  concItem: { display: "flex", gap: 14, alignItems: "flex-start", fontSize: 13, color: "#94a3b8", lineHeight: 1.65 },
  concNum: { fontSize: 10, color: "#2563eb", fontWeight: 700, letterSpacing: "0.04em", minWidth: 22, paddingTop: 2 },
  hl: { color: "#e2e8f0", fontWeight: 600 },
};