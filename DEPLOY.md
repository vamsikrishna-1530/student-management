# Publish both apps with GitHub Actions

One workflow (**.github/workflows/publish.yml**) publishes:

| App | Where Actions publishes it | Public URL |
|-----|----------------------------|------------|
| **Frontend** | GitHub Pages | https://vamsikrishna-1530.github.io/student-management/ |
| **Backend** | Render (via deploy hook) | https://student-management-api.onrender.com |

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
- **API:** https://student-management-api.onrender.com  
- **Health:** https://student-management-api.onrender.com/api/health  
