# 🔴 Fix Red MCP Tool in Cursor

The red indicator means Cursor can't connect to your MCP server. Here's how to fix it:

## ✅ Step 1: Verify Server Works (Already Done)

Your server is working perfectly! The test showed:
- ✅ Server starts successfully
- ✅ Responds to MCP requests
- ✅ Lists all 4 tools correctly

## 🔧 Step 2: Fix Cursor Configuration

### Option A: Update Cursor Settings

1. **Open Cursor Settings**:
   - Press `Ctrl + Shift + P` (Windows)
   - Type "Preferences: Open Settings (JSON)"
   - Press Enter

2. **Add/Update MCP Configuration**:
   ```json
   {
     "mcp": {
       "servers": {
         "stock-market": {
           "command": "node",
           "args": ["C:\\Random Projects\\stock-mcp\\dist\\index.js"],
           "env": {
             "ALPHA_VANTAGE_API_KEY": "your_actual_api_key_here"
           }
         }
       }
     }
   }
   ```

### Option B: Use Settings UI

1. **Open Settings**: `Ctrl + ,`
2. **Search for "MCP"**
3. **Add Server** with these exact values:
   - **Name**: `stock-market`
   - **Command**: `node`
   - **Args**: `["C:\\Random Projects\\stock-mcp\\dist\\index.js"]`
   - **Working Directory**: (leave empty)
   - **Environment Variables**: 
     ```json
     {
       "ALPHA_VANTAGE_API_KEY": "your_actual_api_key_here"
     }
     ```

## 🔑 Step 3: Set Up Your API Key

1. **Get API Key**:
   - Go to: https://www.alphavantage.co/support/#api-key
   - Sign up for free
   - Copy your API key

2. **Create .env file**:
   ```bash
   copy env.example .env
   ```

3. **Edit .env file**:
   ```
   ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
   ```

## 🔄 Step 4: Restart Cursor

**IMPORTANT**: After changing MCP settings, you MUST restart Cursor completely:
1. Close all Cursor windows
2. Reopen Cursor
3. Check if the MCP tool is now green

## 🧪 Step 5: Test the Connection

1. **Open Cursor Chat**
2. **Ask a test question**:
   - "What's the current price of Apple stock?"
   - "Get me Tesla's stock quote"
   - "Search for Microsoft stocks"

## 🐛 Common Issues & Solutions

### Issue 1: Path Problems
**Problem**: Windows paths with spaces
**Solution**: Use the exact path: `C:\\Random Projects\\stock-mcp\\dist\\index.js`

### Issue 2: API Key Not Set
**Problem**: Server starts but API calls fail
**Solution**: Make sure your API key is in both:
- `.env` file
- Cursor MCP configuration

### Issue 3: Server Not Found
**Problem**: Cursor can't find the server
**Solution**: 
1. Make sure you ran `npm run build`
2. Verify the file exists: `C:\Random Projects\stock-mcp\dist\index.js`

### Issue 4: Permission Issues
**Problem**: Cursor can't execute Node.js
**Solution**: 
1. Make sure Node.js is in your PATH
2. Try using full path: `C:\\Program Files\\nodejs\\node.exe`

## 📋 Verification Checklist

- [ ] Server builds successfully (`npm run build`)
- [ ] Server starts and responds (`node test-server.mjs`)
- [ ] API key is set in `.env` file
- [ ] Cursor MCP configuration is correct
- [ ] Cursor has been restarted
- [ ] MCP tool shows green (not red)
- [ ] Can ask stock questions in chat

## 🆘 Still Red? Try This:

1. **Check Cursor Logs**:
   - Help → Toggle Developer Tools
   - Look for MCP-related errors in Console

2. **Test Server Manually**:
   ```bash
   cd "C:\Random Projects\stock-mcp"
   node dist/index.js
   ```
   Should show: "Stock MCP Server running on stdio"

3. **Verify Node.js Path**:
   ```bash
   where node
   ```
   Use the full path in Cursor config if needed

4. **Alternative Configuration**:
   ```json
   {
     "mcp": {
       "servers": {
         "stock-market": {
           "command": "C:\\Program Files\\nodejs\\node.exe",
           "args": ["C:\\Random Projects\\stock-mcp\\dist\\index.js"],
           "env": {
             "ALPHA_VANTAGE_API_KEY": "your_key_here"
           }
         }
       }
     }
   }
   ```

## 🎯 Expected Result

Once fixed, you should see:
- 🟢 Green MCP tool indicator in Cursor
- Ability to ask stock-related questions in chat
- Real-time stock data responses

Your MCP server is working perfectly - it's just a configuration issue in Cursor!

