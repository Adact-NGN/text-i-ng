# TextiNG SMS App - Local Setup Status

## ✅ Completed Steps

1. **Repository Cloned** - Project successfully cloned from GitHub
2. **Vercel CLI Installed** - Installed and authenticated
3. **Project Linked** - Linked to Vercel project `jrgen-sqs-projects/text-i-ng`
4. **Environment Variables** - `.env.local` file pulled from Vercel
5. **Dependencies Installed** - All npm packages installed successfully

## 📋 Current Configuration

### Files Present
- ✅ `package.json` - Project configuration
- ✅ `.env.local` - Environment variables (only VERCEL_OIDC_TOKEN currently)
- ✅ `.vercel/` - Vercel project configuration
- ✅ `database-schema.sql` - Database schema definition

### Documentation Available
- `README.md` - Project overview
- `TWILIO_SETUP.md` - Twilio SMS configuration guide
- `AZURE_AD_SETUP.md` - Azure AD authentication guide
- `AZURE_AD_GROUPS_SETUP.md` - Azure AD groups configuration
- `SENDER_ID_SETUP.md` - Sender ID configuration
- `CRON_SETUP.md` - Cron job setup
- `VERSION-MANAGEMENT.md` - Version management guide
- `TOKEN_DEBUG_INSTRUCTIONS.md` - Token debugging guide

## ⚠️ Required Configuration (To Run Locally)

Your `.env.local` file currently only has the Vercel OIDC token. To run the app locally, you need to add:

### 1. Database Configuration (Required)
```bash
texting_POSTGRES_URL=postgresql://...
POSTGRES_URL=postgresql://...
```
**Where to get:** Vercel Dashboard → Your Project → Storage → Postgres

### 2. Twilio Configuration (Required for SMS)
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```
**Where to get:** https://console.twilio.com/

### 3. Azure AD Configuration (Required for Auth)
```bash
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
```
**Where to get:** Azure Portal → App Registrations

### 4. NextAuth Configuration (Required for Auth)
```bash
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```
**Generate secret with:** `openssl rand -base64 32`

## 🚀 Next Steps

### Option 1: Pull Production Environment Variables from Vercel
If your production environment is fully configured in Vercel:
```bash
vercel env pull .env.production.local production
```

### Option 2: Manual Configuration
1. Open `.env.local` in your editor
2. Add the required environment variables (see template in `ENV_SETUP.md`)
3. Follow the setup guides:
   - `TWILIO_SETUP.md` for SMS configuration
   - `AZURE_AD_SETUP.md` for authentication
4. Initialize the database:
   - Run the SQL in `database-schema.sql` on your Postgres database

### Option 3: Check Vercel Dashboard
Visit https://vercel.com/jrgen-sqs-projects/text-i-ng/settings/environment-variables to see what's configured in production.

## 🏃 Running the Application

Once environment variables are configured:

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at http://localhost:3000

## 🔍 Troubleshooting

If you encounter issues:

1. **Database Connection Errors**
   - Verify your database connection string
   - Check if the database is accessible from your network
   - Run the database schema if tables don't exist

2. **Authentication Errors**
   - Check Azure AD configuration
   - Verify redirect URIs match
   - Enable `NEXTAUTH_DEBUG=true` in `.env.local`

3. **SMS Sending Errors**
   - Verify Twilio credentials
   - Check Twilio account balance
   - Ensure phone number has SMS capabilities

## 📦 Project Structure

```
text-i-ng/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions and services
│   └── middleware.ts  # Auth middleware
├── scripts/          # Version management scripts
├── .env.local        # Local environment variables (not in git)
└── database-schema.sql  # Database schema
```

## 🔗 Useful Links

- **Live App**: https://text-i-ng.vercel.app
- **GitHub**: https://github.com/Adact-NGN/text-i-ng
- **Vercel Dashboard**: https://vercel.com/jrgen-sqs-projects/text-i-ng
