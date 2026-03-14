import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import LocationSection from "@/components/locationsection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import StatsBar from "@/components/StatsBar";
import TrackingSection from "@/components/TrackingSection";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";

const ServicosPreview = () => (
  <section className="py-16 bg-card/60 backdrop-blur">
    <div className="container px-4 text-center">
      <ScrollReveal>
        <h2 className="font-heading text-3xl md:text-4xl font-black mb-4">
          O que a gente <span className="text-secondary">conserta</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Limpeza, formatação, upgrade de SSD, recuperação de dados, remoção de vírus e muito mais.
        </p>
        <a href="/servicos"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary text-primary font-heading font-bold text-base hover:bg-primary hover:text-primary-foreground transition-all duration-200">
          Ver todos os serviços →
        </a>
      </ScrollReveal>
    </div>
  </section>
);

const EmpresasCTA = () => (
  <section className="py-20">
    <div className="container px-4 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="relative rounded-2xl bg-card neon-border-cyan overflow-hidden px-8 py-12 md:px-16 md:py-14 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="text-5xl shrink-0">🏢</div>
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-4">
              Para empresas
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-black mb-3">
              Tem uma empresa?{" "}
              <span className="text-gradient-neon">A gente cuida da sua TI.</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Planos mensais de suporte técnico para manter os computadores da sua empresa funcionando todo dia, sem surpresa, sem parada.
            </p>
          </div>
          <a
            href="/empresas"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all animate-pulse-neon whitespace-nowrap"
          >
            Ver planos →
          </a>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorksSection />
      <TrackingSection />
      <ServicosPreview />
      <EmpresasCTA />
      <BeforeAfterSection />
      <TestimonialsSection />
      <FaqSection />
      <LocationSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Index;
