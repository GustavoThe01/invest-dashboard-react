import React, { useState } from 'react';
import { useInvestments } from '../context/InvestmentsContext';
import { generateInvestmentInsight } from '../services/marketService';
import { TEXTS } from '../utils/financeUtils';

export const GeminiInsight: React.FC = () => {
  const { assets, language } = useInvestments();
  const [insight, setInsight] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const t = TEXTS[language].insight;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await generateInvestmentInsight(assets, language);
    setInsight(result);
    setAnalyzing(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 shadow-lg border border-indigo-700/50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-indigo-200 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            {t.title}
          </h3>
          {!insight && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.thinking}
                </>
              ) : (
                t.button
              )}
            </button>
          )}
        </div>

        {insight && (
          <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800/50">
            <p className="text-indigo-100 text-sm leading-relaxed">{insight}</p>
            <button 
              onClick={() => setInsight(null)} 
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              {t.refresh}
            </button>
          </div>
        )}

        {!insight && !analyzing && (
           <p className="text-indigo-300/60 text-sm">
             {t.placeholder}
           </p>
        )}
      </div>
    </div>
  );
};