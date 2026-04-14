# LegalSaathi: Master Class Deployment Guide

This guide covers the deep technical steps to push your project to GitHub and deploy it as a high-performance application on Vercel.

## 🛡️ Step 1: Security Handover (GitHub)

Before you push, ensure your repository is initialized and your sensitive data is blocked.

### 1. Initialize the Repository
Run these commands in your root project folder (`LegalSaathi-main`):
```bash
git init
git add .
git commit -m "chore: initial production-ready commit"
```

### 2. Push to GitHub
1. Create a **Private** repository on [GitHub](https://github.com/new).
2. Run the following to link and push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/LegalSaathi.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Vercel "Lightning" Deployment

Vercel will build your frontend and host your backend as serverless functions.

### 1. Import Project
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your `LegalSaathi` repository.

### 2. Project Settings
- **Framework Preset**: Vite (should be detected automatically).
- **Root Directory**: `./` (The root of the monorepo).
- **Output Directory**: `dist` (Configure this for the frontend build).

### 3. Environment Variables (CRITICAL)
You must manually add your `.env` keys to the **Environment Variables** section in the Vercel dashboard:
- `GROQ_API_KEY`: [Your Primary Key]
- `TAVILY_API_KEY`: [Your Primary Key]
- `GROQ_API_KEY_2`: [Your Secondary Key]
- `TAVILY_API_KEY_2`: [Your Secondary Key]
- `PORT`: `3004` (Optional, Vercel manages ports natively)

### 4. Region Optimization
For faster legal agent performance in India:
1. Go to **Settings** -> **Functions**.
2. Select **SGP1 (Singapore)** or the region closest to India. This reduces the round-trip time between your backend and the LLM APIs.

---

## ⚡ Performance Protocols Implemented
- **Brotli Compression**: Enabled by default on Vercel for all JS/CSS.
- **Cache-Control**: Static assets in `/assets` are set to be cached for 1 year (`immutable`).
- **Code Splitting**: The application is divided into `vendor` and `ui` chunks, ensuring fast initial page loads (LCP).
- **Security Headers**: The `vercel.json` we've added includes `nosniff`, `X-Frame-Options`, and `HSTS` protocols.

## 🛠️ Maintenance Tips
- **Logs**: Use `vercel logs` to monitor the real-time performance of your legal agents.
- **Preview Deployments**: Every pull request to your GitHub repo will create a "staging" URL automatically.
