import { useState, useEffect, useRef } from "react";

const EXAM_DURATION = 3 * 60 * 60;

const DOC_TYPES = ["Cédula de Ciudadanía", "Tarjeta de Identidad", "Cédula Extranjería", "Pasaporte", "NUIP"];

const QUESTIONS = [
  { id: 1, cat: "Convivencia Familiar", emoji: "🏠", text: "Cuando tus padres te dan una opinión diferente a la tuya, ¿qué debes hacer?", opts: ["Ignorarlos completamente", "Discutir y enojarte", "Escuchar respetuosamente", "Hacer lo contrario"], correct: 2 },
  { id: 2, cat: "Convivencia Familiar", emoji: "🏠", text: "Tu hermano menor rompió accidentalmente tu celular. Tu reacción más adecuada sería:", opts: ["Golpearlo", "Gritarle y humillarlo", "Hablar con calma y buscar solución", "Contárselo a todos"], correct: 2 },
  { id: 3, cat: "Convivencia Familiar", emoji: "🏠", text: "Si tus padres se encuentran discutiendo, ¿cómo debes actuar?", opts: ["Interrumpir y tomar partido", "Gritar más fuerte que ellos", "Escuchar y luego expresar tu opinión calmadamente", "Salir de la casa"], correct: 2 },
  { id: 4, cat: "Convivencia Familiar", emoji: "🏠", text: "Si tu madre te pide ayuda con los quehaceres domésticos, pero tú tienes tarea. ¿Qué haces?", opts: ["Ignorarla y seguir con tu tarea", "Ayudar primero y luego hacer tu tarea", "Decirle que ella debe hacerlo", "Enojarte y reclamar"], correct: 1 },
  { id: 5, cat: "Convivencia Familiar", emoji: "🏠", text: "Un familiar visita tu casa y hace un comentario negativo sobre ti. ¿Cómo reaccionas?", opts: ["Lo insultas delante de todos", "Te vas llorando", "Respondes educadamente explicando tu punto de vista", "Guardas resentimiento"], correct: 2 },
  { id: 6, cat: "Convivencia Familiar", emoji: "🏠", text: "Tu familia no tiene dinero para comprarte algo que quieres. ¿Qué actitud tomas?", opts: ["Haces berrinche", "Entiendes la situación", "Culpas a tus padres", "Robas el dinero"], correct: 1 },
  { id: 7, cat: "Convivencia Familiar", emoji: "🏠", text: "Tus padres te castigan porque obtuviste una mala nota. ¿Qué haces?", opts: ["Rebelarte y desobedecer", "Aceptar el castigo y mejorar", "Mentir sobre tus notas futuras", "Vengarte de alguna manera"], correct: 1 },
  { id: 8, cat: "Convivencia Familiar", emoji: "🏠", text: "Un hermano te acusa de algo que no hiciste. ¿Cómo procedes?", opts: ["Lo acusas de algo también", "Discutes violentamente", "Mantienes la calma y explicas la verdad", "Te vengas después"], correct: 2 },
  { id: 9, cat: "Convivencia Familiar", emoji: "🏠", text: "Tu familia celebra un logro tuyo. ¿Qué sientes?", opts: ["Vergüenza", "Orgullo y gratitud", "Indiferencia", "Molestia"], correct: 1 },
  { id: 10, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Cómo muestras afecto a tu familia?", opts: ["Con palabras y acciones", "Ignorándolos", "Solo con regalos", "Nunca muestras afecto"], correct: 0 },
  { id: 11, cat: "Convivencia Familiar", emoji: "🏠", text: "Un padre está estresado por el trabajo. ¿Cómo ayudas?", opts: ["Le pides más cosas", "Le causas más problemas", "Le ofreces apoyo y comprensión", "Lo ignoras completamente"], correct: 2 },
  { id: 12, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Qué haces cuando un familiar está enfermo?", opts: ["Lo evitas", "Te quejas", "Lo cuidas y apoyas", "Aprovechas para hacer lo que quieras"], correct: 2 },
  { id: 13, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Cómo manejas los secretos familiares?", opts: ["Se lo cuento a todo el mundo", "Los usas en tu beneficio", "Los respetas y guardas", "Los olvidas"], correct: 2 },
  { id: 14, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Qué importancia das a las tradiciones familiares?", opts: ["Ninguna, son anticuadas", "Mucha, las valoro", "Solo si me benefician", "Las critico siempre"], correct: 1 },
  { id: 15, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Cómo resuelves los conflictos con tus hermanos?", opts: ["Con violencia", "Con diálogo", "Involucrando a los padres inmediatamente", "Guardando rencor"], correct: 1 },
  { id: 16, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Qué haces cuando un familiar te pide un favor?", opts: ["Siempre ayudas si puedes", "Siempre dices que no", "Ayudas solo si te pagan", "Finges no escuchar"], correct: 0 },
  { id: 17, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Cómo manejas la privacidad en familia?", opts: ["Respetando espacios personales", "Entrando sin llamar siempre", "Revisando cosas ajenas", "Contando todo a extraños"], correct: 0 },
  { id: 18, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Qué valoras más en tu familia?", opts: ["El dinero", "El apoyo emocional", "Los regalos", "La libertad total"], correct: 1 },
  { id: 19, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Cómo contribuyes al bienestar familiar?", opts: ["Cumpliendo con mis responsabilidades", "No contribuyo", "Creando más problemas", "Solo cuando me obligan"], correct: 0 },
  { id: 20, cat: "Convivencia Familiar", emoji: "🏠", text: "¿Qué aprendes de tu familia?", opts: ["Valores y conductas", "Solo cosas malas", "Nada importante", "Cómo ser egoísta"], correct: 0 },
  { id: 21, cat: "Convivencia Social", emoji: "🌍", text: "En el bus ves a un adulto mayor de pie. Tu acción más adecuada es:", opts: ["Ignorarlo", "Reírme", "Ceder mi silla o asiento", "Pedirle que se aleje de mi lado"], correct: 2 },
  { id: 22, cat: "Convivencia Social", emoji: "🌍", text: "Un amigo te cuenta un secreto importante. ¿Qué haces?", opts: ["Se lo cuentas a todos", "Lo guardas respetuosamente", "Lo usas para molestar", "Se lo cuentas a sus padres"], correct: 1 },
  { id: 23, cat: "Convivencia Social", emoji: "🌍", text: "Ves que alguien está siendo acosado. ¿Cómo actúas?", opts: ["Te unes al acoso", "Ignoras la situación", "Defiendes a la persona", "Grabas el video para subirlo a redes sociales"], correct: 2 },
  { id: 24, cat: "Convivencia Social", emoji: "🌍", text: "Un desconocido te pide ayuda en la calle. ¿Qué haces?", opts: ["Lo ignoras completamente", "Ayudas con precaución", "Le gritas que se vaya", "Llamas a la policía inmediatamente"], correct: 1 },
  { id: 25, cat: "Convivencia Social", emoji: "🌍", text: "¿Cómo manejas las diferencias culturales?", opts: ["Las respetas", "Las criticas", "Las ignoras", "Te burlas de ellas"], correct: 0 },
  { id: 26, cat: "Convivencia Social", emoji: "🌍", text: "En una fila, alguien se cuela. ¿Qué haces?", opts: ["Lo empujas", "Le llamas la atención educadamente", "Te cuelas tú también", "Gritas insultos"], correct: 1 },
  { id: 27, cat: "Convivencia Social", emoji: "🌍", text: "¿Cómo actúas ante personas con discapacidad?", opts: ["Te burlas", "Ofreces ayuda si es necesario", "Las evitas", "Finges no verlas"], correct: 1 },
  { id: 28, cat: "Convivencia Social", emoji: "🌍", text: "¿Qué haces con la basura en espacios públicos?", opts: ["La arrojo al suelo", "La guardas hasta encontrar basurero", "La escondes", "La dejas donde otros la vean"], correct: 1 },
  { id: 29, cat: "Convivencia Social", emoji: "🌍", text: "¿Cómo manejas conflictos con vecinos?", opts: ["Con diálogo", "Con violencia", "Con venganza", "Con indiferencia"], correct: 0 },
  { id: 30, cat: "Convivencia Social", emoji: "🌍", text: "¿Qué significa ser buen ciudadano?", opts: ["Cumplir normas y respetar a otros", "Hacer lo que quieras siempre", "Solo pensar en uno mismo", "Evadir responsabilidades"], correct: 0 },
  { id: 31, cat: "Convivencia Escolar", emoji: "🏫", text: "Un compañero se burla de otro por sus calificaciones. Tu actitud correcta es:", opts: ["Unirte a la burla", "Ignorar la situación", "Defender al compañero burlado", "Contárselo solo al profesor"], correct: 2 },
  { id: 32, cat: "Convivencia Escolar", emoji: "🏫", text: "El profesor te llama la atención injustamente. ¿Qué haces?", opts: ["Le gritas", "Escuchas y luego explicas tu versión", "Te vas del salón", "Guardas rencor"], correct: 1 },
  { id: 33, cat: "Convivencia Escolar", emoji: "🏫", text: "En trabajos en grupo, un compañero no colabora. ¿Cómo actúas?", opts: ["Lo insultas", "Haces el trabajo solo", "Hablas con él y buscan solución", "Lo delatas con el profesor"], correct: 2 },
  { id: 34, cat: "Convivencia Escolar", emoji: "🏫", text: "Encuentras un celular perdido en el colegio. ¿Qué haces?", opts: ["Te lo quedas", "Lo entregas a dirección", "Lo escondes", "Lo vendes"], correct: 1 },
  { id: 35, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Cómo manejas la competencia académica?", opts: ["Con honestidad", "Copiando", "Saboteando a otros", "Haciendo trampa"], correct: 0 },
  { id: 36, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Qué haces frente a la presencia del bullying escolar?", opts: ["Participas", "Denuncias", "Ignoras", "Grabas para redes"], correct: 1 },
  { id: 37, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Cómo respetas la propiedad escolar?", opts: ["Cuidando instalaciones", "Rayando paredes", "Robando materiales", "Destruyendo cosas"], correct: 0 },
  { id: 38, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Qué importancia das a las normas del colegio?", opts: ["Las sigo", "Las ignoro", "Las critico siempre", "Las desobedezco"], correct: 0 },
  { id: 39, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Cómo manejas los conflictos generados con compañeros?", opts: ["Con diálogo", "Con golpes", "Con chismes", "Con venganza"], correct: 0 },
  { id: 40, cat: "Convivencia Escolar", emoji: "🏫", text: "¿Qué significa ser excelente estudiante?", opts: ["Solo tener buenas notas", "Ser responsable y respetuoso", "Ser popular", "Engañar a los profesores"], correct: 1 },
];

const CAT_COLORS = {
  "Convivencia Familiar": { bg: "#FFF3E0", accent: "#E65100", text: "#BF360C" },
  "Convivencia Social": { bg: "#E8F5E9", accent: "#2E7D32", text: "#1B5E20" },
  "Convivencia Escolar": { bg: "#E3F2FD", accent: "#1565C0", text: "#0D47A1" },
};

const STORAGE_KEY = "exam_socioemocional_v1";
const USERS_KEY = "exam_users_v1";

function getStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function setStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
}
function setUsers(data) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(data)); } catch {}
}

function userKey(docType, docNum) { return `${docType}__${docNum}`; }

function calcScore(answers) {
  let score = 0;
  QUESTIONS.forEach((q, i) => { if (answers[i] === q.correct) score++; });
  return score;
}

function getLevel(pct) {
  if (pct >= 85) return { label: "Excelente", color: "#2E7D32", emoji: "🌟" };
  if (pct >= 70) return { label: "Bueno", color: "#1565C0", emoji: "✅" };
  if (pct >= 50) return { label: "Regular", color: "#E65100", emoji: "⚠️" };
  return { label: "Necesita mejorar", color: "#C62828", emoji: "📚" };
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── REGISTRATION SCREEN ─────────────────────────────────────────────────────
function RegistrationScreen({ onDone }) {
  const [docType, setDocType] = useState("");
  const [docNum, setDocNum] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1=doc type, 2=doc num, 3=name if new

  function handleCheck() {
    if (!docType) { setError("Selecciona el tipo de documento"); return; }
    if (!docNum.trim()) { setError("Ingresa tu número de documento"); return; }
    setError("");
    const users = getUsers();
    const key = userKey(docType, docNum.trim());
    const storage = getStorage();
    if (users[key] && storage[key]?.finished) {
      setError("⛔ Ya completaste esta prueba. Ve a 'Ver mis resultados' para revisarlos.");
      return;
    }
    if (users[key] && storage[key]?.started) {
      // Resume
      onDone({ docType, docNum: docNum.trim(), name: users[key].name, resuming: true });
      return;
    }
    if (users[key]) {
      onDone({ docType, docNum: docNum.trim(), name: users[key].name });
      return;
    }
    setStep(3);
  }

  function handleStart() {
    if (!name.trim()) { setError("Ingresa tu nombre completo"); return; }
    const users = getUsers();
    const key = userKey(docType, docNum.trim());
    users[key] = { name: name.trim(), docType, docNum: docNum.trim(), registeredAt: Date.now() };
    setUsers(users);
    onDone({ docType, docNum: docNum.trim(), name: name.trim() });
  }

  return (
    <div style={{ minHeight: "100vh", background: `
            radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
            radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
            #020617
        `, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem", color: "#fff" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧠</div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.2rem,4vw,1.6rem)", fontWeight: 700, letterSpacing: -0.5 }}>Diagnóstico Socioemocional</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.8, fontSize: 14 }}>Jaime Meléndez Sambrano · Curso 9°-03</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {step < 3 ? (
            <>
              <h2 style={{ margin: "0 0 1.5rem", fontSize: 18, fontWeight: 600, color: "#1a237e" }}>Verificar identidad</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Tipo de documento</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, background: "#fafafa", outline: "none", cursor: "pointer" }}>
                  <option value="">— Selecciona —</option>
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Número de documento</label>
                <input value={docNum} onChange={e => setDocNum(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCheck()} placeholder="Ej: 1234567890" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              {error && <div style={{ background: "#FFEBEE", color: "#C62828", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{error}</div>}
              <button onClick={handleCheck} style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Continuar →</button>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "#1a237e" }}>¡Registro nuevo!</h2>
              <p style={{ margin: "0 0 1.5rem", fontSize: 13, color: "#777" }}>No encontramos tu documento. Ingresa tu nombre para registrarte.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 }}>Nombre completo</label>
                <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStart()} placeholder="Ej: María García López" style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" }} autoFocus />
              </div>
              {error && <div style={{ background: "#FFEBEE", color: "#C62828", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{error}</div>}
              <button onClick={handleStart} style={{ width: "100%", padding: "13px", background: "#2E7D32", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✅ Registrarme e iniciar examen</button>
              <button onClick={() => { setStep(1); setError(""); }} style={{ width: "100%", padding: "10px", background: "transparent", color: "#888", border: "none", fontSize: 13, cursor: "pointer", marginTop: 8 }}>← Volver</button>
            </>
          )}
          <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid #eee" }}>
            <button onClick={() => onDone({ goLogin: true })} style={{ background: "transparent", border: "none", color: "#1565C0", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>🔍 Ya hice la prueba — Ver mis resultados</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EXAM SCREEN ──────────────────────────────────────────────────────────────
function ExamScreen({ user, onFinish }) {
  const key = userKey(user.docType, user.docNum);
  const storage = getStorage();
  const saved = storage[key] || {};

  const [current, setCurrent] = useState(saved.current ?? 0);
  const [answers, setAnswers] = useState(saved.answers ?? new Array(QUESTIONS.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft ?? EXAM_DURATION);
  const [selected, setSelected] = useState(answers[saved.current ?? 0] ?? -1);
  const [finished, setFinished] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef(null);

  // Save state
  function save(cur, ans, tl) {
    const s = getStorage();
    s[key] = { ...s[key], current: cur, answers: ans, timeLeft: tl, started: true, name: user.name, docType: user.docType, docNum: user.docNum };
    setStorage(s);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        if (next <= 0) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    save(current, answers, timeLeft);
  }, [current, answers, timeLeft]);

  function goTo(idx) {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    save(idx, newAnswers, timeLeft);
    setCurrent(idx);
    setSelected(newAnswers[idx] ?? -1);
  }

  function handleSubmit(auto = false) {
    clearInterval(timerRef.current);
    const finalAnswers = [...answers];
    finalAnswers[current] = selected;
    const score = calcScore(finalAnswers);
    const s = getStorage();
    s[key] = { ...s[key], finished: true, answers: finalAnswers, score, total: QUESTIONS.length, finishedAt: Date.now() };
    setStorage(s);
    setFinished(true);
    onFinish({ score, answers: finalAnswers, name: user.name });
  }

  const pct = Math.round((current / QUESTIONS.length) * 100);
  const q = QUESTIONS[current];
  const col = CAT_COLORS[q.cat];
  const answered = answers.filter(a => a !== -1).length + (selected !== -1 ? (answers[current] === -1 ? 1 : 0) : 0);
  const urgentTime = timeLeft < 600;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FF", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#1a237e", color: "#fff", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>🧠 Diagnóstico Socioemocional</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>{user.name.split(" ")[0]}</span>
          <div style={{ background: urgentTime ? "#C62828" : "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px", fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>⏱ {formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff", padding: "0.7rem 1rem", borderBottom: "1px solid #E8EAF6", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 6, background: "#E8EAF6", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#1565C0", borderRadius: 3, transition: "width 0.3s" }} />
        </div>
        <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>{answered}/{QUESTIONS.length} respondidas</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "1rem" }}>
        {/* Category badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: col.bg, color: col.text, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
          {q.emoji} {q.cat}
        </div>

        {/* Question card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 8, fontWeight: 600 }}>Pregunta {q.id} de {QUESTIONS.length}</div>
          <p style={{ margin: 0, fontSize: "clamp(15px,3.5vw,17px)", fontWeight: 600, lineHeight: 1.5, color: "#1a237e" }}>{q.text}</p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {q.opts.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button key={i} onClick={() => setSelected(i)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: 12, border: isSelected ? `2px solid ${col.accent}` : "1.5px solid #E0E0E0", background: isSelected ? col.bg : "#fff", color: isSelected ? col.text : "#333", fontSize: "clamp(13px,3vw,15px)", fontWeight: isSelected ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: isSelected ? col.accent : "#F0F0F0", color: isSelected ? "#fff" : "#888", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{["A","B","C","D"][i]}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={() => current > 0 && goTo(current - 1)} disabled={current === 0} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #ddd", background: "#fff", color: current === 0 ? "#ccc" : "#333", fontSize: 14, fontWeight: 600, cursor: current === 0 ? "not-allowed" : "pointer" }}>← Anterior</button>
          {current < QUESTIONS.length - 1 ? (
            <button onClick={() => goTo(current + 1)} style={{ flex: 2, padding: "12px", borderRadius: 12, background: "#1565C0", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Siguiente →</button>
          ) : (
            <button onClick={() => setShowConfirm(true)} style={{ flex: 2, padding: "12px", borderRadius: 12, background: "#2E7D32", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✅ Finalizar prueba</button>
          )}
        </div>

        {/* Question map */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "1rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#666" }}>MAPA DE PREGUNTAS</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUESTIONS.map((_, i) => {
              const ans = i === current ? selected : answers[i];
              const isCur = i === current;
              return (
                <button key={i} onClick={() => goTo(i)} style={{ width: 32, height: 32, borderRadius: 8, border: isCur ? "2px solid #1565C0" : "1px solid #E0E0E0", background: isCur ? "#E3F2FD" : ans !== -1 ? "#C8E6C9" : "#F5F5F5", color: isCur ? "#1565C0" : ans !== -1 ? "#2E7D32" : "#999", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{i + 1}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 11, color: "#888" }}>
            <span>🟩 Respondida</span><span>🟦 Actual</span><span>⬜ Sin responder</span>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <h3 style={{ margin: "0 0 8px", color: "#1a237e" }}>¿Finalizar la prueba?</h3>
            <p style={{ margin: "0 0 6px", color: "#555", fontSize: 14 }}>Respondiste {answered} de {QUESTIONS.length} preguntas.</p>
            {answered < QUESTIONS.length && <p style={{ margin: "0 0 20px", color: "#E65100", fontSize: 13 }}>⚠️ Tienes {QUESTIONS.length - answered} preguntas sin responder.</p>}
            {answered === QUESTIONS.length && <p style={{ margin: "0 0 20px", color: "#2E7D32", fontSize: 13 }}>✅ ¡Completaste todas las preguntas!</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #ddd", background: "#fff", fontSize: 14, cursor: "pointer" }}>Revisar</button>
              <button onClick={() => handleSubmit(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#2E7D32", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Entregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({ score, answers, name, onGoLogin }) {
  const total = QUESTIONS.length;
  const pct = Math.round((score / total) * 100);
  const level = getLevel(pct);

  const catStats = {};
  QUESTIONS.forEach((q, i) => {
    if (!catStats[q.cat]) catStats[q.cat] = { correct: 0, total: 0 };
    catStats[q.cat].total++;
    if (answers[i] === q.correct) catStats[q.cat].correct++;
  });

  const msgs = {
    "Excelente": "¡Felicitaciones! Demuestras un desarrollo socioemocional sobresaliente. Eres un ejemplo a seguir en convivencia y valores.",
    "Bueno": "¡Muy bien! Tienes un buen manejo de tus emociones y relaciones. Sigue trabajando para alcanzar la excelencia.",
    "Regular": "Vas por buen camino, pero aún tienes áreas que fortalecer. Con práctica y reflexión puedes mejorar mucho.",
    "Necesita mejorar": "Es momento de reflexionar y buscar apoyo. La educación socioemocional es clave para tu bienestar y el de los demás.",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FF", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ background: "#1a237e", borderRadius: 20, padding: "2rem", textAlign: "center", color: "#fff", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{level.emoji}</div>
          <h2 style={{ margin: "0 0 4px", fontSize: "clamp(1.1rem,4vw,1.5rem)" }}>¡Prueba completada, {name.split(" ")[0]}!</h2>
          <p style={{ margin: "0 0 20px", opacity: 0.8, fontSize: 14 }}>Diagnóstico de Educación Socioemocional</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "1rem 1.5rem" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{score}/{total}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Correctas</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "1rem 1.5rem" }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{pct}%</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Puntaje</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "1rem 1.5rem" }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{level.label}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Nivel</div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.2rem 1.5rem", marginBottom: 16, borderLeft: `4px solid ${level.color}` }}>
          <p style={{ margin: 0, fontSize: 14, color: "#444", lineHeight: 1.7 }}>{msgs[level.label]}</p>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.2rem 1.5rem", marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 15, fontWeight: 700, color: "#1a237e" }}>Resultados por categoría</h3>
          {Object.entries(catStats).map(([cat, stat]) => {
            const cpct = Math.round((stat.correct / stat.total) * 100);
            const col = CAT_COLORS[cat];
            return (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: col.text }}>{cat}</span>
                  <span style={{ color: "#666" }}>{stat.correct}/{stat.total} · {cpct}%</span>
                </div>
                <div style={{ height: 8, background: "#F0F0F0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cpct}%`, background: col.accent, borderRadius: 4, transition: "width 1s" }} />
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={onGoLogin} style={{ width: "100%", padding: "14px", background: "#1565C0", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>🔍 Ver mi perfil completo</button>
      </div>
    </div>
  );
}

// ── LOGIN SCREEN (matches provided login.jsx style) ───────────────────────────
function LoginScreen({ onProfile }) {
  const [docType, setDocType] = useState("");
  const [docNum, setDocNum] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!docType || !docNum.trim()) { setError("Completa todos los campos"); return; }
    const users = getUsers();
    const key = userKey(docType, docNum.trim());
    const storage = getStorage();
    if (!users[key] || !storage[key]) { setError("No encontramos esa identificación. ¿Ya realizaste la prueba?"); return; }
    onProfile({ ...users[key], ...storage[key] });
  }

  return (
    <div className="cx-login-wrapper" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #283593 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1rem" }}>
      <div style={{ display: "flex", background: "#fff", borderRadius: 24, overflow: "hidden", maxWidth: 860, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", minHeight: 480 }}>
        {/* Left panel */}
        <div style={{ flex: 1, background: "linear-gradient(135deg, #1a237e, #283593)", color: "#fff", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", minWidth: 0 }} className="cx-login-left">
          <div style={{ fontSize: 52, marginBottom: 16 }}>🧠</div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(1rem,3vw,1.3rem)", fontWeight: 800, letterSpacing: -0.5 }}>JAIME MELÉNDEZ SAMBRANO</h1>
          <div style={{ width: 40, height: 3, background: "#90CAF9", borderRadius: 2, margin: "10px auto" }} />
          <p style={{ margin: 0, opacity: 0.85, fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.6 }}>Bienvenido a un espacio dedicado al conocimiento, la investigación y el desarrollo integral de estudiantes comprometidos con la excelencia.</p>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#1a237e" }}>Ver mis resultados</h3>
          <span style={{ color: "#888", fontSize: 13, display: "block", marginBottom: 28 }}>Ingresa tu documento para acceder</span>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6, letterSpacing: 0.5 }}>TIPO DE DOCUMENTO</label>
            <select value={docType} onChange={e => setDocType(e.target.value)} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0E0E0", fontSize: 14, outline: "none", background: "#FAFAFA" }}>
              <option value="">— Selecciona —</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6, letterSpacing: 0.5 }}>NÚMERO DE DOCUMENTO</label>
            <input value={docNum} onChange={e => setDocNum(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Ej: 1234567890" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E0E0E0", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>

          {error && <div style={{ background: "#FFEBEE", color: "#C62828", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 }}>{error}</div>}

          <button onClick={handleLogin} style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>Acceder a mis resultados →</button>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => onProfile({ goExam: true })} style={{ background: "transparent", border: "none", color: "#1565C0", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>← Ir a realizar la prueba</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ userData, onBack }) {
  const score = userData.score ?? 0;
  const total = userData.total ?? QUESTIONS.length;
  const pct = Math.round((score / total) * 100);
  const level = getLevel(pct);
  const answers = userData.answers ?? [];

  const catStats = {};
  QUESTIONS.forEach((q, i) => {
    if (!catStats[q.cat]) catStats[q.cat] = { correct: 0, total: 0 };
    catStats[q.cat].total++;
    if (answers[i] === q.correct) catStats[q.cat].correct++;
  });

  const date = userData.finishedAt ? new Date(userData.finishedAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `
            radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
            radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
            #020617
        `, color: "#fff", padding: "1.5rem 1rem 4rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1, marginBottom: 4 }}>PERFIL DE RESULTADOS</div>
            <h1 style={{ margin: 0, fontSize: "clamp(1.1rem,4vw,1.5rem)", fontWeight: 800 }}>{userData.name}</h1>
            <p style={{ margin: "4px 0 0", opacity: 0.75, fontSize: 13 }}>{userData.docType} · {userData.docNum}</p>
          </div>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>← Salir</button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "-2.5rem auto 0", padding: "0 1rem 2rem" }}>
        {/* Score card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "1.5rem", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>{level.emoji}</div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Resultado final</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1a237e" }}>{score}/{total} <span style={{ fontSize: 16, fontWeight: 400, color: "#888" }}>· {pct}%</span></div>
              <div style={{ display: "inline-block", background: level.color, color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{level.label}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#aaa" }}>Fecha</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{date}</div>
            </div>
          </div>
        </div>

        {/* Category bars */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.2rem 1.5rem", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 14, fontWeight: 700, color: "#1a237e", letterSpacing: 0.5 }}>RESULTADOS POR ÁREA</h3>
          {Object.entries(catStats).map(([cat, stat]) => {
            const cpct = Math.round((stat.correct / stat.total) * 100);
            const col = CAT_COLORS[cat];
            const lv = getLevel(cpct);
            return (
              <div key={cat} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: col.text }}>{cat}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{stat.correct}/{stat.total} · {cpct}% · <b style={{ color: lv.color }}>{lv.label}</b></span>
                </div>
                <div style={{ height: 10, background: "#F0F0F0", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${cpct}%`, background: col.accent, borderRadius: 5 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Q detail */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.2rem 1.5rem", marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 14, fontWeight: 700, color: "#1a237e" }}>DETALLE DE RESPUESTAS</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUESTIONS.map((q, i) => {
              const given = answers[i];
              const ok = given === q.correct;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 10, background: ok ? "#F1F8E9" : "#FFF8E1" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{ok ? "✅" : "❌"}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 2 }}>{q.id}. {q.cat}</div>
                    <div style={{ fontSize: 13, color: "#333", marginBottom: 4 }}>{q.text}</div>
                    {!ok && given !== -1 && <div style={{ fontSize: 12, color: "#E65100" }}>Tu respuesta: <b>{q.opts[given]}</b></div>}
                    {!ok && <div style={{ fontSize: 12, color: "#2E7D32" }}>Correcta: <b>{q.opts[q.correct]}</b></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function Examen() {
  const [screen, setScreen] = useState("register"); // register | exam | results | login | profile
  const [user, setUser] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Check if in middle of exam on mount
  useEffect(() => {
    const storage = getStorage();
    const users = getUsers();
    // Nothing special on mount — user must verify
  }, []);

  function handleRegDone({ docType, docNum, name, resuming, goLogin }) {
    if (goLogin) { setScreen("login"); return; }
    setUser({ docType, docNum, name });
    setScreen("exam");
  }

  function handleExamFinish({ score, answers, name }) {
    setExamResult({ score, answers, name });
    setScreen("results");
  }

  function handleGoLogin() {
    setScreen("login");
  }

  function handleProfile(data) {
    if (data.goExam) { setScreen("register"); return; }
    setProfileData(data);
    setScreen("profile");
  }

  if (screen === "register") return <RegistrationScreen onDone={handleRegDone} />;
  if (screen === "exam" && user) return <ExamScreen user={user} onFinish={handleExamFinish} />;
  if (screen === "results" && examResult) return <ResultsScreen {...examResult} onGoLogin={handleGoLogin} />;
  if (screen === "login") return <LoginScreen onProfile={handleProfile} />;
  if (screen === "profile" && profileData) return <ProfileScreen userData={profileData} onBack={() => setScreen("login")} />;

  return <RegistrationScreen onDone={handleRegDone} />;
}