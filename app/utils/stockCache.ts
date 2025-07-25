interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: number;
}

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  totalCost: number;
  purchaseDate: any;
  lastPurchaseDate?: any;
  lastPurchasePrice?: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Array<PortfolioHolding & {
    currentPrice: number;
    currentValue: number;
    gainLoss: number;
    gainLossPercent: number;
  }>;
}

interface HistoricalData {
  date: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

class StockCache {
  private cache: Map<string, StockData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; 

  async getStockData(symbol: string): Promise<StockData | null> {
    const cached = this.cache.get(symbol);
    
    if (cached && Date.now() - cached.lastUpdated < this.CACHE_DURATION) {
      console.log(`Using cached data for ${symbol}`);
      return cached;
    }

    try {
      console.log(`Fetching fresh data for ${symbol}`);
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      if (data.c && data.c !== 0) {
        const stockData: StockData = {
          symbol: symbol,
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          lastUpdated: Date.now()
        };
        
        this.cache.set(symbol, stockData);
        return stockData;
      } else {
        throw new Error("Invalid stock symbol");
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<Map<string, StockData>> {
    const results = new Map<string, StockData>();
    
    const promises = symbols.map(async (symbol) => {
      const data = await this.getStockData(symbol);
      if (data) {
        results.set(symbol, data);
      }
    });
    
    await Promise.all(promises);
    return results;
  }

  async refreshStock(symbol: string): Promise<StockData | null> {
    this.cache.delete(symbol);
    return this.getStockData(symbol);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCachedSymbols(): string[] {
    return Array.from(this.cache.keys());
  }

  async calculatePortfolioSummary(holdings: PortfolioHolding[]): Promise<PortfolioSummary> {
    const symbols = holdings.map(h => h.symbol);
    const stockPrices = await this.getMultipleStocks(symbols);
    
    let totalValue = 0;
    let totalCost = 0;
    
    const enrichedHoldings = holdings.map(holding => {
      const stockData = stockPrices.get(holding.symbol);
      const currentPrice = stockData?.price || 0;
      const currentValue = currentPrice * holding.quantity;
      const gainLoss = currentValue - holding.totalCost;
      const gainLossPercent = holding.totalCost > 0 ? (gainLoss / holding.totalCost) * 100 : 0;
      
      totalValue += currentValue;
      totalCost += holding.totalCost;
      
      return {
        ...holding,
        currentPrice,
        currentValue,
        gainLoss,
        gainLossPercent
      };
    });
    
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      holdings: enrichedHoldings
    };
  }
  
}

export const stockCache = new StockCache();
export type { StockData, PortfolioHolding, PortfolioSummary};
