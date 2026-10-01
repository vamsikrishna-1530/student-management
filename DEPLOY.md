# Public deployment (Render + GitHub Actions)

GitHub Actions alone cannot host a Node/Mongo app. This project deploys to
**Render** (free tier) and uses GitHub Actions deploy hooks to republish on every push to `main`.

## Your public URLs (after setup)

| App | Typical URL |
|-----|-------------|
| Frontend | `https://student-management-ui.onrender.com` |
| Backend API | `https://student-management-api.onrender.com` |
| Health check | `https://student-management-api.onrender.com/api/health` |

Exact hostnames are shown in the Render dashboard after the first deploy.

---

## One-time setup (about 10 minutes)

### 1. Free MongoDB (Atlas)

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Network Access → allow `0.0.0.0/0` (required for Render)
4. Copy the connection string, e.g.  
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/student_management`

### 2. Create Render services from this repo

1. Sign up at [render.com](https://render.com) with GitHub
2. **New → Blueprint** → select `vamsikrishna-1530/student-management`
3. Apply `render.yaml`
4. When prompted for env values:

**API service (`student-management-api`)**

| Key | Value |
|-----|-------|
| `MONGODB_URI` | your Atlas URI |
| `CLIENT_URL` | `https://student-management-ui.onrender.com` (use the real UI URL from Render) |

**UI service (`student-management-ui`)**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://student-management-api.onrender.com/api` (use the real API URL) |

5. Wait until both services show **Live**
6. Copy the two public URLs

### 3. Seed production data (once)

In Render → API service → **Shell** (or locally with production URI):

```bash
MONGODB_URI="your-atlas-uri" npm run seed
```

Demo login: `admin@sms.edu` / `Admin@123`

### 4. Connect GitHub Actions → Render

In each Render service → **Settings → Deploy Hook** → copy URL.

In GitHub → **Settings → Secrets and variables → Actions**:

**Secrets**

| Name | Value |
|------|-------|
| `RENDER_DEPLOY_HOOK_BACKEND` | API deploy hook URL |
| `RENDER_DEPLOY_HOOK_FRONTEND` | UI deploy hook URL |

**Variables**

| Name | Value |
|------|-------|
| `BACKEND_URL` | `https://student-management-api.onrender.com` |
| `FRONTEND_URL` | `https://student-management-ui.onrender.com` |
| `VITE_API_URL` | `https://student-management-api.onrender.com/api` |

### 5. Turn off double deploys (recommended)

In both Render services → **Settings → Build & Deploy** → set **Auto-Deploy** to **No**.  
GitHub Actions will trigger deploys via hooks after CI images build.

---

## What happens on every `git push` to `main`

```text
Push to main
   ↓
GitHub Actions: CI (build)
   ↓
GitHub Actions: Deploy
   ├── Push Docker images → GHCR
   └── curl Render deploy hooks → public URLs update
```

---

## After setup, open

```text
https://student-management-ui.onrender.com
```

Free Render services sleep after idle time; the first request may take ~30–60 seconds.
