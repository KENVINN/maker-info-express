import { useEffect } from "react";
import {
  Activity,
  ArrowRight,
  BellRing,
  BrainCircuit,
  ChartColumnIncreasing,
  Dumbbell,
  Flame,
  ShieldCheck,
  Sparkles,
  Smartphone,
  TimerReset,
  Users2,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import WaitlistSignup from "@/components/makergym/WaitlistSignup";

const featureCards = [
  {
    icon: ChartColumnIncreasing,
    title: "Progresso que dá para enxergar",
    description:
      "Acompanhe volume, séries, repetições, cargas e histórico com leitura clara do que realmente está evoluindo.",
  },
  {
    icon: TimerReset,
    title: "Treino vivo, não só registro",
    description:
      "Use timer de descanso, fluxo de sessão e atalhos rápidos para manter ritmo real de treino sem atrito.",
  },
  {
    icon: Users2,
    title: "Solo ou em dupla",
    description:
      "O app foi pensado para treino individual e também para experiências com parceiro em fluxos compatíveis.",
  },
  {
    icon: BellRing,
    title: "Lembretes que ajudam",
    description:
      "Receba alertas e notificações para voltar ao treino e manter consistência ao longo da semana.",
  },
  {
    icon: BrainCircuit,
    title: "Inteligência opcional",
    description:
      "Quando disponível, use sugestões inteligentes para estruturar treinos e refinar decisões com mais rapidez.",
  },
  {
    icon: ShieldCheck,
    title: "Conta e dados sob controle",
    description:
      "Autenticação, recuperação de senha e fluxo de exclusão de conta preparados para uma operação mais saudável.",
  },
];

const valuePoints = [
  "Treino registrado com clareza",
  "Volume e progresso como métricas centrais",
  "Timer, histórico e constância no mesmo fluxo",
  "Experiência mobile com cara de produto real",
];

const tapes = [
  "Volume total como métrica principal",
  "Timer de descanso no ritmo do treino",
  "Histórico limpo e legível",
  "Constância visível ao longo da semana",
  "Fluxo mobile com menos fricção",
  "Recursos premium e smart quando fizer sentido",
];

const spotlightCards = [
  {
    eyebrow: "Live Session",
    title: "Registrar no meio do treino precisa ser rápido",
    body:
      "A interface foi pensada para uso real: séries, reps, carga, volume, timer e progresso sem parecer um painel burocrático.",
  },
  {
    eyebrow: "Momentum",
    title: "Consistência fica visível",
    body:
      "O app junta histórico, métricas e lembretes para transformar frequência em leitura de evolução, não só em lista de sessões passadas.",
  },
  {
    eyebrow: "Maker Look",
    title: "Visual premium com clima de performance",
    body:
      "A estética puxa o neon do ecossistema Maker Info, mas com atmosfera fitness, contraste forte e destaque para dados que importam.",
  },
];

const screenshotMoments = [
  {
    label: "Sessão ativa",
    title: "Registrar sem quebrar o ritmo",
    body:
      "A hierarquia visual destaca o que interessa no meio do treino: exercício atual, progresso da sessão, timer e volume.",
  },
  {
    label: "Consistência",
    title: "Dados que contam uma história",
    body:
      "O histórico ganha leitura de progresso, e não cara de arquivo morto. A landing vende essa sensação de continuidade.",
  },
];

const faqs = [
  {
    question: "O Maker Gym já está na Play Store?",
    answer:
      "O app está em preparação final para distribuição. Esta página já centraliza informações públicas, suporte e política de privacidade.",
  },
  {
    question: "Preciso de assinatura para usar tudo?",
    answer:
      "Alguns recursos podem depender de conta, permissões do aparelho, internet ou assinatura premium, conforme a fase do produto.",
  },
  {
    question: "Como entro em contato com suporte?",
    answer:
      "Você pode usar a página de suporte em makerinfo.com.br/makergym/support ou escrever para suporte@makergym.app.",
  },
];

const promoVideo = "/makergym/assets/makergym-promo.mp4";
const promoPoster = "/makergym/assets/makergym-promo-poster.png";
const screenshotArts = [
  "/makergym/assets/makergym-shot-1.png",
  "/makergym/assets/makergym-shot-2.png",
];
const logoArt = "/makergym/assets/logo.png";

const MakerGym = () => {
  useEffect(() => {
    document.title = "Maker Gym | Treino com progresso real";

    const description =
      "Maker Gym é um app de treino focado em volume, progressão, histórico, timer, consistência e experiência real de evolução.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  return (
    <div className="maker-gym-grid-bg min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute left-[-10%] top-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl maker-glow-drift" />
        <div className="absolute right-[-12%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-secondary/20 blur-3xl maker-glow-drift-delayed" />
        <div className="absolute bottom-[-10%] left-[20%] h-[24rem] w-[24rem] rounded-full bg-highlight-amber/10 blur-3xl maker-glow-drift" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <a href="/makergym" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary neon-glow-cyan">
              <Dumbbell size={18} />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/80">Maker Info</div>
              <div className="font-heading text-lg font-black">Maker Gym</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Recursos</a>
            <a href="#gallery" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Galeria</a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
            <a
              href="/makergym/privacy-policy/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-14 px-4 py-14 md:grid-cols-[1.02fr_0.98fr] md:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary maker-shimmer-border">
              <Activity size={14} />
              Treino com progresso real
            </div>

            <h1 className="font-heading text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              A landing que parece
              <span className="block text-gradient-neon">o app já em movimento.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              O Maker Gym foi feito para quem quer treinar com clareza. Registre séries, reps,
              cargas e volume total, mantenha o ritmo com timer de descanso e acompanhe evolução
              real ao longo das semanas com uma experiência visual que parece viva.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-heading text-sm font-black text-primary-foreground neon-glow-cyan transition-all hover:brightness-110"
              >
                Entrar na lista
                <ArrowRight size={16} />
              </a>
              <a
                href="/makergym/support/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-secondary/40 hover:bg-secondary/10"
              >
                Suporte e contato
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {valuePoints.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-card/70 px-4 py-4 text-sm text-muted-foreground backdrop-blur"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="font-semibold text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-2xl">
              <WaitlistSignup source="makergym-hero" compact />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[38rem]">
            <div className="absolute -left-10 top-12 z-20 hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary md:flex maker-float-wide">
              6 treinos na semana
            </div>
            <div className="absolute -right-4 top-3 z-20 hidden rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:flex maker-float-wide-delayed">
              Smart workout ready
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-10 top-10 h-[24rem] rounded-full bg-gradient-to-r from-primary/30 via-secondary/20 to-highlight-amber/15 blur-3xl" />

              <div className="relative z-10 w-[16rem] rounded-[2.5rem] border border-white/10 bg-[#07101b]/92 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl maker-float-panel">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1624]">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-primary/75">
                    <span>Maker Gym</span>
                    <span>Live Session</span>
                  </div>
                  <video
                    className="h-[23rem] w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={promoPoster}
                  >
                    <source src={promoVideo} type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="absolute -left-2 bottom-16 z-20 hidden w-44 rounded-[2rem] border border-white/10 bg-card/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur lg:block maker-float-card">
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary/70">Upper Focus</div>
                <div className="mt-2 text-3xl font-black">4.280 kg</div>
                <div className="mt-2 text-sm text-muted-foreground">volume total da sessão</div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-primary via-secondary to-highlight-amber" />
                </div>
              </div>

              <div className="absolute -right-4 top-24 z-20 hidden w-48 rounded-[2rem] border border-white/10 bg-card/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur lg:block maker-float-card-delayed">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-secondary/75">Rest Timer</div>
                    <div className="mt-2 text-3xl font-black">01:15</div>
                  </div>
                  <TimerReset className="text-secondary" size={22} />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Ritmo de treino, sem perder o foco.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-white/8 bg-card/35 py-4 backdrop-blur">
          <div className="maker-marquee">
            <div className="maker-marquee-track">
              {[...tapes, ...tapes].map((item, index) => (
                <div key={`${item}-${index}`} className="maker-marquee-pill">
                  <Sparkles size={14} className="text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="container px-4 py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <ScrollReveal className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/12 via-card/85 to-secondary/10 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">Direção visual</div>
              <h2 className="mt-4 font-heading text-4xl font-black md:text-5xl">
                Visual de produto, não de template.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                A página foi desenhada para parecer lançamento de app, mas agora com uma leitura
                mais limpa: menos repetição, mais foco no mockup principal e nos pontos que vendem
                o produto sem poluir a navegação.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-primary/70">Clareza</div>
                  <p className="leading-7 text-muted-foreground">
                    O hero já mostra o app em ação. Aqui, a página passa a reforçar mensagem,
                    percepção de marca e foco em progressão sem repetir o mesmo ativo de mídia.
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-secondary/70">Narrativa</div>
                  <p className="leading-7 text-muted-foreground">
                    A sequência agora privilegia progresso, consistência e confiança para Play
                    Store, em vez de multiplicar vídeos, mockups e imagens concorrendo pela atenção.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-4">
                  <img
                    src={logoArt}
                    alt="Maker Gym logo"
                    className="h-14 w-14 rounded-[1.1rem] object-cover shadow-[0_10px_30px_rgba(21,188,236,0.25)]"
                  />
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
                      Maker Gym
                    </div>
                    <div className="mt-1 font-heading text-2xl font-black">
                      Treino bem registrado. Progresso bem lido.
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid gap-5">
              {spotlightCards.map((card, index) => (
                <ScrollReveal
                  key={card.title}
                  className="group rounded-[1.75rem] border border-white/10 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card"
                  delay={index * 120}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{card.eyebrow}</div>
                  <h3 className="mt-3 font-heading text-2xl font-black">{card.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{card.body}</p>
                </ScrollReveal>
              ))}

            </div>
          </div>
        </section>

        <section className="container px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal className="rounded-[2rem] border border-white/10 bg-card/70 p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                <Sparkles size={14} />
                Screenshot story
              </div>
              <h2 className="mt-5 font-heading text-4xl font-black md:text-5xl">
                Cada dobra da página vende um momento do app.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Não é só uma landing com prints jogados. A estrutura encena treino, consistência e
                ritmo, para a percepção de produto vir antes mesmo do download.
              </p>
              <div className="mt-8 rounded-[1.7rem] border border-white/10 bg-black/20 p-4">
                <div className="maker-play-badge">
                  <div className="maker-play-badge-icon" />
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-primary/80">Coming soon</div>
                    <div className="text-lg font-black">Google Play release track</div>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Domínio próprio, links públicos, suporte e política já prontos. A conta Play ainda é a
                  última milha, mas a apresentação já está com cara de lançamento.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 md:grid-cols-2">
              {screenshotMoments.map((moment, index) => (
                <ScrollReveal
                  key={moment.title}
                  delay={index * 140}
                  className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-card/75"
                >
                  <div className="relative h-72 overflow-hidden border-b border-white/10 bg-[#0b1624]">
                    <img
                      src={screenshotArts[index]}
                      alt={moment.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
                      {moment.label}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-2xl font-black">{moment.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{moment.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-card/40 backdrop-blur">
          <div className="container grid gap-4 px-4 py-6 md:grid-cols-4">
            {[
              ["Volume total", "Métrica central de evolução"],
              ["Timer de descanso", "Ritmo real de sessão"],
              ["Histórico claro", "Leitura de progresso no tempo"],
              ["Fluxo mobile", "Rápido o bastante para usar treinando"],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-black/15 px-4 py-5">
                <div className="font-heading text-lg font-black">{title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="container px-4 py-20">
          <div className="max-w-2xl">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-primary">Recursos centrais</div>
            <h2 className="font-heading text-4xl font-black md:text-5xl">
              Um app que respeita o treino de verdade.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Menos fricção para registrar, mais contexto para evoluir. O Maker Gym foi pensado
              para o momento do treino e também para a leitura do que aconteceu depois.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal
                key={title}
                className="group rounded-[1.75rem] border border-white/10 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card"
                delay={index * 90}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="experience" className="container px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/12 via-card/80 to-secondary/10 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">Experiência</div>
              <h2 className="mt-4 font-heading text-4xl font-black md:text-5xl">
                Direção visual premium, mas com dados no centro.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                A linguagem do Maker Gym mistura performance, clareza e atmosfera. Não é uma
                planilha fria nem um fitness genérico. É um produto para gente que gosta de treino
                bem feito e acompanhamento legível.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "UI escura com destaque em cyan e acentos vivos",
                  "Blocos densos de informação com leitura rápida",
                  "Chamadas visuais que valorizam carga, volume e constância",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6">
                <Smartphone className="text-primary" size={22} />
                <h3 className="mt-4 font-heading text-2xl font-black">Mobile first</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Fluxos pensados para usar com treino correndo, uma mão no aparelho e pouca
                  paciência para menus desnecessários.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6">
                <Dumbbell className="text-secondary" size={22} />
                <h3 className="mt-4 font-heading text-2xl font-black">Força e volume</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  A proposta gira em torno de progressão real, sessão bem registrada e leitura de
                  performance ao longo do tempo.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Links públicos</div>
                    <h3 className="mt-2 font-heading text-3xl font-black">Play Store pronta para receber o app</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href="/makergym/privacy-policy/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-primary/30 hover:text-primary">
                      Privacy Policy
                    </a>
                    <a href="/makergym/support/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-secondary/30 hover:text-secondary">
                      Support
                    </a>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Esta estrutura já deixa o domínio pronto para Play Console, página do app,
                  política de privacidade e contato de suporte em URLs públicas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="container px-4 pb-24">
          <div className="mb-10 max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">FAQ</div>
            <h2 className="mt-4 font-heading text-4xl font-black md:text-5xl">O que as pessoas precisam saber</h2>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={faq.question} delay={index * 100} className="rounded-[1.6rem] border border-white/10 bg-card/65 p-6">
                <h3 className="font-heading text-2xl font-black">{faq.question}</h3>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{faq.answer}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="container px-4 pb-24">
          <ScrollReveal className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(21,188,236,0.14),transparent_30%),linear-gradient(180deg,rgba(7,12,22,0.98),rgba(5,9,18,0.98))] px-6 py-10 md:px-10 md:py-14">
            <div className="absolute inset-0 maker-shimmer-overlay" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  <Sparkles size={14} />
                  Launch control
                </div>
                <h2 className="mt-5 font-heading text-4xl font-black leading-[0.95] md:text-6xl">
                  Maker Gym com cara
                  <span className="block text-gradient-neon">de produto grande.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Landing viva, mockup principal forte, screenshots essenciais, suporte público e
                  privacy policy pronta para a Play. A percepção agora já está no nível do lançamento.
                </p>
              </div>

              <div className="grid gap-3 text-sm">
                <a href="/makergym" className="rounded-2xl border border-white/10 bg-card/50 px-5 py-4 font-semibold transition-colors hover:border-primary/30 hover:text-primary">
                  Abrir landing do app
                </a>
                <a href="/makergym/privacy-policy/" className="rounded-2xl border border-white/10 bg-card/50 px-5 py-4 font-semibold transition-colors hover:border-primary/30 hover:text-primary">
                  Abrir privacy policy publica
                </a>
                <a href="/makergym/support/" className="rounded-2xl border border-white/10 bg-card/50 px-5 py-4 font-semibold transition-colors hover:border-secondary/30 hover:text-secondary">
                  Abrir suporte publico
                </a>
                <a href="mailto:suporte@makergym.app" className="rounded-2xl border border-white/10 bg-card/50 px-5 py-4 font-semibold transition-colors hover:border-white/20 hover:text-foreground">
                  suporte@makergym.app
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="container grid gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">Maker Gym</div>
            <h2 className="mt-4 font-heading text-3xl font-black md:text-4xl">Treino bem registrado. Progresso bem lido.</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              Projeto hospedado por Maker Info. Para suporte, política de privacidade ou informações
              públicas do app, use os links abaixo.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <a href="/makergym/privacy-policy/" className="rounded-2xl border border-white/10 bg-card/50 px-4 py-3 transition-colors hover:border-primary/30 hover:text-primary">
              Privacy Policy
            </a>
            <a href="/makergym/support/" className="rounded-2xl border border-white/10 bg-card/50 px-4 py-3 transition-colors hover:border-secondary/30 hover:text-secondary">
              Support
            </a>
            <a href="mailto:suporte@makergym.app" className="rounded-2xl border border-white/10 bg-card/50 px-4 py-3 transition-colors hover:border-primary/30 hover:text-primary">
              suporte@makergym.app
            </a>
            <a href="/" className="rounded-2xl border border-white/10 bg-card/50 px-4 py-3 transition-colors hover:border-white/20 hover:text-foreground">
              Voltar para makerinfo.com.br
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MakerGym;
