import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BellRing,
  BrainCircuit,
  ChartColumnIncreasing,
  Flame,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users2,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import WaitlistSignup from "@/components/makergym/WaitlistSignup";
import SpotlightCard from "@/components/SpotlightCard";

const featureCards = [
  {
    icon: ChartColumnIncreasing,
    title: "Progresso com profundidade",
    description:
      "Volume total, ranking de força, heatmap muscular e detecção de PRs. Dados que provam o que realmente evoluiu.",
  },
  {
    icon: TimerReset,
    title: "Sessão ao vivo inteligente",
    description:
      "Cache da última série, sugestão de carga e timer de descanso no mesmo fluxo. Rápido o bastante para usar com treino correndo.",
  },
  {
    icon: Flame,
    title: "Modos competitivos",
    description:
      "Ghost, PR Hunter e Time Attack solo. Progress Race e Final Boss em dupla. O treino vira jogo com regras reais.",
  },
  {
    icon: Users2,
    title: "Solo, em dupla ou com personal",
    description:
      "Treino individual, sessão sincronizada com parceiro ou prescrição recebida do seu personal diretamente no app.",
  },
  {
    icon: BrainCircuit,
    title: "IA que fala sua língua",
    description:
      "Descreve o treino que você quer em texto. A IA monta a estrutura, você refina. Cota gratuita semanal inclusa.",
  },
  {
    icon: BellRing,
    title: "Streak que respeita sua rotina",
    description:
      "O streak considera os dias que você configurou para treinar, não o calendário inteiro. Parceiro incluso no acompanhamento.",
  },
];

const valuePoints = [
  "Solo, em dupla ou com personal trainer",
  "6 modos competitivos com regras reais",
  "IA para montagem e refinamento de treino",
  "Streak inteligente com parceiro",
];

const tapes = [
  "Volume total como métrica principal",
  "Timer de descanso no ritmo do treino",
  "Histórico limpo e legível",
  "Constância visível ao longo da semana",
  "Modos competitivos solo e em dupla",
  "IA com linguagem natural",
  "Streak inteligente com parceiro",
  "Templates com personal trainer",
  "Fluxo mobile com menos fricção",
  "Importação do Hevy",
];

const spotlightCards = [
  {
    eyebrow: "Live Session",
    title: "Registrar no meio do treino precisa ser rápido",
    body:
      "Cache da última série, sugestão de carga para a próxima execução e timer de descanso. Sem parar o ritmo para procurar o que registrar.",
  },
  {
    eyebrow: "Competitivo",
    title: "O treino vira jogo com regras reais",
    body:
      "Ghost, PR Hunter e Time Attack no solo. Progress Race e Final Boss em dupla. Cada modo tem objetivo e dinâmica próprios.",
  },
  {
    eyebrow: "Momentum",
    title: "Consistência fica visível, parceiro incluso",
    body:
      "Streak inteligente que considera seus dias configurados de treino. Histórico da dupla, nudge para o parceiro e marcos de 7, 30 e 100 dias.",
  },
];

const soloModes = [
  {
    name: "Ghost",
    description: "Você compete contra o seu próprio histórico. O app carrega o que você fez antes — você decide se supera.",
  },
  {
    name: "PR Hunter",
    description: "Foco em máximos. O app destaca os exercícios onde você está perto de um recorde pessoal.",
  },
  {
    name: "Time Attack",
    description: "Volume máximo no menor tempo. O relógio corre, você decide o que prioriza.",
  },
];

const duoModes = [
  {
    name: "Progress Race",
    description: "Quem acumula mais volume no mesmo treino vence. Sem handicap, sem regra especial.",
    premium: false,
  },
  {
    name: "Final Boss",
    description: "Um parceiro assume o papel de chefe. O outro tenta superar o volume dele na mesma sessão.",
    premium: false,
  },
  {
    name: "Punishment Bet",
    description: "Aposta com consequência definida por vocês. Quem perder, cumpre.",
    premium: true,
  },
];

const faqs = [
  {
    question: "O Maker Gym já está na Play Store?",
    answer:
      "Sim. O app está publicado na Play Store em teste fechado. O acesso é por convite — deixa seu e-mail no formulário acima para entrar na fila de testers.",
  },
  {
    question: "O que são os modos competitivos?",
    answer:
      "São modos de treino com objetivo e dinâmica próprios. No solo: Ghost (bata seu próprio histórico), PR Hunter (foco em máximos) e Time Attack. Em dupla: Progress Race, Final Boss e outros. Cada modo transforma a sessão em algo além do registro.",
  },
  {
    question: "O app funciona para personal trainer?",
    answer:
      "Sim. Personal trainers podem cadastrar alunos, prescrever treinos como templates e acompanhar sessões. O aluno recebe o treino direto no app e o personal vê o histórico de execução.",
  },
  {
    question: "Preciso de assinatura para usar tudo?",
    answer:
      "Treinos solo e em dupla, histórico, IA com cota gratuita semanal e os modos competitivos principais estão disponíveis no plano base. Recursos como progresso avançado, múltiplos parceiros simultâneos e funcionalidades do personal trainer dependem do plano premium.",
  },
  {
    question: "Como entro em contato com suporte?",
    answer:
      "Você pode usar a página de suporte em makerinfo.com.br/makergym/support ou escrever para suporte@makergym.app.",
  },
];

const promoVideo = "/makergym/assets/makergym-promo.mp4";
const promoPoster = "/makergym/assets/makergym-promo-poster.png";
const logoArt = "/makergym/assets/logo.png";

const MakerGym = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Aurora orbs — mesma linguagem da Maker Info HeroSection */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: "2%", left: "10%",
            background: "radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "glow-drift 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 550, height: 550,
            top: "30%", right: "5%",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "glow-drift 12s ease-in-out infinite",
            animationDelay: "1.8s",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 420, height: 420,
            bottom: "10%", left: "25%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "glow-drift 14s ease-in-out infinite",
            animationDelay: "0.9s",
          }}
        />
      </div>
      {/* Grain texture — mesma que a Maker Info */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />

      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "hsl(var(--background) / 0.97)" : "hsl(var(--background) / 0.80)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(0,212,255,0.18)"
            : "1px solid rgba(255,255,255,0.10)",
          boxShadow: scrolled ? "0 1px 24px rgba(0,212,255,0.06)" : "none",
        }}
      >
        <div className="container flex h-16 items-center justify-between">
          <a href="/makergym" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-primary/30 bg-black neon-glow-cyan transition-transform duration-300 group-hover:scale-105">
              <img src={logoArt} alt="Maker Gym" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary/80">Maker Info</div>
              <div className="font-heading text-lg font-black">Maker Gym</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {[
              { href: "#features", label: "Recursos" },
              { href: "#gallery", label: "Galeria" },
              { href: "#faq", label: "FAQ" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group py-0.5"
              >
                {label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }}
                />
              </a>
            ))}
            <a
              href="/makergym/privacy-policy/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Privacy Policy
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-16">
        <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-14 px-4 py-14 md:grid-cols-[1.02fr_0.98fr] md:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary maker-shimmer-border">
              <Activity size={14} />
              Treino com progresso real
            </div>

            <h1 className="font-heading text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              O app que faz
              <span className="block text-gradient-neon">cada treino contar.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              Maker Gym foi feito para quem leva treino a sério. Registre séries, reps, cargas e
              volume total, mantenha o ritmo com timer de descanso e acompanhe a evolução real
              semana a semana com uma interface pensada para uso dentro da academia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-heading text-sm font-black text-primary-foreground neon-glow-cyan transition-all hover:brightness-110"
              >
                Quero ser testador
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
              Volume como métrica
            </div>
            <div className="absolute -right-4 top-3 z-20 hidden rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:flex maker-float-wide-delayed">
              Teste fechado · Play Store
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
              <h2 className="font-heading text-4xl font-black md:text-5xl">
                Dados no centro. Interface que não atrapalha.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                Feito para usar com treino correndo. O que importa aparece na frente — exercício atual, volume, timer de descanso e sugestão de carga para a próxima série.
              </p>

              <div className="mt-8 space-y-3">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/25 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Sessão ao vivo</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Cache da última série + sugestão de carga para a próxima execução, sem digitar nada.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-black/25 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary/70">Pós-treino</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">PRs detectados automaticamente, volume total, distribuição muscular e card para compartilhar.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-black/25 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">Histórico</div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Leitura de progresso por exercício — carga máxima, volume médio e gráfico de evolução.</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid gap-5">
              {spotlightCards.map((card, index) => (
                <ScrollReveal key={card.title} delay={index * 120}>
                  <SpotlightCard className="group rounded-[1.75rem] border border-white/10 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card h-full">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{card.eyebrow}</div>
                    <h3 className="mt-3 font-heading text-2xl font-black">{card.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{card.body}</p>
                  </SpotlightCard>
                </ScrollReveal>
              ))}

            </div>
          </div>
        </section>

        <section className="container px-4 pb-20">
          <div className="mb-10">
            <h2 className="font-heading text-4xl font-black md:text-5xl">
              6 modos. 6 formas de treinar.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              Do solo ao duelo. Cada modo tem objetivo e dinâmica próprios — não é só mudar o nome da sessão.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/50">Solo</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {soloModes.map((mode, index) => (
                  <ScrollReveal key={mode.name} delay={index * 80}>
                    <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6 h-full hover:border-primary/25 transition-colors duration-300">
                      <div className="font-heading text-3xl font-black tracking-tight">{mode.name}</div>
                      <p className="mt-3 leading-7 text-muted-foreground">{mode.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/50">Em dupla</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {duoModes.map((mode, index) => (
                  <ScrollReveal key={mode.name} delay={index * 80}>
                    <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6 h-full hover:border-secondary/25 transition-colors duration-300">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-heading text-3xl font-black tracking-tight">{mode.name}</div>
                        {mode.premium && (
                          <span className="mt-1 shrink-0 rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="mt-3 leading-7 text-muted-foreground">{mode.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-card/40 backdrop-blur">
          <div className="container grid gap-4 px-4 py-6 md:grid-cols-4">
            {[
              ["6 modos competitivos", "Solo e em dupla com regras reais"],
              ["IA + linguagem natural", "Monta e refina treino por texto"],
              ["Streak com parceiro", "Considera seus dias de treino"],
              ["Personal trainer", "Prescrição e acompanhamento no app"],
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
            <h2 className="font-heading text-4xl font-black md:text-5xl">
              Um app que respeita o treino de verdade.
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Menos fricção para registrar, mais contexto para evoluir. Feito para o momento do treino e para a leitura do que aconteceu depois.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} delay={index * 90}>
                <SpotlightCard className="group rounded-[1.75rem] border border-white/10 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{description}</p>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="experience" className="container px-4 pb-20">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/12 via-card/80 to-secondary/10 p-8">
              <h2 className="font-heading text-4xl font-black md:text-5xl">
                Descreve. A IA monta. Você treina.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                Escreve o que você quer em linguagem natural. O app interpreta, gera a estrutura e deixa você refinar antes de começar.
              </p>

              <div className="mt-8 space-y-3">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/30 px-5 py-4">
                  <span className="text-muted-foreground/40 mr-2 text-xs">você</span>
                  <span className="text-sm text-foreground">"costas e bíceps, 45 min, academia"</span>
                </div>
                <div className="rounded-[1.4rem] border border-primary/20 bg-primary/5 px-5 py-4">
                  <span className="text-primary/60 mr-2 text-xs font-semibold uppercase tracking-wider">IA</span>
                  <span className="text-sm text-foreground">Treino gerado · 6 exercícios · estrutura em blocos</span>
                </div>
                <div className="rounded-[1.4rem] border border-white/8 bg-black/20 px-5 py-3 text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Cota gratuita · 2 sessões por semana · premium ilimitado
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6">
                <div className="font-heading text-5xl font-black text-gradient-neon">7·30·100</div>
                <h3 className="mt-3 font-heading text-xl font-black">Marcos de streak</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  O app celebra consistência com destaque visual nos dias que importam. Solo ou com parceiro.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6">
                <div className="font-heading text-5xl font-black">PRs</div>
                <h3 className="mt-3 font-heading text-xl font-black">Detectados automaticamente</h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  Ao encerrar a sessão, o app identifica recordes pessoais e os destaca no resumo pós-treino.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-card/70 p-6 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-black">Já na Play Store · teste fechado</h3>
                    <p className="mt-2 text-muted-foreground">Acesso por convite. Deixa seu e-mail para entrar.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href="/makergym/privacy-policy/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-primary/30 hover:text-primary transition-colors">
                      Privacy Policy
                    </a>
                    <a href="/makergym/support/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:border-secondary/30 hover:text-secondary transition-colors">
                      Suporte
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="container px-4 pb-24">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-heading text-4xl font-black md:text-5xl">Perguntas frequentes</h2>
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
                <h2 className="font-heading text-4xl font-black leading-[0.95] md:text-6xl">
                  Treino com dado.
                  <span className="block text-gradient-neon">Progresso que aparece.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  O app está em teste fechado na Play Store. Deixa seu e-mail para receber o convite antes da abertura pública.
                </p>
                <div className="mt-8">
                  <WaitlistSignup source="makergym-cta" compact />
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm lg:items-end">
                <div className="rounded-[1.75rem] border border-white/10 bg-card/50 p-6 w-full">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/60 mb-4">Links públicos</div>
                  <div className="space-y-2">
                    <a href="/makergym/privacy-policy/" className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3 transition-colors hover:border-primary/30 hover:text-primary">
                      Privacy Policy
                    </a>
                    <a href="/makergym/support/" className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3 transition-colors hover:border-secondary/30 hover:text-secondary">
                      Suporte
                    </a>
                    <a href="mailto:suporte@makergym.app" className="flex items-center justify-between rounded-xl border border-white/8 px-4 py-3 transition-colors hover:border-white/20">
                      suporte@makergym.app
                    </a>
                  </div>
                </div>
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
            <a href="/makergym/delete-account/" className="rounded-2xl border border-white/10 bg-card/50 px-4 py-3 transition-colors hover:border-primary/30 hover:text-primary">
              Delete Account
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
;
;
;
