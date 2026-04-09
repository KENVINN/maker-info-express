import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/SpotlightCard";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const diferenciais = [
  { emoji: "📍", title: "Sabe onde está seu PC", desc: "Diagnóstico, reparo e testes você vê cada etapa acontecendo em tempo real." },
  { emoji: "🔔", title: "Sem precisar ligar", desc: "Chega de ficar ligando pra saber se ficou pronto. O status aparece no seu celular." },
  { emoji: "🛵", title: "A gente busca na sua porta", desc: "Não precisa sair de casa. Buscamos e entregamos em Várzea Grande e Cuiabá." },
  { emoji: "⚡", title: "Atualiza no mesmo segundo", desc: "Assim que o técnico muda o status, você já vê no celular. Sem delay, sem enrolação." },
];

const TrackingSection = () => (
  <section className="py-20">
    <div className="container px-4 max-w-5xl mx-auto">
      <ScrollReveal>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Exclusivo Maker Info · Único em Várzea Grande
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-black mb-4">
            Você acompanha o reparo <span className="text-gradient-neon">ao vivo</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Igual rastrear uma entrega do iFood mas pro seu computador. Nenhuma outra assistência técnica de Várzea Grande oferece isso.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {diferenciais.map((d, i) => (
            <SpotlightCard key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
              <span className="text-3xl shrink-0">{d.emoji}</span>
              <div>
                <h3 className="font-heading font-black text-sm mb-1">{d.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{d.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <SpotlightCard className="relative rounded-2xl bg-card border border-primary/20 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-border">
              <p className="text-xs text-muted-foreground mb-4 font-semibold uppercase tracking-wider">Como o cliente vê</p>
              <div className="space-y-2">
                {[
                  { emoji: "🔍", label: "Em Diagnóstico", done: true },
                  { emoji: "🔧", label: "Em Reparo", active: true },
                  { emoji: "🧪", label: "Testes Finais", done: false },
                  { emoji: "✅", label: "Pronto para Retirada", done: false },
                  { emoji: "🛵", label: "Saída para Entrega", done: false },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    item.active ? "bg-primary/10 border border-primary/30" :
                    item.done ? "opacity-50" : "opacity-20"
                  }`}>
                    <span>{item.emoji}</span>
                    <span className={`text-sm font-heading font-bold flex-1 ${item.active ? "text-primary" : ""}`}>{item.label}</span>
                    {item.done && <span className="text-primary text-xs">✓</span>}
                    {item.active && <span className="text-xs text-primary font-semibold animate-pulse">Agora ⚡</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 md:p-8 md:max-w-xs">
              <div>
                <p className="text-xs text-green-500 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                  Disponível para todos os clientes
                </p>
                <h3 className="font-heading text-xl font-black mb-2">Traga seu PC hoje e acompanhe tudo pelo celular</h3>
                <p className="text-muted-foreground text-sm">Enviamos o código pelo WhatsApp na hora que recebemos. Grátis, sem app, sem cadastro.</p>
              </div>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm text-center hover:brightness-110 transition-all neon-glow-cyan">
                Quero levar meu PC agora →
              </a>

              <a href="/pedido"
                className="px-6 py-3 rounded-xl border border-green-500/30 text-green-500 font-heading font-bold text-sm text-center hover:bg-green-500/10 transition-all">
                Já tenho um código · Acompanhar
              </a>
            </div>
          </div>
        </SpotlightCard>

      </ScrollReveal>
    </div>
  </section>
);

export default TrackingSection;
