# Publish both apps with GitHub Actions

One workflow (**.github/workflows/publish.yml**) publishes:

| App | Where Actions publishes it | Public URL |
|-----|----------------------------|------------|
| **Frontend** | GitHub Pages | https://vamsikrishna-1530.github.io/student-management/ |
| **Backend** | Render (via deploy hook) | https://student-management-api-2hvd.onrender.com |

> GitHub Pages can only host the static React app. A Node + Mongo API cannot run on `github.io`, so Actions deploys the API to Render’s free public URL.

---

## Frontend URL (already works)

After **Publish Full Stack** succeeds:

**https://vamsikrishna-1530.github.io/student-management/**

Find it in:

- Actions → **Publish Full Stack** → Summary  
- Repo → **Settings → Pages**

---

## Backend URL (one-time Render connect)

### 1. Deploy API (click)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/vamsikrishna-1530/student-management)

Or: Render → **New → Blueprint** → this repo.

Set:

| Env | Value |
|-----|-------|
| `MONGODB_URI` | Atlas connection string |
| `CLIENT_URL` | `https://vamsikrishna-1530.github.io,http://localhost:5173` |

### 2. Wire Actions → Render

Render API service → **Settings → Deploy Hook** → copy URL.

GitHub → **Settings → Secrets and variables → Actions** → secret:

- `RENDER_DEPLOY_HOOK_BACKEND` = deploy hook URL

Variables (already set if you used this guide’s defaults):

- `FRONTEND_URL` = `https://vamsikrishna-1530.github.io/student-management`
- `BACKEND_URL` = `https://student-management-api.onrender.com`
- `VITE_API_URL` = `https://student-management-api.onrender.com/api`

### 3. Seed once

```bash
MONGODB_URI="your-atlas-uri" npm --prefix backend run seed
```

### 4. Push to `main`

Actions publishes:

1. Frontend → GitHub Pages  
2. Backend image → GHCR  
3. Backend service → Render (hook)

---

## Final links

- **Website:** https://vamsikrishna-1530.github.io/student-management/  
- **API:** https://student-management-api-2hvd.onrender.com  
- **Health:** https://student-management-api-2hvd.onrender.com/api/health  

---

## Fix: `bad auth : authentication failed` (Atlas)

This means Render reached MongoDB Atlas, but **username/password in `MONGODB_URI` is wrong**.

### 1. Create / reset an Atlas database user

1. [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Database Access**
2. Add user (or edit existing) with **Password** auth
3. Prefer a simple password first (letters + numbers only) to avoid encoding issues
4. Role: **Atlas admin** or **Read and write to any database**

### 2. Allow Render to connect (Network Access)

1. Atlas → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** → `0.0.0.0/0`

### 3. Copy a fresh connection string

1. Atlas → **Database** → **Connect** → **Drivers**
2. Copy the URI, then replace `<password>` with the real password
3. Example shape:

```text
mongodb+srv://myuser:MyPassword123@cluster0.xxxxx.mongodb.net/student_management?retryWrites=true&w=majority
```

### 4. URL-encode special characters in the password

If the password has `@ # % / : ? &` etc., encode them in the URI:

| Char | Encoded |
|------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |
| `&` | `%26` |

Example: password `p@ss#1` → user part `myuser:p%40ss%231@cluster...`

### 5. Set it on Render (do not commit this)

1. Render → `student-management-api` → **Environment**
2. Set `MONGODB_URI` to the full URI (no quotes, no spaces)
3. **Save** → **Manual Deploy → Deploy latest commit**

### 6. Quick local check (optional)

```bash
cd backend
MONGODB_URI='mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/student_management' npm run seed
```

If seed works locally with the same URI, paste that exact value into Render.
