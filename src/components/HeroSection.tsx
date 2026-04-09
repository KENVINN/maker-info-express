import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const stats = [
  { target: 100, suffix: "%",   label: "Garantia nos serviços" },
  { target: 10,  suffix: "min", label: "Orçamento no WhatsApp" },
  { display: "1 dia útil",      label: "Prazo médio de entrega" },
] as const;

// counter that fires once when the element scrolls into view
const AnimatedStat = ({ stat }: { stat: typeof stats[number] }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const target = "target" in stat ? stat.target : null;

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1400;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const display = "target" in stat ? `${count}${stat.suffix}` : stat.display;
  return <span ref={ref} className="font-heading text-2xl font-black text-primary mb-1">{display}</span>;
};

const frases = [
  "Travando e lento?",
  "Cheio de vírus?",
  "Não liga mais?",
  "Tela quebrada?",
  "Perdeu seus dados?",
  "Wi-Fi sem funcionar?",
];

// ─── Aurora blobs (Linear / Raycast / Vercel style) ───────────────────────────
const Aurora = () => (
  <>
    <style>{`
      @keyframes aurora-a {
        0%,100% { transform: translate(0%,0%) scale(1); }
        33%      { transform: translate(6%,-12%) scale(1.12); }
        66%      { transform: translate(-6%, 6%) scale(0.94); }
      }
      @keyframes aurora-b {
        0%,100% { transform: translate(0%,0%) scale(1); }
        33%      { transform: translate(-10%, 6%) scale(1.08); }
        66%      { transform: translate(8%,-10%) scale(1.14); }
      }
      @keyframes aurora-c {
        0%,100% { transform: translate(0%,0%) scale(1); }
        33%      { transform: translate(12%, 4%) scale(0.88); }
        66%      { transform: translate(-4%,-6%) scale(1.06); }
      }
    `}</style>

    {/* cyan — primary brand */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 700, height: 700,
        top: "5%", left: "15%",
        background: "radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "aurora-a 9s ease-in-out infinite",
      }}
    />
    {/* purple */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 550, height: 550,
        top: "30%", right: "10%",
        background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "aurora-b 12s ease-in-out infinite",
      }}
    />
    {/* blue */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 400, height: 400,
        bottom: "10%", left: "30%",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "aurora-c 15s ease-in-out infinite",
      }}
    />
  </>
);

// ─── Grain / noise overlay (premium texture used by Linear, Vercel, Raycast) ──
const Grain = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 3,
      opacity: 0.045,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "300px 300px",
    }}
  />
);

// ─── Particle network canvas ───────────────────────────────────────────────────
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLOR = "0,212,255";
    const COUNT = 65;
    const MAX_DIST = 130;
    const PUSH = 110;

    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    const init = () => {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: Math.random() * 1.4 + 0.4,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < PUSH) { const f = (PUSH - d) / PUSH; p.x += (dx / d) * f * 1.1; p.y += (dy / d) * f * 1.1; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR},0.65)`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${COLOR},${(1 - d / MAX_DIST) * 0.28})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    const mm = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const ml = () => { mouse.current = { x: -9999, y: -9999 }; };
    const onResize = () => { resize(); init(); };

    resize(); init(); tick();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", mm);
    canvas.addEventListener("mouseleave", ml);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", mm);
      canvas.removeEventListener("mouseleave", ml);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 1 }} />;
};

// ─── Glitch title ─────────────────────────────────────────────────────────────
const GLITCH_TEXT = "Seu PC ou Notebook";

const GlitchTitle = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const loop = () => {
      const wait = Math.random() * 4000 + 2500;
      const t = setTimeout(() => {
        let i = 0;
        const flickers = Math.floor(Math.random() * 3) + 2;
        setActive(true);
        const iv = setInterval(() => {
          setActive(v => !v);
          i++;
          if (i >= flickers * 2) { clearInterval(iv); setActive(false); loop(); }
        }, 80);
      }, wait);
      return t;
    };
    const t = loop();
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes g-a { 0%{clip-path:inset(8% 0 78% 0);transform:translate(-5px,0)} 25%{clip-path:inset(55% 0 30% 0);transform:translate(5px,0)} 50%{clip-path:inset(20% 0 60% 0);transform:translate(-3px,0)} 75%{clip-path:inset(70% 0 10% 0);transform:translate(4px,0)} 100%{clip-path:inset(8% 0 78% 0);transform:translate(-5px,0)} }
        @keyframes g-b { 0%{clip-path:inset(65% 0 8% 0);transform:translate(5px,0)} 25%{clip-path:inset(15% 0 65% 0);transform:translate(-5px,0)} 50%{clip-path:inset(40% 0 40% 0);transform:translate(3px,0)} 75%{clip-path:inset(80% 0 5% 0);transform:translate(-4px,0)} 100%{clip-path:inset(65% 0 8% 0);transform:translate(5px,0)} }
        @keyframes g-shake { 0%,100%{transform:translate(0,0) skewX(0deg)} 20%{transform:translate(-3px,1px) skewX(-1deg)} 40%{transform:translate(3px,-1px) skewX(1deg)} 60%{transform:translate(-2px,2px) skewX(-0.5deg)} 80%{transform:translate(2px,-2px) skewX(0.5deg)} }
      `}</style>
      <h1
        className="font-heading text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 relative"
        style={active ? { animation: "g-shake 0.08s infinite" } : {}}
      >
        {active && <span className="absolute inset-0 font-heading font-black text-red-400/80 select-none" style={{ animation: "g-a 0.12s infinite linear" }} aria-hidden>{GLITCH_TEXT}</span>}
        {active && <span className="absolute inset-0 font-heading font-black text-cyan-300/80 select-none" style={{ animation: "g-b 0.12s infinite linear" }} aria-hidden>{GLITCH_TEXT}</span>}
        <span className="relative">{GLITCH_TEXT}</span>
      </h1>
    </>
  );
};

// ─── Typing text ──────────────────────────────────────────────────────────────
const TypingText = () => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = frases[index];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    else if (!deleting && displayed.length === current.length) t = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && displayed.length > 0) t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    else if (deleting && displayed.length === 0) { setDeleting(false); setIndex(p => (p + 1) % frases.length); }
    return () => clearTimeout(t);
  }, [displayed, deleting, index]);

  return (
    <span className="text-gradient-neon">
      {displayed}<span className="animate-pulse">|</span>
    </span>
  );
};

// ─── Magnetic CTA button (used by Framer, Linear, premium agency sites) ───────
const MagneticButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [near, setNear] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({ x: (e.clientX - cx) * 0.32, y: (e.clientY - cy) * 0.32 });
    setNear(true);
  };

  const handleMouseLeave = () => { setOffset({ x: 0, y: 0 }); setNear(false); };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: near ? "transform 0.1s linear" : "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
      }}
      className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-black animate-pulse-neon hover:brightness-110 transition-[filter] shadow-2xl shadow-primary/30 mb-14 cursor-pointer"
    >
      {children}
    </a>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = () => (
  <section className="relative md:min-h-screen flex flex-col items-center justify-start md:justify-center pt-24 md:pt-20 pb-16 md:pb-16 overflow-hidden">
    {/* layers: aurora → particles → grain → content */}
    <Aurora />
    <ParticleNetwork />
    <Grain />

    <div className="container px-4 max-w-5xl mx-auto text-center relative" style={{ zIndex: 4 }}>
      <div className="flex justify-center mb-2 md:mb-4">
        <img
          src="/maker_info_transparente.png"
          alt="Maker Info"
          className="w-20 md:w-28 opacity-70 drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]"
        />
      </div>

      <ScrollReveal>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4 md:mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Várzea Grande e Cuiabá · Busca na sua porta
        </div>

        <GlitchTitle />

        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 min-h-[1.3em]">
          <TypingText />
        </h2>

        <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
          A gente conserta rápido e ainda busca na sua porta. Orçamento grátis em menos de 10 minutos.
        </p>

        <MagneticButton href={WHATSAPP_URL}>
          <WhatsAppIcon />
          FAZER ORÇAMENTO AGORA
        </MagneticButton>

        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {stats.map((s, i) => (
            <SpotlightCard key={i} className="flex flex-col items-center p-4 rounded-2xl bg-card/60 backdrop-blur border border-border hover:border-primary/30 transition-colors">
              <AnimatedStat stat={s} />
              <span className="text-xs text-muted-foreground text-center leading-snug">{s.label}</span>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>
    </div>

    <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/40" style={{ zIndex: 4 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </section>
);

export default HeroSection;
