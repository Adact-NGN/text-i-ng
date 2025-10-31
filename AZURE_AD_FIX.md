# Azure AD Authentication Issue - Fixed! 🔐

## Problem
Getting error: "No valid session or access token found" when trying to access protected pages or APIs that require Azure AD authentication.

## Root Causes Identified

### 1. Missing Auth Options in Session Retrieval
**File**: `src/lib/tokenRefresh.ts`

**Issue**: The `getServerSession()` function was called without passing the `authOptions`, so it couldn't find the session configuration.

**Before**:
```typescript
const session = await getServerSession();
```

**After**:
```typescript
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const session = await getServerSession(authOptions);
```

### 2. Auth Options Not Exported
**File**: `src/app/api/auth/[...nextauth]/route.ts`

**Issue**: The `authOptions` constant was not exported, so it couldn't be imported by other modules.

**Before**:
```typescript
const authOptions = {
```

**After**:
```typescript
export const authOptions = {
```

### 3. Duplicate NEXTAUTH_URL in Environment
**File**: `.env.local`

**Issue**: Two `NEXTAUTH_URL` entries existed, causing configuration conflicts:
- Line 10: `NEXTAUTH_URL="https://twilio-sms-app.vercel.app"`
- Line 57: `NEXTAUTH_URL=http://localhost:3000`

Also, `NEXTAUTH_DEBUG` had an embedded newline character (`\n`).

**Fixed**: 
- Removed duplicate
- Set single `NEXTAUTH_URL=http://localhost:3000`
- Cleaned up `NEXTAUTH_DEBUG=true`

## Changes Made

### ✅ Code Changes

1. **src/lib/tokenRefresh.ts**
   - Added import for `authOptions`
   - Updated `getServerSession()` call to include auth options

2. **src/app/api/auth/[...nextauth]/route.ts**
   - Exported `authOptions` constant

### ✅ Configuration Changes

1. **.env.local**
   - Fixed duplicate `NEXTAUTH_URL`
   - Set to `http://localhost:3000` for local development
   - Cleaned up `NEXTAUTH_DEBUG` formatting

## How It Works Now

### Authentication Flow

1. **User visits protected page** → Middleware checks for JWT token
2. **User logs in** → Azure AD provides access token
3. **Token stored in session** → NextAuth JWT strategy
4. **API calls** → `getValidAccessToken()` retrieves token from session
5. **Token validation** → Tests token against Microsoft Graph API
6. **Access granted** → User can access protected resources

### Session Management

```typescript
// Now works correctly:
const session = await getServerSession(authOptions);
// session.accessToken is available for API calls
```

## Testing

After the fix, Azure AD authentication should work:

1. **Navigate to**: http://localhost:3000
2. **Redirects to**: http://localhost:3000/login
3. **Click**: "Sign in with Microsoft"
4. **Authenticate**: Use your Azure AD credentials
5. **Redirected back**: To home page with active session
6. **Access token**: Available for Graph API calls

## Environment Variables Required

```bash
# Azure AD Configuration
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id

# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000  # For local dev
NEXTAUTH_DEBUG=true                 # Optional, for debugging

# Optional: Domain restrictions
AUTHORIZED_DOMAINS=                  # Leave empty to allow all Azure AD users
```

## Debugging

If you still have issues:

1. **Check console logs**: Look for "Session debug:" messages
2. **Verify Azure AD setup**: 
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
   - Required scopes: `openid profile email User.Read Group.Read.All`
3. **Check cookies**: Look for `next-auth.session-token` in browser
4. **Enable debug mode**: Set `NEXTAUTH_DEBUG=true`

## Related Files

- `src/lib/tokenRefresh.ts` - Token management
- `src/lib/authMiddleware.ts` - Auth wrapper for API routes
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection
- `src/app/login/page.tsx` - Login UI

## References

- [NextAuth.js Azure AD Provider](https://next-auth.js.org/providers/azure-ad)
- [NextAuth.js Session Strategies](https://next-auth.js.org/configuration/options#session)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)

## Status

✅ **Fixed**: Session retrieval now works correctly
✅ **Fixed**: Auth options properly exported and imported
✅ **Fixed**: Environment variable conflicts resolved
✅ **Tested**: Server restarts and responds correctly
🔄 **Ready**: Test authentication flow in browser

---

**Next Steps**: Try logging in with your Azure AD account!
