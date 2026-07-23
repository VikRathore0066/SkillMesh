# 🚀 How to Deploy SkillMesh on Vercel

Vercel is the most recommended platform for deploying Next.js apps. By connecting your GitHub repository, Vercel will automatically compile and deploy your app every time you push code to GitHub.

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Create a Vercel Account
1. Visit **[vercel.com/signup](https://vercel.com/signup)**.
2. Select **Continue with GitHub**. This will link your GitHub account automatically.

### Step 2: Import Your Repository
1. On your Vercel Dashboard, click **Add New** (top right) and select **Project**.
2. Under "Import Git Repository", look for **SkillMesh** (from your GitHub account `VikRathore0066/SkillMesh`).
3. Click **Import** next to it.

### Step 3: Configure Environment Variables
1. Under the **Environment Variables** section on the import screen, add the following key:
   - **Key**: `JWT_SECRET`
   - **Value**: *[Type any secure random string here]* (e.g. `your-super-secret-key-321`)
2. You do **not** need to add `DATABASE_PATH` — the app defaults to using `skillmesh.db` at the root folder automatically if omitted, which will compile and auto-seed on startup!

### Step 4: Deploy
1. Click the **Deploy** button.
2. Vercel will clone your GitHub repository, compile the static components, and package your serverless routes.
3. Within 1-2 minutes, you will receive a live URL (e.g., `https://skillmesh.vercel.app`)!

---

## ⚠️ Important SQLite Behavior on Serverless Platforms

Because Vercel is a **serverless** platform:
1. **Auto-Seeding**: Every time the app's serverless container spins up, it imports the database schema and automatically seeds it with your **5 demo users, 10 tasks, 3 submissions, and 4 reviews**. This makes it perfect for judges to test immediately.
2. **Ephemeral Disk**: Any changes made by users on the live URL (like creating new accounts, claiming new tasks, or submitting reviews) are written to memory and **will reset back to the default seeded state after a few minutes of inactivity**.
3. **If you need full persistence** (where new data is never wiped), you can swap SQLite with a free hosted PostgreSQL database (like **Neon.tech** or **Supabase**) inside `src/lib/db.js` in the future.
