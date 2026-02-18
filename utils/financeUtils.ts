import { Currency } from '../types';

export const EXCHANGE_RATE_BRL = 5.80; // Updated realistic estimated rate

// Translation Dictionary
export const TEXTS = {
  en: {
    nav: {
      refresh: "Refresh",
      updating: "Updating...",
      autoRefresh: "Auto-Refresh",
    },
    header: {
      title: "Crypto Market Live",
      subtitle: "Real-time cryptocurrency prices and market analysis.",
    },
    insight: {
      title: "AI Market Analysis",
      button: "Analyze Market",
      thinking: "Analyzing...",
      refresh: "Refresh Analysis",
      placeholder: "Use Gemini AI to analyze current market trends and price movements for the top 20 assets.",
      error: "AI Analysis currently unavailable due to connectivity issues.",
      apiKeyError: "API Key is missing. Please configure your environment to use AI features.",
    },
    table: {
      title: "Top 20 Assets",
      colAsset: "Asset",
      colPrice: "Current Price",
      colChange1h: "1h %",
      colChange24h: "24h %",
      colActions: "Alerts",
      setAlert: "Set Alert",
      targetPrice: "Target Price",
      cancel: "Cancel",
      save: "Save",
    },
    alerts: {
      created: "Alert set for",
      triggered: "Price Alert!",
      crossedAbove: "crossed above",
      crossedBelow: "dropped below",
    }
  },
  'pt-BR': {
    nav: {
      refresh: "Atualizar",
      updating: "Atualizando...",
      autoRefresh: "Auto-Atualizar",
    },
    header: {
      title: "Mercado Cripto Ao Vivo",
      subtitle: "Preços de criptomoedas e análise de mercado em tempo real.",
    },
    insight: {
      title: "Análise de Mercado IA",
      button: "Analisar Mercado",
      thinking: "Analisando...",
      refresh: "Atualizar Análise",
      placeholder: "Use a IA Gemini para analisar as tendências atuais do mercado e movimentos de preço dos top 20 ativos.",
      error: "Análise de IA indisponível no momento devido a problemas de conexão.",
      apiKeyError: "Chave de API ausente. Configure seu ambiente para usar recursos de IA.",
    },
    table: {
      title: "Top 20 Ativos",
      colAsset: "Ativo",
      colPrice: "Preço Atual",
      colChange1h: "Var. 1h",
      colChange24h: "Var. 24h",
      colActions: "Alertas",
      setAlert: "Criar Alerta",
      targetPrice: "Preço Alvo",
      cancel: "Cancelar",
      save: "Salvar",
    },
    alerts: {
      created: "Alerta criado para",
      triggered: "Alerta de Preço!",
      crossedAbove: "subiu acima de",
      crossedBelow: "caiu abaixo de",
    }
  }
};

/**
 * Formats a number as currency.
 */
export const formatCurrency = (value: number, currency: Currency = 'USD'): string => {
  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';
  
  // High precision for small crypto values if needed, mostly for USD
  const maximumFractionDigits = value < 1 ? 6 : 2;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
};

/**
 * Formats a number as a percentage string.
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};