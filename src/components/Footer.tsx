import { Instagram, Facebook, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4 flex flex-col items-center gap-6">
        <img src="/maker_info_logo.png" alt="Maker Info" className="h-14 w-auto object-contain" />

        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground text-center">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span>Rua Olinda, Q: V L: 11 - Jardim União, Várzea Grande - MT, 78118-720</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span>Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm text-center max-w-md">
          Garantia em todos os serviços prestados.
        </p>

        {/* Link rastreamento */}
        <a href="/pedido" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold hover:bg-green-500/20 transition-all">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Acompanhar meu pedido em tempo real ⚡
        </a>

        <div className="flex gap-4">
          <a href="https://www.instagram.com/makerinfo.mt/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-highlight-pink hover:border-highlight-pink transition-colors">
            <Instagram size={18} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61588424697526" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
            <Facebook size={18} />
          </a>
        </div>

        <p className="text-muted-foreground/50 text-xs">
          © {new Date().getFullYear()} Maker Info. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
