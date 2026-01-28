
import React from 'react';
import { Calendar, TrendingUp, Info } from 'lucide-react';
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
      relative rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl transition-all duration-500 group overflow-hidden
      ${isFinance 
        ? 'bg-white border-2 border-red-100' 
        : 'bg-white border-2 border-emerald-500 ring-4 ring-emerald-50/50'
      }
      ${isRecommended ? 'md:-translate-y-6 md:z-30' : 'md:z-10'}
    `}>
      {/* Decorative Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-2 ${isFinance ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
      
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className={`text-2xl font-black ${isFinance ? 'text-slate-700' : 'text-slate-800'}`}>
            {isFinance ? 'Financiamento' : 'Carta de Crédito'}
          </h3>
          <span className={`
            text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border
            ${isFinance 
              ? 'bg-red-50 text-red-600 border-red-100' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }
          `}>
            {isFinance ? 'Tradicional' : 'Recomendado'}
          </span>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Investimento Mensal</p>
          <p className={`text-4xl font-black ${isFinance ? 'text-slate-800' : 'text-emerald-600'}`}>
            {formatCurrency(isFinance ? financeData.parcela : consortiumData.parcela)}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {isFinance ? (
               <span className="text-[11px] font-semibold text-red-400 bg-red-50 px-2 py-0.5 rounded">CET: Juros Compostos</span>
            ) : (
               <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Taxa Fixa Mensal</span>
            )}
          </div>
        </div>

        <div className={`
          p-6 rounded-3xl border mb-10
          ${isFinance ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-200'}
        `}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className={isFinance ? 'text-red-500' : 'text-emerald-500'} />
            <span className={`text-sm font-bold uppercase tracking-widest ${isFinance ? 'text-red-800' : 'text-emerald-800'}`}>Prazo Estimado</span>
          </div>

          {isFinance && financeData.erro ? (
             <p className="text-xl font-bold text-red-600">Proposta Inválida</p>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                {isFinance ? financeData.prazoEstimado : consortiumData.prazoEstimado}
              </span>
              <span className="text-slate-500 font-bold uppercase text-xs">meses</span>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between border-t border-white/50 pt-4">
             <span className="text-xs text-slate-500 font-medium italic">
                Aprox. {((isFinance ? financeData.prazoEstimado : consortiumData.prazoEstimado) / 12).toFixed(1)} anos
             </span>
             {isFinance && (
               <div className="flex items-center gap-1 text-red-600/60">
                 <TrendingUp size={14}/>
                 <span className="text-[10px] font-bold">Inflação Bancária</span>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t-2 border-slate-50 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aporte Inicial</span>
          <span className={`font-bold ${isFinance ? 'text-slate-700' : 'text-blue-600'}`}>
            {formatCurrency(isFinance ? financeData.entrada : consortiumData.lance)}
          </span>
        </div>

        {isFinance ? (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Juros Estimados</span>
            <span className="font-bold text-red-500">
              {formatCurrency(financeData.jurosPagos)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Custo Operacional</span>
            <span className="font-bold text-emerald-600">
              Taxa Administrativa
            </span>
          </div>
        )}

        <div className={`
          flex justify-between items-center p-4 rounded-2xl mt-4
          ${isFinance ? 'bg-slate-50 border border-slate-100' : 'bg-emerald-500 text-white shadow-lg'}
        `}>
          <span className={`font-black uppercase text-[10px] tracking-widest ${isFinance ? 'text-slate-400' : 'text-white/80'}`}>Total Final</span>
          <span className="text-xl font-black tracking-tight">
            {formatCurrency(isFinance ? financeData.total : consortiumData.total)}
          </span>
        </div>
      </div>
      
      {isRecommended && (
        <div className="absolute top-10 right-8 -rotate-12 pointer-events-none opacity-5">
           <TrendingUp size={80} />
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;
