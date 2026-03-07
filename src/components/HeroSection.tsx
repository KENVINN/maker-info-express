import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const stats = [
  { valor: "100%", label: "Garantia nos serviços" },
  { valor: "10min", label: "Orçamento no WhatsApp" },
  { valor: "VG+CPA", label: "Busca na sua porta" },
];

const frases = [
  "Travando e lento?",
  "Cheio de vírus?",
  "Não liga mais?",
  "Tela quebrada?",
  "Perdeu seus dados?",
  "Wi-Fi sem funcionar?",
];

const TypingText = () => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = frases[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % frases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-gradient-neon">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container px-4 max-w-5xl mx-auto text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Várzea Grande e Cuiabá · Busca na sua porta
          </div>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4">
            Seu PC ou Notebook
          </h1>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 min-h-[1.3em]">
            <TypingText />
          </h2>

          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-10">
            A gente conserta rápido e ainda busca na sua porta. Orçamento grátis em menos de 10 minutos.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-black animate-pulse-neon hover:brightness-110 transition-all shadow-2xl shadow-primary/30 mb-14"
          >
            <WhatsAppIcon />
            FAZER ORÇAMENTO AGORA
          </a>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-card/60 backdrop-blur border border-border">
                <span className="font-heading text-2xl font-black text-primary mb-1">{s.valor}</span>
                <span className="text-xs text-muted-foreground text-center leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/40">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
