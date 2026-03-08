import { useEffect, useState } from "react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const ExitPopup = () => {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !shown) {
        setVisible(true);
        setShown(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [shown]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-card border border-primary/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-primary/20">
        {/* Fechar */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
        >
          ✕
        </button>

        {/* Emoji */}
        <div className="text-5xl mb-4">⚡</div>

        <h2 className="font-heading text-2xl font-black mb-2">
          Espera! Antes de ir...
        </h2>

        <p className="text-muted-foreground mb-2">
          Seu computador com problema pode piorar se você esperar.
        </p>
        <p className="text-primary font-semibold mb-6">
          Orçamento grátis em menos de 10 minutos — sem compromisso!
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setVisible(false)}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#25D366] text-white font-heading font-black text-base hover:brightness-110 transition-all shadow-lg shadow-[#25D366]/25 mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
          QUERO MEU ORÇAMENTO GRÁTIS
        </a>

        <button
          onClick={() => setVisible(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Não, vou deixar meu PC quebrado
        </button>
      </div>
    </div>
  );
};

export default ExitPopup;
