import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";
import TestimonialsSection from "@/components/TestimonialsSection";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+fazer+um+orçamento&type=phone_number&app_absent=0";

type TipoPreco = "duplo" | "fixo" | "orcamento" | "apartir";

type Servico = {
  emoji: string;
  titulo: string;
  problema: string;
  descricao: string;
  beneficios: string[];
  tag: string | null;
  tagColor: string;
  preco: string | null;
  precoGamer?: string;
  tipoPreco: TipoPreco;
};

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const servicos: Servico[] = [
  {
    emoji: "🧹",
    titulo: "Limpeza e Manutenção Preventiva",
    problema: "PC lento, superaquecendo ou fazendo barulho estranho?",
    descricao: "Poeira acumulada mata o desempenho e a vida útil do seu equipamento. Fazemos limpeza completa interna, troca de pasta térmica e verificação geral. Seu PC volta a respirar.",
    beneficios: ["Temperatura reduzida", "Desempenho restaurado", "Vida útil prolongada"],
    tag: "Mais pedido",
    tagColor: "bg-primary/20 text-primary",
    preco: "R$ 100",
    precoGamer: "R$ 140",
    tipoPreco: "duplo",
  },
  {
    emoji: "💻",
    titulo: "Formatação e Reinstalação de Sistema",
    problema: "Windows lento, travando ou cheio de erros?",
    descricao: "Formatamos e reinstalamos o sistema do zero, com todos os drivers e programas essenciais configurados. Seu computador volta novo, rápido e sem lixo.",
    beneficios: ["Sistema limpo e otimizado", "Drivers atualizados", "Programas essenciais instalados"],
    tag: null,
    tagColor: "",
    preco: "R$ 120",
    tipoPreco: "fixo",
  },
  {
    emoji: "🔥",
    titulo: "Combo: Limpeza + Formatação",
    problema: "Quer resolver tudo de uma vez e economizar?",
    descricao: "Limpeza completa interna + formatação + drivers + programas essenciais. Tudo junto, num preço especial. A solução mais completa para um PC novo de novo.",
    beneficios: ["Tudo resolvido de uma vez", "Economia de R$ 40", "Prazo: 1 dia útil"],
    tag: "Melhor custo-benefício",
    tagColor: "bg-secondary/20 text-secondary",
    preco: "R$ 200",
    tipoPreco: "fixo",
  },
  {
    emoji: "🛡️",
    titulo: "Remoção de Vírus e Malware",
    problema: "PC lento, com anúncios estranhos ou comportamento suspeito?",
    descricao: "Vírus, ransomware, adware. Identificamos e eliminamos qualquer ameaça e instalamos proteção para você não passar por isso de novo.",
    beneficios: ["Remoção completa", "Antivírus configurado", "Orientação de segurança"],
    tag: null,
    tagColor: "",
    preco: "R$ 100",
    tipoPreco: "fixo",
  },
  {
    emoji: "🐢",
    titulo: "Limpeza e Otimização",
    problema: "PC lento mas sem vírus? O problema pode ser acúmulo de lixo.",
    descricao: "Removemos arquivos temporários, desativamos programas desnecessários na inicialização e ajustamos o sistema para rodar mais rápido. Sem precisar formatar.",
    beneficios: ["PC mais rápido sem formatar", "Inicialização mais rápida", "Mais espaço em disco"],
    tag: null,
    tagColor: "",
    preco: "R$ 70",
    tipoPreco: "fixo",
  },
  {
    emoji: "📦",
    titulo: "Instalação de Programas",
    problema: "Precisa de um programa específico instalado e configurado?",
    descricao: "Instalamos qualquer software que você precisar: pacote Office, Adobe, programas de design, jogos ou qualquer outro. Tudo configurado e pronto para usar.",
    beneficios: ["Qualquer software", "Configurado do seu jeito", "Rápido e sem complicação"],
    tag: null,
    tagColor: "",
    preco: "R$ 50",
    tipoPreco: "fixo",
  },
  {
    emoji: "💿",
    titulo: "Backup de Dados",
    problema: "Com medo de perder suas fotos e documentos importantes?",
    descricao: "Fazemos cópia de segurança de todos os seus arquivos antes de qualquer serviço. Fotos, documentos, vídeos — tudo salvo e organizado.",
    beneficios: ["Todos os arquivos protegidos", "Organizado por categoria", "Tranquilidade antes de formatar"],
    tag: null,
    tagColor: "",
    preco: "R$ 50",
    tipoPreco: "fixo",
  },
  {
    emoji: "📡",
    titulo: "Configuração de Rede e Internet",
    problema: "Wi-Fi fraco, internet caindo ou rede sem funcionar?",
    descricao: "Configuramos roteadores, repetidores, redes domésticas e empresariais. Deixamos tudo estável, seguro e com sinal onde você precisa.",
    beneficios: ["Sinal estável", "Rede segura", "Configuração de todos os dispositivos"],
    tag: null,
    tagColor: "",
    preco: "R$ 100",
    tipoPreco: "fixo",
  },
  {
    emoji: "📶",
    titulo: "Instalação de Repetidor Wi-Fi",
    problema: "Tem cômodo da casa que não pega sinal?",
    descricao: "Instalamos e configuramos repetidores de sinal Wi-Fi para eliminar os pontos cegos da sua casa ou empresa. Sinal em todos os ambientes.",
    beneficios: ["Sinal em todo lugar", "Configuração completa", "Sem ponto cego"],
    tag: null,
    tagColor: "",
    preco: "R$ 60",
    tipoPreco: "fixo",
  },
  {
    emoji: "🖨️",
    titulo: "Configuração de Impressora",
    problema: "Impressora não aparece no PC ou parou de funcionar?",
    descricao: "Instalamos drivers, configuramos impressoras em rede e resolvemos qualquer problema de impressão. Funciona para todos os computadores da casa ou empresa.",
    beneficios: ["Driver instalado e atualizado", "Todos os PCs conectados", "Impressão funcionando na hora"],
    tag: null,
    tagColor: "",
    preco: "R$ 70",
    tipoPreco: "fixo",
  },
  {
    emoji: "⚡",
    titulo: "Upgrade de Memória RAM e SSD",
    problema: "Computador trava ao abrir vários programas?",
    descricao: "Trocar o HD por um SSD é a atualização mais impactante que existe. O PC pode ficar até 5x mais rápido. Também fazemos upgrade de RAM para multitarefa sem travar.",
    beneficios: ["Boot em segundos", "Programas abrindo na hora", "Sem travamentos"],
    tag: null,
    tagColor: "",
    preco: null,
    tipoPreco: "orcamento",
  },
  {
    emoji: "🔩",
    titulo: "Troca de Pasta Térmica",
    problema: "PC superaquecendo, desligando sozinho ou com cooler gritando?",
    descricao: "A pasta térmica seca com o tempo e para de transferir calor do processador. Trocamos por uma pasta de qualidade e seu PC volta a trabalhar na temperatura certa.",
    beneficios: ["Temperatura reduzida", "Sem desligamentos inesperados", "Cooler mais silencioso"],
    tag: null,
    tagColor: "",
    preco: "R$ 60",
    tipoPreco: "fixo",
  },
  {
    emoji: "🔋",
    titulo: "Troca de Bateria de Notebook",
    problema: "Notebook não sai da tomada porque a bateria não dura nada?",
    descricao: "Substituímos a bateria do seu notebook por uma compatível e de qualidade. Você volta a usar sem ficar preso na tomada.",
    beneficios: ["Bateria com autonomia de volta", "Peça compatível com seu modelo", "Instalação no mesmo dia"],
    tag: null,
    tagColor: "",
    preco: null,
    tipoPreco: "orcamento",
  },
  {
    emoji: "🖥️",
    titulo: "Troca de Tela de Notebook",
    problema: "Tela quebrada, manchada ou sem imagem?",
    descricao: "Substituímos a tela do seu notebook com peça de qualidade. Fazemos a desmontagem completa, troca e teste antes de entregar. Orçamento confirmado antes de qualquer serviço.",
    beneficios: ["Peça com garantia", "Orçamento antes do serviço", "Todos os modelos"],
    tag: null,
    tagColor: "",
    preco: null,
    tipoPreco: "orcamento",
  },
  {
    emoji: "🔧",
    titulo: "Montagem de PC",
    problema: "Comprou as peças e precisa de alguém de confiança para montar?",
    descricao: "Montamos seu PC do zero com organização de cabos, instalação do sistema operacional e todos os drivers. Testamos tudo antes de entregar.",
    beneficios: ["Montagem profissional", "Cabos organizados", "Windows instalado e configurado"],
    tag: null,
    tagColor: "",
    preco: "R$ 100",
    tipoPreco: "fixo",
  },
  {
    emoji: "💾",
    titulo: "Recuperação de Dados",
    problema: "Perdeu fotos, documentos ou arquivos importantes?",
    descricao: "HD com defeito, acidente ou formatação acidental. Tentamos recuperar seus dados antes de qualquer outro procedimento. Avaliamos e só cobramos se recuperar.",
    beneficios: ["Avaliação gratuita", "Sem recuperação = sem custo", "Sigilo garantido"],
    tag: "Avaliação grátis",
    tagColor: "bg-highlight-amber/20 text-highlight-amber",
    preco: "R$ 150",
    tipoPreco: "apartir",
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

const PrecoTag = ({ preco, precoGamer, tipoPreco }: { preco: string | null; precoGamer?: string; tipoPreco: TipoPreco }) => {
  if (tipoPreco === "duplo") {
    return (
      <div className="mt-4 mb-2 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">PC comum</span>
          <span className="font-heading font-black text-xl text-primary">{preco}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">PC Gamer</span>
          <span className="font-heading font-black text-xl text-secondary">{precoGamer}</span>
        </div>
      </div>
    );
  }
  if (tipoPreco === "orcamento") {
    return (
      <div className="mt-4 mb-2">
        <span className="text-xs font-semibold text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full">
          💬 Preço sob orçamento
        </span>
      </div>
    );
  }
  if (tipoPreco === "apartir") {
    return (
      <div className="mt-4 mb-2 flex items-baseline gap-1.5">
        <span className="text-xs text-muted-foreground">a partir de</span>
        <span className="font-heading font-black text-2xl text-highlight-amber">{preco}</span>
      </div>
    );
  }
  return (
    <div className="mt-4 mb-2 flex items-baseline gap-1.5">
      <span className="font-heading font-black text-2xl text-primary">{preco}</span>
      <span className="text-xs text-muted-foreground font-medium">fixo</span>
    </div>
  );
};

const Servicos = () => {
  return (
    <div className="min-h-screen">
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
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.descricao}</p>
                  <ul className="space-y-1.5 mb-2">
                    {s.beneficios.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-primary font-bold">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <PrecoTag preco={s.preco} precoGamer={s.precoGamer} tipoPreco={s.tipoPreco} />
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 text-primary font-heading font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 mt-2"
                  >
                    <WhatsAppIcon />
                    Pedir orçamento
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="py-16 bg-card/60 backdrop-blur">
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

        <TestimonialsSection />

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
