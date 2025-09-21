#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { StockApiService } from './services/stockApi.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize stock API service
const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
if (!apiKey) {
  console.error('ALPHA_VANTAGE_API_KEY environment variable is required');
  process.exit(1);
}

const stockApi = new StockApiService(apiKey);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock MCP Server is running' });
});

// MCP endpoint for tool calls
app.post('/mcp', async (req, res) => {
  try {
    const { method, params } = req.body;

    switch (method) {
      case 'tools/list':
        res.json({
          tools: [
            {
              name: 'get_stock_quote',
              description: 'Get real-time stock quote for a given symbol',
              inputSchema: {
                type: 'object',
                properties: {
                  symbol: {
                    type: 'string',
                    description: 'Stock symbol (e.g., AAPL, MSFT, GOOGL)',
                  },
                },
                required: ['symbol'],
              },
            },
            {
              name: 'search_stocks',
              description: 'Search for stocks by company name or symbol',
              inputSchema: {
                type: 'object',
                properties: {
                  keywords: {
                    type: 'string',
                    description: 'Search keywords (company name or symbol)',
                  },
                },
                required: ['keywords'],
              },
            },
            {
              name: 'get_daily_time_series',
              description: 'Get daily time series data for a stock',
              inputSchema: {
                type: 'object',
                properties: {
                  symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                  },
                  outputSize: {
                    type: 'string',
                    enum: ['compact', 'full'],
                    description: 'Output size: compact (100 data points) or full (20+ years)',
                    default: 'compact',
                  },
                },
                required: ['symbol'],
              },
            },
            {
              name: 'get_company_overview',
              description: 'Get comprehensive company overview and fundamentals',
              inputSchema: {
                type: 'object',
                properties: {
                  symbol: {
                    type: 'string',
                    description: 'Stock symbol',
                  },
                },
                required: ['symbol'],
              },
            },
          ],
        });
        break;

      case 'tools/call':
        const { name, arguments: args } = params;

        if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments provided');
        }

        switch (name) {
          case 'get_stock_quote': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const quote = await stockApi.getStockQuote(args.symbol);
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(quote, null, 2),
                },
              ],
            });
            break;
          }

          case 'search_stocks': {
            if (!args.keywords || typeof args.keywords !== 'string') {
              throw new Error('Keywords are required and must be a string');
            }
            const searchResults = await stockApi.searchStocks(args.keywords);
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(searchResults, null, 2),
                },
              ],
            });
            break;
          }

          case 'get_daily_time_series': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const outputSize = args.outputSize && typeof args.outputSize === 'string' 
              ? args.outputSize as 'compact' | 'full'
              : 'compact';
            const timeSeries = await stockApi.getDailyTimeSeries(
              args.symbol,
              outputSize
            );
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(timeSeries, null, 2),
                },
              ],
            });
            break;
          }

          case 'get_company_overview': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const overview = await stockApi.getCompanyOverview(args.symbol);
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(overview, null, 2),
                },
              ],
            });
            break;
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({
      error: errorMessage,
    });
  }
});

// Simple stock quote endpoint
app.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quote = await stockApi.getStockQuote(symbol);
    res.json(quote);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

// Search endpoint
app.get('/search/:keywords', async (req, res) => {
  try {
    const { keywords } = req.params;
    const results = await stockApi.searchStocks(decodeURIComponent(keywords));
    res.json(results);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Stock MCP Web Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  console.log(`Stock quote: http://localhost:${port}/quote/AAPL`);
  console.log(`Search: http://localhost:${port}/search/Apple`);
});

export default app;
