import { useState, useRef, useEffect, useCallback, useReducer, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   SHARED UTILITIES
═══════════════════════════════════════════════════════════════════ */
function useScript(src) {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script"); s.src = src; document.head.appendChild(s);
  }, [src]);
}
function useMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h); return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}
let _uid = 0;
const uid = () => `e${++_uid}`;
function getPoint(e) {
  if (e.touches?.length)        return { x: e.touches[0].clientX,        y: e.touches[0].clientY };
  if (e.changedTouches?.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

/* ── Toast ── */
let _toastCb = null;
function useToast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { _toastCb = (msg, type="success") => {
    const id = uid();
    setToasts(p => [...p, {id, msg, type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }; return () => { _toastCb = null; }; }, []);
  return toasts;
}
function toast(msg, type="success") { if(_toastCb) _toastCb(msg, type); }
function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:9999,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,backdropFilter:"blur(12px)",
          background:t.type==="error"?"rgba(255,60,60,.9)":t.type==="info"?"rgba(0,180,255,.9)":"rgba(0,200,100,.9)",
          color:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,.4)",whiteSpace:"nowrap",animation:"fadeIn .2s ease"}}>
          {t.type==="success"?"✅ ":t.type==="error"?"❌ ":"ℹ️ "}{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════════════════════════════ */
function HomeScreen({ onSelect }) {
  return (
    <div style={{ minHeight:"100vh", background:"#060a14", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:10, color:"#00d4ff", letterSpacing:8, marginBottom:8 }}>MAKER INFO</div>
        <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", margin:0 }}>Studio <span style={{ color:"#00d4ff" }}>Pro</span></h1>
        <p style={{ color:"#2a3a5a", fontSize:13, marginTop:8 }}>Editor profissional · 100% gratuito · sem marca d'água</p>
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", maxWidth:700 }}>
        {/* Photo Editor */}
        <button onClick={() => onSelect("photo")} style={{ flex:"1 1 200px", minHeight:160, borderRadius:16, cursor:"pointer", padding:24,
          background:"linear-gradient(135deg,#0d1a2e,#0a1020)", border:"1px solid rgba(255,255,255,.08)",
          boxShadow:"0 8px 40px rgba(0,0,0,.5)", textAlign:"left", transition:"transform .15s,box-shadow .15s",
          position:"relative", overflow:"hidden" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 50px rgba(0,0,0,.6)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 40px rgba(0,0,0,.5)";}}>
          <div style={{ position:"absolute", top:-20, right:-20, fontSize:80, opacity:.08 }}>📷</div>
          <div style={{ fontSize:36, marginBottom:12 }}>📷</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:6 }}>Editor de Fotos</div>
          <div style={{ fontSize:11, color:"#3a5070", lineHeight:1.6 }}>Filtros · Ajustes · Texto · Pincel<br/>Efeitos de luz · Crop · Presets</div>
          <div style={{ marginTop:16, fontSize:10, color:"#c87cff", fontWeight:700, letterSpacing:2 }}>ABRIR →</div>
        </button>
        {/* Post Editor */}
        <button onClick={() => onSelect("post")} style={{ flex:"1 1 200px", minHeight:160, borderRadius:16, cursor:"pointer", padding:24,
          background:"linear-gradient(135deg,#030b18,#060f1a)", border:"1px solid rgba(0,212,255,.15)",
          boxShadow:"0 8px 40px rgba(0,212,255,.08)", textAlign:"left", transition:"transform .15s,box-shadow .15s",
          position:"relative", overflow:"hidden" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 50px rgba(0,212,255,.15)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 40px rgba(0,212,255,.08)";}}>
          <div style={{ position:"absolute", top:-20, right:-20, fontSize:80, opacity:.08 }}>⚡</div>
          <div style={{ fontSize:36, marginBottom:12 }}>⚡</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#00d4ff", marginBottom:6 }}>Posts Maker Info</div>
          <div style={{ fontSize:11, color:"#3a5070", lineHeight:1.6 }}>Templates prontos · Canvas livre<br/>Exporta em todos os formatos</div>
          <div style={{ marginTop:16, fontSize:10, color:"#00d4ff", fontWeight:700, letterSpacing:2 }}>ABRIR →</div>
        </button>
        {/* Collage */}
        <button onClick={() => onSelect("collage")} style={{ flex:"1 1 200px", minHeight:160, borderRadius:16, cursor:"pointer", padding:24,
          background:"linear-gradient(135deg,#0d1a10,#0a1808)", border:"1px solid rgba(0,230,118,.15)",
          boxShadow:"0 8px 40px rgba(0,230,118,.06)", textAlign:"left", transition:"transform .15s,box-shadow .15s",
          position:"relative", overflow:"hidden" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 50px rgba(0,230,118,.12)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 40px rgba(0,230,118,.06)";}}>
          <div style={{ position:"absolute", top:-20, right:-20, fontSize:80, opacity:.07 }}>🖼</div>
          <div style={{ fontSize:36, marginBottom:12 }}>🖼</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#00e676", marginBottom:6 }}>Colagem de Fotos</div>
          <div style={{ fontSize:11, color:"#1a3a20", lineHeight:1.6 }}>2, 3 ou 4 fotos em grid<br/>Vários layouts · Export PNG</div>
          <div style={{ marginTop:16, fontSize:10, color:"#00e676", fontWeight:700, letterSpacing:2 }}>ABRIR →</div>
        </button>
        {/* Criar Post */}
        <button onClick={() => onSelect("creator")} style={{ flex:"1 1 200px", minHeight:160, borderRadius:16, cursor:"pointer", padding:24,
          background:"linear-gradient(135deg,#1a0d2e,#120a20)", border:"1px solid rgba(178,79,255,.2)",
          boxShadow:"0 8px 40px rgba(178,79,255,.08)", textAlign:"left", transition:"transform .15s,box-shadow .15s",
          position:"relative", overflow:"hidden" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 50px rgba(178,79,255,.18)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 40px rgba(178,79,255,.08)";}}>
          <div style={{ position:"absolute", top:-20, right:-20, fontSize:80, opacity:.07 }}>✦</div>
          <div style={{ fontSize:36, marginBottom:12 }}>✦</div>
          <div style={{ fontSize:18, fontWeight:900, color:"#b24fff", marginBottom:6 }}>Criar Post</div>
          <div style={{ fontSize:11, color:"#3a2050", lineHeight:1.6 }}>Templates prontos · Foto + preço<br/>Gera post profissional em segundos</div>
          <div style={{ marginTop:16, fontSize:10, color:"#b24fff", fontWeight:700, letterSpacing:2 }}>ABRIR →</div>
        </button>
      </div>
      <p style={{ marginTop:32, fontSize:10, color:"#1a2535" }}>Maker Info · Várzea Grande · MT</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHOTO EDITOR
═══════════════════════════════════════════════════════════════════ */

/* ── CSS Filters ── */
const ADJUSTMENTS = [
  { id:"brightness",  label:"Brilho",      min:-100, max:100, def:0,   unit:"%" },
  { id:"contrast",    label:"Contraste",   min:-100, max:100, def:0,   unit:"%" },
  { id:"saturation",  label:"Saturação",   min:-100, max:100, def:0,   unit:"%" },
  { id:"temperature", label:"Temperatura", min:-100, max:100, def:0,   unit:"" },
  { id:"sharpness",   label:"Nitidez",     min:0,    max:100, def:0,   unit:"%" },
  { id:"fade",        label:"Fade",        min:0,    max:100, def:0,   unit:"%" },
  { id:"vignette",    label:"Vinheta",     min:0,    max:100, def:0,   unit:"%" },
  { id:"grain",       label:"Grão",        min:0,    max:100, def:0,   unit:"%" },
  { id:"highlights",  label:"Realces",     min:-100, max:100, def:0,   unit:"%" },
  { id:"shadows",     label:"Sombras",     min:-100, max:100, def:0,   unit:"%" },
];

const FILTERS = [
  // 🌟 Populares
  { id:"none",        label:"Original",      cat:"🌟 Populares",  adj:{} },
  { id:"natural",     label:"Natural",       cat:"🌟 Populares",  adj:{ brightness:5, contrast:5, saturation:5 } },
  { id:"vivid",       label:"Vibrante",      cat:"🌟 Populares",  adj:{ brightness:5, contrast:15, saturation:40 } },
  { id:"golden",      label:"Golden",        cat:"🌟 Populares",  adj:{ brightness:10, contrast:5, saturation:20, temperature:40 } },
  { id:"moody",       label:"Moody",         cat:"🌟 Populares",  adj:{ brightness:-10, contrast:25, saturation:-15, shadows:-10 } },
  { id:"cinema",      label:"Cinema",        cat:"🌟 Populares",  adj:{ brightness:-5, contrast:30, saturation:-20, temperature:-15, fade:10 } },
  { id:"vintage",     label:"Vintage",       cat:"🌟 Populares",  adj:{ brightness:5, contrast:-10, saturation:-30, temperature:30, fade:25, grain:20 } },
  { id:"bw",          label:"P&B",           cat:"🌟 Populares",  adj:{ saturation:-100, contrast:10 } },
  { id:"portrait",    label:"Retrato",       cat:"🌟 Populares",  adj:{ brightness:12, contrast:8, saturation:-5, temperature:10, fade:8 } },
  { id:"editorial",   label:"Editorial",     cat:"🌟 Populares",  adj:{ brightness:3, contrast:25, saturation:-5 } },
  // 🎨 Vibrante
  { id:"neon",        label:"Neon",          cat:"🎨 Vibrante",   adj:{ brightness:5, contrast:20, saturation:80, temperature:-10 } },
  { id:"pop",         label:"Pop Art",       cat:"🎨 Vibrante",   adj:{ brightness:10, contrast:25, saturation:90 } },
  { id:"summer",      label:"Verão",         cat:"🎨 Vibrante",   adj:{ brightness:15, contrast:5, saturation:50, temperature:30 } },
  { id:"tropical",    label:"Tropical",      cat:"🎨 Vibrante",   adj:{ brightness:10, contrast:15, saturation:70, temperature:20 } },
  { id:"electric",    label:"Elétrico",      cat:"🎨 Vibrante",   adj:{ brightness:8, contrast:30, saturation:100, temperature:-20 } },
  { id:"ultravivid",  label:"Ultra Vívido",  cat:"🎨 Vibrante",   adj:{ brightness:0, contrast:25, saturation:75 } },
  { id:"chrome",      label:"Chrome",        cat:"🎨 Vibrante",   adj:{ brightness:15, contrast:35, saturation:60, temperature:-15 } },
  { id:"hdr",         label:"HDR",           cat:"🎨 Vibrante",   adj:{ brightness:0, contrast:40, saturation:35 } },
  { id:"candy",       label:"Candy",         cat:"🎨 Vibrante",   adj:{ brightness:20, saturation:60, temperature:25, fade:10 } },
  { id:"sunset",      label:"Pôr do Sol",    cat:"🎨 Vibrante",   adj:{ brightness:5, contrast:10, saturation:35, temperature:60 } },
  { id:"carnival",    label:"Carnaval",      cat:"🎨 Vibrante",   adj:{ brightness:15, contrast:20, saturation:85, temperature:10 } },
  { id:"hyperpop",    label:"Hyperpop",      cat:"🎨 Vibrante",   adj:{ brightness:20, contrast:15, saturation:95, temperature:-30 } },
  { id:"deepfuse",    label:"Deep Fuse",     cat:"🎨 Vibrante",   adj:{ brightness:0, contrast:35, saturation:90, temperature:-25 } },
  { id:"glowup",      label:"Glow Up",       cat:"🎨 Vibrante",   adj:{ brightness:25, contrast:5, saturation:45, fade:8 } },
  // 🖤 Preto & Branco
  { id:"bwsoft",      label:"P&B Suave",     cat:"🖤 P&B",        adj:{ saturation:-100, brightness:10, fade:15 } },
  { id:"bwhigh",      label:"Alto Contraste",cat:"🖤 P&B",        adj:{ saturation:-100, contrast:45, brightness:-5 } },
  { id:"bwfilm",      label:"Filme P&B",     cat:"🖤 P&B",        adj:{ saturation:-100, contrast:20, fade:12, grain:15 } },
  { id:"bwdrama",     label:"Drama P&B",     cat:"🖤 P&B",        adj:{ saturation:-100, contrast:60, brightness:-10, vignette:40 } },
  { id:"bwmatte",     label:"Matte P&B",     cat:"🖤 P&B",        adj:{ saturation:-100, contrast:-5, brightness:10, fade:20 } },
  { id:"noir",        label:"Noir",          cat:"🖤 P&B",        adj:{ saturation:-100, contrast:35, brightness:-15, vignette:60, shadows:-20 } },
  { id:"infrared",    label:"Infravermelho", cat:"🖤 P&B",        adj:{ saturation:-100, contrast:25, brightness:20, highlights:30 } },
  { id:"silver",      label:"Prata",         cat:"🖤 P&B",        adj:{ saturation:-80, contrast:10, brightness:8, fade:8 } },
  { id:"bwgrain",     label:"Grão P&B",      cat:"🖤 P&B",        adj:{ saturation:-100, contrast:15, grain:35, brightness:5 } },
  { id:"bwselenium",  label:"Selênio",       cat:"🖤 P&B",        adj:{ saturation:-90, contrast:20, temperature:15, fade:10 } },
  { id:"bwpunch",     label:"Punch P&B",     cat:"🖤 P&B",        adj:{ saturation:-100, contrast:55, brightness:0, shadows:-25, highlights:20 } },
  // 🌅 Quente
  { id:"warm",        label:"Quente",        cat:"🌅 Quente",     adj:{ temperature:45, saturation:10, brightness:5 } },
  { id:"sunrise",     label:"Nascer do Sol", cat:"🌅 Quente",     adj:{ brightness:15, contrast:10, saturation:20, temperature:50 } },
  { id:"bonfire",     label:"Fogueira",      cat:"🌅 Quente",     adj:{ brightness:5, contrast:20, saturation:25, temperature:70 } },
  { id:"desert",      label:"Deserto",       cat:"🌅 Quente",     adj:{ brightness:10, contrast:15, saturation:15, temperature:55, fade:10 } },
  { id:"amber",       label:"Âmbar",         cat:"🌅 Quente",     adj:{ brightness:5, contrast:10, saturation:20, temperature:80 } },
  { id:"peach",       label:"Pêssego",       cat:"🌅 Quente",     adj:{ brightness:15, saturation:15, temperature:40, fade:15 } },
  { id:"cozy",        label:"Aconchego",     cat:"🌅 Quente",     adj:{ brightness:8, contrast:8, saturation:10, temperature:35, fade:20 } },
  { id:"mexico",      label:"México",        cat:"🌅 Quente",     adj:{ brightness:5, contrast:20, saturation:45, temperature:50, fade:8 } },
  { id:"campfire",    label:"Acampamento",   cat:"🌅 Quente",     adj:{ brightness:3, contrast:18, saturation:20, temperature:65, grain:10 } },
  { id:"saffron",     label:"Açafrão",       cat:"🌅 Quente",     adj:{ brightness:8, contrast:12, saturation:35, temperature:75 } },
  { id:"tuscany",     label:"Toscana",       cat:"🌅 Quente",     adj:{ brightness:10, contrast:10, saturation:20, temperature:45, fade:12 } },
  // ❄️ Frio
  { id:"cold",        label:"Frio",          cat:"❄️ Frio",       adj:{ temperature:-45, saturation:5, contrast:10 } },
  { id:"arctic",      label:"Ártico",        cat:"❄️ Frio",       adj:{ temperature:-70, saturation:15, brightness:10, contrast:15 } },
  { id:"nordic",      label:"Nórdico",       cat:"❄️ Frio",       adj:{ temperature:-40, saturation:-10, brightness:5, contrast:15 } },
  { id:"steel",       label:"Aço",           cat:"❄️ Frio",       adj:{ temperature:-50, saturation:-20, contrast:25 } },
  { id:"ocean",       label:"Oceano",        cat:"❄️ Frio",       adj:{ temperature:-30, saturation:30, brightness:5, contrast:10 } },
  { id:"mint",        label:"Menta",         cat:"❄️ Frio",       adj:{ temperature:-25, saturation:20, brightness:12, fade:10 } },
  { id:"matrix",      label:"Matrix",        cat:"❄️ Frio",       adj:{ temperature:-60, saturation:80, brightness:-5, contrast:20 } },
  { id:"moonlight",   label:"Luar",          cat:"❄️ Frio",       adj:{ temperature:-35, saturation:-10, brightness:15, contrast:5, fade:10 } },
  { id:"glacier",     label:"Glacial",       cat:"❄️ Frio",       adj:{ temperature:-80, saturation:10, brightness:15, contrast:20 } },
  { id:"skyblue",     label:"Céu Limpo",     cat:"❄️ Frio",       adj:{ temperature:-20, saturation:25, brightness:18, contrast:8 } },
  { id:"cyanpop",     label:"Cyan Pop",      cat:"❄️ Frio",       adj:{ temperature:-40, saturation:60, brightness:5, contrast:25 } },
  // 🎞 Vintage / Analógico
  { id:"kodak",       label:"Kodak",         cat:"🎞 Vintage",    adj:{ brightness:8, contrast:5, saturation:15, temperature:35, fade:18, grain:10 } },
  { id:"fuji",        label:"Fujifilm",      cat:"🎞 Vintage",    adj:{ brightness:5, contrast:10, saturation:10, temperature:-5, fade:12 } },
  { id:"polaroid",    label:"Polaroid",      cat:"🎞 Vintage",    adj:{ brightness:15, contrast:-5, saturation:10, temperature:20, fade:30 } },
  { id:"lomography",  label:"Lomografia",    cat:"🎞 Vintage",    adj:{ brightness:-5, contrast:25, saturation:35, vignette:50, grain:25 } },
  { id:"retro80",     label:"Retrô 80",      cat:"🎞 Vintage",    adj:{ brightness:10, contrast:0, saturation:30, temperature:40, fade:20, grain:15 } },
  { id:"sepia",       label:"Sépia",         cat:"🎞 Vintage",    adj:{ saturation:-80, temperature:70, brightness:5, fade:15 } },
  { id:"daguerreotype",label:"Daguerreótipo",cat:"🎞 Vintage",    adj:{ saturation:-100, contrast:-10, brightness:8, fade:30, grain:25, temperature:20 } },
  { id:"analog",      label:"Analógico",     cat:"🎞 Vintage",    adj:{ brightness:5, saturation:-15, contrast:5, fade:15, grain:20 } },
  { id:"faded70",     label:"Anos 70",       cat:"🎞 Vintage",    adj:{ brightness:8, saturation:-20, temperature:40, fade:25, grain:10 } },
  { id:"retro60",     label:"Anos 60",       cat:"🎞 Vintage",    adj:{ brightness:12, saturation:25, temperature:30, fade:22, grain:8 } },
  { id:"vhs",         label:"VHS",           cat:"🎞 Vintage",    adj:{ brightness:-5, contrast:10, saturation:20, temperature:15, grain:30, fade:8 } },
  { id:"superia",     label:"Superia 400",   cat:"🎞 Vintage",    adj:{ brightness:5, contrast:8, saturation:8, temperature:10, fade:10, grain:8 } },
  { id:"slide",       label:"Diapositivo",   cat:"🎞 Vintage",    adj:{ brightness:8, contrast:15, saturation:20, temperature:5, grain:5 } },
  { id:"expired",     label:"Filme Vencido", cat:"🎞 Vintage",    adj:{ brightness:10, saturation:-25, temperature:50, fade:35, grain:20 } },
  // 🌸 Suave / Pastel
  { id:"pastel",      label:"Pastel",        cat:"🌸 Suave",      adj:{ brightness:15, saturation:-20, fade:20 } },
  { id:"fade",        label:"Desbotado",     cat:"🌸 Suave",      adj:{ fade:35, saturation:-10, brightness:5 } },
  { id:"pink",        label:"Rosa",          cat:"🌸 Suave",      adj:{ temperature:20, saturation:15, brightness:8, fade:10 } },
  { id:"cotton",      label:"Algodão",       cat:"🌸 Suave",      adj:{ brightness:20, saturation:-15, fade:30, contrast:-10 } },
  { id:"dream",       label:"Sonho",         cat:"🌸 Suave",      adj:{ brightness:18, saturation:5, fade:25, contrast:-5 } },
  { id:"blush",       label:"Blush",         cat:"🌸 Suave",      adj:{ brightness:12, saturation:10, temperature:25, fade:20 } },
  { id:"aesthetic",   label:"Aesthetic",     cat:"🌸 Suave",      adj:{ brightness:8, saturation:-10, fade:15, temperature:-10 } },
  { id:"glam",        label:"Glam",          cat:"🌸 Suave",      adj:{ brightness:15, contrast:8, saturation:5, fade:12, temperature:10 } },
  { id:"lavender",    label:"Lavanda",       cat:"🌸 Suave",      adj:{ brightness:12, saturation:5, temperature:-15, fade:18 } },
  { id:"milky",       label:"Leitoso",       cat:"🌸 Suave",      adj:{ brightness:22, saturation:-25, contrast:-15, fade:25 } },
  { id:"softglow",    label:"Soft Glow",     cat:"🌸 Suave",      adj:{ brightness:20, contrast:-10, saturation:-5, fade:20 } },
  { id:"cherry",      label:"Cereja",        cat:"🌸 Suave",      adj:{ brightness:10, saturation:20, temperature:30, fade:12 } },
  { id:"whiteout",    label:"Claro Extremo", cat:"🌸 Suave",      adj:{ brightness:30, contrast:-20, saturation:-30, fade:35 } },
  // 🌃 Dark & Dramático
  { id:"dramatic",    label:"Dramático",     cat:"🌃 Dark",       adj:{ contrast:40, saturation:20, brightness:-5, shadows:-20, highlights:15 } },
  { id:"shadow",      label:"Sombra",        cat:"🌃 Dark",       adj:{ brightness:-20, contrast:35, saturation:10, vignette:70 } },
  { id:"abyss",       label:"Abismo",        cat:"🌃 Dark",       adj:{ brightness:-25, contrast:50, saturation:-20, vignette:80 } },
  { id:"hellfire",    label:"Inferno",       cat:"🌃 Dark",       adj:{ brightness:-10, contrast:40, saturation:30, temperature:50, vignette:50 } },
  { id:"darkmoody",   label:"Dark Moody",    cat:"🌃 Dark",       adj:{ brightness:-15, contrast:30, saturation:-10, shadows:-30, vignette:40 } },
  { id:"crimson",     label:"Carmesim",      cat:"🌃 Dark",       adj:{ brightness:-5, contrast:30, saturation:40, temperature:60, vignette:40 } },
  { id:"midnight",    label:"Meia-noite",    cat:"🌃 Dark",       adj:{ brightness:-20, contrast:20, saturation:-30, temperature:-20, vignette:60 } },
  { id:"gothic",      label:"Gótico",        cat:"🌃 Dark",       adj:{ brightness:-15, contrast:35, saturation:-40, vignette:50, fade:5, grain:15 } },
  { id:"underworld",  label:"Submundo",      cat:"🌃 Dark",       adj:{ brightness:-30, contrast:45, saturation:-50, vignette:90, grain:20 } },
  { id:"bloodmoon",   label:"Lua de Sangue", cat:"🌃 Dark",       adj:{ brightness:-10, contrast:35, saturation:50, temperature:80, vignette:60 } },
  { id:"blackout",    label:"Blackout",      cat:"🌃 Dark",       adj:{ brightness:-35, contrast:55, saturation:-60, vignette:100 } },
  { id:"void",        label:"Vazio",         cat:"🌃 Dark",       adj:{ brightness:-20, contrast:40, saturation:-80, vignette:70 } },
  // ✨ Editorial / Moda
  { id:"magazine",    label:"Revista",       cat:"✨ Editorial",   adj:{ brightness:8, contrast:20, saturation:10 } },
  { id:"luxe",        label:"Luxo",          cat:"✨ Editorial",   adj:{ brightness:5, contrast:15, saturation:-15, temperature:15 } },
  { id:"highfashion", label:"Alta Moda",     cat:"✨ Editorial",   adj:{ brightness:10, contrast:30, saturation:-20, fade:10 } },
  { id:"prestige",    label:"Prestígio",     cat:"✨ Editorial",   adj:{ brightness:5, contrast:18, saturation:-10, temperature:20 } },
  { id:"gallery",     label:"Galeria",       cat:"✨ Editorial",   adj:{ brightness:8, contrast:12, saturation:-25, fade:5 } },
  { id:"runway",      label:"Passarela",     cat:"✨ Editorial",   adj:{ brightness:12, contrast:22, saturation:-15, fade:8 } },
  { id:"ivory",       label:"Marfim",        cat:"✨ Editorial",   adj:{ brightness:15, contrast:8, saturation:-20, temperature:15, fade:12 } },
  { id:"vogue",       label:"Vogue",         cat:"✨ Editorial",   adj:{ brightness:5, contrast:28, saturation:-18, temperature:-5 } },
  { id:"couture",     label:"Couture",       cat:"✨ Editorial",   adj:{ brightness:10, contrast:15, saturation:-10, temperature:10, fade:10 } },
  // 🍃 Orgânico / Natural
  { id:"earth",       label:"Terra",         cat:"🍃 Orgânico",   adj:{ brightness:5, contrast:12, saturation:15, temperature:25, fade:10 } },
  { id:"forest",      label:"Floresta",      cat:"🍃 Orgânico",   adj:{ brightness:-5, contrast:15, saturation:20, temperature:-15 } },
  { id:"botanical",   label:"Botânico",      cat:"🍃 Orgânico",   adj:{ brightness:8, contrast:10, saturation:25, temperature:-10, fade:8 } },
  { id:"clay",        label:"Argila",        cat:"🍃 Orgânico",   adj:{ brightness:10, contrast:8, saturation:10, temperature:30, fade:18 } },
  { id:"linen",       label:"Linho",         cat:"🍃 Orgânico",   adj:{ brightness:15, contrast:5, saturation:-10, temperature:20, fade:22 } },
  { id:"hemp",        label:"Natural Cru",   cat:"🍃 Orgânico",   adj:{ brightness:8, saturation:-15, temperature:25, fade:20, grain:8 } },
  { id:"moss",        label:"Musgo",         cat:"🍃 Orgânico",   adj:{ brightness:-5, contrast:15, saturation:30, temperature:-20, fade:5 } },
  { id:"terracotta",  label:"Terracota",     cat:"🍃 Orgânico",   adj:{ brightness:5, contrast:12, saturation:25, temperature:45, fade:12 } },
  // 🍂 Outono / Aconchego
  { id:"autumn",      label:"Outono",        cat:"🍂 Outono",     adj:{ brightness:5, contrast:15, saturation:25, temperature:55, fade:12 } },
  { id:"cinnamon",    label:"Canela",        cat:"🍂 Outono",     adj:{ brightness:5, contrast:10, saturation:20, temperature:65, fade:15 } },
  { id:"harvest",     label:"Colheita",      cat:"🍂 Outono",     adj:{ brightness:10, contrast:15, saturation:30, temperature:60, grain:8 } },
  { id:"maple",       label:"Bordo",         cat:"🍂 Outono",     adj:{ brightness:8, contrast:18, saturation:35, temperature:55, fade:10 } },
  { id:"pumpkin",     label:"Abóbora",       cat:"🍂 Outono",     adj:{ brightness:5, contrast:20, saturation:40, temperature:70 } },
  { id:"woodsmoke",   label:"Fumaça",        cat:"🍂 Outono",     adj:{ brightness:-5, contrast:15, saturation:10, temperature:40, fade:15, grain:10 } },
  // 🏙 Urbano / Street
  { id:"street",      label:"Street",        cat:"🏙 Urbano",     adj:{ brightness:0, contrast:30, saturation:-10, grain:20 } },
  { id:"concrete",    label:"Concreto",      cat:"🏙 Urbano",     adj:{ brightness:-5, contrast:25, saturation:-30, grain:15 } },
  { id:"grunge",      label:"Grunge",        cat:"🏙 Urbano",     adj:{ brightness:-10, contrast:30, saturation:-20, grain:25, vignette:30 } },
  { id:"gritty",      label:"Gritty",        cat:"🏙 Urbano",     adj:{ brightness:-15, contrast:40, saturation:-15, grain:30, vignette:40 } },
  { id:"rawstreet",   label:"Raw Street",    cat:"🏙 Urbano",     adj:{ brightness:0, contrast:22, saturation:0, grain:18, vignette:25 } },
  { id:"subway",      label:"Metrô",         cat:"🏙 Urbano",     adj:{ brightness:-8, contrast:20, saturation:-25, temperature:-10, grain:12 } },
  { id:"neon_city",   label:"Cidade Neon",   cat:"🏙 Urbano",     adj:{ brightness:0, contrast:35, saturation:60, temperature:-20, vignette:45 } },
  // 🎭 Dramático / Arte
  { id:"chiaroscuro", label:"Chiaroscuro",   cat:"🎭 Artístico",  adj:{ brightness:-15, contrast:60, saturation:-10, vignette:50 } },
  { id:"teal_orange", label:"Teal & Orange", cat:"🎭 Artístico",  adj:{ brightness:0, contrast:30, saturation:25, temperature:40, vignette:20 } },
  { id:"deluxe",      label:"Deluxe",        cat:"🎭 Artístico",  adj:{ brightness:5, contrast:25, saturation:15, temperature:20, fade:10 } },
  { id:"duotone_bw",  label:"Duotone P&B",   cat:"🎭 Artístico",  adj:{ saturation:-70, contrast:35, brightness:5, fade:10 } },
  { id:"impressionist",label:"Impressionista",cat:"🎭 Artístico", adj:{ brightness:10, contrast:-5, saturation:30, fade:20 } },
  { id:"painterly",   label:"Pictórico",     cat:"🎭 Artístico",  adj:{ brightness:8, contrast:15, saturation:25, fade:15 } },
  { id:"sketch",      label:"Esboço",        cat:"🎭 Artístico",  adj:{ saturation:-85, contrast:40, brightness:10, grain:20 } },
  // 🤳 Selfie / Beleza
  { id:"skin",        label:"Pele Perfeita", cat:"🤳 Beleza",     adj:{ brightness:15, contrast:-5, saturation:5, temperature:10, fade:15 } },
  { id:"glow",        label:"Glow",          cat:"🤳 Beleza",     adj:{ brightness:20, contrast:-8, saturation:8, fade:18 } },
  { id:"dewy",        label:"Luminoso",      cat:"🤳 Beleza",     adj:{ brightness:18, contrast:-5, saturation:5, temperature:8, fade:20 } },
  { id:"bronzed",     label:"Bronzeado",     cat:"🤳 Beleza",     adj:{ brightness:5, contrast:10, saturation:20, temperature:40 } },
  { id:"airbrushed",  label:"Airbrush",      cat:"🤳 Beleza",     adj:{ brightness:22, contrast:-12, saturation:-5, fade:25 } },
  { id:"beauty",      label:"Beauty",        cat:"🤳 Beleza",     adj:{ brightness:15, contrast:5, saturation:5, temperature:12, fade:12 } },
  { id:"soft_skin",   label:"Pele Suave",    cat:"🤳 Beleza",     adj:{ brightness:18, contrast:-10, saturation:0, fade:22 } },
  // 🍕 Comida / Produto
  { id:"foodie",      label:"Foodie",        cat:"🍕 Comida",     adj:{ brightness:12, contrast:18, saturation:35, temperature:15 } },
  { id:"delicious",   label:"Apetitoso",     cat:"🍕 Comida",     adj:{ brightness:15, contrast:20, saturation:40, temperature:20 } },
  { id:"bakery",      label:"Padaria",       cat:"🍕 Comida",     adj:{ brightness:15, contrast:10, saturation:20, temperature:35, fade:10 } },
  { id:"coffeeshop",  label:"Café",          cat:"🍕 Comida",     adj:{ brightness:8, contrast:15, saturation:15, temperature:40, fade:15 } },
  { id:"fresh",       label:"Fresco",        cat:"🍕 Comida",     adj:{ brightness:15, contrast:15, saturation:30, temperature:-5 } },
  { id:"product",     label:"Produto",       cat:"🍕 Comida",     adj:{ brightness:15, contrast:22, saturation:10, temperature:5 } },
  // 🌊 Praia / Tropical
  { id:"beach",       label:"Praia",         cat:"🌊 Praia",      adj:{ brightness:15, contrast:10, saturation:30, temperature:20 } },
  { id:"caribbean",   label:"Caribe",        cat:"🌊 Praia",      adj:{ brightness:12, contrast:15, saturation:45, temperature:15 } },
  { id:"surf",        label:"Surf",          cat:"🌊 Praia",      adj:{ brightness:10, contrast:20, saturation:35, temperature:-10 } },
  { id:"aqua",        label:"Água",          cat:"🌊 Praia",      adj:{ brightness:10, contrast:15, saturation:40, temperature:-20 } },
  { id:"lagoon",      label:"Lagoa",         cat:"🌊 Praia",      adj:{ brightness:8, contrast:12, saturation:35, temperature:-15 } },
  { id:"paradise",    label:"Paraíso",       cat:"🌊 Praia",      adj:{ brightness:15, contrast:8, saturation:50, temperature:10 } },
  // 🌆 Pôr do Sol / Hora Dourada
  { id:"goldenhour",  label:"Hora Dourada",  cat:"🌆 Golden Hour",adj:{ brightness:10, contrast:15, saturation:30, temperature:55 } },
  { id:"afterglow",   label:"Afterglow",     cat:"🌆 Golden Hour",adj:{ brightness:12, contrast:12, saturation:25, temperature:65, fade:8 } },
  { id:"dusk",        label:"Entardecer",    cat:"🌆 Golden Hour",adj:{ brightness:-5, contrast:20, saturation:30, temperature:60, vignette:20 } },
  { id:"magic_hour",  label:"Hora Mágica",   cat:"🌆 Golden Hour",adj:{ brightness:8, contrast:18, saturation:35, temperature:70 } },
  { id:"twilight",    label:"Crepúsculo",    cat:"🌆 Golden Hour",adj:{ brightness:-8, contrast:22, saturation:20, temperature:50, vignette:30 } },
  // ✏️ Matte / Flat
  { id:"matte",       label:"Matte",         cat:"✏️ Matte",      adj:{ brightness:8, contrast:-10, saturation:-15, fade:25 } },
  { id:"flatlay",     label:"Flat Lay",      cat:"✏️ Matte",      adj:{ brightness:15, contrast:-5, saturation:-10, fade:20 } },
  { id:"filmfade",    label:"Film Fade",     cat:"✏️ Matte",      adj:{ brightness:10, contrast:-8, saturation:-20, fade:30 } },
  { id:"haze",        label:"Névoa",         cat:"✏️ Matte",      adj:{ brightness:12, contrast:-15, saturation:-5, fade:35 } },
  { id:"washed",      label:"Lavado",        cat:"✏️ Matte",      adj:{ brightness:18, contrast:-20, saturation:-20, fade:40 } },
  { id:"minimal",     label:"Minimal",       cat:"✏️ Matte",      adj:{ brightness:12, contrast:5, saturation:-20, fade:15 } },
];


const FILTER_CATS = ["Todos", ...Array.from(new Set(FILTERS.filter(f=>f.id!=="none").map(f=>f.cat)))];


function adjToCSS(adj) {
  const br = 1 + (adj.brightness||0)/100;
  const co = 1 + (adj.contrast||0)/100;
  const sa = 1 + (adj.saturation||0)/100;
  const sh = adj.sharpness||0;
  let filter = `brightness(${br}) contrast(${co}) saturate(${Math.max(0,sa)})`;
  if (adj.temperature) {
    const t = adj.temperature;
    if (t > 0) filter += ` sepia(${t * 0.004}) saturate(${1 + t*0.005})`;
    else filter += ` hue-rotate(${t * 0.2}deg)`;
  }
  if (sh > 0) filter += ` contrast(${1 + sh*0.003})`;
  return filter;
}

function adjToOverlays(adj, w, h) {
  const layers = [];
  if (adj.fade > 0) layers.push({ background:`rgba(255,255,255,${adj.fade/300})`, mixBlendMode:"normal" });
  if (adj.vignette > 0) layers.push({ background:`radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${adj.vignette/150}) 100%)`, mixBlendMode:"multiply" });
  return layers;
}

/* ── Font libraries ── */
const FONTS_INSTAGRAM = [
  // ✍️ Cursiva / Manuscrita
  { name:"Dancing Script",     label:"Dancing Script",     cat:"✍️ Cursiva" },
  { name:"Pacifico",           label:"Pacifico",           cat:"✍️ Cursiva" },
  { name:"Great Vibes",        label:"Great Vibes",        cat:"✍️ Cursiva" },
  { name:"Satisfy",            label:"Satisfy",            cat:"✍️ Cursiva" },
  { name:"Sacramento",         label:"Sacramento",         cat:"✍️ Cursiva" },
  { name:"Allura",             label:"Allura",             cat:"✍️ Cursiva" },
  { name:"Italianno",          label:"Italianno",          cat:"✍️ Cursiva" },
  { name:"Lobster",            label:"Lobster",            cat:"✍️ Cursiva" },
  { name:"Courgette",          label:"Courgette",          cat:"✍️ Cursiva" },
  { name:"Kaushan Script",     label:"Kaushan Script",     cat:"✍️ Cursiva" },
  { name:"Alex Brush",         label:"Alex Brush",         cat:"✍️ Cursiva" },
  { name:"Pinyon Script",      label:"Pinyon Script",      cat:"✍️ Cursiva" },
  { name:"Mr Dafoe",           label:"Mr Dafoe",           cat:"✍️ Cursiva" },
  { name:"Clicker Script",     label:"Clicker Script",     cat:"✍️ Cursiva" },
  { name:"Tangerine",          label:"Tangerine",          cat:"✍️ Cursiva" },
  { name:"Parisienne",         label:"Parisienne",         cat:"✍️ Cursiva" },
  { name:"Herr Von Muellerhoff",label:"Herr Von M.",       cat:"✍️ Cursiva" },
  { name:"Euphoria Script",    label:"Euphoria",           cat:"✍️ Cursiva" },
  { name:"Dawning of a New Day",label:"Dawning Day",       cat:"✍️ Cursiva" },
  { name:"Yellowtail",         label:"Yellowtail",         cat:"✍️ Cursiva" },
  // 💎 Serif Elegante
  { name:"Playfair Display",   label:"Playfair Display",   cat:"💎 Elegante" },
  { name:"Cormorant Garamond", label:"Cormorant",          cat:"💎 Elegante" },
  { name:"Libre Baskerville",  label:"Baskerville",        cat:"💎 Elegante" },
  { name:"EB Garamond",        label:"EB Garamond",        cat:"💎 Elegante" },
  { name:"Crimson Text",       label:"Crimson Text",       cat:"💎 Elegante" },
  { name:"Lora",               label:"Lora",               cat:"💎 Elegante" },
  { name:"DM Serif Display",   label:"DM Serif",           cat:"💎 Elegante" },
  { name:"Tenor Sans",         label:"Tenor Sans",         cat:"💎 Elegante" },
  { name:"Spectral",           label:"Spectral",           cat:"💎 Elegante" },
  { name:"Philosopher",        label:"Philosopher",        cat:"💎 Elegante" },
  { name:"Volkhov",            label:"Volkhov",            cat:"💎 Elegante" },
  { name:"Bodoni Moda",        label:"Bodoni Moda",        cat:"💎 Elegante" },
  { name:"GFS Didot",          label:"GFS Didot",          cat:"💎 Elegante" },
  // 🤍 Clean / Minimalista
  { name:"Lato",               label:"Lato",               cat:"🤍 Clean" },
  { name:"Nunito",             label:"Nunito",             cat:"🤍 Clean" },
  { name:"Quicksand",          label:"Quicksand",          cat:"🤍 Clean" },
  { name:"Josefin Sans",       label:"Josefin Sans",       cat:"🤍 Clean" },
  { name:"Raleway",            label:"Raleway",            cat:"🤍 Clean" },
  { name:"Poppins",            label:"Poppins",            cat:"🤍 Clean" },
  { name:"Montserrat",         label:"Montserrat",         cat:"🤍 Clean" },
  { name:"DM Sans",            label:"DM Sans",            cat:"🤍 Clean" },
  { name:"Inter",              label:"Inter",              cat:"🤍 Clean" },
  { name:"Work Sans",          label:"Work Sans",          cat:"🤍 Clean" },
  { name:"Manrope",            label:"Manrope",            cat:"🤍 Clean" },
  { name:"Plus Jakarta Sans",  label:"Jakarta Sans",       cat:"🤍 Clean" },
  { name:"Outfit",             label:"Outfit",             cat:"🤍 Clean" },
  // 🌸 Decorativa / Divertida
  { name:"Amatic SC",          label:"Amatic SC",          cat:"🌸 Decorativa" },
  { name:"Caveat",             label:"Caveat",             cat:"🌸 Decorativa" },
  { name:"Permanent Marker",   label:"Permanent Marker",   cat:"🌸 Decorativa" },
  { name:"Indie Flower",       label:"Indie Flower",       cat:"🌸 Decorativa" },
  { name:"Patrick Hand",       label:"Patrick Hand",       cat:"🌸 Decorativa" },
  { name:"Shadows Into Light", label:"Shadows Into Light", cat:"🌸 Decorativa" },
  { name:"Just Another Hand",  label:"Just Another Hand",  cat:"🌸 Decorativa" },
  { name:"Gochi Hand",         label:"Gochi Hand",         cat:"🌸 Decorativa" },
  { name:"Covered By Your Grace",label:"Covered Grace",    cat:"🌸 Decorativa" },
  { name:"Gloria Hallelujah",  label:"Gloria Hallelujah",  cat:"🌸 Decorativa" },
  { name:"Architects Daughter",label:"Arch. Daughter",     cat:"🌸 Decorativa" },
  { name:"Short Stack",        label:"Short Stack",        cat:"🌸 Decorativa" },
  // 📐 Condensada
  { name:"Barlow Condensed",   label:"Barlow Condensed",   cat:"📐 Condensada" },
  { name:"Oswald",             label:"Oswald",             cat:"📐 Condensada" },
  { name:"League Gothic",      label:"League Gothic",      cat:"📐 Condensada" },
  { name:"Kanit",              label:"Kanit",              cat:"📐 Condensada" },
  { name:"Encode Sans Condensed",label:"Encode Condensed", cat:"📐 Condensada" },
  { name:"Saira Condensed",    label:"Saira Condensed",    cat:"📐 Condensada" },
  // 🏰 Gótica / Medieval
  { name:"UnifrakturMaguntia", label:"UnifrakturMaguntia", cat:"🏰 Gótica" },
  { name:"Cinzel Decorative",  label:"Cinzel Decorative",  cat:"🏰 Gótica" },
  { name:"Cinzel",             label:"Cinzel",             cat:"🏰 Gótica" },
  { name:"Metamorphous",       label:"Metamorphous",       cat:"🏰 Gótica" },
  { name:"Uncial Antiqua",     label:"Uncial Antiqua",     cat:"🏰 Gótica" },
  { name:"Pirata One",         label:"Pirata One",         cat:"🏰 Gótica" },
  { name:"Almendra Display",   label:"Almendra Display",   cat:"🏰 Gótica" },
  { name:"Fondamento",         label:"Fondamento",         cat:"🏰 Gótica" },
  { name:"IM Fell English",    label:"IM Fell English",    cat:"🏰 Gótica" },
  { name:"MedievalSharp",      label:"MedievalSharp",      cat:"🏰 Gótica" },
  { name:"Germania One",       label:"Germania One",       cat:"🏰 Gótica" },
  { name:"Caesar Dressing",    label:"Caesar Dressing",    cat:"🏰 Gótica" },
  { name:"Grenze Gotisch",     label:"Grenze Gotisch",     cat:"🏰 Gótica" },
  { name:"Macondo",            label:"Macondo",            cat:"🏰 Gótica" },
  { name:"Ruge Boogie",        label:"Ruge Boogie",        cat:"🏰 Gótica" },
  // ⚔️ Medieval / Fantasia
  { name:"Almendra SC",        label:"Almendra SC",        cat:"⚔️ Medieval" },
  { name:"Jim Nightshade",     label:"Jim Nightshade",     cat:"⚔️ Medieval" },
  { name:"Caudex",             label:"Caudex",             cat:"⚔️ Medieval" },
  { name:"Domine",             label:"Domine",             cat:"⚔️ Medieval" },
  { name:"Inknut Antiqua",     label:"Inknut Antiqua",     cat:"⚔️ Medieval" },
  { name:"Fenix",              label:"Fenix",              cat:"⚔️ Medieval" },
  { name:"Julee",              label:"Julee",              cat:"⚔️ Medieval" },
  { name:"Bilbo",              label:"Bilbo",              cat:"⚔️ Medieval" },
  { name:"Bilbo Swash Caps",   label:"Bilbo Swash",        cat:"⚔️ Medieval" },
  // 🤠 Rústica / Western
  { name:"Rye",                label:"Rye",                cat:"🤠 Rústica" },
  { name:"Sancreek",           label:"Sancreek",           cat:"🤠 Rústica" },
  { name:"Rancho",             label:"Rancho",             cat:"🤠 Rústica" },
  { name:"Fredericka the Great",label:"Fredericka",        cat:"🤠 Rústica" },
  { name:"Gravitas One",       label:"Gravitas One",       cat:"🤠 Rústica" },
  { name:"Special Elite",      label:"Special Elite",      cat:"🤠 Rústica" },
  { name:"Patua One",          label:"Patua One",          cat:"🤠 Rústica" },
  { name:"Yeseva One",         label:"Yeseva One",         cat:"🤠 Rústica" },
  { name:"Abril Fatface",      label:"Abril Fatface",      cat:"🤠 Rústica" },
  { name:"Ultra",              label:"Ultra",              cat:"🤠 Rústica" },
  { name:"Boogaloo",           label:"Boogaloo",           cat:"🤠 Rústica" },
  { name:"Luckiest Guy",       label:"Luckiest Guy",       cat:"🤠 Rústica" },
  // 💀 Horror / Grunge
  { name:"Creepster",          label:"Creepster",          cat:"💀 Horror" },
  { name:"Nosifer",            label:"Nosifer",            cat:"💀 Horror" },
  { name:"Butcherman",         label:"Butcherman",         cat:"💀 Horror" },
  { name:"Rubik Dirt",         label:"Rubik Dirt",         cat:"💀 Horror" },
  { name:"Rock Salt",          label:"Rock Salt",          cat:"💀 Horror" },
  { name:"Black Ops One",      label:"Black Ops One",      cat:"💀 Horror" },
  { name:"Freckle Face",       label:"Freckle Face",       cat:"💀 Horror" },
  { name:"Kranky",             label:"Kranky",             cat:"💀 Horror" },
  { name:"Jolly Lodger",       label:"Jolly Lodger",       cat:"💀 Horror" },
  { name:"Faster One",         label:"Faster One",         cat:"💀 Horror" },
  { name:"Eater",              label:"Eater",              cat:"💀 Horror" },
  // 🎞 Retrô / Vintage
  { name:"Fredoka One",        label:"Fredoka One",        cat:"🎞 Retrô" },
  { name:"Baloo 2",            label:"Baloo 2",            cat:"🎞 Retrô" },
  { name:"Righteous",          label:"Righteous",          cat:"🎞 Retrô" },
  { name:"Lilita One",         label:"Lilita One",         cat:"🎞 Retrô" },
  { name:"Russo One",          label:"Russo One",          cat:"🎞 Retrô" },
  { name:"Titan One",          label:"Titan One",          cat:"🎞 Retrô" },
  { name:"Press Start 2P",     label:"Press Start 2P",     cat:"🎞 Retrô" },
  { name:"VT323",              label:"VT323",              cat:"🎞 Retrô" },
  { name:"Monoton",            label:"Monoton",            cat:"🎞 Retrô" },
  { name:"Diplomata SC",       label:"Diplomata SC",       cat:"🎞 Retrô" },
  { name:"Codystar",           label:"Codystar",           cat:"🎞 Retrô" },
];

const FONTS_ANUNCIO = [
  // 🔥 Ultra Bold / Outdoor
  { name:"Bebas Neue",         label:"Bebas Neue",         cat:"🔥 Ultra Bold" },
  { name:"Anton",              label:"Anton",              cat:"🔥 Ultra Bold" },
  { name:"Barlow Condensed",   label:"Barlow Condensed",   cat:"🔥 Ultra Bold" },
  { name:"Teko",               label:"Teko",               cat:"🔥 Ultra Bold" },
  { name:"Fjalla One",         label:"Fjalla One",         cat:"🔥 Ultra Bold" },
  { name:"Squada One",         label:"Squada One",         cat:"🔥 Ultra Bold" },
  { name:"Oswald",             label:"Oswald",             cat:"🔥 Ultra Bold" },
  { name:"Black Ops One",      label:"Black Ops One",      cat:"🔥 Ultra Bold" },
  { name:"Big Shoulders Display",label:"Big Shoulders",    cat:"🔥 Ultra Bold" },
  { name:"Dharma Gothic E",    label:"Dharma Gothic",      cat:"🔥 Ultra Bold" },
  // ⚡ Geométrica Moderna
  { name:"Exo 2",              label:"Exo 2",              cat:"⚡ Geométrica" },
  { name:"Rajdhani",           label:"Rajdhani",           cat:"⚡ Geométrica" },
  { name:"Jost",               label:"Jost",               cat:"⚡ Geométrica" },
  { name:"Montserrat",         label:"Montserrat",         cat:"⚡ Geométrica" },
  { name:"Space Grotesk",      label:"Space Grotesk",      cat:"⚡ Geométrica" },
  { name:"Nunito Sans",        label:"Nunito Sans",        cat:"⚡ Geométrica" },
  { name:"Syne",               label:"Syne",               cat:"⚡ Geométrica" },
  { name:"Cabinet Grotesk",    label:"Cabinet Grotesk",    cat:"⚡ Geométrica" },
  // 💪 Slab Serif / Autoridade
  { name:"Alfa Slab One",      label:"Alfa Slab One",      cat:"💪 Slab" },
  { name:"Rokkitt",            label:"Rokkitt",            cat:"💪 Slab" },
  { name:"Arvo",               label:"Arvo",               cat:"💪 Slab" },
  { name:"Zilla Slab",         label:"Zilla Slab",         cat:"💪 Slab" },
  { name:"Crete Round",        label:"Crete Round",        cat:"💪 Slab" },
  { name:"Josefin Slab",       label:"Josefin Slab",       cat:"💪 Slab" },
  { name:"Clarendon Text",     label:"Clarendon Text",     cat:"💪 Slab" },
  { name:"Trocchi",            label:"Trocchi",            cat:"💪 Slab" },
  // 🚀 Futurista / Cyberpunk
  { name:"Orbitron",           label:"Orbitron",           cat:"🚀 Futurista" },
  { name:"Audiowide",          label:"Audiowide",          cat:"🚀 Futurista" },
  { name:"Syncopate",          label:"Syncopate",          cat:"🚀 Futurista" },
  { name:"Share Tech Mono",    label:"Share Tech Mono",    cat:"🚀 Futurista" },
  { name:"Major Mono Display", label:"Major Mono",         cat:"🚀 Futurista" },
  { name:"Nova Square",        label:"Nova Square",        cat:"🚀 Futurista" },
  { name:"Courier Prime",      label:"Courier Prime",      cat:"🚀 Futurista" },
  { name:"Space Mono",         label:"Space Mono",         cat:"🚀 Futurista" },
  // 🏋️ Heavy Impact / Esporte
  { name:"Russo One",          label:"Russo One",          cat:"🏋️ Heavy" },
  { name:"Passion One",        label:"Passion One",        cat:"🏋️ Heavy" },
  { name:"Lilita One",         label:"Lilita One",         cat:"🏋️ Heavy" },
  { name:"Titan One",          label:"Titan One",          cat:"🏋️ Heavy" },
  { name:"Righteous",          label:"Righteous",          cat:"🏋️ Heavy" },
  { name:"Boogaloo",           label:"Boogaloo",           cat:"🏋️ Heavy" },
  { name:"Unica One",          label:"Unica One",          cat:"🏋️ Heavy" },
  // 🎪 Pôster / Circus
  { name:"Abril Fatface",      label:"Abril Fatface",      cat:"🎪 Pôster" },
  { name:"Fredoka One",        label:"Fredoka One",        cat:"🎪 Pôster" },
  { name:"Lobster",            label:"Lobster",            cat:"🎪 Pôster" },
  { name:"Pacifico",           label:"Pacifico",           cat:"🎪 Pôster" },
  { name:"Fugaz One",          label:"Fugaz One",          cat:"🎪 Pôster" },
  { name:"Black Han Sans",     label:"Black Han Sans",     cat:"🎪 Pôster" },
  { name:"Boogaloo",           label:"Boogaloo",           cat:"🎪 Pôster" },
  { name:"Luckiest Guy",       label:"Luckiest Guy",       cat:"🎪 Pôster" },
];
const ALL_FONTS = [...FONTS_INSTAGRAM, ...FONTS_ANUNCIO];
const FONT_CATS = ["Todas", ...Array.from(new Set(ALL_FONTS.map(f=>f.cat)))];
const mkPhotoText = (o={}) => ({ id:uid(), kind:"text", x:40, y:200, w:"auto", h:"auto", rotation:0,
  text:"Texto", fontSize:36, color:"#ffffff", fontFamily:"Barlow Condensed", fontWeight:"700",
  align:"center", letterSpacing:0, opacity:1, shadowBlur:8, shadowColor:"#000", shadowX:0, shadowY:2,
  outline:false, outlineColor:"#000", outlineWidth:2, useGradient:false,
  gradientColor1:"#fff", gradientColor2:"#f5c518", gradientAngle:135, ...o });

const gradCSS = e => `linear-gradient(${e.gradientAngle||135}deg,${e.gradientColor1||"#fff"},${e.gradientColor2||"#f5c518"})`;

/* ── Photo text visual ── */
function PhotoTextView({ el, inline=false }) {
  const rot  = el.rotation ? `rotate(${el.rotation}deg)` : undefined;
  const base = inline
    ? { whiteSpace:"nowrap", opacity:el.opacity??1, pointerEvents:"none", userSelect:"none" }
    : { position:"absolute", left:el.x, top:el.y, width:el.w, opacity:el.opacity??1,
        transform:rot, transformOrigin:"center center", pointerEvents:"none", userSelect:"none" };
  const shadow = `${el.shadowX||0}px ${el.shadowY||2}px ${el.shadowBlur||8}px ${el.shadowColor||"#000"}`;
  const outline = el.outline ? { WebkitTextStroke:`${el.outlineWidth||2}px ${el.outlineColor||"#000"}` } : {};
  if (el.useGradient) return (
    <div style={{ ...base, fontSize:el.fontSize, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
      textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1, whiteSpace: inline?"nowrap":"pre-wrap", wordBreak:"break-word",
      background:gradCSS(el), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      backgroundClip:"text", filter:`drop-shadow(${shadow})`, ...outline }}>{el.text}</div>
  );
  return (
    <div style={{ ...base, fontSize:el.fontSize, color:el.color, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
      textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1, whiteSpace: inline?"nowrap":"pre-wrap",
      wordBreak:"break-word", textShadow:shadow, ...outline }}>{el.text}</div>
  );
}

/* ── Photo text inline editor ── */
function PhotoInlineEdit({ el, onDone }) {
  const ref = useRef(null);
  useEffect(()=>{ if(ref.current){ ref.current.focus(); ref.current.select(); } },[]);
  return (
    <textarea ref={ref} defaultValue={el.text}
      onBlur={e=>onDone(e.target.value)}
      onKeyDown={e=>{ if(e.key==="Escape") onDone(el.text); if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onDone(e.target.value);} }}
      style={{ position:"absolute", left:el.x, top:el.y,
        width: typeof el.w === "number" ? el.w : "max-content", minWidth:120,
        minHeight: typeof el.h === "number" ? el.h : el.fontSize*1.5,
        fontSize:el.fontSize, color:el.useGradient?"#fff":el.color, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
        textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1,
        background:"rgba(255,255,255,.12)", border:"2px solid #fff", borderRadius:4, outline:"none",
        resize:"both", padding:4, zIndex:50, boxSizing:"border-box",
        transform:el.rotation?`rotate(${el.rotation}deg)`:"none", transformOrigin:"center center" }}/>
  );
}

/* ── Draggable text on photo ── */
const PT_HANDLES = [{id:"se",cx:1,cy:1},{id:"sw",cx:0,cy:1},{id:"ne",cx:1,cy:0},{id:"nw",cx:0,cy:0}];
function PhotoTextEl({ el, selected, onSelect, onUpdate, onEdit, scale }) {
  const st = useRef({ mode:null }); const wrapRef = useRef(null); const lastTap = useRef(0); const HS=18;
  const startDrag=(e)=>{ e.stopPropagation();e.preventDefault();
    const now=Date.now(); if(now-lastTap.current<380){onEdit(el.id);return;} lastTap.current=now;
    onSelect(el.id); const p=getPoint(e); st.current={mode:"drag",sx:p.x,sy:p.y,ox:el.x,oy:el.y}; bind(); };
  const startRes=(e,h)=>{e.stopPropagation();e.preventDefault();const r=wrapRef.current?.getBoundingClientRect();const p=getPoint(e);const cw=r?Math.round(r.width/scale):160;const ch=r?Math.round(r.height/scale):50;st.current={mode:"resize",h,sx:p.x,sy:p.y,ox:el.x,oy:el.y,ow:typeof el.w==="number"?el.w:cw,oh:typeof el.h==="number"?el.h:ch};bind();};
  const startRot=(e)=>{e.stopPropagation();e.preventDefault();const r=wrapRef.current?.getBoundingClientRect();if(!r)return;const cx=r.left+r.width/2,cy=r.top+r.height/2;const p=getPoint(e);st.current={mode:"rotate",cx,cy,sa:Math.atan2(p.y-cy,p.x-cx)*180/Math.PI,or:el.rotation||0};bind();};
  const onMove=useCallback((e)=>{const d=st.current;if(!d.mode)return;const p=getPoint(e);const dx=(p.x-d.sx)/scale,dy=(p.y-d.sy)/scale;
    if(d.mode==="drag")onUpdate(el.id,{x:Math.round(d.ox+dx),y:Math.round(d.oy+dy)});
    if(d.mode==="rotate"){const a=Math.atan2(p.y-d.cy,p.x-d.cx)*180/Math.PI;onUpdate(el.id,{rotation:Math.round((d.or+(a-d.sa)+360)%360)});}
    if(d.mode==="resize"){const h=d.h;let nx=d.ox,ny=d.oy,nw=d.ow,nh=d.oh;
      if(h.includes("e"))nw=Math.max(40,d.ow+dx);if(h.includes("s"))nh=Math.max(20,d.oh+dy);
      if(h.includes("w")){nw=Math.max(40,d.ow-dx);nx=d.ox+(d.ow-nw);}if(h.includes("n")){nh=Math.max(20,d.oh-dy);ny=d.oy+(d.oh-nh);}
      onUpdate(el.id,{x:Math.round(nx),y:Math.round(ny),w:Math.round(nw),h:Math.round(nh)});}
  },[el.id,scale,onUpdate]);
  const onUp=useCallback(()=>{st.current.mode=null;unbind();},[]);
  const bind=()=>{window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onUp);};
  const unbind=()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  useEffect(()=>()=>unbind(),[]);
  const isFixed = typeof el.w === "number";
  return (
    <div ref={wrapRef} style={{ position:"absolute", left:el.x, top:el.y,
      width: isFixed ? el.w : "max-content",
      height: isFixed ? (el.h||"auto") : "auto",
      cursor:"move",
      outline: selected ? "2px dashed rgba(255,255,255,.8)" : "2px solid transparent",
      boxSizing:"border-box",
      transform: el.rotation ? `rotate(${el.rotation}deg)` : "none",
      transformOrigin:"center center", touchAction:"none" }}
      onMouseDown={startDrag} onTouchStart={startDrag}>
      <PhotoTextView el={{...el, x:0, y:0}} inline={true}/>
      {selected && <>
        {isFixed && PT_HANDLES.map(h=>(
          <div key={h.id} onMouseDown={e=>startRes(e,h.id)} onTouchStart={e=>startRes(e,h.id)}
            style={{ position:"absolute", width:HS, height:HS, background:"#fff", border:"2px solid #000", borderRadius:3, zIndex:10,
              left:`calc(${h.cx*100}% - ${HS/2}px)`, top:`calc(${h.cy*100}% - ${HS/2}px)`, cursor:"nwse-resize", touchAction:"none" }}/>
        ))}
        <div onMouseDown={startRot} onTouchStart={startRot}
          style={{ position:"absolute", width:22, height:22, background:"#f5c518", border:"2px solid #fff", borderRadius:"50%",
            top:-36, left:"50%", transform:"translateX(-50%)", cursor:"crosshair", zIndex:11,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, touchAction:"none", boxShadow:"0 0 8px rgba(245,197,24,.8)" }}>↻</div>
        <div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"rgba(255,255,255,.8)", background:"rgba(0,0,0,.6)", padding:"2px 7px", borderRadius:3, whiteSpace:"nowrap", pointerEvents:"none" }}>{isFixed?"2× editar":"2× editar · ⊞ resize"}</div>
      </>}
    </div>
  );
}

/* ── Stickers ── */
const STICKERS = ["❤️","🔥","⭐","✨","💫","🌸","🌟","💕","😍","🥰","💯","🎉","🎊","🌈","🦋","🌙","☀️","🍀","💎","👑","🤍","🖤","💜","💙","❄️","🌺","🦄","🎀","💝","✌️"];

/* ── Light effects ── */
const LIGHT_FX = [
  { id:"none",     label:"Nenhum",   style:{} },
  { id:"golden",   label:"Golden",   style:{ background:"radial-gradient(ellipse at 30% 20%, rgba(255,200,50,.35) 0%, transparent 60%)" } },
  { id:"leak1",    label:"Vazamento",style:{ background:"linear-gradient(135deg, rgba(255,100,50,.3) 0%, transparent 40%, rgba(100,50,255,.2) 100%)" } },
  { id:"bokeh",    label:"Bokeh",    style:{ background:"radial-gradient(circle at 70% 30%, rgba(255,255,255,.15) 0%, transparent 25%), radial-gradient(circle at 20% 80%, rgba(255,200,100,.12) 0%, transparent 20%)" } },
  { id:"sunrise",  label:"Aurora",   style:{ background:"linear-gradient(180deg, rgba(255,150,50,.2) 0%, transparent 50%)" } },
  { id:"neon_glow",label:"Neon",     style:{ background:"radial-gradient(ellipse at 50% 50%, rgba(0,212,255,.15) 0%, transparent 70%)" } },
  { id:"dramatic", label:"Dramático",style:{ background:"linear-gradient(to bottom, rgba(0,0,0,.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,.4) 100%)" } },
  { id:"matte",    label:"Matte",    style:{ background:"linear-gradient(to bottom, rgba(200,180,160,.12) 0%, transparent 100%)" } },
];

/* ── Borders ── */
const BORDERS = [
  { id:"none",   label:"Sem borda",  style:{} },
  { id:"white",  label:"Branca",     style:{ padding:16, background:"#fff" } },
  { id:"black",  label:"Preta",      style:{ padding:16, background:"#000" } },
  { id:"thin_w", label:"Fina Branca",style:{ padding:6,  background:"#fff" } },
  { id:"thin_b", label:"Fina Preta", style:{ padding:6,  background:"#000" } },
  { id:"polaroid",label:"Polaroid",  style:{ padding:"16px 16px 48px", background:"#fff" } },
  { id:"rounded",label:"Arredond.",  style:{ padding:12, background:"#fff", borderRadius:24 } },
  { id:"cream",  label:"Creme",      style:{ padding:16, background:"#f5f0e8" } },
];

/* ── Undo/Redo ── */
function histReducer(s, a) {
  if (a.type==="SET")  return { past:[...s.past,s.present].slice(-60), present:a.p, future:[] };
  if (a.type==="UNDO" && s.past.length)   { const past=[...s.past]; const p=past.pop(); return { past, present:p, future:[s.present,...s.future] }; }
  if (a.type==="REDO" && s.future.length) { const [p,...future]=s.future; return { past:[...s.past,s.present], present:p, future }; }
  return s;
}

/* ── Default adj state ── */
const defaultAdj = () => Object.fromEntries(ADJUSTMENTS.map(a=>[a.id, a.def]));

/* ── Filter thumbnail ── */
function FilterThumb({ filter, adj, img, selected, onClick }) {
  const merged = { ...defaultAdj(), ...adj, ...filter.adj };
  const cssFilter = adjToCSS(merged);
  return (
    <button onClick={onClick} style={{ flex:"0 0 70px", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
      background:"none", border:"none", cursor:"pointer", padding:"4px 2px" }}>
      <div style={{ width:64, height:64, borderRadius:10, overflow:"hidden", border:selected?"2.5px solid #00d4ff":"2px solid rgba(255,255,255,.08)",
        boxShadow:selected?"0 0 12px rgba(0,212,255,.5)":"none", background:"#111" }}>
        {img ? <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:cssFilter }} crossOrigin="anonymous"/> 
             : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,#1a2040,#0a1020)`, filter:cssFilter }}/>}
      </div>
      <span style={{ fontSize:9, color:selected?"#00d4ff":"#666", fontWeight:selected?700:400, whiteSpace:"nowrap" }}>{filter.label}</span>
    </button>
  );
}

/* ── Light FX thumbnail ── */
function LightThumb({ fx, selected, onClick, img }) {
  return (
    <button onClick={onClick} style={{ flex:"0 0 70px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", padding:"4px 2px" }}>
      <div style={{ width:64, height:64, borderRadius:10, overflow:"hidden", border:selected?"2.5px solid #f5c518":"2px solid rgba(255,255,255,.08)", boxShadow:selected?"0 0 12px rgba(245,197,24,.5)":"none", background:"#111", position:"relative" }}>
        {img && <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous"/>}
        <div style={{ position:"absolute", inset:0, ...fx.style }}/>
      </div>
      <span style={{ fontSize:9, color:selected?"#f5c518":"#666", fontWeight:selected?700:400, whiteSpace:"nowrap" }}>{fx.label}</span>
    </button>
  );
}

/* ── Crop Overlay ─────────────────────────────────────────────────────────── */
function CropOverlay({ crop, scale, onUpdate, ratio }) {
  const st = useRef({mode:null});
  const startMove = (e) => { e.stopPropagation(); e.preventDefault(); const p=getPoint(e); st.current={mode:"move",sx:p.x,sy:p.y,ox:crop.x,oy:crop.y}; bind(); };
  const startRes  = (e,h) => { e.stopPropagation(); e.preventDefault(); const p=getPoint(e); st.current={mode:"resize",h,sx:p.x,sy:p.y,ox:crop.x,oy:crop.y,ow:crop.w,oh:crop.h}; bind(); };
  const onMove = useCallback((e)=>{
    const d=st.current; if(!d.mode) return;
    const p=getPoint(e); const dx=(p.x-d.sx)/scale, dy=(p.y-d.sy)/scale;
    const toP = v => v; // values already in %
    if(d.mode==="move") {
      onUpdate({ x:Math.min(100-crop.w,Math.max(0,d.ox+dx/4.2)), y:Math.min(100-crop.h,Math.max(0,d.oy+dy/4.2)) });
    }
    if(d.mode==="resize") {
      const h=d.h; let nw=d.ow,nh=d.oh,nx=d.ox,ny=d.oy;
      if(h.includes("e"))nw=Math.max(5,d.ow+dx/4.2);
      if(h.includes("s"))nh=Math.max(5,d.oh+dy/4.2);
      if(h.includes("w")){nw=Math.max(5,d.ow-dx/4.2);nx=d.ox+(d.ow-nw);}
      if(h.includes("n")){nh=Math.max(5,d.oh-dy/4.2);ny=d.oy+(d.oh-nh);}
      if(ratio!=="free"){ const[rw,rh]=ratio.split(":").map(Number); nh=nw/(rw/rh); }
      onUpdate({x:Math.max(0,nx),y:Math.max(0,ny),w:Math.min(100-Math.max(0,nx),nw),h:Math.min(100-Math.max(0,ny),nh)});
    }
  },[crop,scale,ratio,onUpdate]);
  const onUp=useCallback(()=>{st.current.mode=null;unbind();},[]);
  const bind=()=>{window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onUp);};
  const unbind=()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  if(!crop) return null;
  const HS=16;
  return (
    <div style={{ position:"absolute", inset:0, zIndex:30 }}>
      {/* Dark overlay outside crop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)", pointerEvents:"none" }}/>
      {/* Clear crop window */}
      <div style={{ position:"absolute", left:`${crop.x}%`, top:`${crop.y}%`, width:`${crop.w}%`, height:`${crop.h}%`,
        boxShadow:"0 0 0 9999px rgba(0,0,0,.55)", cursor:"move", touchAction:"none" }}
        onMouseDown={startMove} onTouchStart={startMove}>
        {/* Grid lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)", backgroundSize:"33.33% 33.33%", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, border:"2px solid #fff", boxSizing:"border-box", pointerEvents:"none" }}/>
        {/* Corner handles */}
        {[["nw",0,0],["ne",100,0],["sw",0,100],["se",100,100]].map(([h,cx,cy])=>(
          <div key={h} onMouseDown={e=>startRes(e,h)} onTouchStart={e=>startRes(e,h)}
            style={{ position:"absolute", width:HS,height:HS,background:"#fff",borderRadius:3,
              left:`calc(${cx}% - ${HS/2}px)`,top:`calc(${cy}% - ${HS/2}px)`,
              cursor:`${h}-resize`,zIndex:1,touchAction:"none" }}/>
        ))}
        {[["n",50,0],["s",50,100],["w",0,50],["e",100,50]].map(([h,cx,cy])=>(
          <div key={h} onMouseDown={e=>startRes(e,h)} onTouchStart={e=>startRes(e,h)}
            style={{ position:"absolute", width:HS,height:HS,background:"rgba(255,255,255,.8)",borderRadius:2,
              left:`calc(${cx}% - ${HS/2}px)`,top:`calc(${cy}% - ${HS/2}px)`,
              cursor:`${h}-resize`,zIndex:1,touchAction:"none" }}/>
        ))}
      </div>
    </div>
  );
}

/* ── Blur Region ─────────────────────────────────────────────────────────── */
function BlurRegion({ b, scale, onUpdate, onRemove }) {
  const st=useRef({mode:null}); const HS=14;
  const startDrag=(e)=>{e.stopPropagation();e.preventDefault();const p=getPoint(e);st.current={mode:"drag",sx:p.x,sy:p.y,ox:b.x,oy:b.y};bind();};
  const startRes=(e,h)=>{e.stopPropagation();e.preventDefault();const p=getPoint(e);st.current={mode:"resize",h,sx:p.x,sy:p.y,ox:b.x,oy:b.y,ow:b.w,oh:b.h};bind();};
  const onMove=useCallback((e)=>{const d=st.current;if(!d.mode)return;const p=getPoint(e);const dx=(p.x-d.sx)/scale,dy=(p.y-d.sy)/scale;
    if(d.mode==="drag")onUpdate(b.id,{x:Math.round(d.ox+dx),y:Math.round(d.oy+dy)});
    if(d.mode==="resize"){const h=d.h;let nw=d.ow,nh=d.oh,nx=d.ox,ny=d.oy;
      if(h.includes("e"))nw=Math.max(20,d.ow+dx);if(h.includes("s"))nh=Math.max(20,d.oh+dy);
      if(h.includes("w")){nw=Math.max(20,d.ow-dx);nx=d.ox+(d.ow-nw);}if(h.includes("n")){nh=Math.max(20,d.oh-dy);ny=d.oy+(d.oh-nh);}
      onUpdate(b.id,{x:Math.round(nx),y:Math.round(ny),w:Math.round(nw),h:Math.round(nh)});}
  },[b.id,scale,onUpdate]);
  const onUp=useCallback(()=>{st.current.mode=null;unbind();},[]);
  const bind=()=>{window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onUp);};
  const unbind=()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  return (
    <div style={{ position:"absolute", left:b.x, top:b.y, width:b.w, height:b.h,
      backdropFilter:`blur(${b.blur}px)`, WebkitBackdropFilter:`blur(${b.blur}px)`,
      border:"2px dashed rgba(255,255,255,.6)", borderRadius:4, cursor:"move", boxSizing:"border-box",
      background:"rgba(255,255,255,.05)", touchAction:"none", zIndex:10 }}
      onMouseDown={startDrag} onTouchStart={startDrag}>
      {[["nw",0,0],["ne",100,0],["sw",0,100],["se",100,100]].map(([h,cx,cy])=>(
        <div key={h} onMouseDown={e=>startRes(e,h)} onTouchStart={e=>startRes(e,h)}
          style={{ position:"absolute",width:HS,height:HS,background:"rgba(255,255,255,.9)",borderRadius:2,
            left:`calc(${cx}% - ${HS/2}px)`,top:`calc(${cy}% - ${HS/2}px)`,cursor:`${h}-resize`,zIndex:1,touchAction:"none" }}/>
      ))}
      <button onClick={()=>onRemove(b.id)} style={{ position:"absolute",top:-12,right:-12,width:20,height:20,borderRadius:"50%",background:"#ff4444",border:"none",color:"#fff",fontSize:11,cursor:"pointer",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1 }}>✕</button>
    </div>
  );
}

/* ── Drawing Canvas ─────────────────────────────────────────────────────── */
function DrawingCanvas({ width, height, drawings, onDraw, brushColor, brushSize, isEraser }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  // Render all strokes on canvas
  useEffect(()=>{
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    drawings.forEach(stroke=>{
      if(!stroke.points||stroke.points.length<2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.isEraser ? "rgba(0,0,0,0)" : stroke.color;
      ctx.globalCompositeOperation = stroke.isEraser ? "destination-out" : "source-over";
      ctx.lineWidth = stroke.size; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for(let i=1;i<stroke.points.length;i++) ctx.lineTo(stroke.points[i].x,stroke.points[i].y);
      ctx.stroke();
    });
    ctx.globalCompositeOperation="source-over";
  },[drawings,width,height]);

  const getPos=(e)=>{
    const rect=canvasRef.current.getBoundingClientRect();
    const scaleX=width/rect.width, scaleY=height/rect.height;
    const p=getPoint(e);
    return {x:(p.x-rect.left)*scaleX, y:(p.y-rect.top)*scaleY};
  };

  const startDraw=(e)=>{
    e.stopPropagation(); e.preventDefault();
    drawing.current=true;
    const pos=getPos(e);
    onDraw("start",{points:[pos],color:brushColor,size:brushSize,isEraser});
  };
  const moveDraw=(e)=>{
    if(!drawing.current) return;
    e.preventDefault();
    const pos=getPos(e);
    onDraw("move",pos);
  };
  const endDraw=()=>{ drawing.current=false; onDraw("end"); };

  return <canvas ref={canvasRef} width={width} height={height}
    style={{ position:"absolute", inset:0, zIndex:15, cursor:isEraser?"cell":"crosshair", touchAction:"none" }}
    onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
    onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}/>;
}

/* ── Main Photo Editor ── */
function PhotoEditor({ onSwitch, onHome }) {
  const isMobile = useMobile();
  const [photo, setPhoto]         = useState(null);
  const [photoSize, setPhotoSize] = useState({w:1,h:1});

  // ── Unified undo history ──
  const INIT_SNAP = { adj:defaultAdj(), activeFilter:"none", lightFx:"none", border:"none", flipH:false, flipV:false, texts:[], drawings:[] };
  const [hist, dispatchHist] = useReducer(histReducer, {past:[], present:INIT_SNAP, future:[]});
  const snap = hist.present;
  const pushSnap = (patch) => dispatchHist({type:"SET", p:{...hist.present,...patch}});
  const undo = () => dispatchHist({type:"UNDO"});
  const redo = () => dispatchHist({type:"REDO"});
  const canUndo = hist.past.length > 0;
  const canRedo = hist.future.length > 0;

  // Shorthands that push to history
  const adj          = snap.adj;
  const activeFilter = snap.activeFilter;
  const lightFx      = snap.lightFx;
  const border       = snap.border;
  const flipH        = snap.flipH;
  const flipV        = snap.flipV;
  const texts        = snap.texts;
  const drawings     = snap.drawings;
  const setAdj          = (v) => pushSnap({adj: typeof v==="function" ? v(snap.adj) : v});
  const setActiveFilter = (v) => pushSnap({activeFilter:v});
  const setLightFx      = (v) => pushSnap({lightFx:v});
  const setBorder       = (v) => pushSnap({border:v});
  const setFlipH        = (v) => pushSnap({flipH: typeof v==="function" ? v(snap.flipH) : v});
  const setFlipV        = (v) => pushSnap({flipV: typeof v==="function" ? v(snap.flipV) : v});
  const setTexts        = (v) => pushSnap({texts: typeof v==="function" ? v(snap.texts) : v});
  const setDrawings     = (v) => pushSnap({drawings: typeof v==="function" ? v(snap.drawings) : v});

  const [tab, setTab]             = useState("filters");
  const [filterCat, setFilterCat] = useState("Todos");
  const [fontCat, setFontCat]     = useState("Todas");
  const [blurs, setBlurs]         = useState([]);
  const [selTextId, setSelTextId] = useState(null);
  const [editTextId, setEditTextId] = useState(null);
  const [showBefore, setShowBefore] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [zoom, setZoom]           = useState(1);
  const [crop, setCrop]           = useState(null);
  const [cropping, setCropping]   = useState(false);
  const [cropRatio, setCropRatio] = useState("free");
  const [cropDrag, setCropDrag]   = useState(null);
  const [savedPresets, setSavedPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [activeAdj, setActiveAdj] = useState(null);
  const [drawMode, setDrawMode]   = useState(false);
  const [brushColor, setBrushColor] = useState("#ff0066");
  const [brushSize, setBrushSize]   = useState(8);
  const [isEraser, setIsEraser]     = useState(false);
  const canvasRef = useRef(null);
  const photoRef  = useRef(null);
  const cropRef   = useRef(null);

  useScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

  useEffect(()=>{
    if(document.querySelector("link[data-mifont]")) return;
    const l=document.createElement("link"); l.rel="stylesheet"; l.setAttribute("data-mifont","1");
    l.href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Sacramento&family=Allura&family=Italianno&family=Lobster&family=Courgette&family=Kaushan+Script&family=Alex+Brush&family=Pinyon+Script&family=Mr+Dafoe&family=Clicker+Script&family=Tangerine:wght@400;700&family=Parisienne&family=Herr+Von+Muellerhoff&family=Euphoria+Script&family=Dawning+of+a+New+Day&family=Yellowtail&family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@400;600&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;700&family=Cardo:wght@400;700&family=Crimson+Text:wght@400;700&family=Lora:wght@400;700&family=DM+Serif+Display&family=Tenor+Sans&family=Spectral:wght@400;700&family=Philosopher:wght@400;700&family=Volkhov:wght@400;700&family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=GFS+Didot&family=Lato:wght@300;400;700&family=Nunito:wght@400;700;900&family=Quicksand:wght@400;700&family=Josefin+Sans:wght@400;700&family=Raleway:wght@400;700;900&family=Poppins:wght@400;700;900&family=Montserrat:wght@400;700;900&family=DM+Sans:wght@400;700&family=Inter:wght@400;700&family=Work+Sans:wght@400;700&family=Manrope:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Outfit:wght@400;700&family=Amatic+SC:wght@400;700&family=Caveat:wght@400;700&family=Permanent+Marker&family=Indie+Flower&family=Patrick+Hand&family=Shadows+Into+Light&family=Just+Another+Hand&family=Gochi+Hand&family=Covered+By+Your+Grace&family=Gloria+Hallelujah&family=Architects+Daughter&family=Short+Stack&family=Barlow+Condensed:wght@400;700;900&family=Oswald:wght@400;700&family=League+Gothic&family=Kanit:wght@400;700;900&family=Encode+Sans+Condensed:wght@400;700&family=Saira+Condensed:wght@400;700&family=UnifrakturMaguntia&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;700;900&family=Metamorphous&family=Uncial+Antiqua&family=Pirata+One&family=Almendra+Display&family=Fondamento&family=IM+Fell+English:ital@0;1&family=Germania+One&family=Caesar+Dressing&family=Grenze+Gotisch:wght@400;700;900&family=Macondo&family=Ruge+Boogie&family=Almendra+SC:wght@400;700&family=Jim+Nightshade&family=Caudex:wght@400;700&family=Domine:wght@400;700&family=Inknut+Antiqua:wght@400;700&family=Fenix&family=Bilbo&family=Bilbo+Swash+Caps&family=Rye&family=Sancreek&family=Rancho&family=Fredericka+the+Great&family=Gravitas+One&family=Special+Elite&family=Patua+One&family=Yeseva+One&family=Abril+Fatface&family=Ultra&family=Boogaloo&family=Luckiest+Guy&family=Creepster&family=Nosifer&family=Butcherman&family=Rubik+Dirt&family=Rock+Salt&family=Black+Ops+One&family=Freckle+Face&family=Kranky&family=Jolly+Lodger&family=Faster+One&family=Eater&family=Fredoka+One&family=Baloo+2:wght@400;700&family=Righteous&family=Lilita+One&family=Russo+One&family=Titan+One&family=Press+Start+2P&family=VT323&family=Monoton&family=Diplomata+SC&family=Codystar:wght@300;400&family=Bebas+Neue&family=Anton&family=Teko:wght@400;700&family=Fjalla+One&family=Squada+One&family=Big+Shoulders+Display:wght@400;700;900&family=Exo+2:wght@400;700;900&family=Rajdhani:wght@400;700&family=Jost:wght@400;700&family=Space+Grotesk:wght@400;700&family=Nunito+Sans:wght@400;700&family=Syne:wght@400;700&family=Alfa+Slab+One&family=Rokkitt:wght@400;700&family=Arvo:wght@400;700&family=Zilla+Slab:wght@400;700&family=Crete+Round&family=Josefin+Slab:wght@400;700&family=Trocchi&family=Orbitron:wght@400;700;900&family=Audiowide&family=Syncopate:wght@400;700&family=Share+Tech+Mono&family=Major+Mono+Display&family=Nova+Square&family=Courier+Prime:wght@400;700&family=Space+Mono:wght@400;700&family=Passion+One:wght@400;700;900&family=Unica+One&family=Fugaz+One&family=Black+Han+Sans&family=IM+Fell+Double+Pica&family=Josefin+Slab:wght@400;700&display=swap";
    document.head.appendChild(l);
  },[]);

  useEffect(()=>{
    const p=e=>{if(e.target.closest("[data-canvas]"))e.preventDefault();};
    document.addEventListener("touchmove",p,{passive:false});
    return()=>document.removeEventListener("touchmove",p);
  },[]);

  const handleUpload = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const src = ev.target.result;
      const img = new Image();
      img.onload = () => { setPhotoSize({w:img.naturalWidth, h:img.naturalHeight}); };
      img.src = src;
      setPhoto(src); setCrop(null); setZoom(1);
    };
    r.readAsDataURL(f);
  };

  // ── Remover Fundo (client-side, sem API, sem limite) ──
  const [removingBg, setRemovingBg]   = useState(false);
  const [bgRemoveProgress, setBgRemoveProgress] = useState(""); // status text
  const removeBg = async () => {
    if(!photo||removingBg) return;
    setRemovingBg(true); setBgRemoveProgress("Carregando modelo IA...");
    try {
      // Dynamic import via esm.sh CDN — cached após 1ª vez
      const { removeBackground } = await import("https://esm.sh/@imgly/background-removal@1.4.5");
      setBgRemoveProgress("Processando imagem...");
      // Convert dataURL → Blob
      const res = await fetch(photo);
      const blob = await res.blob();
      const resultBlob = await removeBackground(blob, {
        progress: (key, cur, total) => {
          if(total>0) setBgRemoveProgress(`Baixando modelo: ${Math.round(cur/total*100)}%`);
        },
      });
      const url = URL.createObjectURL(resultBlob);
      setPhoto(url);
      setBgRemoveProgress("✅ Fundo removido!");
      setTimeout(()=>setBgRemoveProgress(""),3000);
    } catch(err) {
      console.error(err);
      setBgRemoveProgress("❌ Erro: " + (err.message||"tente novamente"));
      setTimeout(()=>setBgRemoveProgress(""),4000);
    }
    setRemovingBg(false);
  };

  // Ctrl+Z / Ctrl+Y undo-redo
  useEffect(()=>{
    const h=e=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();undo();}
      if((e.metaKey||e.ctrlKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();redo();}
    };
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[hist]);

  // Zoom via Ctrl+scroll
  useEffect(()=>{
    const h = e => {
      if(!(e.ctrlKey||e.metaKey)) return;
      if(!photoRef.current?.contains(e.target) && !e.target.closest("[data-photocanvas]")) return;
      e.preventDefault();
      setZoom(z => Math.min(3, Math.max(0.5, z - e.deltaY*0.001)));
    };
    window.addEventListener("wheel", h, {passive:false});
    return()=>window.removeEventListener("wheel",h);
  },[]);

  // ── Crop helpers ──
  const CROP_RATIOS = [
    { id:"free", label:"Livre" }, { id:"1:1", label:"1:1" }, { id:"4:5", label:"4:5" },
    { id:"9:16", label:"9:16" }, { id:"16:9", label:"16:9" }, { id:"3:4", label:"3:4" },
  ];
  const startCrop = () => {
    setCropping(true);
    setCrop({ x:10, y:10, w:80, h:80 });
    setTab("crop");
  };
  const applyCrop = () => {
    if(!crop||!photo) return;
    const img = new window.Image(); img.crossOrigin="anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const pw = img.naturalWidth, ph = img.naturalHeight;
      const cx = pw*(crop.x/100), cy = ph*(crop.y/100);
      const cw = pw*(crop.w/100), ch = ph*(crop.h/100);
      canvas.width=cw; canvas.height=ch;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
      setPhoto(canvas.toDataURL("image/png"));
      setCrop(null); setCropping(false); setTab("filters");
    };
    img.src = photo;
  };
  const cancelCrop = () => { setCrop(null); setCropping(false); setTab("filters"); };

  // Enforce ratio when crop changes
  const updateCropWithRatio = (patch) => {
    setCrop(prev => {
      const next = { ...prev, ...patch };
      if(cropRatio==="free") return next;
      const [rw,rh] = cropRatio.split(":").map(Number);
      const ratio = rw/rh;
      // Clamp to canvas bounds
      next.w = Math.min(next.w, 100-next.x);
      next.h = next.w / ratio;
      if(next.y+next.h > 100) { next.h=100-next.y; next.w=next.h*ratio; }
      return next;
    });
  };

  // ── Blur region helpers ──
  const addBlur = () => {
    const b = { id:uid(), x:20, y:20, w:60, h:40, blur:12, opacity:1 };
    setBlurs(p=>[...p,b]);
  };
  const updateBlur = (id,patch) => setBlurs(p=>p.map(b=>b.id===id?{...b,...patch}:b));
  const removeBlur = (id) => setBlurs(p=>p.filter(b=>b.id!==id));

  // ── Drawing ──
  const handleDraw=(action,data)=>{
    if(action==="start") setDrawings(p=>[...p,data]);
    if(action==="move")  setDrawings(p=>{if(!p.length)return p;const last={...p[p.length-1],points:[...p[p.length-1].points,data]};return[...p.slice(0,-1),last];});
  };
  const undoDraw=()=>undo();
  const clearDrawings=()=>setDrawings([]);

  // Merged adj = preset filter + manual tweaks
  const mergedAdj = useMemo(() => {
    const filter = FILTERS.find(f=>f.id===activeFilter) || FILTERS[0];
    const base = { ...defaultAdj(), ...filter.adj };
    return Object.fromEntries(ADJUSTMENTS.map(a => [a.id, base[a.id] + (adj[a.id] - a.def)]));
  }, [adj, activeFilter]);

  const cssFilter = adjToCSS(mergedAdj);
  const overlays  = adjToOverlays(mergedAdj);
  const borderStyle = BORDERS.find(b=>b.id===border)?.style || {};
  const lightStyle  = LIGHT_FX.find(l=>l.id===lightFx)?.style || {};

  const applyFilter = (fid) => {
    setActiveFilter(fid);
    setAdj(defaultAdj()); // reset manual tweaks when switching filter
  };

  const addText = () => {
    const el = mkPhotoText({ x:40, y:photo?150:100 });
    setTexts(p=>[...p,el]); setSelTextId(el.id); setTab("text");
  };
  const addSticker = (s) => {
    const el = mkPhotoText({ text:s, fontSize:64, shadowBlur:0, x:120, y:120, w:120, h:80, align:"center" });
    setTexts(p=>[...p,el]); setSelTextId(el.id);
  };
  const updateText = useCallback((id,patch)=>pushSnap({texts: hist.present.texts.map(e=>e.id===id?{...e,...patch}:e)}),[hist.present.texts]);
  const deleteText = () => { if(!selTextId) return; setTexts(p=>p.filter(e=>e.id!==selTextId)); setSelTextId(null); };

  // ✨ Auto-enhance — aplica ajustes inteligentes
  const autoEnhance = () => {
    setAdj({ brightness:8, contrast:12, saturation:18, temperature:5, sharpness:20,
              fade:0, vignette:20, grain:0, highlights:-10, shadows:10 });
    setActiveFilter("none");
  };

  // 💾 Salvar projeto como JSON
  // ── Auto-save no localStorage ──
  const LS_KEY = "makerinfo_photo_v1";

  // Restore session on mount
  useEffect(()=>{
    try {
      const saved = localStorage.getItem(LS_KEY);
      if(!saved) return;
      const d = JSON.parse(saved);
      if(d.photo) setPhoto(d.photo);
      if(d.photoSize) setPhotoSize(d.photoSize);
      const patch = {};
      if(d.adj) patch.adj=d.adj;
      if(d.activeFilter) patch.activeFilter=d.activeFilter;
      if(d.lightFx) patch.lightFx=d.lightFx;
      if(d.border) patch.border=d.border;
      if(d.flipH !== undefined) patch.flipH=d.flipH;
      if(d.flipV !== undefined) patch.flipV=d.flipV;
      if(d.texts?.length) patch.texts=d.texts.map(t=>({...t,id:uid()}));
      if(d.drawings?.length) patch.drawings=d.drawings;
      if(Object.keys(patch).length) dispatchHist({type:"SET", p:{...INIT_SNAP,...patch}});
    } catch {}
  },[]);

  // Auto-save whenever state changes
  useEffect(()=>{
    if(!photo) return;
    try {
      const data = { photo, photoSize, ...snap, texts: snap.texts.map(({src,...t})=>t) };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
  },[photo, photoSize, snap]);

  const clearSession = () => {
    localStorage.removeItem(LS_KEY);
    setPhoto(null); setPhotoSize({w:1,h:1});
    dispatchHist({type:"SET", p:INIT_SNAP});
    setCrop(null); setZoom(1); setBlurs([]);
    toast("Sessão limpa. Carregue uma nova foto.", "info");
  };

  const savePreset = () => {
    if(!presetName.trim()) return;
    setSavedPresets(p=>[...p, { id:uid(), name:presetName.trim(), adj:{ ...adj }, filter:activeFilter }]);
    setPresetName(""); setShowSavePreset(false);
  };
  const loadPreset = (pr) => { setActiveFilter(pr.filter); setAdj(pr.adj); };

  const handleExport = async () => {
    if(!photo) return; setSaving(true);
    try {
      await document.fonts.ready;
      // Load source image
      const srcImg = await new Promise((res,rej)=>{const i=new Image();i.crossOrigin="anonymous";i.onload=()=>res(i);i.onerror=rej;i.src=photo;});
      const natW=srcImg.naturalWidth, natH=srcImg.naturalHeight;

      // Determine output dimensions (crop or full)
      let sx=0,sy=0,sw=natW,sh=natH;
      if(crop){sx=natW*crop.x/100;sy=natH*crop.y/100;sw=natW*crop.w/100;sh=natH*crop.h/100;}

      // Export at 2x preview resolution for quality, capped at native
      const outW=Math.min(sw*2, sw), outH=Math.min(sh*2, sh);
      // Actually export at native resolution
      const expW=Math.round(sw), expH=Math.round(sh);

      const canvas=document.createElement("canvas");
      canvas.width=expW; canvas.height=expH;
      const ctx=canvas.getContext("2d");

      // Build CSS filter string
      const filterStr=adjToCSS(adj);
      ctx.filter=filterStr||"none";
      // Draw photo (with flip)
      ctx.save();
      if(flipH||flipV){
        ctx.translate(flipH?expW:0, flipV?expH:0);
        ctx.scale(flipH?-1:1, flipV?-1:1);
      }
      ctx.drawImage(srcImg, sx, sy, sw, sh, 0, 0, expW, expH);
      ctx.restore();
      ctx.filter="none";

      // Fade overlay
      if(adj.fade>0){
        ctx.globalAlpha=adj.fade/300;
        ctx.fillStyle="#fff";
        ctx.fillRect(0,0,expW,expH);
        ctx.globalAlpha=1;
      }
      // Vignette overlay
      if(adj.vignette>0){
        const vg=ctx.createRadialGradient(expW/2,expH/2,expW*.15,expW/2,expH/2,expW*.72);
        vg.addColorStop(0,"transparent");
        vg.addColorStop(1,`rgba(0,0,0,${adj.vignette/150})`);
        ctx.globalCompositeOperation="multiply";
        ctx.fillStyle=vg; ctx.fillRect(0,0,expW,expH);
        ctx.globalCompositeOperation="source-over";
      }

      // Scale factor from preview → export
      const scX=expW/cvW, scY=expH/cvH;

      // Draw texts (scaled from preview coords)
      texts.forEach(el=>{
        ctx.save();
        const ex=el.x*scX, ey=el.y*scY;
        const efs=el.fontSize*scX;
        if(el.rotation){ctx.translate(ex+efs*2,ey);ctx.rotate(el.rotation*Math.PI/180);ctx.translate(-(ex+efs*2),-ey);}
        ctx.globalAlpha=el.opacity??1;
        const shadow=`${(el.shadowX||0)*scX}px ${(el.shadowY||2)*scY}px ${(el.shadowBlur||8)*scX}px ${el.shadowColor||"#000"}`;
        ctx.font=`${el.fontWeight||"700"} ${efs}px '${el.fontFamily}',sans-serif`;
        ctx.textAlign=el.align||"left";
        ctx.letterSpacing=`${(el.letterSpacing||0)*scX}px`;
        if(el.outline){ctx.lineWidth=(el.outlineWidth||2)*scX;ctx.strokeStyle=el.outlineColor||"#000";ctx.shadowColor=shadow.split("px")[3]?.trim();ctx.shadowBlur=(el.shadowBlur||8)*scX;ctx.strokeText(el.text||"",ex,ey);}
        if(el.useGradient){
          const gw=(typeof el.w==="number"?el.w:200)*scX;
          const a=(el.gradientAngle||135)*Math.PI/180;
          const grd=ctx.createLinearGradient(ex,ey,ex+Math.cos(a)*gw,ey+Math.sin(a)*gw);
          grd.addColorStop(0,el.gradientColor1||"#fff");grd.addColorStop(1,el.gradientColor2||"#f5c518");
          ctx.fillStyle=grd;
        } else { ctx.fillStyle=el.color||"#fff"; }
        ctx.shadowColor=el.shadowColor||"#000";ctx.shadowBlur=(el.shadowBlur||8)*scX;ctx.shadowOffsetX=(el.shadowX||0)*scX;ctx.shadowOffsetY=(el.shadowY||2)*scY;
        // Word wrap
        const maxTw=typeof el.w==="number"?el.w*scX:expW*0.9;
        const words=(el.text||"").split(" "); let line="",ly=ey;
        for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxTw&&line){ctx.fillText(line,ex,ly);ly+=efs*1.1;line=w;}else line=t;}
        if(line)ctx.fillText(line,ex,ly);
        ctx.restore();
      });

      // Draw strokes (scaled from preview coords)
      if(drawings.length>0){
        drawings.forEach(stroke=>{
          if(!stroke.points||stroke.points.length<2)return;
          ctx.save();
          ctx.strokeStyle=stroke.isEraser?"rgba(0,0,0,0)":stroke.color;
          ctx.globalCompositeOperation=stroke.isEraser?"destination-out":"source-over";
          ctx.lineWidth=stroke.size*scX; ctx.lineCap="round"; ctx.lineJoin="round";
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x*scX, stroke.points[0].y*scY);
          for(let i=1;i<stroke.points.length;i++) ctx.lineTo(stroke.points[i].x*scX, stroke.points[i].y*scY);
          ctx.stroke(); ctx.restore();
        });
        ctx.globalCompositeOperation="source-over";
      }

      const link=document.createElement("a");
      link.download=`foto-editada-${Date.now()}.png`;
      link.href=canvas.toDataURL("image/png"); link.click();
      toast("Foto exportada em alta qualidade!");
    } catch(err){ console.error(err); toast("Erro ao exportar: "+err.message,"error"); }
    setSaving(false);
  };

  const selText = texts.find(e=>e.id===selTextId);

  // Canvas preview scale — adapts to photo's natural aspect ratio
  const photoAspect = photoSize.h > 0 ? photoSize.w / photoSize.h : 1;
  const maxW = isMobile ? Math.min(window.innerWidth - 16, 420) : 500;
  const maxH = isMobile ? 380 : Math.min(window.innerHeight - 220, 560);
  const scaleByW = maxW;
  const scaleByH = Math.round(maxW / photoAspect);
  const cvW = scaleByH <= maxH ? maxW : Math.round(maxH * photoAspect);
  const cvH = scaleByH <= maxH ? scaleByH : maxH;
  const IMG_W = cvW, IMG_H = cvH;
  const scale = 1; // coordinates are already in cvW/cvH space

  /* Style helpers */
  const C = { background:"#060a14" };
  const I = { width:"100%", padding:"9px 11px", borderRadius:7, fontSize:12, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.09)", color:"#fff", outline:"none", boxSizing:"border-box" };
  const L = (c="#00d4ff")=>({ fontSize:8, color:c, letterSpacing:3, display:"block", marginBottom:4, textTransform:"uppercase" });
  const iB=(on,c="#00d4ff")=>({ padding:"8px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700, background:on?`${c}22`:"rgba(255,255,255,.04)", border:on?`1px solid ${c}66`:"1px solid rgba(255,255,255,.06)", color:on?c:"#3a4060" });
  const tabActive = (t) => tab===t;

  /* ── MOBILE LAYOUT ── */
  if (isMobile) return (
    <div style={{ height:"100dvh", maxHeight:"100dvh", background:"#000", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff", display:"flex", flexDirection:"column", WebkitTapHighlightColor:"transparent", overscrollBehavior:"none", overflow:"hidden" }}>
      {/* Top bar */}
      <div style={{ background:"rgba(0,0,0,.95)", backdropFilter:"blur(12px)", padding:"10px 14px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        <button onClick={onHome} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#aaa", fontSize:10, fontWeight:700, cursor:"pointer" }}>🏠</button>
        <button onClick={onSwitch} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(0,212,255,.1)", border:"1px solid rgba(0,212,255,.3)", color:"#00d4ff", fontSize:10, fontWeight:700, cursor:"pointer" }}>⚡ Posts</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:900 }}>📷 Editor de Fotos</div>
        </div>
        {photo && <button onClick={clearSession} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(255,80,80,.08)", border:"1px solid rgba(255,80,80,.18)", color:"rgba(255,140,140,.8)", fontSize:10, fontWeight:700, cursor:"pointer" }}>🗑 Nova</button>}
        <button onClick={undo} disabled={!canUndo} style={{ padding:"6px 10px", borderRadius:7, background:canUndo?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)", color:canUndo?"#fff":"#333", fontSize:14, cursor:canUndo?"pointer":"default" }}>↩</button>
        <button onClick={redo} disabled={!canRedo} style={{ padding:"6px 10px", borderRadius:7, background:canRedo?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)", color:canRedo?"#fff":"#333", fontSize:14, cursor:canRedo?"pointer":"default" }}>↪</button>
        <button onClick={handleExport} disabled={!photo||saving} style={{ padding:"8px 14px", borderRadius:8, cursor:(!photo||saving)?"default":"pointer", fontSize:12, fontWeight:900, background:(!photo||saving)?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)", border:"none", color:(!photo||saving)?"#444":"#000" }}>
          {saving?"⏳":"⬇️"}
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", padding:"8px", background:"#000", overflow:"hidden", minHeight:0 }}>
        {!photo ? (
          <label style={{ width:cvW, height:220, borderRadius:16, border:"2px dashed rgba(255,255,255,.12)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:10, background:"rgba(255,255,255,.02)" }}>
            <div style={{ fontSize:48 }}>📷</div>
            <div style={{ fontSize:14, color:"#3a5070", fontWeight:700 }}>Toque para escolher uma foto</div>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }}/>
          </label>
        ) : (
          <div style={{ position:"relative" }}>
            {/* Before/After — always in DOM, opacity toggle, pointerEvents none so it never blocks */}
            <div style={{ position:"absolute", inset:0, zIndex:20, borderRadius:12, overflow:"hidden", opacity:showBefore?1:0, pointerEvents:"none", transition:"opacity .1s" }}>
              <img src={photo} alt="" style={{ width:cvW, height:cvH, objectFit:"cover", display:"block" }} crossOrigin="anonymous"/>
              <div style={{ position:"absolute", top:8, left:8, fontSize:10, color:"#fff", background:"rgba(0,0,0,.7)", padding:"4px 10px", borderRadius:6, fontWeight:700 }}>ORIGINAL</div>
            </div>
            <div ref={photoRef} data-canvas="1" style={{ width:cvW, height:cvH, position:"relative", borderRadius:12, overflow:"hidden", ...borderStyle, transform:`scale(${zoom})`, transformOrigin:"center center", transition:"transform .15s" }}>
              <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", filter:cssFilter, transform:`scaleX(${flipH?-1:1}) scaleY(${flipV?-1:1})` }} crossOrigin="anonymous"/>
              {overlays.map((o,i)=><div key={i} style={{ position:"absolute", inset:0, ...o }}/>)}
              <div style={{ position:"absolute", inset:0, ...lightStyle, pointerEvents:"none" }}/>
              {blurs.map(b=><BlurRegion key={b.id} b={b} scale={scale} onUpdate={updateBlur} onRemove={removeBlur}/>)}
              {drawMode && <DrawingCanvas width={cvW} height={cvH} drawings={drawings} onDraw={handleDraw} brushColor={brushColor} brushSize={brushSize} isEraser={isEraser}/>}
              {texts.map(el=>(
                editTextId===el.id
                  ? <PhotoInlineEdit key={el.id} el={el} onDone={val=>{updateText(el.id,{text:val});setEditTextId(null);}}/>
                  : <PhotoTextEl key={el.id} el={el} selected={selTextId===el.id}
                      onSelect={id=>{setSelTextId(id);setTab("text");}} onEdit={id=>{setSelTextId(id);setEditTextId(id);}}
                      onUpdate={updateText} scale={scale}/>
              ))}
              {cropping && <CropOverlay crop={crop} scale={scale} ratio={cropRatio} onUpdate={updateCropWithRatio}/>}
            </div>
            {/* Buttons overlay */}
            {cropping ? <>
              <button onClick={applyCrop} style={{ position:"absolute", bottom:8, right:8, padding:"7px 14px", borderRadius:6, background:"#00d4ff", border:"none", color:"#000", fontSize:11, fontWeight:900, cursor:"pointer" }}>✓ Aplicar Crop</button>
              <button onClick={cancelCrop} style={{ position:"absolute", bottom:8, left:8, padding:"7px 14px", borderRadius:6, background:"rgba(255,60,60,.8)", border:"none", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>✕ Cancelar</button>
            </> : <>
              <button onMouseDown={()=>setShowBefore(true)} onMouseUp={()=>setShowBefore(false)}
                onTouchStart={()=>setShowBefore(true)} onTouchEnd={()=>setShowBefore(false)}
                style={{ position:"absolute", bottom:8, right:8, padding:"5px 10px", borderRadius:6, background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", fontSize:10, cursor:"pointer", backdropFilter:"blur(8px)" }}>
                👁 Original
              </button>
              <label style={{ position:"absolute", bottom:8, left:8, padding:"5px 10px", borderRadius:6, background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", fontSize:10, cursor:"pointer", backdropFilter:"blur(8px)" }}>
                🔄 Trocar<input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }}/>
              </label>
            </>}
          </div>
        )}
      </div>

      {/* Active adjustment slider (mobile) */}
      {activeAdj && photo && (
        <div style={{ padding:"8px 16px", background:"rgba(0,0,0,.9)", borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:11, color:"#00d4ff", fontWeight:700 }}>{ADJUSTMENTS.find(a=>a.id===activeAdj)?.label}</span>
            <span style={{ fontSize:11, color:"#fff" }}>{adj[activeAdj]}</span>
          </div>
          <input type="range" min={ADJUSTMENTS.find(a=>a.id===activeAdj)?.min||0} max={ADJUSTMENTS.find(a=>a.id===activeAdj)?.max||100}
            value={adj[activeAdj]??0} onChange={e=>setAdj(p=>({...p,[activeAdj]:Number(e.target.value)}))}
            style={{ width:"100%", accentColor:"#00d4ff" }}/>
        </div>
      )}

      {/* Bottom toolbar */}
      <div style={{ background:"#0a0a0a", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        {/* Tab content */}
        <div style={{ maxHeight:160, overflowY:"auto" }}>
          {tab==="filters" && (
            <div style={{ display:"flex", flexDirection:"column" }}>
              {/* Category pills */}
              <div style={{ display:"flex", gap:5, padding:"8px 8px 4px", overflowX:"auto", WebkitOverflowScrolling:"touch", flexShrink:0 }}>
                {FILTER_CATS.map(c=>(
                  <button key={c} onClick={()=>setFilterCat(c)}
                    style={{ flexShrink:0, padding:"5px 11px", borderRadius:20, cursor:"pointer", fontSize:10, fontWeight:700, whiteSpace:"nowrap",
                      background:filterCat===c?"rgba(0,212,255,.2)":"rgba(255,255,255,.05)",
                      border:filterCat===c?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.07)",
                      color:filterCat===c?"#00d4ff":"#556" }}>
                    {c}
                  </button>
                ))}
              </div>
              {/* Filter thumbs */}
              <div style={{ display:"flex", gap:4, padding:"6px 8px 10px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                {FILTERS.filter(f=>filterCat==="Todos"||f.cat===filterCat).map(f=>(
                  <FilterThumb key={f.id} filter={f} adj={adj} img={photo} selected={activeFilter===f.id} onClick={()=>applyFilter(f.id)}/>
                ))}
              </div>
            </div>
          )}
          {tab==="adjust" && (
            <div style={{ padding:"10px 12px" }}>
              {/* Quick actions */}
              <div style={{ display:"flex", gap:5, marginBottom:6 }}>
                <button onClick={autoEnhance} style={{ flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, background:"linear-gradient(135deg,rgba(0,212,255,.2),rgba(200,119,255,.2))", border:"1px solid rgba(0,212,255,.3)", color:"#00d4ff" }}>✨ Auto-Enhance</button>
                <button onClick={()=>setFlipH(h=>!h)} style={{ padding:"8px 12px", borderRadius:8, cursor:"pointer", fontSize:18, background:flipH?"rgba(245,197,24,.2)":"rgba(255,255,255,.05)", border:flipH?"1px solid rgba(245,197,24,.4)":"1px solid rgba(255,255,255,.06)" }} title="Flip Horizontal">↔️</button>
                <button onClick={()=>setFlipV(v=>!v)} style={{ padding:"8px 12px", borderRadius:8, cursor:"pointer", fontSize:18, background:flipV?"rgba(245,197,24,.2)":"rgba(255,255,255,.05)", border:flipV?"1px solid rgba(245,197,24,.4)":"1px solid rgba(255,255,255,.06)" }} title="Flip Vertical">↕️</button>
                <button onClick={()=>setAdj(defaultAdj())} style={{ padding:"8px 12px", borderRadius:8, cursor:"pointer", fontSize:18, background:"rgba(255,60,60,.08)", border:"1px solid rgba(255,60,60,.15)" }} title="Resetar">↺</button>
              </div>
              {/* Remove Background */}
              <button onClick={removeBg} disabled={!photo||removingBg} style={{ width:"100%", padding:"9px", borderRadius:8, cursor:(!photo||removingBg)?"default":"pointer", fontSize:11, fontWeight:900, marginBottom:6,
                background:removingBg?"rgba(255,165,0,.15)":photo?"linear-gradient(135deg,rgba(0,230,118,.25),rgba(0,180,255,.2))":"rgba(255,255,255,.04)",
                border:removingBg?"1px solid rgba(255,165,0,.4)":photo?"1px solid rgba(0,230,118,.4)":"1px solid rgba(255,255,255,.06)",
                color:removingBg?"#ffaa00":photo?"#00e676":"#3a4060" }}>
                {removingBg?"⏳ "+bgRemoveProgress:"🪄 Remover Fundo (IA)"}
              </button>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
                {ADJUSTMENTS.map(a=>(
                  <button key={a.id} onClick={()=>setActiveAdj(activeAdj===a.id?null:a.id)} style={{
                    padding:"8px 4px", borderRadius:8, cursor:"pointer", fontSize:9, fontWeight:700, textAlign:"center",
                    background:activeAdj===a.id?"rgba(0,212,255,.2)":"rgba(255,255,255,.04)",
                    border:activeAdj===a.id?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.06)",
                    color:activeAdj===a.id?"#00d4ff":(adj[a.id]!==a.def?"#f5c518":"#3a4060") }}>
                    <div style={{ fontSize:14, marginBottom:2 }}>
                      {a.id==="brightness"?"☀️":a.id==="contrast"?"◐":a.id==="saturation"?"🎨":a.id==="temperature"?"🌡️":a.id==="sharpness"?"🔍":a.id==="fade"?"🌫️":a.id==="vignette"?"◉":a.id==="grain"?"📷":a.id==="highlights"?"⬜":a.id==="shadows"?"⬛":"⚙️"}
                    </div>
                    {a.label}
                    {adj[a.id]!==a.def && <div style={{ fontSize:8, color:"#f5c518" }}>{adj[a.id]>0?"+":""}{adj[a.id]}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab==="text" && (
            <div style={{ padding:"10px 12px" }}>
              <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                <button onClick={addText} style={{ ...iB(true,"#00d4ff"), flex:1 }}>＋ Adicionar Texto</button>
                {selTextId && <button onClick={deleteText} style={{ ...iB(true,"#ff4444") }}>🗑</button>}
              </div>
              {selText && <>
                <textarea value={selText.text} onChange={e=>updateText(selTextId,{text:e.target.value})}
                  style={{ ...I, height:40, resize:"none", marginBottom:6 }}/>
                {/* Font picker — category + horizontal scroll */}
                <div style={{ marginBottom:6 }}>
                  <span style={L()}>Fonte</span>
                  {/* Category pills */}
                  <div style={{ display:"flex", gap:4, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:4, marginBottom:4 }}>
                    {FONT_CATS.map(c=>(
                      <button key={c} onClick={()=>setFontCat(c)}
                        style={{ flexShrink:0, padding:"4px 9px", borderRadius:20, cursor:"pointer", fontSize:9, fontWeight:700, whiteSpace:"nowrap",
                          background:fontCat===c?"rgba(200,119,255,.2)":"rgba(255,255,255,.04)",
                          border:fontCat===c?"1px solid rgba(200,119,255,.5)":"1px solid rgba(255,255,255,.06)",
                          color:fontCat===c?"#c87cff":"#445" }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:5, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:4 }}>
                    {ALL_FONTS.filter(f=>fontCat==="Todas"||f.cat===fontCat).map(f=>(
                      <button key={f.name+f.cat} onClick={()=>updateText(selTextId,{fontFamily:f.name})}
                        style={{ flex:"0 0 auto", padding:"6px 10px", borderRadius:7, cursor:"pointer", fontSize:14,
                          fontFamily:f.name, fontWeight:700,
                          background:selText.fontFamily===f.name?"rgba(200,119,255,.2)":"rgba(255,255,255,.05)",
                          border:selText.fontFamily===f.name?"1px solid rgba(200,119,255,.6)":"1px solid rgba(255,255,255,.07)",
                          color:selText.fontFamily===f.name?"#c87cff":"#ccc", whiteSpace:"nowrap" }}>
                        {f.label}
                        {selText.fontFamily===f.name && <span style={{ fontSize:8, marginLeft:4 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:4 }}>
                  <div><span style={L()}>Tam.</span><select value={selText.fontSize} onChange={e=>updateText(selTextId,{fontSize:Number(e.target.value)})} style={I}>
                    {[14,18,22,28,36,48,64,80,96].map(f=><option key={f} value={f}>{f}</option>)}
                  </select></div>
                  <div><span style={L()}>Cor</span><input type="color" value={selText.color?.startsWith("rgba")?"#fff":selText.color||"#fff"} onChange={e=>updateText(selTextId,{color:e.target.value,useGradient:false})} style={{ width:"100%", height:36, borderRadius:6, border:"none" }}/></div>
                  <div><span style={L()}>Peso</span><select value={selText.fontWeight} onChange={e=>updateText(selTextId,{fontWeight:e.target.value})} style={I}>
                    {["400","700","900"].map(w=><option key={w} value={w}>{w}</option>)}
                  </select></div>
                  <div><span style={L()}>Alinhar</span><select value={selText.align} onChange={e=>updateText(selTextId,{align:e.target.value})} style={I}>
                    <option value="left">◄</option><option value="center">■</option><option value="right">►</option>
                  </select></div>
                </div>
              </>}
            </div>
          )}
          {tab==="stickers" && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, padding:"10px 12px" }}>
              {STICKERS.map(s=>(
                <button key={s} onClick={()=>addSticker(s)} style={{ fontSize:26, background:"none", border:"none", cursor:"pointer", padding:4 }}>{s}</button>
              ))}
            </div>
          )}
          {tab==="light" && (
            <div style={{ display:"flex", gap:4, padding:"12px 8px", overflowX:"auto" }}>
              {LIGHT_FX.map(fx=><LightThumb key={fx.id} fx={fx} selected={lightFx===fx.id} onClick={()=>setLightFx(fx.id)} img={photo}/>)}
            </div>
          )}
          {tab==="border" && (
            <div style={{ display:"flex", gap:8, padding:"10px 12px", overflowX:"auto" }}>
              {BORDERS.map(b=>(
                <button key={b.id} onClick={()=>setBorder(b.id)} style={{ flex:"0 0 64px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer" }}>
                  <div style={{ width:56, height:56, borderRadius:8, overflow:"hidden", border:border===b.id?"2px solid #00d4ff":"2px solid rgba(255,255,255,.1)", background:"#222", position:"relative" }}>
                    <div style={{ position:"absolute", inset:0, ...b.style, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {photo ? <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <div style={{ width:"100%", height:"100%", background:"#444" }}/>}
                    </div>
                  </div>
                  <span style={{ fontSize:8, color:border===b.id?"#00d4ff":"#666", whiteSpace:"nowrap" }}>{b.label}</span>
                </button>
              ))}
            </div>
          )}
          {tab==="crop" && (
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"#f5c518", fontWeight:700, marginBottom:8 }}>RECORTAR FOTO</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
                {CROP_RATIOS.map(r=>(
                  <button key={r.id} onClick={()=>{setCropRatio(r.id);}} style={{ padding:"6px 10px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700,
                    background:cropRatio===r.id?"rgba(245,197,24,.2)":"rgba(255,255,255,.05)",
                    border:cropRatio===r.id?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.07)",
                    color:cropRatio===r.id?"#f5c518":"#555" }}>{r.label}</button>
                ))}
              </div>
              {!cropping
                ? <button onClick={startCrop} disabled={!photo} style={{ width:"100%", padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:900, fontSize:12, background:"linear-gradient(135deg,#f5c518,#ff9800)", border:"none", color:"#000" }}>✂️ Iniciar Crop</button>
                : <div style={{ display:"flex", gap:6 }}>
                    <button onClick={applyCrop} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:900, fontSize:12, background:"#00d4ff", border:"none", color:"#000" }}>✓ Aplicar</button>
                    <button onClick={cancelCrop} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:12, background:"rgba(255,60,60,.2)", border:"1px solid rgba(255,60,60,.4)", color:"#ff6060" }}>✕ Cancelar</button>
                  </div>
              }
            </div>
          )}
          {tab==="blur" && (
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"#c87cff", fontWeight:700, marginBottom:8 }}>DESFOQUE SELETIVO</div>
              <button onClick={addBlur} style={{ width:"100%", padding:"9px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:11, background:"rgba(200,119,255,.15)", border:"1px solid rgba(200,119,255,.3)", color:"#c87cff", marginBottom:8 }}>＋ Adicionar Área de Blur</button>
              {blurs.map(b=>(
                <div key={b.id} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:7, padding:"8px 10px", marginBottom:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:10, color:"#c87cff" }}>Blur {b.blur}px</span>
                    <button onClick={()=>removeBlur(b.id)} style={{ fontSize:10, color:"#ff4444", background:"none", border:"none", cursor:"pointer" }}>✕</button>
                  </div>
                  <input type="range" min="2" max="30" value={b.blur} onChange={e=>updateBlur(b.id,{blur:Number(e.target.value)})} style={{ width:"100%", accentColor:"#c87cff" }}/>
                </div>
              ))}
              {blurs.length===0 && <div style={{ fontSize:10, color:"#2a3050", textAlign:"center", padding:8 }}>Adicione uma área e arraste na foto para posicionar</div>}
            </div>
          )}
          {tab==="draw" && (
            <div style={{ padding:"10px 12px" }}>
              <div style={{ display:"flex", gap:5, marginBottom:8 }}>
                <button onClick={()=>{setDrawMode(d=>!d);setIsEraser(false);}} style={{ flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:900,
                  background:drawMode&&!isEraser?"linear-gradient(135deg,rgba(255,0,102,.3),rgba(200,0,255,.2))":"rgba(255,255,255,.05)",
                  border:drawMode&&!isEraser?"1px solid rgba(255,0,102,.5)":"1px solid rgba(255,255,255,.08)",
                  color:drawMode&&!isEraser?"#ff0066":"#888" }}>🖌 {drawMode&&!isEraser?"Pincel ON":"Pincel"}</button>
                <button onClick={()=>{setDrawMode(true);setIsEraser(e=>!e);}} style={{ flex:1, padding:"8px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700,
                  background:isEraser?"rgba(245,197,24,.2)":"rgba(255,255,255,.05)",
                  border:isEraser?"1px solid rgba(245,197,24,.4)":"1px solid rgba(255,255,255,.08)",
                  color:isEraser?"#f5c518":"#888" }}>⬜ Borracha</button>
                <button onClick={undoDraw} style={{ padding:"8px 12px", borderRadius:8, cursor:"pointer", fontSize:14, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)" }}>↩</button>
                <button onClick={clearDrawings} style={{ padding:"8px 12px", borderRadius:8, cursor:"pointer", fontSize:11, background:"rgba(255,60,60,.1)", border:"1px solid rgba(255,60,60,.2)", color:"#ff6060" }}>✕</button>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:10, color:"#888" }}>Cor</span>
                <input type="color" value={brushColor} onChange={e=>setBrushColor(e.target.value)} style={{ width:40, height:30, border:"none", borderRadius:5, cursor:"pointer" }}/>
                <span style={{ fontSize:10, color:"#888" }}>Tamanho {brushSize}px</span>
              </div>
              <input type="range" min="2" max="40" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} style={{ width:"100%", accentColor:"#ff0066" }}/>
              <div style={{ fontSize:9, color:"#2a3050", textAlign:"center", marginTop:6 }}>{drawMode?"Desenhe na foto diretamente!":"Ative o pincel para começar"}</div>
            </div>
          )}
        {/* Tab buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", borderTop:"1px solid rgba(255,255,255,.06)" }}>
          {[["filters","🎨","Filtros"],["adjust","⚙️","Ajustes"],["text","T","Texto"],["stickers","😊","Stickers"],["light","✨","Luz"],["border","🖼","Borda"],["crop","✂️","Crop"],["blur","🌫","Blur"],["draw","🖌","Pincel"]].map(([t,ic,lb])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"8px 2px", background:tabActive(t)?"rgba(0,212,255,.1)":"none", border:"none", borderTop:tabActive(t)?"2px solid #00d4ff":"2px solid transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
              <span style={{ fontSize:14 }}>{ic}</span>
              <span style={{ fontSize:7, color:tabActive(t)?"#00d4ff":"#3a4060", fontWeight:700 }}>{lb}</span>
            </button>
          ))}
        </div>
        </div>
      </div>
    </div>
  );

  /* ── DESKTOP LAYOUT ── */
  return (
    <div style={{ minHeight:"100vh", background:"#060a14", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff" }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:200, background:"rgba(6,10,20,.97)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onHome} style={{ padding:"7px 12px", borderRadius:7, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#aaa", fontSize:11, fontWeight:700, cursor:"pointer" }}>🏠 Home</button>
        <button onClick={onSwitch} style={{ padding:"7px 14px", borderRadius:7, background:"rgba(0,212,255,.1)", border:"1px solid rgba(0,212,255,.3)", color:"#00d4ff", fontSize:11, fontWeight:700, cursor:"pointer" }}>⚡ Maker Info Posts</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:5 }}>MAKER INFO</div>
          <div style={{ fontSize:15, fontWeight:900 }}>📷 Editor de <span style={{ color:"#00d4ff" }}>Fotos</span></div>
        </div>
        {photo && <>
          <button onClick={undo} disabled={!canUndo} style={{ ...iB(canUndo), padding:"8px 12px", fontSize:15 }} title="Ctrl+Z">↩</button>
          <button onClick={redo} disabled={!canRedo} style={{ ...iB(canRedo), padding:"8px 12px", fontSize:15 }} title="Ctrl+Y">↪</button>
          <button onMouseDown={()=>setShowBefore(true)} onMouseUp={()=>setShowBefore(false)}
            style={{ ...iB(false), padding:"8px 14px" }}>👁 Antes/Depois</button>
          <button onClick={removeBg} disabled={removingBg} style={{ ...iB(false,"#00e676"), padding:"8px 14px", color:removingBg?"#ffaa00":"#00e676", border:removingBg?"1px solid rgba(255,165,0,.4)":"1px solid rgba(0,230,118,.35)" }}>
            {removingBg?"⏳ "+bgRemoveProgress:"🪄 Remover Fundo"}
          </button>
          <label style={{ ...iB(false), padding:"8px 14px", cursor:"pointer" }}>🔄 Trocar foto<input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }}/></label>
          <button onClick={clearSession} style={{ ...iB(false,"rgba(255,80,80,.8)"), padding:"8px 14px" }}>🗑 Nova edição</button>
        </>}
        <button onClick={handleExport} disabled={!photo||saving} style={{ padding:"9px 18px", borderRadius:8, cursor:(!photo||saving)?"default":"pointer", fontSize:12, fontWeight:900, background:(!photo||saving)?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)", border:"none", color:(!photo||saving)?"#444":"#000", boxShadow:(!photo||saving)?"none":"0 0 18px rgba(0,212,255,.3)" }}>
          {saving?"⏳ Exportando...":"⬇️ Baixar PNG"}
        </button>
      </div>

      <div style={{ display:"flex", gap:16, padding:16, alignItems:"flex-start", justifyContent:"center" }}>
        {/* Canvas */}
        <div style={{ flex:"0 0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          {!photo ? (
            <label style={{ width:440, height:440, borderRadius:16, border:"2px dashed rgba(255,255,255,.1)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:12, background:"rgba(255,255,255,.02)", transition:"border-color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,212,255,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}>
              <div style={{ fontSize:56 }}>📷</div>
              <div style={{ fontSize:15, color:"#3a5070", fontWeight:700 }}>Clique para escolher uma foto</div>
              <div style={{ fontSize:11, color:"#1e2840" }}>ou arraste e solte aqui</div>
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }}/>
            </label>
          ) : (
            <div style={{ position:"relative" }}>
              {/* Before/After — always in DOM, opacity toggle, pointerEvents none so it never blocks */}
              <div style={{ position:"absolute", inset:0, zIndex:20, borderRadius:14, overflow:"hidden", opacity:showBefore?1:0, pointerEvents:"none", transition:"opacity .1s" }}>
                <img src={photo} alt="" style={{ width:440, height:440, objectFit:"cover" }} crossOrigin="anonymous"/>
                <div style={{ position:"absolute", top:10, left:10, fontSize:11, color:"#fff", background:"rgba(0,0,0,.7)", padding:"5px 12px", borderRadius:6, fontWeight:700 }}>ORIGINAL</div>
              </div>
              <div ref={photoRef} data-canvas="1" data-photocanvas="1" style={{ width:440, height:440, position:"relative", borderRadius:14, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,.8)", ...borderStyle, transform:`scale(${zoom})`, transformOrigin:"center center", transition:"transform .15s" }}>
                <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", filter:cssFilter, transform:`scaleX(${flipH?-1:1}) scaleY(${flipV?-1:1})` }} crossOrigin="anonymous"/>
                {overlays.map((o,i)=><div key={i} style={{ position:"absolute", inset:0, ...o }}/>)}
                <div style={{ position:"absolute", inset:0, ...lightStyle, pointerEvents:"none" }}/>
                {blurs.map(b=><BlurRegion key={b.id} b={b} scale={1} onUpdate={updateBlur} onRemove={removeBlur}/>)}
                {drawMode && <DrawingCanvas width={440} height={440} drawings={drawings} onDraw={handleDraw} brushColor={brushColor} brushSize={brushSize} isEraser={isEraser}/>}
                {texts.map(el=>(
                  editTextId===el.id
                    ? <PhotoInlineEdit key={el.id} el={el} onDone={val=>{updateText(el.id,{text:val});setEditTextId(null);}}/>
                    : <PhotoTextEl key={el.id} el={el} selected={selTextId===el.id}
                        onSelect={id=>{setSelTextId(id);setTab("text");}} onEdit={id=>{setSelTextId(id);setEditTextId(id);}}
                        onUpdate={updateText} scale={1}/>
                ))}
                {cropping && <CropOverlay crop={crop} scale={1} ratio={cropRatio} onUpdate={updateCropWithRatio}/>}
              </div>
              {/* Crop confirm bar */}
              {cropping && (
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button onClick={applyCrop} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:900, fontSize:13, background:"linear-gradient(135deg,#00d4ff,#0088cc)", border:"none", color:"#000" }}>✓ Aplicar Crop</button>
                  <button onClick={cancelCrop} style={{ flex:1, padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, background:"rgba(255,60,60,.15)", border:"1px solid rgba(255,60,60,.4)", color:"#ff6060" }}>✕ Cancelar</button>
                </div>
              )}
            </div>
          )}
          <div style={{ display:"flex", gap:6, marginBottom:8 }}>
            <button onClick={()=>{ setAdj(defaultAdj()); setActiveFilter("none"); }} style={{ ...iB(false,"#ff4444"), fontSize:10 }}>↺ Resetar tudo</button>
            {selTextId && <button onClick={deleteText} style={{ ...iB(true,"#ff4444"), fontSize:10 }}>🗑 Apagar texto</button>}
            <button onClick={()=>setZoom(z=>Math.min(3,+(z+0.25).toFixed(2)))} style={{ ...iB(zoom>1,"#00e676"), fontSize:12, padding:"6px 10px" }} title="Zoom in">🔍＋</button>
            <button onClick={()=>setZoom(z=>Math.max(0.5,+(z-0.25).toFixed(2)))} style={{ ...iB(zoom<1,"#ff9800"), fontSize:12, padding:"6px 10px" }} title="Zoom out">🔍－</button>
            {zoom!==1 && <button onClick={()=>setZoom(1)} style={{ ...iB(false), fontSize:10 }}>{Math.round(zoom*100)}%</button>}
          </div>
        </div>

        {/* Side panel */}
        <div style={{ flex:"0 0 300px" }}>
          {/* Tabs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4, marginBottom:10 }}>
            {[["filters","🎨 Filtros"],["adjust","⚙️ Ajustes"],["text","T Texto"],["stickers","😊 Stickers"],["light","✨ Luz"],["border","🖼 Borda"],["crop","✂️ Crop"],["blur","🌫 Blur"],["draw","🖌 Pincel"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{ padding:"8px 4px", borderRadius:7, cursor:"pointer", fontSize:10, fontWeight:700,
                background:tabActive(t)?"rgba(0,212,255,.18)":"rgba(255,255,255,.03)",
                border:tabActive(t)?"1px solid rgba(0,212,255,.45)":"1px solid rgba(255,255,255,.05)",
                color:tabActive(t)?"#00d4ff":"#3a4060" }}>{l}</button>
            ))}
          </div>

          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, padding:12 }}>
            {/* FILTERS */}
            {tab==="filters" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:8 }}>FILTROS</div>
              {/* Category pills */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                {FILTER_CATS.map(c=>(
                  <button key={c} onClick={()=>setFilterCat(c)}
                    style={{ padding:"4px 10px", borderRadius:20, cursor:"pointer", fontSize:9, fontWeight:700,
                      background:filterCat===c?"rgba(0,212,255,.18)":"rgba(255,255,255,.04)",
                      border:filterCat===c?"1px solid rgba(0,212,255,.45)":"1px solid rgba(255,255,255,.06)",
                      color:filterCat===c?"#00d4ff":"#3a4060" }}>
                    {c}
                  </button>
                ))}
              </div>
              {/* Filter buttons */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                {FILTERS.filter(f=>filterCat==="Todos"||f.cat===filterCat).map(f=>(
                  <button key={f.id} onClick={()=>applyFilter(f.id)} style={{ padding:"6px 10px", borderRadius:7, cursor:"pointer", fontSize:10, fontWeight:700,
                    background:activeFilter===f.id?"rgba(0,212,255,.18)":"rgba(255,255,255,.04)",
                    border:activeFilter===f.id?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.06)",
                    color:activeFilter===f.id?"#00d4ff":"#3a4060" }}>{f.label}</button>
                ))}
              </div>
              {/* Saved presets */}
              {savedPresets.length>0 && <>
                <div style={{ fontSize:8, color:"rgba(245,197,24,.7)", letterSpacing:3, marginBottom:6 }}>MEUS PRESETS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                  {savedPresets.map(pr=>(
                    <div key={pr.id} style={{ display:"flex", gap:4 }}>
                      <button onClick={()=>loadPreset(pr)} style={{ flex:1, padding:"7px 10px", borderRadius:6, cursor:"pointer", fontSize:11, background:"rgba(245,197,24,.1)", border:"1px solid rgba(245,197,24,.2)", color:"#f5c518", textAlign:"left", fontWeight:700 }}>⭐ {pr.name}</button>
                      <button onClick={()=>setSavedPresets(p=>p.filter(x=>x.id!==pr.id))} style={{ padding:"7px 10px", borderRadius:6, cursor:"pointer", background:"rgba(255,60,60,.08)", border:"1px solid rgba(255,60,60,.15)", color:"#ff4444" }}>✕</button>
                    </div>
                  ))}
                </div>
              </>}
              {!showSavePreset
                ? <button onClick={()=>setShowSavePreset(true)} style={{ ...iB(false,"#f5c518"), width:"100%", padding:"9px" }}>💾 Salvar ajustes como preset</button>
                : <div style={{ display:"flex", gap:5 }}>
                    <input value={presetName} onChange={e=>setPresetName(e.target.value)} placeholder="Nome do preset..." style={{ ...I, flex:1 }} onKeyDown={e=>e.key==="Enter"&&savePreset()}/>
                    <button onClick={savePreset} style={{ padding:"8px 12px", borderRadius:6, background:"rgba(245,197,24,.2)", border:"1px solid rgba(245,197,24,.4)", color:"#f5c518", fontWeight:900, cursor:"pointer" }}>✓</button>
                    <button onClick={()=>setShowSavePreset(false)} style={{ padding:"8px 10px", borderRadius:6, background:"none", border:"1px solid rgba(255,255,255,.06)", color:"#444", cursor:"pointer" }}>✕</button>
                  </div>
              }
            </>}

            {/* ADJUSTMENTS */}
            {tab==="adjust" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>AJUSTES</div>
              {/* Remove Background */}
              <button onClick={removeBg} disabled={!photo||removingBg} style={{ width:"100%", padding:"11px", borderRadius:8, cursor:(!photo||removingBg)?"default":"pointer", fontSize:12, fontWeight:900, marginBottom:10,
                background:removingBg?"rgba(255,165,0,.12)":photo?"linear-gradient(135deg,rgba(0,230,118,.2),rgba(0,180,255,.15))":"rgba(255,255,255,.04)",
                border:removingBg?"1px solid rgba(255,165,0,.4)":photo?"1px solid rgba(0,230,118,.4)":"1px solid rgba(255,255,255,.06)",
                color:removingBg?"#ffaa00":photo?"#00e676":"#3a4060" }}>
                {removingBg?"⏳  "+bgRemoveProgress:"🪄 Remover Fundo com IA  —  gratuito · sem limite"}
              </button>
              {bgRemoveProgress&&!removingBg&&<div style={{ fontSize:11, color:"#00e676", textAlign:"center", marginBottom:8, padding:"6px", borderRadius:6, background:"rgba(0,230,118,.08)", border:"1px solid rgba(0,230,118,.2)" }}>{bgRemoveProgress}</div>}
              {/* Quick actions */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:5, marginBottom:12 }}>
                <button onClick={autoEnhance} style={{ gridColumn:"1/3", padding:"9px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700, background:"linear-gradient(135deg,rgba(0,212,255,.15),rgba(200,119,255,.15))", border:"1px solid rgba(0,212,255,.3)", color:"#00d4ff" }}>✨ Auto-Enhance</button>
                <button onClick={()=>setFlipH(h=>!h)} style={{ padding:"9px", borderRadius:8, cursor:"pointer", fontSize:16, fontWeight:700, background:flipH?"rgba(245,197,24,.2)":"rgba(255,255,255,.04)", border:flipH?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.06)", color:flipH?"#f5c518":"#666" }} title="Flip Horizontal">↔️ H</button>
                <button onClick={()=>setFlipV(v=>!v)} style={{ padding:"9px", borderRadius:8, cursor:"pointer", fontSize:16, fontWeight:700, background:flipV?"rgba(245,197,24,.2)":"rgba(255,255,255,.04)", border:flipV?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.06)", color:flipV?"#f5c518":"#666" }} title="Flip Vertical">↕️ V</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {ADJUSTMENTS.map(a=>(
                  <div key={a.id}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:11, color:"#aaa" }}>{a.label}</span>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <span style={{ fontSize:11, color: adj[a.id]!==a.def?"#f5c518":"#3a4060", minWidth:30, textAlign:"right" }}>
                          {adj[a.id]>0?"+":""}{adj[a.id]}
                        </span>
                        {adj[a.id]!==a.def && <button onClick={()=>setAdj(p=>({...p,[a.id]:a.def}))} style={{ fontSize:9, color:"#ff4444", background:"none", border:"none", cursor:"pointer", padding:0 }}>↺</button>}
                      </div>
                    </div>
                    <input type="range" min={a.min} max={a.max} value={adj[a.id]??a.def}
                      onChange={e=>setAdj(p=>({...p,[a.id]:Number(e.target.value)}))}
                      style={{ width:"100%", accentColor: adj[a.id]!==a.def?"#f5c518":"#00d4ff" }}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>setAdj(defaultAdj())} style={{ ...iB(false,"#ff4444"), width:"100%", marginTop:12, padding:"9px" }}>↺ Resetar ajustes</button>
            </>}

            {/* TEXT */}
            {tab==="text" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>TEXTO NA FOTO</div>
              <button onClick={addText} style={{ ...iB(true,"#00d4ff"), width:"100%", padding:"10px", marginBottom:10 }}>＋ Adicionar texto</button>
              {selText && <>
                <div style={{ marginBottom:8 }}>
                  <span style={L()}>Texto <span style={{ color:"#2a3050", textTransform:"none" }}>(ou 2× clique)</span></span>
                  <textarea value={selText.text} onChange={e=>updateText(selTextId,{text:e.target.value})} style={{ ...I, height:50, resize:"vertical" }}/>
                </div>
                {/* Font picker with category filter */}
                <div style={{ marginBottom:10 }}>
                  <span style={L("rgba(200,119,255,.8)")}>Fonte — {ALL_FONTS.length} fontes</span>
                  {/* Category pills */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:6 }}>
                    {FONT_CATS.map(c=>(
                      <button key={c} onClick={()=>setFontCat(c)}
                        style={{ padding:"3px 8px", borderRadius:20, cursor:"pointer", fontSize:8, fontWeight:700,
                          background:fontCat===c?"rgba(200,119,255,.2)":"rgba(255,255,255,.04)",
                          border:fontCat===c?"1px solid rgba(200,119,255,.45)":"1px solid rgba(255,255,255,.06)",
                          color:fontCat===c?"#c87cff":"#3a4060" }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:180, overflowY:"auto" }}>
                    {ALL_FONTS.filter(f=>fontCat==="Todas"||f.cat===fontCat).map(f=>(
                      <button key={f.name+f.cat} onClick={()=>updateText(selTextId,{fontFamily:f.name})}
                        style={{ padding:"8px 10px", borderRadius:7, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center",
                          background:selText.fontFamily===f.name?"rgba(200,119,255,.18)":"rgba(255,255,255,.03)",
                          border:selText.fontFamily===f.name?"1px solid rgba(200,119,255,.5)":"1px solid rgba(255,255,255,.05)" }}>
                        <span style={{ fontFamily:f.name, fontSize:17, color:selText.fontFamily===f.name?"#c87cff":"#ddd", letterSpacing:.3 }}>{f.label}</span>
                        <span style={{ fontSize:8, color:"#2a3050", flexShrink:0 }}>{f.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                  <div><span style={L()}>Tamanho</span><select value={selText.fontSize} onChange={e=>updateText(selTextId,{fontSize:Number(e.target.value)})} style={I}>
                    {[12,14,18,22,28,36,48,56,64,80,96].map(f=><option key={f} value={f}>{f}px</option>)}
                  </select></div>
                  <div><span style={L()}>Peso</span><select value={selText.fontWeight} onChange={e=>updateText(selTextId,{fontWeight:e.target.value})} style={I}>
                    {["400","700","900"].map(w=><option key={w} value={w}>{w}</option>)}
                  </select></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:8 }}>
                  <div><span style={L()}>Cor</span><input type="color" value={selText.color?.startsWith("rgba")?"#fff":selText.color||"#fff"} onChange={e=>updateText(selTextId,{color:e.target.value,useGradient:false})} style={{ width:"100%", height:38, borderRadius:6, border:"1px solid rgba(255,255,255,.1)", cursor:"pointer", background:"none" }}/></div>
                  <div><span style={L()}>Alinhar</span><select value={selText.align} onChange={e=>updateText(selTextId,{align:e.target.value})} style={I}><option value="left">Esq</option><option value="center">Centro</option><option value="right">Dir</option></select></div>
                  <div><span style={L()}>Opac.</span><input type="range" min="0" max="1" step="0.05" value={selText.opacity??1} onChange={e=>updateText(selTextId,{opacity:Number(e.target.value)})} style={{ width:"100%", marginTop:10 }}/></div>
                </div>
                <div style={{ marginBottom:8, background:"rgba(0,212,255,.05)", border:"1px solid rgba(0,212,255,.1)", borderRadius:7, padding:8 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:11, marginBottom:selText.useGradient?8:0 }}>
                    <input type="checkbox" checked={!!selText.useGradient} onChange={e=>updateText(selTextId,{useGradient:e.target.checked})} style={{ width:14, height:14 }}/>
                    <span style={{ color:selText.useGradient?"#00d4ff":"#444", fontWeight:700 }}>🌈 Gradiente</span>
                  </label>
                  {selText.useGradient && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    <div><span style={L()}>Cor 1</span><input type="color" value={selText.gradientColor1||"#fff"} onChange={e=>updateText(selTextId,{gradientColor1:e.target.value})} style={{ width:"100%", height:34, borderRadius:5, border:"none" }}/></div>
                    <div><span style={L()}>Cor 2</span><input type="color" value={selText.gradientColor2||"#f5c518"} onChange={e=>updateText(selTextId,{gradientColor2:e.target.value})} style={{ width:"100%", height:34, borderRadius:5, border:"none" }}/></div>
                  </div>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  <div><span style={L()}>Sombra blur</span><input type="range" min="0" max="30" value={selText.shadowBlur||0} onChange={e=>updateText(selTextId,{shadowBlur:Number(e.target.value)})} style={{ width:"100%", marginTop:8 }}/></div>
                  <div><span style={L()}>Cor sombra</span><input type="color" value={selText.shadowColor||"#000"} onChange={e=>updateText(selTextId,{shadowColor:e.target.value})} style={{ width:"100%", height:34, borderRadius:5, border:"none" }}/></div>
                </div>
                <div style={{ display:"flex", gap:5, marginTop:10 }}>
                  <button onClick={deleteText} style={{ ...iB(true,"#ff4444"), flex:1 }}>🗑 Apagar</button>
                </div>
              </>}
              {texts.length===0 && !selText && <div style={{ textAlign:"center", color:"#2a3050", fontSize:11, padding:"10px 0" }}>Nenhum texto adicionado ainda.</div>}
            </>}

            {/* STICKERS */}
            {tab==="stickers" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>STICKERS</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {STICKERS.map(s=>(
                  <button key={s} onClick={()=>addSticker(s)} style={{ fontSize:28, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:8, cursor:"pointer", padding:"6px 8px", transition:"transform .1s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>{s}</button>
                ))}
              </div>
            </>}

            {/* LIGHT */}
            {tab==="light" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>EFEITOS DE LUZ</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:6 }}>
                {LIGHT_FX.map(fx=>(
                  <button key={fx.id} onClick={()=>setLightFx(fx.id)} style={{ padding:"10px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700,
                    background:lightFx===fx.id?"rgba(245,197,24,.15)":"rgba(255,255,255,.04)",
                    border:lightFx===fx.id?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.06)",
                    color:lightFx===fx.id?"#f5c518":"#3a4060",
                    position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, ...fx.style, opacity:.4, pointerEvents:"none" }}/>
                    {fx.label}
                  </button>
                ))}
              </div>
            </>}

            {/* BORDER */}
            {tab==="border" && <>
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>MOLDURA</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:6 }}>
                {BORDERS.map(b=>(
                  <button key={b.id} onClick={()=>setBorder(b.id)} style={{ padding:"10px", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:700,
                    background:border===b.id?"rgba(0,212,255,.15)":"rgba(255,255,255,.04)",
                    border:border===b.id?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.06)",
                    color:border===b.id?"#00d4ff":"#3a4060" }}>{b.label}</button>
                ))}
              </div>
            </>}

            {tab==="crop" && <>
              <div style={{ fontSize:8, color:"#f5c518", letterSpacing:3, marginBottom:10 }}>RECORTAR FOTO</div>
              <div style={{ marginBottom:10 }}>
                <span style={L("rgba(245,197,24,.8)")}>Proporção</span>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {CROP_RATIOS.map(r=>(
                    <button key={r.id} onClick={()=>setCropRatio(r.id)} style={{ padding:"7px 12px", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700,
                      background:cropRatio===r.id?"rgba(245,197,24,.2)":"rgba(255,255,255,.04)",
                      border:cropRatio===r.id?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.06)",
                      color:cropRatio===r.id?"#f5c518":"#555" }}>{r.label}</button>
                  ))}
                </div>
              </div>
              {!cropping
                ? <button onClick={startCrop} disabled={!photo} style={{ width:"100%", padding:"12px", borderRadius:8, cursor:"pointer", fontWeight:900, fontSize:13, background:"linear-gradient(135deg,#f5c518,#ff9800)", border:"none", color:"#000", marginBottom:6 }}>✂️ Iniciar Crop</button>
                : <div style={{ display:"flex", gap:8 }}>
                    <button onClick={applyCrop} style={{ flex:1, padding:"12px", borderRadius:8, cursor:"pointer", fontWeight:900, fontSize:13, background:"linear-gradient(135deg,#00d4ff,#0088cc)", border:"none", color:"#000" }}>✓ Aplicar Crop</button>
                    <button onClick={cancelCrop} style={{ flex:1, padding:"12px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13, background:"rgba(255,60,60,.15)", border:"1px solid rgba(255,60,60,.4)", color:"#ff6060" }}>✕ Cancelar</button>
                  </div>
              }
              <div style={{ marginTop:10, fontSize:10, color:"#2a3050", lineHeight:1.5 }}>
                Arraste as alças para ajustar. O crop é aplicado permanentemente na foto.
              </div>
            </>}

            {tab==="blur" && <>
              <div style={{ fontSize:8, color:"#c87cff", letterSpacing:3, marginBottom:10 }}>DESFOQUE SELETIVO</div>
              <button onClick={addBlur} style={{ width:"100%", padding:"10px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:12, background:"rgba(200,119,255,.15)", border:"1px solid rgba(200,119,255,.3)", color:"#c87cff", marginBottom:10 }}>＋ Adicionar Área de Blur</button>
              {blurs.map(b=>(
                <div key={b.id} style={{ background:"rgba(200,119,255,.06)", border:"1px solid rgba(200,119,255,.15)", borderRadius:8, padding:10, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:11, color:"#c87cff", fontWeight:700 }}>Blur: {b.blur}px</span>
                    <button onClick={()=>removeBlur(b.id)} style={{ fontSize:11, color:"#ff4444", background:"none", border:"none", cursor:"pointer" }}>✕ Remover</button>
                  </div>
                  <input type="range" min="2" max="30" value={b.blur} onChange={e=>updateBlur(b.id,{blur:Number(e.target.value)})} style={{ width:"100%", accentColor:"#c87cff" }}/>
                </div>
              ))}
              {blurs.length===0 && <div style={{ fontSize:11, color:"#2a3050", textAlign:"center", padding:12, lineHeight:1.6 }}>Clique em "Adicionar"<br/>Arraste a caixa pontilhada na foto<br/>Use as alças para redimensionar</div>}
            </>}

            {tab==="draw" && <>
              <div style={{ fontSize:8, color:"#ff0066", letterSpacing:3, marginBottom:10 }}>PINCEL / DESENHO</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                <button onClick={()=>{setDrawMode(d=>!d);setIsEraser(false);}} style={{ padding:"11px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:900,
                  background:drawMode&&!isEraser?"linear-gradient(135deg,rgba(255,0,102,.25),rgba(200,0,255,.15))":"rgba(255,255,255,.04)",
                  border:drawMode&&!isEraser?"1px solid rgba(255,0,102,.5)":"1px solid rgba(255,255,255,.06)",
                  color:drawMode&&!isEraser?"#ff0066":"#555" }}>🖌 {drawMode&&!isEraser?"Pincel ON":"Pincel OFF"}</button>
                <button onClick={()=>{setDrawMode(true);setIsEraser(e=>!e);}} style={{ padding:"11px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700,
                  background:isEraser?"rgba(245,197,24,.2)":"rgba(255,255,255,.04)",
                  border:isEraser?"1px solid rgba(245,197,24,.5)":"1px solid rgba(255,255,255,.06)",
                  color:isEraser?"#f5c518":"#555" }}>⬜ Borracha</button>
              </div>
              <div style={{ marginBottom:10 }}>
                <span style={L("rgba(255,0,102,.8)")}>Cor do pincel</span>
                <input type="color" value={brushColor} onChange={e=>setBrushColor(e.target.value)} style={{ width:"100%", height:40, border:"none", borderRadius:7, cursor:"pointer" }}/>
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={L("rgba(255,0,102,.8)")}>Tamanho</span>
                  <span style={{ fontSize:11, color:"#ff0066" }}>{brushSize}px</span>
                </div>
                <input type="range" min="2" max="60" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} style={{ width:"100%", accentColor:"#ff0066" }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <button onClick={undoDraw} style={{ ...iB(false,"#ff9800"), padding:"9px" }}>↩ Desfazer</button>
                <button onClick={clearDrawings} style={{ ...iB(false,"#ff4444"), padding:"9px" }}>🗑 Limpar tudo</button>
              </div>
              <div style={{ marginTop:10, fontSize:10, color:"#2a3050", lineHeight:1.5 }}>
                {drawMode?"Clique e arraste diretamente na foto para desenhar.":"Ative o pincel e desenhe livremente na foto."}
              </div>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   POST EDITOR (Maker Info)
═══════════════════════════════════════════════════════════════════ */

/* ── SVG Tech Icons ── */
const ICONS_SVG = [
  { id:"cpu",   cat:"🖥 Hardware", label:"CPU",      svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="1" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="20" y1="15" x2="23" y2="15"/></svg>` },
  { id:"monitor", cat:"🖥 Hardware", label:"Monitor", svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
  { id:"laptop",  cat:"🖥 Hardware", label:"Laptop",  svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 16h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z"/></svg>` },
  { id:"hdd",     cat:"🖥 Hardware", label:"HD",      svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="10" ry="5"/><path d="M2 12v6c0 2.76 4.48 5 10 5s10-2.24 10-5v-6"/><path d="M2 6v6"/><path d="M22 6v6"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>` },
  { id:"memory",  cat:"🖥 Hardware", label:"RAM",     svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="8" width="22" height="8" rx="1"/><line x1="5" y1="8" x2="5" y2="16"/><line x1="9" y1="8" x2="9" y2="16"/><line x1="13" y1="8" x2="13" y2="16"/><line x1="17" y1="8" x2="17" y2="16"/><line x1="5" y1="4" x2="5" y2="8"/><line x1="9" y1="4" x2="9" y2="8"/><line x1="13" y1="4" x2="13" y2="8"/><line x1="17" y1="4" x2="17" y2="8"/></svg>` },
  { id:"gpu",     cat:"🖥 Hardware", label:"GPU",     svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="6" width="22" height="12" rx="2"/><rect x="5" y="9" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="6" rx="1"/><line x1="7" y1="18" x2="7" y2="20"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="17" y1="18" x2="17" y2="20"/></svg>` },
  { id:"wifi",    cat:"📡 Rede",    label:"Wi-Fi",   svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>` },
  { id:"router",  cat:"📡 Rede",    label:"Roteador",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="13" width="22" height="8" rx="2"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="16" y1="13" x2="16" y2="21"/><path d="M8 5c0-2 1.5-3 4-3s4 1 4 3"/><path d="M6 7c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="12" cy="13" r="1" fill="currentColor"/></svg>` },
  { id:"shield",  cat:"🛡 Segurança",label:"Antivírus",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>` },
  { id:"lock",    cat:"🛡 Segurança",label:"Segurança",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>` },
  { id:"tool",    cat:"🔧 Serviço",  label:"Ferramenta",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/></svg>` },
  { id:"zap",     cat:"🔧 Serviço",  label:"Energia",  svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` },
  { id:"refresh", cat:"🔧 Serviço",  label:"Formatação",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>` },
  { id:"check",   cat:"✅ Ícones",   label:"OK",       svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>` },
  { id:"star",    cat:"✅ Ícones",   label:"Estrela",  svg:`<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },
  { id:"phone",   cat:"✅ Ícones",   label:"Telefone", svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.87-1.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>` },
  { id:"whatsapp",cat:"✅ Ícones",   label:"WhatsApp", svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>` },
  { id:"map",     cat:"✅ Ícones",   label:"Localização",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>` },
  { id:"clock",   cat:"✅ Ícones",   label:"Horário",  svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id:"trending",cat:"✅ Ícones",   label:"Desempenho",svg:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
];
const ICONS_CATS = [...new Set(ICONS_SVG.map(i=>i.cat))];
const FONTS_P = FONTS_ANUNCIO.map(f=>f.name);
const FSIZES_P = [8,10,12,14,16,18,20,24,28,32,36,42,48,56,64,72,80,96,112,128];
const FORMATS_P = [
  { id:"sq",    label:"1:1",   w:600, h:600  },
  { id:"story", label:"Story", w:600, h:1067 },
  { id:"land",  label:"16:9",  w:600, h:338  },
];
const NICHOS_P = [
  { id:"tech", label:"💻 Info", servicos: [
    { label:"Formatação",  emoji:"💻", preco:"R$ 80",      frase:"PC lento demais?",    sub:"Windows limpo · Drivers ok",      accent:"#00d4ff" },
    { label:"Limpeza",     emoji:"🧹", preco:"R$ 60",      frase:"Superaquecendo?",     sub:"Pasta térmica · Limpeza completa", accent:"#ff6b35" },
    { label:"Troca SSD",   emoji:"⚡", preco:"R$ 120",     frase:"10× mais rápido!",    sub:"Migração do sistema inclusa",     accent:"#f5c518" },
    { label:"Vírus",       emoji:"🛡️",preco:"R$ 70",      frase:"PC infectado?",       sub:"Remoção total + Proteção",       accent:"#00e676" },
    { label:"Manutenção",  emoji:"🔧", preco:"R$ 90",      frase:"Diagnóstico GRÁTIS!", sub:"Orçamento em 10 minutos",         accent:"#c87cff" },
    { label:"Recuperação", emoji:"💾", preco:"R$ 150",     frase:"Perdeu arquivos?",    sub:"HD · Pendrive · Cartão",          accent:"#ff4081" },
    { label:"Tela",        emoji:"🖥️",preco:"R$ 200",     frase:"Tela quebrada?",      sub:"Notebook e desktop",              accent:"#00bcd4" },
    { label:"RAM",         emoji:"🚀", preco:"R$ 80",      frase:"Mais velocidade!",    sub:"Dobra a performance do PC",       accent:"#ff9800" },
  ]},
  { id:"beauty", label:"💇 Beleza", servicos: [
    { label:"Corte",       emoji:"✂️", preco:"R$ 35",      frase:"Visual renovado!",    sub:"Corte + Escova inclusos",         accent:"#ff69b4" },
    { label:"Coloração",   emoji:"🎨", preco:"R$ 80",      frase:"Cor dos sonhos!",     sub:"Tintura + Hidratação",            accent:"#e91e8c" },
    { label:"Manicure",    emoji:"💅", preco:"R$ 25",      frase:"Unhas perfeitas!",    sub:"Gel · Fibra · Acrigel",           accent:"#ff4081" },
    { label:"Sobrancelha", emoji:"🙆", preco:"R$ 40",      frase:"Sobrancelha ideal!",  sub:"Design + Henna incluso",          accent:"#c87c4c" },
    { label:"Maquiagem",   emoji:"💄", preco:"R$ 60",      frase:"Realce sua beleza!",  sub:"Social · Noiva · Festa",          accent:"#e91e63" },
    { label:"Depilação",   emoji:"🌸", preco:"R$ 45",      frase:"Sem dor, sem pelos!", sub:"Cera · Laser · Definitiva",       accent:"#f48fb1" },
  ]},
  { id:"food", label:"🍔 Food", servicos: [
    { label:"Promoção",    emoji:"🍕", preco:"R$ 29,90",   frase:"Só hoje!",            sub:"Válido até meia-noite",           accent:"#ff6600" },
    { label:"Combo",       emoji:"🍔", preco:"R$ 24,90",   frase:"Combo especial!",     sub:"Lanche + Batata + Refri",         accent:"#ff4500" },
    { label:"Delivery",    emoji:"🛵", preco:"Frete GRÁTIS",frase:"Entrega gratuita!",  sub:"Pedido mínimo R$ 30",             accent:"#00e676" },
    { label:"Prato",       emoji:"🍽️",preco:"R$ 15,90",   frase:"Prato do dia!",       sub:"Completo · Inclui sobremesa",     accent:"#ffa500" },
    { label:"Açaí",        emoji:"🍇", preco:"R$ 12,90",   frase:"O melhor açaí!",      sub:"500ml · 30 sabores",              accent:"#7b1fa2" },
    { label:"Marmita",     emoji:"🥡", preco:"R$ 18,00",   frase:"Marmita saudável!",   sub:"Entregamos na sua empresa",       accent:"#4caf50" },
  ]},
  { id:"gym", label:"💪 Gym", servicos: [
    { label:"Matrícula",   emoji:"💪", preco:"R$ 79/mês",  frase:"Comece hoje!",        sub:"3 meses por preço de 2",          accent:"#ff4400" },
    { label:"Personal",    emoji:"🏋️",preco:"R$ 120/h",   frase:"Resultado garantido!",sub:"Treino personalizado",            accent:"#ff6600" },
    { label:"Plano",       emoji:"🥊", preco:"R$ 59/mês",  frase:"Sem contrato!",       sub:"Musculação + Funcional",          accent:"#ff8800" },
    { label:"Yoga",        emoji:"🧘", preco:"R$ 49/mês",  frase:"Equilíbrio total!",   sub:"Yoga · Pilates · Meditação",      accent:"#9c27b0" },
  ]},
  { id:"store", label:"🛍 Loja", servicos: [
    { label:"Oferta",      emoji:"🏷️",preco:"50% OFF",    frase:"Liquidação total!",   sub:"Só este fim de semana",           accent:"#f44336" },
    { label:"Lançamento",  emoji:"✨", preco:"Novidade!",  frase:"Chegou o novo!",      sub:"Exclusivo · Limitado",            accent:"#00d4ff" },
    { label:"Frete Grátis",emoji:"🚚", preco:"Frete GRÁTIS",frase:"Compre sem sair!",  sub:"Entrega em 24h",                  accent:"#00e676" },
    { label:"Promoção",    emoji:"🎁", preco:"R$ 49,90",   frase:"Imperdível!",         sub:"Últimas unidades",                accent:"#ff9800" },
  ]},
];
const SERVICOS_P = NICHOS_P[0].servicos;
const BGS_P = [
  { id:"transparent", label:"Transparente", bg:"transparent", extra:{} },
  { id:"neon",   label:"Neon",    bg:"#030b18", extra:{ backgroundImage:"linear-gradient(rgba(0,212,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.05) 1px,transparent 1px)", backgroundSize:"40px 40px" } },
  { id:"fire",   label:"🔥 Fire", bg:"#0c0300", extra:{ backgroundImage:"radial-gradient(ellipse at 50% 110%,rgba(255,80,0,.85),rgba(12,3,0,0) 65%)" } },
  { id:"dark",   label:"Dark",    bg:"#080808", extra:{} },
  { id:"gold",   label:"Gold",    bg:"#050505", extra:{ backgroundImage:"repeating-linear-gradient(45deg,rgba(201,168,76,.04) 0,rgba(201,168,76,.04) 1px,transparent 0,transparent 50%)", backgroundSize:"10px 10px" } },
  { id:"purple", label:"Roxo",    bg:"#080010", extra:{ backgroundImage:"radial-gradient(ellipse at 30% 30%,rgba(120,0,255,.3),transparent 60%)" } },
  { id:"green",  label:"Verde",   bg:"#010f06", extra:{ backgroundImage:"radial-gradient(ellipse at 50% 30%,rgba(0,200,83,.15),transparent 60%)" } },
  { id:"white",  label:"Branco",  bg:"#f0f0f0", extra:{} },
];

const mkPText  = (o={}) => ({ id:uid(), kind:"text",  x:60,  y:150, w:480, h:80, rotation:0, locked:false, text:"Texto", fontSize:48, color:"#ffffff", useGradient:false, gradientColor1:"#00d4ff", gradientColor2:"#c87cff", gradientAngle:135, fontFamily:"Barlow Condensed", fontWeight:"900", align:"left", letterSpacing:0, opacity:1, shadowColor:"#000000", shadowBlur:0, shadowX:0, shadowY:0, outline:false, outlineColor:"#000000", outlineWidth:2, ...o });
const mkPShape = (shape,o={}) => ({ id:uid(), kind:"shape", shape, x:100, y:100, w:200, h:80, rotation:0, locked:false, useGradient:false, fill:"#00d4ff", gradientColor1:"#00d4ff", gradientColor2:"#c87cff", gradientAngle:135, stroke:"transparent", strokeWidth:0, opacity:1, radius:8, ...o });
const mkPImage = (src,o={}) => ({ id:uid(), kind:"image", x:60, y:60, w:220, h:220, rotation:0, locked:false, src, opacity:1, radius:0, ...o });
const gradCSSP = e => `linear-gradient(${e.gradientAngle||135}deg,${e.gradientColor1||"#00d4ff"},${e.gradientColor2||"#c87cff"})`;

function defaultPEls(s, fH=600) {
  return [
    mkPShape("rect",  { x:0, y:fH-72, w:600, h:72, fill:"rgba(37,211,102,.18)", stroke:"rgba(37,211,102,.3)", strokeWidth:1, radius:0 }),
    mkPText({ x:44, y:18,    w:460, h:22,  text:"MAKER INFO · ASSISTÊNCIA TÉCNICA", fontSize:11, color:"rgba(0,212,255,.65)", letterSpacing:4, fontWeight:"700" }),
    mkPText({ x:44, y:52,    w:460, h:106, text:s.label.toUpperCase(), fontSize:88, color:"#ffffff", fontWeight:"900", letterSpacing:-2, shadowColor:s.accent, shadowBlur:30 }),
    mkPText({ x:44, y:170,   w:400, h:40,  text:s.frase, fontSize:28, color:"rgba(255,255,255,.75)", fontWeight:"500" }),
    mkPShape("line",  { x:44, y:222, w:180, h:3, fill:s.accent, radius:2 }),
    mkPText({ x:44, y:238,   w:360, h:98,  text:s.preco, fontSize:92, color:s.accent, fontWeight:"900", letterSpacing:-2, shadowColor:s.accent, shadowBlur:28 }),
    mkPText({ x:44, y:348,   w:320, h:28,  text:s.sub, fontSize:14, color:"rgba(255,255,255,.38)", letterSpacing:.5 }),
    mkPText({ x:44, y:388,   w:130, h:120, text:s.emoji, fontSize:108, color:"#fff", fontWeight:"900" }),
    mkPText({ x:44, y:fH-58, w:340, h:38,  text:"💬 (65) 9282-4709", fontSize:22, color:"#25d366", fontWeight:"900" }),
    mkPText({ x:44, y:fH-26, w:440, h:20,  text:"Várzea Grande · MT · Busca na sua porta", fontSize:10, color:"rgba(255,255,255,.22)", letterSpacing:2 }),
  ];
}

function PElView({ el }) {
  const rot=el.rotation?`rotate(${el.rotation}deg)`:undefined;
  const base={ position:"absolute", left:el.x, top:el.y, width:el.w, opacity:el.opacity??1, transform:rot, transformOrigin:"center center", pointerEvents:"none", userSelect:"none" };
  if(el.kind==="image") return <div style={{...base,height:el.h,overflow:"hidden",borderRadius:el.radius||0}}><img src={el.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} crossOrigin="anonymous"/></div>;
  if(el.kind==="shape"){
    const bg=el.useGradient?gradCSSP(el):el.fill; const sh={...base,height:el.h};
    if(el.shape==="rect")   return <div style={{...sh,background:bg,border:`${el.strokeWidth||0}px solid ${el.stroke}`,borderRadius:el.radius||0}}/>;
    if(el.shape==="circle") return <div style={{...sh,background:bg,border:`${el.strokeWidth||0}px solid ${el.stroke}`,borderRadius:"50%"}}/>;
    if(el.shape==="line")   return <div style={{...sh,background:bg,borderRadius:el.radius||0}}/>;
    if(el.shape==="triangle") return <div style={sh}><svg width={el.w} height={el.h} style={{position:"absolute",inset:0}}><defs><linearGradient id={`g${el.id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={el.gradientColor1||el.fill}/><stop offset="100%" stopColor={el.gradientColor2||el.fill}/></linearGradient></defs><polygon points={`${el.w/2},0 ${el.w},${el.h} 0,${el.h}`} fill={el.useGradient?`url(#g${el.id})`:el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth||0}/></svg></div>;
  }
  if(el.kind==="text"){
    const shadow=`${el.shadowX||0}px ${el.shadowY||0}px ${el.shadowBlur||0}px ${el.shadowColor||"transparent"}`;
    const outline=el.outline?{WebkitTextStroke:`${el.outlineWidth||2}px ${el.outlineColor||"#000"}`}:{};
    if(el.useGradient) return <div style={{...base,fontSize:el.fontSize,fontFamily:el.fontFamily,fontWeight:el.fontWeight,textAlign:el.align,letterSpacing:el.letterSpacing,lineHeight:1.08,whiteSpace:"pre-wrap",wordBreak:"break-word",background:gradCSSP(el),WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:`drop-shadow(${shadow})`,...outline}}>{el.text}</div>;
    return <div style={{...base,fontSize:el.fontSize,color:el.color,fontFamily:el.fontFamily,fontWeight:el.fontWeight,textAlign:el.align,letterSpacing:el.letterSpacing,lineHeight:1.08,whiteSpace:"pre-wrap",wordBreak:"break-word",textShadow:shadow,...outline}}>{el.text}</div>;
  }
  return null;
}

function PInlineEdit({ el, onDone }) {
  const ref=useRef(null); useEffect(()=>{if(ref.current){ref.current.focus();ref.current.select();}},[]);
  return <textarea ref={ref} defaultValue={el.text} onBlur={e=>onDone(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")onDone(el.text);if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onDone(e.target.value);}}} style={{position:"absolute",left:el.x,top:el.y,width:el.w,minHeight:el.h||60,fontSize:el.fontSize,color:el.useGradient?"#fff":el.color,fontFamily:el.fontFamily,fontWeight:el.fontWeight,textAlign:el.align,letterSpacing:el.letterSpacing,lineHeight:1.08,background:"rgba(0,212,255,.1)",border:"2px solid #00d4ff",borderRadius:4,outline:"none",resize:"none",padding:2,zIndex:50,boxSizing:"border-box",transform:el.rotation?`rotate(${el.rotation}deg)`:"none",transformOrigin:"center center"}}/>;
}

const P_HANDLES=[{id:"nw",cx:0,cy:0},{id:"n",cx:.5,cy:0},{id:"ne",cx:1,cy:0},{id:"e",cx:1,cy:.5},{id:"se",cx:1,cy:1},{id:"s",cx:.5,cy:1},{id:"sw",cx:0,cy:1},{id:"w",cx:0,cy:.5}];
const P_CURSORS={nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"};

function PInteractEl({ el, selected, multiSelected, onSelect, onUpdate, onEdit, scale, onSnapMove }) {
  const st=useRef({mode:null}); const wrapRef=useRef(null); const lastTap=useRef(0); const HS=16;
  const startDrag=(e)=>{ if(el.locked){onSelect(el.id,e);return;} e.stopPropagation();e.preventDefault();
    const now=Date.now(); if(el.kind==="text"&&now-lastTap.current<380){onEdit(el.id);return;} lastTap.current=now;
    onSelect(el.id,e);const p=getPoint(e);st.current={mode:"drag",sx:p.x,sy:p.y,ox:el.x,oy:el.y};bind(); };
  const startRes=(e,h)=>{e.stopPropagation();e.preventDefault();const p=getPoint(e);st.current={mode:"resize",h,sx:p.x,sy:p.y,ox:el.x,oy:el.y,ow:el.w,oh:el.h};bind();};
  const startRot=(e)=>{e.stopPropagation();e.preventDefault();const r=wrapRef.current?.getBoundingClientRect();if(!r)return;const cx=r.left+r.width/2,cy=r.top+r.height/2;const p=getPoint(e);st.current={mode:"rotate",cx,cy,sa:Math.atan2(p.y-cy,p.x-cx)*180/Math.PI,or:el.rotation||0};bind();};
  const onMove=useCallback((e)=>{const d=st.current;if(!d.mode)return;const p=getPoint(e);const dx=(p.x-d.sx)/scale,dy=(p.y-d.sy)/scale;
    if(d.mode==="drag"){const nx=Math.round(d.ox+dx),ny=Math.round(d.oy+dy);
      if(onSnapMove){onSnapMove(el.id,nx,ny,el.w,el.h||60);}else{onUpdate(el.id,{x:nx,y:ny});}}
    if(d.mode==="rotate"){const a=Math.atan2(p.y-d.cy,p.x-d.cx)*180/Math.PI;onUpdate(el.id,{rotation:Math.round((d.or+(a-d.sa)+360)%360)});}
    if(d.mode==="resize"){const h=d.h;let nx=d.ox,ny=d.oy,nw=d.ow,nh=d.oh;
      if(h.includes("e"))nw=Math.max(20,d.ow+dx);if(h.includes("s"))nh=Math.max(8,d.oh+dy);
      if(h.includes("w")){nw=Math.max(20,d.ow-dx);nx=d.ox+(d.ow-nw);}if(h.includes("n")){nh=Math.max(8,d.oh-dy);ny=d.oy+(d.oh-nh);}
      onUpdate(el.id,{x:Math.round(nx),y:Math.round(ny),w:Math.round(nw),h:Math.round(nh)});}
  },[el.id,el.w,el.h,scale,onUpdate,onSnapMove]);
  const onUp=useCallback(()=>{st.current.mode=null;unbind();},[]);
  const bind=()=>{window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onUp);};
  const unbind=()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  useEffect(()=>()=>unbind(),[]);
  const rot=el.rotation||0;
  const isAnySelected = selected||multiSelected;
  return <div ref={wrapRef} style={{position:"absolute",left:el.x,top:el.y,width:el.w,height:el.h||60,cursor:el.locked?"default":el.kind==="text"?"text":"move",outline:selected?"2px dashed rgba(0,212,255,.9)":multiSelected?"2px dashed rgba(200,119,255,.8)":"2px solid transparent",boxSizing:"border-box",transform:rot?`rotate(${rot}deg)`:"none",transformOrigin:"center center",touchAction:"none"}} onMouseDown={startDrag} onTouchStart={startDrag}>
    <PElView el={{...el,x:0,y:0}}/>
    {selected&&!el.locked&&<>{P_HANDLES.map(h=><div key={h.id} onMouseDown={e=>startRes(e,h.id)} onTouchStart={e=>startRes(e,h.id)} style={{position:"absolute",width:HS,height:HS,background:"#00d4ff",border:"2px solid #fff",borderRadius:3,zIndex:10,boxShadow:"0 0 8px rgba(0,212,255,.9)",left:`calc(${h.cx*100}% - ${HS/2}px)`,top:`calc(${h.cy*100}% - ${HS/2}px)`,cursor:P_CURSORS[h.id],touchAction:"none"}}/>)}
      <div onMouseDown={startRot} onTouchStart={startRot} style={{position:"absolute",width:22,height:22,background:"#f5c518",border:"2px solid #fff",borderRadius:"50%",top:-36,left:"50%",transform:"translateX(-50%)",cursor:"crosshair",zIndex:11,boxShadow:"0 0 10px rgba(245,197,24,.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,touchAction:"none"}}>↻</div>
      <div style={{position:"absolute",width:2,height:22,background:"rgba(245,197,24,.4)",top:-16,left:"50%",transform:"translateX(-50%)",zIndex:10,pointerEvents:"none"}}/>
      {el.kind==="text"&&<div style={{position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",fontSize:9,color:"rgba(0,212,255,.7)",background:"rgba(0,0,0,.65)",padding:"2px 7px",borderRadius:3,whiteSpace:"nowrap",pointerEvents:"none"}}>2× para editar</div>}
    </>}
    {selected&&el.locked&&<div style={{position:"absolute",top:-20,right:0,fontSize:9,color:"#f5c518",background:"rgba(0,0,0,.7)",padding:"2px 6px",borderRadius:3}}>🔒</div>}
  </div>;
}

function pHistReducer(s,a){
  if(a.type==="SET") return{past:[...s.past,s.present].slice(-60),present:a.p,future:[]};
  if(a.type==="UNDO"&&s.past.length){const past=[...s.past];const p=past.pop();return{past,present:p,future:[s.present,...s.future]};}
  if(a.type==="REDO"&&s.future.length){const[p,...future]=s.future;return{past:[...s.past,s.present],present:p,future};}
  return s;
}

const PTPL_BUILDERS = [
  { id:"blank",  label:"Em branco", emoji:"", mk:()=>({bg:"transparent",els:[]}) },
  { id:"neon",   label:"⚡ Neon",   mk:(s,h)=>({bg:"neon",   els:defaultPEls(s,h)}) },
  { id:"fire",   label:"🔥 Fire",   mk:(s,h)=>({bg:"fire",   els:defaultPEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#fff",shadowColor:"#ff4400"}:e.kind==="text"&&e.text===s.label.toUpperCase()?{...e,color:"#ffaa00",shadowColor:"#ff4400"}:e.kind==="shape"&&e.shape==="line"?{...e,fill:"#ff6000"}:e)}) },
  { id:"gold",   label:"🥇 Gold",   mk:(s,h)=>({bg:"gold",   els:defaultPEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#c9a84c",shadowColor:"#c9a84c"}:e.kind==="shape"&&e.shape==="line"?{...e,fill:"#c9a84c"}:e)}) },
  { id:"grad",   label:"🌈 Grad",   mk:(s,h)=>({bg:"dark",   els:defaultPEls(s,h).map(e=>e.kind==="text"&&(e.text===s.preco||e.text===s.label.toUpperCase())?{...e,useGradient:true,gradientColor1:"#00d4ff",gradientColor2:"#c87cff"}:e)}) },
  { id:"purple", label:"💜 Roxo",   mk:(s,h)=>({bg:"purple", els:defaultPEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#c87cff",shadowColor:"#9000ff"}:e)}) },
];

function PostEditor({ onSwitch, onHome }) {
  const isMobile = useMobile();
  const [si, setSi]           = useState(0);
  const [nichoIdx, setNichoIdx] = useState(0);
  const [bgId, setBgId]       = useState("transparent");
  const [fmtId, setFmtId]     = useState("sq");
  const [bgPhoto, setBgPhoto] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(0.25);
  const [selId, setSelId]     = useState(null);
  const [multiSelIds, setMultiSelIds] = useState([]); // multiple selection
  const [snapGuides, setSnapGuides] = useState([]); // [{x?:n, y?:n}]
  const [editId, setEditId]   = useState(null);
  const [panel, setPanel]     = useState("templates");
  const [saving, setSaving]   = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [savedTpls, setSavedTpls] = useState([]);
  const [saveName, setSaveName]   = useState("");
  const [showSave, setShowSave]   = useState(false);
  const [activeTplId, setActiveTplId] = useState("blank");
  const posterRef = useRef(null);

  useScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

  useEffect(()=>{
    const p=e=>{if(e.target.closest("[data-canvas]"))e.preventDefault();};
    document.addEventListener("touchmove",p,{passive:false});
    return()=>document.removeEventListener("touchmove",p);
  },[]);

  const fmt=FORMATS_P.find(f=>f.id===fmtId); const FW=fmt.w,FH=fmt.h;
  const currentServicos = NICHOS_P[nichoIdx]?.servicos || NICHOS_P[0].servicos;
  const s = currentServicos[si] || currentServicos[0];
  const bg=BGS_P.find(b=>b.id===bgId);

  const [hist,dispatch]=useReducer(pHistReducer,{past:[],present:[],future:[]});
  const els=hist.present;
  const setEls=useCallback((fn)=>{const next=typeof fn==="function"?fn(hist.present):fn;dispatch({type:"SET",p:next});},[hist.present]);
  const undo=()=>dispatch({type:"UNDO"}); const redo=()=>dispatch({type:"REDO"});

  useEffect(()=>{
    const h=e=>{const tag=e.target.tagName;if(tag==="INPUT"||tag==="TEXTAREA")return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();undo();}
      if((e.metaKey||e.ctrlKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();redo();}
      if((e.key==="Delete"||e.key==="Backspace")&&selId&&!editId){setEls(p=>p.filter(e=>e.id!==selId));setSelId(null);}
      if((e.key==="Delete"||e.key==="Backspace")&&multiSelIds.length>0&&!editId){deleteMultiSel();}
      if((e.metaKey||e.ctrlKey)&&e.key==="d"&&selId){e.preventDefault();duplicate();}
      if(e.key==="Escape"&&editId)setEditId(null);
      if(e.key==="Escape"&&multiSelIds.length>0){setMultiSelIds([]);}
      // Arrow keys to nudge selected element
      if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)&&selId&&!editId){
        e.preventDefault();
        const d=e.shiftKey?10:1;
        const dx=e.key==="ArrowLeft"?-d:e.key==="ArrowRight"?d:0;
        const dy=e.key==="ArrowUp"?-d:e.key==="ArrowDown"?d:0;
        onUpdate(selId,{x:(els.find(el=>el.id===selId)?.x||0)+dx,y:(els.find(el=>el.id===selId)?.y||0)+dy});
      }};
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[selId,editId,multiSelIds,els]);

  const sel=els.find(e=>e.id===selId);
  const onUpdate=useCallback((id,patch)=>setEls(p=>p.map(e=>e.id===id?{...e,...patch}:e)),[setEls]);

  // Shift+click = multi select
  const handleSelect=(id,e)=>{
    if(e?.shiftKey){
      setMultiSelIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
      setSelId(null);
    } else {
      setSelId(id); setMultiSelIds([]); setPanel("props");
    }
  };

  // Snap guides — snaps to canvas edges, center, and other elements
  const SNAP_DIST = 8;
  const handleSnapMove=(id,nx,ny,nw,nh)=>{
    const others=els.filter(e=>e.id!==id&&!e.locked);
    const cx=FW/2, cy=FH/2;
    const snapXs=[0,cx,FW,...others.flatMap(o=>[o.x,o.x+o.w/2,o.x+o.w])];
    const snapYs=[0,cy,FH,...others.flatMap(o=>[o.y,o.y+(o.h||60)/2,o.y+(o.h||60)])];
    let fx=nx, fy=ny; const guides=[];
    // Check left, center, right edges of element
    const elXs=[[nx,0],[nx+nw/2,-nw/2],[nx+nw,-nw]];
    for(const [ex,off] of elXs){
      const snap=snapXs.find(s=>Math.abs(s-ex)<SNAP_DIST/viewScale);
      if(snap!==undefined){fx=snap+off;guides.push({x:snap});break;}
    }
    const elYs=[[ny,0],[ny+nh/2,-nh/2],[ny+nh,-nh]];
    for(const [ey,off] of elYs){
      const snap=snapYs.find(s=>Math.abs(s-ey)<SNAP_DIST/viewScale);
      if(snap!==undefined){fy=snap+off;guides.push({y:snap});break;}
    }
    setSnapGuides(guides);
    onUpdate(id,{x:Math.round(fx),y:Math.round(fy)});
    // Also move multiSelected elements together
    if(multiSelIds.length>0&&!multiSelIds.includes(id)){
      const dx=Math.round(fx)-nx, dy=Math.round(fy)-ny;
      multiSelIds.forEach(mid=>setEls(p=>p.map(e=>e.id===mid?{...e,x:e.x+dx,y:e.y+dy}:e)));
    }
    setTimeout(()=>setSnapGuides([]),600);
  };

  // Move multiSel elements together
  const moveMultiSel=(dx,dy)=>{
    setEls(p=>p.map(e=>multiSelIds.includes(e.id)?{...e,x:e.x+dx,y:e.y+dy}:e));
  };
  const deleteMultiSel=()=>{
    setEls(p=>p.filter(e=>!multiSelIds.includes(e.id)));
    setMultiSelIds([]);
  };

  const loadTemplate=tpl=>{const result=tpl.mk(s,FH);setBgId(result.bg||"transparent");setEls(result.els.map(e=>({...e,id:uid()})));setSelId(null);setEditId(null);setActiveTplId(tpl.id);setPanel("layers");};
  const addText=()=>{const e=mkPText({x:60,y:120});setEls(p=>[...p,e]);setSelId(e.id);setPanel("props");};
  const addShape=sh=>{const d=sh==="circle"?{w:120,h:120}:sh==="line"?{w:200,h:4}:sh==="triangle"?{w:100,h:86}:{};const e=mkPShape(sh,{x:80,y:80,...d});setEls(p=>[...p,e]);setSelId(e.id);setPanel("props");};
  const addImg=src=>{const e=mkPImage(src);setEls(p=>[...p,e]);setSelId(e.id);setPanel("props");};
  const duplicate=()=>{if(!sel)return;const c={...sel,id:uid(),x:sel.x+16,y:sel.y+16};setEls(p=>[...p,c]);setSelId(c.id);};
  const deleteEl=()=>{if(!selId)return;setEls(p=>p.filter(e=>e.id!==selId));setSelId(null);setPanel("layers");};
  const toggleLock=()=>{if(!sel)return;onUpdate(selId,{locked:!sel.locked});};
  const moveLayer=dir=>{setEls(p=>{const i=p.findIndex(e=>e.id===selId);if(i<0)return p;const a=[...p];if(dir==="up"&&i<a.length-1)[a[i],a[i+1]]=[a[i+1],a[i]];if(dir==="down"&&i>0)[a[i],a[i-1]]=[a[i-1],a[i]];return a;});};
  const doAlign=mode=>{if(!sel)return;const h=sel.h||60;const patch=mode==="left"?{x:0}:mode==="right"?{x:FW-sel.w}:mode==="centerH"?{x:Math.round((FW-sel.w)/2)}:mode==="top"?{y:0}:mode==="bottom"?{y:FH-h}:{y:Math.round((FH-h)/2)};onUpdate(selId,patch);};
  const changeFmt=id=>{const nf=FORMATS_P.find(f=>f.id===id);const r=nf.h/FH;setFmtId(id);setEls(p=>p.map(e=>({...e,y:Math.round(e.y*r)})));};
  const saveTpl=()=>{if(!saveName.trim())return;const t={id:uid(),name:saveName.trim(),bgId,fmtId,els:JSON.parse(JSON.stringify(els))};setSavedTpls(p=>[...p,t]);setSaveName("");setShowSave(false);};
  const loadTpl=t=>{setBgId(t.bgId);setFmtId(t.fmtId);setEls(t.els.map(e=>({...e,id:uid()})));setSelId(null);};
  // 🎨 Add SVG Icon as image element via inline SVG data URL
  const addIcon=(icon,color="#ffffff")=>{
    const svgStr=icon.svg.replace(/currentColor/g,color);
    const blob=`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" ${svgStr.slice(4)}`)))}`;
    const e=mkPImage(blob,{w:80,h:80,x:Math.round(FW/2-40),y:Math.round(FH/2-40)});
    setEls(p=>[...p,e]);setSelId(e.id);setPanel("props");
  };
  const handleBgPhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setBgPhoto(ev.target.result);r.readAsDataURL(f);};
  const handleImgEl=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>addImg(ev.target.result);r.readAsDataURL(f);};

  // 📱 Adicionar QR Code WhatsApp
  const addQRCode = () => {
    const wa = "https://wa.me/556592824709?text=Ol%C3%A1%2C+gostaria+de+fazer+um+or%C3%A7amento";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wa)}&bgcolor=030b18&color=25d366&qzone=1`;
    addImg(qrUrl);
  };

  // 💬 Adicionar Banner WhatsApp
  const [watermark, setWatermark] = useState(false);
  const addWhatsAppBanner = () => {
    const phone = prompt("Número do WhatsApp (só números):", "65992824709");
    if (!phone) return;
    const fmt = phone.replace(/\D/g,"").replace(/^(\d{2})(\d{5})(\d{4})$/,"($1) $2-$3");
    const bannerH = 76;
    setEls(p => [...p,
      mkPShape("rect",  { x:0, y:FH-bannerH, w:FW, h:bannerH, fill:"#25d366", radius:0 }),
      mkPText({ x:0, y:FH-bannerH+12, w:FW, h:52, text:`💬 Chama no WhatsApp!   ${fmt}`, fontSize:26, color:"#fff", fontWeight:"900", align:"center", shadowColor:"#00000044", shadowBlur:8 }),
    ]);
    toast("Banner WhatsApp adicionado!");
  };

  // ── Auto-save no localStorage ──
  const LS_KEY_POST = "makerinfo_post_v1";

  useEffect(()=>{
    try {
      const saved = localStorage.getItem(LS_KEY_POST);
      if(!saved) return;
      const d = JSON.parse(saved);
      if(d.bgId) setBgId(d.bgId);
      if(d.fmtId) setFmtId(d.fmtId);
      if(d.bgOpacity !== undefined) setBgOpacity(d.bgOpacity);
      if(d.els?.length) setEls(d.els.map(e=>({...e,id:uid()})));
      setSelId(null);
    } catch {}
  },[]);

  useEffect(()=>{
    try {
      const data = { bgId, fmtId, bgOpacity, els: JSON.parse(JSON.stringify(els)) };
      localStorage.setItem(LS_KEY_POST, JSON.stringify(data));
    } catch {}
  },[bgId, fmtId, bgOpacity, els]);

  const clearPostSession = () => {
    localStorage.removeItem(LS_KEY_POST);
    setBgId("gradient-1"); setFmtId("square");
    setEls([]); setSelId(null);
    toast("Sessão limpa.", "info");
  };

  // 📦 Exportar todos os formatos de uma vez
  const exportAll = async () => {
    const h2c=window.html2canvas; if(!h2c){alert("Aguarde.");return;}
    setExportingAll(true); setSelId(null); setEditId(null);
    await new Promise(r=>setTimeout(r,150));
    for (const fmt of FORMATS_P) {
      // Temporarily rescale
      const origFmt = fmtId;
      const label = fmt.label.replace(/[^a-z0-9]/gi,"-").toLowerCase();
      // Export current format
      try {
        const canvas = await h2c(posterRef.current,{scale:2,useCORS:true,allowTaint:true,backgroundColor:null,logging:false});
        const link=document.createElement("a"); link.download=`maker-info-${s.label.toLowerCase()}-${label}.png`;
        link.href=canvas.toDataURL("image/png"); link.click();
        await new Promise(r=>setTimeout(r,300));
      } catch(err){console.error(err);}
    }
    setExportingAll(false);
  };

  const handleSave=async()=>{if(!posterRef.current)return;setSaving(true);try{const h2c=window.html2canvas;if(!h2c){toast("Aguarde o carregamento...","info");setSaving(false);return;}setSelId(null);setEditId(null);await new Promise(r=>setTimeout(r,150));const canvas=await h2c(posterRef.current,{scale:2,useCORS:true,allowTaint:true,backgroundColor:null,logging:false});if(watermark){const ctx=canvas.getContext("2d");const fs=Math.round(canvas.width*0.022);ctx.font=`bold ${fs}px 'Segoe UI',sans-serif`;ctx.fillStyle="rgba(255,255,255,0.35)";ctx.textAlign="right";ctx.fillText("by Maker Info",canvas.width-10,canvas.height-8);}const link=document.createElement("a");link.download=`maker-info-${s.label.toLowerCase().replace(/ /g,"-")}.png`;link.href=canvas.toDataURL("image/png");link.click();toast("PNG baixado!");}catch(err){console.error(err);toast("Erro ao exportar.","error");}setSaving(false);};

  const maxCanvasW = isMobile ? Math.min(window.innerWidth-16, 600) : Math.min(window.innerWidth-370, 680);
  const maxCanvasH = isMobile ? 320 : Math.min(window.innerHeight-180, 680);
  const viewScale = Math.min(maxCanvasW/FW, maxCanvasH/FH, 1.5);
  const cvW=Math.round(FW*viewScale), cvH=Math.round(FH*viewScale);

  const I={width:"100%",padding:"9px 11px",borderRadius:7,fontSize:12,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",color:"#fff",outline:"none",boxSizing:"border-box"};
  const L=(c="#00d4ff")=>({fontSize:8,color:c,letterSpacing:3,display:"block",marginBottom:4,textTransform:"uppercase"});
  const iB=(on,c="#00d4ff",full=false)=>({padding:"8px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,background:on?`${c}22`:"rgba(255,255,255,.04)",border:on?`1px solid ${c}66`:"1px solid rgba(255,255,255,.06)",color:on?c:"#3a4060",...(full?{width:"100%"}:{})});
  const tabS=t=>({flex:1,padding:"8px 3px",borderRadius:7,cursor:"pointer",fontSize:9,fontWeight:700,background:panel===t?"rgba(0,212,255,.18)":"rgba(255,255,255,.03)",border:panel===t?"1px solid rgba(0,212,255,.45)":"1px solid rgba(255,255,255,.05)",color:panel===t?"#00d4ff":"#3a4060"});
  const bgStyle=bgId==="transparent"?{backgroundImage:"linear-gradient(45deg,#141428 25%,transparent 25%),linear-gradient(-45deg,#141428 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#141428 75%),linear-gradient(-45deg,transparent 75%,#141428 75%)",backgroundSize:"20px 20px",backgroundPosition:"0 0,0 10px,10px -10px,-10px 0",backgroundColor:"#0d0d20"}:{background:bg?.bg||"#030b18",...(bg?.extra||{})};

  return (
    <div style={{height:"100dvh",background:"#060a14",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#fff",WebkitTapHighlightColor:"transparent",overscrollBehavior:"none",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Top bar */}
      <div style={{position:"sticky",top:0,zIndex:200,background:"rgba(6,10,20,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
        <button onClick={onHome} style={{padding:"7px 12px",borderRadius:7,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#aaa",fontSize:11,fontWeight:700,cursor:"pointer"}}>🏠 Home</button>
        <button onClick={onSwitch} style={{padding:"7px 12px",borderRadius:7,background:"rgba(200,119,255,.1)",border:"1px solid rgba(200,119,255,.3)",color:"#c87cff",fontSize:11,fontWeight:700,cursor:"pointer"}}>📷 Fotos</button>
        <div style={{flex:1}}>
          <div style={{fontSize:8,color:"#00d4ff",letterSpacing:5}}>MAKER INFO</div>
          <div style={{fontSize:15,fontWeight:900}}>⚡ Editor de <span style={{color:"#00d4ff"}}>Posts</span></div>
        </div>
        <button onClick={undo} disabled={!hist.past.length}   style={{...iB(hist.past.length>0),   padding:"8px 12px",fontSize:15}} title="Ctrl+Z">↩</button>
        <button onClick={redo} disabled={!hist.future.length} style={{...iB(hist.future.length>0), padding:"8px 12px",fontSize:15}} title="Ctrl+Y">↪</button>
        <button onClick={clearPostSession} style={{padding:"8px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,background:"rgba(255,80,80,.07)",border:"1px solid rgba(255,80,80,.18)",color:"rgba(255,140,140,.7)"}} title="Nova edição">🗑 Nova</button>
        {!isMobile && <button onClick={exportAll} disabled={exportingAll} style={{padding:"8px 14px",borderRadius:7,cursor:exportingAll?"wait":"pointer",fontSize:11,fontWeight:700,background:exportingAll?"#1a2030":"rgba(0,230,118,.12)",border:"1px solid rgba(0,230,118,.3)",color:exportingAll?"#444":"#00e676"}}>{exportingAll?"⏳ Exportando...":"📦 Todos formatos"}</button>}
        <button onClick={handleSave} disabled={saving} style={{padding:"9px 16px",borderRadius:8,cursor:saving?"wait":"pointer",fontSize:12,fontWeight:900,background:saving?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)",border:"none",color:saving?"#444":"#000",boxShadow:saving?"none":"0 0 18px rgba(0,212,255,.3)"}}>
          {saving?"⏳":"⬇️"} PNG
        </button>
      </div>

      <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:14,padding:isMobile?"10px 8px":"14px",alignItems:"flex-start",justifyContent:"center",flex:1,overflowY:"auto",minHeight:0}}>
        {/* Canvas column */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
            {FORMATS_P.map(f=><button key={f.id} onClick={()=>changeFmt(f.id)} style={{...iB(fmtId===f.id),padding:"5px 10px",fontSize:10}}>{f.label}</button>)}
          </div>
          {/* Nicho selector */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
            {NICHOS_P.map((n,ni)=>(
              <button key={n.id} onClick={()=>{setNichoIdx(ni);setSi(0);}} style={{padding:"5px 10px",borderRadius:14,cursor:"pointer",fontSize:10,fontWeight:700,background:nichoIdx===ni?"rgba(0,212,255,.18)":"rgba(255,255,255,.04)",border:nichoIdx===ni?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.06)",color:nichoIdx===ni?"#00d4ff":"#3a4060"}}>{n.label}</button>
            ))}
          </div>
          {/* Service selector */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
            {currentServicos.map((sv,i)=>(
              <button key={i} onClick={()=>setSi(i)} style={{padding:"5px 9px",borderRadius:14,cursor:"pointer",fontSize:12,fontWeight:700,background:si===i?"rgba(0,212,255,.15)":"rgba(255,255,255,.03)",border:si===i?`1px solid ${sv.accent}`:"1px solid rgba(255,255,255,.05)",color:si===i?sv.accent:"#3a4060"}} title={sv.label}>{sv.emoji}</button>
            ))}
          </div>

          <div style={{position:"relative"}}>
            <div data-canvas="1" style={{width:cvW,height:cvH,position:"relative",borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,.1)",boxShadow:"0 8px 40px rgba(0,0,0,.8)",touchAction:"none",WebkitUserSelect:"none"}}>
              <div style={{transform:`scale(${viewScale})`,transformOrigin:"top left",width:FW,height:FH,position:"absolute"}}>
                <div ref={posterRef} onClick={()=>{setSelId(null);setEditId(null);setMultiSelIds([]);}} style={{width:FW,height:FH,position:"relative",overflow:"hidden",...bgStyle}}>
                  {bgPhoto&&<div style={{position:"absolute",inset:0,backgroundImage:`url(${bgPhoto})`,backgroundSize:"cover",backgroundPosition:"center",opacity:bgOpacity,pointerEvents:"none"}}/>}
                  {/* Snap guides */}
                  {snapGuides.map((g,i)=>(g.x!==undefined
                    ?<div key={i} style={{position:"absolute",left:g.x,top:0,width:1,height:"100%",background:"rgba(0,212,255,.85)",pointerEvents:"none",zIndex:999}}/>
                    :<div key={i} style={{position:"absolute",top:g.y,left:0,height:1,width:"100%",background:"rgba(0,212,255,.85)",pointerEvents:"none",zIndex:999}}/>
                  ))}
                  {els.map(el=>(editId===el.id&&el.kind==="text"?<PInlineEdit key={el.id} el={el} onDone={val=>{onUpdate(el.id,{text:val});setEditId(null);}}/>:<PInteractEl key={el.id} el={el} selected={selId===el.id} multiSelected={multiSelIds.includes(el.id)} onSelect={handleSelect} onEdit={id=>{setSelId(id);setEditId(id);setMultiSelIds([]);}} onUpdate={onUpdate} scale={viewScale} onSnapMove={handleSnapMove}/>))}
                  {els.length===0&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{fontSize:40,opacity:.25,marginBottom:10}}>✦</div><div style={{fontSize:12,color:"rgba(255,255,255,.2)",textAlign:"center"}}>Canvas em branco<br/><span style={{fontSize:10}}>Escolha um template ou adicione elementos</span></div></div>}
                </div>
              </div>
            </div>
            {bgId==="transparent"&&<div style={{position:"absolute",top:8,left:8,fontSize:9,color:"rgba(255,255,255,.35)",background:"rgba(0,0,0,.5)",padding:"2px 7px",borderRadius:4,pointerEvents:"none"}}>🔲 Transparente</div>}
          </div>

          {/* Multi-select action bar */}
          {multiSelIds.length>0&&(
            <div style={{display:"flex",gap:6,alignItems:"center",padding:"8px 12px",borderRadius:9,background:"rgba(200,119,255,.1)",border:"1px solid rgba(200,119,255,.3)",flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:"#c87cff",fontWeight:700}}>✦ {multiSelIds.length} selecionados</span>
              <button onClick={()=>moveMultiSel(-8,0)} style={{...iB(false,"#c87cff"),padding:"5px 8px",fontSize:12}}>←</button>
              <button onClick={()=>moveMultiSel(8,0)}  style={{...iB(false,"#c87cff"),padding:"5px 8px",fontSize:12}}>→</button>
              <button onClick={()=>moveMultiSel(0,-8)} style={{...iB(false,"#c87cff"),padding:"5px 8px",fontSize:12}}>↑</button>
              <button onClick={()=>moveMultiSel(0,8)}  style={{...iB(false,"#c87cff"),padding:"5px 8px",fontSize:12}}>↓</button>
              <button onClick={()=>{const copies=multiSelIds.map(id=>{const e=els.find(x=>x.id===id);return e?{...e,id:uid(),x:e.x+16,y:e.y+16}:null}).filter(Boolean);setEls(p=>[...p,...copies]);setMultiSelIds(copies.map(c=>c.id));}} style={{...iB(false,"#00d4ff"),padding:"5px 8px",fontSize:11}}>⧉ Duplicar</button>
              <button onClick={deleteMultiSel} style={{...iB(false,"#ff4444"),padding:"5px 8px",fontSize:11}}>🗑 Apagar</button>
              <button onClick={()=>setMultiSelIds([])} style={{...iB(false),padding:"5px 8px",fontSize:11}}>✕ Limpar</button>
              <span style={{fontSize:9,color:"#3a4060",marginLeft:"auto"}}>Shift+clique para adicionar/remover</span>
            </div>
          )}
          <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center"}}>
            <button onClick={addText} style={{...iB(false,"#00d4ff")}}>＋ Texto</button>
            <button onClick={()=>addShape("rect")}     style={{...iB(false,"#c87cff")}}>▭</button>
            <button onClick={()=>addShape("circle")}   style={{...iB(false,"#00e676")}}>◯</button>
            <button onClick={()=>addShape("line")}     style={{...iB(false,"#ff9800")}}>—</button>
            <button onClick={()=>addShape("triangle")} style={{...iB(false,"#ff4081")}}>△</button>
            <label style={{...iB(false,"#f5c518"),cursor:"pointer"}}>🖼 Img<input type="file" accept="image/*" onChange={handleImgEl} style={{display:"none"}}/></label>
            <button onClick={addWhatsAppBanner} style={{...iB(false,"#25d366"),padding:"8px 10px",fontSize:11,fontWeight:700}} title="Adicionar Banner WhatsApp">💬 WA Banner</button>
            <button onClick={addQRCode} style={{...iB(false,"#25d366"),padding:"8px 10px",fontSize:11,fontWeight:700}} title="Adicionar QR Code do WhatsApp">📲 QR</button>
            <label style={{...iB(false,"rgba(180,180,180,.4)"),cursor:"pointer"}}>📷 Fundo<input type="file" accept="image/*" onChange={handleBgPhoto} style={{display:"none"}}/></label>
            {bgPhoto&&<button onClick={()=>setBgPhoto(null)} style={{...iB(false,"#ff4444")}}>✕ Fundo</button>}
            <button onClick={()=>setWatermark(w=>!w)} style={{...iB(watermark,"#888"),padding:"8px 10px",fontSize:10}} title="Marca d'água Maker Info">{watermark?"🔏 Marca ON":"🔓 Marca OFF"}</button>
          </div>
          <div style={{fontSize:9,color:"#1a2840",textAlign:"center"}}>Clique · Arraste · 🟡 rotacionar · 2× clique p/ editar texto</div>
        </div>

        {/* Panel column */}
        <div style={{flex:1,minWidth:0,maxWidth:isMobile?"100%":310}}>
          <div style={{display:"flex",gap:3,marginBottom:8}}>
            {[["templates","📦 Tpl"],["layers","🗂 Cam"],["props","✏️ Edit"],["bg","🎨 BG"],["icons","🔮 Ícones"]].map(([t,l])=>(
              <button key={t} style={tabS(t)} onClick={()=>setPanel(t)}>{l}</button>
            ))}
          </div>

          {panel==="templates"&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:10}}>
              <div style={{fontSize:8,color:"#00d4ff",letterSpacing:3,marginBottom:10}}>TEMPLATES</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
                {PTPL_BUILDERS.map(tpl=>(
                  <button key={tpl.id} onClick={()=>loadTemplate(tpl)} style={{padding:"12px 6px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:700,background:activeTplId===tpl.id?"rgba(0,212,255,.15)":"rgba(255,255,255,.04)",border:activeTplId===tpl.id?"2px solid rgba(0,212,255,.5)":"2px solid rgba(255,255,255,.06)",color:activeTplId===tpl.id?"#00d4ff":"#888"}}>
                    {tpl.label}
                  </button>
                ))}
              </div>
              {savedTpls.length>0&&<><div style={{fontSize:8,color:"rgba(245,197,24,.7)",letterSpacing:3,marginBottom:6}}>MEUS TEMPLATES</div>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                  {savedTpls.map(t=><div key={t.id} style={{display:"flex",gap:5}}>
                    <button onClick={()=>loadTpl(t)} style={{flex:1,padding:"8px 10px",borderRadius:6,cursor:"pointer",fontSize:11,background:"rgba(245,197,24,.1)",border:"1px solid rgba(245,197,24,.2)",color:"#f5c518",textAlign:"left",fontWeight:700}}>⭐ {t.name}</button>
                    <button onClick={()=>setSavedTpls(p=>p.filter(x=>x.id!==t.id))} style={{padding:"8px 10px",borderRadius:6,cursor:"pointer",background:"rgba(255,60,60,.08)",border:"1px solid rgba(255,60,60,.15)",color:"#ff4444"}}>✕</button>
                  </div>)}
                </div></>}
              {!showSave?<button onClick={()=>setShowSave(true)} style={{...iB(false,"#f5c518",true),padding:"10px"}}>💾 Salvar layout atual</button>
                :<div style={{background:"rgba(245,197,24,.06)",border:"1px solid rgba(245,197,24,.2)",borderRadius:7,padding:8}}>
                  <div style={{display:"flex",gap:5}}><input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Nome..." style={{...I,flex:1}} onKeyDown={e=>e.key==="Enter"&&saveTpl()}/><button onClick={saveTpl} style={{padding:"8px 12px",borderRadius:6,background:"rgba(245,197,24,.2)",border:"1px solid rgba(245,197,24,.4)",color:"#f5c518",fontWeight:900,cursor:"pointer"}}>✓</button><button onClick={()=>setShowSave(false)} style={{padding:"8px 10px",borderRadius:6,background:"none",border:"1px solid rgba(255,255,255,.06)",color:"#444",cursor:"pointer"}}>✕</button></div>
                </div>}
            </div>
          )}

          {panel==="layers"&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:10}}>
              <div style={{fontSize:8,color:"#00d4ff",letterSpacing:3,marginBottom:8}}>CAMADAS</div>
              {els.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#2a3050",fontSize:12}}>Canvas vazio. Adicione elementos acima.</div>}
              <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:320,overflowY:"auto"}}>
                {[...els].reverse().map(el=>(
                  <div key={el.id} onClick={()=>{setSelId(el.id);setPanel("props");}} style={{padding:"9px 11px",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:selId===el.id?"rgba(0,212,255,.14)":"rgba(255,255,255,.04)",border:selId===el.id?"1px solid rgba(0,212,255,.4)":"1px solid rgba(255,255,255,.05)"}}>
                    <span style={{fontSize:14}}>{el.kind==="shape"?"⬛":el.kind==="image"?"🖼":"T"}</span>
                    <span style={{flex:1,fontSize:11,color:selId===el.id?"#00d4ff":"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{el.kind==="text"?el.text.substring(0,28):el.kind==="image"?"Imagem":el.shape}</span>
                    {el.locked&&<span style={{fontSize:10}}>🔒</span>}
                  </div>
                ))}
              </div>
              {selId&&<div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                <button onClick={duplicate}   style={{...iB(true,"#00d4ff"),flex:1}}>Dupl</button>
                <button onClick={toggleLock}  style={{...iB(sel?.locked,"#f5c518"),flex:1}}>{sel?.locked?"🔓":"🔒"}</button>
                <button onClick={()=>moveLayer("up")}   style={{...iB(true),flex:1}}>↑</button>
                <button onClick={()=>moveLayer("down")} style={{...iB(true),flex:1}}>↓</button>
                <button onClick={deleteEl}    style={{...iB(true,"#ff4444"),flex:1}}>🗑</button>
              </div>}
            </div>
          )}

          {panel==="props"&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:10}}>
              {!sel?<div style={{textAlign:"center",padding:"30px 0",color:"#2a3050",fontSize:12}}>Selecione um elemento no canvas</div>:<>
                <div style={{fontSize:8,color:"#00d4ff",letterSpacing:3,marginBottom:10}}>✏️ {sel.kind.toUpperCase()}</div>
                <div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={L()}>Rotação</span><span style={{fontSize:10,color:"#00d4ff"}}>{sel.rotation||0}°</span></div><input type="range" min="0" max="359" value={sel.rotation||0} onChange={e=>onUpdate(selId,{rotation:Number(e.target.value)})} style={{width:"100%"}}/></div>
                {sel.kind==="text"&&<>
                  <div style={{marginBottom:8}}><span style={L()}>Texto</span><textarea value={sel.text} onChange={e=>onUpdate(selId,{text:e.target.value})} style={{...I,height:52,resize:"vertical"}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                    <div><span style={L()}>Tam.</span><select value={sel.fontSize} onChange={e=>onUpdate(selId,{fontSize:Number(e.target.value)})} style={I}>{FSIZES_P.map(f=><option key={f} value={f}>{f}px</option>)}</select></div>
                    <div><span style={L()}>Peso</span><select value={sel.fontWeight} onChange={e=>onUpdate(selId,{fontWeight:e.target.value})} style={I}>{["400","500","700","900"].map(w=><option key={w} value={w}>{w}</option>)}</select></div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <span style={L("rgba(0,212,255,.8)")}>Fonte — {FONTS_ANUNCIO.length} fontes</span>
                    <div style={{display:"flex",flexDirection:"column",gap:3,maxHeight:180,overflowY:"auto"}}>
                      {FONTS_ANUNCIO.map(f=>(
                        <button key={f.name+f.cat} onClick={()=>onUpdate(selId,{fontFamily:f.name})}
                          style={{padding:"8px 10px",borderRadius:7,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",
                            background:sel.fontFamily===f.name?"rgba(0,212,255,.18)":"rgba(255,255,255,.03)",
                            border:sel.fontFamily===f.name?"1px solid rgba(0,212,255,.5)":"1px solid rgba(255,255,255,.05)"}}>
                          <span style={{fontFamily:f.name,fontSize:17,color:sel.fontFamily===f.name?"#00d4ff":"#ccc",letterSpacing:.5}}>{f.label}</span>
                          <span style={{fontSize:8,color:"#2a3060",flexShrink:0}}>{f.cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                    <div><span style={L()}>Alinhamento</span><select value={sel.align} onChange={e=>onUpdate(selId,{align:e.target.value})} style={I}><option value="left">Esq</option><option value="center">Centro</option><option value="right">Dir</option></select></div>
                    <div><span style={L()}>Espaç.</span><input type="number" value={sel.letterSpacing||0} onChange={e=>onUpdate(selId,{letterSpacing:Number(e.target.value)})} style={I}/></div>
                    <div><span style={L()}>Cor</span><input type="color" value={sel.color?.startsWith("rgba")?"#fff":sel.color||"#fff"} onChange={e=>onUpdate(selId,{color:e.target.value,useGradient:false})} style={{width:"100%",height:38,borderRadius:6,border:"1px solid rgba(255,255,255,.1)",cursor:"pointer",background:"none"}}/></div>
                  </div>
                  <div style={{marginBottom:8,background:"rgba(0,212,255,.05)",border:"1px solid rgba(0,212,255,.1)",borderRadius:7,padding:8}}>
                    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,marginBottom:sel.useGradient?8:0}}>
                      <input type="checkbox" checked={!!sel.useGradient} onChange={e=>onUpdate(selId,{useGradient:e.target.checked})} style={{width:15,height:15}}/>
                      <span style={{color:sel.useGradient?"#00d4ff":"#444",fontWeight:700}}>🌈 Gradiente</span>
                    </label>
                    {sel.useGradient&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px",gap:6}}>
                      <div><span style={L()}>Cor 1</span><input type="color" value={sel.gradientColor1||"#00d4ff"} onChange={e=>onUpdate(selId,{gradientColor1:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                      <div><span style={L()}>Cor 2</span><input type="color" value={sel.gradientColor2||"#c87cff"} onChange={e=>onUpdate(selId,{gradientColor2:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                      <div><span style={L()}>°</span><input type="number" value={sel.gradientAngle||135} onChange={e=>onUpdate(selId,{gradientAngle:Number(e.target.value)})} style={I}/></div>
                    </div>}
                  </div>
                  <div style={{marginBottom:8,background:"rgba(0,0,0,.2)",border:"1px solid rgba(255,255,255,.06)",borderRadius:7,padding:8}}>
                    <span style={{...L("rgba(255,180,80,.8)"),marginBottom:6}}>💫 Sombra</span>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      <div><span style={L()}>Cor</span><input type="color" value={sel.shadowColor?.startsWith("rgba")?"#000":sel.shadowColor||"#000"} onChange={e=>onUpdate(selId,{shadowColor:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                      <div><span style={L()}>Blur</span><input type="range" min="0" max="60" value={sel.shadowBlur||0} onChange={e=>onUpdate(selId,{shadowBlur:Number(e.target.value)})} style={{width:"100%",marginTop:8}}/></div>
                    </div>
                  </div>
                </>}
                {sel.kind==="shape"&&<>
                  <div style={{marginBottom:8,background:"rgba(0,212,255,.05)",border:"1px solid rgba(0,212,255,.1)",borderRadius:7,padding:8}}>
                    <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:11,marginBottom:sel.useGradient?8:0}}>
                      <input type="checkbox" checked={!!sel.useGradient} onChange={e=>onUpdate(selId,{useGradient:e.target.checked})} style={{width:15,height:15}}/>
                      <span style={{color:sel.useGradient?"#00d4ff":"#444",fontWeight:700}}>🌈 Gradiente</span>
                    </label>
                    {sel.useGradient?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 60px",gap:6}}>
                      <div><span style={L()}>Cor 1</span><input type="color" value={sel.gradientColor1||"#00d4ff"} onChange={e=>onUpdate(selId,{gradientColor1:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                      <div><span style={L()}>Cor 2</span><input type="color" value={sel.gradientColor2||"#c87cff"} onChange={e=>onUpdate(selId,{gradientColor2:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                      <div><span style={L()}>°</span><input type="number" value={sel.gradientAngle||135} onChange={e=>onUpdate(selId,{gradientAngle:Number(e.target.value)})} style={I}/></div>
                    </div>:<div><span style={L()}>Cor</span><input type="color" value={sel.fill?.startsWith("rgba")?"#00d4ff":sel.fill||"#00d4ff"} onChange={e=>onUpdate(selId,{fill:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                    <div><span style={L()}>Cor borda</span><input type="color" value={sel.stroke?.startsWith("rgba")?"#fff":sel.stroke||"#fff"} onChange={e=>onUpdate(selId,{stroke:e.target.value})} style={{width:"100%",height:36,borderRadius:5,border:"none"}}/></div>
                    <div><span style={L()}>Esp.</span><input type="number" value={sel.strokeWidth||0} onChange={e=>onUpdate(selId,{strokeWidth:Number(e.target.value)})} style={I}/></div>
                  </div>
                </>}
                {sel.kind==="image"&&<div style={{marginBottom:8}}><span style={L()}>Arredondamento</span><input type="number" value={sel.radius||0} onChange={e=>onUpdate(selId,{radius:Number(e.target.value)})} style={I}/></div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                  {[["X",sel.x,"x"],["Y",sel.y,"y"],["W",sel.w,"w"],["H",sel.h,"h"]].map(([l,v,k])=>(
                    <div key={k}><span style={L()}>{l}</span><input type="number" value={v||0} onChange={e=>onUpdate(selId,{[k]:Number(e.target.value)})} style={I}/></div>
                  ))}
                </div>
                <div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={L()}>Opacidade</span><span style={{fontSize:10,color:"#00d4ff"}}>{Math.round((sel.opacity??1)*100)}%</span></div><input type="range" min="0" max="1" step="0.05" value={sel.opacity??1} onChange={e=>onUpdate(selId,{opacity:Number(e.target.value)})} style={{width:"100%"}}/></div>
                <div style={{marginBottom:10}}><span style={L()}>Alinhar</span><div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3}}>{[["←","left"],["↔","centerH"],["→","right"],["↑","top"],["↕","centerV"],["↓","bottom"]].map(([ic,m])=><button key={m} onClick={()=>doAlign(m)} style={{...iB(false),padding:"7px 2px",fontSize:12,textAlign:"center"}}>{ic}</button>)}</div></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
                  <button onClick={duplicate}  style={{...iB(true,"#00d4ff",true)}}>Duplicar</button>
                  <button onClick={toggleLock} style={{...iB(sel?.locked,"#f5c518",true)}}>{sel?.locked?"🔓":"🔒"}</button>
                  <button onClick={deleteEl}   style={{...iB(true,"#ff4444",true)}}>🗑 Apagar</button>
                </div>
              </>}
            </div>
          )}

          {panel==="bg"&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:10}}>
              <span style={L()}>Fundo</span>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:12}}>
                {BGS_P.map(b=><button key={b.id} onClick={()=>setBgId(b.id)} style={{padding:"11px 6px",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,background:b.id==="transparent"?"transparent":b.bg,backgroundImage:b.id==="transparent"?"linear-gradient(45deg,#1a1a2e 25%,transparent 25%),linear-gradient(-45deg,#1a1a2e 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1a1a2e 75%),linear-gradient(-45deg,transparent 75%,#1a1a2e 75%)":undefined,backgroundSize:b.id==="transparent"?"10px 10px":undefined,backgroundPosition:b.id==="transparent"?"0 0,0 5px,5px -5px,-5px 0":undefined,border:bgId===b.id?"2px solid #00d4ff":"2px solid rgba(255,255,255,.07)",color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,.9)"}}>{b.label}</button>)}
              </div>
              <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:8,cursor:"pointer",fontSize:12,marginBottom:10,background:bgPhoto?"rgba(0,212,255,.1)":"rgba(255,255,255,.03)",border:bgPhoto?"1px solid rgba(0,212,255,.4)":"1px dashed rgba(255,255,255,.1)",color:bgPhoto?"#00d4ff":"#3a4060"}}>
                <span>📷</span><span>{bgPhoto?"✓ Foto carregada":"Foto de fundo"}</span>
                {bgPhoto&&<button onClick={e=>{e.preventDefault();setBgPhoto(null);}} style={{marginLeft:"auto",background:"none",border:"none",color:"#ff4444",cursor:"pointer"}}>✕</button>}
                <input type="file" accept="image/*" onChange={handleBgPhoto} style={{display:"none"}}/>
              </label>
              {bgPhoto&&<><div style={{display:"flex",justifyContent:"space-between"}}><span style={L()}>Opacidade</span><span style={{fontSize:10,color:"#00d4ff"}}>{Math.round(bgOpacity*100)}%</span></div><input type="range" min="0" max="1" step="0.05" value={bgOpacity} onChange={e=>setBgOpacity(Number(e.target.value))} style={{width:"100%"}}/></>}
            </div>
          )}

          {panel==="icons"&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:10}}>
              <div style={{fontSize:8,color:"#c87cff",letterSpacing:3,marginBottom:8}}>BIBLIOTECA DE ÍCONES SVG</div>
              <div style={{fontSize:10,color:"#3a4060",marginBottom:10}}>Clique para adicionar ao canvas • Arrastar e redimensionar</div>
              {ICONS_CATS.map(cat=>(
                <div key={cat} style={{marginBottom:12}}>
                  <div style={{fontSize:9,color:"#666",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>{cat}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                    {ICONS_SVG.filter(ic=>ic.cat===cat).map(ic=>(
                      <button key={ic.id} onClick={()=>addIcon(ic,"#ffffff")}
                        title={ic.label}
                        style={{padding:"10px 6px",borderRadius:8,cursor:"pointer",background:"rgba(200,119,255,.07)",border:"1px solid rgba(200,119,255,.15)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,119,255,.2)";e.currentTarget.style.borderColor="rgba(200,119,255,.5)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(200,119,255,.07)";e.currentTarget.style.borderColor="rgba(200,119,255,.15)";}}>
                        <div style={{width:28,height:28,color:"#c87cff"}} dangerouslySetInnerHTML={{__html:ic.svg}}/>
                        <span style={{fontSize:8,color:"#888",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",width:"100%",textAlign:"center"}}>{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{marginTop:6,padding:"8px 10px",borderRadius:7,background:"rgba(0,212,255,.05)",border:"1px solid rgba(0,212,255,.1)"}}>
                <div style={{fontSize:9,color:"#00d4ff",marginBottom:4}}>💡 Dica</div>
                <div style={{fontSize:10,color:"#3a4060",lineHeight:1.5}}>Após adicionar, selecione o ícone e mude a cor dele pelo painel de propriedades.</div>
              </div>
            </div>
          )}
        </div>
      {isMobile&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"10px 12px",background:"rgba(6,10,20,.97)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(255,255,255,.06)",zIndex:200}}>
        <button onClick={handleSave} disabled={saving} style={{width:"100%",padding:"13px",borderRadius:10,cursor:saving?"wait":"pointer",background:saving?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)",border:"none",color:saving?"#444":"#000",fontSize:14,fontWeight:900,boxShadow:saving?"none":"0 0 20px rgba(0,212,255,.3)"}}>
          {saving?"Gerando imagem...":"⬇️ BAIXAR PNG"}
        </button>
      </div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COLLAGE EDITOR
═══════════════════════════════════════════════════════════════════ */
const COLLAGE_LAYOUTS = [
  { id:"2h",   label:"2 lado a lado",   cols:2, rows:1, cells:[{c:0,r:0,cw:1,rh:1},{c:1,r:0,cw:1,rh:1}] },
  { id:"2v",   label:"2 empilhadas",    cols:1, rows:2, cells:[{c:0,r:0,cw:1,rh:1},{c:0,r:1,cw:1,rh:1}] },
  { id:"3l",   label:"3 esquerda+2",   cols:2, rows:2, cells:[{c:0,r:0,cw:1,rh:2},{c:1,r:0,cw:1,rh:1},{c:1,r:1,cw:1,rh:1}] },
  { id:"3r",   label:"3 2+direita",    cols:2, rows:2, cells:[{c:0,r:0,cw:1,rh:1},{c:0,r:1,cw:1,rh:1},{c:1,r:0,cw:1,rh:2}] },
  { id:"3h",   label:"3 em linha",     cols:3, rows:1, cells:[{c:0,r:0,cw:1,rh:1},{c:1,r:0,cw:1,rh:1},{c:2,r:0,cw:1,rh:1}] },
  { id:"4g",   label:"4 grade 2×2",    cols:2, rows:2, cells:[{c:0,r:0,cw:1,rh:1},{c:1,r:0,cw:1,rh:1},{c:0,r:1,cw:1,rh:1},{c:1,r:1,cw:1,rh:1}] },
  { id:"4t",   label:"4 topo grande",  cols:2, rows:2, cells:[{c:0,r:0,cw:2,rh:1},{c:0,r:1,cw:1,rh:1},{c:1,r:1,cw:1,rh:1}] },
  { id:"4b",   label:"4 base grande",  cols:2, rows:2, cells:[{c:0,r:0,cw:1,rh:1},{c:1,r:0,cw:1,rh:1},{c:0,r:1,cw:2,rh:1}] },
];

function CollageEditor({ onHome }) {
  const isMobile = useMobile();
  const [layoutId, setLayoutId]   = useState("4g");
  const [gap, setGap]             = useState(4);
  const [radius, setRadius]       = useState(0);
  const [bgColor, setBgColor]     = useState("#000000");
  const [saving, setSaving]       = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  // Unified history for photos + cellAdj
  const COLLAGE_INIT = { photos:[], cellAdj:{} };
  const [collageHist, dispatchCollage] = useReducer(histReducer, {past:[], present:COLLAGE_INIT, future:[]});
  const collageSnap = collageHist.present;
  const photos = collageSnap.photos;
  const cellAdj = collageSnap.cellAdj;
  const pushCollage = (patch) => dispatchCollage({type:"SET", p:{...collageHist.present,...patch}});
  const undoCollage = () => dispatchCollage({type:"UNDO"});
  const redoCollage = () => dispatchCollage({type:"REDO"});
  const canUndoC = collageHist.past.length > 0;
  const canRedoC = collageHist.future.length > 0;

  useEffect(()=>{
    const h=e=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();undoCollage();}
      if((e.metaKey||e.ctrlKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();redoCollage();}
    };
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[collageHist]);

  const layout = COLLAGE_LAYOUTS.find(l=>l.id===layoutId) || COLLAGE_LAYOUTS[0];
  const SIZE = isMobile ? Math.min(window.innerWidth - 32, 380) : 480;
  const COL_W = SIZE / layout.cols;
  const ROW_H = SIZE / layout.rows;

  const loadPhoto = (idx, e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev => {
      const arr = [...photos]; arr[idx] = ev.target.result;
      pushCollage({photos: arr});
    }; r.readAsDataURL(f);
  };

  const getAdj = idx => ({ brightness:0, contrast:0, saturation:0, ...cellAdj[idx] });
  const setAdj = (idx, patch) => pushCollage({cellAdj: { ...cellAdj, [idx]: { ...getAdj(idx), ...patch } }});
  const adjToFilter = adj => `brightness(${1 + adj.brightness/100}) contrast(${1 + adj.contrast/100}) saturate(${1 + adj.saturation/100})`;

  // Canvas-based export — handles CSS filter correctly
  const handleExport = async () => {
    setSaving(true);
    try {
      const SCALE = 2;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE * SCALE; canvas.height = SIZE * SCALE;
      const ctx = canvas.getContext("2d");
      ctx.scale(SCALE, SCALE);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);

      for (let idx = 0; idx < layout.cells.length; idx++) {
        const cell = layout.cells[idx];
        const x = cell.c * COL_W + gap/2;
        const y = cell.r * ROW_H + gap/2;
        const w = cell.cw * COL_W - gap;
        const h = cell.rh * ROW_H - gap;
        const photo = photos[idx];
        if (!photo) continue;

        ctx.save();
        // rounded clip
        if (radius > 0) {
          const r2 = Math.max(0, radius - 2);
          ctx.beginPath();
          ctx.moveTo(x + r2, y);
          ctx.lineTo(x + w - r2, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r2);
          ctx.lineTo(x + w, y + h - r2); ctx.quadraticCurveTo(x+w, y+h, x+w-r2, y+h);
          ctx.lineTo(x + r2, y + h); ctx.quadraticCurveTo(x, y+h, x, y+h-r2);
          ctx.lineTo(x, y + r2); ctx.quadraticCurveTo(x, y, x+r2, y);
          ctx.closePath(); ctx.clip();
        } else {
          ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        }

        // apply filter
        const adj = getAdj(idx);
        ctx.filter = adjToFilter(adj);

        // load + draw image with cover fit
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = photo; });
        const iAr = img.width / img.height;
        const cAr = w / h;
        let sx, sy, sw, sh;
        if (iAr > cAr) { sh = img.height; sw = sh * cAr; sx = (img.width - sw) / 2; sy = 0; }
        else { sw = img.width; sh = sw / cAr; sx = 0; sy = (img.height - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
      }

      const a = document.createElement("a");
      a.download = "colagem-maker-info.png";
      a.href = canvas.toDataURL("image/png"); a.click();
      toast("Colagem exportada!");
    } catch(err) { console.error(err); toast("Erro ao exportar.", "error"); }
    setSaving(false);
  };

  const iB=(on,c="#00e676")=>({padding:"8px 10px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,
    background:on?"rgba(0,230,118,.15)":"rgba(255,255,255,.04)",
    border:on?"1px solid rgba(0,230,118,.5)":"1px solid rgba(255,255,255,.06)",color:on?"#00e676":"#3a4060"});

  const editAdj = editingCell !== null ? getAdj(editingCell) : null;

  return (
    <div style={{minHeight:"100vh",background:"#060a14",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#fff"}}>
      {/* Top bar */}
      <div style={{background:"rgba(6,10,20,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"10px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <button onClick={onHome} style={{padding:"7px 14px",borderRadius:7,background:"rgba(0,230,118,.1)",border:"1px solid rgba(0,230,118,.3)",color:"#00e676",fontSize:11,fontWeight:700,cursor:"pointer"}}>← Home</button>
        <div style={{flex:1}}>
          <div style={{fontSize:8,color:"#00e676",letterSpacing:5}}>MAKER INFO</div>
          <div style={{fontSize:15,fontWeight:900}}>🖼 <span style={{color:"#00e676"}}>Colagem</span> de Fotos</div>
        </div>
        <button onClick={undoCollage} disabled={!canUndoC} style={{padding:"7px 11px",borderRadius:7,background:canUndoC?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canUndoC?"#fff":"#333",fontSize:15,cursor:canUndoC?"pointer":"default"}} title="Ctrl+Z">↩</button>
        <button onClick={redoCollage} disabled={!canRedoC} style={{padding:"7px 11px",borderRadius:7,background:canRedoC?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canRedoC?"#fff":"#333",fontSize:15,cursor:canRedoC?"pointer":"default"}} title="Ctrl+Y">↪</button>
        <button onClick={handleExport} disabled={saving} style={{padding:"9px 18px",borderRadius:8,cursor:saving?"wait":"pointer",fontSize:12,fontWeight:900,background:saving?"#1a2030":"linear-gradient(135deg,#00e676,#00b050)",border:"none",color:"#000",boxShadow:saving?"none":"0 0 18px rgba(0,230,118,.3)"}}>
          {saving?"⏳ Exportando...":"⬇️ Baixar PNG"}
        </button>
      </div>

      <div style={{display:"flex",gap:16,padding:16,flexWrap:isMobile?"wrap":"nowrap",justifyContent:"center",alignItems:"flex-start"}}>

        {/* Canvas */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{position:"relative",width:SIZE,height:SIZE,background:bgColor,borderRadius:radius,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.8)"}}>
            {layout.cells.map((cell,idx)=>{
              const x = cell.c * COL_W + gap/2;
              const y = cell.r * ROW_H + gap/2;
              const w = cell.cw * COL_W - gap;
              const h = cell.rh * ROW_H - gap;
              const photo = photos[idx];
              const adj = getAdj(idx);
              const isEditing = editingCell === idx;
              return (
                <div key={idx} style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:Math.max(0,radius-2),overflow:"hidden",background:"rgba(255,255,255,.06)",outline:isEditing?"2px solid #00d4ff":"none",cursor:photo?"pointer":"default"}}
                  onClick={()=>photo&&setEditingCell(isEditing?null:idx)}>
                  {photo
                    ? <img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:adjToFilter(adj)}} crossOrigin="anonymous"/>
                    : <label style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4,background:"rgba(255,255,255,.04)"}}>
                        <div style={{fontSize:Math.min(w,h)*0.3,opacity:.4}}>+</div>
                        <div style={{fontSize:Math.min(w*0.08,10),color:"rgba(255,255,255,.35)",textAlign:"center",padding:"0 4px"}}>Foto {idx+1}</div>
                        <input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}}/>
                      </label>
                  }
                  {photo && (
                    <label style={{position:"absolute",bottom:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12}}>
                      🔄<input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}}/>
                    </label>
                  )}
                  {isEditing&&<div style={{position:"absolute",top:4,left:4,fontSize:9,color:"#00d4ff",background:"rgba(0,0,0,.8)",padding:"2px 6px",borderRadius:4}}>✏️ Editando</div>}
                </div>
              );
            })}
          </div>
          {editingCell!==null&&editAdj&&(
            <div style={{width:SIZE,background:"rgba(0,0,0,.9)",border:"1px solid rgba(0,212,255,.3)",borderRadius:10,padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:10,color:"#00d4ff",fontWeight:700}}>✏️ Ajustes — Foto {editingCell+1}</span>
                <button onClick={()=>{setAdj(editingCell,{brightness:0,contrast:0,saturation:0});}} style={{fontSize:9,color:"#ff4444",background:"none",border:"none",cursor:"pointer"}}>Resetar</button>
              </div>
              {[["brightness","☀️ Brilho",-100,100],["contrast","◑ Contraste",-100,100],["saturation","🎨 Saturação",-100,100]].map(([k,lb,mn,mx])=>(
                <div key={k} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:10,color:"#aaa"}}>{lb}</span>
                    <span style={{fontSize:10,color:"#00d4ff"}}>{editAdj[k]}</span>
                  </div>
                  <input type="range" min={mn} max={mx} value={editAdj[k]} onChange={e=>setAdj(editingCell,{[k]:Number(e.target.value)})} style={{width:"100%",accentColor:"#00d4ff"}}/>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:10,color:"#1a3040"}}>Clique numa foto para ajustar brilho/contraste/saturação</div>
        </div>

        {/* Controls panel */}
        <div style={{flex:"0 0 auto",width:isMobile?"100%":290}}>
          {/* Layouts */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:10}}>LAYOUT</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {COLLAGE_LAYOUTS.map(l=>(
                <button key={l.id} onClick={()=>{setLayoutId(l.id);pushCollage(COLLAGE_INIT);setEditingCell(null);}} style={{
                  padding:"9px 6px",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,
                  background:layoutId===l.id?"rgba(0,230,118,.15)":"rgba(255,255,255,.04)",
                  border:layoutId===l.id?"1px solid rgba(0,230,118,.5)":"1px solid rgba(255,255,255,.06)",
                  color:layoutId===l.id?"#00e676":"#3a4060"}}>{l.label}</button>
              ))}
            </div>
          </div>

          {/* Ajustes */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:10}}>AJUSTES GERAIS</div>
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:"#aaa"}}>Espaço entre fotos</span>
                <span style={{fontSize:11,color:"#00e676"}}>{gap}px</span>
              </div>
              <input type="range" min={0} max={20} value={gap} onChange={e=>setGap(Number(e.target.value))} style={{width:"100%",accentColor:"#00e676"}}/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:"#aaa"}}>Cantos arredondados</span>
                <span style={{fontSize:11,color:"#00e676"}}>{radius}px</span>
              </div>
              <input type="range" min={0} max={40} value={radius} onChange={e=>setRadius(Number(e.target.value))} style={{width:"100%",accentColor:"#00e676"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,color:"#aaa"}}>Cor de fundo</span>
              <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} style={{flex:1,height:36,border:"none",borderRadius:6,cursor:"pointer"}}/>
            </div>
          </div>

          {/* Slots */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:8}}>SLOTS</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {layout.cells.map((_,idx)=>(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,background:photos[idx]?"rgba(0,230,118,.08)":"rgba(255,255,255,.03)",border:photos[idx]?"1px solid rgba(0,230,118,.25)":"1px solid rgba(255,255,255,.06)"}}>
                  <span style={{fontSize:14}}>{photos[idx]?"🟢":"⬜"}</span>
                  <span style={{fontSize:11,color:photos[idx]?"#00e676":"#3a4060",flex:1}}>Foto {idx+1}</span>
                  {photos[idx]&&<button onClick={()=>{const a=[...photos];a[idx]=null;pushCollage({photos:a});if(editingCell===idx)setEditingCell(null);}} style={{fontSize:11,color:"#ff4444",background:"none",border:"none",cursor:"pointer"}}>✕</button>}
                  <label style={{fontSize:10,color:"#00e676",cursor:"pointer",padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,230,118,.3)",background:"rgba(0,230,118,.07)"}}>
                    {photos[idx]?"Trocar":"Adicionar"}<input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}}/>
                  </label>
                </div>
              ))}
            </div>
            {photos.filter(Boolean).length===layout.cells.length&&(
              <div style={{marginTop:10,fontSize:10,color:"#00e676",textAlign:"center",padding:"8px",borderRadius:7,background:"rgba(0,230,118,.08)",border:"1px solid rgba(0,230,118,.2)"}}>
                ✅ Todas as fotos adicionadas! Clique em Baixar PNG.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   POST CREATOR — v2
   Interface premium, templates elaborados, Canvas API 1080×1080
═══════════════════════════════════════════════════════════════════ */

/* ─── Shared canvas utils ─── */
function _hr(hex){const n=parseInt((hex||"#888").replace(/^#/,""),16)||0;return{r:(n>>16)&255,g:(n>>8)&255,b:n&255};}
function _rR(ctx,x,y,w,h,r=0){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();}
function _cov(ctx,img,x,y,w,h){if(!img)return;const ir=img.width/img.height,cr=w/h;let sw=img.width,sh=img.height,sx=0,sy=0;if(ir>cr){sw=sh*cr;sx=(img.width-sw)/2;}else{sh=sw/cr;sy=(img.height-sh)/2;}ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);}
function _wrapText(ctx,text,x,y,maxW,lh,maxLines=4){
  const words=(text||"").split(" ");let line="",lines=[];
  for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t;}
  if(line)lines.push(line);
  lines.slice(0,maxLines).forEach((l,i)=>ctx.fillText(l,x,y+i*lh));
  return lines.slice(0,maxLines).length;
}
function _origPrice(price,disc){
  const p=parseFloat((price||"").replace(",",".").replace(/\./g,"").replace(",","."));
  const d=parseFloat(disc);
  if(!p||!d||d<=0||d>=100)return null;
  return(p/(1-d/100)).toFixed(2).replace(".",",");
}
function _noise(ctx,W,H,alpha=0.03){
  const id=ctx.createImageData(W,H);const d=id.data;
  for(let i=0;i<d.length;i+=4){const v=(Math.random()*255)|0;d[i]=d[i+1]=d[i+2]=v;d[i+3]=(alpha*255)|0;}
  ctx.putImageData(id,0,0);
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 1 — NEON IMPACT
   Fundo escuro absoluto, produto centralizado com halo
   de luz, tipografia massiva, badge de preço dinâmico
═══════════════════════════════════════════════════════ */
function tplNeonImpact(ctx,W,H,{img,name,price,discount,cta,accent}){
  const {r,g,b}=_hr(accent);

  /* bg */
  ctx.fillStyle="#06070d";ctx.fillRect(0,0,W,H);

  /* noise grain */
  const nctx=document.createElement("canvas");nctx.width=W;nctx.height=H;
  const nc=nctx.getContext("2d");_noise(nc,W,H,0.025);
  ctx.globalAlpha=1;ctx.drawImage(nctx,0,0);

  /* radial light halo behind product */
  const hg=ctx.createRadialGradient(W/2,H*.42,0,W/2,H*.42,W*.52);
  hg.addColorStop(0,`rgba(${r},${g},${b},.22)`);hg.addColorStop(.5,`rgba(${r},${g},${b},.06)`);hg.addColorStop(1,"transparent");
  ctx.fillStyle=hg;ctx.fillRect(0,0,W,H);

  /* grid lines */
  ctx.save();ctx.globalAlpha=.04;ctx.strokeStyle=`rgb(${r},${g},${b})`;ctx.lineWidth=1;
  for(let x=0;x<W;x+=W/18){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=H/18){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  /* product zone — hexagon clip */
  const hR=W*.34,hx=W/2,hy=H*.38;
  ctx.save();
  ctx.beginPath();
  for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);ctx.lineTo(hx+hR*Math.cos(a),hy+hR*Math.sin(a));}
  ctx.closePath();
  ctx.shadowColor=accent;ctx.shadowBlur=W*.05;
  ctx.strokeStyle=`rgba(${r},${g},${b},.7)`;ctx.lineWidth=W*.004;ctx.stroke();
  ctx.shadowBlur=0;
  if(img){ctx.clip();_cov(ctx,img,hx-hR,hy-hR,hR*2,hR*2);}
  else{ctx.fillStyle=`rgba(${r},${g},${b},.08)`;ctx.fill();}
  ctx.restore();

  /* decorative corner lines */
  ctx.save();ctx.strokeStyle=`rgba(${r},${g},${b},.3)`;ctx.lineWidth=W*.003;
  [[0,0,W*.12,0],[0,0,0,W*.12],[W,0,W-W*.12,0],[W,0,W,W*.12],
   [0,H,W*.12,H],[0,H,0,H-W*.12],[W,H,W-W*.12,H],[W,H,W,H-W*.12]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  ctx.restore();

  /* tag superior */
  const tag="✦ OFERTA ESPECIAL";
  ctx.font=`700 ${W*.022}px 'Barlow Condensed',Impact,sans-serif`;
  const tw=ctx.measureText(tag).width;
  ctx.fillStyle=`rgba(${r},${g},${b},.15)`;_rR(ctx,W/2-tw/2-W*.03,H*.065,tw+W*.06,H*.042,H*.021);ctx.fill();
  ctx.strokeStyle=`rgba(${r},${g},${b},.35)`;ctx.lineWidth=W*.002;
  _rR(ctx,W/2-tw/2-W*.03,H*.065,tw+W*.06,H*.042,H*.021);ctx.stroke();
  ctx.fillStyle=accent;ctx.textAlign="center";ctx.fillText(tag,W/2,H*.095);ctx.textAlign="left";

  /* name */
  ctx.fillStyle="#fff";ctx.font=`900 ${W*.105}px 'Barlow Condensed',Impact`;
  ctx.textAlign="center";
  const nameLines=_wrapText(ctx,name||"Produto",W/2,H*.73,W*.82,W*.112,2);
  ctx.textAlign="left";

  /* separator */
  const sy2=H*.73+nameLines*W*.112+H*.018;
  ctx.strokeStyle=`rgba(${r},${g},${b},.4)`;ctx.lineWidth=W*.002;
  ctx.beginPath();ctx.moveTo(W*.15,sy2);ctx.lineTo(W*.85,sy2);ctx.stroke();
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(W/2,sy2,W*.008,0,Math.PI*2);ctx.fill();

  /* price zone */
  const op=_origPrice(price,discount);
  let py=sy2+H*.052;
  ctx.textAlign="center";
  if(op){
    ctx.fillStyle="rgba(255,255,255,.32)";ctx.font=`300 ${W*.034}px 'Barlow Condensed',Impact`;
    const om=ctx.measureText(`R$ ${op}`);
    ctx.fillText(`R$ ${op}`,W/2,py);
    ctx.strokeStyle="rgba(255,255,255,.32)";ctx.lineWidth=W*.0028;
    ctx.beginPath();ctx.moveTo(W/2-om.width/2,py-W*.01);ctx.lineTo(W/2+om.width/2,py-W*.01);ctx.stroke();
    py+=H*.068;
  }
  if(price){
    ctx.save();
    ctx.font=`900 ${W*.14}px 'Barlow Condensed',Impact`;
    ctx.shadowColor=accent;ctx.shadowBlur=W*.035;
    ctx.fillStyle=accent;ctx.fillText(`R$ ${price}`,W/2,py);
    ctx.restore();
    py+=H*.072;
  }

  /* CTA button */
  const cbw=W*.46,cbh=H*.072,cbx=W/2-cbw/2,cby=py+H*.01;
  const bg2=ctx.createLinearGradient(cbx,cby,cbx+cbw,cby);
  bg2.addColorStop(0,accent);bg2.addColorStop(1,`rgb(${Math.max(r-40,0)},${Math.max(g-40,0)},${Math.max(b-40,0)})`);
  ctx.fillStyle=bg2;ctx.shadowColor=accent;ctx.shadowBlur=W*.028;
  _rR(ctx,cbx,cby,cbw,cbh,cbh/2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="#fff";ctx.font=`800 ${W*.034}px 'Barlow Condensed',Impact`;
  ctx.fillText((cta||"Ver mais").toUpperCase(),W/2,cby+cbh*.67);
  ctx.textAlign="left";
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 2 — SLASH MAGAZINE
   Corte diagonal agressivo, foto no lado direito full
   Tipografia editorial pesada, preço em destaque esquerdo
═══════════════════════════════════════════════════════ */
function tplSlashMag(ctx,W,H,{img,name,price,discount,cta,accent}){
  const {r,g,b}=_hr(accent);

  /* bg escuro */
  ctx.fillStyle="#0c0c0c";ctx.fillRect(0,0,W,H);

  /* foto right side com clip diagonal */
  if(img){
    ctx.save();
    ctx.beginPath();ctx.moveTo(W*.38,0);ctx.lineTo(W,0);ctx.lineTo(W,H);ctx.lineTo(W*.22,H);ctx.closePath();
    ctx.clip();_cov(ctx,img,W*.22,0,W*.78,H);
    /* overlay escuro sobre a foto */
    const fo=ctx.createLinearGradient(W*.22,0,W,0);fo.addColorStop(0,"rgba(12,12,12,.85)");fo.addColorStop(.5,"rgba(12,12,12,.3)");fo.addColorStop(1,"rgba(12,12,12,.1)");
    ctx.fillStyle=fo;ctx.fillRect(W*.22,0,W*.78,H);
    ctx.restore();
  }

  /* accent color slash */
  ctx.save();
  ctx.fillStyle=accent;
  ctx.shadowColor=accent;ctx.shadowBlur=W*.025;
  ctx.beginPath();ctx.moveTo(W*.31,0);ctx.lineTo(W*.38,0);ctx.lineTo(W*.22,H);ctx.lineTo(W*.15,H);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;ctx.restore();

  /* second slash lighter */
  ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=accent;
  ctx.beginPath();ctx.moveTo(W*.24,0);ctx.lineTo(W*.29,0);ctx.lineTo(W*.13,H);ctx.lineTo(W*.08,H);ctx.closePath();ctx.fill();
  ctx.restore();

  /* left panel gradient */
  const lg=ctx.createLinearGradient(0,0,W*.38,0);
  lg.addColorStop(0,"rgba(12,12,12,1)");lg.addColorStop(1,"rgba(12,12,12,.7)");
  ctx.fillStyle=lg;ctx.fillRect(0,0,W*.38,H);

  /* brand mark top */
  ctx.fillStyle=accent;ctx.font=`800 ${W*.018}px 'Barlow Condensed',Impact`;
  ctx.fillText("✦ MAKER INFO",W*.06,H*.072);

  /* name — large left side */
  ctx.fillStyle="#fff";ctx.font=`900 ${W*.112}px 'Barlow Condensed',Impact`;
  const nl=_wrapText(ctx,name||"Produto",W*.06,H*.28,W*.32,W*.118,3);

  /* accent line */
  const aly=H*.28+nl*W*.118+H*.02;
  ctx.fillStyle=accent;ctx.fillRect(W*.06,aly,W*.14,H*.006);

  /* price */
  const op=_origPrice(price,discount);
  let py=aly+H*.065;
  if(op){ctx.fillStyle="rgba(255,255,255,.38)";ctx.font=`300 ${W*.031}px 'Barlow Condensed',Impact`;ctx.fillText(`De R$ ${op}`,W*.06,py);py+=H*.06;}
  if(price){ctx.fillStyle=accent;ctx.font=`900 ${W*.118}px 'Barlow Condensed',Impact`;ctx.fillText(`R$`,W*.06,py+H*.072);ctx.font=`900 ${W*.145}px 'Barlow Condensed',Impact`;ctx.fillText(price,W*.06+W*.1,py+H*.072);py+=H*.1;}

  if(discount){
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(W*.255,H*.82,W*.075,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.font=`900 ${W*.038}px 'Barlow Condensed',Impact`;ctx.textAlign="center";
    ctx.fillText(`-${discount}%`,W*.255,H*.812);ctx.font=`700 ${W*.022}px 'Barlow Condensed',Impact`;ctx.fillText("OFF",W*.255,H*.844);ctx.textAlign="left";
  }

  /* CTA bottom left */
  const cbh=H*.068,cby=H*.895;
  ctx.fillStyle="#fff";_rR(ctx,W*.06,cby,W*.28,cbh,cbh/2);ctx.fill();
  ctx.fillStyle="#0c0c0c";ctx.font=`800 ${W*.031}px 'Barlow Condensed',Impact`;ctx.textAlign="center";
  ctx.fillText((cta||"Ver mais").toUpperCase(),W*.06+W*.14,cby+cbh*.68);ctx.textAlign="left";
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 3 — LUXURY GOLD
   Fundo quase preto, detalhes dourados finos, tipografia
   serif elegante, produto com moldura ornamental
═══════════════════════════════════════════════════════ */
function tplLuxury(ctx,W,H,{img,name,price,discount,cta,accent}){
  const gold="#c8a96e";
  const {r,g,b}=_hr(accent);

  /* deep bg */
  const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#0e0c09");bg.addColorStop(1,"#080608");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  /* subtle texture */
  ctx.save();ctx.globalAlpha=.022;
  for(let i=0;i<1200;i++){ctx.fillStyle="#fff";ctx.fillRect(Math.random()*W,Math.random()*H,1,1);}
  ctx.restore();

  /* top ornament line */
  const gl=ctx.createLinearGradient(0,0,W,0);gl.addColorStop(0,"transparent");gl.addColorStop(.3,gold);gl.addColorStop(.7,gold);gl.addColorStop(1,"transparent");
  ctx.strokeStyle=gl;ctx.lineWidth=W*.002;ctx.beginPath();ctx.moveTo(0,H*.035);ctx.lineTo(W,H*.035);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H*.042);ctx.lineTo(W,H*.042);ctx.stroke();

  /* bottom ornament line */
  ctx.strokeStyle=gl;ctx.beginPath();ctx.moveTo(0,H*.958);ctx.lineTo(W,H*.958);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H*.965);ctx.lineTo(W,H*.965);ctx.stroke();

  /* diamond ornaments */
  [[W/2,H*.038],[W/2,H*.962]].forEach(([dx,dy])=>{
    ctx.save();ctx.translate(dx,dy);ctx.rotate(Math.PI/4);ctx.fillStyle=gold;ctx.fillRect(-W*.012,-W*.012,W*.024,W*.024);ctx.restore();
    ctx.fillStyle="#0e0c09";ctx.beginPath();ctx.arc(dx,dy,W*.007,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=gold;ctx.lineWidth=W*.002;ctx.beginPath();ctx.arc(dx,dy,W*.007,0,Math.PI*2);ctx.stroke();
  });

  /* product frame */
  const fw=W*.62,fh=H*.52,fx=(W-fw)/2,fy=H*.065;
  ctx.strokeStyle=gold;ctx.lineWidth=W*.0018;ctx.strokeRect(fx,fy,fw,fh);
  /* corner ornaments on frame */
  const cs=W*.04;
  [[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]].forEach(([cx,cy],i)=>{
    ctx.strokeStyle=gold;ctx.lineWidth=W*.003;
    ctx.beginPath();ctx.moveTo(cx+(i%2===0?cs:-(cs)),cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+(i<2?cs:-(cs)));ctx.stroke();
  });
  if(img){ctx.save();ctx.rect(fx,fy,fw,fh);ctx.clip();_cov(ctx,img,fx,fy,fw,fh);
    const fo=ctx.createLinearGradient(0,fy+fh*.6,0,fy+fh);fo.addColorStop(0,"rgba(14,12,9,0)");fo.addColorStop(1,"rgba(14,12,9,.65)");ctx.fillStyle=fo;ctx.fillRect(fx,fy,fw,fh);ctx.restore();}
  else{ctx.fillStyle="rgba(200,169,110,.05)";ctx.fillRect(fx,fy,fw,fh);
    ctx.fillStyle="rgba(200,169,110,.18)";ctx.font=`${W*.06}px serif`;ctx.textAlign="center";ctx.fillText("◈",W/2,fy+fh/2+W*.02);ctx.textAlign="left";}

  /* name */
  ctx.fillStyle="#f0e8d8";ctx.font=`300 ${W*.075}px Georgia,'Times New Roman',serif`;ctx.textAlign="center";
  _wrapText(ctx,name||"Produto",W/2,H*.655,W*.8,W*.082,2);

  /* gold divider */
  const dl=W*.18;
  ctx.strokeStyle=gold;ctx.lineWidth=W*.0015;
  ctx.beginPath();ctx.moveTo(W/2-dl/2,H*.768);ctx.lineTo(W/2+dl/2,H*.768);ctx.stroke();
  ctx.fillStyle=gold;ctx.beginPath();ctx.arc(W/2,H*.768,W*.006,0,Math.PI*2);ctx.fill();

  /* price */
  const op=_origPrice(price,discount);
  let py=H*.81;
  if(op){ctx.fillStyle="rgba(200,169,110,.4)";ctx.font=`300 ${W*.028}px Georgia,serif`;
    const om=ctx.measureText(`${op}`);ctx.fillText(`R$ ${op}`,W/2,py);
    ctx.strokeStyle="rgba(200,169,110,.4)";ctx.lineWidth=W*.002;
    ctx.beginPath();ctx.moveTo(W/2-om.width/2,py-W*.008);ctx.lineTo(W/2+om.width/2,py-W*.008);ctx.stroke();
    py+=H*.06;}
  if(price){ctx.fillStyle=gold;ctx.font=`400 ${W*.1}px Georgia,'Times New Roman',serif`;ctx.fillText(`R$ ${price}`,W/2,py);py+=H*.068;}

  /* CTA */
  const cbw=W*.38,cbh=H*.058,cbx=W/2-cbw/2,cby=py+H*.008;
  ctx.strokeStyle=gold;ctx.lineWidth=W*.002;_rR(ctx,cbx,cby,cbw,cbh,2);ctx.stroke();
  ctx.fillStyle=gold;ctx.font=`400 ${W*.026}px Georgia,serif`;ctx.letterSpacing="3px";
  ctx.fillText((cta||"Ver mais").toUpperCase(),W/2,cby+cbh*.68);ctx.letterSpacing="0px";
  ctx.textAlign="left";
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 4 — URBAN STREET
   Fundo colorido vibrante, foto com mask circular,
   tipografia com mistura bold/light, muito contraste
═══════════════════════════════════════════════════════ */
function tplUrban(ctx,W,H,{img,name,price,discount,cta,accent}){
  const {r,g,b}=_hr(accent);

  /* vivid bg */
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,accent);bg.addColorStop(1,`hsl(${(r*360/255+40)%360},80%,25%)`);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  /* big bold halftone dots bg texture */
  ctx.save();ctx.globalAlpha=.07;ctx.fillStyle="#fff";
  for(let x=0;x<W;x+=W/14)for(let y=0;y<H;y+=H/14){ctx.beginPath();ctx.arc(x,y,W/36,0,Math.PI*2);ctx.fill();}
  ctx.restore();

  /* large circle cutout top-right */
  ctx.save();ctx.globalAlpha=.12;ctx.fillStyle="#fff";
  ctx.beginPath();ctx.arc(W*.82,H*.18,W*.22,0,Math.PI*2);ctx.fill();ctx.restore();

  /* top label */
  ctx.fillStyle="rgba(0,0,0,.5)";_rR(ctx,W*.055,H*.052,W*.22,H*.045,H*.022);ctx.fill();
  ctx.fillStyle="#fff";ctx.font=`800 ${W*.022}px 'Barlow Condensed',Impact`;ctx.fillText("NOVO ✦",W*.075,H*.082);

  /* product photo — masked to big circle */
  const pr=W*.32,px=W*.54,py=H*.19;
  ctx.save();ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);
  ctx.shadowColor="rgba(0,0,0,.5)";ctx.shadowBlur=W*.06;ctx.fillStyle="rgba(0,0,0,.3)";ctx.fill();ctx.shadowBlur=0;
  ctx.clip();if(img)_cov(ctx,img,px-pr,py-pr,pr*2,pr*2);
  ctx.restore();
  /* circle border */
  ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=W*.006;
  ctx.beginPath();ctx.arc(px,py,pr+W*.006,0,Math.PI*2);ctx.stroke();

  /* name — left bottom half */
  ctx.fillStyle="#fff";ctx.font=`900 ${W*.118}px 'Barlow Condensed',Impact`;
  _wrapText(ctx,name||"Produto",W*.055,H*.575,W*.58,W*.124,3);

  /* horizontal rule */
  ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(W*.055,H*.72,W*.36,H*.003);

  /* price */
  const op=_origPrice(price,discount);let py2=H*.77;
  if(op){ctx.fillStyle="rgba(255,255,255,.5)";ctx.font=`300 ${W*.034}px 'Barlow Condensed',Impact`;
    const om=ctx.measureText(`R$ ${op}`);ctx.fillText(`R$ ${op}`,W*.055,py2);
    ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=W*.003;
    ctx.beginPath();ctx.moveTo(W*.055,py2-W*.012);ctx.lineTo(W*.055+om.width,py2-W*.012);ctx.stroke();py2+=H*.07;}
  if(price){ctx.fillStyle="#fff";ctx.font=`900 ${W*.13}px 'Barlow Condensed',Impact`;ctx.fillText(`R$ ${price}`,W*.055,py2);py2+=H*.095;}

  /* discount badge floating */
  if(discount){
    const bx=W*.78,by=H*.72,br=W*.1;
    const bg2=ctx.createRadialGradient(bx,by,0,bx,by,br);bg2.addColorStop(0,"rgba(0,0,0,.8)");bg2.addColorStop(1,"rgba(0,0,0,.6)");
    ctx.fillStyle=bg2;ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.3)";ctx.lineWidth=W*.003;ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle="#fff";ctx.font=`900 ${W*.052}px 'Barlow Condensed',Impact`;ctx.textAlign="center";
    ctx.fillText(`-${discount}%`,bx,by-.01*H);ctx.font=`600 ${W*.026}px 'Barlow Condensed',Impact`;ctx.fillText("OFF",bx,by+H*.036);ctx.textAlign="left";
  }

  /* CTA */
  const cbh=H*.072,cby=H*.9;
  ctx.fillStyle="rgba(0,0,0,.7)";_rR(ctx,W*.055,cby,W*.36,cbh,cbh/2);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,.4)";ctx.lineWidth=W*.002;_rR(ctx,W*.055,cby,W*.36,cbh,cbh/2);ctx.stroke();
  ctx.fillStyle="#fff";ctx.font=`800 ${W*.032}px 'Barlow Condensed',Impact`;ctx.textAlign="center";
  ctx.fillText((cta||"Ver mais").toUpperCase(),W*.055+W*.18,cby+cbh*.68);ctx.textAlign="left";
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 5 — CLEAN STUDIO
   Fundo off-white, foto em cartão com sombra suave,
   tipografia refinada, minimalismo premium
═══════════════════════════════════════════════════════ */
function tplClean(ctx,W,H,{img,name,price,discount,cta,accent}){
  const {r,g,b}=_hr(accent);

  /* off-white bg */
  ctx.fillStyle="#f5f3ef";ctx.fillRect(0,0,W,H);

  /* subtle grid */
  ctx.save();ctx.globalAlpha=.03;ctx.strokeStyle="#000";ctx.lineWidth=1;
  for(let x=0;x<=W;x+=W/16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<=H;y+=H/16){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  /* accent top bar */
  ctx.fillStyle=accent;ctx.fillRect(0,0,W,H*.008);

  /* product card with shadow */
  const cw=W*.74,ch=H*.52,cx=(W-cw)/2,cy=H*.055;
  ctx.save();ctx.shadowColor="rgba(0,0,0,.14)";ctx.shadowBlur=W*.055;ctx.shadowOffsetY=W*.025;
  ctx.fillStyle="#fff";_rR(ctx,cx,cy,cw,ch,W*.018);ctx.fill();ctx.restore();
  if(img){ctx.save();_rR(ctx,cx,cy,cw,ch,W*.018);ctx.clip();_cov(ctx,img,cx,cy,cw,ch);ctx.restore();}

  /* category pill */
  ctx.fillStyle=`rgba(${r},${g},${b},.1)`;_rR(ctx,W*.055,H*.64,W*.22,H*.042,H*.021);ctx.fill();
  ctx.fillStyle=accent;ctx.font=`700 ${W*.019}px 'Barlow Condensed',Impact`;ctx.fillText("PROMOÇÃO",W*.075,H*.668);

  /* name */
  ctx.fillStyle="#1a1a1a";ctx.font=`300 ${W*.082}px Georgia,'Times New Roman',serif`;
  _wrapText(ctx,name||"Produto",W*.055,H*.74,W*.85,W*.088,2);

  /* thin divider */
  ctx.strokeStyle="rgba(0,0,0,.1)";ctx.lineWidth=W*.002;
  ctx.beginPath();ctx.moveTo(W*.055,H*.83);ctx.lineTo(W*.945,H*.83);ctx.stroke();

  /* price */
  const op=_origPrice(price,discount);let py=H*.875;
  if(op){
    ctx.fillStyle="#aaa";ctx.font=`300 ${W*.028}px Georgia,serif`;
    const om=ctx.measureText(`R$ ${op}`);ctx.fillText(`R$ ${op}`,W*.055,py);
    ctx.strokeStyle="#aaa";ctx.lineWidth=W*.002;ctx.beginPath();ctx.moveTo(W*.055,py-W*.009);ctx.lineTo(W*.055+om.width,py-W*.009);ctx.stroke();
    py+=H*.055;
  }
  if(price){ctx.fillStyle=accent;ctx.font=`700 ${W*.092}px 'Barlow Condensed',Impact`;ctx.fillText(`R$ ${price}`,W*.055,py);}

  /* CTA right side */
  const cbw=W*.3,cbh=H*.062,cbx=W*.645,cby=H*.898;
  ctx.fillStyle=accent;_rR(ctx,cbx,cby,cbw,cbh,W*.012);ctx.fill();
  ctx.fillStyle="#fff";ctx.font=`700 ${W*.027}px 'Barlow Condensed',Impact`;ctx.textAlign="center";
  ctx.fillText((cta||"Ver mais").toUpperCase(),cbx+cbw/2,cby+cbh*.68);ctx.textAlign="left";
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE 6 — RETRO BOLD
   Fundo em cor sólida vibrante, foto com moldura grossa
   offset, tipografia condensed gigante com sombra
═══════════════════════════════════════════════════════ */
function tplRetro(ctx,W,H,{img,name,price,discount,cta,accent}){
  const {r,g,b}=_hr(accent);
  const dark=`rgb(${Math.max(r-80,0)},${Math.max(g-80,0)},${Math.max(b-80,0)})`;
  const light=`rgb(${Math.min(r+60,255)},${Math.min(g+60,255)},${Math.min(b+60,255)})`;

  /* solid vivid bg */
  ctx.fillStyle=accent;ctx.fillRect(0,0,W,H);

  /* noise over color */
  const nctx=document.createElement("canvas");nctx.width=W;nctx.height=H;
  const nc=nctx.getContext("2d");_noise(nc,W,H,0.04);ctx.globalAlpha=1;ctx.drawImage(nctx,0,0);

  /* dark bottom section */
  ctx.fillStyle=dark;ctx.fillRect(0,H*.55,W,H*.45);

  /* wavey separator */
  ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(0,H*.52);
  for(let x=0;x<=W;x+=W/8){const sx=x+(x<W?W/16:0);const sy=H*.52+(Math.sin(x/W*Math.PI*2)*H*.025);ctx.lineTo(sx,sy);}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();

  /* product frame — offset border trick */
  const fw=W*.58,fh=H*.44,fx=(W-fw)/2,fy=H*.055;
  ctx.fillStyle=dark;ctx.fillRect(fx+W*.018,fy+W*.018,fw,fh);
  ctx.fillStyle="#fff";_rR(ctx,fx,fy,fw,fh,W*.01);ctx.fill();
  if(img){ctx.save();_rR(ctx,fx,fy,fw,fh,W*.01);ctx.clip();_cov(ctx,img,fx,fy,fw,fh);ctx.restore();}
  else{ctx.fillStyle="rgba(0,0,0,.08)";ctx.fillRect(fx,fy,fw,fh);}

  /* name — big bottom */
  ctx.save();
  ctx.fillStyle=dark;ctx.font=`900 ${W*.112}px 'Barlow Condensed',Impact`;
  ctx.textAlign="center";
  /* shadow offset */
  ctx.globalAlpha=.35;ctx.fillText((name||"Produto").toUpperCase(),W/2+W*.008,H*.68+W*.008*2);ctx.globalAlpha=1;
  ctx.fillStyle="#fff";
  _wrapText(ctx,(name||"Produto").toUpperCase(),W/2,H*.68,W*.85,W*.118,2);
  ctx.restore();

  /* price zone */
  const op=_origPrice(price,discount);let py=H*.78;
  ctx.textAlign="center";
  if(op){ctx.fillStyle="rgba(255,255,255,.38)";ctx.font=`300 ${W*.034}px 'Barlow Condensed',Impact`;
    const om=ctx.measureText(`R$ ${op}`);ctx.fillText(`R$ ${op}`,W/2,py);
    ctx.strokeStyle="rgba(255,255,255,.38)";ctx.lineWidth=W*.003;ctx.beginPath();ctx.moveTo(W/2-om.width/2,py-W*.012);ctx.lineTo(W/2+om.width/2,py-W*.012);ctx.stroke();py+=H*.065;}
  if(price){ctx.fillStyle="#fff";ctx.font=`900 ${W*.125}px 'Barlow Condensed',Impact`;ctx.fillText(`R$ ${price}`,W/2,py);py+=H*.088;}

  /* discount badge */
  if(discount){
    ctx.fillStyle=light;ctx.beginPath();ctx.arc(W*.12,H*.66,W*.088,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#fff";ctx.lineWidth=W*.004;ctx.beginPath();ctx.arc(W*.12,H*.66,W*.088,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=dark;ctx.font=`900 ${W*.038}px 'Barlow Condensed',Impact`;ctx.fillText(`-${discount}%`,W*.12,H*.654);
    ctx.font=`700 ${W*.023}px 'Barlow Condensed',Impact`;ctx.fillText("OFF",W*.12,H*.682);
  }

  /* CTA */
  const cbw=W*.52,cbh=H*.07,cbx=W/2-cbw/2,cby=py;
  ctx.fillStyle="#fff";_rR(ctx,cbx,cby,cbw,cbh,cbh/2);ctx.fill();
  ctx.fillStyle=dark;ctx.font=`900 ${W*.036}px 'Barlow Condensed',Impact`;
  ctx.fillText((cta||"Ver mais").toUpperCase(),W/2,cby+cbh*.68);
  ctx.textAlign="left";
}

/* ─── Template registry ─── */
const CREATOR_TPLS=[
  {id:"neon",    label:"Neon Impact",   emoji:"🔮", accent:"#7c3aed", draw:tplNeonImpact, tags:["tech","todos"]},
  {id:"slash",   label:"Slash Magazine",emoji:"⚡", accent:"#e11d48", draw:tplSlashMag,   tags:["moda","todos"]},
  {id:"luxury",  label:"Luxury Gold",   emoji:"👑", accent:"#c8a96e", draw:tplLuxury,     tags:["beleza","moda","todos"]},
  {id:"urban",   label:"Urban Street",  emoji:"🔥", accent:"#ea580c", draw:tplUrban,      tags:["food","todos"]},
  {id:"clean",   label:"Clean Studio",  emoji:"◻",  accent:"#0ea5e9", draw:tplClean,      tags:["tech","beleza","todos"]},
  {id:"retro",   label:"Retro Bold",    emoji:"🎯", accent:"#16a34a", draw:tplRetro,      tags:["food","todos"]},
];
const ACCENT_PRESETS=["#7c3aed","#e11d48","#ea580c","#0ea5e9","#16a34a","#c8a96e","#db2777","#0891b2","#fff","#111"];
const NICHO_FILTERS=["todos","tech","moda","food","beleza"];

/* ─── PostCreator component ─── */
function PostCreator({onHome}){
  const isMobile=useMobile();
  const [screen,setScreen]=useState("gallery");
  const [nicho,setNicho]=useState("todos");
  const [photo,setPhoto]=useState(null);
  const [photoImg,setPhotoImg]=useState(null);
  const [saving,setSaving]=useState(false);
  const [mTab,setMTab]=useState("foto");
  const [panel,setPanel]=useState("conteudo");
  const canvasRef=useRef(null);
  const thumbRefs=useRef({});

  // Unified undo for fields + tplId
  const CREATOR_INIT = {fields:{name:"Produto Incrível",price:"299,90",discount:"30",cta:"Comprar agora",accent:"#7c3aed"}, tplId:"neon"};
  const [crHist, dispatchCr] = useReducer(histReducer, {past:[], present:CREATOR_INIT, future:[]});
  const crSnap = crHist.present;
  const fields = crSnap.fields;
  const tplId = crSnap.tplId;
  const pushCr = (patch) => dispatchCr({type:"SET", p:{...crHist.present,...patch}});
  const undoCr = () => dispatchCr({type:"UNDO"});
  const redoCr = () => dispatchCr({type:"REDO"});
  const canUndoCr = crHist.past.length > 0;
  const canRedoCr = crHist.future.length > 0;
  const sf=(k,v)=>pushCr({fields:{...crSnap.fields,[k]:v}});

  useEffect(()=>{
    const h=e=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"&&!e.shiftKey){e.preventDefault();undoCr();}
      if((e.metaKey||e.ctrlKey)&&(e.key==="y"||(e.key==="z"&&e.shiftKey))){e.preventDefault();redoCr();}
    };
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);
  },[crHist]);
  const curTpl=CREATOR_TPLS.find(t=>t.id===tplId)||CREATOR_TPLS[0];

  /* Load photo img */
  useEffect(()=>{if(!photo){setPhotoImg(null);return;}const img=new Image();img.onload=()=>setPhotoImg(img);img.src=photo;},[photo]);

  /* Draw main canvas */
  const drawMain=useCallback(()=>{
    if(!canvasRef.current)return;
    const tpl=CREATOR_TPLS.find(t=>t.id===tplId);if(!tpl)return;
    const ctx=canvasRef.current.getContext("2d");
    tpl.draw(ctx,1080,1080,{img:photoImg,...fields});
  },[tplId,photoImg,fields]);

  useEffect(()=>{document.fonts.ready.then(drawMain);},[drawMain]);

  /* Draw thumbnails */
  const drawThumbs=useCallback(()=>{
    CREATOR_TPLS.forEach(tpl=>{
      const el=thumbRefs.current[tpl.id];if(!el)return;
      const ctx=el.getContext("2d");
      tpl.draw(ctx,300,300,{img:photoImg,name:fields.name||"Produto",price:fields.price,discount:fields.discount,cta:fields.cta,accent:tpl.accent});
    });
  },[photoImg,fields.name,fields.price,fields.discount]);

  useEffect(()=>{const id=setTimeout(drawThumbs,80);return()=>clearTimeout(id);},[drawThumbs,screen,mTab,panel]);

  /* Export */
  const handleExport=async()=>{
    if(!canvasRef.current)return;setSaving(true);
    await document.fonts.ready;drawMain();
    await new Promise(r=>setTimeout(r,80));
    const a=document.createElement("a");a.download=`maker-post-${Date.now()}.png`;
    a.href=canvasRef.current.toDataURL("image/png");a.click();
    setSaving(false);toast("Post exportado com sucesso!","success");
  };

  const pickTpl=id=>{
    const t=CREATOR_TPLS.find(x=>x.id===id);
    pushCr({tplId:id, fields:{...crSnap.fields, accent:t?.accent||crSnap.fields.accent}});
    setScreen("editor");
  };

  const onPhotoFile=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>setPhoto(ev.target.result);rd.readAsDataURL(f);};

  const filtered=CREATOR_TPLS.filter(t=>nicho==="todos"||t.tags.includes(nicho));
  const cvSize=isMobile?Math.min(window.innerWidth-16,450):Math.min(window.innerHeight-220,580);

  /* Shared styles */
  const INP={width:"100%",padding:"11px 14px",borderRadius:10,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border-color .15s,background .15s"};

  /* ════════════════════════════════
     GALLERY SCREEN
  ════════════════════════════════ */
  if(screen==="gallery") return (
    <div style={{minHeight:"100dvh",background:"#0a0a0f",color:"#fff",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>

      {/* Top bar */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(10,10,15,.94)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px",height:68,display:"flex",alignItems:"center",gap:20}}>
          <button onClick={onHome}
            style={{padding:"8px 16px",borderRadius:9,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.55)",fontSize:13,cursor:"pointer",fontWeight:700,transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.25)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.55)";}}>
            ← Voltar
          </button>
          <div style={{width:1,height:24,background:"rgba(255,255,255,.07)"}}/>
          <div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:"-.5px"}}>✦ Criar Post</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:1}}>Escolha um template e personalize em segundos</div>
          </div>
          <div style={{flex:1}}/>
          <div style={{fontSize:11,color:"rgba(255,255,255,.25)"}}>1080 × 1080px · PNG</div>
        </div>

        {/* Nicho filter bar */}
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 28px 16px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,.2)",fontWeight:700,letterSpacing:3,marginRight:4}}>CATEGORIA</span>
          {NICHO_FILTERS.map(n=>(
            <button key={n} onClick={()=>setNicho(n)}
              style={{padding:"6px 20px",borderRadius:999,fontSize:13,fontWeight:700,cursor:"pointer",
                background:nicho===n?"#fff":"transparent",
                border:nicho===n?"1px solid #fff":"1px solid rgba(255,255,255,.1)",
                color:nicho===n?"#0a0a0f":"rgba(255,255,255,.45)",
                textTransform:"capitalize",transition:"all .2s"}}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"36px 28px 64px"}}>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)",gap:isMobile?12:24}}>
          {filtered.map(tpl=>(
            <div key={tpl.id}
              style={{borderRadius:18,overflow:"hidden",cursor:"pointer",background:"rgba(255,255,255,.025)",border:"1.5px solid rgba(255,255,255,.06)",transition:"transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,border-color .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.01)";e.currentTarget.style.boxShadow="0 28px 60px rgba(0,0,0,.7)";e.currentTarget.style.borderColor="rgba(255,255,255,.18)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";}}>

              {/* Thumbnail canvas */}
              <div style={{position:"relative"}}>
                <canvas ref={el=>{if(el)thumbRefs.current[tpl.id]=el;}} width={300} height={300}
                  style={{width:"100%",aspectRatio:"1/1",display:"block"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 40%)"}}/>
                <div style={{position:"absolute",bottom:14,left:14,right:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,.8)"}}>
                    {tpl.emoji} {tpl.label}
                  </div>
                  <div style={{padding:"4px 14px",borderRadius:999,background:"rgba(255,255,255,.18)",backdropFilter:"blur(8px)",fontSize:11,fontWeight:700,color:"#fff",border:"1px solid rgba(255,255,255,.25)"}}>
                    Usar →
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:10}}
                onClick={()=>pickTpl(tpl.id)}>
                <div style={{width:24,height:24,borderRadius:6,background:tpl.accent,flexShrink:0}}/>
                <div style={{fontSize:11,color:"rgba(255,255,255,.35)",flex:1,textTransform:"capitalize"}}>
                  {tpl.tags.filter(t=>t!=="todos").join(" · ")||"universal"}
                </div>
                <button style={{padding:"7px 20px",borderRadius:8,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════
     EDITOR MOBILE
  ════════════════════════════════ */
  if(isMobile) return (
    <div style={{height:"100dvh",background:"#0a0a0f",color:"#fff",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden",WebkitTapHighlightColor:"transparent"}}>

      {/* Top bar */}
      <div style={{padding:"10px 14px",background:"rgba(10,10,15,.98)",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button onClick={()=>setScreen("gallery")}
          style={{padding:"8px 14px",borderRadius:9,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.55)",fontSize:12,cursor:"pointer",fontWeight:700}}>
          ← Templates
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800}}>{curTpl.emoji} {curTpl.label}</div>
        </div>
        <button onClick={undoCr} disabled={!canUndoCr} style={{padding:"7px 10px",borderRadius:7,background:canUndoCr?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canUndoCr?"#fff":"#333",fontSize:15,cursor:canUndoCr?"pointer":"default"}}>↩</button>
        <button onClick={redoCr} disabled={!canRedoCr} style={{padding:"7px 10px",borderRadius:7,background:canRedoCr?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canRedoCr?"#fff":"#333",fontSize:15,cursor:canRedoCr?"pointer":"default"}}>↪</button>
        <button onClick={handleExport} disabled={saving}
          style={{padding:"9px 20px",borderRadius:9,border:"none",color:"#fff",fontSize:13,fontWeight:800,cursor:saving?"default":"pointer",
            background:saving?"rgba(255,255,255,.06)":`linear-gradient(135deg,${fields.accent},${fields.accent}aa)`}}>
          {saving?"⏳":"⬇️ PNG"}
        </button>
      </div>

      {/* Canvas */}
      <div style={{flexShrink:0,background:"#050507",display:"flex",justifyContent:"center",alignItems:"center",padding:"14px 0"}}>
        <canvas ref={canvasRef} width={1080} height={1080}
          style={{width:cvSize,height:cvSize,borderRadius:12,boxShadow:"0 12px 50px rgba(0,0,0,.9)",display:"block"}}/>
      </div>

      {/* Tab bar */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(10,10,15,.98)",flexShrink:0}}>
        {[["foto","📷","Foto"],["texto","✏️","Texto"],["cor","🎨","Cor"],["layout","🎭","Layout"]].map(([t,ic,lb])=>(
          <button key={t} onClick={()=>setMTab(t)}
            style={{flex:1,padding:"10px 0",background:"none",border:"none",color:mTab===t?"#fff":"rgba(255,255,255,.28)",fontSize:10,fontWeight:800,cursor:"pointer",
              borderBottom:mTab===t?`2px solid ${fields.accent}`:"2px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"color .15s"}}>
            <span style={{fontSize:18}}>{ic}</span><span style={{letterSpacing:1}}>{lb.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
        {mTab==="foto"&&(
          <div style={{padding:18}}>
            <label style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:10}}>FOTO DO PRODUTO</label>
            {/* Preview */}
            {photoImg&&<div style={{aspectRatio:"1/1",borderRadius:14,overflow:"hidden",marginBottom:12,border:"2px solid rgba(255,255,255,.12)"}}>
              <img src={photo} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </div>}
            {/* Botões de upload */}
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <label style={{flex:1,padding:"14px 10px",borderRadius:12,border:"1.5px dashed rgba(255,255,255,.15)",cursor:"pointer",background:"rgba(255,255,255,.03)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,textAlign:"center"}}>
                <span style={{fontSize:28}}>🖼</span>
                <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.65)"}}>Galeria</span>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={onPhotoFile}/>
              </label>
              <label style={{flex:1,padding:"14px 10px",borderRadius:12,border:"1.5px dashed rgba(255,255,255,.15)",cursor:"pointer",background:"rgba(255,255,255,.03)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,textAlign:"center"}}>
                <span style={{fontSize:28}}>📷</span>
                <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.65)"}}>Câmera</span>
                <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhotoFile}/>
              </label>
            </div>
            {photoImg&&<button onClick={()=>setPhoto(null)}
              style={{width:"100%",padding:10,borderRadius:10,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.18)",color:"rgba(252,165,165,.8)",fontSize:13,cursor:"pointer",fontWeight:700}}>
              🗑 Remover foto
            </button>}
          </div>
        )}
        {mTab==="texto"&&(
          <div style={{padding:18,display:"flex",flexDirection:"column",gap:16}}>
            {[{k:"name",lb:"Nome do produto",ph:"Ex: iPhone 15 Pro",type:"text"},
              {k:"price",lb:"Preço (R$)",ph:"Ex: 299,90",type:"text"},
              {k:"discount",lb:"Desconto (%)",ph:"Ex: 30",type:"text"},
              {k:"cta",lb:"Botão de ação",ph:"Ex: Comprar agora",type:"text"}].map(({k,lb,ph})=>(
              <div key={k}>
                <label style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:8}}>{lb.toUpperCase()}</label>
                <input value={fields[k]} onChange={e=>sf(k,e.target.value)} placeholder={ph}
                  style={{...INP,fontSize:15}}
                  onFocus={e=>{e.target.style.borderColor="rgba(255,255,255,.3)";e.target.style.background="rgba(255,255,255,.09)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";e.target.style.background="rgba(255,255,255,.06)";}}/>
              </div>
            ))}
          </div>
        )}
        {mTab==="cor"&&(
          <div style={{padding:18}}>
            <label style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:12}}>COR DE DESTAQUE</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
              {ACCENT_PRESETS.map(c=>(
                <div key={c} onClick={()=>sf("accent",c)}
                  style={{width:52,height:52,borderRadius:14,background:c,cursor:"pointer",
                    border:fields.accent===c?"3px solid rgba(255,255,255,.9)":"3px solid rgba(255,255,255,.06)",
                    boxShadow:fields.accent===c?`0 0 0 3px ${c}55,0 0 20px ${c}88`:"none",
                    transition:"all .15s"}}/>
              ))}
            </div>
            <label style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:8}}>HEX PERSONALIZADO</label>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:12,background:fields.accent,border:"1px solid rgba(255,255,255,.12)",flexShrink:0}}/>
              <input value={fields.accent} onChange={e=>sf("accent",e.target.value)} placeholder="#7c3aed"
                style={{...INP,fontFamily:"monospace",flex:1}}
                onFocus={e=>{e.target.style.borderColor="rgba(255,255,255,.3)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";}}/>
            </div>
          </div>
        )}
        {mTab==="layout"&&(
          <div style={{padding:18,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {CREATOR_TPLS.map(tpl=>(
              <div key={tpl.id} onClick={()=>{setTplId(tpl.id);sf("accent",tpl.accent);}}
                style={{borderRadius:14,overflow:"hidden",cursor:"pointer",
                  border:tplId===tpl.id?`2px solid ${fields.accent}`:"2px solid rgba(255,255,255,.07)",
                  transition:"border-color .15s",background:tplId===tpl.id?"rgba(255,255,255,.04)":"transparent"}}>
                <canvas ref={el=>{if(el)thumbRefs.current[tpl.id]=el;}} width={300} height={300}
                  style={{width:"100%",aspectRatio:"1/1",display:"block"}}/>
                <div style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:3,background:tpl.accent,flexShrink:0}}/>
                  <div style={{fontSize:11,fontWeight:700,color:tplId===tpl.id?"#fff":"rgba(255,255,255,.45)"}}>{tpl.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ════════════════════════════════
     EDITOR DESKTOP
  ════════════════════════════════ */
  return (
    <div style={{height:"100vh",background:"#0a0a0f",color:"#fff",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>

      {/* Top bar */}
      <div style={{height:62,background:"rgba(10,10,15,.98)",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:16,padding:"0 24px",flexShrink:0}}>
        <button onClick={()=>setScreen("gallery")}
          style={{padding:"8px 18px",borderRadius:9,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",color:"rgba(255,255,255,.5)",fontSize:13,cursor:"pointer",fontWeight:700,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.25)";e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.08)";e.currentTarget.style.color="rgba(255,255,255,.5)";}}>
          ← Templates
        </button>
        <div style={{width:1,height:28,background:"rgba(255,255,255,.07)"}}/>
        <div style={{fontSize:15,fontWeight:800,letterSpacing:"-.3px"}}>{curTpl.emoji} {curTpl.label}</div>
        <div style={{flex:1}}/>
        <div style={{fontSize:11,color:"rgba(255,255,255,.2)",marginRight:8}}>1080 × 1080 · PNG</div>
        <button onClick={undoCr} disabled={!canUndoCr} style={{padding:"8px 13px",borderRadius:8,background:canUndoCr?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canUndoCr?"#fff":"#333",fontSize:16,cursor:canUndoCr?"pointer":"default"}} title="Ctrl+Z">↩</button>
        <button onClick={redoCr} disabled={!canRedoCr} style={{padding:"8px 13px",borderRadius:8,background:canRedoCr?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.1)",color:canRedoCr?"#fff":"#333",fontSize:16,cursor:canRedoCr?"pointer":"default"}} title="Ctrl+Y">↪</button>
        <button onClick={handleExport} disabled={saving}
          style={{padding:"10px 32px",borderRadius:10,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:saving?"default":"pointer",letterSpacing:"-.2px",transition:"opacity .15s",
            background:saving?"rgba(255,255,255,.06)":`linear-gradient(135deg,${fields.accent},${fields.accent}bb)`,
            boxShadow:saving?"none":`0 4px 24px ${fields.accent}55`}}>
          {saving?"Exportando...":"⬇️  Exportar PNG"}
        </button>
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* LEFT PANEL */}
        <div style={{width:300,borderRight:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",flexShrink:0,background:"rgba(255,255,255,.01)"}}>

          {/* Panel tab switcher */}
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.05)",flexShrink:0}}>
            {[["conteudo","Conteúdo"],["cor","Cor"],["layout","Layout"]].map(([t,lb])=>(
              <button key={t} onClick={()=>setPanel(t)}
                style={{flex:1,padding:"13px 0",background:"none",border:"none",color:panel===t?"#fff":"rgba(255,255,255,.28)",fontSize:11,fontWeight:800,cursor:"pointer",
                  borderBottom:panel===t?`2px solid ${fields.accent}`:"2px solid transparent",letterSpacing:1,transition:"color .15s"}}>
                {lb.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"20px 20px 28px"}}>

            {/* CONTEÚDO panel */}
            {panel==="conteudo"&&<>
              {/* Photo upload */}
              <label style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:10}}>FOTO DO PRODUTO</label>
              <label style={{display:"block",width:"100%",aspectRatio:"1/1",borderRadius:14,border:photoImg?"2px solid rgba(255,255,255,.12)":"2px dashed rgba(255,255,255,.08)",cursor:"pointer",overflow:"hidden",background:"rgba(255,255,255,.02)",marginBottom:12,transition:"border-color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=photoImg?"rgba(255,255,255,.25)":"rgba(255,255,255,.18)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=photoImg?"rgba(255,255,255,.12)":"rgba(255,255,255,.08)"}>
                {photoImg
                  ?<img src={photo} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  :<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,minHeight:180}}>
                    <div style={{fontSize:42}}>📷</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,.28)",fontWeight:600,textAlign:"center",lineHeight:1.6}}>Clique para adicionar<br/>foto do produto</div>
                    <div style={{padding:"5px 14px",borderRadius:7,border:"1px solid rgba(255,255,255,.1)",fontSize:10,color:"rgba(255,255,255,.18)"}}>PNG · JPG · WEBP</div>
                  </div>}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={onPhotoFile}/>
              </label>
              {photoImg&&<button onClick={()=>setPhoto(null)}
                style={{width:"100%",padding:8,borderRadius:9,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.15)",color:"rgba(252,165,165,.7)",fontSize:12,cursor:"pointer",fontWeight:700,marginBottom:18}}>
                🗑 Remover foto
              </button>}

              {/* Fields */}
              <div style={{height:1,background:"rgba(255,255,255,.05)",margin:"0 0 18px"}}/>
              <label style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:14}}>INFORMAÇÕES</label>
              {[{k:"name",lb:"Nome do produto",ph:"Ex: iPhone 15 Pro Max"},
                {k:"price",lb:"Preço",ph:"Ex: 4.499,00"},
                {k:"discount",lb:"Desconto (%)",ph:"Ex: 20"},
                {k:"cta",lb:"Botão de ação",ph:"Ex: Comprar agora"}].map(({k,lb,ph})=>(
                <div key={k} style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.32)",marginBottom:6,fontWeight:600}}>{lb}</div>
                  <input value={fields[k]} onChange={e=>sf(k,e.target.value)} placeholder={ph} style={INP}
                    onFocus={e=>{e.target.style.borderColor="rgba(255,255,255,.3)";e.target.style.background="rgba(255,255,255,.09)";}}
                    onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";e.target.style.background="rgba(255,255,255,.06)";}}/>
                </div>
              ))}
            </>}

            {/* COR panel */}
            {panel==="cor"&&<>
              <label style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:14}}>COR DE DESTAQUE</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
                {ACCENT_PRESETS.map(c=>(
                  <div key={c} onClick={()=>sf("accent",c)}
                    style={{width:42,height:42,borderRadius:12,background:c,cursor:"pointer",
                      border:fields.accent===c?"3px solid rgba(255,255,255,.9)":"3px solid rgba(255,255,255,.05)",
                      boxShadow:fields.accent===c?`0 0 0 3px ${c}44,0 0 18px ${c}77`:"none",
                      transition:"all .15s"}}/>
                ))}
              </div>
              <label style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:8}}>HEX PERSONALIZADO</label>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:fields.accent,border:"1px solid rgba(255,255,255,.12)",flexShrink:0}}/>
                <input value={fields.accent} onChange={e=>sf("accent",e.target.value)} placeholder="#7c3aed"
                  style={{...INP,fontFamily:"monospace",flex:1}}
                  onFocus={e=>{e.target.style.borderColor="rgba(255,255,255,.3)";}}
                  onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.1)";}}/>
              </div>
              {/* Live preview swatch */}
              <div style={{marginTop:20,padding:16,borderRadius:12,background:fields.accent,border:"1px solid rgba(255,255,255,.1)"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#fff",opacity:.7,marginBottom:4}}>PREVIEW</div>
                <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>R$ {fields.price||"299,90"}</div>
                <div style={{marginTop:8,padding:"6px 16px",borderRadius:999,background:"rgba(255,255,255,.85)",fontSize:11,fontWeight:800,color:fields.accent,display:"inline-block"}}>{fields.cta||"Comprar"}</div>
              </div>
            </>}

            {/* LAYOUT panel */}
            {panel==="layout"&&<>
              <label style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:3,fontWeight:700,display:"block",marginBottom:14}}>TEMPLATES</label>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {CREATOR_TPLS.map(tpl=>(
                  <div key={tpl.id} onClick={()=>{setTplId(tpl.id);sf("accent",tpl.accent);setPanel("conteudo");}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,cursor:"pointer",
                      background:tplId===tpl.id?"rgba(255,255,255,.07)":"rgba(255,255,255,.025)",
                      border:tplId===tpl.id?`1.5px solid ${tpl.accent}88`:"1.5px solid rgba(255,255,255,.06)",
                      transition:"all .15s"}}
                    onMouseEnter={e=>{if(tplId!==tpl.id)e.currentTarget.style.background="rgba(255,255,255,.04)";}}
                    onMouseLeave={e=>{if(tplId!==tpl.id)e.currentTarget.style.background="rgba(255,255,255,.025)";}}>
                    <canvas ref={el=>{if(el)thumbRefs.current[tpl.id]=el;}} width={300} height={300}
                      style={{width:52,height:52,borderRadius:8,flexShrink:0,display:"block"}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:800,color:tplId===tpl.id?"#fff":"rgba(255,255,255,.65)"}}>{tpl.emoji} {tpl.label}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,.28)",marginTop:2,textTransform:"capitalize"}}>{tpl.tags.filter(t=>t!=="todos").join(", ")||"universal"}</div>
                    </div>
                    {tplId===tpl.id&&<div style={{fontSize:11,color:tpl.accent,fontWeight:800}}>✓</div>}
                  </div>
                ))}
              </div>
            </>}
          </div>
        </div>

        {/* CENTER — Canvas */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#050507",gap:16,padding:"20px"}}>
          <canvas ref={canvasRef} width={1080} height={1080}
            style={{width:cvSize,height:cvSize,borderRadius:16,boxShadow:"0 32px 80px rgba(0,0,0,.95)",display:"block",flexShrink:0}}/>
          {/* Template strip */}
          <div style={{display:"flex",gap:8,flexShrink:0,overflowX:"auto",maxWidth:cvSize,paddingBottom:4}}>
            {CREATOR_TPLS.map(tpl=>(
              <div key={tpl.id} onClick={()=>{setTplId(tpl.id);sf("accent",tpl.accent);}} title={tpl.label}
                style={{flexShrink:0,borderRadius:10,overflow:"hidden",cursor:"pointer",position:"relative",
                  border:tplId===tpl.id?`2.5px solid ${fields.accent}`:"2.5px solid rgba(255,255,255,.07)",
                  transition:"border-color .15s,transform .15s",transform:tplId===tpl.id?"scale(1.09)":"scale(1)"}}>
                <canvas ref={el=>{if(el)thumbRefs.current[tpl.id]=el;}} width={200} height={200}
                  style={{width:68,height:68,display:"block"}}/>
                {tplId===tpl.id&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.18)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:fields.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>✓</div>
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [mode, setMode] = useState("home");
  const toasts = useToast();
  return (
    <>
      {mode==="home"    && <HomeScreen onSelect={setMode}/>}
      {mode==="photo"   && <PhotoEditor onSwitch={()=>setMode("post")} onHome={()=>setMode("home")}/>}
      {mode==="post"    && <PostEditor  onSwitch={()=>setMode("photo")} onHome={()=>setMode("home")}/>}
      {mode==="collage" && <CollageEditor onHome={()=>setMode("home")}/>}
      {mode==="creator" && <PostCreator onHome={()=>setMode("home")}/>}
      <ToastContainer toasts={toasts}/>
    </>
  );
}
