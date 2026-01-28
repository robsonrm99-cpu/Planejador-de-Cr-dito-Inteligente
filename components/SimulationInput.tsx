
import React from 'react';

interface SimulationInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: 'red' | 'emerald';
}

const SimulationInput: React.FC<SimulationInputProps> = ({ label, value, onChange, color }) => {
  return (
    <div className="space-y-2">
      <label className="text-[9px] uppercase font-black text-slate-600 tracking-[0.2em] ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-black text-xs transition-colors group-focus-within:text-slate-400">R$</div>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className={`
            w-full bg-black/40 border border-white/5 pl-10 pr-4 py-3.5 rounded-xl text-lg font-black text-white outline-none transition-all
            ${color === 'red' ? 'focus:border-red-500/50' : 'focus:border-emerald-500/50'}
          `}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default SimulationInput;
