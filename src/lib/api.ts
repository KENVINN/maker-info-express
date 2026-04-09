import type { Empresa, PC, Visita } from "@/lib/empresas";
import type { Pedido, StatusPedido } from "@/lib/pedidos";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  const isFormData = init.body instanceof FormData;

  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(payload?.error || "Nao foi possivel concluir a operacao.", response.status);
  }

  return payload as T;
}

export type CompanyDashboardPayload = {
  empresa: Empresa;
  pcs: PC[];
  pedidos: Pedido[];
  visitas: Visita[];
};

export type Custo = {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
};

export type LeadStatus = "novo" | "contatado" | "visita_agendada" | "proposta_enviada" | "fechado" | "perdido";

export type Lead = {
  id: string;
  nome_empresa: string;
  contato_nome: string;
  contato_telefone: string;
  qtd_pcs: string;
  status: LeadStatus;
  observacao: string;
  created_at: string;
  updated_at: string;
};

export const api = {
  admin: {
    login: (password: string) =>
      apiRequest<{ authenticated: boolean }>("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
    session: () => apiRequest<{ authenticated: boolean }>("/api/auth/admin/session"),
    logout: () =>
      apiRequest<void>("/api/auth/admin/logout", {
        method: "POST",
      }),
    listPedidos: () => apiRequest<{ pedidos: Pedido[] }>("/api/admin/pedidos"),
    createPedido: (payload: Record<string, unknown>) =>
      apiRequest<{ pedido: Pedido }>("/api/admin/pedidos", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updatePedidoStatus: (id: string, status: StatusPedido) =>
      apiRequest<{ pedido: Pedido }>(`/api/admin/pedidos/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    updatePedidoObservacao: (id: string, observacao: string) =>
      apiRequest<{ pedido: Pedido }>(`/api/admin/pedidos/${id}/observacao`, {
        method: "PATCH",
        body: JSON.stringify({ observacao }),
      }),
    updatePedido: (id: string, payload: Record<string, unknown>) =>
      apiRequest<{ pedido: Pedido }>(`/api/admin/pedidos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    deletePedido: (id: string) =>
      apiRequest<void>(`/api/admin/pedidos/${id}`, {
        method: "DELETE",
      }),
    uploadPedidoAssets: (id: string, files: FileList | File[]) => {
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      return apiRequest<{ pedido: Pedido }>(`/api/admin/pedidos/${id}/assets`, {
        method: "POST",
        body: formData,
      });
    },
    deletePedidoAsset: (id: string, url: string) =>
      apiRequest<{ pedido: Pedido }>(`/api/admin/pedidos/${id}/assets`, {
        method: "DELETE",
        body: JSON.stringify({ url }),
      }),
    listCustos: () => apiRequest<{ custos: Custo[] }>("/api/admin/custos"),
    createCusto: (payload: Omit<Custo, "id">) =>
      apiRequest<{ custo: Custo }>("/api/admin/custos", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    deleteCusto: (id: string) =>
      apiRequest<void>(`/api/admin/custos/${id}`, {
        method: "DELETE",
      }),
    listEmpresas: () => apiRequest<{ empresas: Empresa[] }>("/api/admin/empresas"),
    createEmpresa: (payload: Record<string, unknown>) =>
      apiRequest<{ empresa: Empresa; generatedPassword: string }>("/api/admin/empresas", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateEmpresaPassword: (id: string, password: string) =>
      apiRequest<{ empresa: Empresa }>(`/api/admin/empresas/${id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      }),
    addPc: (empresaId: string, payload: { nome: string; setor: string }) =>
      apiRequest<{ pc: PC }>(`/api/admin/empresas/${empresaId}/pcs`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    removePc: (pcId: string) =>
      apiRequest<void>(`/api/admin/pcs/${pcId}`, {
        method: "DELETE",
      }),
    saveVisita: (empresaId: string, payload: { observacao: string; checklist: Record<string, Record<string, boolean>> }) =>
      apiRequest<{ empresa: Empresa }>(`/api/admin/empresas/${empresaId}/visitas`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    deleteEmpresa: (empresaId: string) =>
      apiRequest<void>(`/api/admin/empresas/${empresaId}`, {
        method: "DELETE",
      }),
    listLeads: () => apiRequest<{ leads: Lead[] }>("/api/admin/leads"),
    updateLead: (id: string, payload: { status?: LeadStatus; observacao?: string }) =>
      apiRequest<{ lead: Lead }>(`/api/admin/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    deleteLead: (id: string) =>
      apiRequest<void>(`/api/admin/leads/${id}`, {
        method: "DELETE",
      }),
  },
  company: {
    login: (codigo: string, senha: string) =>
      apiRequest<CompanyDashboardPayload>("/api/auth/company/login", {
        method: "POST",
        body: JSON.stringify({ codigo, senha }),
      }),
    session: () => apiRequest<CompanyDashboardPayload>("/api/auth/company/session"),
    logout: () =>
      apiRequest<void>("/api/auth/company/logout", {
        method: "POST",
      }),
    changePassword: (password: string) =>
      apiRequest<{ ok: boolean }>("/api/company/change-password", {
        method: "POST",
        body: JSON.stringify({ password }),
      }),
  },
  tracking: {
    getPedido: (codigo: string) =>
      apiRequest<{ pedido: Pedido }>(`/api/tracking/pedidos/${encodeURIComponent(codigo.trim().toUpperCase())}`),
  },
  leads: {
    create: (payload: { nome_empresa: string; contato_nome?: string; contato_telefone: string; qtd_pcs?: string }) =>
      apiRequest<{ ok: boolean }>("/api/leads", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  waitlist: {
    signup: (payload: {
      email: string;
      name: string | null;
      wants_tester_access: boolean;
      wants_launch_updates: boolean;
      source: string;
    }) =>
      apiRequest<{ ok: boolean }>("/api/waitlist", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};
