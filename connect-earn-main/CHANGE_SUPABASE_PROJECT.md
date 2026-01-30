# How to Change Supabase Project

This guide will help you switch to a different Supabase project/account.

## 📋 Information You Need from Your New Supabase Project

Before you start, make sure you have access to your **new Supabase project** and gather this information:

### Required Information:

1. **Project URL**
   - Format: `https://[project-id].supabase.co`
   - Example: `https://abcdefghijklmnop.supabase.co`

2. **Project ID** (Reference ID)
   - Found in the project URL
   - Example: `abcdefghijklmnop`

3. **Anon/Public Key** (API Key)
   - This is your `anon public` key
   - A long JWT token starting with `eyJ...`
   - This is safe to use in frontend code

### Where to Find This Information:

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Log in to your account
   - Select your **new** project

2. **Navigate to Settings → API**
   - Click **Settings** (gear icon) in left sidebar
   - Click **API** under Project Settings

3. **Copy the Information**
   - **Project URL:** Copy this → This is your `VITE_SUPABASE_URL`
   - **anon public key:** Copy this → This is your `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project Reference ID:** Extract from URL (the part before `.supabase.co`)

## 🔄 Step-by-Step: Changing Supabase Project

### Step 1: Update Environment Variables

**File to Edit:** `.env` (in project root)

**If `.env` doesn't exist, create it:**

```env
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key-here
```

**If `.env` already exists, update these two lines:**

```env
# Old values (replace these)
VITE_SUPABASE_URL=https://fpazhrfkmiohasyteuht.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=old-key-here

# New values (update to your new project)
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key-here
```

### Step 2: Update Supabase Config File

**File to Edit:** `supabase/config.toml`

**Current content:**
```toml
project_id = "fpazhrfkmiohasyteuht"
```

**Update to:**
```toml
project_id = "your-new-project-id"
```

Replace `your-new-project-id` with the project ID from your new Supabase project URL.

### Step 3: Set Up Database on New Project

**IMPORTANT:** Your new Supabase project needs the database schema. You have two options:

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your new project
supabase link --project-ref your-new-project-id

# Push all migrations to the new project
supabase db push
```

#### Option B: Manual Migration (Using SQL Editor)

1. **Go to Supabase Dashboard**
   - Open your **new** project
   - Click **SQL Editor** in left sidebar

2. **Run Migrations in Order**
   - Go to `supabase/migrations/` folder in your project
   - Run each migration file **in chronological order** (by filename):
     - `20251224042559_39c06845-2502-45fa-8b96-2731b5cccec7.sql`
     - `20260112070932_5abf4629-6cf9-487c-ac80-2ffe41b3b113.sql`
     - `20260116055212_29f43419-c7d8-4a51-8066-8ab6320dc31e.sql`
     - `20260124155629_6ba75caf-26fd-407b-8db7-9700e14864b1.sql`
     - `20260124155959_969587ae-a81b-44a8-9273-2805ab237fa9.sql`
     - `20260124160405_f4f51959-8bf-4785-ad3f-17d5af1763a7.sql`
     - `20260125171118_24af34d2-209a-4e82-bc88-d3f7466ce119.sql`
     - `20260126163113_6f9ca8c3-2ad9-4b53-be61-a2a215f93bba.sql`

3. **For each file:**
   - Copy the entire SQL content
   - Paste into SQL Editor
   - Click **Run** or press `Ctrl+Enter`

### Step 4: Verify Database Setup

After running migrations, verify in Supabase Dashboard:

1. **Go to Table Editor**
   - You should see these tables:
     - `profiles`
     - `user_roles`
     - `jobs`
     - `proposals`
     - `contracts`
     - `reviews`
     - `conversations`
     - `messages`
     - `portfolio_items`
     - `rate_limit_log`

2. **Check Database Functions**
   - Go to **Database** → **Functions**
   - You should see:
     - `accept_proposal_atomic`
     - `complete_contract_atomic`
     - `get_user_role`
     - `has_role`
     - `check_rate_limit`
     - `cleanup_rate_limit_logs`

### Step 5: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Test the Connection

1. **Open the application** in browser
2. **Check browser console** (F12 → Console)
   - Should see no Supabase connection errors
3. **Try signing up** a test user
4. **Check Supabase Dashboard** → Table Editor → `profiles`
   - You should see the new user profile

## 📝 Summary of Files to Change

| File | What to Change | Required? |
|------|---------------|-----------|
| `.env` | Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ **Required** |
| `supabase/config.toml` | Update `project_id` | ✅ **Required** |
| Database Migrations | Run on new project | ✅ **Required** |

## ✅ Checklist

Use this checklist to ensure everything is changed:

- [ ] Got new Supabase project URL
- [ ] Got new Supabase anon/public key
- [ ] Updated `.env` file with new values
- [ ] Updated `supabase/config.toml` with new project ID
- [ ] Ran all database migrations on new project
- [ ] Verified tables exist in new project
- [ ] Verified database functions exist
- [ ] Restarted development server
- [ ] Tested connection (no console errors)
- [ ] Tested user signup (creates profile in new database)

## 🚨 Important Notes

### 1. Data Migration
- **Old data will NOT be automatically transferred**
- If you need data from the old project:
  - Export data from old project (Table Editor → Export)
  - Import to new project (Table Editor → Import)
  - Or use Supabase CLI: `supabase db dump` and `supabase db restore`

### 2. Authentication
- Users from old project won't exist in new project
- Users need to sign up again in the new project
- Or migrate auth users if needed (advanced)

### 3. Environment Variables in Production
- If deployed, update environment variables in:
  - **Vercel:** Project Settings → Environment Variables
  - **Netlify:** Site Settings → Environment Variables
  - **Other platforms:** Their respective settings

### 4. Row Level Security (RLS)
- RLS policies are included in migrations
- They should be set up automatically
- Verify in **Authentication** → **Policies** if needed

## 🔍 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Restart dev server after changes

### "Failed to fetch" or connection errors
- Verify new Supabase URL and key are correct
- Check new Supabase project is active (not paused)
- Ensure CORS is enabled in new project settings

### "Table doesn't exist" errors
- Migrations not run on new project
- Run all migrations in order (see Step 3)

### "Function doesn't exist" errors
- Database functions not created
- Check migration `20260126163113_6f9ca8c3-2ad9-4b53-be61-a2a215f93bba.sql` was run

## 📞 Need Help?

If you encounter issues:
1. Check browser console for specific errors
2. Check Supabase dashboard → Logs → Postgres Logs
3. Verify all migrations ran successfully
4. Ensure environment variables are correct

---

**That's it!** Once you complete these steps, your application will be connected to your new Supabase project. 🎉
