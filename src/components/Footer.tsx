import { useEffect, useRef, useState } from "react";
import { Instagram, Facebook, MapPin, Clock, MessageCircle, ArrowUp } from "lucide-react";


const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

// fuso correto
const isOpen = () => {
  const now  = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Cuiaba" }));
  const day  = now.getDay();
  const h    = now.getHours() + now.getMinutes() / 60;
  if (day >= 1 && day <= 5) return h >= 8 && h < 18;
  if (day === 6)             return h >= 8 && h < 12;
  return false;
};

// link com underline neon crescente
const FooterLink = ({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="relative text-sm text-muted-foreground/70 hover:text-primary transition-colors duration-200 group w-fit"
  >
    {children}
    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300 rounded-full"
          style={{ boxShadow: "0 0 6px rgba(0,212,255,0.7)" }} />
  </a>
);

// botão CTA magnético
const MagneticCTA = () => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [near, setNear]     = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({ x: (e.clientX - (rect.left + rect.width / 2)) * 0.28, y: (e.clientY - (rect.top + rect.height / 2)) * 0.28 });
    setNear(true);
  };
  const onLeave = () => { setOffset({ x: 0, y: 0 }); setNear(false); };

  return (
    <a
      ref={ref}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: near ? "transform 0.1s linear" : "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
      }}
      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-black text-sm hover:brightness-110 transition-[filter] shadow-xl shadow-primary/25 animate-pulse-neon whitespace-nowrap"
    >
      <MessageCircle size={18} />
      ORÇAMENTO GRÁTIS AGORA
    </a>
  );
};

// ── Mini terminal animado ──────────────────────────────────────────────────────
const LINES = [
  "> status: online ✓",
  "> garantia: 100%",
  "> busca: VG + CBA",
  "> prazo: 1 dia útil",
  "> orçamento: grátis",
];

const MiniTerminal = () => {
  const [lineIdx, setLineIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === current.length) {
      t = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else {
      setDeleting(false);
      setLineIdx(i => (i + 1) % LINES.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, lineIdx]);

  return (
    <div className="px-3 py-2 rounded-xl border border-primary/20 bg-primary/5 font-mono text-xs min-w-[150px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500/60" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <span className="w-2 h-2 rounded-full bg-green-500/60" />
      </div>
      <span className="text-primary" style={{ textShadow: "0 0 8px rgba(0,212,255,0.5)" }}>
        {displayed}
        <span className="animate-pulse">▌</span>
      </span>
    </div>
  );
};

const badges = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    label: "5.0 no Google",
    sub: "Avaliação média",
  },
  {
    icon: <span className="text-primary text-base">✓</span>,
    label: "100% Garantia",
    sub: "Em todos os serviços",
  },
  {
    icon: <span className="text-primary text-base">⚡</span>,
    label: "10 min",
    sub: "Para ter seu orçamento",
  },
  {
    icon: <MapPin size={14} className="text-primary" />,
    label: "VG + Cuiabá",
    sub: "Busca na sua porta",
  },
];

const Footer = () => {
  const open = isOpen();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* aurora */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[200px] bg-purple-500/5 blur-[90px] pointer-events-none" />

      {/* ── CTA strip ── */}
      <div className="border-b border-border/60">
        <div className="container px-4 max-w-6xl mx-auto py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">
              Assistência técnica em VG e Cuiabá
            </p>
            <h3 className="font-heading text-2xl md:text-3xl font-black leading-tight">
              Tem um PC com problema?<br />
              <span className="text-muted-foreground font-medium text-xl">Orçamento grátis em menos de 10 minutos.</span>
            </h3>
          </div>
          <MagneticCTA />
        </div>
      </div>

      <div className="container px-4 max-w-6xl mx-auto py-14">

        {/* ── colunas ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
            <a href="/" className="relative inline-block w-fit group">
              <style>{`
                @keyframes logo-glow {
                  0%,100% { filter: drop-shadow(0 0 4px rgba(0,212,255,0.3)); }
                  50%     { filter: drop-shadow(0 0 12px rgba(0,212,255,0.7)); }
                }
                @keyframes logo-shimmer {
                  0%   { left: -60%; }
                  100% { left: 120%; }
                }
              `}</style>
              <div className="overflow-hidden rounded-sm absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute top-0 bottom-0 w-1/3"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.35), transparent)",
                    animation: "logo-shimmer 0.7s ease-in-out",
                    animationPlayState: "running",
                  }}
                />
              </div>
              <img
                src="/maker_info_transparente.png"
                alt="Maker Info"
                className="h-14 w-[140px] object-contain object-left transition-all duration-300 group-hover:scale-105"
                style={{ animation: "logo-glow 3s ease-in-out infinite" }}
              />
            </a>
            <MiniTerminal />
            </div>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              Assistência técnica em Várzea Grande e Cuiabá. Consertamos rápido e buscamos na sua porta.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/makerinfo.mt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-highlight-pink hover:border-highlight-pink transition-all hover:shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61588424697526" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all hover:shadow-[0_0_12px_rgba(0,212,255,0.3)]">
                <Facebook size={16} />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-green-400 hover:border-green-400 transition-all hover:shadow-[0_0_12px_rgba(74,222,128,0.3)]">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40">Navegação</p>
            <FooterLink href="/">Início</FooterLink>
            <FooterLink href="/servicos">Serviços</FooterLink>
            <FooterLink href="/empresas">Para Empresas</FooterLink>
            <FooterLink href="/pedido">Meu Pedido</FooterLink>
            <FooterLink href="/#localizacao">Localização</FooterLink>
          </div>

          {/* Projetos */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40">Projetos</p>
            <FooterLink href="/makergym">
              Maker Gym
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-highlight-pink/10 border border-highlight-pink/20 text-[9px] font-bold text-highlight-pink">NOVO</span>
            </FooterLink>
            <FooterLink href="/studio">
              Studio Pro
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary">BETA</span>
            </FooterLink>
          </div>

          {/* Serviços */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40">Serviços</p>
            <FooterLink href="/servicos">Formatação</FooterLink>
            <FooterLink href="/servicos">Limpeza interna</FooterLink>
            <FooterLink href="/servicos">Upgrade de SSD</FooterLink>
            <FooterLink href="/servicos">Recuperação de dados</FooterLink>
            <FooterLink href="/servicos">Remoção de vírus</FooterLink>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/40">Contato</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-primary transition-colors w-fit">
              <MessageCircle size={14} className="shrink-0" />
              (65) 9 9282-4709
            </a>
            <a href="https://www.instagram.com/makerinfo.mt/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-highlight-pink transition-colors w-fit">
              <Instagram size={14} className="shrink-0" />
              @makerinfo.mt
            </a>
            <div className="flex items-start gap-2 text-sm text-muted-foreground/70">
              <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
              <span>Rua Olinda, Q: V L: 11<br />Jardim União — Várzea Grande, MT</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground/70">
              <Clock size={14} className="shrink-0 mt-0.5 text-primary" />
              <span>Seg–Sex 8h–18h<br />Sáb 8h–12h</span>
            </div>
          </div>
        </div>

        {/* ── Selos de credibilidade ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 border border-border/60">
              <div className="shrink-0">{b.icon}</div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{b.label}</p>
                <p className="text-xs text-muted-foreground/60">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider neon ── */}
        <div className="h-px w-full mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2) 30%, rgba(0,212,255,0.2) 70%, transparent)" }} />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} Maker Info · Feito em Várzea Grande, MT
          </p>

          {/* status ao vivo */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            open
              ? "bg-green-500/10 border-green-500/20 text-green-500"
              : "bg-border/30 border-border text-muted-foreground"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500 animate-pulse" : "bg-muted-foreground/40"}`} />
            {open ? "Atendendo agora" : "Fora do horário · Seg–Sex 8h–18h"}
          </div>

          <a href="/pedido"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/8 border border-green-500/20 text-green-500 text-xs font-semibold hover:bg-green-500/15 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Acompanhar meu pedido ⚡
          </a>
        </div>
      </div>

      {/* ── Botão voltar ao topo ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
        className="fixed bottom-6 right-4 z-[9980] p-3 rounded-xl border border-primary/40 bg-card/90 backdrop-blur text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/10"
        style={{
          opacity: showTop ? 1 : 0,
          transform: showTop ? "translateY(0)" : "translateY(12px)",
          pointerEvents: showTop ? "auto" : "none",
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
};

export default Footer;
