import { useCallback, useEffect, useState } from "react";

import { api, type Lead, type LeadStatus } from "@/lib/api";

type FiltroStatus = "todos" | LeadStatus;

const STATUS_CONFIG: Record<LeadStatus, { label: string; cor: string; emoji: string }> = {
  novo: { label: "Novo", cor: "bg-blue-500/10 border-blue-500/30 text-blue-400", emoji: "🆕" },
  contatado: { label: "Contatado", cor: "bg-amber-500/10 border-amber-500/30 text-amber-400", emoji: "📞" },
  visita_agendada: { label: "Visita agendada", cor: "bg-purple-500/10 border-purple-500/30 text-purple-400", emoji: "📅" },
  proposta_enviada: { label: "Proposta enviada", cor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400", emoji: "📄" },
  fechado: { label: "Fechado ✓", cor: "bg-green-500/10 border-green-500/30 text-green-400", emoji: "✅" },
  perdido: { label: "Perdido", cor: "bg-border border-border text-muted-foreground", emoji: "❌" },
};

const STATUS_ORDER: LeadStatus[] = [
  "novo",
  "contatado",
  "visita_agendada",
  "proposta_enviada",
  "fechado",
  "perdido",
];

type Props = {
  onConverterEmpresa: (lead: Lead) => void;
};

const AdminLeads = ({ onConverterEmpresa }: Props) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [obsEditando, setObsEditando] = useState<Record<string, string>>({});

  const mostrarErro = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Nao foi possivel concluir a operacao.";
    setErro(message);
    setTimeout(() => setErro(""), 6000);
  };

  const carregarLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { leads: loaded } = await api.admin.listLeads();
      setLeads(loaded);
      const obs: Record<string, string> = {};
      loaded.forEach((l) => {
        obs[l.id] = l.observacao;
      });
      setObsEditando(obs);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarLeads();
  }, [carregarLeads]);

  const atualizarStatus = async (id: string, status: LeadStatus) => {
    try {
      const { lead } = await api.admin.updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
    } catch (error) {
      mostrarErro(error);
    }
  };

  const salvarObservacao = async (id: string) => {
    const observacao = obsEditando[id] ?? "";
    const atual = leads.find((l) => l.id === id)?.observacao ?? "";
    if (observacao === atual) return;
    try {
      const { lead } = await api.admin.updateLead(id, { observacao });
      setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
    } catch (error) {
      mostrarErro(error);
    }
  };

  const deletarLead = async (id: string) => {
    if (!confirm("Remover este lead?")) return;
    try {
      await api.admin.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSucesso("Lead removido.");
      setTimeout(() => setSucesso(""), 4000);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const leadsFiltrados = filtro === "todos" ? leads : leads.filter((l) => l.status === filtro);

  const contagem = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }),
    {} as Record<LeadStatus, number>,
  );

  return (
    <div className="space-y-6">
      {sucesso && <p className="text-green-500 text-sm font-semibold">✓ {sucesso}</p>}
      {erro && <p className="text-destructive text-sm font-semibold">{erro}</p>}

      {/* Resumo do funil */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFiltro(filtro === s ? "todos" : s)}
              className={`p-3 rounded-xl border text-center transition-all ${
                filtro === s ? cfg.cor + " ring-1 ring-current" : "bg-background border-border hover:border-primary/50"
              }`}
            >
              <p className="text-lg leading-none mb-1">{cfg.emoji}</p>
              <p className="font-heading font-black text-lg leading-none">{contagem[s] ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {loading && <p className="text-muted-foreground text-sm">Carregando...</p>}

      {!loading && leads.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">
          Nenhum lead ainda. Quando alguém preencher o formulário em /empresas, aparece aqui.
        </p>
      )}

      {!loading && leads.length > 0 && leadsFiltrados.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhum lead com este status.</p>
      )}

      <div className="space-y-4">
        {leadsFiltrados.map((lead) => {
          const cfg = STATUS_CONFIG[lead.status];
          const waLink = `https://api.whatsapp.com/send/?phone=55${lead.contato_telefone.replace(/\D/g, "")}&text=${encodeURIComponent(`Olá! Vi que você demonstrou interesse nos planos B2B da Maker Info. Posso agendar uma visita de diagnóstico gratuita?`)}`;

          return (
            <div key={lead.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-black text-lg text-primary">{lead.nome_empresa}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.cor}`}>
                      {cfg.emoji} {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lead.contato_nome || "–"} · {lead.contato_telefone}
                    {lead.qtd_pcs && <span className="ml-2">· {lead.qtd_pcs}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-heading font-bold hover:bg-[#25D366] hover:text-white transition-all"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => deletarLead(lead.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Status pipeline */}
              <div className="flex flex-wrap gap-1.5">
                {STATUS_ORDER.map((s) => {
                  const scfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => atualizarStatus(lead.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all ${
                        lead.status === s
                          ? scfg.cor
                          : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {scfg.emoji} {scfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Observação */}
              <textarea
                value={obsEditando[lead.id] ?? ""}
                onChange={(e) => setObsEditando((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                onBlur={() => salvarObservacao(lead.id)}
                placeholder="Anotação interna (salva automaticamente)..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary resize-none"
              />

              {/* Converter em empresa */}
              {lead.status === "fechado" && (
                <button
                  onClick={() => onConverterEmpresa(lead)}
                  className="w-full py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/30 font-heading font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  🏢 Cadastrar como empresa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLeads;
