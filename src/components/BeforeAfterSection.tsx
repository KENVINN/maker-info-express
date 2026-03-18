import { useState, useRef } from "react";
import ScrollReveal from "./ScrollReveal";

interface SliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
}

const BeforeAfterSlider = ({ beforeSrc, afterSrc, beforeAlt = "Antes", afterAlt = "Depois" }: SliderProps) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-col-resize neon-border-purple select-none"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* DEPOIS */}
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* ANTES — recorte pelo slider */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: containerRef.current?.offsetWidth || "100%" }}
          loading="lazy"
        />
      </div>
      {/* Divisor */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary neon-glow-cyan z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center neon-glow-cyan">
          <span className="text-primary-foreground text-xs font-bold">⟨⟩</span>
        </div>
      </div>
      <span className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded-md text-xs font-heading font-bold text-foreground z-20">
        ANTES
      </span>
      <span className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-md text-xs font-heading font-bold text-primary z-20">
        DEPOIS
      </span>
    </div>
  );
};

const sliders = [
  {
    beforeSrc: "/before-pc.jpg",
    afterSrc: "/after-pc.jpg",
    beforeAlt: "PC antes da limpeza",
    afterAlt: "PC depois da limpeza",
  },
  {
    beforeSrc: "/before-pc2.jpg",
    afterSrc: "/after-pc2.jpg",
    beforeAlt: "PC antes da limpeza",
    afterAlt: "PC depois da limpeza com RGB",
  },
  {
    beforeSrc: "/before-montagem.png",
    afterSrc: "/after-montagem.png",
    beforeAlt: "Peças antes da montagem",
    afterAlt: "PC montado",
  },
];

const BeforeAfterSection = () => {
  return (
    <section id="antes-depois" className="py-20 md:py-28">
      <div className="container px-4">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-center mb-4">
            Dá uma olhada no nível da nossa{" "}
            <span className="text-primary">manutenção</span>:
          </h2>
          <p className="text-muted-foreground text-center mb-12 text-sm">
            Arraste para comparar o antes e depois
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sliders.map((slider, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <BeforeAfterSlider {...slider} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
