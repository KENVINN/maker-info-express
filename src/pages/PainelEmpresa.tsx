import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { STATUS_CONFIG, StatusPedido } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import type { Empresa, PC, Visita } from "@/components/AdminEmpresas";

const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+preciso+de+suporte+técnico&type=phone_number&app_absent=0";

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

type FiltroStatus = "todos" | "em_reparo" | "prontos" | "ok";

const PainelEmpresa = () => {
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [abaAtiva, setAbaAtiva] = useState<"pcs" | "visitas">("pcs");
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [novaSenhaCliente, setNovaSenhaCliente] = useState("");
  const [senhaMsg, setSenhaMsg] = useState("");

  const buscar = async () => {
    if (!codigo.trim() || !senha.trim()) return;
    setLoading(true);
    setErro("");
    setEmpresa(null);

    const { data: emp } = await supabase
      .from("empresas")
      .select("*")
      .eq("codigo", codigo.trim().toUpperCase())
      .single();

    if (!emp) {
      setErro("Código não encontrado. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    if (emp.senha && emp.senha.toUpperCase() !== senha.trim().toUpperCase()) {
      setErro("Senha incorreta. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    setEmpresa(emp);

    // Carrega PCs
    const { data: pcData } = await supabase.from("pcs_empresa").select("*").eq("empresa_id", emp.id).order("created_at");
    setPcs(pcData || []);

    // Carrega pedidos vinculados à empresa
    const { data: pedData } = await supabase.from("pedidos").select("*").eq("empresa_id", emp.id).order("created_at", { ascending: false });
    setPedidos(pedData || []);

    // Carrega visitas
    const { data: visData } = await supabase.from("visitas_empresa").select("*").eq("empresa_id", emp.id).order("data", { ascending: false });
    setVisitas(visData || []);

    setLoading(false);
  };

  const diasParaVisita = (proxima: string) => {
    const diff = new Date(proxima).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getPedidoDoPC = (pcId: string) => pedidos.find(p => p.pc_id === pcId);

  const getStatusPC = (pcId: string) => {
    const ped = getPedidoDoPC(pcId);
    if (!ped) return "ok";
    if (ped.status === "Entregue") return "ok";
    if (ped.status === "Pronto para Retirada") return "pronto";
    return "em_reparo";
  };

  const pcsFiltrados = pcs.filter(pc => {
    if (filtro === "todos") return true;
    return getStatusPC(pc.id) === filtro;
  });

  const contagem = {
    ok: pcs.filter(pc => getStatusPC(pc.id) === "ok").length,
    em_reparo: pcs.filter(pc => getStatusPC(pc.id) === "em_reparo").length,
    prontos: pcs.filter(pc => getStatusPC(pc.id) === "pronto").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 container px-4 max-w-3xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏢</div>
          <h1 className="font-heading text-3xl font-black mb-2">
            Painel da <span className="text-gradient-neon">Empresa</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Digite o código e a senha que a Maker Info te forneceu
          </p>
        </div>

        {/* Busca */}
        <div className="flex flex-col gap-3 mb-8 max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && buscar()}
              placeholder="Código  —  Ex: EMP001"
              className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-base focus:outline-none focus:border-primary transition-colors"
              maxLength={10}
            />
          </div>
          <div className="flex gap-3">
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === "Enter" && buscar()}
              placeholder="Senha"
              className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-base focus:outline-none focus:border-primary transition-colors"
            />
            <button onClick={buscar} disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? "..." : "Entrar"}
            </button>
          </div>
        </div>

        {erro && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center mb-6">
            {erro}
          </div>
        )}

        {empresa && (
          <div className="space-y-6">

            {/* Header empresa */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading font-black text-2xl text-primary mb-1">{empresa.nome}</h2>
                  <p className="text-sm text-muted-foreground">Plano {empresa.plano} · {pcs.length} computador(es)</p>
                </div>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-heading font-bold hover:bg-[#25D366] hover:text-white transition-all">
                  <WhatsAppIcon />
                  Falar com técnico
                </a>
              </div>

              {/* Alterar senha */}
              <div className="mt-3">
                {alterandoSenha ? (
                  <div className="flex items-center gap-2">
                    <input type="password" value={novaSenhaCliente} onChange={e => setNovaSenhaCliente(e.target.value)}
                      placeholder="Nova senha"
                      className="px-3 py-1.5 rounded-lg bg-background border border-primary text-sm w-36 focus:outline-none" />
                    <button onClick={async () => {
                      if (!novaSenhaCliente.trim() || !empresa) return;
                      await supabase.from("empresas").update({ senha: novaSenhaCliente.trim().toUpperCase() }).eq("id", empresa.id);
                      setEmpresa(e => e ? { ...e, senha: novaSenhaCliente.trim().toUpperCase() } : e);
                      setAlterandoSenha(false);
                      setNovaSenhaCliente("");
                      setSenhaMsg("Senha alterada com sucesso!");
                      setTimeout(() => setSenhaMsg(""), 4000);
                    }} className="text-xs text-primary font-bold px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all">
                      Salvar
                    </button>
                    <button onClick={() => setAlterandoSenha(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setAlterandoSenha(true)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    🔑 Alterar minha senha
                  </button>
                )}
                {senhaMsg && <p className="text-xs text-green-400 mt-1">{senhaMsg}</p>}
              </div>

              {/* Próxima visita */}
              {empresa.proxima_visita && (() => {
                const dias = diasParaVisita(empresa.proxima_visita);
                const vencida = dias < 0;
                const urgente = dias >= 0 && dias <= 5;
                return (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${vencida ? "bg-red-500/10 border-red-500/30 text-red-400" : urgente ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${vencida ? "bg-red-400" : urgente ? "bg-amber-400 animate-pulse" : "bg-green-400"}`} />
                    {vencida ? `Visita atrasada ${Math.abs(dias)} dia(s)` : `Próxima visita em ${dias} dia(s) — ${new Date(empresa.proxima_visita).toLocaleDateString("pt-BR")}`}
                  </div>
                );
              })()}

              {/* Resumo */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Em funcionamento", valor: contagem.ok, cor: "text-green-400", bg: "bg-green-500/10" },
                  { label: "Em reparo", valor: contagem.em_reparo, cor: "text-amber-400", bg: "bg-amber-500/10" },
                  { label: "Prontos p/ retirada", valor: contagem.prontos, cor: "text-primary", bg: "bg-primary/10" },
                ].map((c, i) => (
                  <div key={i} className={`${c.bg} rounded-xl p-3 text-center`}>
                    <p className={`font-heading font-black text-2xl ${c.cor}`}>{c.valor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Abas */}
            <div className="flex gap-2 border-b border-border pb-3">
              {[
                { key: "pcs", label: "🖥️ Computadores" },
                { key: "visitas", label: "📋 Histórico de Visitas" },
              ].map(a => (
                <button key={a.key} onClick={() => setAbaAtiva(a.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all ${abaAtiva === a.key ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* ── ABA: PCS ── */}
            {abaAtiva === "pcs" && (
              <div>
                {/* Filtros */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { key: "todos", label: "Todos" },
                    { key: "ok", label: "✅ OK" },
                    { key: "em_reparo", label: "🔧 Em reparo" },
                    { key: "prontos", label: "📦 Prontos" },
                  ].map(f => (
                    <button key={f.key} onClick={() => setFiltro(f.key as FiltroStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all ${filtro === f.key ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {pcsFiltrados.map(pc => {
                    const pedido = getPedidoDoPC(pc.id);
                    const statusPC = getStatusPC(pc.id);
                    const cfg = pedido ? STATUS_CONFIG[pedido.status as StatusPedido] : null;
                    return (
                      <div key={pc.id} className={`bg-card border rounded-xl p-4 ${statusPC === "em_reparo" ? "border-amber-500/30" : statusPC === "pronto" ? "border-primary/30" : "border-border"}`}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-heading font-bold text-sm">{pc.nome}</p>
                            {pc.setor && <p className="text-xs text-muted-foreground">{pc.setor}</p>}
                          </div>
                          <div className="text-right">
                            {statusPC === "ok" && (
                              <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">✅ Funcionando</span>
                            )}
                            {pedido && cfg && (
                              <div>
                                <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.emoji} {pedido.status}</span>
                                {pedido.codigo && <p className="text-xs text-muted-foreground mt-0.5">#{pedido.codigo}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                        {pedido?.observacao && (
                          <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-xs text-muted-foreground">💬 Técnico: <span className="text-foreground">{pedido.observacao}</span></p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {pcsFiltrados.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">Nenhum computador nesse filtro.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── ABA: VISITAS ── */}
            {abaAtiva === "visitas" && (
              <div className="space-y-3">
                {visitas.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-8">Nenhuma visita registrada ainda.</p>
                )}
                {visitas.map((v, i) => {
                  const totalItens = Object.values(v.checklist || {}).reduce((acc, pc) => acc + Object.keys(pc).length, 0);
                  const feitos = Object.values(v.checklist || {}).reduce((acc, pc) => acc + Object.values(pc).filter(Boolean).length, 0);
                  const pct = totalItens > 0 ? Math.round((feitos / totalItens) * 100) : 0;
                  return (
                    <div key={v.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-heading font-bold text-sm">
                            Visita #{visitas.length - i}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(v.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-border">
                            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-primary">{pct}%</span>
                        </div>
                      </div>
                      {v.observacao && (
                        <p className="text-xs text-muted-foreground mt-2 p-2.5 bg-background rounded-lg">
                          📝 {v.observacao}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default PainelEmpresa;
