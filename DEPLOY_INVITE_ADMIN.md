## 🚀 Deploy & Test Invite-Admin Function

---

## 📋 Pre-Deployment Checklist

### ✅ Frontend Code
- [x] AdminUsersPage.jsx has `handleInviteAdmin` with correct auth token
- [x] Uses `session.access_token` (not anon key)
- [x] Calls correct function URL

### ✅ Edge Function
- [x] `supabase/functions/invite-admin/index.ts` has:
  - CORS headers for all responses
  - `persistSession: false` to bypass RLS
  - Console logs for debugging
  - Duplicate email check
  - Proper error messages

### ✅ Database RLS
- [ ] Run SQL policies in Supabase (see below)

---

## 🗄️ STEP 1: Set Up Database RLS

Run in **Supabase SQL Editor** (one time only):

```sql
-- Admin can insert profiles (for invite-admin edge function)
create policy "admin can insert profiles"
on public.profiles
for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role = 'admin'
  )
);
```

Or copy the full setup from: `src/config/ADMIN_SETUP.sql`

---

## 🚀 STEP 2: Deploy Function

### Terminal Commands

```bash
cd c:\Users\sujal\OneDrive\Desktop\my-app

# Deploy function
supabase functions deploy invite-admin

# Show logs (run after testing)
supabase functions logs invite-admin
```

---

## 🔐 STEP 3: Set Secret

Get your **Service Role Key**:
1. Go to **Supabase Dashboard**
2. Settings → **API**
3. Copy **Service Role Key** (keep it secret!)

Then run:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_service_role_key_here` with the actual key.

---

## 🧪 STEP 4: Test

### Test Steps

1. Open your app as **admin user**
2. Navigate to **Admin** → **User Management**
3. Click **"+ Add Admin"** button
4. Fill in:
   - Full Name: `Test Admin`
   - Email: `testadmin@example.com`
   - Role: `Admin`
5. Click **"Send Invite"**

### Expected Results

✅ Success message appears
✅ New user appears in the table
✅ Check email (should receive password reset if configured)

---

## 🐛 TROUBLESHOOTING

### Issue: "Failed to fetch" or CORS error

**Cause:** CORS headers missing or frontend using wrong auth token

**Fix:**
1. Verify `Authorization: Bearer ${session.access_token}` in AdminUsersPage.jsx
2. Check function has CORS headers
3. Redeploy: `supabase functions deploy invite-admin`

---

### Issue: "Forbidden" error

**Cause:** Caller is not an admin

**Check:**
1. Verify you're logged in as admin
2. Check your profile: `SELECT * FROM profiles WHERE id = 'your_id'`
3. Ensure `role = 'admin'`

---

### Issue: "User already exists"

**Cause:** Email already registered

**Fix:** Use different email or delete the existing user first

---

### Issue: Profile insert fails (500 error)

**Check logs:**
```bash
supabase functions logs invite-admin
```

Look for:
- ❌ `PROFILE ERROR:` — RLS policy issue
- ❌ `USER ERROR:` — Auth creation failed
- ❌ Missing fields

**If RLS error:** Run the INSERT policy from Step 1

---

## 📊 Console Logs

The function logs each step:

```
✅ User authenticated: abc-123
✅ Caller is admin
✅ Email is unique
✅ Auth user created: xyz-789
✅ Profile inserted successfully
```

View logs:
```bash
supabase functions logs invite-admin
```

---

## ✅ Function Flow

```
Frontend (AdminUsersPage.jsx)
    ↓
    [POST /functions/v1/invite-admin]
    ↓
Edge Function (index.ts)
    ├─ Check auth token
    ├─ Verify caller is admin
    ├─ Check email not duplicate
    ├─ Create auth user
    ├─ Insert profile row
    └─ Return success
    ↓
Frontend receives response
    ├─ Show success message
    ├─ Refresh user table
    └─ Close modal
```

---

## 🔑 Key Files Updated

| File | Changes |
|------|---------|
| `supabase/functions/invite-admin/index.ts` | ✅ CORS, logs, RLS bypass, duplicate check |
| `src/admin/AdminUsersPage.jsx` | ✅ Session token auth, error handling |
| `src/config/ADMIN_SETUP.sql` | ✅ Admin insert RLS policy added |
| `.vscode/settings.json` | ✅ Deno support enabled |

---

## 🎯 Next Steps After Deployment

1. ✅ Verify edge function works
2. ✅ Test creating multiple admins
3. ✅ Optional: Improve temp password (send reset link)
4. ✅ Optional: Add email notification
5. ✅ Optional: Add audit logging

---

## 📞 Support

If you get errors:
1. Check function logs: `supabase functions logs invite-admin`
2. Verify RLS policy is created
3. Make sure service role key is set
4. Test with correct admin account
