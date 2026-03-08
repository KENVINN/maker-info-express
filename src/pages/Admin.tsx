import { useState, useEffect } from "react";
import { supabase, Pedido, STATUS_CONFIG, StatusPedido } from "@/lib/supabase";

const ADMIN_PASS = "makerinfo2024";
const STATUSES = Object.keys(STATUS_CONFIG) as StatusPedido[];

const gerarCodigo = () => {
  const num = Math.floor(Math.random() * 999) + 1;
  return `MK${String(num).padStart(3, "0")}`;
};

const Admin = () => {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const TODAS_ETAPAS = Object.keys(STATUS_CONFIG) as StatusPedido[];
  const [form, setForm] = useState({ cliente_nome: "", equipamento: "", problema: "", observacao: "", codigo: gerarCodigo(), telefone: "" });
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<StatusPedido[]>(TODAS_ETAPAS);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Pedido>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fotos, setFotos] = useState<Record<string, string[]>>({});
  const [sucesso, setSucesso] = useState("");

  const login = () => {
    if (senha === ADMIN_PASS) {
      setLogado(true);
      sessionStorage.setItem("admin", "1");
    } else {
      setErroLogin("Senha incorreta.");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin")) setLogado(true);
  }, []);

  useEffect(() => {
    if (!logado) return;
    carregarPedidos();
    const channel = supabase
      .channel("admin-pedidos")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pedidos" }, () => carregarPedidos())
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "pedidos" }, () => carregarPedidos())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [logado]);

  const carregarPedidos = async () => {
    setLoading(true);
    const { data } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    if (data) {
      setPedidos(data);
      data.forEach(p => carregarFotos(p.id));
    }
    setLoading(false);
  };

  const criarPedido = async () => {
    if (!form.cliente_nome || !form.equipamento || !form.problema) return;
    setSalvando(true);
    const { error } = await supabase.from("pedidos").insert({ ...form, status: "Em Diagnóstico", etapas: etapasSelecionadas });
    if (!error) {
      setSucesso(`Pedido ${form.codigo} criado!`);
      if (form.telefone) {
        const tel = form.telefone.replace(/\D/g, "");
        const numero = tel.startsWith("55") ? tel : `55${tel}`;
        const msg = encodeURIComponent(
          `🔧 *Maker Info — Seu pedido foi aberto!*\n\nOlá, *${form.cliente_nome}*! Recebemos seu equipamento.\n\nCódigo do seu pedido: *${form.codigo}*\n\nAcompanhe cada etapa do reparo em tempo real pelo link abaixo 👇\nmakerinfo.com.br/pedido`
        );
        window.open(`https://api.whatsapp.com/send/?phone=${numero}&text=${msg}`, "_blank");
      }
      setForm({ cliente_nome: "", equipamento: "", problema: "", observacao: "", codigo: gerarCodigo(), telefone: "" });
      setEtapasSelecionadas(TODAS_ETAPAS);
      setTimeout(() => setSucesso(""), 5000);
    }
    setSalvando(false);
  };

  const notificarCliente = (telefone: string, codigo: string, status: string) => {
    if (!telefone) return;
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
      "Entregue": "🎉",
    };
    const msg = encodeURIComponent(
      `${emoji[status] || "🔧"} *Maker Info — Atualização do seu pedido*\n\nCódigo: *${codigo}*\nStatus: *${status}*\n\nAcompanhe em tempo real:\nmakerinfo.com.br/pedido`
    );
    window.open(`https://api.whatsapp.com/send/?phone=${numero}&text=${msg}`, "_blank");
  };

    const atualizarStatus = async (id: string, status: StatusPedido) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    await supabase.from("pedidos").update({ status }).eq("id", id);
    const pedido = pedidos.find(p => p.id === id);
    if (pedido?.telefone) notificarCliente(pedido.telefone, pedido.codigo, status);
  };

  const atualizarObservacao = async (id: string, observacao: string) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, observacao } : p));
    await supabase.from("pedidos").update({ observacao }).eq("id", id);
  };

  const carregarFotos = async (pedidoId: string) => {
    const { data } = await supabase.storage.from("pedidos").list(pedidoId, { sortBy: { column: "created_at", order: "desc" } });
    if (data && data.length > 0) {
      const ts = Date.now();
      const urls = data.map(f =>
        supabase.storage.from("pedidos").getPublicUrl(`${pedidoId}/${f.name}`).data.publicUrl + `?t=${ts}`
      );
      setFotos(prev => ({ ...prev, [pedidoId]: urls }));
    } else {
      setFotos(prev => ({ ...prev, [pedidoId]: [] }));
    }
  };

  const handleUpload = async (pedidoId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingId(pedidoId);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const nome = `${Date.now()}.${ext}`;
      await supabase.storage.from("pedidos").upload(`${pedidoId}/${nome}`, file);
    }
    await carregarFotos(pedidoId);
    await supabase.from("pedidos").update({ fotos_updated_at: new Date().toISOString() }).eq("id", pedidoId);
    setUploadingId(null);
  };

  const deletarFoto = async (pedidoId: string, url: string) => {
    const partes = url.split(`${pedidoId}/`);
    const nome = partes[1]?.split("?")[0];
    if (!nome) return;
    await supabase.storage.from("pedidos").remove([`${pedidoId}/${nome}`]);
    setFotos(prev => ({ ...prev, [pedidoId]: prev[pedidoId].filter(u => u !== url) }));
    await supabase.from("pedidos").update({ fotos_updated_at: new Date().toISOString() }).eq("id", pedidoId);
  };

  const abrirEdicao = (p: Pedido) => {
    setEditando(p.id);
    setEditForm({ cliente_nome: p.cliente_nome, equipamento: p.equipamento, problema: p.problema, telefone: p.telefone });
  };

  const salvarEdicao = async (id: string) => {
    await supabase.from("pedidos").update(editForm).eq("id", id);
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, ...editForm } : p));
    setEditando(null);
  };

  const deletarPedido = async (id: string) => {
    if (!confirm("Deletar este pedido?")) return;
    await supabase.from("pedidos").delete().eq("id", id);
  };

  if (!logado) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="font-heading text-2xl font-black mb-6">Painel Admin</h1>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Senha"
          className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground mb-3 focus:outline-none focus:border-primary"
        />
        {erroLogin && <p className="text-destructive text-sm mb-3">{erroLogin}</p>}
        <button onClick={login} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:brightness-110 transition-all">
          Entrar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-black">Painel <span className="text-gradient-neon">Maker Info</span></h1>
            <p className="text-muted-foreground text-sm">{pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} no sistema</p>
          </div>
          <button onClick={() => { setLogado(false); sessionStorage.removeItem("admin"); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sair
          </button>
        </div>

        {/* Novo pedido */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-heading font-black text-lg mb-4">➕ Novo Pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Código</label>
              <input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground font-heading font-bold focus:outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Nome do cliente *</label>
              <input value={form.cliente_nome} onChange={e => setForm(f => ({ ...f, cliente_nome: e.target.value }))}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Telefone (WhatsApp)</label>
              <input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                placeholder="Ex: 65999999999"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Equipamento *</label>
              <input value={form.equipamento} onChange={e => setForm(f => ({ ...f, equipamento: e.target.value }))}
                placeholder="Ex: Notebook Dell Inspiron"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Problema *</label>
              <input value={form.problema} onChange={e => setForm(f => ({ ...f, problema: e.target.value }))}
                placeholder="Ex: Lento, não liga"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm" />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs text-muted-foreground mb-1 block">Observação (opcional)</label>
            <input value={form.observacao} onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))}
              placeholder="Ex: Aguardando peça"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary text-sm" />
          </div>
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">Etapas do serviço (desmarque as que não se aplicam)</label>
            <div className="flex flex-wrap gap-2">
              {TODAS_ETAPAS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEtapasSelecionadas(prev =>
                    prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
                  )}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all border ${
                    etapasSelecionadas.includes(e)
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground opacity-40"
                  }`}
                >
                  {STATUS_CONFIG[e].emoji} {e}
                </button>
              ))}
            </div>
          </div>
          {sucesso && <p className="text-green-500 text-sm mb-3 font-semibold">✓ {sucesso}</p>}
          <button onClick={criarPedido} disabled={salvando}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50">
            {salvando ? "Salvando..." : "Criar Pedido"}
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          <h2 className="font-heading font-black text-lg">📋 Pedidos</h2>
          {loading && <p className="text-muted-foreground text-sm">Carregando...</p>}
          {pedidos.map(p => {
            const cfg = STATUS_CONFIG[p.status as StatusPedido];
            return (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="font-heading font-black text-primary text-lg">{p.codigo}</span>
                    <span className="text-muted-foreground text-sm ml-2">· {p.cliente_nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${cfg?.color}`}>{cfg?.emoji} {p.status}</span>
                    <button onClick={() => abrirEdicao(p)} className="text-muted-foreground hover:text-primary transition-colors text-xs">✏️</button>
                    <button onClick={() => deletarPedido(p.id)} className="text-muted-foreground hover:text-destructive transition-colors text-xs">🗑️</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div><span className="text-muted-foreground">Equipamento: </span>{p.equipamento}</div>
                  <div><span className="text-muted-foreground">Problema: </span>{p.problema}</div>
                  {p.telefone && <div><span className="text-muted-foreground">WhatsApp: </span>{p.telefone}</div>}
                </div>

                {/* Status buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => atualizarStatus(p.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${p.status === s ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                      {STATUS_CONFIG[s].emoji} {s}
                    </button>
                  ))}
                </div>

                {editando === p.id && (
                  <div className="mt-3 p-4 rounded-xl bg-background border border-primary/30 space-y-2">
                    <p className="text-xs text-primary font-semibold mb-2">✏️ Editando pedido</p>
                    <input value={editForm.cliente_nome || ""} onChange={e => setEditForm(f => ({ ...f, cliente_nome: e.target.value }))}
                      placeholder="Nome do cliente"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary" />
                    <input value={editForm.equipamento || ""} onChange={e => setEditForm(f => ({ ...f, equipamento: e.target.value }))}
                      placeholder="Equipamento"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary" />
                    <input value={editForm.problema || ""} onChange={e => setEditForm(f => ({ ...f, problema: e.target.value }))}
                      placeholder="Problema"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary" />
                    <input value={editForm.telefone || ""} onChange={e => setEditForm(f => ({ ...f, telefone: e.target.value }))}
                      placeholder="WhatsApp (ex: 65999999999)"
                      className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary" />
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => salvarEdicao(p.id)} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-heading font-bold hover:brightness-110 transition-all">Salvar</button>
                      <button onClick={() => setEditando(null)} className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs font-heading font-bold hover:border-primary transition-all">Cancelar</button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <input
                    defaultValue={p.observacao || ""}
                    placeholder="Observação para o cliente..."
                    onBlur={e => atualizarObservacao(p.id, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Fotos */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-semibold">📸 Fotos / Vídeos</p>
                    <label className={`px-3 py-1 rounded-lg text-xs font-heading font-bold cursor-pointer transition-all border ${uploadingId === p.id ? "opacity-50" : "border-primary/40 text-primary hover:bg-primary/10"}`}>
                      {uploadingId === p.id ? "Enviando..." : "+ Adicionar"}
                      <input type="file" accept="image/*,video/*" multiple className="hidden"
                        onChange={e => handleUpload(p.id, e.target.files)}
                        disabled={uploadingId === p.id} />
                    </label>
                  </div>
                  {fotos[p.id] && fotos[p.id].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {fotos[p.id].map((url, i) => (
                        <div key={i} className="relative group">
                          {url.match(/\.(mp4|mov|webm)$/i) ? (
                            <video src={url} className="w-20 h-20 object-cover rounded-lg border border-border" controls />
                          ) : (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-80 transition-all" />
                            </a>
                          )}
                          <button onClick={() => deletarFoto(p.id, url)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs hidden group-hover:flex items-center justify-center">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Criado em {new Date(p.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            );
          })}
          {!loading && pedidos.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">Nenhum pedido ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
