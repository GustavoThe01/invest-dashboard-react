export type Currency = 'USD' | 'BRL';
export type Language = 'en' | 'pt-BR';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  change24h: number; // Percentage change in last 24h
  change1h: number;  // Percentage change in last 1h
  logoUrl?: string;
}

export interface PriceAlert {
  id: string;
  assetId: string;
  assetName: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'alert';
}

export interface InvestmentContextType {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  refreshPrices: () => Promise<void>;
  
  // New features
  isAutoRefresh: boolean;
  setIsAutoRefresh: (enabled: boolean) => void;
  addAlert: (assetId: string, targetPrice: number) => void;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
}