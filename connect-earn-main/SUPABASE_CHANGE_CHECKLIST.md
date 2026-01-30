# Quick Checklist: Information Needed to Change Supabase Project

## 📋 What I Need From You

To change your Supabase project, I need these **3 pieces of information** from your **new Supabase project**:

### 1. Project URL
- **Where to find:** Supabase Dashboard → Settings → API → Project URL
- **Format:** `https://[project-id].supabase.co`
- **Example:** `https://abcdefghijklmnop.supabase.co`

### 2. Anon/Public Key
- **Where to find:** Supabase Dashboard → Settings → API → anon public key
- **Format:** Long JWT token starting with `eyJ...`
- **This is safe** to use in frontend code

### 3. Project ID (Reference ID)
- **Where to find:** Extract from Project URL (the part before `.supabase.co`)
- **Example:** If URL is `https://abcdefghijklmnop.supabase.co`, then ID is `abcdefghijklmnop`

## 🔄 What Will Be Changed

Once you provide the information, I'll update:

1. ✅ **`.env` file** - Update environment variables
2. ✅ **`supabase/config.toml`** - Update project ID
3. ✅ **Guide you** through running database migrations

## 📝 Quick Steps After You Provide Info

1. Update `.env` file with new URL and key
2. Update `supabase/config.toml` with new project ID
3. Run database migrations on new project
4. Test connection

## 📖 Full Guide

See `CHANGE_SUPABASE_PROJECT.md` for complete step-by-step instructions.

---

**Just provide me the 3 pieces of information above, and I'll help you change everything!** 🚀
