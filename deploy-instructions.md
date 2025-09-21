# 🚀 Deployment Instructions - Fixed Docker Build

The Docker build is now fixed! Here's how to deploy your MCP server:

## ✅ **Fixed Issues:**
- ✅ TypeScript compilation error resolved
- ✅ Added Express web server for remote access
- ✅ Fixed Dockerfile to install all dependencies
- ✅ Added proper environment variable handling

## 🐳 **Docker Deployment**

### **Option 1: Using Docker Compose (Recommended)**

1. **Set your API key**:
   ```bash
   # Create .env file with your API key
   echo "ALPHA_VANTAGE_API_KEY=your_actual_api_key_here" > .env
   ```

2. **Deploy with Docker Compose**:
   ```bash
   # Build and run
   docker-compose -f docker-compose.prod.yml up --build
   
   # Or run in background
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Test your deployment**:
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Get Apple stock quote
   curl http://localhost:3000/quote/AAPL
   
   # MCP endpoint
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"method": "tools/list"}'
   ```

### **Option 2: Direct Docker**

1. **Build the image**:
   ```bash
   docker build -t stock-mcp-server .
   ```

2. **Run with environment variable**:
   ```bash
   docker run -p 3000:3000 \
     -e ALPHA_VANTAGE_API_KEY=your_actual_api_key_here \
     stock-mcp-server
   ```

## 🌐 **Free Hosting Platforms**

### **Railway (Recommended - No Docker needed)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix Docker build and add web server"
   git push origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository
   - Set environment variable: `ALPHA_VANTAGE_API_KEY`
   - **No Docker needed** - Railway will auto-detect Node.js
   - Railway will use: `npm start` → `node dist/web-server.js`

### **Render (Docker)**

1. **Use the fixed Dockerfile**
2. **Set environment variable**: `ALPHA_VANTAGE_API_KEY`
3. **Deploy!**

### **Vercel (Serverless)**

1. **Use `vercel.json`** (already configured)
2. **Set environment variable**
3. **Deploy from GitHub**

## 🔧 **Environment Variables**

You need to set this environment variable on your hosting platform:

```bash
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
```

**Get your free API key**: https://www.alphavantage.co/support/#api-key

## 🧪 **Test Your Deployment**

### **Local Testing**:
```bash
# Start web server locally
npm run dev:web

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/quote/AAPL
```

### **Remote Testing**:
```bash
# Replace with your actual deployment URL
curl https://your-app.railway.app/health
curl https://your-app.railway.app/quote/AAPL
```

## 📡 **Use in Cursor**

Once deployed, configure Cursor to use your remote server:

```json
{
  "mcp": {
    "servers": {
      "stock-market-remote": {
        "command": "curl",
        "args": [
          "-X", "POST",
          "https://your-app.railway.app/mcp",
          "-H", "Content-Type: application/json",
          "-d", "{\"method\": \"tools/call\", \"params\": {\"name\": \"get_stock_quote\", \"arguments\": {\"symbol\": \"AAPL\"}}}"
        ],
        "env": {}
      }
    }
  }
}
```

## 🎯 **Available Endpoints**

Your deployed server will have these endpoints:

- **Health Check**: `GET /health`
- **Stock Quote**: `GET /quote/:symbol` (e.g., `/quote/AAPL`)
- **Stock Search**: `GET /search/:keywords` (e.g., `/search/Apple`)
- **MCP Protocol**: `POST /mcp`

## 🚀 **Quick Deploy Commands**

```bash
# 1. Get API key from Alpha Vantage
# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Deploy on Railway (easiest)
# - Go to railway.app
# - Connect GitHub repo
# - Add ALPHA_VANTAGE_API_KEY environment variable
# - Deploy!

# 4. Test
curl https://your-app.railway.app/health
```

## 🎉 **Result**

You'll have:
- ✅ **Working MCP server** accessible remotely
- ✅ **Free hosting** (Railway recommended)
- ✅ **No Docker issues**
- ✅ **Professional API endpoints**
- ✅ **Ready for Cursor integration**

The Docker build error is completely fixed! 🎉
