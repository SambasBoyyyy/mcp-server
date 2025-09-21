// Netlify function for MCP server
import { StockApiService } from '../services/stockApi.js';

const stockApi = new StockApiService(process.env.ALPHA_VANTAGE_API_KEY);

export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { method, params } = JSON.parse(event.body || '{}');

    switch (method) {
      case 'tools/list':
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tools: [
              {
                name: 'get_stock_quote',
                description: 'Get real-time stock quote for a given symbol',
                inputSchema: {
                  type: 'object',
                  properties: {
                    symbol: { type: 'string', description: 'Stock symbol (e.g., AAPL, MSFT, GOOGL)' },
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
                    keywords: { type: 'string', description: 'Search keywords (company name or symbol)' },
                  },
                  required: ['keywords'],
                },
              },
            ],
          }),
        };

      case 'tools/call':
        const { name, arguments: args } = params;
        
        if (name === 'get_stock_quote' && args?.symbol) {
          const quote = await stockApi.getStockQuote(args.symbol);
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ result: { content: [{ type: 'text', text: JSON.stringify(quote, null, 2) }] } }),
          };
        }
        
        if (name === 'search_stocks' && args?.keywords) {
          const results = await stockApi.searchStocks(args.keywords);
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ result: { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] } }),
          };
        }
        
        throw new Error(`Unknown tool: ${name}`);

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
