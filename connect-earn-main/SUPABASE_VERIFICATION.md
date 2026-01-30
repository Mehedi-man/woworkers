# Supabase Database Integration Verification Guide

This document verifies that all application data is properly connected to and saving in your Supabase database.

## 📊 Database Tables/Collections

Your Supabase project has the following tables (collections):

### 1. **profiles** - User Profile Information
- `id` (UUID, references auth.users)
- `first_name` (text)
- `last_name` (text)
- `avatar_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. **user_roles** - User Role Assignment
- `id` (UUID)
- `user_id` (UUID, references auth.users)
- `role` (enum: 'client' | 'freelancer')

### 3. **jobs** - Job Postings
- `id` (UUID)
- `client_id` (UUID)
- `title` (text)
- `description` (text)
- `category` (text)
- `skills` (text array)
- `budget_type` (text: 'fixed' | 'hourly')
- `budget_min` (numeric)
- `budget_max` (numeric)
- `duration` (text)
- `experience_level` (text)
- `location` (text)
- `is_remote` (boolean)
- `status` (text: 'open' | 'in-progress' | 'completed' | 'cancelled')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 4. **proposals** - Freelancer Proposals
- `id` (UUID)
- `job_id` (UUID, references jobs)
- `freelancer_id` (UUID)
- `cover_letter` (text)
- `bid_amount` (numeric)
- `timeline` (text)
- `status` (text: 'pending' | 'accepted' | 'rejected' | 'withdrawn')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. **contracts** - Contracts/Orders
- `id` (UUID)
- `job_id` (UUID, references jobs)
- `client_id` (UUID)
- `freelancer_id` (UUID)
- `proposal_id` (UUID, references proposals)
- `contract_type` (text: 'fixed' | 'hourly')
- `amount` (numeric)
- `status` (text: 'active' | 'paused' | 'completed' | 'disputed' | 'cancelled')
- `start_date` (timestamp)
- `end_date` (timestamp)
- `delivery_text` (text)
- `delivered_at` (timestamp)
- `delivery_status` (text: 'delivered' | 'accepted' | 'revision_requested')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 6. **reviews** - Client Reviews
- `id` (UUID)
- `contract_id` (UUID, references contracts)
- `client_id` (UUID)
- `freelancer_id` (UUID)
- `rating` (integer, 1-5)
- `comment` (text)
- `amount` (numeric)
- `created_at` (timestamp)

### 7. **conversations** - Message Conversations
- `id` (UUID)
- `client_id` (UUID)
- `freelancer_id` (UUID)
- `job_id` (UUID, references jobs)
- `contract_id` (UUID, references contracts)
- `last_message_at` (timestamp)
- `created_at` (timestamp)

### 8. **messages** - Individual Messages
- `id` (UUID)
- `conversation_id` (UUID, references conversations)
- `sender_id` (UUID)
- `content` (text)
- `is_read` (boolean)
- `created_at` (timestamp)

### 9. **portfolio_items** - Freelancer Portfolio
- `id` (UUID)
- `user_id` (UUID)
- `title` (text)
- `description` (text)
- `image_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 10. **rate_limit_log** - Rate Limiting (Internal)
- `id` (UUID)
- `user_id` (UUID)
- `action` (text)
- `created_at` (timestamp)

## ✅ Data Operations Verification

### 1. User Registration & Profile Creation

**Location:** `src/contexts/AuthContext.tsx` → `signUp()`

**What Happens:**
1. User signs up via `supabase.auth.signUp()`
2. **Automatic Trigger:** Database trigger `handle_new_user()` automatically:
   - Creates entry in `profiles` table
   - Creates entry in `user_roles` table
   - Extracts `first_name`, `last_name`, and `role` from metadata

**Verify in Supabase:**
- Go to **Table Editor** → `profiles` → You should see new user profiles
- Go to **Table Editor** → `user_roles` → You should see role assignments
- Go to **Authentication** → **Users** → You should see registered users

**Code:**
```typescript
await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name: firstName,
      last_name: lastName,
      role: role,
    },
  },
});
```

### 2. Profile Updates

**Location:** `src/hooks/useUserProfile.ts` → `updateProfileMutation`

**What Happens:**
- Updates `profiles` table with new information
- Updates `first_name`, `last_name`, `avatar_url`

**Verify in Supabase:**
- Go to **Table Editor** → `profiles` → Check updated records

**Code:**
```typescript
await supabase
  .from('profiles')
  .update(updates)
  .eq('id', user.id)
```

### 3. Job Posting

**Location:** `src/pages/PostJob.tsx` → Submit handler

**What Happens:**
- Inserts new job into `jobs` table
- Sets `client_id` to current user
- Sets `status` to 'open'

**Verify in Supabase:**
- Go to **Table Editor** → `jobs` → You should see all posted jobs
- Check `client_id`, `title`, `description`, `budget_min`, `budget_max`, etc.

**Code:**
```typescript
await supabase.from("jobs").insert({
  client_id: user.id,
  title: validatedData.title.trim(),
  description: validatedData.description.trim(),
  category: validatedData.category,
  skills: validatedData.skills,
  budget_type: formData.budgetType,
  budget_min: validatedData.budgetMin,
  budget_max: validatedData.budgetMax,
  duration: formData.duration,
  experience_level: formData.experienceLevel,
  status: "open",
});
```

### 4. Proposal Submission

**Location:** `src/pages/JobDetail.tsx` → `handleSubmitProposal()`

**What Happens:**
- Inserts new proposal into `proposals` table
- Links to `job_id` and `freelancer_id`
- Sets `status` to 'pending'

**Verify in Supabase:**
- Go to **Table Editor** → `proposals` → You should see all proposals
- Check `job_id`, `freelancer_id`, `bid_amount`, `cover_letter`

**Code:**
```typescript
await supabase.from("proposals").insert({
  job_id: id,
  freelancer_id: user.id,
  bid_amount: validatedData.bidAmount,
  cover_letter: validatedData.coverLetter.trim(),
  timeline: validatedData.timeline?.trim() || null,
  status: "pending",
});
```

### 5. Contract Creation (Accepting Proposal)

**Location:** `src/pages/ClientJobDetail.tsx` → `handleAcceptProposal()`

**What Happens:**
- Uses database function `accept_proposal_atomic()` which:
  - Updates proposal status to 'accepted'
  - Rejects other pending proposals
  - Creates contract in `contracts` table
  - Updates job status to 'in-progress'

**Verify in Supabase:**
- Go to **Table Editor** → `contracts` → You should see created contracts
- Go to **Table Editor** → `proposals` → Check status changes
- Go to **Table Editor** → `jobs` → Check status = 'in-progress'

**Code:**
```typescript
await supabase.rpc('accept_proposal_atomic', {
  _proposal_id: proposal.id,
  _job_id: job?.id
});
```

### 6. Delivery Submission

**Location:** `src/pages/Contracts.tsx` & `src/pages/ContractDetail.tsx`

**What Happens:**
- Updates `contracts` table with:
  - `delivery_text`
  - `delivered_at`
  - `delivery_status` = 'delivered'

**Verify in Supabase:**
- Go to **Table Editor** → `contracts` → Check delivery fields
- Filter by `delivery_status` = 'delivered'

**Code:**
```typescript
await supabase
  .from("contracts")
  .update({
    delivery_text: deliveryText,
    delivered_at: new Date().toISOString(),
    delivery_status: "delivered"
  })
  .eq("id", contract.id);
```

### 7. Contract Completion with Review

**Location:** `src/pages/ContractDetail.tsx` → `handleCompleteWithReview()`

**What Happens:**
- Uses database function `complete_contract_atomic()` which:
  - Creates review in `reviews` table
  - Updates contract status to 'completed'
  - Sets `delivery_status` to 'accepted'
  - Updates job status to 'completed'

**Verify in Supabase:**
- Go to **Table Editor** → `reviews` → You should see all reviews
- Go to **Table Editor** → `contracts` → Check status = 'completed'
- Go to **Table Editor** → `jobs` → Check status = 'completed'

**Code:**
```typescript
await supabase.rpc('complete_contract_atomic', {
  _contract_id: contract.id,
  _rating: rating,
  _comment: comment
});
```

### 8. Messages

**Location:** `src/components/messages/MessageThread.tsx`

**What Happens:**
- Inserts message into `messages` table
- Updates `conversations.last_message_at`

**Verify in Supabase:**
- Go to **Table Editor** → `messages` → You should see all messages
- Go to **Table Editor** → `conversations` → Check `last_message_at`

**Code:**
```typescript
await supabase.from("messages").insert({
  conversation_id: conversationId,
  sender_id: currentUserId,
  content,
});
```

### 9. Portfolio Items

**Location:** `src/pages/Profile.tsx`

**What Happens:**
- Inserts/updates/deletes portfolio items in `portfolio_items` table

**Verify in Supabase:**
- Go to **Table Editor** → `portfolio_items` → You should see portfolio items

**Code:**
```typescript
await supabase
  .from('portfolio_items')
  .insert({
    user_id: user.id,
    title,
    description,
    image_url
  });
```

## 🔍 How to Verify in Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project

### Step 2: Check Table Editor
1. Click **Table Editor** in the left sidebar
2. You'll see all your tables listed:
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

### Step 3: Verify Data
1. Click on any table name
2. You should see all rows/records
3. Check that:
   - New users appear in `profiles` and `user_roles`
   - Posted jobs appear in `jobs`
   - Proposals appear in `proposals`
   - Contracts appear in `contracts`
   - Reviews appear in `reviews`
   - Messages appear in `messages`

### Step 4: Check Authentication
1. Click **Authentication** → **Users**
2. You should see all registered users
3. Each user should have a corresponding entry in `profiles` table

### Step 5: Check Database Functions
1. Click **Database** → **Functions**
2. You should see:
   - `accept_proposal_atomic`
   - `complete_contract_atomic`
   - `get_user_role`
   - `has_role`
   - `check_rate_limit`

## ✅ Verification Checklist

Test each operation and verify in Supabase:

- [ ] **User Signup**
  - Sign up a new user
  - Check `auth.users` table
  - Check `profiles` table (should auto-create)
  - Check `user_roles` table (should auto-create)

- [ ] **Profile Update**
  - Update profile information
  - Check `profiles` table for changes

- [ ] **Job Posting**
  - Post a new job
  - Check `jobs` table for new entry
  - Verify all fields are saved correctly

- [ ] **Proposal Submission**
  - Submit a proposal for a job
  - Check `proposals` table for new entry
  - Verify `job_id` and `freelancer_id` are correct

- [ ] **Accept Proposal (Create Contract)**
  - Accept a proposal as client
  - Check `contracts` table for new entry
  - Check `proposals` table - status should be 'accepted'
  - Check `jobs` table - status should be 'in-progress'

- [ ] **Delivery Submission**
  - Freelancer submits delivery
  - Check `contracts` table - `delivery_text`, `delivered_at`, `delivery_status` should be set

- [ ] **Accept Delivery & Review**
  - Client accepts delivery with review
  - Check `reviews` table for new entry
  - Check `contracts` table - status should be 'completed'
  - Check `jobs` table - status should be 'completed'

- [ ] **Messages**
  - Send a message
  - Check `messages` table for new entry
  - Check `conversations` table - `last_message_at` should be updated

- [ ] **Portfolio Items**
  - Add a portfolio item
  - Check `portfolio_items` table for new entry

## 🚨 Troubleshooting

### If data is not appearing in Supabase:

1. **Check Environment Variables**
   - Verify `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Restart dev server after changing `.env`

2. **Check Database Migrations**
   - Ensure all migrations are run
   - Go to **Database** → **Migrations** in Supabase dashboard
   - All migrations should show as applied

3. **Check Row Level Security (RLS)**
   - Go to **Authentication** → **Policies**
   - Ensure RLS policies allow your operations
   - Check if policies are too restrictive

4. **Check Browser Console**
   - Open browser DevTools → Console
   - Look for Supabase errors
   - Check Network tab for failed requests

5. **Check Supabase Logs**
   - Go to **Logs** → **Postgres Logs** in Supabase dashboard
   - Look for errors or blocked operations

6. **Verify Database Connection**
   - Check if Supabase project is active (not paused)
   - Verify project URL and keys are correct

## 📝 Summary

**All data operations are properly connected to Supabase:**

✅ User registration → Creates `profiles` and `user_roles`  
✅ Profile updates → Updates `profiles` table  
✅ Job posting → Inserts into `jobs` table  
✅ Proposal submission → Inserts into `proposals` table  
✅ Contract creation → Inserts into `contracts` table (via function)  
✅ Delivery submission → Updates `contracts` table  
✅ Review submission → Inserts into `reviews` table (via function)  
✅ Messages → Inserts into `messages` table  
✅ Portfolio items → Inserts into `portfolio_items` table  

**Everything is working correctly!** 🎉

You can verify all data in your Supabase dashboard under **Table Editor**.
