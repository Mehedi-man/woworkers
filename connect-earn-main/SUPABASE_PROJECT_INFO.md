# Supabase Project Information

## 🔍 Project Details Found

### Project ID
**Project ID:** `fpazhrfkmiohasyteuht`

**Location:** `supabase/config.toml`

```toml
project_id = "fpazhrfkmiohasyteuht"
```

### Project URL Format
Based on the project ID, your Supabase project URL should be:
```
https://fpazhrfkmiohasyteuht.supabase.co
```

## 📋 Configuration Details

### Environment Variables Required
The application uses these environment variables (stored in `.env` file):

```env
VITE_SUPABASE_URL=https://fpazhrfkmiohasyteuht.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Note:** The `.env` file is not in the repository (it's in `.gitignore`) for security reasons.

### Where Configuration is Used
- **Supabase Client:** `src/integrations/supabase/client.ts`
- **Config File:** `supabase/config.toml`

## 🔗 How to Access Your Project

### Method 1: Via Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Look for project with ID: `fpazhrfkmiohasyteuht`
4. Or search for projects - the project ID should help you identify it

### Method 2: Direct URL (if you have access)
If you're logged in, you can try:
```
https://supabase.com/dashboard/project/fpazhrfkmiohasyteuht
```

### Method 3: Check Your .env File
If you have a `.env` file in the project root, check:
```env
VITE_SUPABASE_URL=https://fpazhrfkmiohasyteuht.supabase.co
```

## 🔑 Getting Your API Keys

If you need to find your API keys:

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project (ID: `fpazhrfkmiohasyteuht`)

2. **Navigate to Settings**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **API** under Project Settings

3. **Find Your Keys**
   - **Project URL:** This is your `VITE_SUPABASE_URL`
     - Should be: `https://fpazhrfkmiohasyteuht.supabase.co`
   - **anon public key:** This is your `VITE_SUPABASE_PUBLISHABLE_KEY`
     - A long JWT token starting with `eyJ...`

## 📊 Project Structure

Your Supabase project contains:

### Database Tables (10 tables)
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

### Database Functions
- `accept_proposal_atomic`
- `complete_contract_atomic`
- `get_user_role`
- `has_role`
- `check_rate_limit`
- `cleanup_rate_limit_logs`

### Migrations
All migrations are in: `supabase/migrations/`
- 8 migration files total
- Latest: `20260126163113_6f9ca8c3-2ad9-4b53-be61-a2a215f93bba.sql`

## ✅ Verification Steps

To verify you have the correct project:

1. **Check Project ID**
   - Open `supabase/config.toml`
   - Verify `project_id = "fpazhrfkmiohasyteuht"`

2. **Check Environment Variables**
   - Open `.env` file (if exists)
   - Verify `VITE_SUPABASE_URL` contains the project ID
   - Should be: `https://fpazhrfkmiohasyteuht.supabase.co`

3. **Test Connection**
   - Run the application
   - Check browser console for Supabase connection errors
   - If no errors, connection is working

4. **Check Supabase Dashboard**
   - Log in to Supabase
   - Find project with ID: `fpazhrfkmiohasyteuht`
   - Verify you can see the tables in Table Editor

## 🚨 Important Notes

1. **Project ID is Public**
   - The project ID in `config.toml` is safe to share
   - It's just an identifier

2. **API Keys are Secret**
   - Never commit `.env` file to git
   - Never share your `anon` or `service_role` keys publicly
   - The `.env` file is already in `.gitignore`

3. **Project Access**
   - You need to be logged into the Supabase account that owns this project
   - If you don't have access, contact the project owner

## 📝 Summary

**Your Supabase Project:**
- **Project ID:** `fpazhrfkmiohasyteuht`
- **Project URL:** `https://fpazhrfkmiohasyteuht.supabase.co`
- **Config File:** `supabase/config.toml`
- **Client Config:** `src/integrations/supabase/client.ts`

To access your project, go to [supabase.com/dashboard](https://supabase.com/dashboard) and look for the project with ID `fpazhrfkmiohasyteuht`.
