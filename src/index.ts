#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { StockApiService } from './services/stockApi.js';

// Load environment variables
dotenv.config();

class StockMCP {
  private server: Server;
  private stockApi: StockApiService;

  constructor() {
    this.server = new Server(
      {
        name: 'stock-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize stock API service
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      throw new Error('ALPHA_VANTAGE_API_KEY environment variable is required');
    }
    this.stockApi = new StockApiService(apiKey);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
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
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Validate args exists and is an object
        if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments provided');
        }

        switch (name) {
          case 'get_stock_quote': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const quote = await this.stockApi.getStockQuote(args.symbol);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(quote, null, 2),
                },
              ],
            };
          }

          case 'search_stocks': {
            if (!args.keywords || typeof args.keywords !== 'string') {
              throw new Error('Keywords are required and must be a string');
            }
            const searchResults = await this.stockApi.searchStocks(args.keywords);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(searchResults, null, 2),
                },
              ],
            };
          }

          case 'get_daily_time_series': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const outputSize = args.outputSize && typeof args.outputSize === 'string' 
              ? args.outputSize as 'compact' | 'full'
              : 'compact';
            const timeSeries = await this.stockApi.getDailyTimeSeries(
              args.symbol,
              outputSize
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(timeSeries, null, 2),
                },
              ],
            };
          }

          case 'get_company_overview': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            const overview = await this.stockApi.getCompanyOverview(args.symbol);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(overview, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Stock MCP Server running on stdio');
  }
}

// Start the server
const stockMCP = new StockMCP();
stockMCP.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

