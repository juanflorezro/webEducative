import { useState, useEffect, useRef } from "react";

let chartInstance = null;

function fmt(n, d = 4) {
  return parseFloat(n.toFixed(d));
}

function fmtEq(m, b) {
  const ms = m === 1 ? "" : m === -1 ? "-" : `${fmt(m)}`;
  const bs = b === 0 ? "" : (b > 0 ? "+" : "") + fmt(b);
  if (m === 0) return `${fmt(b)}`;
  return `${ms}x${bs}`;
}

function useChart(canvasRef, m1, b1, m2, b2, result, ready) {
  useEffect(() => {
    if (!ready || !canvasRef.current || typeof window === "undefined") return;
    if (!window.Chart) return;

    const R = 10;
    const gridC = "rgba(148,163,184,0.12)";
    const axisC = "rgba(148,163,184,0.55)";
    const tickC = "rgba(148,163,184,0.7)";

    const xs = [];
    for (let i = -R; i <= R; i += 0.25) xs.push(parseFloat(i.toFixed(2)));
    const d1 = xs.map((x) => ({ x, y: m1 * x + b1 }));
    const d2 = xs.map((x) => ({ x, y: m2 * x + b2 }));

    const ptDataset =
      result?.type === "point"
        ? [
            {
              label: "Intersección",
              data: [{ x: result.x, y: result.y }],
              type: "scatter",
              pointRadius: 9,
              pointHoverRadius: 11,
              pointBackgroundColor: "rgba(139,92,246,0.2)",
              pointBorderColor: "#a78bfa",
              pointBorderWidth: 2.5,
              showLine: false,
              order: 0,
            },
          ]
        : [];

    const axisLinePlugin = {
      id: "axisLines",
      afterDraw(chart) {
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const x0 = xScale.getPixelForValue(0);
        const y0 = yScale.getPixelForValue(0);
        const { left, right } = xScale;
        const { top, bottom } = yScale;

        ctx.save();
        ctx.strokeStyle = axisC;
        ctx.lineWidth = 2;

        if (y0 >= top && y0 <= bottom) {
          ctx.beginPath();
          ctx.moveTo(left, y0);
          ctx.lineTo(right, y0);
          ctx.stroke();
          ctx.fillStyle = tickC;
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("x", right + 10, y0 + 4);
        }
        if (x0 >= left && x0 <= right) {
          ctx.beginPath();
          ctx.moveTo(x0, top);
          ctx.lineTo(x0, bottom);
          ctx.stroke();
          ctx.fillStyle = tickC;
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "left";
          ctx.fillText("y", x0 + 4, top - 6);
        }
        ctx.restore();
      },
    };

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new window.Chart(canvasRef.current, {
      type: "line",
      plugins: [axisLinePlugin],
      data: {
        datasets: [
          {
            label: "f₁(x)",
            data: d1,
            borderColor: "#f97316",
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0,
            order: 1,
          },
          {
            label: "f₂(x)",
            data: d2,
            borderColor: "#38bdf8",
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0,
            order: 2,
            borderDash: [7, 4],
          },
          ...ptDataset,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        animation: { duration: 350 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(2,6,23,0.9)",
            titleColor: "#94a3b8",
            bodyColor: "#e2e8f0",
            borderColor: "rgba(148,163,184,0.2)",
            borderWidth: 1,
            callbacks: {
              label: (c) => `(${fmt(c.raw.x, 2)}, ${fmt(c.raw.y, 2)})`,
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: -R,
            max: R,
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? "transparent" : gridC),
              lineWidth: 1,
            },
            border: { display: false },
            ticks: {
              stepSize: 1,
              color: tickC,
              font: { size: 10, family: "monospace" },
              maxTicksLimit: 21,
              autoSkip: false,
              callback: (v) => (Number.isInteger(v) && v !== 0 ? v : ""),
            },
          },
          y: {
            type: "linear",
            min: -R,
            max: R,
            grid: {
              color: (ctx) => (ctx.tick.value === 0 ? "transparent" : gridC),
              lineWidth: 1,
            },
            border: { display: false },
            ticks: {
              stepSize: 1,
              color: tickC,
              font: { size: 10, family: "monospace" },
              maxTicksLimit: 21,
              autoSkip: false,
              callback: (v) => (Number.isInteger(v) && v !== 0 ? v : ""),
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };
  }, [ready, m1, b1, m2, b2, result]);
}

function ResultPanel({ m1, b1, m2, b2, result }) {
  if (!result) return null;

  const xF = result.type === "point" ? fmt(result.x) : null;
  const yF = result.type === "point" ? fmt(result.y) : null;

  return (
    <div style={s.resultCard}>
      {result.type === "point" && (
        <>
          <span style={{ ...s.badge, ...s.badgePoint }}>
            Punto de intersección único
          </span>
          <div style={s.coordRow}>
            <div style={s.coordBox}>
              <div style={s.coordLabel}>x =</div>
              <div style={s.coordVal}>{xF}</div>
            </div>
            <div style={s.coordBox}>
              <div style={s.coordLabel}>y =</div>
              <div style={s.coordVal}>{yF}</div>
            </div>
          </div>
          <div style={s.explanation}>
            Las funciones se cruzan en{" "}
            <strong style={s.strong}>({xF}, {yF})</strong>. Pendientes distintas
            (<strong style={s.strong}>m₁ = {fmt(m1)}</strong> vs{" "}
            <strong style={s.strong}>m₂ = {fmt(m2)}</strong>) garantizan
            exactamente un cruce.
            <ol style={s.stepList}>
              <li style={s.stepItem}>
                <span style={s.stepNum}>1</span>
                <span>Igualamos: {fmtEq(m1, b1)} = {fmtEq(m2, b2)}</span>
              </li>
              <li style={s.stepItem}>
                <span style={s.stepNum}>2</span>
                <span>
                  Despejamos x: x({fmt(m1)}−{fmt(m2)}) = {fmt(b2)}−{fmt(b1)} → x = {xF}
                </span>
              </li>
              <li style={s.stepItem}>
                <span style={s.stepNum}>3</span>
                <span>
                  Sustituimos: y = {fmt(m1)}({xF}) + {fmt(b1)} = {yF}
                </span>
              </li>
              <li style={s.stepItem}>
                <span style={s.stepNum}>4</span>
                <span>Verificación: f₂({xF}) = {fmt(m2 * result.x + b2)} ✓</span>
              </li>
            </ol>
          </div>
        </>
      )}

      {result.type === "none" && (
        <>
          <span style={{ ...s.badge, ...s.badgeNone }}>
            Sin intersección — rectas paralelas
          </span>
          <div style={s.explanation}>
            Misma pendiente <strong style={s.strong}>m = {fmt(m1)}</strong> pero
            interceptos distintos (<strong style={s.strong}>b₁ = {fmt(b1)}</strong>{" "}
            ≠ <strong style={s.strong}>b₂ = {fmt(b2)}</strong>). Las rectas son
            paralelas, separadas{" "}
            <strong style={s.strong}>{fmt(Math.abs(b2 - b1))}</strong> unidades.
            El sistema no tiene solución.
          </div>
        </>
      )}

      {result.type === "infinite" && (
        <>
          <span style={{ ...s.badge, ...s.badgeInfinite }}>
            Infinitas intersecciones — misma recta
          </span>
          <div style={s.explanation}>
            Ambas funciones son idénticas:{" "}
            <strong style={s.strong}>y = {fmtEq(m1, b1)}</strong>. Misma
            pendiente y mismo intercepto. Cada punto de la recta es una
            intersección. Sistema dependiente con infinitas soluciones.
          </div>
        </>
      )}
    </div>
  );
}

export default function LinearIntersection() {
  const [m1, setM1] = useState("2");
  const [b1, setB1] = useState("1");
  const [m2, setM2] = useState("-1");
  const [b2, setB2] = useState("4");
  const [result, setResult] = useState(null);
  const [chartReady, setChartReady] = useState(false);
  const [chartjsLoaded, setChartjsLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.Chart) { setChartjsLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => setChartjsLoaded(true);
    document.head.appendChild(script);
  }, []);

  const pm1 = parseFloat(m1);
  const pb1 = parseFloat(b1);
  const pm2 = parseFloat(m2);
  const pb2 = parseFloat(b2);

  const preview1 = !isNaN(pm1) && !isNaN(pb1) ? `y = ${fmtEq(pm1, pb1)}` : "y = …";
  const preview2 = !isNaN(pm2) && !isNaN(pb2) ? `y = ${fmtEq(pm2, pb2)}` : "y = …";

  useChart(canvasRef, pm1, pb1, pm2, pb2, result, chartReady && chartjsLoaded);

  function calculate() {
    if ([pm1, pb1, pm2, pb2].some(isNaN)) return;
    let res;
    if (pm1 === pm2) {
      res = pb1 === pb2 ? { type: "infinite" } : { type: "none" };
    } else {
      const x = (pb2 - pb1) / (pm1 - pm2);
      res = { type: "point", x, y: pm1 * x + pb1 };
    }
    setResult(res);
    setChartReady(true);
  }

  const showDot = result?.type === "point";

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <p style={s.sectionLabel}>funciones lineales — y = mx + b</p>

        {/* f1 */}
        <div style={s.fnCard}>
          <div style={s.fnHeader}>
            <span style={{ ...s.fnDot, background: "#f97316" }} />
            <span style={s.fnTitle}>Función f₁</span>
            <span style={s.fnEq}>{preview1}</span>
          </div>
          <div style={s.inputsRow}>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>pendiente m₁</label>
              <input type="number" value={m1} onChange={(e) => setM1(e.target.value)} step="any" style={s.input} />
            </div>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>intercepto b₁</label>
              <input type="number" value={b1} onChange={(e) => setB1(e.target.value)} step="any" style={s.input} />
            </div>
          </div>
        </div>

        {/* f2 */}
        <div style={s.fnCard}>
          <div style={s.fnHeader}>
            <span style={{ ...s.fnDot, background: "#38bdf8" }} />
            <span style={s.fnTitle}>Función f₂</span>
            <span style={s.fnEq}>{preview2}</span>
          </div>
          <div style={s.inputsRow}>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>pendiente m₂</label>
              <input type="number" value={m2} onChange={(e) => setM2(e.target.value)} step="any" style={s.input} />
            </div>
            <div style={s.inputGroup}>
              <label style={s.inputLabel}>intercepto b₂</label>
              <input type="number" value={b2} onChange={(e) => setB2(e.target.value)} step="any" style={s.input} />
            </div>
          </div>
        </div>

        <button onClick={calculate} style={s.calcBtn}>
          Calcular intersección
        </button>

        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={s.legend}>
              <span style={s.legendItem}>
                <span style={{ ...s.legendLine, background: "#f97316" }} />
                f₁(x)
              </span>
              <span style={s.legendItem}>
                <span style={{ ...s.legendLine, background: "transparent", borderTop: "2.5px dashed #38bdf8", height: 0 }} />
                f₂(x)
              </span>
              {showDot && (
                <span style={s.legendItem}>
                  <span style={s.legendDot} />
                  intersección
                </span>
              )}
            </div>

            <div style={s.chartWrap}>
              <canvas ref={canvasRef} role="img" aria-label="Gráfica de dos funciones lineales">
                Gráfica de f₁ y f₂.
              </canvas>
            </div>

            <ResultPanel m1={pm1} b1={pb1} m2={pm2} b2={pb2} result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

const BG = `
  radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
  radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
  #020617
`;

const s = {
  page: {
    minHeight: "100vh",
    background: BG,
    padding: "2rem 1rem",
    boxSizing: "border-box",
  },
  wrap: {
    maxWidth: 640,
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#475569",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  fnCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(148,163,184,0.15)",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 12,
  },
  fnHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  fnDot: { width: 12, height: 12, borderRadius: 3, flexShrink: 0 },
  fnTitle: { fontSize: 14, fontWeight: 500, color: "#e2e8f0" },
  fnEq: { fontSize: 12, color: "#64748b", marginLeft: "auto", fontFamily: "monospace" },
  inputsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
  },
  inputGroup: { display: "flex", flexDirection: "column", gap: 4 },
  inputLabel: { fontSize: 11, color: "#475569", fontFamily: "monospace" },
  input: {
    width: "100%",
    height: 38,
    padding: "0 10px",
    fontFamily: "monospace",
    fontSize: 15,
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(148,163,184,0.2)",
    borderRadius: 8,
    color: "#e2e8f0",
    outline: "none",
    textAlign: "center",
    boxSizing: "border-box",
  },
  calcBtn: {
    width: "100%",
    height: 42,
    marginTop: 16,
    borderRadius: 8,
    border: "0.5px solid rgba(37,99,235,0.6)",
    background: "rgba(37,99,235,0.15)",
    color: "#93c5fd",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    letterSpacing: "0.02em",
  },
  legend: { display: "flex", gap: 16, marginBottom: 10, flexWrap: "wrap" },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#64748b",
  },
  legendLine: { width: 20, height: 2.5, borderRadius: 2, display: "inline-block" },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "2px solid #a78bfa",
    background: "rgba(139,92,246,0.2)",
    display: "inline-block",
  },
  chartWrap: {
    position: "relative",
    width: "100%",
    height: 340,
    border: "0.5px solid rgba(148,163,184,0.15)",
    borderRadius: 12,
    overflow: "hidden",
    background: "rgba(2,6,23,0.6)",
  },
  resultCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(148,163,184,0.15)",
    borderRadius: 12,
    padding: "16px 20px",
    marginTop: 12,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    padding: "3px 12px",
    borderRadius: 20,
    marginBottom: 12,
  },
  badgePoint: { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "0.5px solid rgba(139,92,246,0.3)" },
  badgeNone: { background: "rgba(249,115,22,0.1)", color: "#fb923c", border: "0.5px solid rgba(249,115,22,0.3)" },
  badgeInfinite: { background: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "0.5px solid rgba(56,189,248,0.3)" },
  coordRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 },
  coordBox: {
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(148,163,184,0.15)",
    borderRadius: 8,
    padding: "10px 16px",
    minWidth: 80,
  },
  coordLabel: { fontSize: 11, color: "#475569", fontFamily: "monospace", marginBottom: 2 },
  coordVal: { fontSize: 26, fontWeight: 500, fontFamily: "monospace", color: "#a78bfa" },
  explanation: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 1.7,
    borderTop: "0.5px solid rgba(148,163,184,0.1)",
    paddingTop: 12,
    marginTop: 4,
  },
  strong: { color: "#e2e8f0", fontWeight: 500 },
  stepList: {
    margin: "10px 0 0",
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  stepItem: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    fontSize: 12,
    color: "#64748b",
    fontFamily: "monospace",
    lineHeight: 1.6,
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(148,163,184,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 500,
    flexShrink: 0,
    color: "#475569",
    marginTop: 1,
  },
};
