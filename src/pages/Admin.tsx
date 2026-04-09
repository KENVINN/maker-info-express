import { useCallback, useEffect, useState } from "react";

import AdminEmpresas from "@/components/AdminEmpresas";
import AdminLeads from "@/components/AdminLeads";
import { api, type Lead } from "@/lib/api";
import { Pedido, STATUS_CONFIG, type StatusPedido } from "@/lib/pedidos";

const STATUSES = Object.keys(STATUS_CONFIG) as StatusPedido[];

const gerarCodigo = () => {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  return `MK${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

const Admin = () => {
  const [logado, setLogado] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [erroOperacao, setErroOperacao] = useState("");
  const [abaAdmin, setAbaAdmin] = useState<"pedidos" | "empresas" | "leads">("pedidos");
  const [empresasPrefill, setEmpresasPrefill] = useState<{ nome: string; contato_nome: string; contato_telefone: string } | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const todasEtapas = Object.keys(STATUS_CONFIG) as StatusPedido[];
  const [form, setForm] = useState({
    cliente_nome: "",
    equipamento: "",
    problema: "",
    observacao: "",
    codigo: gerarCodigo(),
    telefone: "",
    valor: "",
    bairro: "",
  });
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<StatusPedido[]>(todasEtapas);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    cliente_nome: "",
    equipamento: "",
    problema: "",
    telefone: "",
    valor: "",
    bairro: "",
  });
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let active = true;

    api.admin
      .session()
      .then(() => {
        if (active) {
          setLogado(true);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setVerificandoSessao(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const mostrarErro = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Nao foi possivel concluir a operacao.";
    setErroOperacao(message);
    setTimeout(() => setErroOperacao(""), 5000);
  };

  const substituirPedido = (pedidoAtualizado: Pedido) => {
    setPedidos((current) =>
      current.map((pedido) => (pedido.id === pedidoAtualizado.id ? { ...pedido, ...pedidoAtualizado } : pedido)),
    );
  };

  const carregarPedidos = useCallback(async () => {
    setLoading(true);

    try {
      const { pedidos: loadedPedidos } = await api.admin.listPedidos();
      setPedidos(loadedPedidos);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!logado) {
      return;
    }

    carregarPedidos();
    const intervalId = window.setInterval(carregarPedidos, 20000);
    return () => window.clearInterval(intervalId);
  }, [carregarPedidos, logado]);

  const login = async () => {
    try {
      await api.admin.login(senha);
      setLogado(true);
      setErroLogin("");
    } catch (error) {
      setErroLogin(error instanceof Error ? error.message : "Senha incorreta.");
    }
  };

  const logout = async () => {
    try {
      await api.admin.logout();
    } catch {
      // Se a sessao ja expirou, ainda limpamos o estado local.
    }

    setLogado(false);
    setSenha("");
  };

  const criarPedido = async () => {
    if (!form.cliente_nome || !form.equipamento || !form.problema) {
      return;
    }

    setSalvando(true);

    try {
      const { pedido } = await api.admin.createPedido({
        ...form,
        valor: parseFloat(form.valor.replace(",", ".")) || 0,
        etapas: etapasSelecionadas,
      });

      setPedidos((current) => [pedido, ...current]);
      setSucesso(`Pedido ${pedido.codigo} criado!`);

      if (form.telefone) {
        const tel = form.telefone.replace(/\D/g, "");
        const numero = tel.startsWith("55") ? tel : `55${tel}`;
        const msg = encodeURIComponent(
          `🔧 *Maker Info — Seu pedido foi aberto!*\n\nOlá, *${form.cliente_nome}*! Recebemos seu equipamento.\n\nCódigo do seu pedido: *${pedido.codigo}*\n\nAcompanhe cada etapa do reparo em tempo real pelo link abaixo 👇\nmakerinfo.com.br/pedido`,
        );
        window.open(`https://api.whatsapp.com/send/?phone=${numero}&text=${msg}`, "_blank");
      }

      setForm({
        cliente_nome: "",
        equipamento: "",
        problema: "",
        observacao: "",
        codigo: gerarCodigo(),
        telefone: "",
        valor: "",
        bairro: "",
      });
      setEtapasSelecionadas(todasEtapas);
      setTimeout(() => setSucesso(""), 5000);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setSalvando(false);
    }
  };

  const notificarCliente = (telefone: string, codigo: string, status: string) => {
    if (!telefone) {
      return;
    }

    const tel = telefone.replace(/\D/g, "");
    const numero = tel.startsWith("55") ? tel : `55${tel}`;
    const emoji: Record<string, string> = {
      "Em Diagnóstico": "🔍",
      "Limpeza / Formatação": "🧹",
      "Peça Solicitada": "📦",
      "Em Reparo": "🔧",
      "Testes Finais": "🧪",
      "Pronto para Retirada": "✅",
      "Saída para Entrega": "🛵",
      Entregue: "🎉",
    };
    const msg = encodeURIComponent(
      `${emoji[status] || "🔧"} *Maker Info — Atualização do seu pedido*\n\nCódigo: *${codigo}*\nStatus: *${status}*\n\nAcompanhe em tempo real:\nmakerinfo.com.br/pedido`,
    );

    window.open(`https://api.whatsapp.com/send/?phone=${numero}&text=${msg}`, "_blank");
  };

  const atualizarStatus = async (id: string, status: StatusPedido) => {
    const pedidoAtual = pedidos.find((pedido) => pedido.id === id);

    try {
      const { pedido } = await api.admin.updatePedidoStatus(id, status);
      substituirPedido(pedido);

      if (pedidoAtual?.telefone) {
        notificarCliente(pedidoAtual.telefone, pedidoAtual.codigo, status);
      }
    } catch (error) {
      mostrarErro(error);
    }
  };

  const atualizarObservacao = async (id: string, observacao: string) => {
    try {
      const { pedido } = await api.admin.updatePedidoObservacao(id, observacao);
      substituirPedido(pedido);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const handleUpload = async (pedidoId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setUploadingId(pedidoId);

    try {
      const { pedido } = await api.admin.uploadPedidoAssets(pedidoId, files);
      substituirPedido(pedido);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setUploadingId(null);
    }
  };

  const deletarFoto = async (pedidoId: string, url: string) => {
    try {
      const { pedido } = await api.admin.deletePedidoAsset(pedidoId, url);
      substituirPedido(pedido);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const abrirEdicao = (pedido: Pedido) => {
    setEditando(pedido.id);
    setEditForm({
      cliente_nome: pedido.cliente_nome || "",
      equipamento: pedido.equipamento || "",
      problema: pedido.problema || "",
      telefone: pedido.telefone || "",
      valor: pedido.valor?.toString() || "",
      bairro: pedido.bairro || "",
    });
  };

  const salvarEdicao = async (id: string) => {
    try {
      const { pedido } = await api.admin.updatePedido(id, {
        ...editForm,
        valor: parseFloat(editForm.valor.replace(",", ".")) || 0,
      });
      substituirPedido(pedido);
      setEditando(null);
    } catch (error) {
      mostrarErro(error);
    }
  };

  const deletarPedido = async (id: string) => {
    if (!confirm("Deletar este pedido?")) {
      return;
    }

    try {
      await api.admin.deletePedido(id);
      setPedidos((current) => current.filter((pedido) => pedido.id !== id));
    } catch (error) {
      mostrarErro(error);
    }
  };

  if (verificandoSessao) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="font-heading text-2xl font-black mb-2">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!logado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="font-heading text-2xl font-black mb-6">Painel Admin</h1>
          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && login()}
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground mb-3 focus:outline-none focus:border-primary"
          />
          {erroLogin && <p className="text-destructive text-sm mb-3">{erroLogin}</p>}
          <button
            onClick={login}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-black">
              Painel <span className="text-gradient-neon">Maker Info</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} no sistema
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="text-sm text-primary hover:brightness-110 transition-colors px-4 py-2 rounded-lg border border-primary/30"
            >
              📊 Dashboard
            </button>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg border border-border"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border pb-4 flex-wrap">
          <button
            onClick={() => setAbaAdmin("pedidos")}
            className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all ${
              abaAdmin === "pedidos"
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            🔧 Pedidos ({pedidos.length})
          </button>
          <button
            onClick={() => setAbaAdmin("empresas")}
            className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all ${
              abaAdmin === "empresas"
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            🏢 Empresas
          </button>
          <button
            onClick={() => setAbaAdmin("leads")}
            className={`px-6 py-2.5 rounded-lg font-heading font-bold text-sm transition-all ${
              abaAdmin === "leads"
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            📋 Leads B2B
          </button>
        </div>

        {sucesso && <p className="text-green-500 text-sm mb-4 font-semibold">✓ {sucesso}</p>}
        {erroOperacao && <p className="text-destructive text-sm mb-4 font-semibold">{erroOperacao}</p>}

        {abaAdmin === "pedidos" && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-black text-lg mb-4">➕ Novo Pedido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Código</label>
                  <input
                    value={form.codigo}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, codigo: event.target.value.toUpperCase() }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground font-heading font-bold focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome do cliente *</label>
                  <input
                    value={form.cliente_nome}
                    onChange={(event) => setForm((current) => ({ ...current, cliente_nome: event.target.value }))}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Telefone (WhatsApp)</label>
                  <input
                    value={form.telefone}
                    onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))}
                    placeholder="Ex: 65999999999"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Equipamento *</label>
                  <input
                    value={form.equipamento}
                    onChange={(event) => setForm((current) => ({ ...current, equipamento: event.target.value }))}
                    placeholder="Ex: Notebook Dell Inspiron"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Bairro</label>
                  <input
                    value={form.bairro}
                    onChange={(event) => setForm((current) => ({ ...current, bairro: event.target.value }))}
                    placeholder="Ex: Cristo Rei"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Problema *</label>
                  <input
                    value={form.problema}
                    onChange={(event) => setForm((current) => ({ ...current, problema: event.target.value }))}
                    placeholder="Ex: Lento, não liga"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Valor do Serviço (R$)</label>
                  <input
                    value={form.valor}
                    onChange={(event) => setForm((current) => ({ ...current, valor: event.target.value }))}
                    placeholder="Ex: 120,00"
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Observação (opcional)</label>
                <input
                  value={form.observacao}
                  onChange={(event) => setForm((current) => ({ ...current, observacao: event.target.value }))}
                  placeholder="Ex: Aguardando peça"
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-2 block">
                  Etapas do serviço (desmarque as que não se aplicam)
                </label>
                <div className="flex flex-wrap gap-2">
                  {todasEtapas.map((etapa) => (
                    <button
                      key={etapa}
                      type="button"
                      onClick={() =>
                        setEtapasSelecionadas((current) =>
                          current.includes(etapa) ? current.filter((value) => value !== etapa) : [...current, etapa],
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all border ${
                        etapasSelecionadas.includes(etapa)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background border-border text-muted-foreground opacity-40"
                      }`}
                    >
                      {STATUS_CONFIG[etapa].emoji} {etapa}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={criarPedido}
                disabled={salvando}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Criar Pedido"}
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading font-black text-lg">📋 Pedidos</h2>
              {loading && <p className="text-muted-foreground text-sm">Carregando...</p>}
              {pedidos.map((pedido) => {
                const config = STATUS_CONFIG[pedido.status as StatusPedido];

                return (
                  <div key={pedido.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="font-heading font-black text-primary text-lg">{pedido.codigo}</span>
                        <span className="text-muted-foreground text-sm ml-2">· {pedido.cliente_nome}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${config?.color}`}>
                          {config?.emoji} {pedido.status}
                        </span>
                        <button onClick={() => abrirEdicao(pedido)} className="text-muted-foreground hover:text-primary transition-colors text-xs">
                          ✏️
                        </button>
                        <button onClick={() => deletarPedido(pedido.id)} className="text-muted-foreground hover:text-destructive transition-colors text-xs">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Equipamento: </span>
                        {pedido.equipamento}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Problema: </span>
                        {pedido.problema}
                      </div>
                      {pedido.telefone && (
                        <div>
                          <span className="text-muted-foreground">WhatsApp: </span>
                          {pedido.telefone}
                        </div>
                      )}
                      {pedido.bairro && (
                        <div>
                          <span className="text-muted-foreground">Bairro: </span>
                          {pedido.bairro}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => atualizarStatus(pedido.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                            pedido.status === status
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}
                        >
                          {STATUS_CONFIG[status].emoji} {status}
                        </button>
                      ))}
                    </div>
                    {editando === pedido.id && (
                      <div className="mt-3 p-4 rounded-xl bg-background border border-primary/30 space-y-2">
                        <p className="text-xs text-primary font-semibold mb-2">✏️ Editando pedido</p>
                        <input
                          value={editForm.cliente_nome}
                          onChange={(event) => setEditForm((current) => ({ ...current, cliente_nome: event.target.value }))}
                          placeholder="Nome do cliente"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          value={editForm.equipamento}
                          onChange={(event) => setEditForm((current) => ({ ...current, equipamento: event.target.value }))}
                          placeholder="Equipamento"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          value={editForm.problema}
                          onChange={(event) => setEditForm((current) => ({ ...current, problema: event.target.value }))}
                          placeholder="Problema"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          value={editForm.telefone}
                          onChange={(event) => setEditForm((current) => ({ ...current, telefone: event.target.value }))}
                          placeholder="WhatsApp"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          value={editForm.valor}
                          onChange={(event) => setEditForm((current) => ({ ...current, valor: event.target.value }))}
                          placeholder="Valor (ex: 120,00)"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <input
                          value={editForm.bairro}
                          onChange={(event) => setEditForm((current) => ({ ...current, bairro: event.target.value }))}
                          placeholder="Bairro"
                          className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => salvarEdicao(pedido.id)}
                            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-heading font-bold hover:brightness-110 transition-all"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditando(null)}
                            className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs font-heading font-bold hover:border-primary transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <input
                        defaultValue={pedido.observacao || ""}
                        placeholder="Observação para o cliente..."
                        onBlur={(event) => atualizarObservacao(pedido.id, event.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground font-semibold">📸 Fotos / Vídeos</p>
                        <label
                          className={`px-3 py-1 rounded-lg text-xs font-heading font-bold cursor-pointer transition-all border ${
                            uploadingId === pedido.id ? "opacity-50" : "border-primary/40 text-primary hover:bg-primary/10"
                          }`}
                        >
                          {uploadingId === pedido.id ? "Enviando..." : "+ Adicionar"}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(event) => handleUpload(pedido.id, event.target.files)}
                            disabled={uploadingId === pedido.id}
                          />
                        </label>
                      </div>
                      {(pedido.fotos_urls || []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(pedido.fotos_urls || []).map((url, index) => (
                            <div key={index} className="relative group">
                              {url.match(/\.(mp4|mov|webm)$/i) ? (
                                <video src={url} className="w-20 h-20 object-cover rounded-lg border border-border" controls />
                              ) : (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={url}
                                    alt=""
                                    className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-80 transition-all"
                                  />
                                </a>
                              )}
                              <button
                                onClick={() => deletarFoto(pedido.id, url)}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs hidden group-hover:flex items-center justify-center"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Criado em {new Date(pedido.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                );
              })}
              {!loading && pedidos.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">Nenhum pedido ainda.</p>
              )}
            </div>
          </div>
        )}

        {abaAdmin === "empresas" && (
          <AdminEmpresas
            prefill={empresasPrefill}
            onPrefillConsumed={() => setEmpresasPrefill(null)}
          />
        )}

        {abaAdmin === "leads" && (
          <AdminLeads
            onConverterEmpresa={(lead: Lead) => {
              setEmpresasPrefill({
                nome: lead.nome_empresa,
                contato_nome: lead.contato_nome,
                contato_telefone: lead.contato_telefone,
              });
              setAbaAdmin("empresas");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
