# Environment Variables Setup Guide

This guide will help you set up all the required environment variables for the TextiNG SMS application.

## Quick Start

1. The `.env.local` file has been pulled from Vercel (if configured there)
2. Use this guide to add any missing environment variables
3. Copy the template below and fill in your values

## Environment Variables Template

Copy this to your `.env.local` file and fill in the values:

\`\`\`bash
# ==============================================
# DATABASE CONFIGURATION (Neon/Vercel Postgres)
# ==============================================
# Get these from your Vercel Postgres database or Neon console
# Required: At least one of these connection strings
texting_POSTGRES_URL=postgresql://user:password@host/database?sslmode=require
POSTGRES_URL=postgresql://user:password@host/database?sslmode=require

# Optional: For non-pooled connections (used for migrations/admin tasks)
texting_POSTGRES_URL_NON_POOLING=postgresql://user:password@host/database?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://user:password@host/database?sslmode=require

# ==============================================
# TWILIO CONFIGURATION (SMS Service)
# ==============================================
# Get these from: https://console.twilio.com/
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# ==============================================
# AZURE AD CONFIGURATION (Authentication)
# ==============================================
# Get these from Azure Portal → App Registrations
AZURE_AD_CLIENT_ID=your_azure_ad_client_id_here
AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret_here
AZURE_AD_TENANT_ID=your_azure_ad_tenant_id_here

# ==============================================
# NEXTAUTH CONFIGURATION (Authentication)
# ==============================================
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret_here

# For local development:
NEXTAUTH_URL=http://localhost:3000

# Optional: Enable debug mode for troubleshooting
# NEXTAUTH_DEBUG=true

# ==============================================
# AUTHORIZATION CONFIGURATION (Optional)
# ==============================================
# Leave empty to use only Azure AD authorization (recommended)
# Or specify comma-separated domains to restrict access
AUTHORIZED_DOMAINS=
\`\`\`

## Where to Get Each Value

### Database Configuration
- **Vercel Postgres**: Go to your Vercel project → Storage → Postgres → Connection String
- **Neon**: Go to https://console.neon.tech → Your Project → Connection Details

### Twilio Configuration
1. Sign up at https://www.twilio.com/
2. Go to https://console.twilio.com/
3. Find your Account SID and Auth Token on the dashboard
4. Get a phone number from Phone Numbers → Manage → Active Numbers

### Azure AD Configuration
1. Go to https://portal.azure.com
2. Navigate to Azure Active Directory → App Registrations
3. Create a new registration or select existing
4. Copy Client ID and Tenant ID
5. Create a Client Secret in Certificates & Secrets

See `AZURE_AD_SETUP.md` for detailed instructions.

### NextAuth Secret
Generate a secure random string:
\`\`\`bash
openssl rand -base64 32
\`\`\`

## Next Steps

1. Fill in your `.env.local` file with the actual values
2. Install dependencies: \`npm install\`
3. Run the development server: \`npm run dev\`
4. Visit http://localhost:3000

## Vercel Deployment

To sync environment variables with Vercel:

\`\`\`bash
# Push local env vars to Vercel (be careful!)
vercel env add VARIABLE_NAME

# Or add them manually in Vercel dashboard:
# https://vercel.com/your-project/settings/environment-variables
\`\`\`

## Troubleshooting

- If you see database connection errors, check your connection strings
- If authentication fails, verify your Azure AD credentials
- If SMS sending fails, check your Twilio credentials
- Enable \`NEXTAUTH_DEBUG=true\` for authentication debugging
