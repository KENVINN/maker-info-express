import { useEffect, useState } from "react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const NotFound = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🖥️</div>

      <h1 className="font-heading text-6xl font-black text-primary mb-2">404</h1>
      <h2 className="font-heading text-2xl font-black mb-4">
        Página não encontrada{dots}
      </h2>
      <p className="text-muted-foreground max-w-sm mb-2">
        Parece que essa página deu problema — assim como computador sem manutenção.
      </p>
      <p className="text-primary font-semibold mb-10">
        A gente conserta as duas situações! 😄
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/"
          className="px-8 py-3 rounded-xl border border-primary text-primary font-heading font-bold hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Voltar para Home
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-xl bg-[#25D366] text-white font-heading font-bold hover:brightness-110 transition-all"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
};

export default NotFound;
