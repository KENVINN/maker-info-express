import { useState, useEffect } from "react";
import { supabase, STATUS_CONFIG, StatusPedido } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const ADMIN_PASS = "makerinfo2024";

type Pedido = {
  id: string;
  codigo: string;
  cliente_nome: string;
  equipamento: string;
  problema: string;
  status: string;
  valor: number;
  created_at: string;
  updated_at: string;
};

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Dashboard = () => {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("admin")) setLogado(true);
  }, []);

  useEffect(() => {
    if (!logado) return;
    carregar();
  }, [logado]);

  const carregar = async () => {
    setLoading(true);
    const { data } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    if (data) setPedidos(data);
    setLoading(false);
  };

  const login = () => {
    if (senha === ADMIN_PASS) { setLogado(true); sessionStorage.setItem("admin", "1"); }
    else setErro("Senha incorreta.");
  };

  // Metrics
  const total = pedidos.length;
  const receita = pedidos.reduce((s, p) => s + (p.valor || 0), 0);
  const emAndamento = pedidos.filter(p => !["Entregue"].includes(p.status)).length;
  const entregues = pedidos.filter(p => p.status === "Entregue").length;
  const ticketMedio = entregues > 0 ? pedidos.filter(p => p.status === "Entregue" && p.valor > 0).reduce((s, p) => s + p.valor, 0) / Math.max(1, pedidos.filter(p => p.status === "Entregue" && p.valor > 0).length) : 0;

  // Pedidos por dia (últimos 7 dias)
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const count = pedidos.filter(p => p.created_at.startsWith(key)).length;
    return { label, count, key };
  });
  const maxDia = Math.max(...ultimos7.map(d => d.count), 1);

  // Status distribution
  const statusCount = Object.keys(STATUS_CONFIG).map(s => ({
    status: s,
    count: pedidos.filter(p => p.status === s).length,
    cfg: STATUS_CONFIG[s as StatusPedido],
  })).filter(s => s.count > 0);

  // Equipamentos mais comuns
  const equipMap: Record<string, number> = {};
  pedidos.forEach(p => {
    const key = p.equipamento.split(" ").slice(0, 2).join(" ");
    equipMap[key] = (equipMap[key] || 0) + 1;
  });
  const topEquip = Object.entries(equipMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxEquip = Math.max(...topEquip.map(e => e[1]), 1);

  // Problemas mais comuns
  const probMap: Record<string, number> = {};
  pedidos.forEach(p => {
    const key = p.problema.split(",")[0].trim();
    probMap[key] = (probMap[key] || 0) + 1;
  });
  const topProb = Object.entries(probMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Receita por dia
  const receitaDia = ultimos7.map(d => ({
    ...d,
    receita: pedidos.filter(p => p.created_at.startsWith(d.key) && p.valor > 0).reduce((s, p) => s + p.valor, 0),
  }));
  const maxReceita = Math.max(...receitaDia.map(d => d.receita), 1);

  if (!logado) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📊</div>
        <h1 className="font-heading text-2xl font-black mb-6">Dashboard</h1>
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Senha"
          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground mb-3 focus:outline-none focus:border-primary" />
        {erro && <p className="text-destructive text-sm mb-3">{erro}</p>}
        <button onClick={login} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all">
          Entrar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-black">Dashboard <span className="text-gradient-neon">Maker Info</span></h1>
            <p className="text-muted-foreground text-sm">Análise em tempo real dos seus atendimentos</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/admin")} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg border border-border">
              Admin
            </button>
            <button onClick={carregar} className="text-sm text-primary hover:brightness-110 transition-colors px-4 py-2 rounded-lg border border-primary/30">
              ↻ Atualizar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-20">Carregando dados...</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total de Pedidos", value: total, icon: "📋", color: "text-primary" },
                { label: "Em Andamento", value: emAndamento, icon: "🔧", color: "text-highlight-amber" },
                { label: "Entregues", value: entregues, icon: "✅", color: "text-green-500" },
                { label: "Receita Total", value: fmt(receita), icon: "💰", color: "text-secondary" },
              ].map((k, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5">
                  <div className="text-2xl mb-2">{k.icon}</div>
                  <p className={`font-heading text-2xl font-black ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pedidos por dia */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-black text-sm mb-4">📅 Pedidos — Últimos 7 dias</h2>
                <div className="flex items-end gap-2 h-32">
                  {ultimos7.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-primary font-bold">{d.count > 0 ? d.count : ""}</span>
                      <div className="w-full rounded-t-lg bg-primary/20 transition-all" style={{ height: `${(d.count / maxDia) * 100}%`, minHeight: d.count > 0 ? "8px" : "2px", background: d.count > 0 ? "rgb(0 212 255 / 0.6)" : "rgb(0 212 255 / 0.1)" }} />
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receita por dia */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-black text-sm mb-1">💰 Receita — Últimos 7 dias</h2>
                <p className="text-xs text-muted-foreground mb-4">Ticket médio: {fmt(ticketMedio)}</p>
                <div className="flex items-end gap-2 h-32">
                  {receitaDia.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-secondary font-bold">{d.receita > 0 ? `R$${d.receita}` : ""}</span>
                      <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.receita / maxReceita) * 100}%`, minHeight: d.receita > 0 ? "8px" : "2px", background: d.receita > 0 ? "rgb(168 85 247 / 0.6)" : "rgb(168 85 247 / 0.1)" }} />
                      <span className="text-xs text-muted-foreground">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Status */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-black text-sm mb-4">📊 Status dos Pedidos</h2>
                {statusCount.length === 0 ? (
                  <p className="text-muted-foreground text-xs">Nenhum pedido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {statusCount.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span>{s.cfg.emoji}</span>
                        <span className="text-xs flex-1 truncate">{s.status}</span>
                        <span className={`text-xs font-bold ${s.cfg.color}`}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top equipamentos */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-black text-sm mb-4">💻 Equipamentos</h2>
                {topEquip.length === 0 ? (
                  <p className="text-muted-foreground text-xs">Nenhum pedido ainda</p>
                ) : (
                  <div className="space-y-3">
                    {topEquip.map(([equip, count], i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="truncate">{equip}</span>
                          <span className="text-primary font-bold ml-2">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / maxEquip) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top problemas */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-black text-sm mb-4">🔍 Problemas Comuns</h2>
                {topProb.length === 0 ? (
                  <p className="text-muted-foreground text-xs">Nenhum pedido ainda</p>
                ) : (
                  <div className="space-y-2">
                    {topProb.map(([prob, count], i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <span className="text-xs flex-1 truncate">{prob}</span>
                        <span className="text-xs font-bold text-highlight-amber">{count}x</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Últimos pedidos */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-black text-sm mb-4">🕐 Últimos Pedidos</h2>
              <div className="space-y-2">
                {pedidos.slice(0, 8).map(p => {
                  const cfg = STATUS_CONFIG[p.status as StatusPedido];
                  return (
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                      <span className="font-heading font-black text-primary text-sm w-16">{p.codigo}</span>
                      <span className="text-sm flex-1 truncate">{p.cliente_nome}</span>
                      <span className="text-xs text-muted-foreground hidden md:block truncate max-w-32">{p.equipamento}</span>
                      <span className={`text-xs font-semibold ${cfg?.color}`}>{cfg?.emoji} {p.status}</span>
                      {p.valor > 0 && <span className="text-xs text-green-500 font-bold">{fmt(p.valor)}</span>}
                    </div>
                  );
                })}
                {pedidos.length === 0 && <p className="text-muted-foreground text-xs text-center py-4">Nenhum pedido ainda.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
