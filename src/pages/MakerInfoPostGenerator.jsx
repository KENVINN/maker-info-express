import { useState, useRef, useEffect, useCallback, useReducer } from "react";

/* ── External scripts ───────────────────────────────────────────────────── */
function useScript(src) {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement("script"); s.src = src; document.head.appendChild(s);
  }, [src]);
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const CW = 600, CH = 600;
const FONTS  = ["Barlow Condensed","Impact","Arial Black","Oswald","Georgia","Courier New","Tahoma"];
const FSIZES = [10,12,14,16,18,20,24,28,32,36,42,48,56,64,72,80,96,112,128];
const FORMATS = [
  { id:"sq",    label:"1:1 Post",   w:600, h:600  },
  { id:"story", label:"9:16 Story", w:600, h:1067 },
  { id:"land",  label:"16:9 Banner",w:600, h:338  },
];
const SERVICOS = [
  { label:"Formatação",      emoji:"💻", preco:"R$ 80",  frase:"PC lento demais?",   sub:"Windows limpo · Drivers ok",         accent:"#00d4ff" },
  { label:"Limpeza",         emoji:"🧹", preco:"R$ 60",  frase:"Superaquecendo?",     sub:"Pasta térmica · Limpeza completa",   accent:"#ff6b35" },
  { label:"Troca de SSD",    emoji:"⚡", preco:"R$ 120", frase:"10× mais rápido!",    sub:"Migração do sistema inclusa",        accent:"#f5c518" },
  { label:"Vírus",           emoji:"🛡️",preco:"R$ 70",  frase:"PC infectado?",       sub:"Remoção total + Proteção",          accent:"#00e676" },
  { label:"Manutenção",      emoji:"🔧", preco:"R$ 90",  frase:"Diagnóstico GRÁTIS!", sub:"Orçamento em 10 minutos",            accent:"#c87cff" },
  { label:"Recuperação",     emoji:"💾", preco:"R$ 150", frase:"Perdeu arquivos?",    sub:"HD · Pendrive · Cartão",             accent:"#ff4081" },
  { label:"Tela",            emoji:"🖥️", preco:"R$ 200", frase:"Tela quebrada?",      sub:"Notebook e desktop",                 accent:"#00bcd4" },
  { label:"RAM",             emoji:"🚀", preco:"R$ 80",  frase:"Mais velocidade!",    sub:"Dobra a performance do PC",          accent:"#ff9800" },
];
const BGS = [
  { id:"neon",   label:"Neon",    bg:"#030b18", extra:{ backgroundImage:"linear-gradient(rgba(0,212,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.05) 1px,transparent 1px)", backgroundSize:"40px 40px" } },
  { id:"fire",   label:"🔥 Fire", bg:"#0c0300", extra:{ backgroundImage:"radial-gradient(ellipse at 50% 110%,rgba(255,80,0,.85),rgba(12,3,0,0) 65%)" } },
  { id:"dark",   label:"Dark",    bg:"#080808", extra:{} },
  { id:"gold",   label:"Gold",    bg:"#050505", extra:{ backgroundImage:"repeating-linear-gradient(45deg,rgba(201,168,76,.04) 0,rgba(201,168,76,.04) 1px,transparent 0,transparent 50%)", backgroundSize:"10px 10px" } },
  { id:"purple", label:"Roxo",    bg:"#080010", extra:{ backgroundImage:"radial-gradient(ellipse at 30% 30%,rgba(120,0,255,.3),transparent 60%)" } },
  { id:"green",  label:"Verde",   bg:"#010f06", extra:{ backgroundImage:"radial-gradient(ellipse at 50% 30%,rgba(0,200,83,.15),transparent 60%)" } },
  { id:"white",  label:"Branco",  bg:"#f0f0f0", extra:{} },
  { id:"red",    label:"Vermelho",bg:"#0a0000", extra:{ backgroundImage:"radial-gradient(ellipse at 30% 30%,rgba(180,0,0,.3),transparent 60%)" } },
];

/* ── uid ─────────────────────────────────────────────────────────────────── */
let _uid = 0;
const uid = () => `e${++_uid}`;

/* ── Element factories ───────────────────────────────────────────────────── */
const mkText = (o={}) => ({ id:uid(), kind:"text", x:60, y:150, w:480, h:80, rotation:0, locked:false,
  text:"Texto", fontSize:48, color:"#ffffff", useGradient:false, gradientColor1:"#00d4ff", gradientColor2:"#c87cff", gradientAngle:135,
  fontFamily:"Barlow Condensed", fontWeight:"900", align:"left", letterSpacing:0, opacity:1,
  shadowColor:"#000000", shadowBlur:0, shadowX:0, shadowY:0,
  outline:false, outlineColor:"#000000", outlineWidth:2, ...o });

const mkShape = (shape, o={}) => ({ id:uid(), kind:"shape", shape, x:100, y:100, w:200, h:80, rotation:0, locked:false,
  useGradient:false, fill:"#00d4ff", gradientColor1:"#00d4ff", gradientColor2:"#c87cff", gradientAngle:135,
  stroke:"transparent", strokeWidth:0, opacity:1, radius:8, ...o });

const mkImage = (src, o={}) => ({ id:uid(), kind:"image", x:60, y:60, w:220, h:220, rotation:0, locked:false,
  src, opacity:1, radius:0, ...o });

/* ── Default layout ──────────────────────────────────────────────────────── */
function defaultEls(s, fH=600) {
  return [
    mkShape("rect",  { x:0, y:fH-72, w:600, h:72, fill:"rgba(37,211,102,.18)", stroke:"rgba(37,211,102,.3)", strokeWidth:1, radius:0 }),
    mkText({ x:44, y:18,    w:460, h:22,  text:"MAKER INFO · ASSISTÊNCIA TÉCNICA", fontSize:11, color:"rgba(0,212,255,.65)", letterSpacing:4, fontWeight:"700" }),
    mkText({ x:44, y:52,    w:460, h:106, text:s.label.toUpperCase(), fontSize:88, color:"#ffffff", fontWeight:"900", letterSpacing:-2, shadowColor:s.accent, shadowBlur:30 }),
    mkText({ x:44, y:170,   w:400, h:40,  text:s.frase, fontSize:28, color:"rgba(255,255,255,.75)", fontWeight:"500" }),
    mkShape("line",  { x:44, y:222, w:180, h:3, fill:s.accent, radius:2 }),
    mkText({ x:44, y:238,   w:360, h:98,  text:s.preco, fontSize:92, color:s.accent, fontWeight:"900", letterSpacing:-2, shadowColor:s.accent, shadowBlur:28 }),
    mkText({ x:44, y:348,   w:320, h:28,  text:s.sub, fontSize:14, color:"rgba(255,255,255,.38)", letterSpacing:.5 }),
    mkText({ x:44, y:388,   w:130, h:120, text:s.emoji, fontSize:108, color:"#fff", fontWeight:"900" }),
    mkText({ x:44, y:fH-58, w:340, h:38,  text:"💬 (65) 9282-4709", fontSize:22, color:"#25d366", fontWeight:"900" }),
    mkText({ x:44, y:fH-26, w:440, h:20,  text:"Várzea Grande · MT · Busca na sua porta", fontSize:10, color:"rgba(255,255,255,.22)", letterSpacing:2 }),
  ];
}

/* ── Presets ─────────────────────────────────────────────────────────────── */
const PRESETS = [
  { id:"neon",  label:"⚡ Neon",  bg:"neon",  mk:(s,h)=>defaultEls(s,h) },
  { id:"fire",  label:"🔥 Fire",  bg:"fire",  mk:(s,h)=>defaultEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#fff",shadowColor:"#ff4400"}:e.kind==="text"&&e.text===s.label.toUpperCase()?{...e,color:"#ffaa00",shadowColor:"#ff4400"}:e.kind==="shape"&&e.shape==="line"?{...e,fill:"#ff6000"}:e) },
  { id:"gold",  label:"🥇 Gold",  bg:"gold",  mk:(s,h)=>defaultEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#c9a84c",shadowColor:"#c9a84c"}:e.kind==="shape"&&e.shape==="line"?{...e,fill:"#c9a84c"}:e) },
  { id:"grad",  label:"🌈 Grad",  bg:"dark",  mk:(s,h)=>defaultEls(s,h).map(e=>e.kind==="text"&&(e.text===s.label.toUpperCase()||e.text===s.preco)?{...e,useGradient:true,gradientColor1:"#00d4ff",gradientColor2:"#c87cff"}:e) },
  { id:"green", label:"✅ Verde", bg:"green", mk:(s,h)=>defaultEls(s,h).map(e=>e.kind==="text"&&(e.text===s.preco||e.text===s.label.toUpperCase())?{...e,color:"#00e676",shadowColor:"#00c853"}:e) },
  { id:"purple",label:"💜 Roxo",  bg:"purple",mk:(s,h)=>defaultEls(s,h).map(e=>e.kind==="text"&&e.text===s.preco?{...e,color:"#c87cff",shadowColor:"#9000ff"}:e) },
];

/* ── Undo/Redo ───────────────────────────────────────────────────────────── */
function histReducer(s, a) {
  if (a.type==="SET")  return { past:[...s.past,s.present].slice(-50), present:a.p, future:[] };
  if (a.type==="UNDO" && s.past.length)   { const past=[...s.past]; const present=past.pop(); return { past, present, future:[s.present,...s.future] }; }
  if (a.type==="REDO" && s.future.length) { const [present,...future]=s.future; return { past:[...s.past,s.present], present, future }; }
  return s;
}

/* ── gradCSS ─────────────────────────────────────────────────────────────── */
const gradCSS = e => `linear-gradient(${e.gradientAngle||135}deg,${e.gradientColor1||"#00d4ff"},${e.gradientColor2||"#c87cff"})`;

/* ── Pointer event helpers (works mouse + touch) ─────────────────────────── */
function getPoint(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

/* ── Element visual (no interaction) ────────────────────────────────────── */
function ElView({ el }) {
  const rot = el.rotation ? `rotate(${el.rotation}deg)` : undefined;
  const base = { position:"absolute", left:el.x, top:el.y, width:el.w, opacity:el.opacity??1,
    transform:rot, transformOrigin:"center center", pointerEvents:"none", userSelect:"none" };

  if (el.kind==="image") return (
    <div style={{ ...base, height:el.h, overflow:"hidden", borderRadius:el.radius||0 }}>
      <img src={el.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} crossOrigin="anonymous"/>
    </div>
  );
  if (el.kind==="shape") {
    const bg = el.useGradient ? gradCSS(el) : el.fill;
    const sh = { ...base, height:el.h };
    if (el.shape==="rect")     return <div style={{ ...sh, background:bg, border:`${el.strokeWidth||0}px solid ${el.stroke}`, borderRadius:el.radius||0 }}/>;
    if (el.shape==="circle")   return <div style={{ ...sh, background:bg, border:`${el.strokeWidth||0}px solid ${el.stroke}`, borderRadius:"50%" }}/>;
    if (el.shape==="line")     return <div style={{ ...sh, background:bg, borderRadius:el.radius||0 }}/>;
    if (el.shape==="triangle") return (
      <div style={sh}>
        <svg width={el.w} height={el.h} style={{ position:"absolute", inset:0 }}>
          <defs><linearGradient id={`g${el.id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={el.gradientColor1||el.fill}/><stop offset="100%" stopColor={el.gradientColor2||el.fill}/></linearGradient></defs>
          <polygon points={`${el.w/2},0 ${el.w},${el.h} 0,${el.h}`} fill={el.useGradient?`url(#g${el.id})`:el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth||0}/>
        </svg>
      </div>
    );
  }
  if (el.kind==="text") {
    const shadow = `${el.shadowX||0}px ${el.shadowY||0}px ${el.shadowBlur||0}px ${el.shadowColor||"transparent"}`;
    const outlineStyle = el.outline ? { WebkitTextStroke:`${el.outlineWidth||2}px ${el.outlineColor||"#000"}` } : {};
    if (el.useGradient) return (
      <div style={{ ...base, fontSize:el.fontSize, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
        textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.08, whiteSpace:"pre-wrap", wordBreak:"break-word",
        background:gradCSS(el), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        filter:`drop-shadow(${shadow})`, ...outlineStyle }}>{el.text}</div>
    );
    return (
      <div style={{ ...base, fontSize:el.fontSize, color:el.color, fontFamily:el.fontFamily, fontWeight:el.fontWeight,
        textAlign:el.align, letterSpacing:el.letterSpacing, lineHeight:1.08, whiteSpace:"pre-wrap",
        wordBreak:"break-word", textShadow:shadow, ...outlineStyle }}>{el.text}</div>
    );
  }
  return null;
}

/* ── Inline text editor overlay ─────────────────────────────────────────── */
function InlineEditor({ el, scale, onDone }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) { ref.current.focus(); ref.current.select(); } }, []);
  const shadow = `${el.shadowX||0}px ${el.shadowY||0}px ${el.shadowBlur||0}px ${el.shadowColor||"transparent"}`;
  return (
    <textarea ref={ref} defaultValue={el.text}
      onBlur={e => onDone(e.target.value)}
      onKeyDown={e => { if (e.key==="Escape") onDone(el.text); }}
      style={{
        position:"absolute", left:el.x, top:el.y, width:el.w, minHeight:el.h||60,
        fontSize:el.fontSize, color:el.useGradient?"#fff":el.color,
        fontFamily:el.fontFamily, fontWeight:el.fontWeight, textAlign:el.align,
        letterSpacing:el.letterSpacing, lineHeight:1.08,
        background:"rgba(0,212,255,.08)", border:"2px solid #00d4ff",
        borderRadius:4, outline:"none", resize:"none", padding:0,
        textShadow:shadow, zIndex:50, boxSizing:"border-box",
        transform:el.rotation?`rotate(${el.rotation}deg)`:"none", transformOrigin:"center center",
      }}/>
  );
}

/* ── Resize handles ─────────────────────────────────────────────────────── */
const HANDLES = [
  {id:"nw",cx:0,cy:0},{id:"n",cx:.5,cy:0},{id:"ne",cx:1,cy:0},
  {id:"e",cx:1,cy:.5},{id:"se",cx:1,cy:1},{id:"s",cx:.5,cy:1},
  {id:"sw",cx:0,cy:1},{id:"w",cx:0,cy:.5},
];
const CURSOR_MAP = { nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize" };

/* ── Interactive element wrapper ─────────────────────────────────────────── */
function InteractEl({ el, selected, onSelect, onUpdate, onEdit, scale }) {
  const st = useRef({ mode:null, handle:null, sx:0, sy:0, ox:0, oy:0, ow:0, oh:0, or:0, cx:0, cy:0, sa:0 });
  const wrapRef = useRef(null);
  const lastTap = useRef(0);
  const HS = 16; // handle size — big enough for touch

  const getP = (e) => getPoint(e);

  const startDrag = (e) => {
    if (el.locked) { onSelect(el.id); return; }
    e.stopPropagation(); e.preventDefault();

    // Double-click / double-tap → edit text inline
    const now = Date.now();
    if (el.kind==="text" && now - lastTap.current < 350) { onEdit(el.id); return; }
    lastTap.current = now;

    onSelect(el.id);
    const p = getP(e);
    st.current = { ...st.current, mode:"drag", sx:p.x, sy:p.y, ox:el.x, oy:el.y };
    bind();
  };

  const startResize = (e, handle) => {
    e.stopPropagation(); e.preventDefault();
    const p = getP(e);
    st.current = { mode:"resize", handle, sx:p.x, sy:p.y, ox:el.x, oy:el.y, ow:el.w, oh:el.h };
    bind();
  };

  const startRotate = (e) => {
    e.stopPropagation(); e.preventDefault();
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const p = getP(e);
    const sa = Math.atan2(p.y-cy, p.x-cx)*180/Math.PI;
    st.current = { mode:"rotate", cx, cy, sa, or:el.rotation||0 };
    bind();
  };

  const onMove = useCallback((e) => {
    const d = st.current; if (!d.mode) return;
    const p = getP(e);
    const dx=(p.x-d.sx)/scale, dy=(p.y-d.sy)/scale;
    if (d.mode==="drag")   { onUpdate(el.id,{x:Math.round(d.ox+dx),y:Math.round(d.oy+dy)}); }
    if (d.mode==="rotate") { const a=Math.atan2(p.y-d.cy,p.x-d.cx)*180/Math.PI; onUpdate(el.id,{rotation:Math.round((d.or+(a-d.sa)+360)%360)}); }
    if (d.mode==="resize") {
      const h=d.handle; let nx=d.ox,ny=d.oy,nw=d.ow,nh=d.oh;
      if(h.includes("e"))nw=Math.max(20,d.ow+dx); if(h.includes("s"))nh=Math.max(8,d.oh+dy);
      if(h.includes("w")){nw=Math.max(20,d.ow-dx);nx=d.ox+(d.ow-nw);}
      if(h.includes("n")){nh=Math.max(8,d.oh-dy); ny=d.oy+(d.oh-nh);}
      onUpdate(el.id,{x:Math.round(nx),y:Math.round(ny),w:Math.round(nw),h:Math.round(nh)});
    }
  },[el.id,scale,onUpdate]);

  const onUp = useCallback(()=>{ st.current.mode=null; unbind(); },[]);

  const bind   = ()=>{ window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp); window.addEventListener("touchmove",onMove,{passive:false}); window.addEventListener("touchend",onUp); };
  const unbind = ()=>{ window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); window.removeEventListener("touchmove",onMove); window.removeEventListener("touchend",onUp); };
  useEffect(()=>()=>unbind(),[]);

  const rot = el.rotation||0;

  return (
    <div ref={wrapRef} style={{ position:"absolute", left:el.x, top:el.y, width:el.w, height:el.h||60,
      cursor: el.locked ? "default" : el.kind==="text" ? "text" : "move",
      outline: selected ? "2px dashed rgba(0,212,255,.9)" : "2px solid transparent",
      boxSizing:"border-box", transform:rot?`rotate(${rot}deg)`:"none", transformOrigin:"center center",
      touchAction:"none" }}
      onMouseDown={startDrag} onTouchStart={startDrag}>
      <ElView el={{ ...el, x:0, y:0 }}/>
      {selected && !el.locked && <>
        {HANDLES.map(h=>(
          <div key={h.id}
            onMouseDown={e=>startResize(e,h.id)} onTouchStart={e=>startResize(e,h.id)}
            style={{ position:"absolute", width:HS, height:HS, background:"#00d4ff", border:"2px solid #fff",
              borderRadius:3, zIndex:10, boxShadow:"0 0 8px rgba(0,212,255,.9)",
              left:`calc(${h.cx*100}% - ${HS/2}px)`, top:`calc(${h.cy*100}% - ${HS/2}px)`,
              cursor:CURSOR_MAP[h.id], touchAction:"none" }}/>
        ))}
        {/* Rotate handle */}
        <div onMouseDown={startRotate} onTouchStart={startRotate}
          style={{ position:"absolute", width:22, height:22, background:"#f5c518", border:"2px solid #fff",
            borderRadius:"50%", top:-36, left:"50%", transform:"translateX(-50%)",
            cursor:"crosshair", zIndex:11, boxShadow:"0 0 10px rgba(245,197,24,.8)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, touchAction:"none" }}>↻</div>
        <div style={{ position:"absolute", width:2, height:22, background:"rgba(245,197,24,.5)", top:-16, left:"50%", transform:"translateX(-50%)", zIndex:10, pointerEvents:"none" }}/>
        {el.kind==="text" && (
          <div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"rgba(0,212,255,.6)", background:"rgba(0,0,0,.6)", padding:"2px 6px", borderRadius:3, whiteSpace:"nowrap", pointerEvents:"none" }}>
            2× clique para editar
          </div>
        )}
      </>}
      {selected && el.locked && <div style={{ position:"absolute", top:-20, right:0, fontSize:9, color:"#f5c518", background:"rgba(0,0,0,.7)", padding:"2px 6px", borderRadius:3 }}>🔒 bloqueado</div>}
    </div>
  );
}

/* ── Align helper ─────────────────────────────────────────────────────────── */
function applyAlign(el, mode, cw, ch) {
  const h=el.h||60;
  return mode==="left"?{x:0}:mode==="right"?{x:cw-el.w}:mode==="centerH"?{x:Math.round((cw-el.w)/2)}
    :mode==="top"?{y:0}:mode==="bottom"?{y:ch-h}:{y:Math.round((ch-h)/2)};
}

/* ── In-memory template store ─────────────────────────────────────────────── */
let _saved = [];

/* ── MAIN APP ─────────────────────────────────────────────────────────────── */
export default function PostEditor() {
  const [si, setSi]           = useState(0);
  const [bgId, setBgId]       = useState("neon");
  const [fmtId, setFmtId]     = useState("sq");
  const [bgPhoto, setBgPhoto] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(0.25);
  const [selId, setSelId]     = useState(null);
  const [editId, setEditId]   = useState(null); // inline text edit
  const [panel, setPanel]     = useState("layers");
  const [saving, setSaving]   = useState(false);
  const [savedTpls, setSavedTpls] = useState(_saved);
  const [saveName, setSaveName]   = useState("");
  const [showSave, setShowSave]   = useState(false);
  const posterRef = useRef(null);

  useScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");

  useEffect(()=>{
    if (document.querySelector("link[data-mifont]")) return;
    const l=document.createElement("link"); l.rel="stylesheet"; l.setAttribute("data-mifont","1");
    l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700;900&family=Oswald:wght@400;700&display=swap";
    document.head.appendChild(l);
  },[]);

  // Prevent iOS bounce on canvas
  useEffect(()=>{
    const p=e=>{ if(e.target.closest("[data-canvas]")) e.preventDefault(); };
    document.addEventListener("touchmove",p,{passive:false});
    return()=>document.removeEventListener("touchmove",p);
  },[]);

  const fmt = FORMATS.find(f=>f.id===fmtId);
  const FW=fmt.w, FH=fmt.h;
  const s   = SERVICOS[si];
  const bg  = BGS.find(b=>b.id===bgId);

  const [hist, dispatch] = useReducer(histReducer,{ past:[], present:defaultEls(SERVICOS[0],CH), future:[] });
  const els = hist.present;
  const setEls = useCallback((fn)=>{ const next=typeof fn==="fu