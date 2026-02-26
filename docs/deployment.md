# Deployment Guide — vykup-regiony-cz

## 1) Prerequisites

- Node.js **22.x**
- npm **10+**
- Vercel project linked (`vercel link`)
- GitHub repo with branches: `develop`, `main`
- Domains configured in Vercel:
  - `vykup-regiony-cz` production domains
  - staging domain (e.g. `staging.vykup-regiony.cz`)

### Required environment variables

Define in Vercel + GitHub (when needed):

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DEFAULT_REGION`
- `VERCEL_TOKEN` (GitHub Secret)
- `VERCEL_ORG_ID` (GitHub Secret, optional if linked in CI)
- `VERCEL_PROJECT_ID` (GitHub Secret, optional if linked in CI)
- `SENTRY_DSN` (optional but recommended)

## 2) Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## 3) Staging deployment flow

Trigger: `push` to `develop`.

CI pipeline:
1. lint + typecheck
2. tests
3. build
4. deploy staging (`vercel deploy --prebuilt`)

Manual fallback:

```bash
npm ci
npm run build
npx vercel pull --yes --environment=preview
npx vercel build
npx vercel deploy --prebuilt
```

## 4) Production deployment flow

Trigger: `push` to `main`.

CI pipeline:
1. lint + typecheck
2. tests
3. build
4. deploy production (`vercel deploy --prebuilt --prod`)

Manual fallback:

```bash
npm ci
npm run build
npx vercel pull --yes --environment=production
npx vercel build --prod
npx vercel deploy --prebuilt --prod
```

## 5) Rollback procedure (<= 1 minute)

### Option A: Vercel instant rollback
1. Open Vercel Project → Deployments
2. Find previous healthy deployment
3. Click **Promote to Production**

### Option B: Git rollback
```bash
git checkout main
git revert <bad_commit_sha>
git push origin main
```

## 6) Post-deploy checklist

- [ ] Homepage loads on production domain
- [ ] Form submission works
- [ ] Region/domain mapping correct
- [ ] Lighthouse sanity check >= 85 perf
- [ ] No new Sentry critical errors
- [ ] Uptime monitor reports 200
