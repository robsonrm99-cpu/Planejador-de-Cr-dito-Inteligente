
import React from 'react';
import { Calendar, TrendingDown, Info, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { FinanceResult, ConsortiumResult } from '../types';

interface ComparisonCardProps {
  type: 'financiamento' | 'consorcio';
  data: FinanceResult | ConsortiumResult;
  formatCurrency: (val: number) => string;
  isRecommended?: boolean;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ type, data, formatCurrency, isRecommended }) => {
  const isFinance = type === 'financiamento';
  const financeData = data as FinanceResult;
  const consortiumData = data as ConsortiumResult;

  return (
    <div className={`
      relative rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 glass
      ${isFinance ? 'border-white/5' : 'border-emerald-500/30 ring-1 ring-emerald-500/10'}
    `}>
      
      <div>
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${isFinance ? 'text-slate-600' : 'text-emerald-500'}`}>
              {isFinance ? 'Modalidade Banco' : 'Estratégia Inteligente'}
            </span>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              {isFinance ? 'Financiamento' : 'Carta de Crédito'}
            </h3>
          </div>
          {isRecommended && (
            <div className="bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
               TOP <ArrowUpRight size={12} />
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-black tracking-tighter ${isFinance ? 'text-white' : 'text-emerald-500'}`}>
              {formatCurrency(isFinance ? financeData.parcela : consortiumData.parcela)}
            </span>
            <span className="text-slate-600 font-bold text-[10px] uppercase">/ Mês</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Tempo</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{isFinance ? (financeData.prazoEstimado || 0) : consortiumData.prazoEstimado}</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">Meses</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-[8px] font-black text-slate-600 uppercase mb-1">{isFinance ? 'Juros' : 'Taxas'}</div>
            <div className={`text-2xl font-black ${isFinance ? 'text-red-500' : 'text-emerald-500'}`}>
               {isFinance ? '180%+' : '26%'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
           <span>Total Investido</span>
           <span className="text-white text-lg font-black tracking-tighter">
              {formatCurrency(isFinance ? financeData.total : consortiumData.total)}
           </span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
           <div className="space-y-0.5">
             <span className="text-[8px] font-black text-slate-600 uppercase">Inicial</span>
             <span className="text-xs font-black text-slate-300 block leading-none">
                {formatCurrency(isFinance ? financeData.entrada : consortiumData.lance)}
             </span>
           </div>
           {!isFinance && <ShieldCheck className="text-emerald-500/30" size={24} />}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
