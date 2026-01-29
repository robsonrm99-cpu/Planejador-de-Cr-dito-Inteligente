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
      <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs transition-colors group-focus-within:text-white">R$</div>
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className={`
            w-full bg-slate-900/50 border border-white/5 pl-10 pr-4 py-3.5 rounded-xl text-lg font-black text-white outline-none transition-all
            ${color === 'red' ? 'focus:border-red-500/50 shadow-[0_0_15px_-5px_rgba(239,68,68,0.2)]' : 'focus:border-emerald-500/50 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]'}
          `}
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default SimulationInput;