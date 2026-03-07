import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import LocationSection from "@/components/locationsection";
import TestimonialsSection from "@/components/TestimonialsSection";
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
        <a
          href="/servicos"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary text-primary font-heading font-bold text-base hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          Ver todos os serviços →
        </a>
      </ScrollReveal>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ServicosPreview />
      <BeforeAfterSection />
      <TestimonialsSection />
      <LocationSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Index;
