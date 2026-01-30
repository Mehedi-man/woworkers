# Deployment Guide

This guide will help you deploy Connect-Earn to various hosting platforms.

## Prerequisites

1. **Supabase Project Setup**
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project
   - Run the database migrations from `supabase/migrations/` directory
   - Get your project URL and anon key from Settings → API

2. **Environment Variables**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel offers the easiest deployment with automatic CI/CD.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `connect-earn-main` (if your repo has nested structure)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` branch will trigger a new deployment
   - Preview deployments are created for pull requests

#### Custom Domain:
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

### Option 2: Netlify

Netlify is another excellent option with similar features.

#### Steps:

1. **Push to GitHub** (same as Vercel)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Configure:
     - **Base directory**: `connect-earn-main` (if needed)
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Click "Deploy site"

3. **Automatic Deployments**
   - Automatic deployments on push to main branch
   - Deploy previews for pull requests

---

### Option 3: GitHub Pages

Free hosting for static sites.

#### Steps:

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. **Update vite.config.ts**
   Add base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

**Note**: GitHub Pages doesn't support environment variables directly. You'll need to use a different approach or use GitHub Actions.

---

### Option 4: Cloudflare Pages

Fast global CDN with great performance.

#### Steps:

1. **Push to GitHub**

2. **Deploy on Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure:
     - **Framework preset**: Vite
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Add Environment Variables in Settings
   - Deploy

---

### Option 5: Firebase Hosting

Google's hosting solution.

#### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project
   - Public directory: `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html: No

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Environment Variables**
   - Use Firebase Functions or `.env` file (not recommended for production)
   - Consider using Firebase Remote Config

---

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test authentication (sign up, sign in, sign out)
- [ ] Test core features (job posting, proposals, messaging)
- [ ] Check mobile responsiveness
- [ ] Verify Supabase RLS (Row Level Security) policies
- [ ] Set up custom domain (if applicable)
- [ ] Configure CORS in Supabase if needed
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Test performance (Lighthouse score)

## Environment Variables Setup

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development

### Netlify
1. Go to Site Settings → Environment Variables
2. Add variables and specify scope (Production, Deploy Preview, Branch Deploy)

### Other Platforms
Refer to their documentation for environment variable configuration.

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run build` locally first

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Restart build after adding variables
- Check variable names match exactly (case-sensitive)

### Routing Issues (404 on refresh)
- Ensure SPA routing is configured (redirect all routes to index.html)
- Check `vercel.json` or `netlify.toml` configuration

### Supabase Connection Issues
- Verify Supabase URL and key are correct
- Check Supabase project is active
- Verify CORS settings in Supabase dashboard
- Check browser console for specific errors

## Performance Optimization

1. **Enable Compression**
   - Vercel/Netlify: Automatic
   - Others: Configure in hosting settings

2. **CDN Caching**
   - Static assets are automatically cached
   - Configure cache headers for API responses

3. **Image Optimization**
   - Use optimized image formats (WebP)
   - Implement lazy loading

4. **Code Splitting**
   - Already configured in `vite.config.ts`
   - Monitor bundle sizes

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform's environment variable system
   - Rotate keys periodically

2. **Supabase Security**
   - Enable Row Level Security (RLS)
   - Review and test RLS policies
   - Use service role key only server-side (never in frontend)

3. **HTTPS**
   - All modern platforms provide HTTPS by default
   - Ensure custom domains use HTTPS

## Monitoring

Consider setting up:
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Lighthouse CI, WebPageTest

---

## Need Help?

If you encounter issues:
1. Check the platform's documentation
2. Review build logs for specific errors
3. Test locally with `npm run build && npm run preview`
4. Check Supabase dashboard for database issues

Good luck with your deployment! 🚀
