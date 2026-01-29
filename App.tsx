import { useState, useMemo, useEffect } from 'react';
import { 
  Car, 
  Home, 
  Percent, 
  CheckCircle, 
  FileText, 
  Zap,
  TrendingUp,
  PieChart,
  Target
} from 'lucide-react';
import { AssetType, SimulationResult, Configs } from './types';

import SimulationInput from './components/SimulationInput';
import ComparisonCard from './components/ComparisonCard';
import { generatePrintHTML } from './services/printing';

export default function App() {
  const [tipoBem, setTipoBem] = useState<AssetType>('veiculo');
  const [valorCredito, setValorCredito] = useState(50000);
  const [showResults, setShowResults] = useState(false);
  
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg neon-glow-blue">
              <PieChart size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-black italic tracking-tighter uppercase">ELITE<span className="text-blue-500">CREDIT</span></span>
              <p className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">High Performance Systems</p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest cursor-pointer border-b border-blue-500/50 pb-1">Análise</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Relatórios</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Painel de Controle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-500">
                <Target size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Planejamento</h2>
              </div>
              <p className="text-slate-400 text-sm">Configure os parâmetros do objetivo.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl">
              <button 
                onClick={() => setTipoBem('veiculo')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${tipoBem === 'veiculo' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <Car size={14} /> Veículo
              </button>
              <button 
                onClick={() => setTipoBem('imovel')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${tipoBem === 'imovel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <Home size={14} /> Imóvel
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Valor do Crédito</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-600 group-focus-within:text-blue-500">R$</span>
                <input 
                  type="number"
                  value={valorCredito}
                  onChange={(e) => setValorCredito(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-2xl font-black text-white focus:border-blue-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                  <Percent size={12} /> Canal Bancário
                </h3>
                <SimulationInput label="Aporte de Entrada" value={entradaFinan} onChange={setEntradaFinan} color="red" />
                <SimulationInput label="Parcela Máxima" value={parcelaAlvoFinan} onChange={setParcelaAlvoFinan} color="red" />
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                  <CheckCircle size={12} /> Canal Estratégico
                </h3>
                <SimulationInput label="Entrada (adesão)" value={lanceConsorcio} onChange={setLanceConsorcio} color="emerald" />
                <SimulationInput label="Parcela Ideal" value={parcelaAlvoConsorcio} onChange={setParcelaAlvoConsorcio} color="emerald" />
              </div>
            </div>

            <button 
              onClick={() => setShowResults(true)}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20"
            >
              <Zap size={16} fill="currentColor" /> Calcular Estratégia
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-8">
          {!showResults ? (
            <div className="h-full flex flex-col items-center justify-center glass rounded-[3rem] border-dashed border-white/10 p-20 text-center">
              <TrendingUp className="text-slate-700 mb-6" size={64} />
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter italic">Simulação Pendente</h3>
              <p className="text-slate-600 max-w-xs text-sm mt-2">Defina os valores ao lado para processar a inteligência de crédito.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Card de Economia Hero */}
              <div className="glass rounded-[3rem] p-12 border-emerald-500/20 neon-glow-emerald flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Performance Alpha Detectada</span>
                  <h2 className="text-5xl font-black text-white italic tracking-tighter">
                    Economia de <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                      {formatCurrency(simulacao.economia)}
                    </span>
                  </h2>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-[2rem] p-10 text-center min-w-[200px]">
                  <p className="text-6xl font-black text-emerald-400 leading-none">{simulacao.economiaPorcentagem.toFixed(0)}%</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-4">Eficiência Financeira</p>
                </div>
              </div>

              {/* Grid de Comparação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ComparisonCard type="financiamento" data={simulacao.financiamento} formatCurrency={formatCurrency} />
                <ComparisonCard type="consorcio" data={simulacao.consorcio} formatCurrency={formatCurrency} isRecommended />
              </div>

              {/* Botão de PDF */}
              <button 
                onClick={() => {
                  const html = generatePrintHTML(tipoBem, valorCredito, configs, simulacao);
                  const win = window.open('', '_blank');
                  win?.document.write(html);
                  win?.document.close();
                }}
                className="w-full py-6 glass rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white/5 transition-all group"
              >
                <FileText size={18} className="text-blue-500 group-hover:scale-110 transition-transform" /> 
                Gerar Proposta Executiva em PDF
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-white/5">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Engine de Inteligência de Crédito &copy; 2025</p>
      </footer>
    </div>
  );
}