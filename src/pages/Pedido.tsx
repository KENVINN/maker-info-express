import { useState, useEffect } from "react";
import { supabase, Pedido as PedidoType, STATUS_CONFIG, StatusPedido } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const STATUSES = Object.keys(STATUS_CONFIG) as StatusPedido[];

const Pedido = () => {
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState<PedidoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const buscar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setErro("");
    setPedido(null);
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .eq("codigo", codigo.trim().toUpperCase())
      .single();

    if (error || !data) {
      setErro("Código não encontrado. Verifique e tente novamente.");
    } else {
      setPedido(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!pedido) return;
    const channel = supabase
      .channel("pedido-" + pedido.id)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "pedidos",
        filter: `id=eq.${pedido.id}`,
      }, (payload) => {
        const novo = payload.new as PedidoType;
        setPedido(novo);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [pedido?.id]);

  const currentStep = pedido ? STATUS_CONFIG[pedido.status as StatusPedido]?.step ?? 0 : 0;
  const etapasVisiveis = pedido?.etapas
    ? STATUSES.filter(s => (pedido.etapas as string[]).includes(s))
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
          <p className="text-muted-foreground text-sm">
            Digite o código que você recebeu via WhatsApp
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && buscar()}
            placeholder="Ex: MK001"
            className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-lg focus:outline-none focus:border-primary transition-colors"
            maxLength={10}
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

            {/* Timeline */}
            <div>
              <p className="text-xs text-muted-foreground mb-4">Progresso do reparo</p>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div
                  className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-700"
                  style={{ height: `${((currentStep - 1) / (STATUSES.length - 1)) * 100}%` }}
                />
                <div className="space-y-3">
                  {etapasVisiveis.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const done = cfg.step < currentStep;
                    const active = cfg.step === currentStep;
                    return (
                      <div key={s} className={`relative flex items-center gap-4 pl-10 py-2.5 rounded-xl transition-all ${active ? "bg-primary/10 border border-primary/30" : done ? "opacity-60" : "opacity-30"}`}>
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 transition-all ${done ? "bg-primary border-primary" : active ? "bg-primary border-primary scale-125" : "bg-background border-border"}`} />
                        <span className="text-lg">{cfg.emoji}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-heading font-bold ${active ? cfg.color : ""}`}>{cfg.label}</p>
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

            {(pedido as any).fotos_urls?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-3">📸 Fotos do reparo</p>
                <div className="grid grid-cols-3 gap-2">
                  {((pedido as any).fotos_urls as string[]).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      {url.match(/\.(mp4|mov|webm)$/i) ? (
                        <video src={url} className="w-full aspect-square object-cover rounded-xl border border-border" />
                      ) : (
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full aspect-square object-cover rounded-xl border border-border hover:opacity-80 transition-all" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Atualizado em {new Date(pedido.updated_at).toLocaleString("pt-BR")} · Tempo real ⚡
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
