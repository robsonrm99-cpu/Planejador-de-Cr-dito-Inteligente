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

  const handleValorCreditoChange = (novoValor: number) => {
    setValorCredito(novoValor);
    setEntradaFinan(novoValor * 0.4);
    setLanceConsorcio(novoValor * 0.3);
    if (tipoBem === 'veiculo') {
      setParcelaAlvoFinan(Math.round(novoValor * 0.037));
      setParcelaAlvoConsorcio(Math.round(novoValor * 0.02));
    } else {
      setParcelaAlvoFinan(Math.round(novoValor * 0.0125));
      setParcelaAlvoConsorcio(Math.round(novoValor * 0.0075));
    }
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/10">
              <PieChart size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-black italic tracking-tighter uppercase text-slate-900">ELITE<span className="text-blue-600">CREDIT</span></span>
              <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">High Performance Decision System</p>
            </div>
          </div>
          <div className="flex gap-6">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest cursor-pointer border-b-2 border-blue-600 pb-1">Análise Estratégica</span>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-colors">Relatórios</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Painel de Controle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600">
                <Target size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Planejamento</h2>
              </div>
              <p className="text-slate-500 text-sm font-medium">Parâmetros de aquisição.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setTipoBem('veiculo')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tipoBem === 'veiculo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Car size={14} /> Veículo
              </button>
              <button 
                onClick={() => setTipoBem('imovel')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${tipoBem === 'imovel' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Home size={14} /> Imóvel
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Valor do Objetivo</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-blue-600 transition-colors">R$</span>
                <input 
                  type="number"
                  value={valorCredito}
                  onChange={(e) => handleValorCreditoChange(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 text-2xl font-black text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                  <Percent size={12} /> Projeção Bancária
                </h3>
                <SimulationInput label="Aporte de Entrada (40%)" value={entradaFinan} onChange={setEntradaFinan} color="red" />
                <SimulationInput label="Parcela Máxima" value={parcelaAlvoFinan} onChange={setParcelaAlvoFinan} color="red" />
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                  <CheckCircle size={12} /> Projeção Inteligente
                </h3>
                <SimulationInput label="Entrada (adesão)" value={lanceConsorcio} onChange={setLanceConsorcio} color="emerald" />
                <SimulationInput label="Parcela Ideal" value={parcelaAlvoConsorcio} onChange={setParcelaAlvoConsorcio} color="emerald" />
              </div>
            </div>

            <button 
              onClick={() => setShowResults(true)}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest btn-primary-glow"
            >
              <Zap size={16} fill="currentColor" /> Processar Análise
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-8">
          {!showResults ? (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="text-slate-300" size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter italic">Simulação Aguardando</h3>
              <p className="text-slate-400 max-w-xs text-sm mt-2 font-medium">Insira os valores no painel lateral para visualizar a inteligência comparativa.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Card de Economia Hero */}
              <div className="bg-white rounded-[3rem] p-12 border border-slate-200 premium-shadow flex flex-col md:flex-row justify-between items-center gap-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
                <div className="space-y-2 text-center md:text-left relative z-10">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-[0.3em]">Eficiência Máxima Detectada</span>
                  <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter mt-4">
                    Economia Real de <br />
                    <span className="text-emerald-600">
                      {formatCurrency(simulacao.economia)}
                    </span>
                  </h2>
                </div>
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center min-w-[220px] shadow-2xl relative z-10">
                  <p className="text-6xl font-black text-emerald-400 leading-none">{simulacao.economiaPorcentagem.toFixed(0)}%</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-4">Poder de Alavancagem</p>
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
                className="w-full py-6 bg-white border border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-4 hover:bg-slate-50 hover:text-slate-900 transition-all group shadow-sm"
              >
                <FileText size={18} className="text-blue-600 group-hover:scale-110 transition-transform" /> 
                Exportar Proposta Comercial Executiva (PDF)
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-slate-200 mt-auto bg-white">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Proprietary Credit Algorithm &copy; 2025 ELITE STRATEGY</p>
      </footer>
    </div>
  );
}