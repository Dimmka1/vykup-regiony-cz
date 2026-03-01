# Lead Notification Setup Guide

## 1. Telegram Bot

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`, follow instructions, copy the **bot token**
3. Start a chat with your new bot (send any message)
4. Get your chat ID:
   ```
   curl https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
   Look for `"chat":{"id": 123456789}` — that's your `TELEGRAM_CHAT_ID`

## 2. Google Sheets Persistence

1. Create a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete default code, paste contents of `google-sheets-webhook.js`
4. Click **Deploy → New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click **Deploy**, authorize, copy the **Web app URL**

## 3. Vercel Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

| Variable             | Description                                    |
| -------------------- | ---------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather                      |
| `TELEGRAM_CHAT_ID`   | Your Telegram chat ID                          |
| `LEAD_WEBHOOK_URL`   | Google Apps Script web app URL                 |
| `RESEND_API_KEY`     | (optional) Resend.com API key for email        |
| `LEAD_NOTIFY_EMAIL`  | (optional) Email to receive lead notifications |

After setting vars, redeploy the project.

## 4. Testing

Send a test lead via curl:

```bash
curl -X POST https://your-domain.cz/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+420 123 456 789",
    "property_type": "Byt",
    "region": "Praha",
    "situation_type": "Prodej",
    "consent_gdpr": true
  }'
```

You should receive:

- ✅ Telegram message instantly
- ✅ Row in Google Sheet (via webhook)
- ✅ Email (if configured)
- ✅ Backup in `/tmp/leads-backup.json` on server
