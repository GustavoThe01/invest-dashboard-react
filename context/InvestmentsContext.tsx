import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Asset, InvestmentContextType, Currency, Language, PriceAlert, Notification } from '../types';
import { fetchAssetPrices } from '../services/marketService';
import { TEXTS, formatCurrency } from '../utils/financeUtils';

const InvestmentsContext = createContext<InvestmentContextType | undefined>(undefined);

// Top 20 Assets with correct CoinGecko IDs
const INITIAL_ASSETS: Asset[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'the-open-network', name: 'Toncoin', symbol: 'TON', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'tron', name: 'TRON', symbol: 'TRX', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'matic-network', name: 'Polygon', symbol: 'POL', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', currentPrice: 0, change24h: 0, change1h: 0 },
  { id: 'fetch-ai', name: 'Artificial Superintelligence', symbol: 'FET', currentPrice: 0, change24h: 0, change1h: 0 },
];

export const InvestmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [language, setLanguage] = useState<Language>('en');
  
  // New State
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Refs to access latest state inside intervals/callbacks without dependencies
  const alertsRef = useRef(alerts);
  const languageRef = useRef(language);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addAlert = (assetId: string, targetPrice: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const condition = targetPrice > asset.currentPrice ? 'above' : 'below';
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      assetId,
      assetName: asset.name,
      targetPrice,
      condition
    };

    setAlerts(prev => [...prev, newAlert]);
    
    const t = TEXTS[language].alerts;
    addNotification(`${t.created} ${asset.name}: ${formatCurrency(targetPrice, 'USD')}`, 'info');
  };

  const checkAlerts = (newAssets: Asset[]) => {
    const currentAlerts = alertsRef.current;
    const triggeredAlertIds: string[] = [];

    currentAlerts.forEach(alert => {
      const asset = newAssets.find(a => a.id === alert.assetId);
      if (!asset) return;

      let triggered = false;
      const t = TEXTS[languageRef.current].alerts;

      if (alert.condition === 'above' && asset.currentPrice >= alert.targetPrice) {
        triggered = true;
        addNotification(`${t.triggered} ${alert.assetName} ${t.crossedAbove} ${formatCurrency(alert.targetPrice, 'USD')}`, 'alert');
      } else if (alert.condition === 'below' && asset.currentPrice <= alert.targetPrice) {
        triggered = true;
        addNotification(`${t.triggered} ${alert.assetName} ${t.crossedBelow} ${formatCurrency(alert.targetPrice, 'USD')}`, 'alert');
      }

      if (triggered) {
        triggeredAlertIds.push(alert.id);
      }
    });

    if (triggeredAlertIds.length > 0) {
      setAlerts(prev => prev.filter(a => !triggeredAlertIds.includes(a.id)));
    }
  };

  const refreshPrices = useCallback(async () => {
    // Only set loading true if it's the initial load (prices are 0)
    // For auto-refresh, we don't want to flash the loading state
    const isInitialLoad = assets.length > 0 && assets[0].currentPrice === 0;
    if (isInitialLoad) setLoading(true);
    
    setError(null);
    try {
      const ids = assets.map(a => a.id);
      const marketData = await fetchAssetPrices(ids);
      
      const updatedAssets = assets.map(asset => {
        const data = marketData[asset.id];
        if (!data) return asset; // Keep existing data if fetch misses one

        return {
          ...asset,
          currentPrice: data.price,
          change24h: data.change24h,
          change1h: data.change1h
        };
      });

      setAssets(updatedAssets);
      checkAlerts(updatedAssets);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update prices");
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [assets]); 

  // Initial load
  useEffect(() => {
    refreshPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto Refresh Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        refreshPrices();
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh, refreshPrices]);

  return (
    <InvestmentsContext.Provider value={{ 
      assets, 
      loading, 
      error, 
      currency, 
      setCurrency, 
      language,
      setLanguage,
      refreshPrices,
      isAutoRefresh,
      setIsAutoRefresh,
      addAlert,
      notifications,
      dismissNotification
    }}>
      {children}
    </InvestmentsContext.Provider>
  );
};

export const useInvestments = () => {
  const context = useContext(InvestmentsContext);
  if (!context) {
    throw new Error('useInvestments must be used within an InvestmentsProvider');
  }
  return context;
};