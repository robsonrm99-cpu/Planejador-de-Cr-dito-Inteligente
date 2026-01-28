
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
              margin: 10mm 20mm;
            }
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                background: white !important;
                font-size: 10px;
                color: #0f172a;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
          }
          
          body { 
            font-family: 'Inter', sans-serif; 
            width: 170mm; /* Reduzido para aumentar margens e centralizar */
            margin: 0 auto; 
            display: flex;
            flex-direction: column;
            padding: 0;
          }

          .section-border {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
          }

          .badge {
            font-size: 7px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .bg-red-light { background-color: #fef2f2; }
          .bg-green-light { background-color: #ecfdf5; }
          
          .card-header {
            padding: 10px 18px;
            border-bottom: 1px solid #f1f5f9;
          }
          
          .card-body {
            padding: 14px 18px;
          }

          .card-footer {
            padding: 10px 18px;
            background-color: white;
            border-top: 1px solid #f1f5f9;
          }

          .math-box {
            border-radius: 6px;
            padding: 10px 14px;
            margin: 8px 0;
          }
          
          .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px; /* Espaçamento compacto */
            margin-top: 12px;
            width: 100%;
            align-items: center;
          }

          .value-main { font-weight: 900; letter-spacing: -0.04em; }
          
          .full-width { width: 100%; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="full-width flex justify-between items-end pb-2 border-b border-slate-300">
          <div>
            <h1 class="text-lg font-black text-slate-900 tracking-tighter">PLANEJAMENTO DE CRÉDITO</h1>
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Simulação Comparativa</p>
          </div>
          <div class="text-right">
            <p class="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Emissão</p>
            <p class="text-[10px] font-black text-slate-900">${today}</p>
          </div>
        </div>

        <div class="content-wrapper">
          <!-- Dados da Simulação -->
          <div class="section-border bg-slate-50/50">
            <div class="px-4 py-1.5 border-b border-slate-100">
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Resumo do Objetivo</p>
            </div>
            <div class="grid grid-cols-4 px-4 py-3 gap-2">
              <div>
                <p class="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Objetivo</p>
                <p class="text-[9px] font-black text-slate-800">${tipoBem === 'veiculo' ? 'Veículo' : 'Imóvel'}</p>
              </div>
              <div>
                <p class="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Crédito</p>
                <p class="text-[9px] font-black text-slate-800">${format(valorCredito)}</p>
              </div>
              <div>
                <p class="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Base Financ.</p>
                <p class="text-[9px] font-black text-slate-800 italic">Selic + CET</p>
              </div>
              <div>
                <p class="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Taxa Carta</p>
                <p class="text-[9px] font-black text-slate-800">${configs.taxaConsorcioFixa}% (Fixo)</p>
              </div>
            </div>
          </div>

          <!-- Financiamento -->
          <div class="section-border">
            <div class="card-header flex justify-between items-center">
              <h2 class="text-base font-black text-slate-800 tracking-tight uppercase">Financiamento</h2>
              <span class="badge bg-red-50 text-red-600 border border-red-100">Tradicional</span>
            </div>
            <div class="card-body">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-slate-500 font-medium">Entrada Inicial</span>
                <span class="text-xs font-black text-slate-800">${format(simulacao.financiamento.entrada)}</span>
              </div>
              
              <div class="mb-2">
                <p class="text-[8px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Parcela Mensal Estimada</p>
                <p class="text-2xl font-black text-slate-900 value-main">${format(simulacao.financiamento.parcela)}</p>
              </div>

              <div class="math-box bg-red-light/60 border border-red-100">
                <p class="text-[8px] font-black text-red-600 uppercase tracking-widest mb-0.5">Prazo Estimado</p>
                <div class="flex items-baseline gap-1.5 leading-none">
                  <span class="text-3xl font-black text-slate-900 tracking-tighter">${simulacao.financiamento.prazoEstimado}</span>
                  <span class="text-[9px] font-bold text-slate-500 uppercase">meses</span>
                </div>
                <p class="text-[8px] text-slate-400 font-bold mt-1 italic">~ ${(simulacao.financiamento.prazoEstimado / 12).toFixed(1)} anos</p>
              </div>
            </div>
            <div class="card-footer flex justify-between items-center bg-slate-50/20">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custo Total (Entrada + Parcelas)</span>
              <span class="text-lg font-black text-slate-900">${format(simulacao.financiamento.total)}</span>
            </div>
          </div>

          <!-- Carta de Crédito -->
          <div class="section-border border-green-500 ring-1 ring-green-500/5">
            <div class="card-header flex justify-between items-center bg-green-50/40">
              <h2 class="text-base font-black text-slate-800 tracking-tight uppercase">Carta de Crédito</h2>
              <span class="badge bg-green-600 text-white shadow-sm">Recomendado</span>
            </div>
            <div class="card-body">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] text-slate-500 font-medium">Adesão / Entrada</span>
                <span class="text-xs font-black text-blue-600">${format(simulacao.consorcio.lance)}</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-[8px] text-slate-400 font-black uppercase tracking-wider">Saldo a Parcelar:</span>
                <span class="text-[8px] font-black text-slate-400">${format(simulacao.consorcio.saldoDevedor)}</span>
              </div>
              
              <div class="mb-2">
                <p class="text-[8px] text-slate-400 font-black uppercase tracking-wider mb-0.5">Parcela Mensal Planejada</p>
                <p class="text-2xl font-black text-green-600 value-main">${format(simulacao.consorcio.parcela)}</p>
              </div>

              <div class="math-box border border-slate-100 bg-white shadow-sm">
                <p class="text-[8px] font-black text-green-600 uppercase tracking-widest mb-0.5">Prazo Estimado</p>
                <div class="flex items-baseline gap-1.5 leading-none">
                  <span class="text-3xl font-black text-slate-900 tracking-tighter">${simulacao.consorcio.prazoEstimado}</span>
                  <span class="text-[9px] font-bold text-slate-500 uppercase">meses</span>
                </div>
                <p class="text-[8px] text-slate-400 font-bold mt-1 italic">~ ${(simulacao.consorcio.prazoEstimado / 12).toFixed(1)} anos</p>
              </div>
            </div>
            <div class="card-footer flex justify-between items-center bg-green-50/10">
              <span class="text-[9px] font-black text-green-800 uppercase tracking-widest">Custo Total (Adesão + Parcelas)</span>
              <span class="text-lg font-black text-green-600">${format(simulacao.consorcio.total)}</span>
            </div>
          </div>

          <!-- Economia Gerada -->
          <div class="section-border p-4 flex justify-between items-center bg-white border border-slate-900">
            <div>
              <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Economia Direta Gerada</p>
              <p class="text-2xl font-black text-slate-900 tracking-tighter leading-none">${format(simulacao.economia)}</p>
              <p class="text-[8px] text-slate-400 font-black uppercase mt-1">Capital preservado pelo planejamento</p>
            </div>
            <div class="text-right flex flex-col items-end">
              <p class="text-3xl font-black text-slate-800 tracking-tighter mb-1">${simulacao.economiaPorcentagem.toFixed(0)}%</p>
              <span class="badge bg-green-600 text-white py-1 px-3 rounded">MAIS BARATO</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="full-width mt-4 pt-3 border-t border-slate-100">
          <p class="text-[7px] text-slate-400 text-center leading-tight font-bold uppercase tracking-tight">
            Simulação para fins de planejamento. Valores sujeitos a confirmação. <br>
            Financiamento com juros compostos estimados. Consórcio com taxa adm. fixa.
          </p>
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
