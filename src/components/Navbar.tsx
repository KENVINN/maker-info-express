import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

// Horários: Seg-Sex 8h-18h, Sáb 8h-14h (ajuste se precisar)
const isOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 6=Sáb
  const hour = now.getHours() + now.getMinutes() / 60;
  if (day === 0) return false;
  if (day === 6) return hour >= 8 && hour < 14;
  return hour >= 8 && hour < 18;
};

const StatusBadge = () => {
  const open = isOpen();
  return (
    <span className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      open
        ? "bg-green-500/15 text-green-400 border border-green-500/20"
        : "bg-red-500/15 text-red-400 border border-red-500/20"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
      {open ? "Aberto agora" : "Fechado"}
    </span>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.toggle("light", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <img src="/maker_info_logo.png" alt="Maker Info" className="h-9 w-auto object-contain" />
        </a>

        <div className="hidden md:flex items-center gap-6">
          <StatusBadge />
          <a href="/servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
          <a href="/#antes-depois" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Antes e Depois</a>
          <a href="/#localizacao" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Localização</a>

          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-all" aria-label="Alternar tema">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-bold hover:brightness-110 transition-all">
            WHATSAPP
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <StatusBadge />
          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-all" aria-label="Alternar tema">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground" aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 flex flex-col gap-4">
          <a href="/servicos" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
          <a href="/#antes-depois" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Antes e Depois</a>
          <a href="/#localizacao" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Localização</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-bold text-center">
            WHATSAPP
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
