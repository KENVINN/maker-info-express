import { Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary font-heading text-primary-foreground text-sm font-black">
            M
          </span>
          <span className="font-heading text-base font-bold text-foreground">
            Maker <span className="text-primary">Info</span>
          </span>
        </div>

        <p className="text-muted-foreground text-sm text-center max-w-md">
          Garantia em todos os serviços prestados.
        </p>

        {/* Social */}
        <div className="flex gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-highlight-pink hover:border-highlight-pink transition-colors"
          >
            <Instagram size={18} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="p-2.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
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
