import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { valor: 10, sufixo: "+", label: "Computadores consertados" },
  { valor: 5, sufixo: "★", label: "Avaliação no Google" },
  { valor: 10, sufixo: "min", label: "Para ter seu orçamento" },
  { valor: 100, sufixo: "%", label: "Garantia nos serviços" },
];

const AnimatedNumber = ({ target, sufixo }: { target: number; sufixo: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 30);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 40);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-heading text-3xl md:text-4xl font-black text-primary">
      {count}{sufixo}
    </span>
  );
};

const StatsBar = () => (
  <section className="py-12 bg-card/60 backdrop-blur border-y border-border">
    <div className="container px-4 max-w-4xl mx-auto">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <AnimatedNumber target={s.valor} sufixo={s.sufixo} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default StatsBar;
