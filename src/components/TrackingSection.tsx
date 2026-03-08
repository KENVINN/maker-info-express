import ScrollReveal from "@/components/ScrollReveal";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const steps = [
  { emoji: "📋", title: "Pedido aberto", desc: "A gente cadastra seu equipamento e te envia o código" },
  { emoji: "🔧", title: "Acompanhe o reparo", desc: "Veja cada etapa em tempo real pelo seu celular" },
  { emoji: "✅", title: "Pronto pra retirar", desc: "Você recebe a notificação quando estiver pronto" },
];

const TrackingSection = () => (
  <section className="py-20">
    <div className="container px-4 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Novidade · Rastreamento em tempo real
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-black mb-4">
            Acompanhe seu reparo <span className="text-gradient-neon">ao vivo</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Igual rastrear uma entrega — mas para o seu computador. Sem precisar ligar, sem ficar sem resposta.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
              <div className="text-4xl mb-3">{s.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center">{i + 1}</span>
                <h3 className="font-heading font-black text-sm">{s.title}</h3>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-primary/40 text-lg">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Demo card */}
        <div className="relative rounded-2xl bg-card border border-primary/20 p-6 md:p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Mock timeline */}
            <div className="flex-1 space-y-2 w-full">
              {[
                { emoji: "🔍", label: "Em Diagnóstico", done: true },
                { emoji: "🔧", label: "Em Reparo", active: true },
                { emoji: "🧪", label: "Testes Finais", done: false },
                { emoji: "✅", label: "Pronto para Retirada", done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${item.active ? "bg-primary/10 border border-primary/30" : item.done ? "opacity-50" : "opacity-20"}`}>
                  <span>{item.emoji}</span>
                  <span className={`text-sm font-heading font-bold ${item.active ? "text-primary" : ""}`}>{item.label}</span>
                  {item.done && <span className="ml-auto text-primary text-xs">✓</span>}
                  {item.active && <span className="ml-auto text-xs text-primary font-semibold animate-pulse">Atual ⚡</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center md:items-start gap-4 md:max-w-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-500 font-semibold">Atualiza no mesmo segundo</span>
              </div>
              <h3 className="font-heading text-xl font-black text-center md:text-left">Seu equipamento, sempre à vista</h3>
              <p className="text-muted-foreground text-sm text-center md:text-left">Digite o código que enviamos no WhatsApp e veja onde está seu reparo agora.</p>
              <a href="/pedido" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all neon-glow-cyan">
                Acompanhar meu pedido →
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default TrackingSection;
