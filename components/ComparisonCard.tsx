
import React from 'react';
/* Added CheckCircle to imports */
import { ArrowUpRight, Clock, Percent, Wallet, Sparkles, CheckCircle } from 'lucide-react';
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
      relative rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden transition-all duration-700
      ${isFinance 
        ? 'glass border-white/5 bg-white/[0.01]' 
        : 'bg-white border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/20'
      }
    `}>
      {/* Glow effect for recommended */}
      {!isFinance && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      )}
      
      <div>
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isFinance ? 'text-slate-600' : 'text-emerald-500'}`}>
                {isFinance ? 'Canal Convencional' : 'Canal Estratégico'}
              </span>
              {!isFinance && <Sparkles size={10} className="text-emerald-500" />}
            </div>
            <h3 className={`text-3xl font-black tracking-tighter uppercase italic ${isFinance ? 'text-white' : 'text-slate-900'}`}>
              {isFinance ? 'Financiamento' : 'Carta de Crédito'}
            </h3>
          </div>
          {isRecommended && (
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/30">
               TOP <ArrowUpRight size={14} />
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-baseline gap-2.5">
            <span className={`text-5xl lg:text-6xl font-black tracking-tighter ${isFinance ? 'text-white' : 'text-emerald-600'}`}>
              {formatCurrency(isFinance ? financeData.parcela : consortiumData.parcela)}
            </span>
            <span className={`${isFinance ? 'text-slate-600' : 'text-slate-400'} font-black text-xs uppercase tracking-widest`}>/ Mês</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
          <div className={`flex items-center justify-between p-5 rounded-2xl border ${isFinance ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tempo de Contrato</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${isFinance ? 'text-white' : 'text-slate-900'}`}>{isFinance ? (financeData.prazoEstimado || 0) : consortiumData.prazoEstimado}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Meses</span>
            </div>
          </div>

          <div className={`flex items-center justify-between p-5 rounded-2xl border ${isFinance ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <Percent size={18} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isFinance ? 'Custo de Juros' : 'Taxa de Adm'}</span>
            </div>
            <div className={`font-black uppercase tracking-tighter ${isFinance ? 'text-red-400 text-sm' : 'text-emerald-600 text-2xl'}`}>
               {isFinance ? 'Variável (Selic+CET)' : '26% Total'}
            </div>
          </div>
        </div>
      </div>

      <div className={`space-y-6 pt-8 border-t ${isFinance ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Wallet size={16} className="text-slate-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Custo Final Estimado</span>
           </div>
           <span className={`text-2xl font-black tracking-tighter ${isFinance ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(isFinance ? financeData.total : consortiumData.total)}
           </span>
        </div>
        
        <div className="flex justify-between items-center px-1">
           <div className="space-y-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Entrada Inicial</span>
             <span className={`text-sm font-black block leading-none ${isFinance ? 'text-slate-300' : 'text-emerald-700'}`}>
                {formatCurrency(isFinance ? financeData.entrada : consortiumData.lance)}
             </span>
           </div>
           {!isFinance && (
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={20} strokeWidth={3} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
