# Official organization showcase database

This project’s MongoDB (Atlas on Render) is the **CampusLedger Demo College** org database used to teach CSE students.

It is **not** a free-for-all test DB.

## Rules

1. Official demo accounts/courses stay stable for every workshop
2. Public self-registration is **disabled** (`ALLOW_PUBLIC_REGISTER=false`)
3. Admins add students from the **Students** page when needed for live demos
4. Stray test signups are removed automatically on API startup / Sync

## Official logins

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sms.edu` | `Admin@123` |
| Teacher | `priya@sms.edu` | `Teacher@123` |
| Student | `arjun@student.edu` | `Student@123` |

## Keep the org DB clean

### From the UI (admin)

Dashboard → **Sync org DB** (safe upsert + remove stray users)  
Dashboard → **Reset org DB** (wipe everything, restore official showcase only)

### From your machine (same Atlas URI as Render)

```bash
cd backend
# Upsert official data + remove non-org test users
MONGODB_URI='your-atlas-uri' npm run seed

# Full wipe + official showcase only
MONGODB_URI='your-atlas-uri' npm run seed:reset
```

### On Render Shell

```bash
npm run seed
# or
npm run seed:reset
```

## Source of truth

Official records live in:

`backend/src/data/orgShowcase.ts`

Edit that file when you want to change the permanent workshop dataset, then Sync/Reset.
