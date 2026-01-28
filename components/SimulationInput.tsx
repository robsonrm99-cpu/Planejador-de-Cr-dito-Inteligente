
import React from 'react';

interface SimulationInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: 'red' | 'emerald' | 'blue';
  large?: boolean;
}

const SimulationInput: React.FC<SimulationInputProps> = ({ label, value, onChange, color, large }) => {
  const colorClasses = {
    red: 'focus:border-red-500 focus:ring-red-100 text-red-700',
    emerald: 'focus:border-emerald-500 focus:ring-emerald-100 text-emerald-700',
    blue: 'focus:border-blue-500 focus:ring-blue-100 text-blue-700'
  };

  return (
    <div>
      <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 px-1">
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">R$</span>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className={`
            w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 
            outline-none transition-all duration-300
            ${large ? 'text-2xl font-black' : 'text-lg font-bold'}
            ${colorClasses[color]}
          `} 
        />
      </div>
    </div>
  );
};

export default SimulationInput;
