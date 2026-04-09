import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFab from "@/components/WhatsAppFab";
import { api } from "@/lib/api";
import type { Empresa, PC, Visita } from "@/lib/empresas";
import { STATUS_CONFIG, type StatusPedido } from "@/lib/pedidos";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=556592824709&text=Olá%2C+preciso+de+suporte+técnico&type=phone_number&app_absent=0";
const CHECKLIST_LABELS: Record<string, string> = {
  limpeza: "Limpeza física",
  temperatura: "Temperatura verificada",
  hd: "Saúde do HD/SSD",
  windows: "Windows atualizado",
  antivirus: "Antivírus verificado",
  programas: "Programas desnecessários removidos",
};

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.211-3.676.988.995-3.591-.232-.371A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

type PedidoEmpresa = {
  id: string;
  pc_id?: string | null;
  status: StatusPedido;
  problema: string;
  observacao?: string;
  created_at: string;
};

type FiltroStatus = "todos" | "em_reparo" | "pronto" | "ok";

const PainelEmpresa = () => {
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [pedidos, setPedidos] = useState<PedidoEmpresa[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [abaAtiva, setAbaAtiva] = useState<"pcs" | "visitas">("pcs");
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [novaSenhaCliente, setNovaSenhaCliente] = useState("");
  const [senhaMsg, setSenhaMsg] = useState("");

  useEffect(() => {
    let active = true;

    api.company
      .session()
      .then((payload) => {
        if (!active) {
          return;
        }

        hydrateDashboard(payload);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const hydrateDashboard = (payload: {
    empresa: Empresa;
    pcs: PC[];
    pedidos: PedidoEmpresa[];
    visitas: Visita[];
  }) => {
    setEmpresa(payload.empresa);
    setPcs(payload.pcs);
    setPedidos(payload.pedidos);
    setVisitas(payload.visitas);
    setErro("");
  };

  const buscar = async () => {
    if (!codigo.trim() || !senha.trim()) {
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const payload = await api.company.login(codigo.trim().toUpperCase(), senha.trim());
      hydrateDashboard(payload);
    } catch (error) {
      setEmpresa(null);
      setPcs([]);
      setPedidos([]);
      setVisitas([]);
      setErro(error instanceof Error ? error.message : "Nao foi possivel entrar no painel.");
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  };

  const sair = async () => {
    try {
      await api.company.logout();
    } catch {
      // O estado local ainda precisa ser limpo mesmo se a sessao ja tiver expirado.
    }

    setEmpresa(null);
    setPcs([]);
    setPedidos([]);
    setVisitas([]);
    setAlterandoSenha(false);
    setNovaSenhaCliente("");
    setSenhaMsg("");
  };

  const diasParaVisita = (proxima: string) => {
    const diff = new Date(proxima).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getPedidoDoPC = (pcId: string) => pedidos.find((pedido) => pedido.pc_id === pcId);

  const getStatusPC = (pcId: string) => {
    const pedido = getPedidoDoPC(pcId);

    if (!pedido || pedido.status === "Entregue") {
      return "ok";
    }

    if (pedido.status === "Pronto para Retirada") {
      return "pronto";
    }

    return "em_reparo";
  };

  const pcsFiltrados = pcs.filter((pc) => {
    if (filtro === "todos") {
      return true;
    }

    return getStatusPC(pc.id) === filtro;
  });

  const contagem = {
    ok: pcs.filter((pc) => getStatusPC(pc.id) === "ok").length,
    em_reparo: pcs.filter((pc) => getStatusPC(pc.id) === "em_reparo").length,
    pronto: pcs.filter((pc) => getStatusPC(pc.id) === "pronto").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 container px-4 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🏢</div>
          <h1 className="font-heading text-3xl font-black mb-2">
            Painel da <span className="text-gradient-neon">Empresa</span>
          </h1>
          <p className="text-muted-foreground text-sm">Digite o código e a senha que a Maker Info te forneceu</p>
        </div>

        {!empresa && (
          <div className="flex flex-col gap-3 mb-8 max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value.toUpperCase())}
                onKeyDown={(event) => event.key === "Enter" && buscar()}
                placeholder="Código  —  Ex: EMP001"
                className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-base focus:outline-none focus:border-primary transition-colors"
                maxLength={20}
              />
            </div>
            <div className="flex gap-3">
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && buscar()}
                placeholder="Senha"
                className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground font-heading font-bold text-base focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={buscar}
                disabled={loading || checkingSession}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading || checkingSession ? "..." : "Entrar"}
              </button>
            </div>
          </div>
        )}

        {erro && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center mb-6">
            {erro}
          </div>
        )}

        {empresa && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading font-black text-2xl text-primary mb-1">{empresa.nome}</h2>
                  <p className="text-sm text-muted-foreground">
                    Plano {empresa.plano} · {pcs.length} computador(es)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs font-heading font-bold hover:bg-[#25D366] hover:text-white transition-all"
                  >
                    <WhatsAppIcon />
                    Falar com técnico
                  </a>
                  <button
                    onClick={sair}
                    className="px-3 py-2 rounded-xl border border-border text-xs font-heading font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>

              <div className="mt-3">
                {alterandoSenha ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={novaSenhaCliente}
                      onChange={(event) => setNovaSenhaCliente(event.target.value)}
                      placeholder="Nova senha"
                      className="px-3 py-1.5 rounded-lg bg-background border border-primary text-sm w-40 focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        if (!novaSenhaCliente.trim()) {
                          return;
                        }

                        try {
                          await api.company.changePassword(novaSenhaCliente.trim().toUpperCase());
                          setAlterandoSenha(false);
                          setNovaSenhaCliente("");
                          setSenhaMsg("Senha alterada com sucesso!");
                          setTimeout(() => setSenhaMsg(""), 4000);
                        } catch (error) {
                          setSenhaMsg(error instanceof Error ? error.message : "Nao foi possivel alterar a senha.");
                        }
                      }}
                      className="text-xs text-primary font-bold px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Salvar
                    </button>
                    <button onClick={() => setAlterandoSenha(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setAlterandoSenha(true)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    🔑 Alterar minha senha
                  </button>
                )}
                {senhaMsg && <p className="text-xs text-green-400 mt-1">{senhaMsg}</p>}
              </div>

              {empresa.proxima_visita &&
                (() => {
                  const dias = diasParaVisita(empresa.proxima_visita);
                  const vencida = dias < 0;
                  const urgente = dias >= 0 && dias <= 5;

                  return (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
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
                        : `Próxima visita em ${dias} dia(s) — ${new Date(empresa.proxima_visita).toLocaleDateString("pt-BR")}`}
                    </div>
                  );
                })()}

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Em funcionamento", valor: contagem.ok, cor: "text-green-400", bg: "bg-green-500/10" },
                  { label: "Em reparo", valor: contagem.em_reparo, cor: "text-amber-400", bg: "bg-amber-500/10" },
                  { label: "Prontos p/ retirada", valor: contagem.pronto, cor: "text-primary", bg: "bg-primary/10" },
                ].map((card, index) => (
                  <div key={index} className={`${card.bg} rounded-xl p-3 text-center`}>
                    <p className={`font-heading font-black text-2xl ${card.cor}`}>{card.valor}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 border-b border-border pb-3">
              {[
                { key: "pcs", label: "🖥️ Computadores" },
                { key: "visitas", label: "📋 Histórico de Visitas" },
              ].map((aba) => (
                <button
                  key={aba.key}
                  onClick={() => setAbaAtiva(aba.key as "pcs" | "visitas")}
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

            {abaAtiva === "pcs" && (
              <div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { key: "todos", label: "Todos" },
                    { key: "ok", label: "✅ OK" },
                    { key: "em_reparo", label: "🔧 Em reparo" },
                    { key: "pronto", label: "📦 Prontos" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setFiltro(item.key as FiltroStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold border transition-all ${
                        filtro === item.key
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {pcsFiltrados.map((pc) => {
                    const pedido = getPedidoDoPC(pc.id);
                    const statusAtual = getStatusPC(pc.id);
                    const badge =
                      statusAtual === "ok"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : statusAtual === "pronto"
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400";

                    return (
                      <div key={pc.id} className="rounded-2xl bg-card border border-border p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-heading font-black">{pc.nome}</p>
                            {pc.setor && <p className="text-xs text-muted-foreground">{pc.setor}</p>}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${badge}`}>
                            {statusAtual === "ok" ? "OK" : statusAtual === "pronto" ? "Pronto" : "Em reparo"}
                          </div>
                        </div>

                        {pedido ? (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-background/60 p-3">
                              <p className="text-xs text-muted-foreground mb-1">Problema</p>
                              <p className="text-sm font-semibold">{pedido.problema}</p>
                            </div>
                            <div className="rounded-xl bg-background/60 p-3">
                              <p className="text-xs text-muted-foreground mb-1">Status do reparo</p>
                              <p className={`text-sm font-semibold ${STATUS_CONFIG[pedido.status].color}`}>
                                {STATUS_CONFIG[pedido.status].emoji} {pedido.status}
                              </p>
                            </div>
                            {pedido.observacao && (
                              <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
                                <p className="text-xs text-muted-foreground mb-1">Observação do técnico</p>
                                <p className="text-sm">{pedido.observacao}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl bg-background/60 p-3 text-sm text-muted-foreground">
                            Nenhum pedido de reparo vinculado a este computador no momento.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {abaAtiva === "visitas" && (
              <div className="space-y-4">
                {visitas.length === 0 && (
                  <div className="rounded-2xl bg-card border border-border p-5 text-sm text-muted-foreground">
                    Ainda nao ha visitas registradas para esta empresa.
                  </div>
                )}

                {visitas.map((visita) => (
                  <div key={visita.id} className="rounded-2xl bg-card border border-border p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading font-black text-lg">
                          {new Date(visita.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visita.data).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {visita.observacao && (
                      <div className="rounded-xl bg-background/60 p-3">
                        <p className="text-xs text-muted-foreground mb-1">Observações</p>
                        <p className="text-sm">{visita.observacao}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {(pcs || []).map((pc) => {
                        const pcChecklist = (visita.checklist as Record<string, Record<string, boolean>>)[pc.id];

                        if (!pcChecklist) {
                          return null;
                        }

                        const feitos = Object.values(pcChecklist).filter(Boolean).length;

                        return (
                          <div key={pc.id} className="rounded-xl bg-background/60 p-3">
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className="font-semibold">{pc.nome}</p>
                              <span className="text-xs text-muted-foreground">
                                {feitos}/{Object.keys(pcChecklist).length} itens
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(pcChecklist).map(([itemKey, done]) => {
                                return (
                                  <span
                                    key={itemKey}
                                    className={`px-2 py-1 rounded-lg text-xs border ${
                                      done
                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                        : "bg-background border-border text-muted-foreground"
                                    }`}
                                  >
                                    {CHECKLIST_LABELS[itemKey] || itemKey}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
