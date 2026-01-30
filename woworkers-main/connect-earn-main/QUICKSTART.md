# Quick Start Guide

Get your Connect-Earn project up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

**Where to get these values:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

### 3. Run Database Migrations

Make sure your Supabase database has the required tables. The SQL migration files are in `supabase/migrations/`.

**Option A: Using Supabase CLI** (Recommended)
```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Option B: Manual Setup**
1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file in order (from `supabase/migrations/`)

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## ✅ Verify Everything Works

1. **Homepage loads** - You should see the Bengali interface
2. **Try signing up** - Create a test account
3. **Check console** - No errors related to Supabase connection

## 🐛 Common Issues

### "Missing Supabase environment variables"
- Make sure `.env` file exists in the root directory
- Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Restart the dev server after creating `.env`

### "Failed to fetch" or connection errors
- Verify your Supabase URL and key are correct
- Check Supabase project is active (not paused)
- Ensure CORS is enabled in Supabase settings

### Database errors
- Make sure migrations are run
- Check Supabase dashboard → Table Editor to see if tables exist
- Verify RLS (Row Level Security) policies are set up

## 📦 Build for Production

```bash
npm run build
```

The `dist` folder will contain your production-ready files.

## 🚢 Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push code to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
- Review the code structure in `src/` directory
- Customize the UI and branding

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)

Happy coding! 🎉
