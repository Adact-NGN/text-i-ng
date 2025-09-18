# Vercel Cron Job Setup

This application includes a scheduled cron job that automatically purges SMS message history older than 90 days.

## Environment Variables Required

Add the following environment variable to your Vercel project:

```
CRON_SECRET=your-secure-random-string-here
```

**Important:** Generate a secure random string for `CRON_SECRET`. You can use:
```bash
openssl rand -base64 32
```

## How It Works

1. **Schedule**: The cron job runs daily at 2:00 AM UTC (`0 2 * * *`)
2. **Function**: `/api/cron/purge-old-messages` - Deletes messages older than 90 days
3. **Security**: Protected by `CRON_SECRET` environment variable
4. **Logging**: Provides detailed logs of cleanup operations

## Configuration Files

- `vercel.json` - Defines the cron schedule
- `src/app/api/cron/purge-old-messages/route.ts` - The cron job implementation
- `src/lib/messageStorage.ts` - Contains the `deleteOldMessages` function

## Manual Testing

You can test the cron job manually by calling:
```bash
curl -X GET "https://your-app.vercel.app/api/cron/purge-old-messages" \
  -H "Authorization: Bearer your-cron-secret"
```

## Monitoring

Check the Vercel dashboard for cron job execution logs and any errors. The function returns detailed information about:
- Number of messages deleted
- Execution timestamp
- Any errors encountered

## Customization

To change the retention period, modify the `daysOld` parameter in the `deleteOldMessages` function call in `/api/cron/purge-old-messages/route.ts`.
