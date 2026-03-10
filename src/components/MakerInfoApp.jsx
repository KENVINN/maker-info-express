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
  { id:"none",      label:"Original",  adj:{} },
  { id:"natural",   label:"Natural",   adj:{ brightness:5, contrast:5, saturation:5 } },
  { id:"vivid",     label:"Vibrante",  adj:{ brightness:5, contrast:15, saturation:40 } },
  { id:"pastel",    label:"Pastel",    adj:{ brightness:15, saturation:-20, fade:20 } },
  { id:"aesthetic", label:"Aesthetic", adj:{ brightness:8, saturation:-10, fade:15, temperature:-10 } },
  { id:"golden",    label:"Golden",    adj:{ brightness:10, contrast:5, saturation:20, temperature:40 } },
  { id:"moody",     label:"Moody",     adj:{ brightness:-10, contrast:25, saturation:-15, shadows:-10 } },
  { id:"cinema",    label:"Cinema",    adj:{ brightness:-5, contrast:30, saturation:-20, temperature:-15, fade:10 } },
  { id:"vintage",   label:"Vintage",   adj:{ brightness:5, contrast:-10, saturation:-30, temperature:30, fade:25, grain:20 } },
  { id:"bw",        label:"P&B",       adj:{ saturation:-100, contrast:10 } },
  { id:"bwsoft",    label:"P&B Soft",  adj:{ saturation:-100, brightness:10, fade:15 } },
  { id:"fade",      label:"Fade",      adj:{ fade:35, saturation:-10, brightness:5 } },
  { id:"warm",      label:"Quente",    adj:{ temperature:45, saturation:10, brightness:5 } },
  { id:"cold",      label:"Frio",      adj:{ temperature:-45, saturation:5, contrast:10 } },
  { id:"pink",      label:"Rosa",      adj:{ temperature:20, saturation:15, brightness:8, fade:10 } },
  { id:"dramatic",  label:"Dramático", adj:{ contrast:40, saturation:20, brightness:-5, shadows:-20, highlights:15 } },
];

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
  // ✍️ Cursivas / manuscritas
  { name:"Dancing Script",     label:"Dancing Script",    cat:"✍️ Cursiva" },
  { name:"Pacifico",           label:"Pacifico",          cat:"✍️ Cursiva" },
  { name:"Great Vibes",        label:"Great Vibes",       cat:"✍️ Cursiva" },
  { name:"Satisfy",            label:"Satisfy",           cat:"✍️ Cursiva" },
  { name:"Sacramento",         label:"Sacramento",        cat:"✍️ Cursiva" },
  { name:"Allura",             label:"Allura",            cat:"✍️ Cursiva" },
  { name:"Italianno",          label:"Italianno",         cat:"✍️ Cursiva" },
  { name:"Lobster",            label:"Lobster",           cat:"✍️ Cursiva" },
  { name:"Courgette",          label:"Courgette",         cat:"✍️ Cursiva" },
  { name:"Kaushan Script",     label:"Kaushan Script",    cat:"✍️ Cursiva" },
  { name:"Alex Brush",         label:"Alex Brush",        cat:"✍️ Cursiva" },
  { name:"Pinyon Script",      label:"Pinyon Script",     cat:"✍️ Cursiva" },
  { name:"Mr Dafoe",           label:"Mr Dafoe",          cat:"✍️ Cursiva" },
  { name:"Clicker Script",     label:"Clicker Script",    cat:"✍️ Cursiva" },
  // 💎 Serif elegante (revista de moda)
  { name:"Playfair Display",   label:"Playfair Display",  cat:"💎 Elegante" },
  { name:"Cormorant Garamond", label:"Cormorant",         cat:"💎 Elegante" },
  { name:"Libre Baskerville",  label:"Baskerville",       cat:"💎 Elegante" },
  { name:"EB Garamond",        label:"EB Garamond",       cat:"💎 Elegante" },
  { name:"Cardo",              label:"Cardo",             cat:"💎 Elegante" },
  { name:"Crimson Text",       label:"Crimson Text",      cat:"💎 Elegante" },
  { name:"Lora",               label:"Lora",              cat:"💎 Elegante" },
  { name:"DM Serif Display",   label:"DM Serif",          cat:"💎 Elegante" },
  // 🤍 Clean / minimalista
  { name:"Lato",               label:"Lato",              cat:"🤍 Clean" },
  { name:"Nunito",             label:"Nunito",            cat:"🤍 Clean" },
  { name:"Quicksand",          label:"Quicksand",         cat:"🤍 Clean" },
  { name:"Josefin Sans",       label:"Josefin Sans",      cat:"🤍 Clean" },
  { name:"Raleway",            label:"Raleway",           cat:"🤍 Clean" },
  { name:"Poppins",            label:"Poppins",           cat:"🤍 Clean" },
  { name:"Montserrat",         label:"Montserrat",        cat:"🤍 Clean" },
  { name:"Jost",               label:"Jost",              cat:"🤍 Clean" },
  { name:"DM Sans",            label:"DM Sans",           cat:"🤍 Clean" },
  { name:"Inter",              label:"Inter",             cat:"🤍 Clean" },
  // 🌸 Display decorativas (flores / ornamentos)
  { name:"Amatic SC",          label:"Amatic SC",         cat:"🌸 Decorativa" },
  { name:"Caveat",             label:"Caveat",            cat:"🌸 Decorativa" },
  { name:"Permanent Marker",   label:"Permanent Marker",  cat:"🌸 Decorativa" },
  { name:"Indie Flower",       label:"Indie Flower",      cat:"🌸 Decorativa" },
  { name:"Patrick Hand",       label:"Patrick Hand",      cat:"🌸 Decorativa" },
  { name:"Shadows Into Light", label:"Shadows Into Light",cat:"🌸 Decorativa" },
  { name:"Just Another Hand",  label:"Just Another Hand", cat:"🌸 Decorativa" },
  { name:"Rock Salt",          label:"Rock Salt",         cat:"🌸 Decorativa" },
  // 📐 Condensadas dramáticas
  { name:"Barlow Condensed",   label:"Barlow Condensed",  cat:"📐 Condensada" },
  { name:"Oswald",             label:"Oswald",            cat:"📐 Condensada" },
  { name:"League Gothic",      label:"League Gothic",     cat:"📐 Condensada" },
  { name:"Kanit",              label:"Kanit",             cat:"📐 Condensada" },
  // 🎞 Retrô / vintage (anos 70-80)
  { name:"Pacifico",           label:"Pacifico ✓",        cat:"🎞 Retrô" },
  { name:"Fredoka One",        label:"Fredoka One",       cat:"🎞 Retrô" },
  { name:"Boogaloo",           label:"Boogaloo",          cat:"🎞 Retrô" },
  { name:"Baloo 2",            label:"Baloo 2",           cat:"🎞 Retrô" },
  { name:"Righteous",          label:"Righteous",         cat:"🎞 Retrô" },
  { name:"Lilita One",         label:"Lilita One",        cat:"🎞 Retrô" },
  { name:"Russo One",          label:"Russo One",         cat:"🎞 Retrô" },
  { name:"Titan One",          label:"Titan One",         cat:"🎞 Retrô" },
];

const FONTS_ANUNCIO = [
  // 🔥 Ultra bold condensada (outdoor / banner)
  { name:"Bebas Neue",         label:"Bebas Neue",        cat:"🔥 Ultra Bold" },
  { name:"Anton",              label:"Anton",             cat:"🔥 Ultra Bold" },
  { name:"Barlow Condensed",   label:"Barlow Condensed",  cat:"🔥 Ultra Bold" },
  { name:"Teko",               label:"Teko",              cat:"🔥 Ultra Bold" },
  { name:"Fjalla One",         label:"Fjalla One",        cat:"🔥 Ultra Bold" },
  { name:"Squada One",         label:"Squada One",        cat:"🔥 Ultra Bold" },
  { name:"Oswald",             label:"Oswald",            cat:"🔥 Ultra Bold" },
  { name:"Black Ops One",      label:"Black Ops One",     cat:"🔥 Ultra Bold" },
  { name:"Stint Ultra Condensed",label:"Stint Ultra",     cat:"🔥 Ultra Bold" },
  // ⚡ Geométrica moderna (tech / startup)
  { name:"Exo 2",              label:"Exo 2",             cat:"⚡ Geométrica" },
  { name:"Rajdhani",           label:"Rajdhani",          cat:"⚡ Geométrica" },
  { name:"Jost",               label:"Jost",              cat:"⚡ Geométrica" },
  { name:"Montserrat",         label:"Montserrat",        cat:"⚡ Geométrica" },
  { name:"Nunito Sans",        label:"Nunito Sans",       cat:"⚡ Geométrica" },
  { name:"Space Grotesk",      label:"Space Grotesk",     cat:"⚡ Geométrica" },
  // 💪 Slab serif (autoridade / confiança)
  { name:"Alfa Slab One",      label:"Alfa Slab One",     cat:"💪 Slab" },
  { name:"Rokkitt",            label:"Rokkitt",           cat:"💪 Slab" },
  { name:"Arvo",               label:"Arvo",              cat:"💪 Slab" },
  { name:"Zilla Slab",         label:"Zilla Slab",        cat:"💪 Slab" },
  { name:"Crete Round",        label:"Crete Round",       cat:"💪 Slab" },
  // 🚀 Display futurista (cyberpunk / neon)
  { name:"Orbitron",           label:"Orbitron",          cat:"🚀 Futurista" },
  { name:"Audiowide",          label:"Audiowide",         cat:"🚀 Futurista" },
  { name:"Syncopate",          label:"Syncopate",         cat:"🚀 Futurista" },
  { name:"Share Tech Mono",    label:"Share Tech Mono",   cat:"🚀 Futurista" },
  { name:"Major Mono Display", label:"Major Mono",        cat:"🚀 Futurista" },
  { name:"Nova Square",        label:"Nova Square",       cat:"🚀 Futurista" },
  // 🏋️ Heavy impact (esporte / energia)
  { name:"Russo One",          label:"Russo One",         cat:"🏋️ Heavy" },
  { name:"Boogaloo",           label:"Boogaloo",          cat:"🏋️ Heavy" },
  { name:"Passion One",        label:"Passion One",       cat:"🏋️ Heavy" },
  { name:"Lilita One",         label:"Lilita One",        cat:"🏋️ Heavy" },
  { name:"Titan One",          label:"Titan One",         cat:"🏋️ Heavy" },
  { name:"Righteous",          label:"Righteous",         cat:"🏋️ Heavy" },
  // 🎪 Tipografia de pôster (anos 50-60)
  { name:"Abril Fatface",      label:"Abril Fatface",     cat:"🎪 Pôster" },
  { name:"Fredoka One",        label:"Fredoka One",       cat:"🎪 Pôster" },
  { name:"Lobster",            label:"Lobster",           cat:"🎪 Pôster" },
  { name:"Pacifico",           label:"Pacifico",          cat:"🎪 Pôster" },
  { name:"Boogaloo",           label:"Boogaloo ✓",        cat:"🎪 Pôster" },
  { name:"Lilita One",         label:"Lilita One ✓",      cat:"🎪 Pôster" },
];
const mkPhotoText = (o={}) => ({ id:uid(), kind:"text", x:40, y:200, w:340, h:60, rotation:0,
  text:"Texto", fontSize:36, color:"#ffffff", fontFamily:"Barlow Condensed", fontWeight:"700",
  align:"center", letterSpacing:0, opacity:1, shadowBlur:8, shadowColor:"#000", shadowX:0, shadowY:2,
  outline:false, outlineColor:"#000", outlineWidth:2, useGradient:false,
  gradientColor1:"#fff", gradientColor2:"#f5c518", gradientAngle:135, ...o });

const gradCSS = e => `linear-gradient(${e.gradientAngle||135}deg,${e.gradientColor1||"#fff"},${e.gradientColor2||"#f5c518"})`;

/* ── Photo text visual ── */
function PhotoTextView({ el }) {
  const rot  = el.rotation ? `rotate(${el.rotation}deg)` : undefined;
  const base = { position:"absolute", left:el.x, top:el.y, width:el.w, opacity:el.opacity??1,
    transform:rot, transformOrigin:"center center", pointerEvents:"none", userSelect:"none" };
  const shadow = `${el.shadowX||0}px ${el.shadowY||2}px ${el.shadowBlur||8}px ${el.shadowColor||"#000"}`;
  const outline = el.outline ? { WebkitTextStroke:`${el.outlineWidth||2}px ${el.outlineColor||"#000"}` } : {};
  if (el.useGradient) return (
    <div style={{ ...base, fontSize:el.fontSize, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
      textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1, whiteSpace:"pre-wrap", wordBreak:"break-word",
      background:gradCSS(el), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      backgroundClip:"text", filter:`drop-shadow(${shadow})`, ...outline }}>{el.text}</div>
  );
  return (
    <div style={{ ...base, fontSize:el.fontSize, color:el.color, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
      textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1, whiteSpace:"pre-wrap",
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
      style={{ position:"absolute", left:el.x, top:el.y, width:el.w, minHeight:el.h||60, fontSize:el.fontSize,
        color:el.useGradient?"#fff":el.color, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
        textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.1,
        background:"rgba(255,255,255,.12)", border:"2px solid #fff", borderRadius:4, outline:"none",
        resize:"none", padding:2, zIndex:50, boxSizing:"border-box",
        transform:el.rotation?`rotate(${el.rotation}deg)`:"none", transformOrigin:"center center" }}/>
  );
}

/* ── Draggable text on photo ── */
const PT_HANDLES = [{id:"se",cx:1,cy:1},{id:"sw",cx:0,cy:1},{id:"ne",cx:1,cy:0},{id:"nw",cx:0,cy:0}];
function PhotoTextEl({ el, selected, onSelect, onUpdate, onEdit, scale }) {
  const st = useRef({ mode:null }); const wrapRef = useRef(null); const lastTap = useRef(0); const HS=18;
  const startDrag=(e)=>{ if(el.locked){onSelect(el.id);return;} e.stopPropagation();e.preventDefault();
    const now=Date.now(); if(now-lastTap.current<380){onEdit(el.id);return;} lastTap.current=now;
    onSelect(el.id); const p=getPoint(e); st.current={mode:"drag",sx:p.x,sy:p.y,ox:el.x,oy:el.y}; bind(); };
  const startRes=(e,h)=>{e.stopPropagation();e.preventDefault();const p=getPoint(e);st.current={mode:"resize",h,sx:p.x,sy:p.y,ox:el.x,oy:el.y,ow:el.w,oh:el.h};bind();};
  const startRot=(e)=>{e.stopPropagation();e.preventDefault();const r=wrapRef.current?.getBoundingClientRect();if(!r)return;const cx=r.left+r.width/2,cy=r.top+r.height/2;const p=getPoint(e);st.current={mode:"rotate",cx,cy,sa:Math.atan2(p.y-cy,p.x-cx)*180/Math.PI,or:el.rotation||0};bind();};
  const onMove=useCallback((e)=>{const d=st.current;if(!d.mode)return;const p=getPoint(e);const dx=(p.x-d.sx)/scale,dy=(p.y-d.sy)/scale;
    if(d.mode==="drag")onUpdate(el.id,{x:Math.round(d.ox+dx),y:Math.round(d.oy+dy)});
    if(d.mode==="rotate"){const a=Math.atan2(p.y-d.cy,p.x-d.cx)*180/Math.PI;onUpdate(el.id,{rotation:Math.round((d.or+(a-d.sa)+360)%360)});}
    if(d.mode==="resize"){const h=d.h;let nx=d.ox,ny=d.oy,nw=d.ow,nh=d.oh;
      if(h.includes("e"))nw=Math.max(20,d.ow+dx);if(h.includes("s"))nh=Math.max(20,d.oh+dy);
      if(h.includes("w")){nw=Math.max(20,d.ow-dx);nx=d.ox+(d.ow-nw);}if(h.includes("n")){nh=Math.max(20,d.oh-dy);ny=d.oy+(d.oh-nh);}
      onUpdate(el.id,{x:Math.round(nx),y:Math.round(ny),w:Math.round(nw),h:Math.round(nh)});}
  },[el.id,scale,onUpdate]);
  const onUp=useCallback(()=>{st.current.mode=null;unbind();},[]);
  const bind=()=>{window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);window.addEventListener("touchmove",onMove,{passive:false});window.addEventListener("touchend",onUp);};
  const unbind=()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  useEffect(()=>()=>unbind(),[]);
  return (
    <div ref={wrapRef} style={{ position:"absolute",left:el.x,top:el.y,width:el.w,height:el.h||60,cursor:"move",
      outline:selected?"2px dashed rgba(255,255,255,.8)":"2px solid transparent", boxSizing:"border-box",
      transform:el.rotation?`rotate(${el.rotation}deg)`:"none",transformOrigin:"center center",touchAction:"none" }}
      onMouseDown={startDrag} onTouchStart={startDrag}>
      <PhotoTextView el={{...el,x:0,y:0}}/>
      {selected && <>
        {PT_HANDLES.map(h=>(
          <div key={h.id} onMouseDown={e=>startRes(e,h.id)} onTouchStart={e=>startRes(e,h.id)}
            style={{ position:"absolute",width:HS,height:HS,background:"#fff",border:"2px solid #000",borderRadius:3,zIndex:10,
              left:`calc(${h.cx*100}% - ${HS/2}px)`,top:`calc(${h.cy*100}% - ${HS/2}px)`,cursor:"nwse-resize",touchAction:"none" }}/>
        ))}
        <div onMouseDown={startRot} onTouchStart={startRot}
          style={{ position:"absolute",width:22,height:22,background:"#f5c518",border:"2px solid #fff",borderRadius:"50%",
            top:-36,left:"50%",transform:"translateX(-50%)",cursor:"crosshair",zIndex:11,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,touchAction:"none",boxShadow:"0 0 8px rgba(245,197,24,.8)" }}>↻</div>
        <div style={{ position:"absolute",width:2,height:22,background:"rgba(245,197,24,.4)",top:-16,left:"50%",transform:"translateX(-50%)",zIndex:10,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",fontSize:9,color:"rgba(255,255,255,.8)",background:"rgba(0,0,0,.6)",padding:"2px 7px",borderRadius:3,whiteSpace:"nowrap",pointerEvents:"none" }}>2× para editar</div>
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
  const [adj, setAdj]             = useState(defaultAdj());
  const [activeFilter, setActiveFilter] = useState("none");
  const [lightFx, setLightFx]     = useState("none");
  const [border, setBorder]       = useState("none");
  const [tab, setTab]             = useState("filters");
  const [texts, setTexts]         = useState([]);
  const [blurs, setBlurs]         = useState([]); // selective blur regions
  const [selTextId, setSelTextId] = useState(null);
  const [editTextId, setEditTextId] = useState(null);
  const [showBefore, setShowBefore] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [flipH, setFlipH]         = useState(false);
  const [flipV, setFlipV]         = useState(false);
  const [zoom, setZoom]           = useState(1);
  const [crop, setCrop]           = useState(null); // {x,y,w,h} in % or null
  const [cropping, setCropping]   = useState(false);
  const [cropRatio, setCropRatio] = useState("free");
  const [cropDrag, setCropDrag]   = useState(null);
  const [savedPresets, setSavedPresets] = useState([]);
  const [presetName, setPresetName] = useState("");
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [activeAdj, setActiveAdj] = useState(null);
  const [drawMode, setDrawMode]   = useState(false);
  const [drawings, setDrawings]   = useState([]); // strokes
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
    l.href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Sacramento&family=Allura&family=Italianno&family=Lobster&family=Courgette&family=Kaushan+Script&family=Alex+Brush&family=Pinyon+Script&family=Mr+Dafoe&family=Clicker+Script&family=Playfair+Display:wght@400;700;900&family=Cormorant+Garamond:wght@400;600&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;700&family=Cardo:wght@400;700&family=Crimson+Text:wght@400;700&family=Lora:wght@400;700&family=DM+Serif+Display&family=Lato:wght@300;400;700&family=Nunito:wght@400;700;900&family=Quicksand:wght@400;700&family=Josefin+Sans:wght@400;700&family=Raleway:wght@400;700;900&family=Poppins:wght@400;700;900&family=Montserrat:wght@400;700;900&family=Jost:wght@400;700&family=DM+Sans:wght@400;700&family=Inter:wght@400;700&family=Amatic+SC:wght@400;700&family=Caveat:wght@400;700&family=Permanent+Marker&family=Indie+Flower&family=Patrick+Hand&family=Shadows+Into+Light&family=Just+Another+Hand&family=Rock+Salt&family=Barlow+Condensed:wght@400;700;900&family=Oswald:wght@400;700&family=League+Gothic&family=Kanit:wght@400;700;900&family=Fredoka+One&family=Boogaloo&family=Baloo+2:wght@400;700&family=Righteous&family=Lilita+One&family=Russo+One&family=Titan+One&family=Bebas+Neue&family=Anton&family=Teko:wght@400;700&family=Fjalla+One&family=Squada+One&family=Black+Ops+One&family=Exo+2:wght@400;700;900&family=Rajdhani:wght@400;700&family=Nunito+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&family=Alfa+Slab+One&family=Rokkitt:wght@400;700&family=Arvo:wght@400;700&family=Zilla+Slab:wght@400;700&family=Crete+Round&family=Orbitron:wght@400;700;900&family=Audiowide&family=Syncopate:wght@400;700&family=Share+Tech+Mono&family=Major+Mono+Display&family=Nova+Square&family=Passion+One:wght@400;700;900&family=Abril+Fatface&display=swap";
    document.head.appendChild(l);
  },[]);

  useEffect(()=>{
    const p=e=>{if(e.target.closest("[data-canvas]"))e.preventDefault();};
    document.addEventListener("touchmove",p,{passive:false});
    return()=>document.removeEventListener("touchmove",p);
  },[]);

  const handleUpload = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev => { setPhoto(ev.target.result); setCrop(null); setZoom(1); }; r.readAsDataURL(f);
  };

  // ── Remover Fundo (client-side, sem API, sem limite) ──
  const [removingBg, setRemovingBg]   = useState(false);
  const [bgRemoveProgress, setBgRemoveProgress] = useState(""); // status text
  const removeBg = async () => {
    if(!photo||removingBg) return;
    setRemovingBg(true); setBgRemoveProgress("Carregando modelo IA...");
    try {
      // Dynamic import via esm.sh CDN — cached após 1ª vez
      const { removeBackground } = await import("https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/web/index.js");
      setBgRemoveProgress("Processando imagem...");
      // Convert dataURL → Blob
      const res = await fetch(photo);
      const blob = await res.blob();
      const resultBlob = await removeBackground(blob, {
        progress: (key, cur, total) => {
          if(total>0) setBgRemoveProgress(`Baixando modelo: ${Math.round(cur/total*100)}%`);
        },
        publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
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
  const undoDraw=()=>setDrawings(p=>p.slice(0,-1));
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
  const updateText = useCallback((id,patch)=>setTexts(p=>p.map(e=>e.id===id?{...e,...patch}:e)),[]);
  const deleteText = () => { if(!selTextId) return; setTexts(p=>p.filter(e=>e.id!==selTextId)); setSelTextId(null); };

  // ✨ Auto-enhance — aplica ajustes inteligentes
  const autoEnhance = () => {
    setAdj({ brightness:8, contrast:12, saturation:18, temperature:5, sharpness:20,
              fade:0, vignette:20, grain:0, highlights:-10, shadows:10 });
    setActiveFilter("none");
  };

  // 💾 Salvar projeto como JSON
  const saveProject = () => {
    const data = { version:1, type:"photo", adj, activeFilter, lightFx, border, flipH, flipV,
      texts: texts.map(({src,...t})=>t) };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const link = document.createElement("a"); link.download="foto-projeto.json";
    link.href = URL.createObjectURL(blob); link.click();
  };

  // 📂 Carregar projeto JSON
  const loadProject = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.type !== "photo") { alert("Este arquivo é de um projeto de Post, não de foto."); return; }
        if(d.adj) setAdj(d.adj); if(d.activeFilter) setActiveFilter(d.activeFilter);
        if(d.lightFx) setLightFx(d.lightFx); if(d.border) setBorder(d.border);
        if(d.flipH !== undefined) setFlipH(d.flipH); if(d.flipV !== undefined) setFlipV(d.flipV);
        if(d.texts) setTexts(d.texts.map(t=>({...t, id:uid()})));
        alert("Projeto carregado! (a foto original precisa ser selecionada novamente)");
      } catch { alert("Arquivo inválido."); }
    }; r.readAsText(f);
  };

  const savePreset = () => {
    if(!presetName.trim()) return;
    setSavedPresets(p=>[...p, { id:uid(), name:presetName.trim(), adj:{ ...adj }, filter:activeFilter }]);
    setPresetName(""); setShowSavePreset(false);
  };
  const loadPreset = (pr) => { setActiveFilter(pr.filter); setAdj(pr.adj); };

  const handleExport = async () => {
    if(!photoRef.current) return; setSaving(true);
    try {
      const h2c = window.html2canvas; if(!h2c){alert("Aguarde e tente novamente.");setSaving(false);return;}
      setSelTextId(null); setEditTextId(null); await new Promise(r=>setTimeout(r,150));
      const canvas = await h2c(photoRef.current, { scale:2, useCORS:true, allowTaint:true, backgroundColor:null, logging:false });
      const link = document.createElement("a"); link.download=`foto-editada.png`;
      link.href = canvas.toDataURL("image/png"); link.click();
    } catch(err){ console.error(err); alert("Erro ao exportar."); }
    setSaving(false);
  };

  const selText = texts.find(e=>e.id===selTextId);

  // Canvas preview scale
  const maxW = isMobile ? Math.min(window.innerWidth-16, 400) : 420;
  const IMG_W = 420, IMG_H = 420;
  const scale = maxW / IMG_W;
  const cvW = Math.round(IMG_W * scale);
  const cvH = Math.round(IMG_H * scale);

  /* Style helpers */
  const C = { background:"#060a14" };
  const I = { width:"100%", padding:"9px 11px", borderRadius:7, fontSize:12, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.09)", color:"#fff", outline:"none", boxSizing:"border-box" };
  const L = (c="#00d4ff")=>({ fontSize:8, color:c, letterSpacing:3, display:"block", marginBottom:4, textTransform:"uppercase" });
  const iB=(on,c="#00d4ff")=>({ padding:"8px 10px", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700, background:on?`${c}22`:"rgba(255,255,255,.04)", border:on?`1px solid ${c}66`:"1px solid rgba(255,255,255,.06)", color:on?c:"#3a4060" });
  const tabActive = (t) => tab===t;

  /* ── MOBILE LAYOUT ── */
  if (isMobile) return (
    <div style={{ minHeight:"100vh", background:"#000", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff", display:"flex", flexDirection:"column", WebkitTapHighlightColor:"transparent", overscrollBehavior:"none" }}>
      {/* Top bar */}
      <div style={{ background:"rgba(0,0,0,.95)", backdropFilter:"blur(12px)", padding:"10px 14px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
        <button onClick={onHome} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#aaa", fontSize:10, fontWeight:700, cursor:"pointer" }}>🏠</button>
        <button onClick={onSwitch} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(0,212,255,.1)", border:"1px solid rgba(0,212,255,.3)", color:"#00d4ff", fontSize:10, fontWeight:700, cursor:"pointer" }}>⚡ Posts</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:13, fontWeight:900 }}>📷 Editor de Fotos</div>
        </div>
        {photo && <button onClick={saveProject} style={{ padding:"6px 10px", borderRadius:7, background:"rgba(245,197,24,.1)", border:"1px solid rgba(245,197,24,.3)", color:"#f5c518", fontSize:10, fontWeight:700, cursor:"pointer" }}>💾</button>}
        <label style={{ padding:"6px 10px", borderRadius:7, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"#888", fontSize:10, fontWeight:700, cursor:"pointer" }}>📂<input type="file" accept=".json" onChange={loadProject} style={{ display:"none" }}/></label>
        <button onClick={handleExport} disabled={!photo||saving} style={{ padding:"8px 14px", borderRadius:8, cursor:(!photo||saving)?"default":"pointer", fontSize:12, fontWeight:900, background:(!photo||saving)?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)", border:"none", color:(!photo||saving)?"#444":"#000" }}>
          {saving?"⏳":"⬇️"}
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex:"0 0 auto", display:"flex", justifyContent:"center", alignItems:"center", padding:"10px 8px", background:"#000" }}>
        {!photo ? (
          <label style={{ width:cvW, height:220, borderRadius:16, border:"2px dashed rgba(255,255,255,.12)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:10, background:"rgba(255,255,255,.02)" }}>
            <div style={{ fontSize:48 }}>📷</div>
            <div style={{ fontSize:14, color:"#3a5070", fontWeight:700 }}>Toque para escolher uma foto</div>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }} capture="environment"/>
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
            <div style={{ display:"flex", gap:4, padding:"12px 8px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
              {FILTERS.map(f=><FilterThumb key={f.id} filter={f} adj={adj} img={photo} selected={activeFilter===f.id} onClick={()=>applyFilter(f.id)}/>)}
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
                {/* Font picker — horizontal scroll */}
                <div style={{ marginBottom:6 }}>
                  <span style={L()}>Fonte</span>
                  <div style={{ display:"flex", gap:5, overflowX:"auto", WebkitOverflowScrolling:"touch", paddingBottom:4 }}>
                    {FONTS_INSTAGRAM.map(f=>(
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
        <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,.06)", overflowX:"auto" }}>
          {[["filters","🎨","Filtros"],["adjust","⚙️","Ajustes"],["text","T","Texto"],["stickers","😊","Stickers"],["light","✨","Luz"],["border","🖼","Borda"],["crop","✂️","Crop"],["blur","🌫","Blur"],["draw","🖌","Pincel"]].map(([t,ic,lb])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:"0 0 auto", minWidth:52, padding:"10px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:16 }}>{ic}</span>
              <span style={{ fontSize:8, color:tabActive(t)?"#00d4ff":"#3a4060", fontWeight:700 }}>{lb}</span>
              {tabActive(t) && <div style={{ width:20, height:2, background:"#00d4ff", borderRadius:1 }}/>}
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
          <button onMouseDown={()=>setShowBefore(true)} onMouseUp={()=>setShowBefore(false)}
            style={{ ...iB(false), padding:"8px 14px" }}>👁 Antes/Depois</button>
          <button onClick={removeBg} disabled={removingBg} style={{ ...iB(false,"#00e676"), padding:"8px 14px", color:removingBg?"#ffaa00":"#00e676", border:removingBg?"1px solid rgba(255,165,0,.4)":"1px solid rgba(0,230,118,.35)" }}>
            {removingBg?"⏳ "+bgRemoveProgress:"🪄 Remover Fundo"}
          </button>
          <label style={{ ...iB(false), padding:"8px 14px", cursor:"pointer" }}>🔄 Trocar foto<input type="file" accept="image/*" onChange={handleUpload} style={{ display:"none" }}/></label>
          <button onClick={saveProject} style={{ ...iB(false,"#f5c518"), padding:"8px 14px" }}>💾 Salvar projeto</button>
        </>}
        <label style={{ ...iB(false), padding:"8px 14px", cursor:"pointer" }}>📂 Carregar<input type="file" accept=".json" onChange={loadProject} style={{ display:"none" }}/></label>
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
              <div style={{ fontSize:8, color:"#00d4ff", letterSpacing:3, marginBottom:10 }}>FILTROS</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                {FILTERS.map(f=>(
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
                  <span style={L("rgba(200,119,255,.8)")}>Fonte — {FONTS_INSTAGRAM.length} fontes</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:180, overflowY:"auto" }}>
                    {FONTS_INSTAGRAM.map(f=>(
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
const SERVICOS_P = [
  { label:"Formatação",  emoji:"💻", preco:"R$ 80",  frase:"PC lento demais?",   sub:"Windows limpo · Drivers ok",      accent:"#00d4ff" },
  { label:"Limpeza",     emoji:"🧹", preco:"R$ 60",  frase:"Superaquecendo?",     sub:"Pasta térmica · Limpeza completa", accent:"#ff6b35" },
  { label:"Troca SSD",   emoji:"⚡", preco:"R$ 120", frase:"10× mais rápido!",    sub:"Migração do sistema inclusa",     accent:"#f5c518" },
  { label:"Vírus",       emoji:"🛡️",preco:"R$ 70",  frase:"PC infectado?",       sub:"Remoção total + Proteção",       accent:"#00e676" },
  { label:"Manutenção",  emoji:"🔧", preco:"R$ 90",  frase:"Diagnóstico GRÁTIS!", sub:"Orçamento em 10 minutos",         accent:"#c87cff" },
  { label:"Recuperação", emoji:"💾", preco:"R$ 150", frase:"Perdeu arquivos?",    sub:"HD · Pendrive · Cartão",          accent:"#ff4081" },
  { label:"Tela",        emoji:"🖥️", preco:"R$ 200", frase:"Tela quebrada?",      sub:"Notebook e desktop",              accent:"#00bcd4" },
  { label:"RAM",         emoji:"🚀", preco:"R$ 80",  frase:"Mais velocidade!",    sub:"Dobra a performance do PC",       accent:"#ff9800" },
];
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
  const s=SERVICOS_P[si];
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

  // 💾 Salvar projeto JSON
  const saveProjectJSON = () => {
    const data = { version:1, type:"post", bgId, fmtId, bgOpacity, els:JSON.parse(JSON.stringify(els)) };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const link = document.createElement("a"); link.download=`maker-info-post-${s.label.toLowerCase()}.json`;
    link.href = URL.createObjectURL(blob); link.click();
  };

  // 📂 Carregar projeto JSON
  const loadProjectJSON = (e) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=ev=>{
      try {
        const d=JSON.parse(ev.target.result);
        if(d.type!=="post"){alert("Este arquivo é de um projeto de Foto.");return;}
        if(d.bgId)setBgId(d.bgId); if(d.fmtId)setFmtId(d.fmtId);
        if(d.bgOpacity!==undefined)setBgOpacity(d.bgOpacity);
        if(d.els)setEls(d.els.map(e=>({...e,id:uid()})));
        setSelId(null);
      } catch{alert("Arquivo inválido.");}
    }; r.readAsText(f);
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

  const handleSave=async()=>{if(!posterRef.current)return;setSaving(true);try{const h2c=window.html2canvas;if(!h2c){alert("Aguarde.");setSaving(false);return;}setSelId(null);setEditId(null);await new Promise(r=>setTimeout(r,150));const canvas=await h2c(posterRef.current,{scale:2,useCORS:true,allowTaint:true,backgroundColor:null,logging:false});const link=document.createElement("a");link.download=`maker-info-${s.label.toLowerCase().replace(/ /g,"-")}.png`;link.href=canvas.toDataURL("image/png");link.click();}catch(err){console.error(err);alert("Erro ao exportar.");}setSaving(false);};

  const maxW=typeof window!=="undefined"?Math.min(window.innerWidth-(isMobile?16:20),isMobile?600:520):400;
  const viewScale=Math.min(maxW/FW,(isMobile?300:520)/FH);
  const cvW=Math.round(FW*viewScale),cvH=Math.round(FH*viewScale);

  const I={width:"100%",padding:"9px 11px",borderRadius:7,fontSize:12,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",color:"#fff",outline:"none",boxSizing:"border-box"};
  const L=(c="#00d4ff")=>({fontSize:8,color:c,letterSpacing:3,display:"block",marginBottom:4,textTransform:"uppercase"});
  const iB=(on,c="#00d4ff",full=false)=>({padding:"8px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,background:on?`${c}22`:"rgba(255,255,255,.04)",border:on?`1px solid ${c}66`:"1px solid rgba(255,255,255,.06)",color:on?c:"#3a4060",...(full?{width:"100%"}:{})});
  const tabS=t=>({flex:1,padding:"8px 3px",borderRadius:7,cursor:"pointer",fontSize:9,fontWeight:700,background:panel===t?"rgba(0,212,255,.18)":"rgba(255,255,255,.03)",border:panel===t?"1px solid rgba(0,212,255,.45)":"1px solid rgba(255,255,255,.05)",color:panel===t?"#00d4ff":"#3a4060"});
  const bgStyle=bgId==="transparent"?{backgroundImage:"linear-gradient(45deg,#141428 25%,transparent 25%),linear-gradient(-45deg,#141428 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#141428 75%),linear-gradient(-45deg,transparent 75%,#141428 75%)",backgroundSize:"20px 20px",backgroundPosition:"0 0,0 10px,10px -10px,-10px 0",backgroundColor:"#0d0d20"}:{background:bg?.bg||"#030b18",...(bg?.extra||{})};

  return (
    <div style={{minHeight:"100vh",background:"#060a14",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#fff",WebkitTapHighlightColor:"transparent",overscrollBehavior:"none",paddingBottom:isMobile?100:20}}>
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
        <button onClick={saveProjectJSON} style={{padding:"8px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,background:"rgba(245,197,24,.1)",border:"1px solid rgba(245,197,24,.3)",color:"#f5c518"}} title="Salvar projeto">💾</button>
        <label style={{padding:"8px 12px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:"#888"}} title="Carregar projeto">📂<input type="file" accept=".json" onChange={loadProjectJSON} style={{display:"none"}}/></label>
        {!isMobile && <button onClick={exportAll} disabled={exportingAll} style={{padding:"8px 14px",borderRadius:7,cursor:exportingAll?"wait":"pointer",fontSize:11,fontWeight:700,background:exportingAll?"#1a2030":"rgba(0,230,118,.12)",border:"1px solid rgba(0,230,118,.3)",color:exportingAll?"#444":"#00e676"}}>{exportingAll?"⏳ Exportando...":"📦 Todos formatos"}</button>}
        <button onClick={handleSave} disabled={saving} style={{padding:"9px 16px",borderRadius:8,cursor:saving?"wait":"pointer",fontSize:12,fontWeight:900,background:saving?"#1a2030":"linear-gradient(135deg,#00d4ff,#0088cc)",border:"none",color:saving?"#444":"#000",boxShadow:saving?"none":"0 0 18px rgba(0,212,255,.3)"}}>
          {saving?"⏳":"⬇️"} PNG
        </button>
      </div>

      <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:14,padding:isMobile?"10px 8px":"14px",alignItems:"flex-start",justifyContent:"center"}}>
        {/* Canvas column */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
            {FORMATS_P.map(f=><button key={f.id} onClick={()=>changeFmt(f.id)} style={{...iB(fmtId===f.id),padding:"5px 10px",fontSize:10}}>{f.label}</button>)}
            <div style={{width:1,background:"rgba(255,255,255,.1)",margin:"0 2px"}}/>
            {SERVICOS_P.map((sv,i)=>(
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
            <button onClick={addText} style={{...iB(false,"#00d4ff")}}>＋ Texto</button>
            <button onClick={()=>addShape("rect")}     style={{...iB(false,"#c87cff")}}>▭</button>
            <button onClick={()=>addShape("circle")}   style={{...iB(false,"#00e676")}}>◯</button>
            <button onClick={()=>addShape("line")}     style={{...iB(false,"#ff9800")}}>—</button>
            <button onClick={()=>addShape("triangle")} style={{...iB(false,"#ff4081")}}>△</button>
            <label style={{...iB(false,"#f5c518"),cursor:"pointer"}}>🖼 Img<input type="file" accept="image/*" onChange={handleImgEl} style={{display:"none"}}/></label>
            <button onClick={addQRCode} style={{...iB(false,"#25d366"),padding:"8px 10px",fontSize:11,fontWeight:700}} title="Adicionar QR Code do WhatsApp">📲 QR WhatsApp</button>
            <label style={{...iB(false,"rgba(180,180,180,.4)"),cursor:"pointer"}}>📷 Fundo<input type="file" accept="image/*" onChange={handleBgPhoto} style={{display:"none"}}/></label>
            {bgPhoto&&<button onClick={()=>setBgPhoto(null)} style={{...iB(false,"#ff4444")}}>✕ Fundo</button>}
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
  const [photos, setPhotos]       = useState([]);   // array indexed by cell
  const [gap, setGap]             = useState(4);
  const [radius, setRadius]       = useState(0);
  const [bgColor, setBgColor]     = useState("#000000");
  const [saving, setSaving]       = useState(false);
  const collageRef = useRef(null);

  useScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

  const layout = COLLAGE_LAYOUTS.find(l=>l.id===layoutId) || COLLAGE_LAYOUTS[0];
  const SIZE = isMobile ? Math.min(window.innerWidth - 32, 380) : 480;
  const COL_W = SIZE / layout.cols;
  const ROW_H = SIZE / layout.rows;

  const loadPhoto = (idx, e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ev => {
      setPhotos(p => { const a=[...p]; a[idx]=ev.target.result; return a; });
    }; r.readAsDataURL(f);
  };

  const handleExport = async () => {
    if(!collageRef.current) return; setSaving(true);
    try {
      const h2c = window.html2canvas; if(!h2c){alert("Aguarde o carregamento.");setSaving(false);return;}
      await new Promise(r=>setTimeout(r,100));
      const canvas = await h2c(collageRef.current,{scale:2,useCORS:true,allowTaint:true,backgroundColor:bgColor,logging:false});
      const a=document.createElement("a"); a.download="colagem-maker-info.png"; a.href=canvas.toDataURL("image/png"); a.click();
    } catch(err){console.error(err);alert("Erro ao exportar.");}
    setSaving(false);
  };

  const iB=(on,c="#00e676")=>({padding:"8px 10px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:700,
    background:on?`rgba(${c==="on"?"0,230,118":"0,230,118"},.15)`:"rgba(255,255,255,.04)",
    border:on?`1px solid rgba(0,230,118,.5)`:"1px solid rgba(255,255,255,.06)",color:on?"#00e676":"#3a4060"});

  return (
    <div style={{minHeight:"100vh",background:"#060a14",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#fff"}}>
      {/* Top bar */}
      <div style={{background:"rgba(6,10,20,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"10px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <button onClick={onHome} style={{padding:"7px 14px",borderRadius:7,background:"rgba(0,230,118,.1)",border:"1px solid rgba(0,230,118,.3)",color:"#00e676",fontSize:11,fontWeight:700,cursor:"pointer"}}>← Home</button>
        <div style={{flex:1}}>
          <div style={{fontSize:8,color:"#00e676",letterSpacing:5}}>MAKER INFO</div>
          <div style={{fontSize:15,fontWeight:900}}>🖼 <span style={{color:"#00e676"}}>Colagem</span> de Fotos</div>
        </div>
        <button onClick={handleExport} disabled={saving} style={{padding:"9px 18px",borderRadius:8,cursor:saving?"wait":"pointer",fontSize:12,fontWeight:900,background:saving?"#1a2030":"linear-gradient(135deg,#00e676,#00b050)",border:"none",color:"#000",boxShadow:saving?"none":"0 0 18px rgba(0,230,118,.3)"}}>
          {saving?"⏳ Exportando...":"⬇️ Baixar PNG"}
        </button>
      </div>

      <div style={{display:"flex",gap:16,padding:16,flexWrap:isMobile?"wrap":"nowrap",justifyContent:"center",alignItems:"flex-start"}}>

        {/* Canvas */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,flexShrink:0}}>
          <div ref={collageRef} style={{width:SIZE,height:SIZE,background:bgColor,position:"relative",borderRadius:radius,overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.8)"}}>
            {layout.cells.map((cell,idx)=>{
              const x = cell.c * COL_W + (gap/2);
              const y = cell.r * ROW_H + (gap/2);
              const w = cell.cw * COL_W - gap;
              const h = cell.rh * ROW_H - gap;
              const photo = photos[idx];
              return (
                <div key={idx} style={{position:"absolute",left:x,top:y,width:w,height:h,borderRadius:Math.max(0,radius-2),overflow:"hidden",background:"rgba(255,255,255,.06)"}}>
                  {photo
                    ? <img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} crossOrigin="anonymous"/>
                    : <label style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",gap:4,background:"rgba(255,255,255,.04)"}}>
                        <div style={{fontSize:Math.min(w,h)*0.3,opacity:.4}}>+</div>
                        <div style={{fontSize:Math.min(w*0.08,10),color:"rgba(255,255,255,.35)",textAlign:"center",padding:"0 4px"}}>Foto {idx+1}</div>
                        <input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}} capture="environment"/>
                      </label>
                  }
                  {photo && (
                    <label style={{position:"absolute",bottom:4,right:4,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12}}>
                      🔄<input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}} capture="environment"/>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{fontSize:10,color:"#1a3040"}}>Clique nos slots para adicionar fotos · Arraste p/ substituir</div>
        </div>

        {/* Controls panel */}
        <div style={{flex:"0 0 auto",width:isMobile?"100%":290}}>
          {/* Layouts */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:10}}>LAYOUT</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {COLLAGE_LAYOUTS.map(l=>(
                <button key={l.id} onClick={()=>{setLayoutId(l.id);setPhotos([]);}} style={{
                  padding:"9px 6px",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:700,
                  background:layoutId===l.id?"rgba(0,230,118,.15)":"rgba(255,255,255,.04)",
                  border:layoutId===l.id?"1px solid rgba(0,230,118,.5)":"1px solid rgba(255,255,255,.06)",
                  color:layoutId===l.id?"#00e676":"#3a4060"}}>{l.label}</button>
              ))}
            </div>
          </div>

          {/* Ajustes */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12,marginBottom:10}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:10}}>AJUSTES</div>
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

          {/* Fotos adicionadas */}
          <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:12}}>
            <div style={{fontSize:8,color:"#00e676",letterSpacing:3,marginBottom:8}}>SLOTS</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {layout.cells.map((_,idx)=>(
                <div key={idx} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,background:photos[idx]?"rgba(0,230,118,.08)":"rgba(255,255,255,.03)",border:photos[idx]?"1px solid rgba(0,230,118,.25)":"1px solid rgba(255,255,255,.06)"}}>
                  <span style={{fontSize:14}}>{photos[idx]?"🟢":"⬜"}</span>
                  <span style={{fontSize:11,color:photos[idx]?"#00e676":"#3a4060",flex:1}}>Foto {idx+1}</span>
                  {photos[idx]&&<button onClick={()=>setPhotos(p=>{const a=[...p];a[idx]=null;return a;})} style={{fontSize:11,color:"#ff4444",background:"none",border:"none",cursor:"pointer"}}>✕</button>}
                  <label style={{fontSize:10,color:"#00e676",cursor:"pointer",padding:"4px 8px",borderRadius:5,border:"1px solid rgba(0,230,118,.3)",background:"rgba(0,230,118,.07)"}}>
                    {photos[idx]?"Trocar":"Adicionar"}<input type="file" accept="image/*" onChange={e=>loadPhoto(idx,e)} style={{display:"none"}} capture="environment"/>
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
   ROOT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [mode, setMode] = useState("home"); // home | photo | post | collage
  if (mode==="home")    return <HomeScreen onSelect={setMode}/>;
  if (mode==="photo")   return <PhotoEditor onSwitch={()=>setMode("post")} onHome={()=>setMode("home")}/>;
  if (mode==="post")    return <PostEditor  onSwitch={()=>setMode("photo")} onHome={()=>setMode("home")}/>;
  if (mode==="collage") return <CollageEditor onHome={()=>setMode("home")}/>;
  return null;
}
