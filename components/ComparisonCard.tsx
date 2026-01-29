import React from 'react';
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
      relative rounded-[3rem] p-10 flex flex-col justify-between overflow-hidden transition-all duration-500
      ${isFinance 
        ? 'bg-white border border-slate-200 shadow-sm' 
        : 'bg-white border-2 border-emerald-500 shadow-2xl premium-shadow ring-4 ring-emerald-500/5'
      }
    `}>
      {/* Background patterns */}
      {!isFinance && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px] -mr-20 -mt-20"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isFinance ? 'text-slate-400' : 'text-emerald-600'}`}>
                {isFinance ? 'Canal Bancário' : 'Estratégia Elite'}
              </span>
              {!isFinance && <Sparkles size={10} className="text-emerald-500" />}
            </div>
            <h3 className={`text-3xl font-black tracking-tighter uppercase italic text-slate-900`}>
              {isFinance ? 'Financiamento' : 'Carta de Crédito'}
            </h3>
          </div>
          {isRecommended && (
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
               MELHOR ESCOLHA <ArrowUpRight size={14} />
            </div>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl lg:text-6xl font-black tracking-tighter ${isFinance ? 'text-slate-900' : 'text-emerald-600'}`}>
              {formatCurrency(isFinance ? financeData.parcela : consortiumData.parcela)}
            </span>
            <span className={`text-slate-400 font-bold text-xs uppercase tracking-widest`}>/mês</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-10">
          <div className={`flex items-center justify-between p-5 rounded-[1.5rem] border ${isFinance ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prazo Total</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black text-slate-900`}>{isFinance ? (financeData.prazoEstimado || 0) : consortiumData.prazoEstimado}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Meses</span>
            </div>
          </div>

          <div className={`flex items-center justify-between p-5 rounded-[1.5rem] border ${isFinance ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
            <div className="flex items-center gap-3">
              <Percent size={16} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isFinance ? 'Juros / Taxas' : 'Custo Adm'}</span>
            </div>
            <div className={`font-black uppercase tracking-tighter ${isFinance ? 'text-red-500 text-sm' : 'text-emerald-600 text-2xl'}`}>
               {isFinance ? 'Altos Juros' : 'Taxa Diluída'}
            </div>
          </div>
        </div>
      </div>

      <div className={`space-y-6 pt-8 border-t border-slate-100 relative z-10`}>
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Wallet size={16} className="text-slate-400" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total a ser Pago</span>
           </div>
           <span className={`text-2xl font-black tracking-tighter text-slate-900`}>
              {formatCurrency(isFinance ? financeData.total : consortiumData.total)}
           </span>
        </div>
        
        <div className={`flex justify-between items-center p-5 rounded-2xl ${isFinance ? 'bg-slate-100' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'}`}>
           <div className="space-y-0.5">
             <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isFinance ? 'text-slate-500' : 'text-emerald-100'}`}>Aporte Inicial</span>
             <span className={`text-lg font-black block leading-none`}>
                {formatCurrency(isFinance ? financeData.entrada : consortiumData.lance)}
             </span>
           </div>
           {!isFinance ? (
             <CheckCircle className="text-emerald-200" size={24} strokeWidth={3} />
           ) : (
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pagamento à Vista</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;