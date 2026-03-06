import heroBg from "@/assets/hero-bg.jpg";

const WHATSAPP_URL = "https://wa.me/5565999999999?text=Olá! Gostaria de fazer um orçamento.";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center px-4 py-20 md:py-32">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up">
          Seu PC ou Notebook{" "}
          <span className="text-gradient-neon">Deixou Você na Mão?</span>
        </h1>

        <h2 className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Consertamos Rápido e Buscamos na Sua Porta! 🛵
        </h2>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-xl bg-primary text-primary-foreground font-heading text-base md:text-lg font-bold animate-pulse-neon hover:brightness-110 transition-all animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          🟩 FAZER ORÇAMENTO NO WHATSAPP AGORA
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
