## 🚀 Edge Function Setup Guide — invite-admin

---

## ✅ What's Complete

- ✅ Edge Function created: `supabase/functions/invite-admin/index.ts`
- ✅ AdminUsersPage.jsx wired to call the function
- ✅ Proper authentication token passing
- ✅ RLS enforcement (only admins can create admins)

---

## 📋 Next Steps (DO THIS IN SUPABASE)

### 1️⃣ Get Your Service Role Key

1. Go to **Supabase Dashboard** → Your Project
2. Settings → **API**
3. Copy the **Service Role Key** (keep it secret!)

### 2️⃣ Deploy the Function

Run in your terminal:

```bash
cd c:\Users\sujal\OneDrive\Desktop\my-app

supabase functions deploy invite-admin
```

If you don't have Supabase CLI installed:

```bash
npm install -g supabase
```

Then login and deploy:

```bash
supabase login
supabase link --project-ref your_project_ref
supabase functions deploy invite-admin
```

### 3️⃣ Set the Secret

After deployment, set the service role key as an environment variable:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_service_role_key_here` with the key from step 1.

---

## 🧪 Test It

1. Open your app as an **admin user**
2. Go to **Admin** → **User Management**
3. Click **"+ Add Admin"**
4. Fill in:
   - Full Name: `Test Admin`
   - Email: `test@example.com`
   - Role: `Admin`
5. Click **"Send Invite"**

**Expected outcome:**
- ✅ Success message appears
- ✅ New user created in Supabase Auth
- ✅ Profile row inserted
- ✅ New user appears in the table

---

## ⚠️ Common Issues

### "Unauthorized" Error
- ❌ **Cause**: User is not logged in or token is expired
- ✅ **Fix**: Refresh the page and try again

### "Forbidden" Error
- ❌ **Cause**: Caller is not an admin
- ✅ **Fix**: Make sure the current user has `role = 'admin'` in their profile

### Function not found (404)
- ❌ **Cause**: Function not deployed or URL incorrect
- ✅ **Fix**: 
  1. Verify function deployed: `supabase functions list`
  2. Check `VITE_SUPABASE_URL` in `.env`

### "Missing fields" Error
- ❌ **Cause**: Email or full_name is empty
- ✅ **Fix**: Fill all fields in the modal

---

## 🔐 What the Function Does

1. ✅ Receives email, full_name, role from the frontend
2. ✅ Verifies the caller is an **admin** (checks RLS)
3. ✅ Creates a new auth user (with temp password `Temp@1234`)
4. ✅ Marks email as confirmed
5. ✅ Inserts profile row with the role
6. ✅ Returns success

---

## 📝 File Structure

```
my-app/
  supabase/
    functions/
      invite-admin/
        index.ts  ← Edge Function lives here
```

---

## 🎯 Next Improvements (Optional)

After this works, you could:

1. **Password reset flow** — Send password reset link instead of temp password
2. **Email notification** — Send welcome email to new admin
3. **Audit logging** — Call `adminService.createAuditLog()` after creating user
4. **Role validation** — Only admins can create admins/ngos (add more checks)

---

## ✅ You're Done!

Once the function is deployed and secret is set, your **"Add Admin"** button is fully functional! 🎉
