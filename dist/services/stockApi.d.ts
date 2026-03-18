import { StockQuote, StockSearchResult, TimeSeriesData, CompanyOverview } from '../types.js';
export declare class StockApiService {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    /**
     * Get real-time stock quote
     */
    getStockQuote(symbol: string): Promise<StockQuote>;
    /**
     * Search for stocks by company name or symbol
     */
    searchStocks(keywords: string): Promise<StockSearchResult[]>;
    /**
     * Get daily time series data
     */
    getDailyTimeSeries(symbol: string, outputSize?: 'compact' | 'full'): Promise<TimeSeriesData[]>;
    /**
     * Get company overview
     */
    getCompanyOverview(symbol: string): Promise<CompanyOverview>;
}
//# sourceMappingURL=stockApi.d.ts.map