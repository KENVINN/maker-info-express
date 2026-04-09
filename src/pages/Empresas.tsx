import { useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import { type LucideIcon, ShieldCheck, MonitorCheck, Wrench, HeadphonesIcon } from "lucide-react";
import { api } from "@/lib/api";

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
      "Relatório mensal detalhado",
      "Consultoria em TI inclusa",
    ],
  },
];

const niveisPlano = [
  { chave: "pequeno", titulo: "Pequeno", pcs: "até 5 PCs", resumo: "Essencial", destaque: false },
  { chave: "medio", titulo: "Médio", pcs: "6 a 15 PCs", resumo: "Mais contratado", destaque: true },
  { chave: "grande", titulo: "Grande", pcs: "15+ PCs", resumo: "Operação crítica", destaque: false },
] as const;

type PlanoKey = (typeof niveisPlano)[number]["chave"];

type CoberturaPlano = {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  observacao: string;
  valores: Record<PlanoKey, string>;
};

const coberturaPlanos: CoberturaPlano[] = [
  {
    icon: MonitorCheck,
    titulo: "Manutenção preventiva",
    descricao: "Rotina técnica para reduzir travamentos, superaquecimento, lentidão e falhas antes que virem prejuízo.",
    observacao: "Menos surpresa, menos máquina parada e mais previsibilidade para a operação.",
    valores: {
      pequeno: "Mensal",
      medio: "Mensal",
      grande: "Quinzenal",
    },
  },
  {
    icon: HeadphonesIcon,
    titulo: "Suporte remoto",
    descricao: "Atendimento rápido para erros, travamentos e ajustes do dia a dia sem esperar visita técnica.",
    observacao: "Seu time volta a trabalhar mais rápido, com menos interrupção.",
    valores: {
      pequeno: "Incluído",
      medio: "Ilimitado",
      grande: "Ilimitado prioritário",
    },
  },
  {
    icon: Wrench,
    titulo: "Manutenção corretiva",
    descricao: "Diagnóstico e reparo para quando o problema já aconteceu e precisa de resposta sem enrolação.",
    observacao: "Quem tem contrato não entra no fim da fila quando a urgência aparece.",
    valores: {
      pequeno: "Fila prioritária",
      medio: "Atendimento expresso",
      grande: "Prioridade máxima",
    },
  },
  {
    icon: ShieldCheck,
    titulo: "Relatório e consultoria",
    descricao: "Clareza sobre o estado dos equipamentos, próximos riscos e onde vale investir antes do problema crescer.",
    observacao: "Você deixa de apagar incêndio e passa a decidir com base em cenário real.",
    valores: {
      pequeno: "Sob demanda",
      medio: "Relatório mensal",
      grande: "Relatório + consultoria",
    },
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

const QTD_PCS_OPTIONS = ["1–5 PCs", "6–15 PCs", "15+ PCs", "Ainda não sei"];

const Empresas = () => {
  const [form, setForm] = useState({ nome_empresa: "", contato_nome: "", contato_telefone: "", qtd_pcs: "" });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const enviarLead = async () => {
    if (!form.nome_empresa.trim() || !form.contato_telefone.trim()) return;
    setEnviando(true);
    setErro("");
    try {
      await api.leads.create(form);
      setSucesso(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível enviar. Tente pelo WhatsApp.");
    } finally {
      setEnviando(false);
    }
  };

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

        {/* Cobertura dos planos */}
        <div className="container px-4 max-w-6xl mx-auto mb-24">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-black text-center mb-4">
              Veja o nível de{" "}
              <span className="text-gradient-neon">proteção em cada plano</span>
            </h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
              Você não está contratando só visita técnica. Está comprando prevenção, resposta rápida e mais controle sobre a TI da empresa.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="hidden lg:block overflow-hidden rounded-[28px] bg-card/70 backdrop-blur neon-border-purple">
              <div className="grid grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,0.95fr))] bg-background/50">
                <div className="px-6 py-5 border-b border-border/70">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    Comparativo
                  </p>
                  <p className="font-heading text-2xl font-black text-foreground">
                    O que sua empresa recebe
                  </p>
                </div>
                {niveisPlano.map((plano) => (
                  <div
                    key={plano.chave}
                    className={`px-4 py-5 border-b border-border/70 ${plano.destaque ? "bg-primary/5" : ""}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground mb-1">
                      Plano
                    </p>
                    <p className="font-heading text-xl font-black text-foreground">{plano.titulo}</p>
                    <p className="text-xs text-primary font-semibold mt-1">{plano.resumo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{plano.pcs}</p>
                  </div>
                ))}
              </div>

              {coberturaPlanos.map((item, index) => (
                <div
                  key={item.titulo}
                  className={`grid grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,0.95fr))] ${
                    index > 0 ? "border-t border-border/70" : ""
                  }`}
                >
                  <div className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 neon-border-cyan flex items-center justify-center shrink-0">
                        <item.icon size={22} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-black text-foreground mb-2">{item.titulo}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.descricao}</p>
                        <p className="text-xs font-semibold text-primary">{item.observacao}</p>
                      </div>
                    </div>
                  </div>

                  {niveisPlano.map((plano) => (
                    <div
                      key={plano.chave}
                      className={`px-4 py-5 flex items-center ${plano.destaque ? "bg-primary/5" : ""}`}
                    >
                      <div
                        className={`w-full rounded-2xl px-3 py-3 text-center text-sm font-bold leading-snug ${
                          plano.destaque
                            ? "bg-primary/15 text-primary border border-primary/20"
                            : "bg-background/70 text-foreground border border-border"
                        }`}
                      >
                        {item.valores[plano.chave]}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {coberturaPlanos.map((item, index) => (
              <ScrollReveal key={item.titulo} delay={index * 80}>
                <div className="h-full rounded-2xl bg-card p-5 neon-border-purple">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 neon-border-cyan flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-black text-foreground">{item.titulo}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{item.descricao}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {niveisPlano.map((plano) => (
                      <div
                        key={plano.chave}
                        className={`rounded-2xl border px-3 py-3 text-center ${
                          plano.destaque
                            ? "border-primary/20 bg-primary/10"
                            : "border-border bg-background/50"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          {plano.titulo}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-primary">{plano.resumo}</p>
                        <p className="mt-2 text-xs font-bold leading-snug text-foreground">
                          {item.valores[plano.chave]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs font-semibold text-primary">{item.observacao}</p>
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

        {/* CTA final — formulário de lead */}
        <div className="container px-4 max-w-xl mx-auto mt-24">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl md:text-4xl font-black mb-4">
                Agende um diagnóstico gratuito 🚀
              </h2>
              <p className="text-muted-foreground">
                Preencha abaixo e entraremos em contato em até 24h. Sem compromisso.
              </p>
            </div>

            {sucesso ? (
              <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-3">
                <p className="text-green-400 font-heading font-black text-xl">✓ Recebemos seu contato!</p>
                <p className="text-muted-foreground text-sm">
                  Entraremos em contato pelo WhatsApp em breve para agendar a visita de diagnóstico.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-heading font-bold text-sm hover:brightness-110 transition-all"
                >
                  <WhatsAppIcon />
                  Falar agora pelo WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <input
                  value={form.nome_empresa}
                  onChange={(e) => setForm((f) => ({ ...f, nome_empresa: e.target.value }))}
                  placeholder="Nome da empresa *"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <input
                  value={form.contato_nome}
                  onChange={(e) => setForm((f) => ({ ...f, contato_nome: e.target.value }))}
                  placeholder="Seu nome (responsável)"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <input
                  value={form.contato_telefone}
                  onChange={(e) => setForm((f) => ({ ...f, contato_telefone: e.target.value }))}
                  placeholder="WhatsApp para contato *"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Quantos computadores sua empresa tem?</p>
                  <div className="flex flex-wrap gap-2">
                    {QTD_PCS_OPTIONS.map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, qtd_pcs: op }))}
                        className={`px-4 py-2 rounded-lg text-xs font-heading font-bold border transition-all ${
                          form.qtd_pcs === op
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
                {erro && <p className="text-destructive text-sm">{erro}</p>}
                <button
                  onClick={enviarLead}
                  disabled={enviando || !form.nome_empresa.trim() || !form.contato_telefone.trim()}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Solicitar diagnóstico gratuito"}
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Prefere falar agora?{" "}
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:brightness-110 transition-colors">
                    Abrir WhatsApp
                  </a>
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>

      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Empresas;
