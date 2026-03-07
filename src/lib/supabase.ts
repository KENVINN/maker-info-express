import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pmcnznvekkjbcfrsicme.supabase.co";
const SUPABASE_KEY = "sb_publishable_E0VOuQf0llfE5ZAPKVtcwA_vuAP2KrJ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export type StatusPedido = 
  | "Aguardando Aprovação"
  | "Em Reparo"
  | "Pronto para Retirada"
  | "Entregue";

export type Pedido = {
  id: string;
  codigo: string;
  cliente_nome: string;
  equipamento: string;
  problema: string;
  status: StatusPedido;
  observacao?: string;
  created_at: string;
  updated_at: string;
};

export const STATUS_CONFIG: Record<StatusPedido, { label: string; emoji: string; color: string; step: number }> = {
  "Aguardando Aprovação": { label: "Aguardando Aprovação", emoji: "⏳", color: "text-highlight-amber", step: 1 },
  "Em Reparo":            { label: "Em Reparo",            emoji: "🔧", color: "text-primary",         step: 2 },
  "Pronto para Retirada": { label: "Pronto para Retirada", emoji: "✅", color: "text-green-500",        step: 3 },
  "Entregue":             { label: "Entregue",             emoji: "🎉", color: "text-secondary",        step: 4 },
};
