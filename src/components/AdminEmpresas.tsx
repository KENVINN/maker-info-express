import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import type { Empresa, PC, PlanoEmpresa } from "@/lib/empresas";

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

const gerarCodigo = () => {
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  return `EMP${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

const gerarSenha = () => {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[byte % 32]).join("");
};

const diasParaVisita = (proxima: string) => {
  const diff = new Date(proxima).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

type Props = {
  prefill?: { nome: string; contato_nome: string; contato_telefone: string } | null;
  onPrefillConsumed?: () => void;
};

const AdminEmpresas = ({ prefill, onPrefillConsumed }: Props) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<"lista" | "nova" | "visita">("lista");
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    contato_nome: "",
    contato_telefone: "",
    plano: "Pequeno" as PlanoEmpresa,
    proxima_visita: "",
    codigo: gerarCodigo(),
    senha: gerarSenha(),
  });
  const [editandoSenha, setEditandoSenha] = useState<string | null>(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [pcNome, setPcNome] = useState("");
  const [pcSetor, setPcSetor] = useState("");
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>({});
  const [obsVisita, setObsVisita] = useState("");
  const [salvandoVisita, setSalvandoVisita] = useState(false);

  const prefillApplied = useRef(false);

  const mostrarErro = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Nao foi possivel concluir a operacao.";
    setErro(message);
    setTimeout(() => setErro(""), 6000);
  };

  const carregarEmpresas = useCallback(async () => {
    setLoading(true);

    try {
      const { empresas: loadedEmpresas } = await api.admin.listEmpresas();
      setEmpresas(loadedEmpresas);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEmpresas();
  }, [carregarEmpresas]);

  useEffect(() => {
    if (!prefill || prefillApplied.current) return;
    prefillApplied.current = true;
    setForm((current) => ({
      ...current,
      nome: prefill.nome,
      contato_nome: prefill.contato_nome,
      contato_telefone: prefill.contato_telefone,
    }));
    setAbaAtiva("nova");
    onPrefillConsumed?.();
  }, [prefill, onPrefillConsumed]);

  const criarEmpresa = async () => {
    if (!form.nome || !form.proxima_visita) {
      return;
    }

    try {
      const { empresa, generatedPassword } = await api.admin.createEmpresa(form);
      setSucesso(`Empresa ${empresa.nome} criada! Código: ${empresa.codigo} · Senha inicial: ${generatedPassword}`);
      setForm({
        nome: "",
        contato_nome: "",
        contato_telefone: "",
        plano: "Pequeno",
        proxima_visita: "",
        codigo: gerarCodigo(),
        senha: gerarSenha(),
      });
      setAbaAtiva("lista");
      await carregarEmpresas();
      setTimeout(() => setSucesso(""), 8000);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const salvarSenha = async (empresaId: string) => {
    if (!novaSenha.trim()) {
      return;
    }

    try {
      await api.admin.updateEmpresaPassword(empresaId, novaSenha.trim().toUpperCase());
      setEditandoSenha(null);
      setNovaSenha("");
      setSucesso("Senha da empresa atualizada com sucesso.");
      await carregarEmpresas();
      setTimeout(() => setSucesso(""), 5000);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const adicionarPC = async (empresaId: string) => {
    if (!pcNome.trim()) {
      return;
    }

    try {
      await api.admin.addPc(empresaId, { nome: pcNome.trim(), setor: pcSetor.trim() });
      setPcNome("");
      setPcSetor("");
      await carregarEmpresas();
    } catch (error) {
      mostrarErro(error);
    }
  };

  const removerPC = async (pcId: string) => {
    try {
      await api.admin.removePc(pcId);
      await carregarEmpresas();
    } catch (error) {
      mostrarErro(error);
    }
  };

  const iniciarVisita = (empresa: Empresa) => {
    setEmpresaSelecionada(empresa);

    const initialChecklist: Record<string, Record<string, boolean>> = {};
    (empresa.pcs || []).forEach((pc: PC) => {
      initialChecklist[pc.id] = {};
      CHECKLIST_ITENS.forEach((item) => {
        initialChecklist[pc.id][item.key] = false;
      });
    });

    setChecklist(initialChecklist);
    setObsVisita("");
    setAbaAtiva("visita");
  };

  const toggleCheck = (pcId: string, key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [pcId]: { ...prev[pcId], [key]: !prev[pcId]?.[key] },
    }));
  };

  const progressoPC = (pcId: string) => {
    if (!checklist[pcId]) {
      return 0;
    }

    const total = CHECKLIST_ITENS.length;
    const feitos = Object.values(checklist[pcId]).filter(Boolean).length;

    return Math.round((feitos / total) * 100);
  };

  const progressoGeral = () => {
    if (!empresaSelecionada?.pcs?.length) {
      return 0;
    }

    const total = empresaSelecionada.pcs.length * CHECKLIST_ITENS.length;
    const feitos = Object.values(checklist).reduce((acc, pcChecklist) => {
      return acc + Object.values(pcChecklist).filter(Boolean).length;
    }, 0);

    return Math.round((feitos / total) * 100);
  };

  const salvarVisita = async () => {
    if (!empresaSelecionada) {
      return;
    }

    setSalvandoVisita(true);

    try {
      await api.admin.saveVisita(empresaSelecionada.id, {
        observacao: obsVisita,
        checklist,
      });
      setSucesso(`Visita em ${empresaSelecionada.nome} registrada!`);
      setAbaAtiva("lista");
      await carregarEmpresas();
      setTimeout(() => setSucesso(""), 5000);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setSalvandoVisita(false);
    }
  };

  const deletarEmpresa = async (id: string) => {
    if (!confirm("Deletar empresa e todos os PCs?")) {
      return;
    }

    try {
      await api.admin.deleteEmpresa(id);
      await carregarEmpresas();
    } catch (error) {
      mostrarErro(error);
    }
  };

  return (
    <div className="space-y-6">
      {sucesso && <p className="text-green-500 text-sm font-semibold">✓ {sucesso}</p>}
      {erro && <p className="text-destructive text-sm font-semibold">{erro}</p>}

      <div className="flex gap-2 border-b border-border pb-3">
        {[
          { key: "lista", label: "🏢 Empresas" },
          { key: "nova", label: "➕ Nova Empresa" },
        ].map((aba) => (
          <button
            key={aba.key}
            onClick={() => setAbaAtiva(aba.key as "lista" | "nova")}
            className={`px-4 py-2 rounded-lg text-sm font-heading font-bold transition-all ${
              abaAtiva === aba.key
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {abaAtiva === "lista" && (
        <div className="space-y-4">
          {loading && <p className="text-muted-foreground text-sm">Carregando...</p>}
          {!loading && empresas.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhuma empresa ainda. Crie a primeira!</p>
          )}

          {empresas.map((emp) => {
            const dias = diasParaVisita(emp.proxima_visita);
            const vencida = dias < 0;
            const urgente = dias >= 0 && dias <= 5;

            return (
              <div
                key={emp.id}
                className={`bg-card border rounded-2xl p-5 ${
                  vencida ? "border-red-500/40" : urgente ? "border-amber-500/40" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-lg text-primary">{emp.nome}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PLANO_COR[emp.plano as PlanoEmpresa]}`}>
                        {emp.plano}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">{emp.codigo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {emp.contato_nome} · {emp.contato_telefone}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Senha:</span>
                      {editandoSenha === emp.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            value={novaSenha}
                            onChange={(event) => setNovaSenha(event.target.value.toUpperCase())}
                            placeholder="Nova senha"
                            className="px-2 py-1 rounded-lg bg-background border border-primary text-xs w-28 focus:outline-none"
                          />
                          <button onClick={() => salvarSenha(emp.id)} className="text-xs text-primary font-bold hover:brightness-110">
                            ✓
                          </button>
                          <button onClick={() => setEditandoSenha(null)} className="text-xs text-muted-foreground hover:text-foreground">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {emp.senha_configurada ? "Protegida" : "Pendente"}
                          </span>
                          <button
                            onClick={() => {
                              setEditandoSenha(emp.id);
                              setNovaSenha("");
                            }}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            🔑
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => iniciarVisita(emp)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      🔧 Iniciar Visita
                    </button>
                    <button
                      onClick={() => deletarEmpresa(emp.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${
                    vencida
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : urgente
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-green-500/10 border-green-500/30 text-green-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      vencida ? "bg-red-400" : urgente ? "bg-amber-400 animate-pulse" : "bg-green-400"
                    }`}
                  />
                  {vencida
                    ? `Visita atrasada ${Math.abs(dias)} dia(s)`
                    : `Próxima visita em ${dias} dia(s) — ${new Date(emp.proxima_visita).toLocaleDateString("pt-BR")}`}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-2">
                    🖥️ Computadores ({emp.pcs?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(emp.pcs || []).map((pc) => (
                      <div key={pc.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs">
                        <span className="font-semibold">{pc.nome}</span>
                        {pc.setor && <span className="text-muted-foreground">· {pc.setor}</span>}
                        <button onClick={() => removerPC(pc.id)} className="text-muted-foreground hover:text-destructive ml-1 transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={pcNome}
                      onChange={(event) => setPcNome(event.target.value)}
                      placeholder="Nome do PC (ex: PC-01 — João)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary"
                    />
                    <input
                      value={pcSetor}
                      onChange={(event) => setPcSetor(event.target.value)}
                      placeholder="Setor (opcional)"
                      className="w-32 px-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => adicionarPC(emp.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      + PC
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {abaAtiva === "nova" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 max-w-lg">
          <h2 className="font-heading font-black text-lg mb-2">Nova Empresa</h2>
          <input
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Nome da empresa *"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={form.contato_nome}
            onChange={(event) => setForm((current) => ({ ...current, contato_nome: event.target.value }))}
            placeholder="Nome do responsável"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={form.contato_telefone}
            onChange={(event) => setForm((current) => ({ ...current, contato_telefone: event.target.value }))}
            placeholder="WhatsApp do responsável"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
          />
          <div>
            <p className="text-xs text-muted-foreground mb-2">Plano</p>
            <div className="flex gap-2">
              {PLANOS.map((plano) => (
                <button
                  key={plano}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, plano }))}
                  className={`px-4 py-2 rounded-lg text-xs font-heading font-bold border transition-all ${
                    form.plano === plano
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {plano}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Data da primeira visita *</p>
            <input
              type="date"
              value={form.proxima_visita}
              onChange={(event) => setForm((current) => ({ ...current, proxima_visita: event.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-2">Acesso do cliente</p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-muted-foreground w-12">Código</span>
              <span className="font-heading font-black text-primary">{form.codigo}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-12">Senha</span>
              <input
                value={form.senha}
                onChange={(event) => setForm((current) => ({ ...current, senha: event.target.value.toUpperCase() }))}
                className="font-heading font-black text-primary bg-transparent border-b border-primary/30 focus:outline-none focus:border-primary text-sm w-28"
              />
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, senha: gerarSenha() }))}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                🔄 Gerar nova
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">O cliente usa código + senha para acessar o painel.</p>
          </div>
          <button
            onClick={criarEmpresa}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all"
          >
            Criar Empresa
          </button>
        </div>
      )}

      {abaAtiva === "visita" && empresaSelecionada && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-lg">🔧 Visita — {empresaSelecionada.nome}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
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
            <p className="text-muted-foreground text-sm p-4 bg-card border border-border rounded-xl">
              Nenhum PC cadastrado nessa empresa. Adicione PCs primeiro na lista.
            </p>
          )}

          {(empresaSelecionada.pcs || []).map((pc) => (
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
                {CHECKLIST_ITENS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCheck(pc.id, item.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      checklist[pc.id]?.[item.key]
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-background border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
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
              <textarea
                value={obsVisita}
                onChange={(event) => setObsVisita(event.target.value)}
                placeholder="PC-02 com HD perto do limite, recomendar troca em breve..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary resize-none"
              />
              <button
                onClick={salvarVisita}
                disabled={salvandoVisita}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
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
