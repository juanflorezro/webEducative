import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "exam_socioemocional_v1";
const USERS_KEY = "exam_users_v1";
const ADMIN_KEY = "exam_admin_v1";
const ADMIN_PASS = "admin2024";

const QUESTIONS = [
  { id:1,cat:"Convivencia Familiar",text:"Cuando tus padres te dan una opinión diferente a la tuya, ¿qué debes hacer?",opts:["Ignorarlos completamente","Discutir y enojarte","Escuchar respetuosamente","Hacer lo contrario"],correct:2},
  { id:2,cat:"Convivencia Familiar",text:"Tu hermano menor rompió accidentalmente tu celular.",opts:["Golpearlo","Gritarle y humillarlo","Hablar con calma y buscar solución","Contárselo a todos"],correct:2},
  { id:3,cat:"Convivencia Familiar",text:"Si tus padres se encuentran discutiendo.",opts:["Interrumpir y tomar partido","Gritar más fuerte","Escuchar y expresar opinión calmadamente","Salir de la casa"],correct:2},
  { id:4,cat:"Convivencia Familiar",text:"Tu madre te pide ayuda con quehaceres pero tienes tarea.",opts:["Ignorarla","Ayudar primero y luego tarea","Decirle que ella debe hacerlo","Enojarte"],correct:1},
  { id:5,cat:"Convivencia Familiar",text:"Un familiar hace un comentario negativo sobre ti.",opts:["Lo insultas","Te vas llorando","Respondes educadamente","Guardas resentimiento"],correct:2},
  { id:6,cat:"Convivencia Familiar",text:"Tu familia no tiene dinero para algo que quieres.",opts:["Haces berrinche","Entiendes la situación","Culpas a tus padres","Robas el dinero"],correct:1},
  { id:7,cat:"Convivencia Familiar",text:"Tus padres te castigan por mala nota.",opts:["Rebelarte","Aceptar y mejorar","Mentir sobre notas","Vengarte"],correct:1},
  { id:8,cat:"Convivencia Familiar",text:"Un hermano te acusa de algo que no hiciste.",opts:["Lo acusas también","Discutes violentamente","Mantienes calma y explicas","Te vengas"],correct:2},
  { id:9,cat:"Convivencia Familiar",text:"Tu familia celebra un logro tuyo.",opts:["Vergüenza","Orgullo y gratitud","Indiferencia","Molestia"],correct:1},
  { id:10,cat:"Convivencia Familiar",text:"¿Cómo muestras afecto a tu familia?",opts:["Con palabras y acciones","Ignorándolos","Solo con regalos","Nunca"],correct:0},
  { id:11,cat:"Convivencia Familiar",text:"Un padre está estresado por el trabajo.",opts:["Le pides más","Le causas problemas","Le ofreces apoyo","Lo ignoras"],correct:2},
  { id:12,cat:"Convivencia Familiar",text:"¿Qué haces cuando un familiar está enfermo?",opts:["Lo evitas","Te quejas","Lo cuidas y apoyas","Aprovechas"],correct:2},
  { id:13,cat:"Convivencia Familiar",text:"¿Cómo manejas los secretos familiares?",opts:["Los cuentas","Los usas","Los respetas","Los olvidas"],correct:2},
  { id:14,cat:"Convivencia Familiar",text:"¿Qué importancia das a las tradiciones familiares?",opts:["Ninguna","Mucha, las valoro","Solo si me benefician","Las critico"],correct:1},
  { id:15,cat:"Convivencia Familiar",text:"¿Cómo resuelves conflictos con tus hermanos?",opts:["Con violencia","Con diálogo","Involucrando padres","Guardando rencor"],correct:1},
  { id:16,cat:"Convivencia Familiar",text:"¿Qué haces cuando un familiar te pide un favor?",opts:["Siempre ayudas","Siempre dices no","Solo si pagan","Finges no escuchar"],correct:0},
  { id:17,cat:"Convivencia Familiar",text:"¿Cómo manejas la privacidad en familia?",opts:["Respetando espacios","Entrando sin llamar","Revisando cosas ajenas","Contando a extraños"],correct:0},
  { id:18,cat:"Convivencia Familiar",text:"¿Qué valoras más en tu familia?",opts:["El dinero","El apoyo emocional","Los regalos","Libertad total"],correct:1},
  { id:19,cat:"Convivencia Familiar",text:"¿Cómo contribuyes al bienestar familiar?",opts:["Cumpliendo responsabilidades","No contribuyo","Creando problemas","Solo obligado"],correct:0},
  { id:20,cat:"Convivencia Familiar",text:"¿Qué aprendes de tu familia?",opts:["Valores y conductas","Solo cosas malas","Nada importante","Cómo ser egoísta"],correct:0},
  { id:21,cat:"Convivencia Social",text:"En el bus ves a un adulto mayor de pie.",opts:["Ignorarlo","Reírme","Ceder mi silla","Pedirle que se aleje"],correct:2},
  { id:22,cat:"Convivencia Social",text:"Un amigo te cuenta un secreto importante.",opts:["Se lo cuentas a todos","Lo guardas","Lo usas para molestar","Se lo cuentas a sus padres"],correct:1},
  { id:23,cat:"Convivencia Social",text:"Ves que alguien está siendo acosado.",opts:["Te unes al acoso","Ignoras","Defiendes a la persona","Grabas para redes"],correct:2},
  { id:24,cat:"Convivencia Social",text:"Un desconocido te pide ayuda en la calle.",opts:["Lo ignoras","Ayudas con precaución","Le gritas","Llamas a la policía"],correct:1},
  { id:25,cat:"Convivencia Social",text:"¿Cómo manejas las diferencias culturales?",opts:["Las respetas","Las criticas","Las ignoras","Te burlas"],correct:0},
  { id:26,cat:"Convivencia Social",text:"En una fila, alguien se cuela.",opts:["Lo empujas","Le llamas atención","Te cuelas tú","Gritas insultos"],correct:1},
  { id:27,cat:"Convivencia Social",text:"¿Cómo actúas ante personas con discapacidad?",opts:["Te burlas","Ofreces ayuda","Las evitas","Finges no verlas"],correct:1},
  { id:28,cat:"Convivencia Social",text:"¿Qué haces con la basura en espacios públicos?",opts:["La arrojo","La guardas","La escondes","La dejas"],correct:1},
  { id:29,cat:"Convivencia Social",text:"¿Cómo manejas conflictos con vecinos?",opts:["Con diálogo","Con violencia","Con venganza","Con indiferencia"],correct:0},
  { id:30,cat:"Convivencia Social",text:"¿Qué significa ser buen ciudadano?",opts:["Cumplir normas","Hacer lo que quieras","Solo pensar en uno","Evadir responsabilidades"],correct:0},
  { id:31,cat:"Convivencia Escolar",text:"Un compañero se burla de otro por calificaciones.",opts:["Unirte a la burla","Ignorar","Defender al compañero","Contárselo al profesor"],correct:2},
  { id:32,cat:"Convivencia Escolar",text:"El profesor te llama la atención injustamente.",opts:["Le gritas","Escuchas y explicas","Te vas","Guardas rencor"],correct:1},
  { id:33,cat:"Convivencia Escolar",text:"En trabajos en grupo, un compañero no colabora.",opts:["Lo insultas","Haces solo","Hablas y buscan solución","Lo delatas"],correct:2},
  { id:34,cat:"Convivencia Escolar",text:"Encuentras un celular perdido en el colegio.",opts:["Te lo quedas","Lo entregas","Lo escondes","Lo vendes"],correct:1},
  { id:35,cat:"Convivencia Escolar",text:"¿Cómo manejas la competencia académica?",opts:["Con honestidad","Copiando","Saboteando","Haciendo trampa"],correct:0},
  { id:36,cat:"Convivencia Escolar",text:"¿Qué haces frente al bullying escolar?",opts:["Participas","Denuncias","Ignoras","Grabas"],correct:1},
  { id:37,cat:"Convivencia Escolar",text:"¿Cómo respetas la propiedad escolar?",opts:["Cuidando instalaciones","Rayando paredes","Robando materiales","Destruyendo"],correct:0},
  { id:38,cat:"Convivencia Escolar",text:"¿Qué importancia das a las normas del colegio?",opts:["Las sigo","Las ignoro","Las critico","Las desobedezco"],correct:0},
  { id:39,cat:"Convivencia Escolar",text:"¿Cómo manejas conflictos con compañeros?",opts:["Con diálogo","Con golpes","Con chismes","Con venganza"],correct:0},
  { id:40,cat:"Convivencia Escolar",text:"¿Qué significa ser excelente estudiante?",opts:["Solo buenas notas","Ser responsable y respetuoso","Ser popular","Engañar profesores"],correct:1},
];

const CATS = ["Convivencia Familiar","Convivencia Social","Convivencia Escolar"];
const CAT_COLORS = { "Convivencia Familiar":"#E65100", "Convivencia Social":"#2E7D32", "Convivencia Escolar":"#1565C0" };
const CAT_BG = { "Convivencia Familiar":"#FFF3E0", "Convivencia Social":"#E8F5E9", "Convivencia Escolar":"#E3F2FD" };

function getLevel(pct) {
  if (pct >= 85) return { label:"Excelente", color:"#2E7D32", bg:"#E8F5E9" };
  if (pct >= 70) return { label:"Bueno", color:"#1565C0", bg:"#E3F2FD" };
  if (pct >= 50) return { label:"Regular", color:"#E65100", bg:"#FFF3E0" };
  return { label:"Necesita mejorar", color:"#C62828", bg:"#FFEBEE" };
}

function getData() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.entries(users).map(([key, user]) => {
      const exam = storage[key] || {};
      return { key, ...user, ...exam, pct: exam.score != null ? Math.round((exam.score / (exam.total || 40)) * 100) : null };
    });
  } catch { return []; }
}

function saveData(key, examData) {
  try {
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    storage[key] = { ...storage[key], ...examData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch {}
}

function deleteUser(key) {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    delete users[key];
    delete storage[key];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch {}
}

function resetExam(key) {
  try {
    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (storage[key]) {
      storage[key] = { name: storage[key].name, docType: storage[key].docType, docNum: storage[key].docNum };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch {}
}

function exportCSV(data) {
  const rows = [["Nombre","Tipo Doc","Número","Puntaje","Total","Porcentaje","Nivel","Fecha","Familiar","Social","Escolar"]];
  data.forEach(u => {
    if (!u.finished) return;
    const answers = u.answers || [];
    const catScores = {};
    CATS.forEach(c => { catScores[c] = { correct:0, total:0 }; });
    QUESTIONS.forEach((q,i) => {
      catScores[q.cat].total++;
      if (answers[i] === q.correct) catScores[q.cat].correct++;
    });
    const lv = getLevel(u.pct || 0);
    rows.push([
      u.name, u.docType, u.docNum,
      u.score, u.total || 40, (u.pct||0)+"%", lv.label,
      u.finishedAt ? new Date(u.finishedAt).toLocaleDateString("es-CO") : "",
      Math.round((catScores["Convivencia Familiar"].correct/20)*100)+"%",
      Math.round((catScores["Convivencia Social"].correct/10)*100)+"%",
      Math.round((catScores["Convivencia Escolar"].correct/10)*100)+"%",
    ]);
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="resultados_socioemocional.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ── MINI BAR CHART ──────────────────────────────────────────────────────────
function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:8, background:"#F0F0F0", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:4 }} />
      </div>
      <span style={{ fontSize:12, fontWeight:700, color, minWidth:36, textAlign:"right" }}>{pct}%</span>
    </div>
  );
}

// ── LOGIN ───────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  function tryLogin() {
    if (pass === ADMIN_PASS) onLogin();
    else setErr("Contraseña incorrecta");
  }
  return (
    <div style={{ minHeight:"100vh", background:"#0D1B2A", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", padding:"1rem" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"2.5rem", maxWidth:380, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"#0D1B2A", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24 }}>⚙️</div>
          <h1 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:"#0D1B2A" }}>Panel Administrador</h1>
          <p style={{ margin:0, fontSize:13, color:"#888" }}>Diagnóstico Socioemocional · 9°-03</p>
        </div>
        <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#555", marginBottom:6 }}>CONTRASEÑA DE ACCESO</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()} placeholder="••••••••" style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #E0E0E0", fontSize:14, boxSizing:"border-box", marginBottom:12 }} autoFocus />
        {err && <div style={{ color:"#C62828", fontSize:13, marginBottom:10 }}>⚠ {err}</div>}
        <button onClick={tryLogin} style={{ width:"100%", padding:"13px", background:"#0D1B2A", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>Ingresar →</button>
        <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#aaa" }}>Contraseña por defecto: <code>admin2024</code></p>
      </div>
    </div>
  );
}

// ── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color="#0D1B2A" }) {
  return (
    <div style={{ background:"#F8F9FA", borderRadius:14, padding:"1rem 1.2rem" }}>
      <div style={{ fontSize:12, color:"#888", marginBottom:4, fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

// ── REPORT VIEW ─────────────────────────────────────────────────────────────
function ReportView({ data }) {
  const finished = data.filter(u => u.finished);
  if (finished.length === 0) return (
    <div style={{ padding:"3rem", textAlign:"center", color:"#888" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
      <p>Aún no hay estudiantes que hayan completado la prueba.</p>
    </div>
  );

  const avg = Math.round(finished.reduce((s,u)=>s+(u.pct||0),0)/finished.length);
  const levels = { "Excelente":0, "Bueno":0, "Regular":0, "Necesita mejorar":0 };
  finished.forEach(u => { const lv=getLevel(u.pct||0); levels[lv.label]++; });

  const catStats = {};
  CATS.forEach(c => { catStats[c]={ correct:0, total:0 }; });
  finished.forEach(u => {
    const answers = u.answers || [];
    QUESTIONS.forEach((q,i) => {
      catStats[q.cat].total++;
      if (answers[i]===q.correct) catStats[q.cat].correct++;
    });
  });

  const qStats = QUESTIONS.map((q,i) => {
    let correct=0, attempted=0;
    finished.forEach(u => {
      if ((u.answers||[])[i] !== undefined && u.answers[i] !== -1) attempted++;
      if ((u.answers||[])[i] === q.correct) correct++;
    });
    return { ...q, correct, attempted, pct: attempted>0?Math.round((correct/attempted)*100):0 };
  });

  const hardest = [...qStats].sort((a,b)=>a.pct-b.pct).slice(0,5);
  const easiest = [...qStats].sort((a,b)=>b.pct-a.pct).slice(0,5);

  const conclusions = [];
  if (avg >= 85) conclusions.push({ icon:"🌟", text:`El grupo muestra un nivel EXCELENTE (${avg}% promedio). La mayoría de estudiantes han interiorizado valores socioemocionales sólidos.` });
  else if (avg >= 70) conclusions.push({ icon:"✅", text:`El grupo tiene un desempeño BUENO (${avg}% promedio). Existe una base sólida aunque hay áreas con oportunidad de mejora.` });
  else if (avg >= 50) conclusions.push({ icon:"⚠️", text:`El grupo está en nivel REGULAR (${avg}% promedio). Se requieren estrategias de intervención focalizadas en las áreas débiles.` });
  else conclusions.push({ icon:"🚨", text:`El grupo NECESITA MEJORA URGENTE (${avg}% promedio). Se recomienda un programa intensivo de educación socioemocional.` });

  const weakCat = Object.entries(catStats).sort((a,b)=>(a[1].correct/a[1].total)-(b[1].correct/b[1].total))[0];
  const weakPct = Math.round((weakCat[1].correct/weakCat[1].total)*100);
  conclusions.push({ icon:"🎯", text:`El área más débil es "${weakCat[0]}" con ${weakPct}%. Se recomienda priorizar talleres, actividades lúdicas y reflexión grupal en esta dimensión.` });

  if (levels["Necesita mejorar"] > finished.length*0.3) conclusions.push({ icon:"👥", text:`El ${Math.round((levels["Necesita mejorar"]/finished.length)*100)}% de estudiantes necesita atención personalizada. Se sugiere acompañamiento por parte de orientación escolar.` });
  if (levels["Excelente"] > finished.length*0.4) conclusions.push({ icon:"💡", text:`El ${Math.round((levels["Excelente"]/finished.length)*100)}% alcanzó nivel Excelente. Estos estudiantes pueden actuar como líderes socioemocionales del grupo.` });
  if (hardest[0].pct < 40) conclusions.push({ icon:"📚", text:`La pregunta con más errores: "${hardest[0].text.substring(0,60)}..." (${hardest[0].pct}% aciertos). Indica dificultad en situaciones prácticas de convivencia.` });

  const lvColors = { "Excelente":"#2E7D32","Bueno":"#1565C0","Regular":"#E65100","Necesita mejorar":"#C62828" };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        <StatCard label="Estudiantes evaluados" value={finished.length} sub={`de ${data.length} registrados`} />
        <StatCard label="Promedio general" value={`${avg}%`} color={getLevel(avg).color} sub={getLevel(avg).label} />
        <StatCard label="Puntaje máximo" value={`${Math.max(...finished.map(u=>u.pct||0))}%`} color="#2E7D32" />
        <StatCard label="Puntaje mínimo" value={`${Math.min(...finished.map(u=>u.pct||0))}%`} color="#C62828" />
      </div>

      {/* Distribution */}
      <div style={{ background:"#fff", borderRadius:16, border:"0.5px solid #E0E0E0", padding:"1.2rem 1.5rem", marginBottom:20 }}>
        <h3 style={{ margin:"0 0 1rem", fontSize:14, fontWeight:700, color:"#0D1B2A" }}>DISTRIBUCIÓN POR NIVEL</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10 }}>
          {Object.entries(levels).map(([lv, count]) => (
            <div key={lv} style={{ background:getLevel(lv==="Excelente"?90:lv==="Bueno"?75:lv==="Regular"?60:30).bg, borderRadius:12, padding:"12px 14px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:lvColors[lv] }}>{count}</div>
              <div style={{ fontSize:11, fontWeight:700, color:lvColors[lv], marginTop:2 }}>{lv}</div>
              <div style={{ fontSize:11, color:"#888" }}>{finished.length>0?Math.round((count/finished.length)*100):0}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category scores */}
      <div style={{ background:"#fff", borderRadius:16, border:"0.5px solid #E0E0E0", padding:"1.2rem 1.5rem", marginBottom:20 }}>
        <h3 style={{ margin:"0 0 1rem", fontSize:14, fontWeight:700, color:"#0D1B2A" }}>RENDIMIENTO POR ÁREA</h3>
        {CATS.map(cat => {
          const s = catStats[cat];
          const p = Math.round((s.correct/s.total)*100);
          return (
            <div key={cat} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
                <span style={{ fontWeight:700, color:CAT_COLORS[cat] }}>{cat}</span>
                <span style={{ color:"#888" }}>{s.correct}/{s.total} respuestas correctas · {p}%</span>
              </div>
              <MiniBar value={s.correct} max={s.total} color={CAT_COLORS[cat]} />
            </div>
          );
        })}
      </div>

      {/* Hardest/Easiest */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:20 }}>
        <div style={{ background:"#fff", borderRadius:16, border:"0.5px solid #E0E0E0", padding:"1.2rem 1.5rem" }}>
          <h3 style={{ margin:"0 0 1rem", fontSize:14, fontWeight:700, color:"#C62828" }}>⚠ PREGUNTAS MÁS DIFÍCILES</h3>
          {hardest.map(q => (
            <div key={q.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:"0.5px solid #F0F0F0" }}>
              <div style={{ fontSize:12, color:"#888", marginBottom:2 }}>P{q.id} · {q.cat}</div>
              <div style={{ fontSize:12, color:"#333", marginBottom:4, lineHeight:1.4 }}>{q.text.substring(0,70)}{q.text.length>70?"...":""}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${q.pct}%`, background:"#C62828", borderRadius:3 }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:"#C62828" }}>{q.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:"#fff", borderRadius:16, border:"0.5px solid #E0E0E0", padding:"1.2rem 1.5rem" }}>
          <h3 style={{ margin:"0 0 1rem", fontSize:14, fontWeight:700, color:"#2E7D32" }}>✅ PREGUNTAS CON MEJOR RESULTADO</h3>
          {easiest.map(q => (
            <div key={q.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:"0.5px solid #F0F0F0" }}>
              <div style={{ fontSize:12, color:"#888", marginBottom:2 }}>P{q.id} · {q.cat}</div>
              <div style={{ fontSize:12, color:"#333", marginBottom:4, lineHeight:1.4 }}>{q.text.substring(0,70)}{q.text.length>70?"...":""}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${q.pct}%`, background:"#2E7D32", borderRadius:3 }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:"#2E7D32" }}>{q.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusions */}
      <div style={{ background:"#0D1B2A", borderRadius:16, padding:"1.5rem" }}>
        <h3 style={{ margin:"0 0 1.2rem", fontSize:14, fontWeight:700, color:"#fff", letterSpacing:0.5 }}>CONCLUSIONES Y RECOMENDACIONES PEDAGÓGICAS</h3>
        {conclusions.map((c,i) => (
          <div key={i} style={{ display:"flex", gap:12, marginBottom:14, padding:"12px 14px", background:"rgba(255,255,255,0.07)", borderRadius:10 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{c.icon}</span>
            <p style={{ margin:0, fontSize:13, color:"#E0E0E0", lineHeight:1.6 }}>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STUDENT DETAIL MODAL ────────────────────────────────────────────────────
function StudentDetail({ user, onClose, onReset, onDelete }) {
  const answers = user.answers || [];
  const catStats = {};
  CATS.forEach(c => { catStats[c]={ correct:0, total:0 }; });
  QUESTIONS.forEach((q,i) => {
    catStats[q.cat].total++;
    if (answers[i]===q.correct) catStats[q.cat].correct++;
  });
  const lv = getLevel(user.pct||0);

  return (
    <div style={{ background:"rgba(0,0,0,0.55)", position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"2rem", overflow:"auto" }}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:600, width:"calc(100% - 2rem)", margin:"0 1rem 2rem", fontFamily:"'Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"#0D1B2A", padding:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:18 }}>{user.name}</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:13 }}>{user.docType} · {user.docNum}</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", width:36, height:36, borderRadius:10, cursor:"pointer", fontSize:18 }}>×</button>
        </div>

        <div style={{ padding:"1.5rem" }}>
          {user.finished ? (
            <>
              <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:100, background:"#F8F9FA", borderRadius:12, padding:"1rem", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:lv.color }}>{user.score}/{user.total||40}</div>
                  <div style={{ fontSize:12, color:"#888" }}>Puntaje</div>
                </div>
                <div style={{ flex:1, minWidth:100, background:"#F8F9FA", borderRadius:12, padding:"1rem", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:lv.color }}>{user.pct}%</div>
                  <div style={{ fontSize:12, color:"#888" }}>Porcentaje</div>
                </div>
                <div style={{ flex:1, minWidth:100, background:lv.bg, borderRadius:12, padding:"1rem", textAlign:"center" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:lv.color }}>{lv.label}</div>
                  <div style={{ fontSize:12, color:"#888" }}>Nivel</div>
                </div>
              </div>

              {CATS.map(cat => {
                const s = catStats[cat];
                const p = Math.round((s.correct/s.total)*100);
                return (
                  <div key={cat} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                      <span style={{ fontWeight:700, color:CAT_COLORS[cat] }}>{cat}</span>
                      <span style={{ color:"#888" }}>{s.correct}/{s.total} · {p}%</span>
                    </div>
                    <MiniBar value={s.correct} max={s.total} color={CAT_COLORS[cat]} />
                  </div>
                );
              })}

              <div style={{ marginTop:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:8 }}>RESPUESTA POR PREGUNTA</div>
                <div style={{ maxHeight:200, overflow:"auto", borderRadius:10, border:"0.5px solid #E0E0E0" }}>
                  {QUESTIONS.map((q,i) => {
                    const ok = answers[i]===q.correct;
                    return (
                      <div key={i} style={{ padding:"8px 12px", borderBottom:"0.5px solid #F0F0F0", display:"flex", gap:8, alignItems:"flex-start", background:ok?"#F1F8E9":"#FFF8E1" }}>
                        <span style={{ fontSize:14, flexShrink:0 }}>{ok?"✅":"❌"}</span>
                        <div style={{ flex:1 }}>
                          <span style={{ fontSize:11, color:"#888" }}>P{q.id}</span>
                          <span style={{ fontSize:12, color:"#333", marginLeft:6 }}>{q.text.substring(0,55)}...</span>
                          {!ok && answers[i]!=-1 && <div style={{ fontSize:11, color:"#E65100", marginTop:2 }}>Respondió: <b>{q.opts[answers[i]]}</b> | Correcta: <b>{q.opts[q.correct]}</b></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"2rem 0", color:"#888" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>{user.started?"⏳":"📋"}</div>
              <p style={{ fontWeight:600, color:"#555" }}>{user.started?"Prueba en progreso":"Prueba no iniciada"}</p>
              {user.started && <p style={{ fontSize:13 }}>Ha respondido {(user.answers||[]).filter(a=>a!==-1).length} de 40 preguntas</p>}
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:20, paddingTop:16, borderTop:"0.5px solid #E0E0E0" }}>
            <button onClick={()=>{ if(window.confirm("¿Resetear prueba? El estudiante podrá volver a realizarla.")) onReset(); }} style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #E65100", background:"#FFF3E0", color:"#E65100", fontSize:13, fontWeight:700, cursor:"pointer" }}>↺ Resetear prueba</button>
            <button onClick={()=>{ if(window.confirm("¿Eliminar completamente este registro?")) onDelete(); }} style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #C62828", background:"#FFEBEE", color:"#C62828", fontSize:13, fontWeight:700, cursor:"pointer" }}>🗑 Eliminar registro</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [data, setData] = useState([]);
  const [view, setView] = useState("students"); // students | report
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selected, setSelected] = useState(null);

  function refresh() { setData(getData()); }
  useEffect(() => { refresh(); }, []);

  const filtered = data
    .filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.docNum?.includes(q);
      const matchStatus = filterStatus==="all" || (filterStatus==="finished"&&u.finished) || (filterStatus==="progress"&&u.started&&!u.finished) || (filterStatus==="pending"&&!u.started&&!u.finished);
      return matchSearch && matchStatus;
    })
    .sort((a,b) => {
      if (sortBy==="name") return (a.name||"").localeCompare(b.name||"");
      if (sortBy==="score") return (b.pct||0)-(a.pct||0);
      if (sortBy==="date") return (b.finishedAt||0)-(a.finishedAt||0);
      return 0;
    });

  const finished = data.filter(u=>u.finished);
  const inProgress = data.filter(u=>u.started&&!u.finished);

  const tabs = [
    { id:"students", label:"Estudiantes", icon:"ti-users" },
    { id:"report", label:"Reporte y conclusiones", icon:"ti-chart-bar" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F4F6F9", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Sidebar + content layout */}
      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* Sidebar */}
        <div style={{ width:220, background:"#0D1B2A", display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"1.5rem 1.2rem", borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:1, marginBottom:4 }}>ADMINISTRADOR</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Panel de Control</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2 }}>Diagnóstico Socioemocional</div>
          </div>
          <nav style={{ flex:1, padding:"1rem 0.8rem" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setView(t.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", background:view===t.id?"rgba(255,255,255,0.12)":"transparent", color:view===t.id?"#fff":"rgba(255,255,255,0.5)", fontSize:13, fontWeight:view===t.id?700:400, cursor:"pointer", marginBottom:4, textAlign:"left" }}>
                <i className={`ti ${t.icon}`} style={{ fontSize:18 }} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ padding:"1rem 0.8rem", borderTop:"0.5px solid rgba(255,255,255,0.08)" }}>
            <button onClick={()=>exportCSV(data)} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:10, border:"none", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer", marginBottom:6, textAlign:"left" }}>
              <i className="ti ti-download" style={{ fontSize:16 }} aria-hidden="true" /> Exportar CSV
            </button>
            <button onClick={onLogout} style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:10, border:"none", background:"transparent", color:"rgba(255,255,255,0.4)", fontSize:12, cursor:"pointer", textAlign:"left" }}>
              <i className="ti ti-logout" style={{ fontSize:16 }} aria-hidden="true" /> Cerrar sesión
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          {/* Top bar */}
          <div style={{ background:"#fff", padding:"1rem 1.5rem", borderBottom:"0.5px solid #E0E0E0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:"#0D1B2A" }}>
              {view==="students"?"Gestión de Estudiantes":"Reporte General y Conclusiones"}
            </h2>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontSize:12, color:"#888" }}>{data.length} registrados · {finished.length} completados</span>
              <button onClick={refresh} style={{ padding:"6px 12px", borderRadius:8, border:"0.5px solid #E0E0E0", background:"#fff", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                <i className="ti ti-refresh" style={{ fontSize:14 }} aria-hidden="true" /> Actualizar
              </button>
            </div>
          </div>

          {/* Metric strip */}
          <div style={{ padding:"1rem 1.5rem", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10 }}>
            <StatCard label="Total registrados" value={data.length} />
            <StatCard label="Completaron" value={finished.length} color="#2E7D32" sub={data.length>0?`${Math.round((finished.length/data.length)*100)}% del grupo`:""} />
            <StatCard label="En progreso" value={inProgress.length} color="#E65100" />
            <StatCard label="Promedio grupo" value={finished.length>0?`${Math.round(finished.reduce((s,u)=>s+(u.pct||0),0)/finished.length)}%`:"—"} color="#1565C0" sub={finished.length>0?getLevel(Math.round(finished.reduce((s,u)=>s+(u.pct||0),0)/finished.length)).label:""} />
          </div>

          <div style={{ flex:1, padding:"0 1.5rem 1.5rem" }}>
            {view==="students" && (
              <>
                {/* Filters */}
                <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o documento..." style={{ flex:1, minWidth:180, padding:"9px 12px", borderRadius:10, border:"0.5px solid #E0E0E0", fontSize:13 }} />
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:"9px 12px", borderRadius:10, border:"0.5px solid #E0E0E0", fontSize:13, background:"#fff" }}>
                    <option value="all">Todos</option>
                    <option value="finished">Completados</option>
                    <option value="progress">En progreso</option>
                    <option value="pending">Pendientes</option>
                  </select>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:"9px 12px", borderRadius:10, border:"0.5px solid #E0E0E0", fontSize:13, background:"#fff" }}>
                    <option value="name">Ordenar: Nombre</option>
                    <option value="score">Ordenar: Puntaje</option>
                    <option value="date">Ordenar: Fecha</option>
                  </select>
                </div>

                {/* Table */}
                <div style={{ background:"#fff", borderRadius:16, border:"0.5px solid #E0E0E0", overflow:"hidden" }}>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed" }}>
                      <colgroup>
                        <col style={{ width:"25%" }} />
                        <col style={{ width:"18%" }} />
                        <col style={{ width:"14%" }} />
                        <col style={{ width:"12%" }} />
                        <col style={{ width:"15%" }} />
                        <col style={{ width:"16%" }} />
                      </colgroup>
                      <thead>
                        <tr style={{ background:"#F8F9FA", borderBottom:"0.5px solid #E0E0E0" }}>
                          {["Nombre","Documento","Puntaje","Estado","Nivel","Acciones"].map(h => (
                            <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#888", letterSpacing:0.5 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length===0 && (
                          <tr><td colSpan={6} style={{ padding:"2rem", textAlign:"center", color:"#aaa", fontSize:13 }}>No se encontraron registros</td></tr>
                        )}
                        {filtered.map(u => {
                          const lv = u.finished ? getLevel(u.pct||0) : null;
                          const status = u.finished?"Completado":u.started?"En progreso":"Pendiente";
                          const statusColor = u.finished?"#2E7D32":u.started?"#E65100":"#888";
                          const statusBg = u.finished?"#E8F5E9":u.started?"#FFF3E0":"#F5F5F5";
                          return (
                            <tr key={u.key} style={{ borderBottom:"0.5px solid #F0F0F0" }}>
                              <td style={{ padding:"12px 14px" }}>
                                <div style={{ fontSize:13, fontWeight:600, color:"#0D1B2A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</div>
                                <div style={{ fontSize:11, color:"#aaa" }}>{u.registeredAt?new Date(u.registeredAt).toLocaleDateString("es-CO"):""}</div>
                              </td>
                              <td style={{ padding:"12px 14px" }}>
                                <div style={{ fontSize:11, color:"#888" }}>{u.docType}</div>
                                <div style={{ fontSize:13, fontWeight:600, color:"#333" }}>{u.docNum}</div>
                              </td>
                              <td style={{ padding:"12px 14px" }}>
                                {u.finished ? (
                                  <div>
                                    <span style={{ fontSize:15, fontWeight:800, color:lv.color }}>{u.pct}%</span>
                                    <span style={{ fontSize:11, color:"#aaa", marginLeft:4 }}>{u.score}/{u.total||40}</span>
                                  </div>
                                ) : <span style={{ color:"#ccc", fontSize:13 }}>—</span>}
                              </td>
                              <td style={{ padding:"12px 14px" }}>
                                <span style={{ background:statusBg, color:statusColor, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{status}</span>
                              </td>
                              <td style={{ padding:"12px 14px" }}>
                                {lv ? <span style={{ background:lv.bg, color:lv.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{lv.label}</span> : <span style={{ color:"#ccc", fontSize:13 }}>—</span>}
                              </td>
                              <td style={{ padding:"12px 14px" }}>
                                <div style={{ display:"flex", gap:6 }}>
                                  <button onClick={()=>setSelected(u)} style={{ padding:"5px 10px", borderRadius:8, border:"0.5px solid #E0E0E0", background:"#fff", fontSize:12, cursor:"pointer", color:"#1565C0" }} title="Ver detalle">
                                    <i className="ti ti-eye" style={{ fontSize:14 }} aria-hidden="true" />
                                  </button>
                                  <button onClick={()=>{ if(window.confirm("¿Resetear prueba?")){ resetExam(u.key); refresh(); } }} style={{ padding:"5px 10px", borderRadius:8, border:"0.5px solid #E0E0E0", background:"#fff", fontSize:12, cursor:"pointer", color:"#E65100" }} title="Resetear">
                                    <i className="ti ti-refresh" style={{ fontSize:14 }} aria-hidden="true" />
                                  </button>
                                  <button onClick={()=>{ if(window.confirm("¿Eliminar este registro permanentemente?")){ deleteUser(u.key); refresh(); } }} style={{ padding:"5px 10px", borderRadius:8, border:"0.5px solid #FFCDD2", background:"#FFF5F5", fontSize:12, cursor:"pointer", color:"#C62828" }} title="Eliminar">
                                    <i className="ti ti-trash" style={{ fontSize:14 }} aria-hidden="true" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding:"10px 14px", borderTop:"0.5px solid #F0F0F0", fontSize:12, color:"#aaa" }}>{filtered.length} resultado{filtered.length!==1?"s":""}</div>
                </div>
              </>
            )}

            {view==="report" && <ReportView data={data} />}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <StudentDetail
          user={selected}
          onClose={()=>setSelected(null)}
          onReset={()=>{ resetExam(selected.key); refresh(); setSelected(null); }}
          onDelete={()=>{ deleteUser(selected.key); refresh(); setSelected(null); }}
        />
      )}
    </div>
  );
}

// ── ROOT ────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [auth, setAuth] = useState(false);
  return auth ? <Dashboard onLogout={()=>setAuth(false)} /> : <AdminLogin onLogin={()=>setAuth(true)} />;
}