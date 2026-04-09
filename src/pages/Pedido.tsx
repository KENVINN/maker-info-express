import { useCallback, useEffect, useRef, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFab from "@/components/WhatsAppFab";
import { api } from "@/lib/api";
import { Pedido as PedidoType, STATUS_CONFIG, type StatusPedido } from "@/lib/pedidos";

const STATUSES = Object.keys(STATUS_CONFIG) as StatusPedido[];
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
type AudioCapableWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const Pedido = () => {
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState<PedidoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [instalado, setInstalado] = useState(false);
  const pedidoRef = useRef<PedidoType | null>(null);

  useEffect(() => {
    pedidoRef.current = pedido;
  }, [pedido]);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalado(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const instalarApp = async () => {
    if (!installPrompt) {
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstalado(true);
    }

    setInstallPrompt(null);
  };

  const pedirPermissaoNotificacao = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const tocarSom = useCallback((tipo: "notificacao" | "pronto") => {
    try {
      const audioWindow = window as AudioCapableWindow;
      const AudioContextClass = window.AudioContext || audioWindow.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const ctx = new AudioContextClass();

      if (tipo === "pronto") {
        const notas = [523, 659, 784, 1047];
        notas.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, ctx.currentTime + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.15 + 0.3);
          osc.start(ctx.currentTime + index * 0.15);
          osc.stop(ctx.currentTime + index * 0.15 + 0.3);
        });
      } else {
        [0, 0.2].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.15);
        });
      }
    } catch {
      // Audio falhou ou nao esta disponivel no navegador.
    }
  }, []);

  const dispararNotificacao = useCallback((pedidoCodigo: string, status: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const emojis: Record<string, string> = {
      "Em Diagnóstico": "🔍",
      "Limpeza / Formatação": "🧹",
      "Peça Solicitada": "📦",
      "Em Reparo": "🔧",
      "Testes Finais": "🧪",
      "Pronto para Retirada": "✅",
      "Saída para Entrega": "🛵",
      Entregue: "🎉",
    };

    const emoji = emojis[status] || "🔧";

    new Notification(`${emoji} Maker Info — Pedido ${pedidoCodigo}`, {
      body: `Status atualizado: ${status}\nClique para acompanhar`,
      icon: "/maker_info_logo.png",
      badge: "/maker_info_logo.png",
      tag: `pedido-${pedidoCodigo}`,
    });

    tocarSom(status === "Pronto para Retirada" || status === "Entregue" ? "pronto" : "notificacao");
  }, [tocarSom]);

  useEffect(() => {
    if (!pedido?.codigo) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const { pedido: latestPedido } = await api.tracking.getPedido(pedido.codigo);
        const previousPedido = pedidoRef.current;

        if (previousPedido && latestPedido.status !== previousPedido.status) {
          dispararNotificacao(latestPedido.codigo, latestPedido.status);
        }

        setPedido(latestPedido);
      } catch {
        // Mantemos o ultimo estado visivel se o polling falhar pontualmente.
      }
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [dispararNotificacao, pedido?.codigo]);

  const buscar = async () => {
    if (!codigo.trim()) {
      return;
    }

    setLoading(true);
    setErro("");
    setPedido(null);

    try {
      const { pedido: pedidoEncontrado } = await api.tracking.getPedido(codigo.trim().toUpperCase());
      setPedido(pedidoEncontrado);
      await pedirPermissaoNotificacao();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Codigo nao encontrado. Verifique e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = pedido ? STATUS_CONFIG[pedido.status as StatusPedido]?.step ?? 0 : 0;
  const etapasVisiveis = pedido?.etapas
    ? STATUSES.filter((status) => (pedido.etapas as string[]).includes(status))
    : STATUSES;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 container px-4 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-heading text-3xl font-black mb-2">
            Acompanhar <span className="text-gradient-neon">meu pedido</span>
          </h1>
          <p className="text-muted-foreground text-sm">Digite o código que você recebeu via WhatsApp</p>
        </div>

        {installPrompt && !instalado && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 flex items-center gap-4">
            <div className="text-3xl">📱</div>
            <div className="flex-1">
              <p className="font-heading font-black text-sm">Instale o app da Maker Info</p>
              <p className="text-xs text-muted-foreground">Receba notificações do seu reparo direto no celular</p>
            </div>
            <button
              onClick={instalarApp}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xs hover:brightness-110 transition-all shrink-0"
            >
              Instalar
            </button>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value.toUpperCase())}
            onKeyDown={(event) => event.key === "Enter" && buscar()}
            placeholder="Ex: MK001"
            className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-lg focus:outline-none focus:border-primary transition-colors"
            maxLength={20}
          />
          <button
            onClick={buscar}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        {erro && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center mb-6">
            {erro}
          </div>
        )}

        {pedido && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Código do pedido</p>
                <p className="font-heading font-black text-2xl text-primary">{pedido.codigo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                <p className="font-heading font-bold">{pedido.cliente_nome}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-background/60">
                <p className="text-xs text-muted-foreground mb-1">Equipamento</p>
                <p className="text-sm font-semibold">{pedido.equipamento}</p>
              </div>
              <div className="p-3 rounded-xl bg-background/60">
                <p className="text-xs text-muted-foreground mb-1">Problema</p>
                <p className="text-sm font-semibold">{pedido.problema}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-4">Progresso do reparo</p>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div
                  className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-700"
                  style={{ height: `${((currentStep - 1) / (STATUSES.length - 1)) * 100}%` }}
                />
                <div className="space-y-3">
                  {etapasVisiveis.map((status) => {
                    const config = STATUS_CONFIG[status];
                    const done = config.step < currentStep;
                    const active = config.step === currentStep;

                    return (
                      <div
                        key={status}
                        className={`relative flex items-center gap-4 pl-10 py-2.5 rounded-xl transition-all ${
                          active ? "bg-primary/10 border border-primary/30" : done ? "opacity-60" : "opacity-30"
                        }`}
                      >
                        <div
                          className={`absolute left-2.5 w-3 h-3 rounded-full border-2 transition-all ${
                            done
                              ? "bg-primary border-primary"
                              : active
                                ? "bg-primary border-primary scale-125"
                                : "bg-background border-border"
                          }`}
                        />
                        <span className="text-lg">{config.emoji}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-heading font-bold ${active ? config.color : ""}`}>{config.label}</p>
                        </div>
                        {done && <span className="text-xs text-primary">✓</span>}
                        {active && <span className="text-xs text-primary font-semibold animate-pulse">Atual</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {pedido.observacao && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">💬 Observação do técnico</p>
                <p className="text-sm">{pedido.observacao}</p>
              </div>
            )}

            {pedido.historico && pedido.historico.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-black text-sm mb-4 text-muted-foreground uppercase tracking-wider">📋 Histórico</h3>
                <div className="space-y-2">
                  {[...pedido.historico].reverse().map((item, index) => {
                    const config = STATUS_CONFIG[item.status as StatusPedido];

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-xl bg-card border ${
                          index === 0 ? "border-primary/30" : "border-border/50"
                        }`}
                      >
                        <span className="text-lg">{config?.emoji || "🔧"}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${config?.color || "text-foreground"}`}>{item.status}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.data).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {index === 0 && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Atual</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(pedido.fotos_urls || []).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-3">📸 Fotos do reparo</p>
                <div className="grid grid-cols-3 gap-2">
                  {(pedido.fotos_urls || []).map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      {url.match(/\.(mp4|mov|webm)$/i) ? (
                        <video src={url} className="w-full aspect-square object-cover rounded-xl border border-border" />
                      ) : (
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-xl border border-border hover:opacity-80 transition-all"
                        />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Atualizado em {new Date(pedido.updated_at).toLocaleString("pt-BR")} · Atualização automática
            </p>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Pedido;
