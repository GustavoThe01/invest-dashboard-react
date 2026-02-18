import { Asset, Language } from '../types';
import { GoogleGenAI } from "@google/genai";
import { TEXTS } from '../utils/financeUtils';

interface MarketData {
  price: number;
  change24h: number;
  change1h: number;
}

// Simple in-memory cache to avoid hitting CoinGecko rate limits (approx 10-30 calls/min free tier)
let cache: { timestamp: number, data: Record<string, MarketData> } | null = null;
const CACHE_DURATION = 30000; // 30 seconds cache

/**
 * Fetches real asset prices from CoinGecko API.
 */
export const fetchAssetPrices = async (assetIds: string[]): Promise<Record<string, MarketData>> => {
  const now = Date.now();

  // Return cached data if valid
  if (cache && (now - cache.timestamp < CACHE_DURATION)) {
    return cache.data;
  }

  try {
    const idsParam = assetIds.join(',');
    // CoinGecko API v3 endpoint for market data including 1h and 24h changes
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited and we have cache (even if old), return it as fallback
        if (cache) {
            console.warn("Rate limit exceeded. Returning cached data.");
            return cache.data;
        }
        throw new Error("API Rate Limit Exceeded. Please wait a moment.");
      }
      throw new Error(`Market Data API Error: ${response.status}`);
    }

    const data = await response.json();
    const results: Record<string, MarketData> = {};

    if (Array.isArray(data)) {
        data.forEach((coin: any) => {
            results[coin.id] = {
                price: coin.current_price || 0,
                // CoinGecko returns null sometimes if data is missing
                change24h: coin.price_change_percentage_24h || 0,
                change1h: coin.price_change_percentage_1h_in_currency || 0
            };
        });
    }

    // Update cache
    cache = { timestamp: now, data: results };
    return results;

  } catch (error) {
    console.error("Failed to fetch market data:", error);
    // If fetch fails and we have cache, return it
    if (cache) return cache.data;
    throw error;
  }
};

/**
 * Uses Gemini to generate a market analysis.
 */
export const generateInvestmentInsight = async (assets: Asset[], language: Language): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return TEXTS[language].insight.apiKeyError;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Select top 5 movers (highest absolute change) for interesting analysis
    const sortedAssets = [...assets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
    const topMovers = sortedAssets.slice(0, 8);
    
    const marketDescription = topMovers.map(a => 
      `- ${a.name} (${a.symbol}): $${a.currentPrice.toFixed(4)} (24h: ${a.change24h > 0 ? '+' : ''}${a.change24h.toFixed(2)}%)`
    ).join('\n');

    const languageInstruction = language === 'pt-BR' 
      ? "Answer in Brazilian Portuguese." 
      : "Answer in English.";

    const prompt = `
      Act as a crypto market analyst. Here are the top movers right now:
      ${marketDescription}

      Provide a concise 3-sentence summary of the current market sentiment (Bullish/Bearish/Neutral) based on these movements. 
      Mention the most significant mover.
      
      ${languageInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return TEXTS[language].insight.error;
  }
};