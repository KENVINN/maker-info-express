import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Tipos ───────────────────────────────────────────────
export type PlanoEmpresa = "Pequeno" | "Médio" | "Grande";

export interface PC {
  id: string;
  empresa_id: string;
  nome: string; // ex: "PC-01 — João da Contabilidade"
  setor: string;
  created_at: string;
}

export interface Empresa {
  id: string;
  codigo: string; // ex: EMP001 — usado pelo cliente para logar
  nome: string;
  contato_nome: string;
  contato_telefone: string;
  plano: PlanoEmpresa;
  proxima_visita: string; // ISO date
  created_at: string;
  pcs?: PC[];
}

export interface Visita {
  id: string;
  empresa_id: string;
  data: string;
  observacao: string;
  checklist: Record<string, boolean>; // pc_id -> checked items
  created_at: string;
}

// ─── Checklist padrão por PC ──────────────────────────────
const CHECKLIST_ITENS = [
  { key: "limpeza", label: "Limpeza física", emoji: "🧹" },
  { key: "temperatura", label: "Temperatura verificada", emoji: "🌡️" },
  { key: "hd", label: "Saúde do HD/SSD", emoji: "💾" },
  { key: "windows", label: "Windows atualizado", emoji: "🪟" },
  { key: "antivirus", label: "Antivírus verificado", emoji: "🛡️" },
  { key: "programas", label: "Programas desnecessários removidos", emoji: "🗑️" },
];

const PLANOS: PlanoEmpresa[] = ["Pequeno", "Médio", "Grande"];
const PLANO_COR: Record<PlanoEmpresa, string> = {
  Pequeno: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Médio: "bg-primary/10 text-primary border-primary/30",
  Grande: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

const gerarCodigo = () => `EMP${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;

const diasParaVisita = (proxima: string) => {
  const diff = new Date(proxima).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── Componente principal ─────────────────────────────────
const AdminEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"lista" | "nova" | "visita">("lista");
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [sucesso, setSucesso] = useState("");

  // Form nova empresa
  const [form, setForm] = useState({ nome: "", contato_nome: "", contato_telefone: "", plano: "Pequeno" as PlanoEmpresa, proxima_visita: "", codigo: gerarCodigo() });

  // Gerenciar PCs
  const [pcNome, setPcNome] = useState("");
  const [pcSetor, setPcSetor] = useState("");

  // Checklist de visita
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [obsVisita, setObsVisita] = useState("");
  const [salvandoVisita, setSalvandoVisita] = useState(false);

  useEffect(() => { carregarEmpresas(); }, []);

  const carregarEmpresas = async () => {
    setLoading(true);
    const { data: emps } = await supabase.from("empresas").select("*").order("created_at", { ascending: false });
    if (emps) {
      const comPcs = await Promise.all(emps.map(async (e) => {
        const { data: pcs } = await supabase.from("pcs_empresa").select("*").eq("empresa_id", e.id).order("created_at");
        return { ...e, pcs: pcs || [] };
      }));
      setEmpresas(comPcs);
    }
    setLoading(false);
  };

  const criarEmpresa = async () => {
    if (!form.nome || !form.proxima_visita) return;
    const { error } = await supabase.from("empresas").insert({ ...form });
    if (!error) {
      setSucesso(`Empresa ${form.nome} criada! Código: ${form.codigo}`);
      setForm({ nome: "", contato_nome: "", contato_telefone: "", plano: "Pequeno", proxima_visita: "", codigo: gerarCodigo() });
      carregarEmpresas();
      setAbaAtiva("lista");
      setTimeout(() => setSucesso(""), 5000);
    }
  };

  const adicionarPC = async (empresaId: string) => {
    if (!pcNome) return;
    await supabase.from("pcs_empresa").insert({ empresa_id: empresaId, nome: pcNome, setor: pcSetor });
    setPcNome(""); setPcSetor("");
    carregarEmpresas();
  };

  const removerPC = async (pcId: string) => {
    await supabase.from("pcs_empresa").delete().eq("id", pcId);
    carregarEmpresas();
  };

  const iniciarVisita = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);
    // Inicializa checklist para cada PC
    const init: Record<string, Record<string, boolean>> = {};
    (empresa.pcs || []).forEach(pc => {
      init[pc.id] = {};
      CHECKLIST_ITENS.forEach(item => { init[pc.id][item.key] = false; });
    });
    setChecklist(init);
    setObsVisita("");
    setAbaAtiva("visita");
  };

  const toggleCheck = (pcId: string, key: string) => {
    setChecklist(prev => ({
      ...prev,
      [pcId]: { ...prev[pcId], [key]: !prev[pcId][key] }
    }));
  };

  const progressoPC = (pcId: string) => {
    if (!checklist[pcId]) return 0;
    const total = CHECKLIST_ITENS.length;
    const feitos = Object.values(checklist[pcId]).filter(Boolean).length;
    return Math.round((feitos / total) * 100);
  };

  const progressoGeral = () => {
    if (!empresaSelecionada?.pcs?.length) return 0;
    const total = empresaSelecionada.pcs.length * CHECKLIST_ITENS.length;
    const feitos = Object.values(checklist).reduce((acc, pc) => acc + Object.values(pc).filter(Boolean).length, 0);
    return Math.round((feitos / total) * 100);
  };

  const salvarVisita = async () => {
    if (!empresaSelecionada) return;
    setSalvandoVisita(true);
    // Salva visita
    await supabase.from("visitas_empresa").insert({
      empresa_id: empresaSelecionada.id,
      data: new Date().toISOString(),
      observacao: obsVisita,
      checklist,
    });
    // Atualiza próxima visita (+30 dias)
    const proxima = new Date();
    proxima.setDate(proxima.getDate() + 30);
    await supabase.from("empresas").update({ proxima_visita: proxima.toISOString().split("T")[0] }).eq("id", empresaSelecionada.id);
    setSalvandoVisita(false);
    setSucesso(`Visita em ${empresaSelecionada.nome} registrada!`);
    carregarEmpresas();
    setAbaAtiva("lista");
    setTimeout(() => setSucesso(""), 5000);
  };

  const deletarEmpresa = async (id: string) => {
    if (!confirm("Deletar empresa e todos os PCs?")) return;
    await supabase.from("pcs_empresa").delete().eq("empresa_id", id);
    await supabase.from("empresas").delete().eq("id", id);
    carregarEmpresas();
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {sucesso && <p className="text-green-500 text-sm font-semibold">✓ {sucesso}</p>}

      {/* Abas */}
      <div className="flex gap-2 border-b border-border pb-3">
        {[
          { key: "lista", label: "🏢 Empresas" },
          { key: "nova", label: "➕ Nova Empresa" },
        ].map(a => (
          <button key={a.key} onClick={() => setAbaAtiva(a.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all ${abaAtiva === a.key ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* ── ABA: LISTA ── */}
      {abaAtiva === "lista" && (
        <div className="space-y-4">
          {loading && <p className="text-muted-foreground text-sm">Carregando...</p>}
          {!loading && empresas.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhuma empresa ainda. Crie a primeira!</p>
          )}
          {empresas.map(emp => {
            const dias = diasParaVisita(emp.proxima_visita);
            const vencida = dias < 0;
            const urgente = dias >= 0 && dias <= 5;
            return (
              <div key={emp.id} className={`bg-card border rounded-2xl p-5 ${vencida ? "border-red-500/40" : urgente ? "border-amber-500/40" : "border-border"}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-lg text-primary">{emp.nome}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PLANO_COR[emp.plano as PlanoEmpresa]}`}>
                        {emp.plano}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{emp.codigo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{emp.contato_nome} · {emp.contato_telefone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => iniciarVisita(emp)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                      🔧 Iniciar Visita
                    </button>
                    <button onClick={() => deletarEmpresa(emp.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-xs">🗑️</button>
                  </div>
                </div>

                {/* Próxima visita */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${vencida ? "bg-red-500/10 border-red-500/30 text-red-400" : urgente ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${vencida ? "bg-red-400" : urgente ? "bg-amber-400 animate-pulse" : "bg-green-400"}`} />
                  {vencida ? `Visita atrasada ${Math.abs(dias)} dia(s)` : `Próxima visita em ${dias} dia(s) — ${new Date(emp.proxima_visita).toLocaleDateString("pt-BR")}`}
                </div>

                {/* PCs */}
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">🖥️ Computadores ({emp.pcs?.length || 0})</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(emp.pcs || []).map(pc => (
                      <div key={pc.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
                        <span className="font-semibold">{pc.nome}</span>
                        {pc.setor && <span className="text-muted-foreground">· {pc.setor}</span>}
                        <button onClick={() => removerPC(pc.id)} className="text-muted-foreground hover:text-destructive ml-1 transition-colors">×</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={pcNome} onChange={e => setPcNome(e.target.value)} placeholder="Nome do PC (ex: PC-01 — João)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary" />
                    <input value={pcSetor} onChange={e => setPcSetor(e.target.value)} placeholder="Setor (opcional)"
                      className="w-32 px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary" />
                    <button onClick={() => adicionarPC(emp.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                      + PC
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ABA: NOVA EMPRESA ── */}
      {abaAtiva === "nova" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 max-w-lg">
          <h2 className="font-heading font-black text-lg mb-2">Nova Empresa</h2>
          <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome da empresa *"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary" />
          <input value={form.contato_nome} onChange={e => setForm(f => ({ ...f, contato_nome: e.target.value }))} placeholder="Nome do responsável"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary" />
          <input value={form.contato_telefone} onChange={e => setForm(f => ({ ...f, contato_telefone: e.target.value }))} placeholder="WhatsApp do responsável"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary" />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Plano</p>
            <div className="flex gap-2">
              {PLANOS.map(p => (
                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, plano: p }))}
                  className={`px-4 py-2 rounded-lg text-xs font-heading font-bold border transition-all ${form.plano === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Data da primeira visita *</p>
            <input type="date" value={form.proxima_visita} onChange={e => setForm(f => ({ ...f, proxima_visita: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">Código do cliente</p>
            <p className="font-heading font-black text-primary">{form.codigo}</p>
            <p className="text-xs text-muted-foreground mt-1">O cliente usa esse código para acessar o painel deles</p>
          </div>
          <button onClick={criarEmpresa}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all">
            Criar Empresa
          </button>
        </div>
      )}

      {/* ── ABA: VISITA ── */}
      {abaAtiva === "visita" && empresaSelecionada && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-lg">🔧 Visita — {empresaSelecionada.nome}</h2>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Progresso geral</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 rounded-full bg-border">
                  <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progressoGeral()}%` }} />
                </div>
                <span className="text-sm font-heading font-bold text-primary">{progressoGeral()}%</span>
              </div>
            </div>
          </div>

          {(empresaSelecionada.pcs || []).length === 0 && (
            <p className="text-muted-foreground text-sm p-4 bg-card border border-border rounded-xl">Nenhum PC cadastrado nessa empresa. Adicione PCs primeiro na lista.</p>
          )}

          {(empresaSelecionada.pcs || []).map(pc => (
            <div key={pc.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-heading font-bold">{pc.nome}</p>
                  {pc.setor && <p className="text-xs text-muted-foreground">{pc.setor}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-border">
                    <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progressoPC(pc.id)}%` }} />
                  </div>
                  <span className={`text-xs font-bold ${progressoPC(pc.id) === 100 ? "text-green-400" : "text-muted-foreground"}`}>
                    {progressoPC(pc.id) === 100 ? "✓ Feito" : `${progressoPC(pc.id)}%`}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CHECKLIST_ITENS.map(item => (
                  <button key={item.key} type="button"
                    onClick={() => toggleCheck(pc.id, item.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${checklist[pc.id]?.[item.key] ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-background border-border text-muted-foreground hover:border-primary"}`}>
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                    {checklist[pc.id]?.[item.key] && <span className="ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {(empresaSelecionada.pcs || []).length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <p className="font-heading font-bold text-sm">📝 Observações da visita</p>
              <textarea value={obsVisita} onChange={e => setObsVisita(e.target.value)}
                placeholder="PC-02 com HD perto do limite, recomendar troca em breve..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary resize-none" />
              <button onClick={salvarVisita} disabled={salvandoVisita}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {salvandoVisita ? "Salvando..." : "✓ Concluir Visita"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEmpresas;
