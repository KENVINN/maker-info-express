import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from "bcryptjs";
import express from "express";
import multer from "multer";
import { z } from "zod";

import { env } from "./env.js";
import {
  HttpError,
  asyncHandler,
  createRateLimiter,
  handleError,
  normalizeCompanyPassword,
  requireAllowedOrigin,
  requireSession,
  sanitizeEmpresaForAdmin,
  sanitizeEmpresaForClient,
  sanitizePublicPedido,
} from "./security.js";
import { clearSessionCookie, setSessionCookie } from "./session.js";
import { supabase } from "./supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_LIST = [
  "Em Diagnóstico",
  "Limpeza / Formatação",
  "Peça Solicitada",
  "Em Reparo",
  "Testes Finais",
  "Pronto para Retirada",
  "Saída para Entrega",
  "Entregue",
];

const statusSchema = z.enum(STATUS_LIST);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 6,
    fileSize: 25 * 1024 * 1024,
  },
});

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
});

const trackingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: "Muitas consultas em pouco tempo. Aguarde um pouco e tente novamente.",
});

const waitlistLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Limite de cadastros temporariamente atingido. Tente novamente mais tarde.",
});

const leadsLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Limite de contatos temporariamente atingido. Tente novamente mais tarde.",
});

const adminLoginSchema = z.object({
  password: z.string().trim().min(1).max(200),
});

const companyLoginSchema = z.object({
  codigo: z.string().trim().toUpperCase().min(3).max(20).regex(/^[A-Z0-9-]+$/),
  senha: z.string().trim().min(1).max(80),
});

const companyPasswordSchema = z.object({
  password: z.string().trim().min(6).max(40),
});

const pedidoCreateSchema = z.object({
  cliente_nome: z.string().trim().min(1).max(120),
  equipamento: z.string().trim().min(1).max(160),
  problema: z.string().trim().min(1).max(500),
  observacao: z.string().trim().max(1000).optional().default(""),
  codigo: z.string().trim().toUpperCase().max(20).regex(/^[A-Z0-9-]+$/).optional(),
  telefone: z.string().trim().max(25).optional().default(""),
  valor: z.coerce.number().min(0).max(1000000).optional().default(0),
  bairro: z.string().trim().max(120).optional().default(""),
  etapas: z.array(statusSchema).min(1).max(STATUS_LIST.length).optional().default(STATUS_LIST),
  empresa_id: z.string().trim().uuid().optional().nullable(),
  pc_id: z.string().trim().uuid().optional().nullable(),
});

const pedidoEditSchema = z
  .object({
    cliente_nome: z.string().trim().min(1).max(120).optional(),
    equipamento: z.string().trim().min(1).max(160).optional(),
    problema: z.string().trim().min(1).max(500).optional(),
    telefone: z.string().trim().max(25).optional(),
    valor: z.coerce.number().min(0).max(1000000).optional(),
    bairro: z.string().trim().max(120).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Nenhum campo valido informado para edicao.",
  });

const observacaoSchema = z.object({
  observacao: z.string().trim().max(1000).optional().default(""),
});

const custoSchema = z.object({
  data: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  descricao: z.string().trim().min(1).max(200),
  valor: z.coerce.number().min(0).max(1000000),
  categoria: z.string().trim().min(1).max(80),
});

const empresaSchema = z.object({
  nome: z.string().trim().min(1).max(160),
  contato_nome: z.string().trim().max(120).optional().default(""),
  contato_telefone: z.string().trim().max(25).optional().default(""),
  plano: z.enum(["Pequeno", "Médio", "Grande"]),
  proxima_visita: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  codigo: z.string().trim().toUpperCase().max(20).regex(/^[A-Z0-9-]+$/).optional(),
  senha: z.string().trim().min(6).max(40).optional(),
});

const pcSchema = z.object({
  nome: z.string().trim().min(1).max(160),
  setor: z.string().trim().max(120).optional().default(""),
});

const visitaSchema = z.object({
  observacao: z.string().trim().max(2000).optional().default(""),
  checklist: z.record(z.record(z.boolean())),
});

const waitlistSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(120).optional().nullable(),
  wants_tester_access: z.boolean(),
  wants_launch_updates: z.boolean(),
  source: z.string().trim().max(120).optional().default("makergym-landing"),
});

const leadPublicSchema = z.object({
  nome_empresa: z.string().trim().min(1).max(160),
  contato_nome: z.string().trim().max(120).optional().default(""),
  contato_telefone: z.string().trim().min(8).max(25),
  qtd_pcs: z.string().trim().max(30).optional().default(""),
});

const leadAdminUpdateSchema = z
  .object({
    status: z.enum(["novo", "contatado", "visita_agendada", "proposta_enviada", "fechado", "perdido"]).optional(),
    observacao: z.string().trim().max(500).optional(),
  })
  .refine((v) => v.status !== undefined || v.observacao !== undefined, {
    message: "Informe status ou observacao.",
  });

function normalizeOptionalValue(value) {
  return value ? value : null;
}

function unwrap(result, message, status = 500) {
  if (result.error) {
    throw new HttpError(status, message);
  }

  return result.data;
}

function generateOrderCode() {
  return `MK${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function generateCompanyCode() {
  return `EMP${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

function generateCompanyPassword() {
  return crypto.randomBytes(4).toString("base64url").slice(0, 8).toUpperCase();
}

function isHashedPassword(value = "") {
  return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
}

function getStoragePathFromUrl(url, pedidoId) {
  const parsed = new URL(url);
  const marker = "/storage/v1/object/public/pedidos/";
  const markerIndex = parsed.pathname.indexOf(marker);

  if (markerIndex === -1) {
    throw new HttpError(400, "URL de arquivo invalida.");
  }

  const storagePath = decodeURIComponent(parsed.pathname.slice(markerIndex + marker.length));

  if (!storagePath.startsWith(`${pedidoId}/`)) {
    throw new HttpError(400, "Arquivo nao pertence ao pedido informado.");
  }

  return storagePath;
}

async function getPedidoById(id) {
  const result = await supabase.from("pedidos").select("*").eq("id", id).single();
  return unwrap(result, "Pedido nao encontrado.", 404);
}

async function getEmpresaDashboard(empresaId) {
  const [empresaResult, pcsResult, pedidosResult, visitasResult] = await Promise.all([
    supabase.from("empresas").select("*").eq("id", empresaId).single(),
    supabase.from("pcs_empresa").select("*").eq("empresa_id", empresaId).order("created_at"),
    supabase.from("pedidos").select("*").eq("empresa_id", empresaId).order("created_at", { ascending: false }),
    supabase.from("visitas_empresa").select("*").eq("empresa_id", empresaId).order("data", { ascending: false }),
  ]);

  const empresa = sanitizeEmpresaForClient(unwrap(empresaResult, "Empresa nao encontrada.", 404));

  return {
    empresa,
    pcs: unwrap(pcsResult, "Nao foi possivel carregar os computadores."),
    pedidos: unwrap(pedidosResult, "Nao foi possivel carregar os pedidos."),
    visitas: unwrap(visitasResult, "Nao foi possivel carregar as visitas."),
  };
}

async function getEmpresasForAdmin() {
  const empresasResult = await supabase.from("empresas").select("*").order("created_at", { ascending: false });
  const empresas = unwrap(empresasResult, "Nao foi possivel carregar as empresas.");

  if (empresas.length === 0) {
    return [];
  }

  const pcsResult = await supabase
    .from("pcs_empresa")
    .select("*")
    .in(
      "empresa_id",
      empresas.map((empresa) => empresa.id),
    )
    .order("created_at");

  const pcs = unwrap(pcsResult, "Nao foi possivel carregar os computadores.");
  const pcsByEmpresa = pcs.reduce((acc, pc) => {
    if (!acc[pc.empresa_id]) {
      acc[pc.empresa_id] = [];
    }

    acc[pc.empresa_id].push(pc);
    return acc;
  }, {});

  return empresas.map((empresa) => ({
    ...sanitizeEmpresaForAdmin(empresa),
    pcs: pcsByEmpresa[empresa.id] || [],
  }));
}

async function updateCompanyPassword(empresaId, password) {
  const normalizedPassword = normalizeCompanyPassword(password);
  const hashedPassword = await bcrypt.hash(normalizedPassword, 12);

  const result = await supabase
    .from("empresas")
    .update({ senha: hashedPassword })
    .eq("id", empresaId)
    .select("*")
    .single();

  return sanitizeEmpresaForAdmin(unwrap(result, "Nao foi possivel atualizar a senha da empresa."));
}

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store");
  }

  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(requireAllowedOrigin);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/auth/admin/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { password } = adminLoginSchema.parse(req.body);
    const validPasswords = [env.adminPassword, env.dashboardPassword].filter(Boolean);

    if (!validPasswords.includes(password)) {
      throw new HttpError(401, "Senha incorreta.");
    }

    setSessionCookie(res, { role: "admin" });
    res.json({ authenticated: true });
  }),
);

app.get(
  "/api/auth/admin/session",
  requireSession("admin"),
  asyncHandler(async (_req, res) => {
    res.json({ authenticated: true });
  }),
);

app.post("/api/auth/admin/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

app.post(
  "/api/auth/company/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { codigo, senha } = companyLoginSchema.parse(req.body);
    const empresaResult = await supabase.from("empresas").select("*").eq("codigo", codigo).single();
    const empresa = unwrap(empresaResult, "Codigo ou senha invalidos.", 401);

    if (!empresa?.senha) {
      throw new HttpError(401, "Empresa sem senha configurada. Solicite uma nova senha a Maker Info.");
    }

    const normalizedPassword = normalizeCompanyPassword(senha);
    let passwordMatches = false;

    if (isHashedPassword(empresa.senha)) {
      passwordMatches = await bcrypt.compare(normalizedPassword, empresa.senha);
    } else {
      passwordMatches = empresa.senha.toUpperCase() === normalizedPassword;

      if (passwordMatches) {
        await updateCompanyPassword(empresa.id, normalizedPassword);
      }
    }

    if (!passwordMatches) {
      throw new HttpError(401, "Codigo ou senha invalidos.");
    }

    setSessionCookie(res, {
      role: "company",
      companyId: empresa.id,
      companyCode: empresa.codigo,
    });

    res.json(await getEmpresaDashboard(empresa.id));
  }),
);

app.get(
  "/api/auth/company/session",
  requireSession("company"),
  asyncHandler(async (req, res) => {
    res.json(await getEmpresaDashboard(req.session.companyId));
  }),
);

app.post("/api/auth/company/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

app.post(
  "/api/company/change-password",
  requireSession("company"),
  asyncHandler(async (req, res) => {
    const { password } = companyPasswordSchema.parse(req.body);
    await updateCompanyPassword(req.session.companyId, password);
    res.json({ ok: true });
  }),
);

app.get(
  "/api/tracking/pedidos/:codigo",
  trackingLimiter,
  asyncHandler(async (req, res) => {
    const codigo = z
      .string()
      .trim()
      .toUpperCase()
      .min(3)
      .max(20)
      .regex(/^[A-Z0-9-]+$/)
      .parse(req.params.codigo);

    const result = await supabase
      .from("pedidos")
      .select(
        "id,codigo,cliente_nome,equipamento,problema,status,observacao,etapas,historico,fotos_urls,created_at,updated_at",
      )
      .eq("codigo", codigo)
      .single();

    const pedido = unwrap(result, "Codigo nao encontrado. Verifique e tente novamente.", 404);

    res.json({ pedido: sanitizePublicPedido(pedido) });
  }),
);

app.post(
  "/api/waitlist",
  waitlistLimiter,
  asyncHandler(async (req, res) => {
    const payload = waitlistSchema.parse(req.body);
    const result = await supabase.from("maker_gym_waitlist").insert({
      email: payload.email.toLowerCase(),
      name: normalizeOptionalValue(payload.name?.trim() || ""),
      wants_tester_access: payload.wants_tester_access,
      wants_launch_updates: payload.wants_launch_updates,
      source: payload.source,
    });

    if (result.error?.code === "23505") {
      throw new HttpError(409, "Esse e-mail ja esta na lista.");
    }

    unwrap(result, "Nao foi possivel salvar o cadastro na waitlist.");
    res.status(201).json({ ok: true });
  }),
);

app.post(
  "/api/leads",
  leadsLimiter,
  asyncHandler(async (req, res) => {
    const payload = leadPublicSchema.parse(req.body);
    const result = await supabase
      .from("leads_b2b")
      .insert({
        nome_empresa: payload.nome_empresa,
        contato_nome: payload.contato_nome,
        contato_telefone: payload.contato_telefone,
        qtd_pcs: payload.qtd_pcs,
      })
      .select("id")
      .single();

    unwrap(result, "Nao foi possivel enviar o contato. Tente pelo WhatsApp.");
    res.status(201).json({ ok: true });
  }),
);

app.get(
  "/api/admin/leads",
  requireSession("admin"),
  asyncHandler(async (_req, res) => {
    const result = await supabase.from("leads_b2b").select("*").order("created_at", { ascending: false });
    res.json({ leads: unwrap(result, "Nao foi possivel carregar os leads.") });
  }),
);

app.patch(
  "/api/admin/leads/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = leadAdminUpdateSchema.parse(req.body);
    const update = { updated_at: new Date().toISOString() };

    if (payload.status !== undefined) update.status = payload.status;
    if (payload.observacao !== undefined) update.observacao = payload.observacao;

    const result = await supabase.from("leads_b2b").update(update).eq("id", req.params.id).select("*").single();
    res.json({ lead: unwrap(result, "Nao foi possivel atualizar o lead.") });
  }),
);

app.delete(
  "/api/admin/leads/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const result = await supabase.from("leads_b2b").delete().eq("id", req.params.id);
    unwrap(result, "Nao foi possivel remover o lead.");
    res.status(204).end();
  }),
);

app.get(
  "/api/admin/pedidos",
  requireSession("admin"),
  asyncHandler(async (_req, res) => {
    const result = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    res.json({ pedidos: unwrap(result, "Nao foi possivel carregar os pedidos.") });
  }),
);

app.post(
  "/api/admin/pedidos",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = pedidoCreateSchema.parse(req.body);
    const codigo = payload.codigo || generateOrderCode();
    const createdAt = new Date().toISOString();

    const result = await supabase
      .from("pedidos")
      .insert({
        cliente_nome: payload.cliente_nome,
        equipamento: payload.equipamento,
        problema: payload.problema,
        observacao: payload.observacao,
        codigo,
        telefone: payload.telefone,
        valor: payload.valor,
        bairro: payload.bairro,
        etapas: payload.etapas,
        status: "Em Diagnóstico",
        historico: [{ status: "Em Diagnóstico", data: createdAt }],
        empresa_id: payload.empresa_id || null,
        pc_id: payload.pc_id || null,
      })
      .select("*")
      .single();

    res.status(201).json({
      pedido: unwrap(result, "Nao foi possivel criar o pedido."),
    });
  }),
);

app.patch(
  "/api/admin/pedidos/:id/status",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: statusSchema }).parse(req.body);
    const pedido = await getPedidoById(req.params.id);
    const historico = Array.isArray(pedido.historico) ? pedido.historico : [];
    const updatedHistory =
      pedido.status === status
        ? historico
        : [...historico, { status, data: new Date().toISOString() }];

    const result = await supabase
      .from("pedidos")
      .update({ status, historico: updatedHistory })
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.json({ pedido: unwrap(result, "Nao foi possivel atualizar o status do pedido.") });
  }),
);

app.patch(
  "/api/admin/pedidos/:id/observacao",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const { observacao } = observacaoSchema.parse(req.body);
    const result = await supabase
      .from("pedidos")
      .update({ observacao })
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.json({ pedido: unwrap(result, "Nao foi possivel atualizar a observacao do pedido.") });
  }),
);

app.patch(
  "/api/admin/pedidos/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = pedidoEditSchema.parse(req.body);
    const result = await supabase
      .from("pedidos")
      .update(payload)
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.json({ pedido: unwrap(result, "Nao foi possivel salvar a edicao do pedido.") });
  }),
);

app.delete(
  "/api/admin/pedidos/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const pedido = await getPedidoById(req.params.id);
    const fotos = Array.isArray(pedido.fotos_urls) ? pedido.fotos_urls : [];

    if (fotos.length > 0) {
      const storagePaths = fotos.map((url) => getStoragePathFromUrl(url, req.params.id));
      const removeFilesResult = await supabase.storage.from("pedidos").remove(storagePaths);
      unwrap(removeFilesResult, "Nao foi possivel remover os arquivos do pedido.");
    }

    const deleteResult = await supabase.from("pedidos").delete().eq("id", req.params.id);
    unwrap(deleteResult, "Nao foi possivel deletar o pedido.");

    res.status(204).end();
  }),
);

app.post(
  "/api/admin/pedidos/:id/assets",
  requireSession("admin"),
  upload.array("files", 6),
  asyncHandler(async (req, res) => {
    const pedido = await getPedidoById(req.params.id);
    const files = Array.isArray(req.files) ? req.files : [];

    if (files.length === 0) {
      throw new HttpError(400, "Selecione pelo menos um arquivo.");
    }

    const uploadedUrls = [];

    for (const file of files) {
      const extension = path.extname(file.originalname || "").toLowerCase();
      const storagePath = `${req.params.id}/${crypto.randomUUID()}${extension}`;

      const uploadResult = await supabase.storage.from("pedidos").upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

      unwrap(uploadResult, "Nao foi possivel enviar um dos arquivos.");
      uploadedUrls.push(supabase.storage.from("pedidos").getPublicUrl(storagePath).data.publicUrl);
    }

    const fotosAtuais = Array.isArray(pedido.fotos_urls) ? pedido.fotos_urls : [];
    const fotosAtualizadas = [...fotosAtuais, ...uploadedUrls];
    const updateResult = await supabase
      .from("pedidos")
      .update({
        fotos_urls: fotosAtualizadas,
        fotos_updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.json({ pedido: unwrap(updateResult, "Nao foi possivel salvar os arquivos no pedido.") });
  }),
);

app.delete(
  "/api/admin/pedidos/:id/assets",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const { url } = z.object({ url: z.string().url() }).parse(req.body);
    const pedido = await getPedidoById(req.params.id);
    const storagePath = getStoragePathFromUrl(url, req.params.id);

    const removeResult = await supabase.storage.from("pedidos").remove([storagePath]);
    unwrap(removeResult, "Nao foi possivel remover o arquivo.");

    const fotosAtuais = Array.isArray(pedido.fotos_urls) ? pedido.fotos_urls : [];
    const fotosAtualizadas = fotosAtuais.filter((currentUrl) => currentUrl !== url);
    const updateResult = await supabase
      .from("pedidos")
      .update({ fotos_urls: fotosAtualizadas })
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.json({ pedido: unwrap(updateResult, "Nao foi possivel atualizar a lista de arquivos do pedido.") });
  }),
);

app.get(
  "/api/admin/custos",
  requireSession("admin"),
  asyncHandler(async (_req, res) => {
    const result = await supabase.from("custos").select("*").order("data", { ascending: false });
    res.json({ custos: unwrap(result, "Nao foi possivel carregar os custos.") });
  }),
);

app.post(
  "/api/admin/custos",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = custoSchema.parse(req.body);
    const result = await supabase.from("custos").insert(payload).select("*").single();
    res.status(201).json({ custo: unwrap(result, "Nao foi possivel cadastrar o custo.") });
  }),
);

app.delete(
  "/api/admin/custos/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const result = await supabase.from("custos").delete().eq("id", req.params.id);
    unwrap(result, "Nao foi possivel deletar o custo.");
    res.status(204).end();
  }),
);

app.get(
  "/api/admin/empresas",
  requireSession("admin"),
  asyncHandler(async (_req, res) => {
    res.json({ empresas: await getEmpresasForAdmin() });
  }),
);

app.post(
  "/api/admin/empresas",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = empresaSchema.parse(req.body);
    const plainPassword = normalizeCompanyPassword(payload.senha || generateCompanyPassword());
    const result = await supabase
      .from("empresas")
      .insert({
        nome: payload.nome,
        contato_nome: payload.contato_nome,
        contato_telefone: payload.contato_telefone,
        plano: payload.plano,
        proxima_visita: payload.proxima_visita,
        codigo: payload.codigo || generateCompanyCode(),
        senha: await bcrypt.hash(plainPassword, 12),
      })
      .select("*")
      .single();

    res.status(201).json({
      empresa: sanitizeEmpresaForAdmin(unwrap(result, "Nao foi possivel criar a empresa.")),
      generatedPassword: plainPassword,
    });
  }),
);

app.patch(
  "/api/admin/empresas/:id/password",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const { password } = companyPasswordSchema.parse(req.body);
    const empresa = await updateCompanyPassword(req.params.id, password);
    res.json({ empresa });
  }),
);

app.post(
  "/api/admin/empresas/:id/pcs",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = pcSchema.parse(req.body);
    const result = await supabase
      .from("pcs_empresa")
      .insert({
        empresa_id: req.params.id,
        nome: payload.nome,
        setor: payload.setor,
      })
      .select("*")
      .single();

    res.status(201).json({ pc: unwrap(result, "Nao foi possivel cadastrar o computador.") });
  }),
);

app.delete(
  "/api/admin/pcs/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const result = await supabase.from("pcs_empresa").delete().eq("id", req.params.id);
    unwrap(result, "Nao foi possivel remover o computador.");
    res.status(204).end();
  }),
);

app.post(
  "/api/admin/empresas/:id/visitas",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const payload = visitaSchema.parse(req.body);
    const visitDate = new Date().toISOString();
    const nextVisit = new Date();
    nextVisit.setDate(nextVisit.getDate() + 30);
    const nextVisitDate = nextVisit.toISOString().split("T")[0];

    const visitResult = await supabase.from("visitas_empresa").insert({
      empresa_id: req.params.id,
      data: visitDate,
      observacao: payload.observacao,
      checklist: payload.checklist,
    });

    unwrap(visitResult, "Nao foi possivel registrar a visita.");

    const companyResult = await supabase
      .from("empresas")
      .update({ proxima_visita: nextVisitDate })
      .eq("id", req.params.id)
      .select("*")
      .single();

    res.status(201).json({
      empresa: sanitizeEmpresaForAdmin(unwrap(companyResult, "Nao foi possivel atualizar a proxima visita.")),
    });
  }),
);

app.delete(
  "/api/admin/empresas/:id",
  requireSession("admin"),
  asyncHandler(async (req, res) => {
    const linkedOrdersResult = await supabase.from("pedidos").select("id").eq("empresa_id", req.params.id).limit(1);
    const linkedOrders = unwrap(linkedOrdersResult, "Nao foi possivel validar os pedidos vinculados.");

    if (linkedOrders.length > 0) {
      throw new HttpError(409, "Remova ou desvincule os pedidos da empresa antes de exclui-la.");
    }

    const visitsResult = await supabase.from("visitas_empresa").delete().eq("empresa_id", req.params.id);
    unwrap(visitsResult, "Nao foi possivel remover as visitas da empresa.");

    const pcsResult = await supabase.from("pcs_empresa").delete().eq("empresa_id", req.params.id);
    unwrap(pcsResult, "Nao foi possivel remover os computadores da empresa.");

    const companyResult = await supabase.from("empresas").delete().eq("id", req.params.id);
    unwrap(companyResult, "Nao foi possivel remover a empresa.");

    res.status(204).end();
  }),
);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Rota da API nao encontrada." });
});

if (env.nodeEnv === "production") {
  const distPath = path.resolve(__dirname, "../dist");

  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use(handleError);

app.listen(env.port, () => {
  console.log(`Maker Info API rodando em http://localhost:${env.port}`);
});
