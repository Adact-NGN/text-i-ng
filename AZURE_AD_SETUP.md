# Azure AD (Microsoft Entra ID) Setup Guide

This guide will help you configure Azure AD authentication for the TextiNG SMS application.

## Prerequisites

- An Azure AD tenant (Microsoft 365 or Azure subscription)
- Admin access to Azure AD to register the application

## Step 1: Register Application in Azure AD

1. **Navigate to Azure Portal**

   - Go to [Azure Portal](https://portal.azure.com)
   - Sign in with your admin account

2. **Access Azure Active Directory**

   - Search for "Azure Active Directory" in the search bar
   - Click on "Azure Active Directory" from the results

3. **Register New Application**

   - In the left sidebar, click on "App registrations"
   - Click "New registration"
   - Fill in the application details:
     - **Name**: `TextiNG SMS Application`
     - **Supported account types**: Choose based on your needs:
       - "Accounts in this organizational directory only" (Single tenant)
       - "Accounts in any organizational directory" (Multi-tenant)
     - **Redirect URI**:
       - Type: `Web`
       - URI: `http://localhost:3000/api/auth/callback/azure-ad` (for development)
       - For production: `https://yourdomain.com/api/auth/callback/azure-ad`

4. **Note Down Application Details**
   - Copy the **Application (client) ID** - you'll need this for `AZURE_AD_CLIENT_ID`
   - Copy the **Directory (tenant) ID** - you'll need this for `AZURE_AD_TENANT_ID`

## Step 2: Create Client Secret

1. **Navigate to Certificates & Secrets**

   - In your app registration, click on "Certificates & secrets" in the left sidebar
   - Click "New client secret"
   - Add a description: `TextiNG SMS App Secret`
   - Choose expiration (recommended: 12 months)
   - Click "Add"

2. **Copy the Secret Value**
   - **Important**: Copy the secret value immediately - it won't be shown again
   - This will be your `AZURE_AD_CLIENT_SECRET`

## Step 3: Configure API Permissions

1. **Add Required Permissions**

   - In your app registration, click on "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Delegated permissions"
   - Add the following permissions:
     - `User.Read` (to read user profile)
     - `email` (to access user email)
     - `profile` (to access user profile information)
   - Click "Add permissions"

2. **Grant Admin Consent** (if required)
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the action

## Step 4: Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# Azure AD Configuration
AZURE_AD_CLIENT_ID=your_application_client_id_here
AZURE_AD_CLIENT_SECRET=your_client_secret_value_here
AZURE_AD_TENANT_ID=your_tenant_id_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Optional: Domain-based authorization (if you want to restrict to specific domains)
# Leave empty to allow all users who can authenticate with Azure AD
AUTHORIZED_DOMAINS=ngnordic.com,ngn.no
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 5: Production Configuration

For production deployment:

1. **Update Redirect URIs**

   - In Azure AD app registration, add your production domain:
   - `https://yourdomain.com/api/auth/callback/azure-ad`

2. **Update Environment Variables**

   - Set `NEXTAUTH_URL=https://yourdomain.com`
   - Use production Azure AD credentials

3. **Configure CORS** (if needed)
   - In Azure AD app registration, go to "Authentication"
   - Add your production domain to "Web" redirect URIs

## Step 6: User Access Configuration

### Authorization Configuration

The application supports **Azure AD-based authorization** with optional domain restrictions:

#### 1. Azure AD Level (Primary Authorization)

- Configure in Azure AD portal under "Enterprise applications"
- Controls who can authenticate and access the application
- **This is the primary authorization method**

#### 2. Application Level (Optional Domain Filter)

- Configure in environment variables
- Optional additional domain-based filtering
- Only use if you need extra domain restrictions

### Option 1: Use Only Azure AD Authorization (Recommended)

1. **Configure in Azure AD Portal**:

   - Go to "Enterprise applications" → Your TextiNG app
   - Go to "Users and groups"
   - Assign specific users or groups who should have access
   - **Leave `AUTHORIZED_DOMAINS` empty** in environment variables

2. **Environment Configuration**:
   ```bash
   # Leave empty to use only Azure AD authorization
   AUTHORIZED_DOMAINS=
   ```

### Option 2: Add Domain Restrictions (Optional)

If you want additional domain-based filtering:

```bash
# Only allow users from specific domains
AUTHORIZED_DOMAINS=yourcompany.com,ngnordic.com
```

### Security Benefits

- **Azure AD Control**: Use Azure AD's built-in user/group management
- **Simplified Management**: No need to maintain separate user lists
- **Optional Domain Filter**: Add extra domain restrictions if needed
- **Audit Trail**: Unauthorized access attempts are logged

## Step 7: Testing

1. **Start the Application**

   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Navigate to `http://localhost:3000/login`
   - Click "Sign in with Microsoft"
   - Complete the authentication flow
   - Verify you're redirected back to the application

## Troubleshooting

### Common Issues

1. **"AADSTS50011: The reply URL specified in the request does not match"**

   - Check that your redirect URI in Azure AD matches exactly
   - Ensure no trailing slashes or extra characters

2. **"AADSTS65001: The user or administrator has not consented"**

   - Grant admin consent for the required permissions
   - Or have users consent individually

3. **"AADSTS7000215: Invalid client secret is provided"**

   - Verify the client secret is correct
   - Check if the secret has expired

4. **"AADSTS90014: The required field 'scope' is missing"**
   - This is usually handled automatically by NextAuth.js
   - Check your NextAuth configuration

### Debug Mode

Enable debug mode by adding to your `.env.local`:

```bash
NEXTAUTH_DEBUG=true
```

## Security Considerations

1. **Client Secret Security**

   - Never commit client secrets to version control
   - Use environment variables or secure secret management
   - Rotate secrets regularly

2. **Redirect URI Validation**

   - Only use HTTPS in production
   - Validate redirect URIs in Azure AD

3. **Token Security**
   - NextAuth.js handles token security automatically
   - Ensure `NEXTAUTH_SECRET` is strong and unique

## Support

For additional help:

- [NextAuth.js Documentation](https://next-auth.js.org/providers/azure-ad)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Graph Permissions Reference](https://docs.microsoft.com/en-us/graph/permissions-reference)
