import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import { ShieldCheck, MonitorCheck, Wrench, Wifi, Printer, HeadphonesIcon } from "lucide-react";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+gostaria+de+saber+mais+sobre+os+planos+para+empresas&type=phone_number&app_absent=0";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const planos = [
  {
    titulo: "Plano Pequeno",
    tag: null,
    tagColor: "",
    destaque: false,
    pcs: "até 5 computadores",
    preco: "R$ 300",
    precoSufixo: "– R$ 500/mês",
    descricao: "Ideal para pequenos escritórios, consultórios e comércios. Mantemos seus computadores funcionando sem você precisar se preocupar.",
    beneficios: [
      "Visita mensal preventiva",
      "Limpeza física dos equipamentos",
      "Verificação de saúde dos HDs",
      "Atualização do Windows",
      "Suporte remoto via AnyDesk",
      "Prioridade no atendimento",
    ],
  },
  {
    titulo: "Plano Médio",
    tag: "Mais contratado",
    tagColor: "bg-primary/20 text-primary",
    destaque: true,
    pcs: "6 a 15 computadores",
    preco: "R$ 800",
    precoSufixo: "– R$ 1.200/mês",
    descricao: "Para empresas em crescimento que não podem parar. Suporte completo com relatório mensal para você acompanhar tudo.",
    beneficios: [
      "Visita mensal preventiva",
      "Limpeza física dos equipamentos",
      "Verificação de saúde dos HDs",
      "Atualização do Windows",
      "Suporte remoto ilimitado",
      "Prioridade máxima no atendimento",
      "Relatório mensal detalhado",
    ],
  },
  {
    titulo: "Plano Grande",
    tag: null,
    tagColor: "",
    destaque: false,
    pcs: "15+ computadores",
    preco: "R$ 1.500",
    precoSufixo: "– R$ 2.000/mês",
    descricao: "Para empresas com grande parque de máquinas. Atendimento intensivo com visitas quinzenais e suporte completo.",
    beneficios: [
      "Visitas quinzenais preventivas",
      "Limpeza física dos equipamentos",
      "Verificação de saúde dos HDs",
      "Atualização do Windows",
      "Suporte remoto ilimitado",
      "Atendimento prioritário 24h",
      "Relatório mensal detalhado",
      "Consultoria em TI inclusa",
    ],
  },
];

const servicos = [
  {
    icon: MonitorCheck,
    emoji: "🖥️",
    titulo: "Manutenção Preventiva Mensal",
    problema: "Equipamentos parando na hora errada custa caro.",
    descricao: "Visita mensal para limpar fisicamente os PCs, verificar temperaturas, checar saúde dos discos e atualizar o sistema. Prevenimos antes do problema acontecer.",
    beneficios: ["Menos quebras inesperadas", "PCs sempre atualizados", "Relatório de cada visita"],
  },
  {
    icon: HeadphonesIcon,
    emoji: "🎧",
    titulo: "Suporte Técnico Remoto",
    problema: "Problema urgente e não pode esperar visita?",
    descricao: "Acessamos o computador do seu colaborador remotamente via AnyDesk e resolvemos na hora. Sem deslocamento, sem espera, sem parar o trabalho.",
    beneficios: ["Resolução em minutos", "Sem precisar sair do lugar", "Disponível nos dias úteis"],
  },
  {
    icon: Wrench,
    emoji: "🔧",
    titulo: "Manutenção Corretiva",
    problema: "PC quebrou e precisa resolver rápido?",
    descricao: "Atendemos chamados de emergência com prioridade para clientes com contrato. Diagnóstico, reparo e retorno do equipamento o mais rápido possível.",
    beneficios: ["Prioridade no atendimento", "Orçamento antes do serviço", "Garantia no reparo"],
  },
  {
    icon: Wifi,
    emoji: "📡",
    titulo: "Configuração de Rede",
    problema: "Internet caindo ou rede lenta na empresa?",
    descricao: "Configuramos e otimizamos a rede da sua empresa. Roteadores, switches, Wi-Fi corporativo e cabeamento. Tudo estável e seguro.",
    beneficios: ["Rede estável e segura", "Wi-Fi em todos os ambientes", "Configuração de firewall básico"],
  },
  {
    icon: Printer,
    emoji: "🖨️",
    titulo: "Configuração de Impressoras em Rede",
    problema: "Todo mundo precisando imprimir, mas a impressora não aparece?",
    descricao: "Configuramos impressoras compartilhadas em rede para que todos os computadores da empresa imprimam sem complicação.",
    beneficios: ["Todos os PCs conectados", "Impressão sem fila de erro", "Configuração rápida"],
  },
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    titulo: "Consultoria e Relatório de TI",
    problema: "Não sabe o estado real dos equipamentos da empresa?",
    descricao: "Entregamos todo mês um relatório completo: quais PCs estão com problema, o que precisa de upgrade em breve e recomendações para evitar paradas.",
    beneficios: ["Decisões com base em dados", "Planejamento de upgrades", "Incluído nos planos Médio e Grande"],
  },
];

const diferenciais = [
  {
    icon: ShieldCheck,
    titulo: "Contrato sem burocracia",
    texto: "Contrato simples, direto e sem multa de saída. Você fica porque quer, não porque é obrigado.",
  },
  {
    icon: MonitorCheck,
    titulo: "Relatório mensal",
    texto: "Você recebe todo mês um relatório com o que foi feito e o estado de cada equipamento.",
  },
  {
    icon: HeadphonesIcon,
    titulo: "Suporte remoto incluído",
    texto: "Problemas urgentes resolvidos remotamente sem esperar visita agendada.",
  },
];

const Empresas = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">

        {/* Hero */}
        <div className="container px-4 max-w-4xl mx-auto text-center mb-20">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-6">
              🏢 Planos para Empresas
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              TI da sua empresa{" "}
              <span className="text-gradient-neon">funcionando todo dia</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Planos mensais de suporte técnico para empresas de Várzea Grande e Cuiabá. Sem surpresa, sem parada, sem dor de cabeça.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-base font-bold animate-pulse-neon hover:brightness-110 transition-all"
            >
              <WhatsAppIcon />
              QUERO UM PLANO PARA MINHA EMPRESA
            </a>
          </ScrollReveal>
        </div>

        {/* Planos */}
        <div className="container px-4 max-w-6xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-black text-center mb-12">
              Escolha o plano{" "}
              <span className="text-gradient-neon">certo para você</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planos.map((p, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={`relative flex flex-col h-full p-6 rounded-2xl bg-card transition-all duration-300 ${p.destaque ? "neon-border-cyan neon-glow-cyan scale-[1.02]" : "neon-border-purple hover:neon-glow-purple"}`}>
                  {p.tag && (
                    <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  )}
                  <h2 className="font-heading font-black text-xl mb-1 text-foreground">{p.titulo}</h2>
                  <p className="text-muted-foreground text-xs mb-4">{p.pcs}</p>
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="font-heading font-black text-3xl text-primary">{p.preco}</span>
                    <span className="text-xs text-muted-foreground font-medium">{p.precoSufixo}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.descricao}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {p.beneficios.map((b, j) => (
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
                    Quero esse plano
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Serviços incluídos */}
        <div className="container px-4 max-w-6xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-black text-center mb-4">
              O que está{" "}
              <span className="text-gradient-neon">incluído nos planos</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
              Cada plano cobre todos esses serviços, de forma preventiva ou sob demanda.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="relative flex flex-col h-full p-6 rounded-2xl bg-card neon-border-purple hover:neon-glow-purple transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:animate-float">{s.emoji}</div>
                  <h2 className="font-heading font-black text-lg mb-2 text-foreground">{s.titulo}</h2>
                  <p className="text-primary text-sm font-semibold mb-3 italic">"{s.problema}"</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.descricao}</p>
                  <ul className="space-y-1.5">
                    {s.beneficios.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-primary font-bold">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <div className="py-16 bg-card/60 backdrop-blur">
          <div className="container px-4 max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="font-heading text-3xl font-black text-center mb-12">
                Por que fechar contrato com a{" "}
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

        {/* CTA final */}
        <div className="container px-4 max-w-2xl mx-auto text-center mt-24">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-black mb-4">
              Sua empresa merece TI de qualidade 🚀
            </h2>
            <p className="text-muted-foreground mb-8">
              Manda uma mensagem agora. Fazemos uma visita de diagnóstico grátis antes de fechar qualquer contrato.
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

export default Empresas;
