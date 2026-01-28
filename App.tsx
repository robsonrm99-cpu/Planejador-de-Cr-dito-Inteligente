
import { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Car, 
  Home, 
  Percent, 
  CheckCircle, 
  FileText, 
  Loader2, 
  Zap
} from 'lucide-react';
import { AssetType, SimulationResult, Configs } from './types';

// Components
import SimulationInput from './components/SimulationInput';
import ComparisonCard from './components/ComparisonCard';
import { generatePrintHTML } from './services/printing';

export default function App() {
  // --- STATES ---
  const [tipoBem, setTipoBem] = useState<AssetType>('veiculo');
  const [valorCredito, setValorCredito] = useState(50000);
  const [showResults, setShowResults] = useState(false);
  const [printStatus, setPrintStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Valores iniciais baseados no modelo fornecido (Ex: Veículo 50k)
  // Entrada pre-selecionada em 40% (50000 * 0.4 = 20000)
  const [entradaFinan, setEntradaFinan] = useState(20000);
  const [parcelaAlvoFinan, setParcelaAlvoFinan] = useState(1850);
  const [lanceConsorcio, setLanceConsorcio] = useState(15000); 
  const [parcelaAlvoConsorcio, setParcelaAlvoConsorcio] = useState(1000);

  // --- CONFIGS ---
  const configs = useMemo<Configs>(() => {
    if (tipoBem === 'imovel') {
      return { taxaConsorcioFixa: 26, maxMeses: 240 };
    }
    return { taxaConsorcioFixa: 26, maxMeses: 150 };
  }, [tipoBem]);

  useEffect(() => {
    if (tipoBem === 'imovel') {
      const newValor = 200000;
      setValorCredito(newValor);
      setParcelaAlvoFinan(2500);
      setParcelaAlvoConsorcio(1500);
      setEntradaFinan(newValor * 0.4); // 40% padrão solicitado
      setLanceConsorcio(newValor * 0.3); // 30% default
    } else {
      const newValor = 50000;
      setValorCredito(newValor);
      setParcelaAlvoFinan(1850); 
      setParcelaAlvoConsorcio(1000);
      setEntradaFinan(newValor * 0.4); // 40% padrão solicitado
      setLanceConsorcio(newValor * 0.3);
    }
    setShowResults(false);
  }, [tipoBem]);

  const handleValorCreditoChange = (newVal: number) => {
    setValorCredito(newVal);
    setEntradaFinan(newVal * 0.4); // Mantém a entrada em 40% do novo valor
    setLanceConsorcio(newVal * 0.3);
  };

  const simulacao = useMemo<SimulationResult>(() => {
    // FINANCIAMENTO
    const saldoDevedorFinan = Math.max(0, valorCredito - entradaFinan);
    const saldoAPagarFinanciamentoEstimado = (saldoDevedorFinan * 2.8);
    
    let mesesFinan = 0;
    let erroFinan = null;

    if (saldoDevedorFinan > 0) {
      if (parcelaAlvoFinan > 0) {
         mesesFinan = Math.ceil(saldoAPagarFinanciamentoEstimado / parcelaAlvoFinan);
         if (mesesFinan > 420) erroFinan = "Prazo excede limite bancário.";
      } else {
         erroFinan = "Defina uma parcela.";
      }
    }
    
    // CÁLCULO EXATO PARA CALCULADORA: (Parcela * Prazo) + Entrada
    const totalFinan = (!erroFinan && mesesFinan > 0) ? (parcelaAlvoFinan * mesesFinan) + entradaFinan : entradaFinan;
    const jurosTotaisFinan = totalFinan - valorCredito;

    // CONSÓRCIO
    const valorTotalBase = valorCredito * (1 + (configs.taxaConsorcioFixa / 100)); 
    const saldoFaltante = Math.max(0, valorTotalBase - lanceConsorcio); 
    
    let mesesConsorcio = 0;
    if (parcelaAlvoConsorcio > 0) {
        mesesConsorcio = Math.ceil(saldoFaltante / parcelaAlvoConsorcio);
    }

    // CÁLCULO EXATO PARA CALCULADORA: (Parcela * Prazo) + Lance
    const saldoFinalParcelado = parcelaAlvoConsorcio * mesesConsorcio;
    const totalPagoConsorcio = saldoFinalParcelado + lanceConsorcio;
    
    const economia = totalFinan - totalPagoConsorcio;
    const economiaPorcentagem = totalFinan > 0 ? (economia / totalFinan) * 100 : 0;

    return {
      financiamento: {
        prazoEstimado: mesesFinan,
        total: totalFinan,
        jurosPagos: jurosTotaisFinan,
        valorFinanciado: saldoDevedorFinan,
        erro: erroFinan,
        entrada: entradaFinan,
        parcela: parcelaAlvoFinan
      },
      consorcio: {
        prazoEstimado: mesesConsorcio,
        total: totalPagoConsorcio,
        lance: lanceConsorcio,
        parcela: parcelaAlvoConsorcio,
        saldoDevedor: saldoFinalParcelado, 
        valorBase: valorTotalBase
      },
      economia,
      economiaPorcentagem
    };
  }, [valorCredito, entradaFinan, parcelaAlvoFinan, lanceConsorcio, parcelaAlvoConsorcio, configs]);

  const handlePrint = () => {
    setPrintStatus('loading');
    const html = generatePrintHTML(tipoBem, valorCredito, configs, simulacao);
    
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      setPrintStatus('success');
      setTimeout(() => setPrintStatus('idle'), 2000);
    } else {
      setPrintStatus('error');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white pt-10 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 mb-6 inline-flex shadow-xl">
            <Calculator size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Planejador de <span className="text-blue-400">Crédito Inteligente</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Compare o financiamento bancário com a estratégia de planejamento via carta de crédito.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-12 pb-24 relative z-20">
        <div className="space-y-8">
          
          <section className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 p-6 md:p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Bem Selecionado</label>
                <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <button onClick={() => setTipoBem('veiculo')} className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all ${tipoBem === 'veiculo' ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500'}`}>
                    <Car size={20} /> Veículo
                  </button>
                  <button onClick={() => setTipoBem('imovel')} className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all ${tipoBem === 'imovel' ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500'}`}>
                    <Home size={20} /> Imóvel
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Valor Total do Crédito</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-lg text-slate-400 group-focus-within:text-blue-500">R$</span>
                  <input type="number" value={valorCredito} onChange={(e) => handleValorCreditoChange(Number(e.target.value))} className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none text-3xl font-black text-slate-800 transition-all" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-lg">
                <div className="flex items-center gap-4 mb-8 text-red-600">
                  <Percent size={24} />
                  <h3 className="text-xl font-bold text-slate-800">Cenário Financiamento</h3>
                </div>
                <div className="space-y-6">
                  <SimulationInput label="Aporte Inicial (Entrada)" value={entradaFinan} onChange={setEntradaFinan} color="red" />
                  <SimulationInput label="Parcela Pretendida" value={parcelaAlvoFinan} onChange={setParcelaAlvoFinan} color="red" large />
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-lg">
                <div className="flex items-center gap-4 mb-8 text-emerald-600">
                  <CheckCircle size={24} />
                  <h3 className="text-xl font-bold text-slate-800">Estratégia de Crédito</h3>
                </div>
                <div className="space-y-6">
                  <SimulationInput label="Adesão ou Lance" value={lanceConsorcio} onChange={setLanceConsorcio} color="emerald" />
                  <SimulationInput label="Parcela Planejada" value={parcelaAlvoConsorcio} onChange={setParcelaAlvoConsorcio} color="emerald" large />
                </div>
            </div>
          </div>

          {!showResults && (
            <button onClick={() => setShowResults(true)} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-4 text-xl transition-all hover:bg-black active:scale-[0.98]">
              <Zap size={24} className="text-yellow-400" /> Analisar Comparativo
            </button>
          )}

          {showResults && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ComparisonCard type="financiamento" data={simulacao.financiamento} formatCurrency={formatCurrency} />
                <ComparisonCard type="consorcio" data={simulacao.consorcio} formatCurrency={formatCurrency} isRecommended />
              </div>

              <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Capital Preservado</h3>
                    <span className="text-5xl md:text-7xl font-black text-emerald-400 tracking-tighter">
                      {formatCurrency(simulacao.economia)}
                    </span>
                    <p className="text-slate-400 text-lg mt-4 max-w-xl">
                      Economia real ao optar pelo planejamento estratégico em vez dos juros bancários tradicionais.
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 px-8 py-6 rounded-3xl border border-emerald-500/30 text-center min-w-[160px]">
                    <p className="text-5xl font-black text-emerald-400">{simulacao.economiaPorcentagem.toFixed(0)}%</p>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Custo Reduzido</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button onClick={handlePrint} disabled={printStatus === 'loading'} className="group flex items-center gap-4 px-12 py-5 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-full shadow-xl font-black transition-all active:scale-95 text-xl">
                  {printStatus === 'loading' ? <Loader2 className="animate-spin" /> : <FileText className="group-hover:scale-110 transition-transform" />}
                  Gerar Proposta PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
        Sistema de Inteligência Financeira &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
