import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";

const depoimentos = [
  { nome: "Cliente via WhatsApp", avatar: "💬", fonte: "WhatsApp", estrelas: 5, texto: "Ficou muito bom, meus parabéns, te desejo sucesso no seu negócio! 🤝" },
  { nome: "Gabriela N.",          avatar: "G",  fonte: "Google",   estrelas: 5, texto: "Ótima! Super recomendo o serviço." },
  { nome: "Erik B.",              avatar: "E",  fonte: "Google",   estrelas: 5, texto: "Excelente serviço, exímio profissional e preço camarada! 👌" },
  { nome: "Maria G.",             avatar: "M",  fonte: "Google",   estrelas: 5, texto: "Excelente atendimento, entrega o trabalho muito rápido e bem feito! Super recomendo!!" },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-3">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className="w-4 h-4 text-highlight-amber fill-highlight-amber" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % depoimentos.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-background/60 backdrop-blur">
      <div className="container px-4 max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="font-heading text-3xl font-black text-center mb-2">
            O que nossos <span className="text-gradient-neon">clientes dizem</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10">
            Avaliação média ⭐ 5.0 · Google Maps e WhatsApp
          </p>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {depoimentos.map((d, i) => (
                <div key={i} className="w-full shrink-0 px-2">
                  <SpotlightCard className="p-8 rounded-2xl bg-card/80 backdrop-blur neon-border-purple text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-black text-primary mx-auto mb-4">
                      {d.avatar}
                    </div>
                    <Stars />
                    <p className="text-foreground text-base leading-relaxed mb-5 italic">
                      "{d.texto}"
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-heading font-bold text-sm">{d.nome}</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {d.fonte === "Google" ? <GoogleIcon /> : <WhatsAppIcon />}
                        {d.fonte}
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {depoimentos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30 w-2"}`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
