import { useState } from "react";
import { Menu, X } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/maker_info_logo.png"
            alt="Maker Info"
            className="h-9 w-auto object-contain"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Serviços
          </a>
          <a href="/#antes-depois" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Antes e Depois
          </a>
          <a href="/localizacao" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Localização
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-bold neon-glow-cyan hover:brightness-110 transition-all"
          >
            WHATSAPP
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6 pt-2 flex flex-col gap-4 animate-fade-in-up">
          <a href="/#servicos" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Serviços
          </a>
          <a href="/#antes-depois" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Antes e Depois
          </a>
          <a href="/localizacao" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Localização
          </a>
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
