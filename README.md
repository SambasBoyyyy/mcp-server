# Stock Market MCP Server

A Model Context Protocol (MCP) server that provides real-time stock market data and analysis tools. This server integrates with Alpha Vantage API to fetch comprehensive stock information.

## Features

- **Real-time Stock Quotes**: Get current stock prices, changes, and trading volume
- **Stock Search**: Search for stocks by company name or symbol
- **Time Series Data**: Retrieve historical daily stock data
- **Company Overview**: Get comprehensive company information and fundamentals
- **Input Validation**: Secure input validation and error handling
- **TypeScript Support**: Fully typed for better development experience

## Prerequisites

Before installing this MCP server, make sure you have the following installed on your system:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **TypeScript** (will be installed automatically)
   - Global installation (optional): `npm install -g typescript`

### API Key Setup

You'll need a free API key from Alpha Vantage:

1. Visit: https://www.alphavantage.co/support/#api-key
2. Sign up for a free account
3. Get your API key from the dashboard

## Installation

### Step 1: Clone or Download the Project

If you haven't already, navigate to your project directory:
```bash
cd "C:\Random Projects\stock-mcp"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `@modelcontextprotocol/sdk` - MCP SDK
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable management
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution

### Step 3: Set Up Environment Variables

1. Copy the example environment file:
```bash
copy env.example .env
```

2. Edit the `.env` file and add your Alpha Vantage API key:
```
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
```

### Step 4: Build the Project

```bash
npm run build
```

## Usage

### Development Mode

Run the server in development mode with hot reload:
```bash
npm run dev
```

### Production Mode

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

### Watch Mode

For development with automatic rebuilding:
```bash
npm run watch
```

## Available Tools

The MCP server provides the following tools:

### 1. `get_stock_quote`
Get real-time stock quote for a given symbol.

**Parameters:**
- `symbol` (string): Stock symbol (e.g., AAPL, MSFT, GOOGL)

**Example:**
```json
{
  "name": "get_stock_quote",
  "arguments": {
    "symbol": "AAPL"
  }
}
```

### 2. `search_stocks`
Search for stocks by company name or symbol.

**Parameters:**
- `keywords` (string): Search keywords (company name or symbol)

**Example:**
```json
{
  "name": "search_stocks",
  "arguments": {
    "keywords": "Apple"
  }
}
```

### 3. `get_daily_time_series`
Get daily time series data for a stock.

**Parameters:**
- `symbol` (string): Stock symbol
- `outputSize` (string, optional): "compact" (100 data points) or "full" (20+ years). Default: "compact"

**Example:**
```json
{
  "name": "get_daily_time_series",
  "arguments": {
    "symbol": "AAPL",
    "outputSize": "compact"
  }
}
```

### 4. `get_company_overview`
Get comprehensive company overview and fundamentals.

**Parameters:**
- `symbol` (string): Stock symbol

**Example:**
```json
{
  "name": "get_company_overview",
  "arguments": {
    "symbol": "AAPL"
  }
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required: Alpha Vantage API Key
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Optional: Alternative API (for future use)
POLYGON_API_KEY=your_polygon_api_key_here

# Optional: Server Configuration
PORT=3000
NODE_ENV=development
```

### API Limits

- **Free Alpha Vantage Plan**: 25 requests per day, 5 requests per minute
- **Premium Plans**: Higher limits available
- The server includes rate limiting handling and error messages

## Troubleshooting

### Common Issues

1. **"API call frequency limit reached"**
   - You've exceeded the free API limit
   - Wait for the limit to reset or upgrade your plan

2. **"No data found for symbol"**
   - Check if the stock symbol is correct
   - Some symbols may not be available in the API

3. **"Network error"**
   - Check your internet connection
   - Verify the API key is correct

4. **Build errors**
   - Make sure Node.js version is 18 or higher
   - Run `npm install` to ensure all dependencies are installed

### Debug Mode

Set the environment variable to enable debug logging:
```bash
NODE_ENV=development npm run dev
```

## Project Structure

```
stock-mcp/
├── src/
│   ├── index.ts           # Main MCP server entry point
│   ├── types.ts           # TypeScript type definitions
│   ├── validation.ts      # Input validation utilities
│   └── services/
│       └── stockApi.ts    # Stock API service implementation
├── dist/                  # Compiled JavaScript (after build)
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── env.example            # Environment variables template
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Verify your API key and network connection
3. Check the Alpha Vantage API documentation: https://www.alphavantage.co/documentation/

## Next Steps

After installation, you can:
1. Test the server with sample requests
2. Integrate it with your MCP client
3. Customize the tools for your specific needs
4. Add additional data sources or APIs




