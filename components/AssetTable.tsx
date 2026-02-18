import React, { useState } from 'react';
import { useInvestments } from '../context/InvestmentsContext';
import { 
  formatCurrency, 
  formatPercentage,
  EXCHANGE_RATE_BRL,
  TEXTS
} from '../utils/financeUtils';

export const AssetTable: React.FC = () => {
  const { assets, loading, error, currency, language, addAlert } = useInvestments();
  const [alertConfig, setAlertConfig] = useState<{ id: string; name: string } | null>(null);
  const [alertPrice, setAlertPrice] = useState<string>('');
  
  const t = TEXTS[language].table;

  // Handler to open the "modal"
  const handleSetAlertClick = (id: string, name: string) => {
    setAlertConfig({ id, name });
    setAlertPrice('');
  };

  // Handler to submit alert
  const submitAlert = () => {
    if (alertConfig && alertPrice) {
      addAlert(alertConfig.id, parseFloat(alertPrice));
      setAlertConfig(null);
    }
  };

  // Skeleton Loading State
  if (loading && assets.every(a => a.currentPrice === 0)) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
           <div className="h-7 w-32 bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50">
              <tr>
                {[1, 2, 3, 4, 5].map(i => (
                  <th key={i} className="px-6 py-4"><div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {[...Array(8)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse mr-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right"><div className="h-5 w-20 bg-slate-700 rounded animate-pulse ml-auto"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-5 w-16 bg-slate-700 rounded animate-pulse ml-auto"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-5 w-16 bg-slate-700 rounded animate-pulse ml-auto"></div></td>
                  <td className="px-6 py-4 text-center"><div className="h-6 w-6 bg-slate-700 rounded-full animate-pulse mx-auto"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-rose-900/20 text-rose-400 rounded-lg border border-rose-900">{error}</div>;
  }

  // Rate multiplier (1 for USD, EXCHANGE_RATE_BRL for BRL)
  const rate = currency === 'BRL' ? EXCHANGE_RATE_BRL : 1;

  // Helper to render change percentage
  const ChangeCell = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <div className={`font-semibold inline-flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
            </svg>
          )}
          {formatPercentage(value)}
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden relative">
      
      {/* Alert Setting Modal/Overlay */}
      {alertConfig && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 shadow-2xl w-full max-w-sm transform scale-100 transition-all">
            <h3 className="text-lg font-bold text-white mb-4">{t.setAlert} - {alertConfig.name}</h3>
            
            <label className="block text-xs text-slate-400 mb-1 uppercase font-semibold">{t.targetPrice} (USD)</label>
            <input 
              type="number" 
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 mb-6"
              autoFocus
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setAlertConfig(null)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                onClick={submitAlert}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">Live Updates</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">{t.colAsset}</th>
              <th className="px-6 py-4 text-right">{t.colPrice} ({currency})</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">{t.colChange1h}</th>
              <th className="px-6 py-4 text-right whitespace-nowrap">{t.colChange24h}</th>
              <th className="px-6 py-4 text-center">{t.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {assets.map((asset) => {
              return (
                <tr key={asset.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold mr-3 text-white">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{asset.name}</div>
                        <div className="text-xs text-slate-500">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-200 text-lg">
                    {formatCurrency(asset.currentPrice * rate, currency)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChangeCell value={asset.change1h} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChangeCell value={asset.change24h} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleSetAlertClick(asset.id, asset.name)}
                      className="text-slate-500 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-slate-700/50 focus:outline-none"
                      title={t.setAlert}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};