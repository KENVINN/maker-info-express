import { useState, useEffect } from "react";
import { supabase, Pedido, STATUS_CONFIG, StatusPedido } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

const STATUSES = Object.keys(STATUS_CONFIG) as StatusPedido[];

const Pedido = () => {
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
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

  // Tempo real
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
        setPedido(payload.new as Pedido);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [pedido?.id]);

  const currentStep = pedido ? STATUS_CONFIG[pedido.status as StatusPedido].step : 0;

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

        {/* Busca */}
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
            {/* Header */}
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

            {/* Equipamento e problema */}
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

            {/* Timeline de status */}
            <div>
              <p className="text-xs text-muted-foreground mb-4">Status do reparo</p>
              <div className="space-y-3">
                {STATUSES.map((s, i) => {
                  const cfg = STATUS_CONFIG[s];
                  const done = cfg.step < currentStep;
                  const active = cfg.step === currentStep;
                  return (
                    <div key={s} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${active ? "bg-primary/10 border border-primary/30" : "opacity-40"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${done ? "bg-green-500/20 text-green-500" : active ? "bg-primary/20 text-primary" : "bg-muted"}`}>
                        {done ? "✓" : cfg.emoji}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-heading font-bold ${active ? cfg.color : ""}`}>{cfg.label}</p>
                      </div>
                      {active && <span className="text-xs text-primary font-semibold animate-pulse">Atual</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Observação */}
            {pedido.observacao && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Observação do técnico</p>
                <p className="text-sm">{pedido.observacao}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Atualizado em {new Date(pedido.updated_at).toLocaleString("pt-BR")} · Atualização em tempo real ⚡
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
