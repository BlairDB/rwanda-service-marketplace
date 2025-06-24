# Rwanda Service Marketplace - FREE Deployment Guide

## 🆓 COMPLETELY FREE DEPLOYMENT SETUP

This guide shows you how to deploy your Rwanda Service Marketplace for **$0/month** using free tiers and services.

---

## 🎯 FREE DEPLOYMENT ARCHITECTURE

```
Frontend (Vercel) ──→ Backend (Railway) ──→ Database (Railway PostgreSQL)
     ↓                      ↓                        ↓
   FREE                   FREE                     FREE
```

---

## 🚀 OPTION 1: RAILWAY (RECOMMENDED - ALL-IN-ONE FREE)

### **Why Railway?**
- ✅ **$5 free credit monthly** (enough for small apps)
- ✅ **PostgreSQL included** for free
- ✅ **Redis included** for free
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domains** and SSL
- ✅ **No credit card required** for free tier

### **Step 1: Prepare Your Code**

Create a Railway-specific configuration:

```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[[services]]
name = "backend"
source = "backend/"

[[services]]
name = "frontend" 
source = "frontend/"

[services.backend.variables]
NODE_ENV = "production"
PORT = "3001"

[services.frontend.variables]
NODE_ENV = "production"
PORT = "3000"
```

### **Step 2: Deploy to Railway**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Add Redis
railway add redis

# 6. Deploy
railway up

# 7. Set environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
```

### **Step 3: Configure Environment Variables**

Railway will automatically provide:
- `DATABASE_URL` (PostgreSQL connection)
- `REDIS_URL` (Redis connection)

Add these manually:
```bash
railway variables set JWT_SECRET=your-super-secure-jwt-secret
railway variables set CORS_ORIGIN=https://your-app.railway.app
railway variables set FROM_EMAIL=noreply@servicerw.rw
```

---

## 🚀 OPTION 2: VERCEL + SUPABASE (POPULAR FREE COMBO)

### **Frontend: Vercel (Free)**
- ✅ **Unlimited static sites**
- ✅ **Custom domains**
- ✅ **Global CDN**
- ✅ **Automatic deployments**

### **Backend: Vercel Serverless Functions**
- ✅ **100GB bandwidth/month**
- ✅ **1000 serverless function invocations/day**

### **Database: Supabase (Free)**
- ✅ **500MB database**
- ✅ **PostgreSQL with extensions**
- ✅ **Real-time subscriptions**
- ✅ **Authentication included**

### **Step 1: Deploy Frontend to Vercel**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel

# 3. Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend.vercel.app/api
```

### **Step 2: Deploy Backend to Vercel**

```bash
# 1. Create vercel.json in backend/
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/server.js"
    }
  ]
}

# 2. Deploy backend
cd backend
vercel

# 3. Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

### **Step 3: Set up Supabase Database**

```bash
# 1. Go to https://supabase.com
# 2. Create free account
# 3. Create new project
# 4. Copy database URL
# 5. Run your schema in Supabase SQL editor
```

---

## 🚀 OPTION 3: RENDER (SIMPLE FREE OPTION)

### **Why Render?**
- ✅ **Free static sites**
- ✅ **$7/month for backend** (very cheap)
- ✅ **Free PostgreSQL** (90 days, then $7/month)
- ✅ **Automatic deployments**
- ✅ **Custom domains**

### **Step 1: Deploy to Render**

```yaml
# render.yaml
services:
  - type: web
    name: servicerw-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: servicerw-db
          property: connectionString

  - type: web
    name: servicerw-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist

databases:
  - name: servicerw-db
    databaseName: servicerw
    user: servicerw_user
```

---

## 🚀 OPTION 4: ORACLE CLOUD (ALWAYS FREE)

### **Why Oracle Cloud?**
- ✅ **Always free** (not a trial)
- ✅ **4 ARM CPUs, 24GB RAM**
- ✅ **200GB storage**
- ✅ **No time limits**

### **Specs Available:**
- **Compute**: 4 ARM CPUs, 24GB RAM
- **Storage**: 200GB block storage
- **Network**: 10TB outbound transfer/month
- **Database**: 2 Autonomous Databases

### **Step 1: Set up Oracle Cloud**

```bash
# 1. Sign up at https://cloud.oracle.com
# 2. Create Always Free VM instance
# 3. Choose ARM-based shape (Ampere A1)
# 4. Install Docker and deploy normally
```

---

## 💡 HYBRID FREE APPROACH (RECOMMENDED)

### **Best Free Combination:**

```
Frontend: Vercel (Free)
    ↓
Backend: Railway (Free $5 credit)
    ↓  
Database: Railway PostgreSQL (Free)
    ↓
File Storage: Cloudinary (Free 25GB)
    ↓
Email: EmailJS (Free 200 emails/month)
```

### **Total Cost: $0/month**
### **Capacity: ~1,000 businesses**

---

## 📊 FREE TIER LIMITATIONS & SOLUTIONS

### **Railway Free Tier:**
- **Limit**: $5 credit/month (~500 hours)
- **Solution**: Optimize for efficiency, use sleep mode

### **Vercel Free Tier:**
- **Limit**: 100GB bandwidth, 1000 function calls/day
- **Solution**: Cache aggressively, optimize images

### **Supabase Free Tier:**
- **Limit**: 500MB database, 2GB bandwidth
- **Solution**: Optimize queries, compress data

---

## 🔧 FREE DEPLOYMENT SCRIPT

Create a one-click free deployment:

```bash
#!/bin/bash
# free-deploy.sh

echo "🆓 Deploying Rwanda Service Marketplace for FREE!"

# Option 1: Railway deployment
echo "Choose deployment option:"
echo "1. Railway (All-in-one free)"
echo "2. Vercel + Supabase"
echo "3. Render"

read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "🚂 Deploying to Railway..."
    npm install -g @railway/cli
    railway login
    railway init
    railway add postgresql
    railway add redis
    railway up
    ;;
  2)
    echo "▲ Deploying to Vercel + Supabase..."
    npm install -g vercel
    cd frontend && vercel
    cd ../backend && vercel
    echo "Set up Supabase at https://supabase.com"
    ;;
  3)
    echo "🎨 Deploying to Render..."
    echo "Go to https://render.com and connect your GitHub repo"
    ;;
esac

echo "✅ Free deployment initiated!"
```

---

## 🎯 RECOMMENDED FREE PATH

### **For Development/Testing:**
1. **Railway** - Easiest, all-in-one free solution
2. **Deploy in 5 minutes**
3. **Scale to paid when needed**

### **For Production (Low Budget):**
1. **Contabo VPS** - $4.99/month
2. **Full control and performance**
3. **Can handle 20,000+ businesses**

### **For Maximum Free Usage:**
1. **Oracle Cloud Always Free**
2. **Unlimited time, great specs**
3. **ARM processors (may need code adjustments)**

---

## 🚀 QUICK START (5 MINUTES)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway add postgresql
railway up

# 3. Your app is live!
# Railway will give you a URL like: https://your-app.railway.app
```

**Your Rwanda Service Marketplace can be live and running for FREE in under 10 minutes!** 🇷🇼✨

---

## 📈 SCALING PATH

### **Free → Paid Transition:**
1. **Start**: Free tier (0-100 businesses)
2. **Growth**: $20/month (100-1,000 businesses)  
3. **Scale**: $50/month (1,000-5,000 businesses)
4. **Enterprise**: $200/month (5,000-20,000 businesses)

**Start free, scale as you grow!** 🚀
