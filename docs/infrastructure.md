# Infrastructure — vykup-regiony-cz

## Architecture

- **Frontend/App**: Next.js 15 (App Router)
- **Hosting**: Vercel
- **Runtime**: Node.js 22
- **Config source**: YAML region/domain config in repo
- **Error tracking**: Sentry
- **Uptime**: UptimeRobot
- **Analytics**: Vercel Analytics (or Umami)

## Environments

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| Development | local | http://localhost:3000 | Dev iteration |
| Staging | develop | https://staging.project.com | QA and preview |
| Production | main | https://project.com | Live users |

## Services and access

- GitHub (repo + Actions)
- Vercel (deploy + domains + env vars)
- Sentry (errors)
- UptimeRobot (health checks)
- DNS provider (Cloudflare recommended)

## DNS records (example)

- `A @ -> 76.76.21.21` (Vercel apex)
- `CNAME www -> cname.vercel-dns.com`
- Regional aliases as required by go-to-market strategy

## SSL/TLS

- Managed by Vercel (auto renew)
- Enforce HTTPS redirects

## Backups and recovery

- Source code: GitHub (primary backup)
- Config: versioned in git
- Releases: Vercel deployment history
- Recovery target: rollback within 1 minute

## Security baseline checklist

- [x] HTTPS enforced
- [x] Secrets in env vars only
- [x] GitHub secrets configured for CI deploy
- [x] npm audit in release checklist
- [x] No secrets in repository
- [ ] CSP headers hardening (next.config.ts)
- [ ] API rate limiting (when backend endpoints grow)
