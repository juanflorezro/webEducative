import { useState, useEffect } from "react";
 
const STORAGE_KEY = "exam_socioemocional_v1";
const USERS_KEY   = "exam_users_v1";
const ADMIN_PASS  = "admin2024";
 
const QUESTIONS = [
  {id:1,cat:"Convivencia Familiar",text:"Cuando tus padres te dan una opinión diferente a la tuya, ¿qué debes hacer?",opts:["Ignorarlos completamente","Discutir y enojarte","Escuchar respetuosamente","Hacer lo contrario"],correct:2},
  {id:2,cat:"Convivencia Familiar",text:"Tu hermano menor rompió accidentalmente tu celular.",opts:["Golpearlo","Gritarle y humillarlo","Hablar con calma y buscar solución","Contárselo a todos"],correct:2},
  {id:3,cat:"Convivencia Familiar",text:"Si tus padres se encuentran discutiendo.",opts:["Interrumpir y tomar partido","Gritar más fuerte","Escuchar y expresar opinión calmadamente","Salir de la casa"],correct:2},
  {id:4,cat:"Convivencia Familiar",text:"Tu madre te pide ayuda con quehaceres pero tienes tarea.",opts:["Ignorarla","Ayudar primero y luego tarea","Decirle que ella debe hacerlo","Enojarte"],correct:1},
  {id:5,cat:"Convivencia Familiar",text:"Un familiar hace un comentario negativo sobre ti.",opts:["Lo insultas","Te vas llorando","Respondes educadamente","Guardas resentimiento"],correct:2},
  {id:6,cat:"Convivencia Familiar",text:"Tu familia no tiene dinero para algo que quieres.",opts:["Haces berrinche","Entiendes la situación","Culpas a tus padres","Robas el dinero"],correct:1},
  {id:7,cat:"Convivencia Familiar",text:"Tus padres te castigan por mala nota.",opts:["Rebelarte","Aceptar y mejorar","Mentir sobre notas","Vengarte"],correct:1},
  {id:8,cat:"Convivencia Familiar",text:"Un hermano te acusa de algo que no hiciste.",opts:["Lo acusas también","Discutes violentamente","Mantienes calma y explicas","Te vengas"],correct:2},
  {id:9,cat:"Convivencia Familiar",text:"Tu familia celebra un logro tuyo.",opts:["Vergüenza","Orgullo y gratitud","Indiferencia","Molestia"],correct:1},
  {id:10,cat:"Convivencia Familiar",text:"¿Cómo muestras afecto a tu familia?",opts:["Con palabras y acciones","Ignorándolos","Solo con regalos","Nunca"],correct:0},
  {id:11,cat:"Convivencia Familiar",text:"Un padre está estresado por el trabajo.",opts:["Le pides más","Le causas problemas","Le ofreces apoyo","Lo ignoras"],correct:2},
  {id:12,cat:"Convivencia Familiar",text:"¿Qué haces cuando un familiar está enfermo?",opts:["Lo evitas","Te quejas","Lo cuidas y apoyas","Aprovechas"],correct:2},
  {id:13,cat:"Convivencia Familiar",text:"¿Cómo manejas los secretos familiares?",opts:["Los cuentas","Los usas","Los respetas","Los olvidas"],correct:2},
  {id:14,cat:"Convivencia Familiar",text:"¿Qué importancia das a las tradiciones familiares?",opts:["Ninguna","Mucha, las valoro","Solo si me benefician","Las critico"],correct:1},
  {id:15,cat:"Convivencia Familiar",text:"¿Cómo resuelves conflictos con tus hermanos?",opts:["Con violencia","Con diálogo","Involucrando padres","Guardando rencor"],correct:1},
  {id:16,cat:"Convivencia Familiar",text:"¿Qué haces cuando un familiar te pide un favor?",opts:["Siempre ayudas","Siempre dices no","Solo si pagan","Finges no escuchar"],correct:0},
  {id:17,cat:"Convivencia Familiar",text:"¿Cómo manejas la privacidad en familia?",opts:["Respetando espacios","Entrando sin llamar","Revisando cosas ajenas","Contando a extraños"],correct:0},
  {id:18,cat:"Convivencia Familiar",text:"¿Qué valoras más en tu familia?",opts:["El dinero","El apoyo emocional","Los regalos","Libertad total"],correct:1},
  {id:19,cat:"Convivencia Familiar",text:"¿Cómo contribuyes al bienestar familiar?",opts:["Cumpliendo responsabilidades","No contribuyo","Creando problemas","Solo obligado"],correct:0},
  {id:20,cat:"Convivencia Familiar",text:"¿Qué aprendes de tu familia?",opts:["Valores y conductas","Solo cosas malas","Nada importante","Cómo ser egoísta"],correct:0},
  {id:21,cat:"Convivencia Social",text:"En el bus ves a un adulto mayor de pie.",opts:["Ignorarlo","Reírme","Ceder mi silla","Pedirle que se aleje"],correct:2},
  {id:22,cat:"Convivencia Social",text:"Un amigo te cuenta un secreto importante.",opts:["Se lo cuentas a todos","Lo guardas","Lo usas para molestar","Se lo cuentas a sus padres"],correct:1},
  {id:23,cat:"Convivencia Social",text:"Ves que alguien está siendo acosado.",opts:["Te unes al acoso","Ignoras","Defiendes a la persona","Grabas para redes"],correct:2},
  {id:24,cat:"Convivencia Social",text:"Un desconocido te pide ayuda en la calle.",opts:["Lo ignoras","Ayudas con precaución","Le gritas","Llamas a la policía"],correct:1},
  {id:25,cat:"Convivencia Social",text:"¿Cómo manejas las diferencias culturales?",opts:["Las respetas","Las criticas","Las ignoras","Te burlas"],correct:0},
  {id:26,cat:"Convivencia Social",text:"En una fila, alguien se cuela.",opts:["Lo empujas","Le llamas atención","Te cuelas tú","Gritas insultos"],correct:1},
  {id:27,cat:"Convivencia Social",text:"¿Cómo actúas ante personas con discapacidad?",opts:["Te burlas","Ofreces ayuda","Las evitas","Finges no verlas"],correct:1},
  {id:28,cat:"Convivencia Social",text:"¿Qué haces con la basura en espacios públicos?",opts:["La arrojo","La guardas","La escondes","La dejas"],correct:1},
  {id:29,cat:"Convivencia Social",text:"¿Cómo manejas conflictos con vecinos?",opts:["Con diálogo","Con violencia","Con venganza","Con indiferencia"],correct:0},
  {id:30,cat:"Convivencia Social",text:"¿Qué significa ser buen ciudadano?",opts:["Cumplir normas","Hacer lo que quieras","Solo pensar en uno","Evadir responsabilidades"],correct:0},
  {id:31,cat:"Convivencia Escolar",text:"Un compañero se burla de otro por calificaciones.",opts:["Unirte a la burla","Ignorar","Defender al compañero","Contárselo al profesor"],correct:2},
  {id:32,cat:"Convivencia Escolar",text:"El profesor te llama la atención injustamente.",opts:["Le gritas","Escuchas y explicas","Te vas","Guardas rencor"],correct:1},
  {id:33,cat:"Convivencia Escolar",text:"En trabajos en grupo, un compañero no colabora.",opts:["Lo insultas","Haces solo","Hablas y buscan solución","Lo delatas"],correct:2},
  {id:34,cat:"Convivencia Escolar",text:"Encuentras un celular perdido en el colegio.",opts:["Te lo quedas","Lo entregas","Lo escondes","Lo vendes"],correct:1},
  {id:35,cat:"Convivencia Escolar",text:"¿Cómo manejas la competencia académica?",opts:["Con honestidad","Copiando","Saboteando","Haciendo trampa"],correct:0},
  {id:36,cat:"Convivencia Escolar",text:"¿Qué haces frente al bullying escolar?",opts:["Participas","Denuncias","Ignoras","Grabas"],correct:1},
  {id:37,cat:"Convivencia Escolar",text:"¿Cómo respetas la propiedad escolar?",opts:["Cuidando instalaciones","Rayando paredes","Robando materiales","Destruyendo"],correct:0},
  {id:38,cat:"Convivencia Escolar",text:"¿Qué importancia das a las normas del colegio?",opts:["Las sigo","Las ignoro","Las critico","Las desobedezco"],correct:0},
  {id:39,cat:"Convivencia Escolar",text:"¿Cómo manejas conflictos con compañeros?",opts:["Con diálogo","Con golpes","Con chismes","Con venganza"],correct:0},
  {id:40,cat:"Convivencia Escolar",text:"¿Qué significa ser excelente estudiante?",opts:["Solo buenas notas","Ser responsable y respetuoso","Ser popular","Engañar profesores"],correct:1},
];
 
const CATS = ["Convivencia Familiar","Convivencia Social","Convivencia Escolar"];
const CAT_COLOR = {"Convivencia Familiar":"#E65100","Convivencia Social":"#2E7D32","Convivencia Escolar":"#1565C0"};
const CAT_BG    = {"Convivencia Familiar":"#FFF3E0","Convivencia Social":"#E8F5E9","Convivencia Escolar":"#E3F2FD"};
 
function getLevel(pct){
  if(pct>=85) return {label:"Excelente",color:"#2E7D32",bg:"#E8F5E9"};
  if(pct>=70) return {label:"Bueno",color:"#1565C0",bg:"#E3F2FD"};
  if(pct>=50) return {label:"Regular",color:"#E65100",bg:"#FFF3E0"};
  return {label:"Necesita mejorar",color:"#C62828",bg:"#FFEBEE"};
}
 
function getData(){
  try{
    const users=JSON.parse(localStorage.getItem(USERS_KEY)||"{}");
    const stor=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    return Object.entries(users).map(([key,user])=>{
      const ex=stor[key]||{};
      return {...user,...ex,key,pct:ex.score!=null?Math.round((ex.score/(ex.total||40))*100):null};
    });
  }catch{return [];}
}
 
function deleteUser(key){
  try{
    const u=JSON.parse(localStorage.getItem(USERS_KEY)||"{}");
    const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    delete u[key]; delete s[key];
    localStorage.setItem(USERS_KEY,JSON.stringify(u));
    localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
  }catch{}
}
 
function resetExam(key){
  try{
    const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
    if(s[key]){s[key]={name:s[key].name,docType:s[key].docType,docNum:s[key].docNum};}
    localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
  }catch{}
}
 
function exportCSV(data){
  const rows=[["Nombre","Tipo Doc","Número","Puntaje","Total","Porcentaje","Nivel","Fecha","Familiar %","Social %","Escolar %"]];
  data.forEach(u=>{
    if(!u.finished)return;
    const ans=u.answers||[];
    const cs={};
    CATS.forEach(c=>{cs[c]={co:0,to:0};});
    QUESTIONS.forEach((q,i)=>{cs[q.cat].to++;if(ans[i]===q.correct)cs[q.cat].co++;});
    const lv=getLevel(u.pct||0);
    rows.push([u.name,u.docType,u.docNum,u.score,u.total||40,(u.pct||0)+"%",lv.label,
      u.finishedAt?new Date(u.finishedAt).toLocaleDateString("es-CO"):"",
      Math.round((cs["Convivencia Familiar"].co/20)*100)+"%",
      Math.round((cs["Convivencia Social"].co/10)*100)+"%",
      Math.round((cs["Convivencia Escolar"].co/10)*100)+"%"]);
  });
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="resultados_socioemocional.csv";a.click();
  URL.revokeObjectURL(url);
}
 
/* ── SHARED PRIMITIVES ─────────────────────────────────────────────────────── */
const F = {fontFamily:"'Segoe UI',system-ui,sans-serif"};
 
function Bar({value,max,color}){
  const p=max>0?Math.round((value/max)*100):0;
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,height:8,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${p}%`,background:color,borderRadius:4,transition:"width .5s"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:700,color,minWidth:34,textAlign:"right"}}>{p}%</span>
    </div>
  );
}
 
function Chip({label,color,bg}){
  return <span style={{background:bg,color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;
}
 
function MetricCard({label,value,sub,color="#111"}){
  return(
    <div style={{background:"#F4F6F9",borderRadius:14,padding:"14px 16px"}}>
      <div style={{fontSize:11,color:"#888",fontWeight:600,marginBottom:4}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>{sub}</div>}
    </div>
  );
}
 
/* ── ADMIN LOGIN ─────────────────────────────────────────────────────────── */
function AdminLogin({onLogin}){
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  return(
    <div style={{minHeight:"100vh",background:"#0D1B2A",display:"flex",alignItems:"center",justifyContent:"center",...F,padding:"1rem"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"2.5rem",maxWidth:380,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"#0D1B2A",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26}}>⚙️</div>
          <h1 style={{margin:"0 0 4px",fontSize:20,fontWeight:800,color:"#0D1B2A"}}>Panel Administrador</h1>
          <p style={{margin:0,fontSize:13,color:"#888"}}>Diagnóstico Socioemocional · 9°-03</p>
        </div>
        <label style={{display:"block",fontSize:12,fontWeight:700,color:"#555",marginBottom:6}}>CONTRASEÑA</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(pass===ADMIN_PASS?onLogin():setErr("Contraseña incorrecta"))}
          placeholder="••••••••"
          style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #E0E0E0",fontSize:14,boxSizing:"border-box",marginBottom:10}}
          autoFocus/>
        {err&&<div style={{color:"#C62828",fontSize:13,marginBottom:8}}>⚠ {err}</div>}
        <button onClick={()=>pass===ADMIN_PASS?onLogin():setErr("Contraseña incorrecta")}
          style={{width:"100%",padding:13,background:"#0D1B2A",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer"}}>
          Ingresar →
        </button>
        <p style={{textAlign:"center",marginTop:14,fontSize:12,color:"#bbb"}}> <code></code></p>
      </div>
    </div>
  );
}
 
/* ── STUDENT DETAIL DRAWER (bottom-sheet style on mobile) ─────────────────── */
function StudentDetail({user,onClose,onReset,onDelete}){
  const answers=user.answers||[];
  const catStats={};
  CATS.forEach(c=>{catStats[c]={co:0,to:0};});
  QUESTIONS.forEach((q,i)=>{catStats[q.cat].to++;if(answers[i]===q.correct)catStats[q.cat].co++;});
  const lv=getLevel(user.pct||0);
 
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,0.55)",...F}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:640,maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* drag handle */}
        <div style={{padding:"10px 0 0",textAlign:"center",flexShrink:0}}>
          <div style={{width:40,height:4,background:"#E0E0E0",borderRadius:2,display:"inline-block"}}/>
        </div>
        {/* header */}
        <div style={{background:"#0D1B2A",padding:"1rem 1.2rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <h2 style={{margin:"0 0 2px",color:"#fff",fontSize:16,fontWeight:700}}>{user.name}</h2>
            <p style={{margin:0,color:"rgba(255,255,255,0.55)",fontSize:12}}>{user.docType} · {user.docNum}</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",width:34,height:34,borderRadius:10,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* scrollable body */}
        <div style={{flex:1,overflowY:"auto",padding:"1.2rem"}}>
          {user.finished?(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
                <div style={{background:"#F4F6F9",borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:lv.color}}>{user.score}/{user.total||40}</div>
                  <div style={{fontSize:11,color:"#888"}}>Puntaje</div>
                </div>
                <div style={{background:"#F4F6F9",borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:lv.color}}>{user.pct}%</div>
                  <div style={{fontSize:11,color:"#888"}}>Porcentaje</div>
                </div>
                <div style={{background:lv.bg,borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:800,color:lv.color,lineHeight:1.3}}>{lv.label}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:2}}>Nivel</div>
                </div>
              </div>
              {CATS.map(cat=>{
                const s=catStats[cat];
                const p=Math.round((s.co/s.to)*100);
                return(
                  <div key={cat} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                      <span style={{fontWeight:700,color:CAT_COLOR[cat]}}>{cat}</span>
                      <span style={{color:"#888"}}>{s.co}/{s.to} · {p}%</span>
                    </div>
                    <Bar value={s.co} max={s.to} color={CAT_COLOR[cat]}/>
                  </div>
                );
              })}
              <div style={{marginTop:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:8}}>PREGUNTA POR PREGUNTA</div>
                <div style={{borderRadius:10,border:"0.5px solid #E8E8E8",overflow:"hidden"}}>
                  {QUESTIONS.map((q,i)=>{
                    const ok=answers[i]===q.correct;
                    return(
                      <div key={i} style={{padding:"9px 12px",borderBottom:"0.5px solid #F4F4F4",display:"flex",gap:8,background:ok?"#F1F8E9":"#FFF8E1"}}>
                        <span style={{fontSize:14,flexShrink:0}}>{ok?"✅":"❌"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,color:"#aaa",marginBottom:1}}>P{q.id} · {q.cat}</div>
                          <div style={{fontSize:12,color:"#333",lineHeight:1.4,wordBreak:"break-word"}}>{q.text.substring(0,60)}{q.text.length>60?"...":""}</div>
                          {!ok&&answers[i]!==-1&&<div style={{fontSize:11,color:"#E65100",marginTop:2}}>Respondió: <b>{q.opts[answers[i]]}</b></div>}
                          {!ok&&<div style={{fontSize:11,color:"#2E7D32"}}>Correcta: <b>{q.opts[q.correct]}</b></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ):(
            <div style={{textAlign:"center",padding:"2rem 0",color:"#888"}}>
              <div style={{fontSize:44,marginBottom:12}}>{user.started?"⏳":"📋"}</div>
              <p style={{fontWeight:600,color:"#555",margin:"0 0 6px"}}>{user.started?"Prueba en progreso":"No ha iniciado la prueba"}</p>
              {user.started&&<p style={{fontSize:13,margin:0}}>Ha respondido {(user.answers||[]).filter(a=>a!==-1).length} de 40 preguntas</p>}
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:20,paddingTop:14,borderTop:"0.5px solid #EBEBEB"}}>
            <button onClick={()=>{if(window.confirm("¿Resetear prueba? El estudiante podrá volver a realizarla."))onReset();}}
              style={{flex:1,padding:"11px",borderRadius:10,border:"1.5px solid #E65100",background:"#FFF3E0",color:"#E65100",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              ↺ Resetear
            </button>
            <button onClick={()=>{if(window.confirm("¿Eliminar este registro permanentemente?"))onDelete();}}
              style={{flex:1,padding:"11px",borderRadius:10,border:"1.5px solid #C62828",background:"#FFEBEE",color:"#C62828",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              🗑 Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ── REPORT ──────────────────────────────────────────────────────────────── */
function Report({data}){
  const finished=data.filter(u=>u.finished);
  if(!finished.length)return(
    <div style={{padding:"3rem 1rem",textAlign:"center",color:"#888"}}>
      <div style={{fontSize:48,marginBottom:12}}>📊</div>
      <p style={{margin:0}}>Aún no hay estudiantes que hayan completado la prueba.</p>
    </div>
  );
 
  const avg=Math.round(finished.reduce((s,u)=>s+(u.pct||0),0)/finished.length);
  const lvDist={"Excelente":0,"Bueno":0,"Regular":0,"Necesita mejorar":0};
  finished.forEach(u=>{lvDist[getLevel(u.pct||0).label]++;});
 
  const catStats={};
  CATS.forEach(c=>{catStats[c]={co:0,to:0};});
  finished.forEach(u=>{
    (u.answers||[]).forEach((a,i)=>{
      const q=QUESTIONS[i];
      catStats[q.cat].to++;
      if(a===q.correct)catStats[q.cat].co++;
    });
  });
 
  const qStats=QUESTIONS.map((q,i)=>{
    let co=0,at=0;
    finished.forEach(u=>{
      const a=(u.answers||[])[i];
      if(a!=null&&a!==-1)at++;
      if(a===q.correct)co++;
    });
    return{...q,co,at,pct:at>0?Math.round((co/at)*100):0};
  });
 
  const hardest=[...qStats].sort((a,b)=>a.pct-b.pct).slice(0,5);
  const easiest=[...qStats].sort((a,b)=>b.pct-a.pct).slice(0,5);
 
  const weakCat=Object.entries(catStats).sort((a,b)=>(a[1].co/a[1].to)-(b[1].co/b[1].to))[0];
  const weakPct=Math.round((weakCat[1].co/weakCat[1].to)*100);
 
  const lvColor={"Excelente":"#2E7D32","Bueno":"#1565C0","Regular":"#E65100","Necesita mejorar":"#C62828"};
  const lvBg={"Excelente":"#E8F5E9","Bueno":"#E3F2FD","Regular":"#FFF3E0","Necesita mejorar":"#FFEBEE"};
 
  const conclusions=[];
  if(avg>=85)conclusions.push({e:"🌟",t:`El grupo muestra nivel EXCELENTE (${avg}% promedio). La mayoría ha interiorizado valores socioemocionales sólidos.`});
  else if(avg>=70)conclusions.push({e:"✅",t:`El grupo tiene desempeño BUENO (${avg}% promedio). Existe base sólida con áreas de oportunidad.`});
  else if(avg>=50)conclusions.push({e:"⚠️",t:`Nivel REGULAR (${avg}% promedio). Se requieren estrategias de intervención focalizadas.`});
  else conclusions.push({e:"🚨",t:`El grupo NECESITA MEJORA URGENTE (${avg}% promedio). Se recomienda programa intensivo socioemocional.`});
  conclusions.push({e:"🎯",t:`Área más débil: "${weakCat[0]}" con ${weakPct}%. Priorizar talleres y reflexión grupal en esta dimensión.`});
  if(lvDist["Necesita mejorar"]>finished.length*0.3)conclusions.push({e:"👥",t:`El ${Math.round((lvDist["Necesita mejorar"]/finished.length)*100)}% necesita atención personalizada. Se sugiere acompañamiento de orientación escolar.`});
  if(lvDist["Excelente"]>finished.length*0.4)conclusions.push({e:"💡",t:`El ${Math.round((lvDist["Excelente"]/finished.length)*100)}% alcanzó Excelente. Pueden actuar como líderes socioemocionales del grupo.`});
  if(hardest[0].pct<40)conclusions.push({e:"📚",t:`Pregunta con más errores: "${hardest[0].text.substring(0,60)}…" (${hardest[0].pct}% aciertos). Indica dificultad en situaciones prácticas de convivencia.`});
 
  return(
    <div>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
        <MetricCard label="Evaluados" value={finished.length} sub={`de ${data.length} registrados`}/>
        <MetricCard label="Promedio" value={`${avg}%`} color={getLevel(avg).color} sub={getLevel(avg).label}/>
        <MetricCard label="Máximo" value={`${Math.max(...finished.map(u=>u.pct||0))}%`} color="#2E7D32"/>
        <MetricCard label="Mínimo" value={`${Math.min(...finished.map(u=>u.pct||0))}%`} color="#C62828"/>
      </div>
 
      {/* Level dist */}
      <div style={{background:"#fff",borderRadius:16,border:"0.5px solid #E8E8E8",padding:"1.1rem 1.2rem",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:12}}>DISTRIBUCIÓN POR NIVEL</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8}}>
          {Object.entries(lvDist).map(([lv,count])=>(
            <div key={lv} style={{background:lvBg[lv],borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,color:lvColor[lv]}}>{count}</div>
              <div style={{fontSize:11,fontWeight:700,color:lvColor[lv],marginTop:2,lineHeight:1.2}}>{lv}</div>
              <div style={{fontSize:11,color:"#888",marginTop:2}}>{finished.length?Math.round((count/finished.length)*100):0}%</div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Category */}
      <div style={{background:"#fff",borderRadius:16,border:"0.5px solid #E8E8E8",padding:"1.1rem 1.2rem",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:12}}>RENDIMIENTO POR ÁREA</div>
        {CATS.map(cat=>{
          const s=catStats[cat];
          return(
            <div key={cat} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5,flexWrap:"wrap",gap:4}}>
                <span style={{fontWeight:700,color:CAT_COLOR[cat]}}>{cat}</span>
                <span style={{color:"#888",fontSize:12}}>{s.co}/{s.to} respuestas · {Math.round((s.co/s.to)*100)}%</span>
              </div>
              <Bar value={s.co} max={s.to} color={CAT_COLOR[cat]}/>
            </div>
          );
        })}
      </div>
 
      {/* Hard / Easy */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:16}}>
        {[{title:"⚠ Preguntas más difíciles",qs:hardest,color:"#C62828"},{title:"✅ Mejor resultado",qs:easiest,color:"#2E7D32"}].map(({title,qs,color})=>(
          <div key={title} style={{background:"#fff",borderRadius:16,border:"0.5px solid #E8E8E8",padding:"1.1rem 1.2rem"}}>
            <div style={{fontSize:12,fontWeight:700,color,marginBottom:12}}>{title}</div>
            {qs.map(q=>(
              <div key={q.id} style={{marginBottom:12,paddingBottom:12,borderBottom:"0.5px solid #F4F4F4"}}>
                <div style={{fontSize:11,color:"#aaa",marginBottom:2}}>P{q.id} · {q.cat}</div>
                <div style={{fontSize:12,color:"#333",marginBottom:5,lineHeight:1.4}}>{q.text.substring(0,65)}{q.text.length>65?"...":""}</div>
                <Bar value={q.co} max={q.at||1} color={color}/>
              </div>
            ))}
          </div>
        ))}
      </div>
 
      {/* Conclusions */}
      <div style={{background:"#0D1B2A",borderRadius:16,padding:"1.4rem"}}>
        <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:14,letterSpacing:1}}>CONCLUSIONES PEDAGÓGICAS</div>
        {conclusions.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:12,padding:"12px 14px",background:"rgba(255,255,255,0.07)",borderRadius:10}}>
            <span style={{fontSize:20,flexShrink:0}}>{c.e}</span>
            <p style={{margin:0,fontSize:13,color:"#DDE",lineHeight:1.6}}>{c.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
 
/* ── STUDENT LIST (cards on mobile, table on desktop) ────────────────────── */
function StudentCard({u,onView,onReset,onDelete}){
  const lv=u.finished?getLevel(u.pct||0):null;
  const status=u.finished?"Completado":u.started?"En progreso":"Pendiente";
  const statusColor=u.finished?"#2E7D32":u.started?"#E65100":"#888";
  const statusBg=u.finished?"#E8F5E9":u.started?"#FFF3E0":"#F4F4F4";
  return(
    <div style={{background:"#fff",borderRadius:14,border:"0.5px solid #E8E8E8",padding:"14px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:"#0D1B2A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
          <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{u.docType} · {u.docNum}</div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
          <Chip label={status} color={statusColor} bg={statusBg}/>
          {lv&&<Chip label={lv.label} color={lv.color} bg={lv.bg}/>}
        </div>
      </div>
      {u.finished&&(
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <div style={{flex:1,background:"#F4F6F9",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:lv.color}}>{u.pct}%</div>
            <div style={{fontSize:10,color:"#aaa"}}>Porcentaje</div>
          </div>
          <div style={{flex:1,background:"#F4F6F9",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:lv.color}}>{u.score}/{u.total||40}</div>
            <div style={{fontSize:10,color:"#aaa"}}>Puntaje</div>
          </div>
          {u.finishedAt&&(
            <div style={{flex:1,background:"#F4F6F9",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#555"}}>{new Date(u.finishedAt).toLocaleDateString("es-CO",{day:"2-digit",month:"short"})}</div>
              <div style={{fontSize:10,color:"#aaa"}}>Fecha</div>
            </div>
          )}
        </div>
      )}
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>onView(u)} style={{flex:1,padding:"9px",borderRadius:9,border:"0.5px solid #E0E0E0",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",color:"#1565C0"}}>👁 Ver</button>
        <button onClick={()=>{if(window.confirm("¿Resetear prueba?"))onReset(u.key);}} style={{flex:1,padding:"9px",borderRadius:9,border:"0.5px solid #E0E0E0",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",color:"#E65100"}}>↺ Resetear</button>
        <button onClick={()=>{if(window.confirm("¿Eliminar registro?"))onDelete(u.key);}} style={{flex:1,padding:"9px",borderRadius:9,border:"0.5px solid #FFCDD2",background:"#FFF5F5",fontSize:13,fontWeight:600,cursor:"pointer",color:"#C62828"}}>🗑</button>
      </div>
    </div>
  );
}
 
/* ── MAIN DASHBOARD ──────────────────────────────────────────────────────── */
function Dashboard({onLogout}){
  const [data,setData]=useState([]);
  const [view,setView]=useState("students");
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [sortBy,setSortBy]=useState("name");
  const [selected,setSelected]=useState(null);
  const [sideOpen,setSideOpen]=useState(false);
 
  const refresh=()=>setData(getData());
  useEffect(()=>{refresh();},[]);
 
  const filtered=data
    .filter(u=>{
      const q=search.toLowerCase();
      const ms=!q||u.name?.toLowerCase().includes(q)||u.docNum?.includes(q);
      const mf=filterStatus==="all"||(filterStatus==="finished"&&u.finished)||(filterStatus==="progress"&&u.started&&!u.finished)||(filterStatus==="pending"&&!u.started&&!u.finished);
      return ms&&mf;
    })
    .sort((a,b)=>{
      if(sortBy==="name")return(a.name||"").localeCompare(b.name||"");
      if(sortBy==="score")return(b.pct||0)-(a.pct||0);
      if(sortBy==="date")return(b.finishedAt||0)-(a.finishedAt||0);
      return 0;
    });
 
  const finished=data.filter(u=>u.finished);
  const inProgress=data.filter(u=>u.started&&!u.finished);
  const avg=finished.length?Math.round(finished.reduce((s,u)=>s+(u.pct||0),0)/finished.length):0;
 
  const navItems=[
    {id:"students",label:"Estudiantes",icon:"👥"},
    {id:"report",label:"Reporte",icon:"📊"},
  ];
 
  return(
    <div style={{minHeight:"100vh",background:"#F4F6F9",...F,display:"flex",flexDirection:"column"}}>
 
      {/* ── TOP BAR (mobile) ─── */}
      <div style={{background:"#0D1B2A",padding:"0 1rem",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setSideOpen(!sideOpen)}
            style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",width:36,height:36,borderRadius:9,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ☰
          </button>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Panel Admin</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Diagnóstico Socioemocional</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>exportCSV(data)}
            style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",padding:"6px 10px",borderRadius:8,fontSize:11,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>
            ↓ CSV
          </button>
          <button onClick={refresh}
            style={{background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.7)",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
            ↻
          </button>
        </div>
      </div>
 
      <div style={{display:"flex",flex:1,minHeight:0}}>
 
        {/* ── SIDEBAR ─── */}
        {sideOpen&&(
          <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.4)"}} onClick={()=>setSideOpen(false)}>
            <div style={{width:220,height:"100%",background:"#0D1B2A",padding:"1rem 0.8rem",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
              <div style={{padding:"0.5rem 0.4rem 1rem",borderBottom:"0.5px solid rgba(255,255,255,0.08)",marginBottom:"0.8rem"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:3}}>NAVEGACIÓN</div>
              </div>
              {navItems.map(t=>(
                <button key={t.id} onClick={()=>{setView(t.id);setSideOpen(false);}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:10,border:"none",
                    background:view===t.id?"rgba(255,255,255,0.13)":"transparent",
                    color:view===t.id?"#fff":"rgba(255,255,255,0.5)",
                    fontSize:14,fontWeight:view===t.id?700:400,cursor:"pointer",marginBottom:4,textAlign:"left"}}>
                  {t.icon} {t.label}
                </button>
              ))}
              <div style={{flex:1}}/>
              <button onClick={onLogout}
                style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:"none",background:"transparent",color:"rgba(255,255,255,0.35)",fontSize:13,cursor:"pointer",textAlign:"left"}}>
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        )}
 
        {/* ── MAIN CONTENT ─── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"auto"}}>
 
          {/* Tab nav (always visible below top bar) */}
          <div style={{background:"#fff",borderBottom:"0.5px solid #E8E8E8",display:"flex",padding:"0 1rem",flexShrink:0}}>
            {navItems.map(t=>(
              <button key={t.id} onClick={()=>setView(t.id)}
                style={{padding:"13px 16px",border:"none",borderBottom:view===t.id?"3px solid #0D1B2A":"3px solid transparent",
                  background:"transparent",fontSize:13,fontWeight:view===t.id?700:400,
                  color:view===t.id?"#0D1B2A":"#888",cursor:"pointer",whiteSpace:"nowrap"}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
 
          {/* KPI strip */}
          <div style={{padding:"1rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,flexShrink:0}}>
            <MetricCard label="Registrados" value={data.length}/>
            <MetricCard label="Completados" value={finished.length} color="#2E7D32" sub={data.length?`${Math.round((finished.length/data.length)*100)}%`:""}/>
            <MetricCard label="En progreso" value={inProgress.length} color="#E65100"/>
            <MetricCard label="Promedio" value={finished.length?`${avg}%`:"—"} color="#1565C0" sub={finished.length?getLevel(avg).label:""}/>
          </div>
 
          {/* Page content */}
          <div style={{flex:1,padding:"0 1rem 1.5rem"}}>
            {view==="students"&&(
              <>
                {/* Filters */}
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder="🔍 Buscar por nombre o documento..."
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"0.5px solid #E0E0E0",fontSize:13,boxSizing:"border-box",background:"#fff"}}/>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
                      style={{flex:1,minWidth:120,padding:"9px 10px",borderRadius:10,border:"0.5px solid #E0E0E0",fontSize:13,background:"#fff"}}>
                      <option value="all">Todos ({data.length})</option>
                      <option value="finished">Completados ({finished.length})</option>
                      <option value="progress">En progreso ({inProgress.length})</option>
                      <option value="pending">Pendientes ({data.length-finished.length-inProgress.length})</option>
                    </select>
                    <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                      style={{flex:1,minWidth:120,padding:"9px 10px",borderRadius:10,border:"0.5px solid #E0E0E0",fontSize:13,background:"#fff"}}>
                      <option value="name">A-Z Nombre</option>
                      <option value="score">Mayor puntaje</option>
                      <option value="date">Más reciente</option>
                    </select>
                  </div>
                  <div style={{fontSize:12,color:"#aaa"}}>{filtered.length} resultado{filtered.length!==1?"s":""}</div>
                </div>
 
                {/* Student cards */}
                {filtered.length===0&&(
                  <div style={{textAlign:"center",padding:"3rem 1rem",color:"#bbb"}}>
                    <div style={{fontSize:36,marginBottom:8}}>🔎</div>
                    <p style={{margin:0}}>No se encontraron registros</p>
                  </div>
                )}
                {filtered.map(u=>(
                  <StudentCard key={u.key} u={u}
                    onView={setSelected}
                    onReset={key=>{resetExam(key);refresh();}}
                    onDelete={key=>{deleteUser(key);refresh();}}/>
                ))}
              </>
            )}
            {view==="report"&&<Report data={data}/>}
          </div>
        </div>
      </div>
 
      {/* Student detail drawer */}
      {selected&&(
        <StudentDetail
          user={selected}
          onClose={()=>setSelected(null)}
          onReset={()=>{resetExam(selected.key);refresh();setSelected(null);}}
          onDelete={()=>{deleteUser(selected.key);refresh();setSelected(null);}}/>
      )}
    </div>
  );
}
 
/* ── ROOT ────────────────────────────────────────────────────────────────── */
export default function Admin(){
  const [auth,setAuth]=useState(false);
  return auth?<Dashboard onLogout={()=>setAuth(false)}/>:<AdminLogin onLogin={()=>setAuth(true)}/>;
}