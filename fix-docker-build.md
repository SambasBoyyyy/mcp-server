# 🔧 Fix Docker Build Error

The error `tsc: not found` occurs because TypeScript isn't installed in production dependencies. Here are the fixes:

## ✅ **Fixed Dockerfile**

I've updated the Dockerfile to install all dependencies first:

```dockerfile
# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production
```

## 🚀 **Alternative: Use Simple Dockerfile**

For free hosting platforms, use `Dockerfile.simple`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 🎯 **Platform-Specific Solutions**

### **Railway (Recommended - No Docker needed)**
Railway can build Node.js apps directly without Docker:

1. **Remove Dockerfile** (Railway will auto-detect Node.js)
2. **Set build command**: `npm run build`
3. **Set start command**: `npm start`
4. **Deploy!**

### **Render (Docker)**
1. **Use `Dockerfile.simple`**:
   ```bash
   # Rename the simple Dockerfile
   mv Dockerfile.simple Dockerfile
   ```

2. **Deploy with Docker**

### **Vercel (Serverless - No Docker needed)**
1. **Use `vercel.json`** (already created)
2. **Deploy directly from GitHub**

### **Netlify (Serverless - No Docker needed)**
1. **Use `netlify.toml`** (already created)
2. **Use Netlify Functions** (already created)

## 🔄 **Quick Fix Commands**

```bash
# Option 1: Use the fixed Dockerfile (already updated)
docker build -t stock-mcp-server .

# Option 2: Use simple Dockerfile
mv Dockerfile.simple Dockerfile
docker build -t stock-mcp-server .

# Option 3: Use optimized multi-stage build
mv Dockerfile.optimized Dockerfile
docker build -t stock-mcp-server .
```

## 🧪 **Test the Fix**

```bash
# Test local Docker build
docker build -t stock-mcp-server .
docker run -p 3000:3000 -e ALPHA_VANTAGE_API_KEY=test_key stock-mcp-server
```

## 🎯 **Recommended for Free Hosting**

### **Railway (Best - No Docker needed)**
1. **Delete Dockerfile** (Railway auto-detects Node.js)
2. **Push to GitHub**
3. **Deploy on Railway**
4. **Works perfectly!**

### **Render (Docker)**
1. **Use `Dockerfile.simple`**:
   ```bash
   mv Dockerfile.simple Dockerfile
   ```
2. **Deploy on Render**

## 📋 **Updated Files**

- ✅ **`Dockerfile`** - Fixed to install all dependencies
- ✅ **`Dockerfile.simple`** - Simple version for free hosting
- ✅ **`Dockerfile.optimized`** - Multi-stage optimized build
- ✅ **`netlify.toml`** - Netlify configuration
- ✅ **`netlify/functions/mcp.js`** - Netlify serverless function

## 🚀 **Deploy Now**

```bash
# Commit the fixes
git add .
git commit -m "Fix Docker build - install all dependencies for build step"
git push origin main

# Deploy on Railway (recommended - no Docker needed)
# Go to railway.app and deploy from GitHub
```

The build error is now fixed! Choose the deployment method that works best for your hosting platform.
