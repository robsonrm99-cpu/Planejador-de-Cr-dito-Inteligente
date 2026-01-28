
export type AssetType = 'veiculo' | 'imovel';

export interface FinanceResult {
  prazoEstimado: number;
  total: number;
  jurosPagos: number;
  valorFinanciado: number;
  erro: string | null;
  entrada: number;
  parcela: number;
}

export interface ConsortiumResult {
  prazoEstimado: number;
  total: number;
  lance: number;
  parcela: number;
  saldoDevedor: number;
  valorBase: number;
}

export interface SimulationResult {
  financiamento: FinanceResult;
  consorcio: ConsortiumResult;
  economia: number;
  economiaPorcentagem: number;
}

export interface Configs {
  taxaConsorcioFixa: number;
  maxMeses: number;
}
