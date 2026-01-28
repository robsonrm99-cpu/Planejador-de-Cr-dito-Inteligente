
import { useState, useMemo, useEffect } from 'react';
import { 
  Car, 
  Home, 
  Percent, 
  CheckCircle, 
  FileText, 
  Loader2, 
  Zap,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CircleDollarSign,
  PieChart
} from 'lucide-react';
import { AssetType, SimulationResult, Configs } from './types';

import SimulationInput from './components/SimulationInput';
import ComparisonCard from './components/ComparisonCard';
import { generatePrintHTML } from './services/printing';

export default function App() {
  const [tipoBem, setTipoBem] = useState<AssetType>('veiculo');
  const [valorCredito, setValorCredito] = useState(50000);
  const [showResults, setShowResults] = useState(false);
  const [printStatus, setPrintStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const [entradaFinan, setEntradaFinan] = useState(20000);
  const [parcelaAlvoFinan, setParcelaAlvoFinan] = useState(1850);
  const [lanceConsorcio, setLanceConsorcio] = useState(15000); 
  const [parcelaAlvoConsorcio, setParcelaAlvoConsorcio] = useState(1000);

  const configs = useMemo<Configs>(() => {
    return tipoBem === 'imovel' 
      ? { taxaConsorcioFixa: 26, maxMeses: 240 }
      : { taxaConsorcioFixa: 26, maxMeses: 150 };
  }, [tipoBem]);

  useEffect(() => {
    const isImovel = tipoBem === 'imovel';
    const baseVal = isImovel ? 200000 : 50000;
    setValorCredito(baseVal);
    setParcelaAlvoFinan(isImovel ? 2500 : 1850);
    setParcelaAlvoConsorcio(isImovel ? 1500 : 1000);
    setEntradaFinan(baseVal * 0.4);
    setLanceConsorcio(baseVal * 0.3);
    setShowResults(false);
  }, [tipoBem]);

  const simulacao = useMemo<SimulationResult>(() => {
    const saldoDevedorFinan = Math.max(0, valorCredito - entradaFinan);
    const saldoAPagarFinanciamentoEstimado = (saldoDevedorFinan * 2.8);
    let mesesFinan = (parcelaAlvoFinan > 0) ? Math.ceil(saldoAPagarFinanciamentoEstimado / parcelaAlvoFinan) : 0;
    const totalFinan = (mesesFinan > 0) ? (parcelaAlvoFinan * mesesFinan) + entradaFinan : entradaFinan;
    
    const valorTotalBase = valorCredito * (1 + (configs.taxaConsorcioFixa / 100)); 
    const saldoFaltante = Math.max(0, valorTotalBase - lanceConsorcio); 
    let mesesConsorcio = (parcelaAlvoConsorcio > 0) ? Math.ceil(saldoFaltante / parcelaAlvoConsorcio) : 0;
    const totalPagoConsorcio = (parcelaAlvoConsorcio * mesesConsorcio) + lanceConsorcio;

    return {
      financiamento: {
        prazoEstimado: mesesFinan,
        total: totalFinan,
        jurosPagos: totalFinan - valorCredito,
        valorFinanciado: saldoDevedorFinan,
        erro: mesesFinan > 420 ? "Excede limite" : null,
        entrada: entradaFinan,
        parcela: parcelaAlvoFinan
      },
      consorcio: {
        prazoEstimado: mesesConsorcio,
        total: totalPagoConsorcio,
        lance: lanceConsorcio,
        parcela: parcelaAlvoConsorcio,
        saldoDevedor: parcelaAlvoConsorcio * mesesConsorcio, 
        valorBase: valorTotalBase
      },
      economia: totalFinan - totalPagoConsorcio,
      economiaPorcentagem: totalFinan > 0 ? ((totalFinan - totalPagoConsorcio) / totalFinan) * 100 : 0
    };
  }, [valorCredito, entradaFinan, parcelaAlvoFinan, lanceConsorcio, parcelaAlvoConsorcio, configs]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{animationDelay: '2s'}}></div>

      {/* Header Fixo/Glass */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/40">
              <PieChart size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">
              Elite<span className="text-blue-500">Credit</span>
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
             <span className="text-blue-400">Dashboard</span>
             <span>Simulações</span>
             <span>Relatórios</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coluna de Controles (Inputs) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 space-y-8">
              <header className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Configuração do Bem</h2>
                <p className="text-slate-400 text-sm">Defina o objetivo do seu crédito.</p>
              </header>

              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setTipoBem('veiculo')} 
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tipoBem === 'veiculo' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Car size={16} /> Automóvel
                </button>
                <button 
                  onClick={() => setTipoBem('imovel')} 
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tipoBem === 'imovel' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Home size={16} /> Imóvel
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Valor do Crédito</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-600 group-focus-within:text-blue-500 transition-colors">R$</span>
                  <input 
                    type="number" 
                    value={valorCredito} 
                    onChange={(e) => setValorCredito(Number(e.target.value))} 
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-2xl font-black text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <Percent size={14} strokeWidth={3} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Cenário Bancário</h3>
                  </div>
                  <SimulationInput label="Entrada" value={entradaFinan} onChange={setEntradaFinan} color="red" />
                  <SimulationInput label="Parcela Máxima" value={parcelaAlvoFinan} onChange={setParcelaAlvoFinan} color="red" />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle size={14} strokeWidth={3} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Plano Estratégico</h3>
                  </div>
                  <SimulationInput label="Lance / Adesão" value={lanceConsorcio} onChange={setLanceConsorcio} color="emerald" />
                  <SimulationInput label="Parcela Ideal" value={parcelaAlvoConsorcio} onChange={setParcelaAlvoConsorcio} color="emerald" />
                </div>
              </div>

              <button 
                onClick={() => setShowResults(true)}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest shadow-2xl"
              >
                <Zap size={18} fill="currentColor" /> Analisar Resultados
              </button>
            </div>
          </div>

          {/* Coluna de Resultados (Dashboard) */}
          <div className="lg:col-span-8 space-y-8">
            {!showResults ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass rounded-[3rem] border-dashed border-white/10 text-center p-12">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <TrendingUp className="text-blue-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Simulação Pendente</h3>
                <p className="text-slate-500 max-w-xs text-sm">Configure os valores ao lado e clique em analisar para visualizar seu relatório de economia.</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Banner de Economia (Hero) */}
                <div className="glass rounded-[3rem] p-10 md:p-14 relative overflow-hidden group border-emerald-500/20">
                  <div className="absolute top-0 right-0 w-full h-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-emerald-500/20">Alpha Advantage</span>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Economia de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                          {formatCurrency(simulacao.economia)}
                        </span>
                      </h2>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-black text-white">{simulacao.economiaPorcentagem.toFixed(0)}%</div>
                      <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Retorno de Capital</div>
                    </div>
                  </div>
                </div>

                {/* Cards Comparativos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ComparisonCard type="financiamento" data={simulacao.financiamento} formatCurrency={formatCurrency} />
                  <ComparisonCard type="consorcio" data={simulacao.consorcio} formatCurrency={formatCurrency} isRecommended />
                </div>

                {/* Ações */}
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => {
                      const html = generatePrintHTML(tipoBem, valorCredito, configs, simulacao);
                      const win = window.open('', '_blank');
                      win?.document.write(html);
                      win?.document.close();
                    }}
                    className="flex-1 py-5 glass hover:bg-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                  >
                    <FileText size={18} className="text-blue-500" /> Baixar Proposta Executiva
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 mt-20">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Engine de Inteligência de Crédito &copy; 2025</p>
      </footer>
    </div>
  );
}
