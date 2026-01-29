import React from 'react';

interface SimulationInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: 'red' | 'emerald';
}

const SimulationInput: React.FC<SimulationInputProps> = ({ label, value, onChange, color }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs transition-colors group-focus-within:text-slate-600">R$</div>
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className={`
            w-full bg-white border border-slate-200 pl-10 pr-4 py-4 rounded-2xl text-lg font-black text-slate-900 outline-none transition-all
            ${color === 'red' ? 'focus:border-red-400 shadow-sm' : 'focus:border-emerald-400 shadow-sm'}
          `}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default SimulationInput;