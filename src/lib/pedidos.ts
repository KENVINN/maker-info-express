export type StatusPedido =
  | "Em Diagnóstico"
  | "Limpeza / Formatação"
  | "Peça Solicitada"
  | "Em Reparo"
  | "Testes Finais"
  | "Pronto para Retirada"
  | "Saída para Entrega"
  | "Entregue";

export type PedidoHistoricoItem = {
  status: StatusPedido;
  data: string;
};

export type Pedido = {
  id: string;
  codigo: string;
  cliente_nome: string;
  equipamento: string;
  problema: string;
  status: StatusPedido;
  observacao?: string;
  telefone?: string;
  valor?: number;
  bairro?: string;
  etapas?: string[];
  historico?: PedidoHistoricoItem[];
  fotos_urls?: string[];
  empresa_id?: string | null;
  pc_id?: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_CONFIG: Record<StatusPedido, { label: string; emoji: string; color: string; step: number }> = {
  "Em Diagnóstico": { label: "Em Diagnóstico", emoji: "🔍", color: "text-highlight-amber", step: 1 },
  "Limpeza / Formatação": { label: "Limpeza / Formatação", emoji: "🧹", color: "text-highlight-amber", step: 2 },
  "Peça Solicitada": { label: "Peça Solicitada", emoji: "📦", color: "text-highlight-amber", step: 3 },
  "Em Reparo": { label: "Em Reparo", emoji: "🔧", color: "text-primary", step: 4 },
  "Testes Finais": { label: "Testes Finais", emoji: "🧪", color: "text-primary", step: 5 },
  "Pronto para Retirada": { label: "Pronto para Retirada", emoji: "✅", color: "text-green-500", step: 6 },
  "Saída para Entrega": { label: "Saída para Entrega", emoji: "🛵", color: "text-green-500", step: 7 },
  Entregue: { label: "Entregue", emoji: "🎉", color: "text-secondary", step: 8 },
};
