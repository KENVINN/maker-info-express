import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";

const faqs = [
  {
    q: "Quanto custa o serviço?",
    a: "Cada caso é único, por isso fazemos um orçamento personalizado e gratuito. Manda uma mensagem no WhatsApp e em menos de 10 minutos te passamos o valor sem nenhum compromisso.",
  },
  {
    q: "Vocês buscam o computador em casa?",
    a: "Sim! Buscamos e entregamos na sua porta em Várzea Grande e Cuiabá. Você não precisa sair de casa nem se preocupar com transporte.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "Depende do serviço. Formatações e limpezas costumam ser entregues no mesmo dia ou em até 24h. Serviços mais complexos como recuperação de dados ou reparo de placa podem levar mais tempo mas sempre avisamos o prazo antes de começar.",
  },
  {
    q: "Os serviços têm garantia?",
    a: "Sim! Todos os nossos serviços têm garantia. Se aparecer qualquer problema relacionado ao serviço realizado, a gente resolve sem custo adicional.",
  },
  {
    q: "Vocês atendem PC e notebook?",
    a: "Sim, atendemos tanto PC Desktop quanto notebooks de qualquer marca.",
  },
  {
    q: "Perdi meus dados, vocês conseguem recuperar?",
    a: "Tentamos! Fazemos a avaliação gratuitamente e só cobramos se conseguirmos recuperar os dados. Vale a pena tentar antes de desistir.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background/60 backdrop-blur">
      <div className="container px-4 max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-black text-center mb-2">
            Perguntas <span className="text-gradient-neon">frequentes</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10">
            Tire suas dúvidas antes de entrar em contato
          </p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <SpotlightCard
                key={i}
                radius={250}
                className="rounded-2xl bg-card/80 backdrop-blur border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-card/50 transition-colors"
                >
                  <span className="font-heading font-bold text-sm md:text-base">{faq.q}</span>
                  <span className={`text-primary text-xl shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FaqSection;
