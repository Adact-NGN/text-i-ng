# Azure AD Token Debug Instructions

## Current Issue: 401 Unauthorized Error

The Azure AD groups functionality is getting a 401 Unauthorized error from Microsoft Graph API. This typically means:

1. **Access token is expired**
2. **Missing required permissions**
3. **User needs to re-authenticate**

## Debug Steps

### 1. Check Current Session
Visit: `http://localhost:3000/api/debug/session`

This will show:
- If you have a valid session
- If you have an access token
- Token length and preview
- User information

### 2. Check Azure AD App Permissions

The app now requires these permissions:
- `User.Read` (already configured)
- `Group.Read.All` (NEW - needs to be added)
- `GroupMember.Read.All` (NEW - needs to be added)

### 3. Update Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Find your **TextiNG SMS Application**
4. Go to **API permissions**
5. Click **Add a permission**
6. Select **Microsoft Graph**
7. Choose **Delegated permissions**
8. Add these permissions:
   - `Group.Read.All`
   - `GroupMember.Read.All`
9. Click **Add permissions**
10. **IMPORTANT**: Click **Grant admin consent for [Your Organization]**

### 4. Re-authenticate User

After updating permissions, the user needs to sign out and sign back in:

1. Go to the app
2. Sign out completely
3. Sign back in with Microsoft
4. Grant the new permissions when prompted

### 5. Test the Functionality

1. Go to SMS Management → AD Groups tab
2. Try to search for groups
3. Check the browser console and server logs for any errors

## Expected Behavior

After proper setup:
- Session debug should show valid access token
- Graph API calls should return 200 OK
- Groups should load successfully
- No 401 Unauthorized errors

## Troubleshooting

If still getting 401 errors:

1. **Check permissions**: Ensure all required permissions are granted
2. **Admin consent**: Make sure admin consent is granted for the new permissions
3. **Token refresh**: The user may need to sign out/in to get fresh tokens
4. **Scope verification**: Check that the NextAuth scope includes the new permissions

## Debug Endpoints

- `/api/debug/session` - Check current session status
- `/api/azure-ad/groups` - Test groups API (will show detailed logs)
