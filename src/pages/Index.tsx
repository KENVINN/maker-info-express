import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import WhatsAppFab from "@/components/WhatsAppFab";

// Lazy load everything below the fold
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const TrackingSection = lazy(() => import("@/components/TrackingSection"));
const BeforeAfterSection = lazy(() => import("@/components/BeforeAfterSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FaqSection = lazy(() => import("@/components/FaqSection"));
const LocationSection = lazy(() => import("@/components/locationsection"));
const Footer = lazy(() => import("@/components/Footer"));

const ServicosPreview = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-16 bg-card/60 backdrop-blur">
      <div className="container px-4 text-center">
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
      </div>
    </section>
  )
}));

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <Suspense fallback={<div className="h-20" />}>
        <HowItWorksSection />
        <TrackingSection />
        <ServicosPreview />
        <BeforeAfterSection />
        <TestimonialsSection />
        <FaqSection />
        <LocationSection />
        <Footer />
      </Suspense>
      <WhatsAppFab />
    </div>
  );
};

export default Index;
