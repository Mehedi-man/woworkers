# Vercel Deployment Guide

This guide will help you deploy your Connect-Earn project to Vercel.

## ✅ Vercel Configuration

Your `vercel.json` is optimized and ready for deployment with:

- ✅ Correct build command (`npm run build`)
- ✅ Correct output directory (`dist`)
- ✅ SPA routing configured (all routes → index.html)
- ✅ Asset caching optimized (1 year for static assets)
- ✅ Security headers configured
- ✅ Framework detection (Vite)

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/connect-earn.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project**
   Vercel should auto-detect:
   - **Framework Preset:** Vite ✅
   - **Root Directory:** `./` (or `connect-earn-main` if nested)
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `dist` ✅
   - **Install Command:** `npm install` ✅

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:
   
   ```
   VITE_SUPABASE_URL = https://qqcfqhschgdububrjfwt.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2ZxaHNjaGdkdWJ1YnJqZnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjMzOTgsImV4cCI6MjA4MTg5OTM5OH0.FoNrojcPNSZKNmQZrBCj1JlkA27LUE6ZSs1ohNdRwsI
   ```
   
   **Important:** Add these for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete (usually 1-2 minutes)

### Step 3: Verify Deployment

After deployment:

1. **Check Build Logs**
   - Should see successful build
   - No errors related to Supabase

2. **Test Your Site**
   - Visit the provided Vercel URL
   - Test all pages and routes
   - Check browser console for errors

3. **Test Supabase Connection**
   - Try signing up a user
   - Check Supabase dashboard → Table Editor → `profiles`
   - Should see new user data

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Code is pushed to GitHub
- [ ] `.env` file is NOT committed (it's in `.gitignore`)
- [ ] Environment variables are added in Vercel dashboard
- [ ] Database migrations are run on Supabase
- [ ] All tables exist in Supabase
- [ ] Build works locally (`npm run build` succeeds)
- [ ] No TypeScript errors
- [ ] No console errors in browser

## 🔧 Vercel Configuration Details

### Build Settings (Auto-detected)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Routing
- All routes (`/*`) rewrite to `/index.html` for SPA routing
- React Router will handle client-side routing

### Caching
- **Static Assets:** 1 year cache (immutable)
- **HTML:** No cache (always fresh)
- **JS/CSS:** 1 year cache (immutable)

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🌐 Custom Domain Setup

1. **In Vercel Dashboard**
   - Go to your project
   - Click **Settings** → **Domains**
   - Click **Add Domain**
   - Enter your domain name

2. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Or use A record (instructions provided by Vercel)

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - HTTPS enabled by default

## 🔄 Continuous Deployment

Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Runs build checks before deployment
- ✅ Provides deployment URLs for each commit

## 🐛 Troubleshooting

### Build Fails

**Error: "Missing environment variables"**
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel dashboard
- Redeploy after adding variables

**Error: "Module not found"**
- Run `npm install` locally to verify dependencies
- Check `package.json` has all required packages

**Error: "TypeScript errors"**
- Fix TypeScript errors locally first
- Run `npm run build` locally to verify

### Runtime Errors

**Error: "Supabase connection failed"**
- Verify environment variables are set correctly
- Check Supabase project is active (not paused)
- Verify CORS settings in Supabase dashboard

**Error: "404 on page refresh"**
- This is handled by `vercel.json` rewrites
- Should work automatically with current config

### Performance Issues

**Slow page loads**
- Check bundle sizes in build output
- Consider code splitting (already configured)
- Enable Vercel Analytics for insights

## 📊 Post-Deployment

After successful deployment:

1. **Monitor**
   - Check Vercel Analytics
   - Monitor error logs
   - Check Supabase usage

2. **Test**
   - Test all user flows
   - Test on mobile devices
   - Test authentication
   - Test database operations

3. **Optimize**
   - Review bundle sizes
   - Optimize images
   - Enable caching where appropriate

## ✅ Your Configuration is Ready!

Your `vercel.json` is perfectly configured for:
- ✅ Vite React SPA
- ✅ React Router client-side routing
- ✅ Optimal caching
- ✅ Security headers
- ✅ Production deployment

**Just push to GitHub and deploy on Vercel!** 🚀
