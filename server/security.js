import { readSessionFromRequest } from "./session.js";
import { env } from "./env.js";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export function requireSession(role) {
  return (req, res, next) => {
    const session = readSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({ error: "Sessao expirada ou ausente." });
    }

    if (role && session.role !== role) {
      return res.status(403).json({ error: "Acesso nao autorizado." });
    }

    req.session = session;
    return next();
  };
}

export function requireAllowedOrigin(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const origin = req.get("origin");
  const host = req.get("host");
  const requestOrigin = host ? `${req.protocol}://${host}` : null;

  if (!origin || (!env.allowedOrigins.includes(origin) && origin !== requestOrigin)) {
    return res.status(403).json({ error: "Origem nao autorizada." });
  }

  return next();
}

export function createRateLimiter({ windowMs, max, message }) {
  const hits = new Map();

  const cleanup = () => {
    const now = Date.now();

    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  };

  const cleanupTimer = setInterval(cleanup, windowMs);
  cleanupTimer.unref();

  return (req, res, next) => {
    const now = Date.now();
    const ip = getClientIp(req);
    const routeScope = req.baseUrl + (req.route?.path || req.path);
    const key = `${routeScope}:${ip}`;
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      res.setHeader("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ error: message });
    }

    current.count += 1;
    return next();
  };
}

export function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "0.0.0.0";
}

export function normalizeCompanyPassword(password) {
  return password.trim().toUpperCase();
}

export function sanitizeEmpresaForClient(empresa) {
  return {
    ...empresa,
    senha: "",
  };
}

export function sanitizeEmpresaForAdmin(empresa) {
  return {
    ...empresa,
    senha: "",
    senha_configurada: Boolean(empresa?.senha),
  };
}

export function sanitizePublicPedido(pedido) {
  return {
    id: pedido.id,
    codigo: pedido.codigo,
    cliente_nome: pedido.cliente_nome,
    equipamento: pedido.equipamento,
    problema: pedido.problema,
    status: pedido.status,
    observacao: pedido.observacao || "",
    etapas: pedido.etapas || [],
    historico: Array.isArray(pedido.historico) ? pedido.historico : [],
    fotos_urls: Array.isArray(pedido.fotos_urls) ? pedido.fotos_urls : [],
    created_at: pedido.created_at,
    updated_at: pedido.updated_at,
  };
}

export function handleError(error, req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Arquivo maior do que o permitido." });
  }

  console.error(error);
  return res.status(500).json({ error: "Erro interno no servidor." });
}
