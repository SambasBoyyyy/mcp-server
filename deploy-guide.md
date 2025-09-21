# 🚀 Deploy Your Stock MCP Server Online

Yes! You can absolutely deploy your MCP server online and use it remotely. Here are several hosting options:

## 🌟 Recommended Hosting Platforms

### 1. **Railway** (Easiest - Recommended)
**Why Railway**: Perfect for MCP servers, automatic deployments, great free tier

**Steps**:
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial MCP server setup"
   git branch -M main
   git remote add origin https://github.com/yourusername/stock-mcp-server.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variable: `ALPHA_VANTAGE_API_KEY=your_key`
   - Deploy!

3. **Use in Cursor**:
   ```json
   {
     "mcp": {
       "servers": {
         "stock-market-remote": {
           "command": "curl",
           "args": ["-X", "POST", "https://your-app.railway.app/message"],
           "env": {}
         }
       }
     }
   }
   ```

### 2. **Vercel** (Serverless)
**Why Vercel**: Great for serverless functions, easy GitHub integration

**Steps**:
1. **Push to GitHub** (same as above)

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `ALPHA_VANTAGE_API_KEY`
   - Deploy!

3. **Use in Cursor**:
   ```json
   {
     "mcp": {
       "servers": {
         "stock-market-vercel": {
           "command": "curl",
           "args": ["-X", "POST", "https://your-app.vercel.app/api/mcp"],
           "env": {}
         }
       }
     }
   }
   ```

### 3. **Render** (Docker Support)
**Why Render**: Docker support, persistent URLs, good free tier

**Steps**:
1. **Push to GitHub**

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Create "Web Service"
   - Connect GitHub repository
   - Use Dockerfile (already created)
   - Add environment variable
   - Deploy!

### 4. **DigitalOcean App Platform**
**Why DigitalOcean**: Reliable, scalable, good pricing

**Steps**:
1. **Push to GitHub**
2. **Deploy on DigitalOcean**:
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Create App → GitHub
   - Select repository
   - Configure environment variables
   - Deploy!

## 🐳 Docker Deployment (Any Platform)

The project includes a `Dockerfile` for containerized deployment:

```bash
# Build the Docker image
docker build -t stock-mcp-server .

# Run locally
docker run -p 3000:3000 -e ALPHA_VANTAGE_API_KEY=your_key stock-mcp-server

# Push to Docker Hub
docker tag stock-mcp-server yourusername/stock-mcp-server
docker push yourusername/stock-mcp-server
```

## 📋 Pre-Deployment Checklist

### 1. **Get Your API Key**
```bash
# Get free API key from Alpha Vantage
# https://www.alphavantage.co/support/#api-key
```

### 2. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. **Set Environment Variables**
- `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage API key
- `NODE_ENV`: `production`

## 🔧 Remote MCP Configuration

Once deployed, configure Cursor to use your remote server:

### **Method 1: HTTP/HTTPS Endpoint**
```json
{
  "mcp": {
    "servers": {
      "stock-market-remote": {
        "command": "curl",
        "args": [
          "-X", "POST",
          "https://your-app.railway.app/message",
          "-H", "Content-Type: application/json"
        ],
        "env": {}
      }
    }
  }
}
```

### **Method 2: WebSocket Connection**
```json
{
  "mcp": {
    "servers": {
      "stock-market-ws": {
        "command": "websocat",
        "args": ["wss://your-app.railway.app/ws"],
        "env": {}
      }
    }
  }
}
```

### **Method 3: SSH Tunnel** (Advanced)
```json
{
  "mcp": {
    "servers": {
      "stock-market-ssh": {
        "command": "ssh",
        "args": [
          "-L", "3000:localhost:3000",
          "user@your-server.com",
          "node /app/dist/index.js"
        ],
        "env": {}
      }
    }
  }
}
```

## 🧪 Testing Your Remote Server

### **Test the Deployment**:
```bash
# Test with curl
curl -X POST https://your-app.railway.app/message \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### **Test in Cursor**:
1. Update Cursor MCP configuration
2. Restart Cursor
3. Ask: "What's Apple's stock price?"

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Railway** | $5 credit/month | $5+/month | MCP servers |
| **Vercel** | 100GB bandwidth | $20+/month | Serverless |
| **Render** | 750 hours/month | $7+/month | Docker apps |
| **DigitalOcean** | None | $5+/month | Production |

## 🔒 Security Considerations

1. **Environment Variables**: Never commit API keys to Git
2. **Rate Limiting**: Implement rate limiting for public endpoints
3. **Authentication**: Add API key validation for remote access
4. **HTTPS**: Always use HTTPS for remote connections

## 🚀 Quick Start (Railway)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Railway"
git push origin main

# 2. Go to railway.app
# 3. Connect GitHub
# 4. Add ALPHA_VANTAGE_API_KEY environment variable
# 5. Deploy!

# 6. Update Cursor config with your Railway URL
# 7. Test in Cursor chat
```

## 📞 Support

If you need help with deployment:
1. Check the platform's documentation
2. Verify environment variables are set
3. Check server logs for errors
4. Test the endpoint manually with curl

Your MCP server will work exactly the same remotely as it does locally - just accessible from anywhere! 🎉
