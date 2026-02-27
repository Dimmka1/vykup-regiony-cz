# Runbook — vykup-regiony-cz

## Incident severity

- **SEV-1**: Site down / 5xx for all users
- **SEV-2**: Core flow degraded (lead form broken)
- **SEV-3**: Non-critical bug (UI issue, slow page)

## 1) Что делать при даунтайме

1. Confirm incident (UptimeRobot + curl check)
2. Check latest deployment in Vercel
3. Check logs:
   - Vercel Runtime logs
   - Function logs
4. If impact high → rollback immediately
5. Open incident note in `devlog.md` with timestamp + root cause

Quick checks:

```bash
curl -I https://project.com
curl -I https://staging.project.com
```

## 2) Что делать при ошибках в Sentry

1. Open new error issue
2. Check release tag + commit
3. Group by fingerprint
4. If regression after deploy → rollback
5. Create fix task for developer

## 3) Как проверить логи

- Vercel Dashboard → Project → Logs
- Filter by level: `error`, `warn`
- Track endpoint, status code, latency, user agent

## 4) Как откатить деплой

Primary:

- Promote last healthy deployment in Vercel

Secondary:

- `git revert` last commit in `main` and redeploy

## 5) Эскалация

- Build/tests failed → `developer`
- Infra/architecture uncertainty → `architect`
- Business-critical blocker → `ceo`

## 6) Monitoring and alerting baseline

- UptimeRobot: check every 5 min (prod + staging)
- Sentry: alert on new unhandled exceptions
- Optional: Telegram alert channel for SEV-1/SEV-2
