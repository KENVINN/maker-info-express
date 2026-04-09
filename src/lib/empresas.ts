export type PlanoEmpresa = "Pequeno" | "Médio" | "Grande";

export interface PC {
  id: string;
  empresa_id: string;
  nome: string;
  setor: string;
  created_at: string;
}

export interface Empresa {
  id: string;
  codigo: string;
  senha?: string | null;
  senha_configurada?: boolean;
  nome: string;
  contato_nome: string;
  contato_telefone: string;
  plano: PlanoEmpresa;
  proxima_visita: string;
  created_at: string;
  pcs?: PC[];
}

export interface Visita {
  id: string;
  empresa_id: string;
  data: string;
  observacao: string;
  checklist: Record<string, boolean> | Record<string, Record<string, boolean>>;
  created_at: string;
}
