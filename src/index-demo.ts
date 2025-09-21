#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class StockMCPDemo {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'stock-mcp-server-demo',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

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
            
            // Demo data for Apple
            if (args.symbol.toUpperCase() === 'AAPL') {
              const demoQuote = {
                symbol: 'AAPL',
                price: 245.50,
                change: 7.52,
                changePercent: '3.16%',
                volume: 163741314,
                high: 246.22,
                low: 238.05,
                open: 241.22,
                previousClose: 237.98,
                timestamp: '2024-12-20',
                note: 'Demo data - Get real API key for live data'
              };
              
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(demoQuote, null, 2),
                  },
                ],
              };
            }
            
            // Generic demo response for other symbols
            const demoQuote = {
              symbol: args.symbol.toUpperCase(),
              price: 150.25,
              change: 2.50,
              changePercent: '1.69%',
              volume: 45000000,
              high: 152.00,
              low: 148.75,
              open: 149.50,
              previousClose: 147.75,
              timestamp: '2024-12-20',
              note: 'Demo data - Get real API key for live data'
            };
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(demoQuote, null, 2),
                },
              ],
            };
          }

          case 'search_stocks': {
            if (!args.keywords || typeof args.keywords !== 'string') {
              throw new Error('Keywords are required and must be a string');
            }
            
            const demoResults = [
              {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                type: 'Equity',
                region: 'United States',
                marketOpen: '09:30',
                marketClose: '16:00',
                timezone: 'UTC-05',
                currency: 'USD',
                matchScore: '1.0000',
                note: 'Demo data - Get real API key for live data'
              },
              {
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                type: 'Equity',
                region: 'United States',
                marketOpen: '09:30',
                marketClose: '16:00',
                timezone: 'UTC-05',
                currency: 'USD',
                matchScore: '0.8500',
                note: 'Demo data - Get real API key for live data'
              }
            ];
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(demoResults, null, 2),
                },
              ],
            };
          }

          case 'get_daily_time_series': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            
            const demoTimeSeries = [
              {
                timestamp: '2024-12-20',
                open: 241.22,
                high: 246.22,
                low: 238.05,
                close: 245.50,
                volume: 163741314,
                note: 'Demo data - Get real API key for live data'
              },
              {
                timestamp: '2024-12-19',
                open: 237.98,
                high: 242.15,
                low: 236.80,
                close: 237.98,
                volume: 152345678,
                note: 'Demo data - Get real API key for live data'
              }
            ];
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(demoTimeSeries, null, 2),
                },
              ],
            };
          }

          case 'get_company_overview': {
            if (!args.symbol || typeof args.symbol !== 'string') {
              throw new Error('Symbol is required and must be a string');
            }
            
            let demoOverview;
            
            if (args.symbol.toUpperCase() === 'AAPL') {
              demoOverview = {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
                sector: 'Technology',
                industry: 'Consumer Electronics',
                marketCap: '3800000000000',
                peRatio: '28.5',
                dividendYield: '0.44',
                beta: '1.25',
                fiftyTwoWeekHigh: '237.23',
                fiftyTwoWeekLow: '164.08',
                note: 'Demo data - Get real API key for live data'
              };
            } else {
              demoOverview = {
                symbol: args.symbol.toUpperCase(),
                name: 'Demo Company Inc.',
                description: 'A demonstration company for testing purposes.',
                sector: 'Technology',
                industry: 'Software',
                marketCap: '500000000000',
                peRatio: '25.0',
                dividendYield: '0.00',
                beta: '1.10',
                fiftyTwoWeekHigh: '200.00',
                fiftyTwoWeekLow: '150.00',
                note: 'Demo data - Get real API key for live data'
              };
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(demoOverview, null, 2),
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
    console.error('Stock MCP Server (Demo Mode) running on stdio');
  }
}

// Start the server
const stockMCP = new StockMCPDemo();
stockMCP.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

