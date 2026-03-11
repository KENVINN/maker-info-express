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
  { id:"aesthetic",   label:"Aesthetic",     cat:"🌸 Suave",      