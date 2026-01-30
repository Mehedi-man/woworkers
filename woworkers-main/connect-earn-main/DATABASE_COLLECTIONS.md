# Database Collections/Tables in Supabase

This document lists all the database tables (collections) that your application uses and saves data to.

## 📋 Complete List of Tables

When you open your Supabase dashboard → **Table Editor**, you will see these tables:

### 1. **profiles** 
**Purpose:** Stores user profile information  
**Data Saved:**
- User's first name, last name
- Avatar URL
- Created/updated timestamps

**When Data is Saved:**
- ✅ Automatically when user signs up (via database trigger)
- ✅ When user updates their profile

**Location in Code:** 
- `src/contexts/AuthContext.tsx` (signup)
- `src/hooks/useUserProfile.ts` (updates)

---

### 2. **user_roles**
**Purpose:** Stores user role (client or freelancer)  
**Data Saved:**
- User ID
- Role ('client' or 'freelancer')

**When Data is Saved:**
- ✅ Automatically when user signs up (via database trigger)

**Location in Code:**
- `src/contexts/AuthContext.tsx` (signup)

---

### 3. **jobs**
**Purpose:** Stores all job postings  
**Data Saved:**
- Job title, description
- Category, skills
- Budget (min, max, type)
- Duration, experience level
- Location, remote status
- Status (open, in-progress, completed, cancelled)
- Client ID

**When Data is Saved:**
- ✅ When client posts a new job

**Location in Code:**
- `src/pages/PostJob.tsx` → `supabase.from("jobs").insert()`

---

### 4. **proposals**
**Purpose:** Stores freelancer proposals for jobs  
**Data Saved:**
- Job ID
- Freelancer ID
- Bid amount
- Cover letter
- Timeline
- Status (pending, accepted, rejected, withdrawn)

**When Data is Saved:**
- ✅ When freelancer submits a proposal

**Location in Code:**
- `src/pages/JobDetail.tsx` → `supabase.from("proposals").insert()`

---

### 5. **contracts**
**Purpose:** Stores contracts/orders between clients and freelancers  
**Data Saved:**
- Job ID, Client ID, Freelancer ID
- Proposal ID
- Contract type, amount
- Status (active, paused, completed, disputed, cancelled)
- Start date, end date
- Delivery text, delivered at, delivery status

**When Data is Saved:**
- ✅ When client accepts a proposal (creates contract)
- ✅ When freelancer delivers work (updates delivery fields)
- ✅ When client accepts/rejects delivery (updates status)

**Location in Code:**
- `src/pages/ClientJobDetail.tsx` → `supabase.rpc('accept_proposal_atomic')`
- `src/pages/Contracts.tsx` → `supabase.from("contracts").update()`
- `src/pages/ContractDetail.tsx` → `supabase.from("contracts").update()`

---

### 6. **reviews**
**Purpose:** Stores client reviews for completed contracts  
**Data Saved:**
- Contract ID
- Client ID, Freelancer ID
- Rating (1-5)
- Comment
- Contract amount

**When Data is Saved:**
- ✅ When client accepts delivery and submits review

**Location in Code:**
- `src/pages/ContractDetail.tsx` → `supabase.rpc('complete_contract_atomic')`
- `src/pages/ClientContracts.tsx` → `supabase.rpc('complete_contract_atomic')`

---

### 7. **conversations**
**Purpose:** Stores message conversations between users  
**Data Saved:**
- Client ID, Freelancer ID
- Job ID (optional)
- Contract ID (optional)
- Last message timestamp

**When Data is Saved:**
- ✅ When a conversation is created
- ✅ When a message is sent (updates last_message_at)

**Location in Code:**
- `src/components/messages/MessageThread.tsx` → `supabase.from("conversations").update()`

---

### 8. **messages**
**Purpose:** Stores individual messages in conversations  
**Data Saved:**
- Conversation ID
- Sender ID
- Message content
- Read status
- Timestamp

**When Data is Saved:**
- ✅ When user sends a message

**Location in Code:**
- `src/components/messages/MessageThread.tsx` → `supabase.from("messages").insert()`

---

### 9. **portfolio_items**
**Purpose:** Stores freelancer portfolio items  
**Data Saved:**
- User ID
- Title, description
- Image URL
- Timestamps

**When Data is Saved:**
- ✅ When freelancer adds a portfolio item
- ✅ When freelancer updates/deletes a portfolio item

**Location in Code:**
- `src/pages/Profile.tsx` → `supabase.from("portfolio_items").insert()`

---

### 10. **rate_limit_log**
**Purpose:** Internal table for rate limiting (prevents spam)  
**Data Saved:**
- User ID
- Action type
- Timestamp

**When Data is Saved:**
- ✅ Automatically by database triggers (when posting jobs/proposals)

**Note:** This is an internal table, you don't need to interact with it directly.

---

## 🔍 How to View Your Data in Supabase

### Step-by-Step:

1. **Go to Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open Table Editor**
   - Click **Table Editor** in the left sidebar
   - You'll see all tables listed above

3. **View Data**
   - Click on any table name
   - You'll see all rows/records in that table
   - You can filter, sort, and search

4. **Verify Data is Being Saved**
   - Perform an action in your app (e.g., post a job)
   - Refresh the table in Supabase
   - You should see the new data appear

## ✅ Quick Verification Test

Test these operations and check Supabase:

1. **Sign Up a User**
   - Check `profiles` table → Should see new profile
   - Check `user_roles` table → Should see role assignment

2. **Post a Job**
   - Check `jobs` table → Should see new job

3. **Submit a Proposal**
   - Check `proposals` table → Should see new proposal

4. **Accept Proposal**
   - Check `contracts` table → Should see new contract
   - Check `proposals` table → Status should be 'accepted'
   - Check `jobs` table → Status should be 'in-progress'

5. **Submit Delivery**
   - Check `contracts` table → `delivery_text`, `delivered_at`, `delivery_status` should be set

6. **Accept Delivery with Review**
   - Check `reviews` table → Should see new review
   - Check `contracts` table → Status should be 'completed'
   - Check `jobs` table → Status should be 'completed'

7. **Send a Message**
   - Check `messages` table → Should see new message
   - Check `conversations` table → `last_message_at` should be updated

8. **Add Portfolio Item**
   - Check `portfolio_items` table → Should see new item

## 📊 Data Flow Summary

```
User Signup
  ↓
profiles + user_roles (auto-created)

Client Posts Job
  ↓
jobs table

Freelancer Submits Proposal
  ↓
proposals table

Client Accepts Proposal
  ↓
contracts table (created)
proposals table (status updated)
jobs table (status updated)

Freelancer Delivers Work
  ↓
contracts table (delivery fields updated)

Client Accepts & Reviews
  ↓
reviews table (created)
contracts table (status = completed)
jobs table (status = completed)
```

## 🎯 Summary

**All 10 tables are properly connected and saving data:**

✅ **profiles** - User information  
✅ **user_roles** - User roles  
✅ **jobs** - Job postings  
✅ **proposals** - Freelancer proposals  
✅ **contracts** - Orders/contracts  
✅ **reviews** - Client reviews  
✅ **conversations** - Message conversations  
✅ **messages** - Individual messages  
✅ **portfolio_items** - Portfolio items  
✅ **rate_limit_log** - Rate limiting (internal)  

**Everything is working!** You can see all your data in the Supabase Table Editor. 🎉
