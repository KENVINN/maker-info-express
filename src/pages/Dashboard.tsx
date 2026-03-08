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

type Custo = {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
};

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const parseBRL = (s: string) => parseFloat(s?.replace(/[R$\s.]/g, "").replace(",", ".") || "0") || 0;

const CATEGORIAS = ["Peça / Componente", "Marketing", "Infraestrutura", "Outros"];

const TABS = ["📊 Visão Geral", "💰 Financeiro", "🔧 Serviços", "📦 Custos"];

const Dashboard = () => {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [custos, setCustos] = useState<Custo[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [novoCusto, setNovoCusto] = useState({ data: new Date().toISOString().split("T")[0], descricao: "", valor: "", categoria: "Peça / Componente" });
  const [salvandoCusto, setSalvandoCusto] = useState(false);
  const [periodo, setPeriodo] = useState<"7" | "30" | "90" | "tudo">("30");
  const navigate = useNavigate();

  useEffect(() => { if (sessionStorage.getItem("admin")) setLogado(true); }, []);
  useEffect(() => { if (logado) { carregar(); } }, [logado]);

  const carregar = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("pedidos").select("*").order("created_at", { ascending: false }),
      supabase.from("custos").select("*").order("data", { ascending: false }),
    ]);
    if (p) setPedidos(p);
    if (c) setCustos(c);
    setLoading(false);
  };

  const login = () => {
    if (senha === ADMIN_PASS) { setLogado(true); sessionStorage.setItem("admin", "1"); }
    else setErroLogin("Senha incorreta.");
  };

  const adicionarCusto = async () => {
    if (!novoCusto.descricao || !novoCusto.valor) return;
    setSalvandoCusto(true);
    const { error } = await supabase.from("custos").insert({
      data: novoCusto.data,
      descricao: novoCusto.descricao,
      valor: parseFloat(novoCusto.valor.replace(",", ".")),
      categoria: novoCusto.categoria,
    });
    if (!error) {
      setNovoCusto({ data: new Date().toISOString().split("T")[0], descricao: "", valor: "", categoria: "Peça / Componente" });
      await carregar();
    }
    setSalvandoCusto(false);
  };

  const deletarCusto = async (id: string) => {
    if (!confirm("Deletar este custo?")) return;
    await supabase.from("custos").delete().eq("id", id);
    setCustos(prev => prev.filter(c => c.id !== id));
  };

  // Filtro de período
  const filtrarPorPeriodo = <T extends { created_at?: string; data?: string }>(items: T[]) => {
    if (periodo === "tudo") return items;
    const days = parseInt(periodo);
    const limite = new Date();
    limite.setHours(0, 0, 0, 0);
    limite.setDate(limite.getDate() - days);
    return items.filter(i => {
      const raw = i.created_at || i.data || "";
      // handle date-only strings like "2026-02-18" without timezone shift
      const d = raw.length === 10 ? new Date(raw + "T00:00:00") : new Date(raw);
      return d >= limite;
    });
  };

  const pedidosFiltrados = filtrarPorPeriodo(pedidos);
  const custosFiltrados = filtrarPorPeriodo(custos);

  // Métricas
  const faturamento = pedidosFiltrados.reduce((s, p) => s + (p.valor || 0), 0);
  const totalCustos = custosFiltrados.reduce((s, c) => s + (c.valor || 0), 0);
  const lucro = faturamento - totalCustos;
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0;
  const entregues = pedidosFiltrados.filter(p => p.status === "Entregue");
  const ticketMedio = entregues.filter(p => p.valor > 0).length > 0
    ? entregues.filter(p => p.valor > 0).reduce((s, p) => s + p.valor, 0) / entregues.filter(p => p.valor > 0).length
    : 0;

  // Gráfico de barras — dias
  const dias = parseInt(periodo === "tudo" ? "30" : periodo);
  const graficoDias = Array.from({ length: Math.min(dias, 14) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.min(dias, 14) - 1 - i));
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const receita = pedidos.filter(p => p.created_at?.startsWith(key)).reduce((s, p) => s + (p.valor || 0), 0);
    const custo = custos.filter(c => c.data?.startsWith(key)).reduce((s, c) => s + (c.valor || 0), 0);
    return { label, receita, custo, lucro: receita - custo };
  });
  const maxGrafico = Math.max(...graficoDias.map(d => Math.max(d.receita, d.custo)), 1);

  // Status
  const statusCount = Object.keys(STATUS_CONFIG).map(s => ({
    status: s, count: pedidosFiltrados.filter(p => p.status === s).length, cfg: STATUS_CONFIG[s as StatusPedido],
  })).filter(s => s.count > 0);

  // Equipamentos
  const equipMap: Record<string, number> = {};
  pedidosFiltrados.forEach(p => { const k = p.equipamento?.split(" ").slice(0, 2).join(" ") || "Outros"; equipMap[k] = (equipMap[k] || 0) + 1; });
  const topEquip = Object.entries(equipMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxEquip = Math.max(...topEquip.map(e => e[1]), 1);

  // Bairros
  const bairroMap: Record<string, { count: number; receita: number }> = {};
  pedidosFiltrados.forEach(p => {
    const k = (p as any).bairro || "Não informado";
    if (!bairroMap[k]) bairroMap[k] = { count: 0, receita: 0 };
    bairroMap[k].count++;
    bairroMap[k].receita += p.valor || 0;
  });
  const topBairros = Object.entries(bairroMap).sort((a, b) => b[1].count - a[1].count).slice(0, 5);

  // Custos por categoria
  const catMap: Record<string, number> = {};
  custosFiltrados.forEach(c => { catMap[c.categoria] = (catMap[c.categoria] || 0) + c.valor; });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...topCat.map(c => c[1]), 1);

  // Problemas
  const probMap: Record<string, number> = {};
  pedidosFiltrados.forEach(p => { const k = p.problema?.split(",")[0]?.trim() || "Outros"; probMap[k] = (probMap[k] || 0) + 1; });
  const topProb = Object.entries(probMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (!logado) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📊</div>
        <h1 className="font-heading text-2xl font-black mb-6">Dashboard</h1>
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} placeholder="Senha"
          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground mb-3 focus:outline-none focus:border-primary" />
        {erroLogin && <p className="text-destructive text-sm mb-3">{erroLogin}</p>}
        <button onClick={login} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all">Entrar</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-3xl font-black">Dashboard <span className="text-gradient-neon">Maker Info</span></h1>
            <p className="text-muted-foreground text-sm">Análise completa do seu negócio</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["7", "30", "90", "tudo"] as const).map(p => (
              <button key={p} onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all border ${periodo === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                {p === "tudo" ? "Tudo" : `${p}d`}
              </button>
            ))}
            <button onClick={() => navigate("/admin")} className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold border border-border text-muted-foreground hover:text-foreground transition-all">Admin</button>
            <button onClick={carregar} className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold border border-primary/30 text-primary hover:brightness-110 transition-all">↻</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-card border border-border rounded-xl p-1 overflow-x-auto">
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-bold whitespace-nowrap transition-all ${tab === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <div className="text-center text-muted-foreground py-20">Carregando dados...</div> : (
          <>
            {/* TAB 0 - VISÃO GERAL */}
            {tab === 0 && (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Faturamento", value: fmt(faturamento), icon: "💰", color: "text-primary", sub: `${pedidosFiltrados.length} pedidos` },
                    { label: "Custos", value: fmt(totalCustos), icon: "📦", color: "text-highlight-amber", sub: `${custosFiltrados.length} lançamentos` },
                    { label: "Lucro Real", value: fmt(lucro), icon: lucro >= 0 ? "📈" : "📉", color: lucro >= 0 ? "text-green-500" : "text-destructive", sub: `Margem ${margem.toFixed(1)}%` },
                    { label: "Ticket Médio", value: fmt(ticketMedio), icon: "🎯", color: "text-secondary", sub: `${entregues.length} entregues` },
                  ].map((k, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5">
                      <div className="text-2xl mb-2">{k.icon}</div>
                      <p className={`font-heading text-xl font-black ${k.color}`}>{k.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
                      <p className="text-xs text-muted-foreground opacity-60">{k.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Gráfico receita vs custo */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-1">📊 Receita vs Custo</h2>
                  <div className="flex gap-4 mb-4 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/60 inline-block" /> Receita</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-highlight-amber/60 inline-block" /> Custo</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500/60 inline-block" /> Lucro</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-40 overflow-x-auto pb-6 relative">
                    {graficoDias.map((d, i) => (
                      <div key={i} className="flex items-end gap-0.5 shrink-0" style={{ minWidth: "40px" }}>
                        <div className="flex flex-col items-center gap-0.5 w-full">
                          <div className="flex items-end gap-0.5 w-full" style={{ height: "120px" }}>
                            <div className="flex-1 rounded-t transition-all bg-primary/60" style={{ height: `${(d.receita / maxGrafico) * 100}%`, minHeight: d.receita > 0 ? "4px" : "1px" }} />
                            <div className="flex-1 rounded-t transition-all bg-highlight-amber/60" style={{ height: `${(d.custo / maxGrafico) * 100}%`, minHeight: d.custo > 0 ? "4px" : "1px" }} />
                          </div>
                          <span className="text-xs text-muted-foreground" style={{ fontSize: "9px" }}>{d.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status + Equipamentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-heading font-black text-sm mb-4">📋 Status dos Pedidos</h2>
                    {statusCount.length === 0 ? <p className="text-muted-foreground text-xs">Nenhum pedido</p> : (
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
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-heading font-black text-sm mb-4">💻 Top Equipamentos</h2>
                    {topEquip.length === 0 ? <p className="text-muted-foreground text-xs">Nenhum pedido</p> : (
                      <div className="space-y-3">
                        {topEquip.map(([equip, count], i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1"><span className="truncate">{equip}</span><span className="text-primary font-bold ml-2">{count}</span></div>
                            <div className="h-1.5 rounded-full bg-border overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / maxEquip) * 100}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1 - FINANCEIRO */}
            {tab === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Faturamento", value: fmt(faturamento), icon: "💰", color: "text-primary" },
                    { label: "Total Custos", value: fmt(totalCustos), icon: "📦", color: "text-highlight-amber" },
                    { label: "Lucro Líquido", value: fmt(lucro), icon: lucro >= 0 ? "🟢" : "🔴", color: lucro >= 0 ? "text-green-500" : "text-destructive" },
                    { label: "Margem de Lucro", value: `${margem.toFixed(1)}%`, icon: "📊", color: margem >= 50 ? "text-green-500" : margem >= 20 ? "text-highlight-amber" : "text-destructive" },
                    { label: "Ticket Médio", value: fmt(ticketMedio), icon: "🎯", color: "text-secondary" },
                    { label: "ROI", value: totalCustos > 0 ? `${((faturamento / totalCustos - 1) * 100).toFixed(0)}%` : "—", icon: "📈", color: "text-primary" },
                  ].map((k, i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-5">
                      <div className="text-2xl mb-2">{k.icon}</div>
                      <p className={`font-heading text-xl font-black ${k.color}`}>{k.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
                    </div>
                  ))}
                </div>

                {/* Custos por categoria */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-4">🗂️ Custos por Categoria</h2>
                  {topCat.length === 0 ? <p className="text-muted-foreground text-xs">Nenhum custo registrado</p> : (
                    <div className="space-y-3">
                      {topCat.map(([cat, val], i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{cat}</span>
                            <span className="font-bold text-highlight-amber">{fmt(val)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-border overflow-hidden">
                            <div className="h-full rounded-full bg-highlight-amber/70 transition-all" style={{ width: `${(val / maxCat) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Últimos pedidos com valor */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-4">💳 Receita por Pedido</h2>
                  <div className="space-y-2">
                    {pedidosFiltrados.filter(p => p.valor > 0).slice(0, 10).map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <span className="font-heading font-black text-primary text-sm w-16">{p.codigo}</span>
                        <span className="text-sm flex-1 truncate">{p.cliente_nome}</span>
                        <span className="text-xs text-muted-foreground hidden md:block">{p.equipamento}</span>
                        <span className="text-sm font-bold text-green-500">{fmt(p.valor)}</span>
                      </div>
                    ))}
                    {pedidosFiltrados.filter(p => p.valor > 0).length === 0 && <p className="text-muted-foreground text-xs text-center py-4">Nenhum pedido com valor registrado.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 - SERVIÇOS */}
            {tab === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-heading font-black text-sm mb-4">🔍 Problemas Mais Comuns</h2>
                    {topProb.length === 0 ? <p className="text-muted-foreground text-xs">Nenhum pedido</p> : (
                      <div className="space-y-2">
                        {topProb.map(([prob, count], i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <span className="text-xs text-muted-foreground w-5 font-bold">{i + 1}.</span>
                            <span className="text-xs flex-1 truncate">{prob}</span>
                            <span className="text-xs font-bold text-highlight-amber bg-highlight-amber/10 px-2 py-0.5 rounded-lg">{count}x</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-heading font-black text-sm mb-4">💻 Equipamentos</h2>
                    {topEquip.length === 0 ? <p className="text-muted-foreground text-xs">Nenhum pedido</p> : (
                      <div className="space-y-3">
                        {topEquip.map(([equip, count], i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1"><span className="truncate">{equip}</span><span className="text-primary font-bold">{count}</span></div>
                            <div className="h-1.5 rounded-full bg-border overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / maxEquip) * 100}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Todos os pedidos */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-4">📋 Todos os Pedidos ({pedidosFiltrados.length})</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pedidosFiltrados.map(p => {
                      const cfg = STATUS_CONFIG[p.status as StatusPedido];
                      return (
                        <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                          <span className="font-heading font-black text-primary text-xs w-14">{p.codigo}</span>
                          <span className="text-xs flex-1 truncate">{p.cliente_nome}</span>
                          <span className="text-xs text-muted-foreground hidden md:block truncate max-w-28">{p.equipamento}</span>
                          <span className={`text-xs font-semibold ${cfg?.color} hidden sm:block`}>{cfg?.emoji} {p.status}</span>
                          {p.valor > 0 && <span className="text-xs text-green-500 font-bold">{fmt(p.valor)}</span>}
                        </div>
                      );
                    })}
                    {pedidosFiltrados.length === 0 && <p className="text-muted-foreground text-xs text-center py-4">Nenhum pedido no período.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3 - CUSTOS */}
            {tab === 3 && (
              <div className="space-y-6">
                {/* Novo custo */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-4">➕ Registrar Custo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Data</label>
                      <input type="date" value={novoCusto.data} onChange={e => setNovoCusto(f => ({ ...f, data: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
                      <input value={novoCusto.descricao} onChange={e => setNovoCusto(f => ({ ...f, descricao: e.target.value }))}
                        placeholder="Ex: Pasta térmica"
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Valor (R$)</label>
                      <input value={novoCusto.valor} onChange={e => setNovoCusto(f => ({ ...f, valor: e.target.value }))}
                        placeholder="0,00"
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
                      <select value={novoCusto.categoria} onChange={e => setNovoCusto(f => ({ ...f, categoria: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary">
                        {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={adicionarCusto} disabled={salvandoCusto}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50">
                    {salvandoCusto ? "Salvando..." : "Adicionar Custo"}
                  </button>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {topCat.map(([cat, val], i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground">{cat}</p>
                      <p className="font-heading text-lg font-black text-highlight-amber">{fmt(val)}</p>
                      <p className="text-xs text-muted-foreground">{totalCustos > 0 ? ((val / totalCustos) * 100).toFixed(0) : 0}% do total</p>
                    </div>
                  ))}
                </div>

                {/* Lista de custos */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-heading font-black text-sm mb-4">📦 Todos os Custos ({custosFiltrados.length})</h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {custosFiltrados.map(c => (
                      <div key={c.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <span className="text-xs text-muted-foreground w-20">{new Date(c.data).toLocaleDateString("pt-BR")}</span>
                        <span className="text-xs flex-1 truncate">{c.descricao}</span>
                        <span className="text-xs text-muted-foreground hidden md:block">{c.categoria}</span>
                        <span className="text-xs font-bold text-highlight-amber">{fmt(c.valor)}</span>
                        <button onClick={() => deletarCusto(c.id)} className="text-muted-foreground hover:text-destructive transition-colors text-xs">🗑️</button>
                      </div>
                    ))}
                    {custosFiltrados.length === 0 && <p className="text-muted-foreground text-xs text-center py-4">Nenhum custo no período.</p>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
