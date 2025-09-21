import axios, { AxiosResponse } from 'axios';
import { 
  StockQuote, 
  StockSearchResult, 
  TimeSeriesData, 
  CompanyOverview,
  ApiError 
} from '../types.js';
import { validateSymbol, validateKeywords, validateOutputSize, sanitizeInput } from '../validation.js';

export class StockApiService {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get real-time stock quote
   */
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const validatedSymbol = validateSymbol(symbol);
      const response: AxiosResponse = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: validatedSymbol,
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: quote['07. latest trading day']
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search for stocks by company name or symbol
   */
  async searchStocks(keywords: string): Promise<StockSearchResult[]> {
    try {
      const validatedKeywords = sanitizeInput(keywords);
      validateKeywords(validatedKeywords);
      const response: AxiosResponse = await axios.get(this.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: validatedKeywords,
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      const matches = data['bestMatches'] || [];
      
      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore']
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get daily time series data
   */
  async getDailyTimeSeries(symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<TimeSeriesData[]> {
    try {
      const validatedSymbol = validateSymbol(symbol);
      validateOutputSize(outputSize);
      const response: AxiosResponse = await axios.get(this.baseUrl, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: validatedSymbol,
          outputsize: outputSize,
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error(`No time series data found for symbol: ${symbol}`);
      }

      const result: TimeSeriesData[] = [];
      for (const [date, values] of Object.entries(timeSeries)) {
        const dailyData = values as any;
        result.push({
          timestamp: date,
          open: parseFloat(dailyData['1. open']),
          high: parseFloat(dailyData['2. high']),
          low: parseFloat(dailyData['3. low']),
          close: parseFloat(dailyData['4. close']),
          volume: parseInt(dailyData['5. volume'])
        });
      }

      return result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get company overview
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    try {
      const validatedSymbol = validateSymbol(symbol);
      const response: AxiosResponse = await axios.get(this.baseUrl, {
        params: {
          function: 'OVERVIEW',
          symbol: validatedSymbol,
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }

      if (!data['Symbol']) {
        throw new Error(`No company data found for symbol: ${symbol}`);
      }

      return {
        symbol: data['Symbol'],
        name: data['Name'],
        description: data['Description'],
        sector: data['Sector'],
        industry: data['Industry'],
        marketCap: data['MarketCapitalization'],
        peRatio: data['PERatio'],
        dividendYield: data['DividendYield'],
        beta: data['Beta'],
        fiftyTwoWeekHigh: data['52WeekHigh'],
        fiftyTwoWeekLow: data['52WeekLow']
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }
}
