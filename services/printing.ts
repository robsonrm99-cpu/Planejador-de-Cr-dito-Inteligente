import { AssetType, Configs, SimulationResult } from '../types';

export const generatePrintHTML = (
  tipoBem: AssetType, 
  valorCredito: number, 
  configs: Configs, 
  simulacao: SimulationResult
) => {
  const today = new Date().toLocaleDateString('pt-BR');
  const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Proposta Comercial - ${tipoBem.toUpperCase()}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          @media print {
            @page { 
              size: A4;
              margin: 10mm; 
            }
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                background: white !important;
                margin: 0;
                padding: 0;
            }
            .print-container {
              width: 190mm;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
              overflow: hidden;
            }
            .no-print-margin { margin-top: 0 !important; }
          }
          
          body { 
            font-family: 'Inter', sans-serif; 
            background: #f1f5f9;
            margin: 0;
            padding: 10px 0;
            display: flex;
            justify-content: center;
          }

          .print-container {
            background: white;
            width: 190mm;
            padding: 10mm 15mm;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .section-border {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            width: 100%;
          }

          .badge {
            font-size: 7.5px;
            font-weight: 900;
            padding: 3px 10px;
            border-radius: 5px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .card-header {
            padding: 10px 20px;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .card-body {
            padding: 15px 24px;
          }

          .card-footer {
            padding: 10px 24px;
            background-color: #fafafa;
            border-top: 1px solid #f1f5f9;
          }

          .math-box {
            border-radius: 10px;
            padding: 12px 18px;
            margin: 8px 0;
          }
          
          .value-main { font-weight: 900; letter-spacing: -0.05em; }
          
          .full-width { width: 100%; }
        </style>
      </head>
      <body>
        <div class="print-container no-print-margin">
          <!-- Header -->
          <div class="full-width flex justify-between items-end pb-4 border-b-2 border-slate-900">
            <div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">PLANEJAMENTO DE CRÉDITO</h1>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Relatório Estratégico de Performance Financeira</p>
            </div>
            <div class="text-right">
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Emissão</p>
              <p class="text-xs font-black text-slate-900">${today}</p>
            </div>
          </div>

          <!-- Dados da Simulação -->
          <div class="section-border bg-slate-50">
            <div class="grid grid-cols-4 px-6 py-4 gap-4">
              <div>
                <p class="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Bem Simulado</p>
                <p class="text-xs font-black text-slate-800 uppercase tracking-tighter">${tipoBem === 'veiculo' ? 'Veículo / Auto' : 'Imóvel Residencial'}</p>
              </div>
              <div>
                <p class="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Valor do Crédito</p>
                <p class="text-xs font-black text-slate-800">${format(valorCredito)}</p>
              </div>
              <div>
                <p class="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Referência</p>
                <p class="text-xs font-black text-slate-800 italic">SELIC + CET</p>
              </div>
              <div>
                <p class="text-[8px] font-bold text-slate-400 uppercase mb-0.5">Custo Estratégico</p>
                <p class="text-xs font-black text-slate-800">${configs.taxaConsorcioFixa}% Taxa Fixa</p>
              </div>
            </div>
          </div>

          <!-- Financiamento -->
          <div class="section-border border-red-100">
            <div class="card-header flex justify-between items-center bg-red-50/20">
              <h2 class="text-sm font-black text-slate-800 tracking-tight uppercase italic leading-none">Financiamento Bancário</h2>
              <span class="badge bg-red-100 text-red-700 border border-red-200">Convencional</span>
            </div>
            <div class="card-body">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aporte de Entrada</span>
                <span class="text-[10px] font-black text-slate-900">${format(simulacao.financiamento.entrada)}</span>
              </div>
              
              <div class="mb-2">
                <p class="text-[8px] text-slate-400 font-black uppercase mb-1">Parcela Mensal Estimada</p>
                <p class="text-3xl font-black text-slate-900 value-main leading-none">${format(simulacao.financiamento.parcela)}</p>
              </div>

              <div class="math-box bg-red-50/50 border border-red-100">
                <div class="flex justify-between items-end">
                    <div>
                        <p class="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Tempo Total de Contrato</p>
                        <div class="flex items-baseline gap-2 leading-none">
                          <span class="text-4xl font-black text-slate-900 tracking-tighter">${simulacao.financiamento.prazoEstimado}</span>
                          <span class="text-[10px] font-bold text-slate-500 uppercase">meses</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[9px] font-black text-slate-400">~ ${(simulacao.financiamento.prazoEstimado / 12).toFixed(1)} anos</p>
                    </div>
                </div>
              </div>
            </div>
            <div class="card-footer flex justify-between items-center">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Geral Estimado</span>
              <span class="text-lg font-black text-slate-900">${format(simulacao.financiamento.total)}</span>
            </div>
          </div>

          <!-- Carta de Crédito -->
          <div class="section-border border-emerald-500 ring-2 ring-emerald-500/5">
            <div class="card-header flex justify-between items-center bg-emerald-50/30">
              <h2 class="text-sm font-black text-slate-800 tracking-tight uppercase italic leading-none">Carta de Crédito Inteligente</h2>
              <span class="badge bg-emerald-600 text-white shadow-sm">Recomendação Estratégica</span>
            </div>
            <div class="card-body">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Entrada (adesão)</span>
                <span class="text-[10px] font-black text-emerald-700">${format(simulacao.consorcio.lance)}</span>
              </div>
              
              <div class="mb-2">
                <p class="text-[8px] text-slate-400 font-black uppercase mb-1">Parcela Planejada</p>
                <p class="text-3xl font-black text-emerald-600 value-main leading-none">${format(simulacao.consorcio.parcela)}</p>
              </div>

              <div class="math-box border border-emerald-100 bg-emerald-50/40">
                <div class="flex justify-between items-end">
                    <div>
                        <p class="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Prazo Planejado de Quitação</p>
                        <div class="flex items-baseline gap-2 leading-none">
                          <span class="text-4xl font-black text-slate-900 tracking-tighter">${simulacao.consorcio.prazoEstimado}</span>
                          <span class="text-[10px] font-bold text-slate-500 uppercase">meses</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[9px] font-black text-slate-400">~ ${(simulacao.consorcio.prazoEstimado / 12).toFixed(1)} anos</p>
                    </div>
                </div>
              </div>
            </div>
            <div class="card-footer flex justify-between items-center bg-emerald-600">
              <span class="text-[10px] font-black text-white uppercase tracking-widest">Custo de Aquisição Final</span>
              <span class="text-lg font-black text-white">${format(simulacao.consorcio.total)}</span>
            </div>
          </div>

          <!-- Economia Gerada -->
          <div class="section-border p-6 flex justify-between items-center bg-emerald-50 border-2 border-emerald-600 mt-2">
            <div>
              <p class="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-1">Capital Preservado (Economia)</p>
              <p class="text-4xl font-black tracking-tighter leading-none text-slate-900">${format(simulacao.economia)}</p>
              <p class="text-[9px] text-slate-500 font-bold uppercase mt-2 italic">Eficiência de capital superior ao mercado financeiro</p>
            </div>
            <div class="text-right flex flex-col items-end gap-2">
              <div class="bg-emerald-600 px-4 py-2 rounded-xl shadow-lg">
                 <p class="text-3xl font-black text-white tracking-tighter leading-none">${simulacao.economiaPorcentagem.toFixed(0)}%</p>
                 <p class="text-[8px] font-black text-white uppercase tracking-widest text-center mt-1">MAIS BARATO</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="full-width mt-2 pt-4 border-t border-slate-200">
            <div class="flex justify-between items-start">
                <div class="w-3/4">
                    <p class="text-[7px] text-slate-400 leading-tight font-semibold uppercase tracking-tight">
                      AVISO LEGAL: ESTE DOCUMENTO CONSTITUI UMA SIMULAÇÃO ESTRATÉGICA. OS VALORES DE FINANCIAMENTO SÃO PROJEÇÕES BASEADAS EM TAXAS DE MERCADO (SELIC+CET). <br>
                      O PLANO INTELIGENTE UTILIZA TAXA ADMINISTRATIVA FIXA DILUÍDA. SUJEITO A ANÁLISE DE SCORE E DISPONIBILIDADE DE GRUPOS.
                    </p>
                </div>
                <div class="text-right font-black text-slate-300 text-[10px] uppercase tracking-tighter">
                    ELITE STRATEGY &copy; 2025
                </div>
            </div>
          </div>
        </div>

        <script>
            window.onload = function() { 
                setTimeout(() => { window.print(); }, 800);
            }
        </script>
      </body>
      </html>
    `;
};