import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const servicos = [
  {
    emoji: "🧹",
    titulo: "Limpeza e Manutenção Preventiva",
    problema: "PC lento, superaquecendo ou fazendo barulho estranho?",
    descricao: "Poeira acumulada mata o desempenho e a vida útil do seu equipamento. Fazemos limpeza completa interna, troca de pasta térmica e verificação geral. Seu PC volta a respirar.",
    beneficios: ["Temperatura reduzida", "Desempenho restaurado", "Vida útil prolongada"],
    tag: "Mais pedido",
    tagColor: "bg-primary/20 text-primary",
  },
  {
    emoji: "💻",
    titulo: "Formatação e Reinstalação de Sistema",
    problema: "Windows lento, travando ou cheio de erros?",
    descricao: "Formatamos e reinstalamos o sistema do zero, com todos os drivers e programas essenciais configurados. Seu computador volta novo, rápido e sem lixo.",
    beneficios: ["Sistema limpo e otimizado", "Drivers atualizados", "Programas essenciais instalados"],
    tag: null,
    tagColor: "",
  },
  {
    emoji: "⚡",
    titulo: "Upgrade de Memória RAM e SSD",
    problema: "Computador trava ao abrir vários programas?",
    descricao: "Trocar o HD por um SSD é a atualização mais impactante que existe. O PC pode ficar até 5x mais rápido. Também fazemos upgrade de RAM para multitarefa sem travar.",
    beneficios: ["Boot em segundos", "Programas abrindo na hora", "Sem travamentos"],
    tag: "Melhor custo-benefício",
    tagColor: "bg-secondary/20 text-secondary",
  },
  {
    emoji: "💾",
    titulo: "Recuperação de Dados",
    problema: "Perdeu fotos, documentos ou arquivos importantes?",
    descricao: "HD com defeito, acidente ou formatação acidental. Tentamos recuperar seus dados antes de qualquer outro procedimento. Avaliamos e só cobramos se recuperar.",
    beneficios: ["Avaliação gratuita", "Sem recuperação = sem custo", "Sigilo garantido"],
    tag: "Avaliação grátis",
    tagColor: "bg-highlight-amber/20 text-highlight-amber",
  },
  {
    emoji: "🛡️",
    titulo: "Remoção de Vírus e Malware",
    problema: "PC lento, com anúncios estranhos ou comportamento suspeito?",
    descricao: "Vírus, ransomware, adware. Identificamos e eliminamos qualquer ameaça e instalamos proteção para você não passar por isso de novo.",
    beneficios: ["Remoção completa", "Antivírus configurado", "Orientação de segurança"],
    tag: null,
    tagColor: "",
  },
  {
    emoji: "📡",
    titulo: "Configuração de Rede e Internet",
    problema: "Wi-Fi fraco, internet caindo ou rede sem funcionar?",
    descricao: "Configuramos roteadores, repetidores, redes domésticas e empresariais. Deixamos tudo estável, seguro e com sinal onde você precisa.",
    beneficios: ["Sinal estável", "Rede segura", "Configuração de todos os dispositivos"],
    tag: null,
    tagColor: "",
  },
];

const diferenciais = [
  {
    icon: Truck,
    titulo: "Buscamos na Sua Porta",
    texto: "Retiramos e entregamos em Várzea Grande e Cuiabá. Você não precisa sair de casa.",
  },
  {
    icon: ShieldCheck,
    titulo: "Garantia em Tudo",
    texto: "Todos os serviços têm garantia. Se der problema, a gente resolve sem custo adicional.",
  },
  {
    icon: MessageCircle,
    titulo: "Orçamento em 10 Minutos",
    texto: "Manda uma mensagem agora e já te passamos o valor. Sem enrolação, sem surpresa.",
  },
];

const Servicos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">

        <div className="container px-4 max-w-4xl mx-auto text-center mb-20">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-6">
              🖥️ PC Desktop e Notebook
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Tudo que seu computador{" "}
              <span className="text-gradient-neon">precisa, a gente resolve</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Orçamento sem compromisso, busca na sua porta e garantia em todos os serviços. Simples assim.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-base font-bold animate-pulse-neon hover:brightness-110 transition-all"
            >
              <WhatsAppIcon />
              QUERO UM ORÇAMENTO GRÁTIS
            </a>
          </ScrollReveal>
        </div>

        <div className="container px-4 max-w-6xl mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="relative flex flex-col h-full p-6 rounded-2xl bg-card neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
                  {s.tag && (
                    <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${s.tagColor}`}>
                      {s.tag}
                    </span>
                  )}
                  <div className="text-4xl mb-4 group-hover:animate-float">{s.emoji}</div>
                  <h2 className="font-heading font-black text-lg mb-2 text-foreground">{s.titulo}</h2>
                  <p className="text-primary text-sm font-semibold mb-3 italic">"{s.problema}"</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{s.descricao}</p>
                  <ul className="space-y-1.5 mb-6">
                    {s.beneficios.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-primary font-bold">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 text-primary font-heading font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <WhatsAppIcon />
                    Pedir orçamento
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="bg-card py-16">
          <div className="container px-4 max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="font-heading text-3xl font-black text-center mb-12">
                Por que escolher a{" "}
                <span className="text-gradient-neon">Maker Info?</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {diferenciais.map((d, i) => (
                <ScrollReveal key={i} delay={i * 150}>
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background neon-border-cyan">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                      <d.icon size={24} className="text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-base mb-2">{d.titulo}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{d.texto}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        <div className="container px-4 max-w-2xl mx-auto text-center mt-24">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-4">
              Pronto para resolver de vez? 🚀
            </h2>
            <p className="text-muted-foreground mb-8">
              Manda uma mensagem agora. Orçamento grátis, sem compromisso e a gente busca aí.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-[#25D366] text-white font-heading text-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-[#25D366]/25"
            >
              <WhatsAppIcon />
              FALAR COM O TÉCNICO AGORA
            </a>
          </ScrollReveal>
        </div>

      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Servicos;
