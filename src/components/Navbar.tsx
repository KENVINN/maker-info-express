import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

// ── bug fix: usa fuso de Cuiabá, não o horário do visitante ──────────────────
const isOpen = () => {
  const now  = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Cuiaba" }));
  const day  = now.getDay();
  const time = now.getHours() + now.getMinutes() / 60;
  if (day >= 1 && day <= 5) return time >= 8 && time < 18;
  if (day === 6)             return time >= 8 && time < 12;
  return false;
};

const StatusBadge = () => {
  const open = isOpen();
  return (
    <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
      open
        ? "bg-green-500/10 border-green-500/30 text-green-500"
        : "bg-red-500/10 border-red-500/30 text-red-400"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
      {open ? "Aberto agora" : "Fechado"}
    </div>
  );
};

// nav link with growing neon underline on hover
const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a
    href={href}
    onClick={onClick}
    className="relative text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group py-0.5"
  >
    {children}
    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300 rounded-full"
          style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }} />
  </a>
);

const Navbar = () => {
  const [open,     setOpen]     = useState(false);
  const [dark,     setDark]     = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark",  isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark",  next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:   scrolled ? "rgba(var(--background),0.97)" : "rgba(var(--background),0.80)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(0,212,255,0.18)"
          : "1px solid rgba(var(--border),1)",
        boxShadow: scrolled ? "0 1px 24px rgba(0,212,255,0.06)" : "none",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="relative inline-flex items-center gap-2 group">
          <style>{`
            @keyframes nav-logo-glow {
              0%,100% { filter: drop-shadow(0 0 3px rgba(0,212,255,0.25)); }
              50%     { filter: drop-shadow(0 0 10px rgba(0,212,255,0.6)); }
            }
            @keyframes nav-logo-shimmer {
              0%   { left: -60%; }
              100% { left: 120%; }
            }
          `}</style>
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm overflow-hidden">
              <div
                className="absolute top-0 bottom-0 w-1/3"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)", animation: "nav-logo-shimmer 0.65s ease-in-out" }}
              />
            </div>
            <img
              src="/maker_info_transparente.png"
              alt="Maker Info"
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ animation: "nav-logo-glow 3s ease-in-out infinite" }}
              width="36"
              height="36"
            />
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <StatusBadge />
          <NavLink href="/servicos">Serviços</NavLink>
          <NavLink href="/empresas">Empresas</NavLink>
          <NavLink href="/pedido">Meu Pedido</NavLink>
          <NavLink href="/#localizacao">Localização</NavLink>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all"
            aria-label="Alternar tema"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-bold neon-glow-cyan hover:brightness-110 transition-all"
          >
            WHATSAPP
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-all" aria-label="Alternar tema">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground" aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 flex flex-col gap-4 animate-fade-in-up">
          <StatusBadge />
          <NavLink href="/servicos"    onClick={() => setOpen(false)}>Serviços</NavLink>
          <NavLink href="/empresas"    onClick={() => setOpen(false)}>Empresas</NavLink>
          <NavLink href="/pedido"      onClick={() => setOpen(false)}>Meu Pedido</NavLink>
          <NavLink href="/#localizacao" onClick={() => setOpen(false)}>Localização</NavLink>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-bold text-center neon-glow-cyan"
          >
            WHATSAPP
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
