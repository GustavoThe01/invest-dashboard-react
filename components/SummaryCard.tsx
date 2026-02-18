import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subValue, isPositive, icon }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-slate-400 bg-slate-700/50 p-2 rounded-lg">{icon}</div>}
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-white">{value}</span>
        {subValue && (
          <span className={`text-sm mt-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};