import React from 'react';
import { InvestmentsProvider, useInvestments } from './context/InvestmentsContext';
import { AssetTable } from './components/AssetTable';
import { GeminiInsight } from './components/GeminiInsight';
import { TEXTS } from './utils/financeUtils';

const Dashboard: React.FC = () => {
  const { 
    refreshPrices, 
    loading, 
    currency, 
    setCurrency, 
    language, 
    setLanguage,
    isAutoRefresh,
    setIsAutoRefresh,
    notifications,
    dismissNotification
  } = useInvestments();
  
  const t = TEXTS[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative">
      
      {/* Notification Toast Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`pointer-events-auto shadow-xl rounded-lg p-4 border flex items-start justify-between transform transition-all duration-300 animate-slide-in
              ${notification.type === 'alert' ? 'bg-rose-900/90 border-rose-700 text-white' : 'bg-slate-800/90 border-slate-600 text-slate-200'}
            `}
          >
            <div className="text-sm font-medium">{notification.message}</div>
            <button 
              onClick={() => dismissNotification(notification.id)}
              className="ml-4 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">MarketDash</span>
            </div>
            
            <div className="flex items-center gap-4">
              
              {/* Auto Refresh Toggle */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <span className="text-xs font-medium text-slate-400">{t.nav.autoRefresh}</span>
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAutoRefresh ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoRefresh ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'en' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('pt-BR')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${language === 'pt-BR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  PT
                </button>
              </div>

              {/* Currency Toggle */}
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === 'USD' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  USD
                </button>
                <button 
                  onClick={() => setCurrency('BRL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === 'BRL' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  BRL
                </button>
              </div>

              <button
                onClick={() => refreshPrices()}
                disabled={loading}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">{t.nav.updating}</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span className="hidden sm:inline">{t.nav.refresh}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold text-white">{t.header.title}</h1>
          <p className="text-slate-400 mt-1">{t.header.subtitle}</p>
        </header>

        {/* AI Insight Section */}
        <GeminiInsight />

        {/* Market Assets Table */}
        <AssetTable />

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <InvestmentsProvider>
      <Dashboard />
    </InvestmentsProvider>
  );
};

export default App;