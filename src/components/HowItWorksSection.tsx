import { MessageCircle, Bike, Rocket } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    icon: MessageCircle,
    emoji: "💬",
    title: "1. Fale com o Técnico",
    text: "Conte o problema no WhatsApp.",
  },
  {
    icon: Bike,
    emoji: "🛵",
    title: "2. Buscamos Aí",
    text: "Retiramos em VG e Cuiabá.",
  },
  {
    icon: Rocket,
    emoji: "🚀",
    title: "3. PC Novo de Novo",
    text: "Entregamos pronto para o uso.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="servicos" className="py-20 md:py-28 bg-card">
      <div className="container px-4">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-14">
            Como Funciona{" "}
            <span className="text-secondary">(É Vapt-Vupt)</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background neon-border-blue hover:neon-glow-blue transition-all duration-300 group h-full">
                <div className="text-5xl mb-5 group-hover:animate-float">
                  {step.emoji}
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
