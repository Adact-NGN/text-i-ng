# Azure AD Groups SMS Integration

This feature allows you to send SMS messages to members of Azure AD groups by selecting groups and automatically fetching their phone numbers.

## Prerequisites

1. **Azure AD App Registration** with the following permissions:
   - `User.Read` - Read user profiles
   - `Group.Read.All` - Read all groups
   - `GroupMember.Read.All` - Read group members

2. **Phone Numbers in Azure AD** - Users must have phone numbers stored in their Azure AD profiles:
   - Mobile phone number
   - Business phone number

## Setup Instructions

### Step 1: Update Azure AD App Registration

1. **Navigate to Azure Portal** → Azure Active Directory → App registrations → Your TextiNG app

2. **Add API Permissions**:
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Delegated permissions"
   - Add these permissions:
     - `Group.Read.All`
     - `GroupMember.Read.All`
   - Click "Add permissions"

3. **Grant Admin Consent**:
   - Click "Grant admin consent for [Your Organization]"
   - Confirm the action

### Step 2: Update Environment Variables

Your existing Azure AD configuration should work, but ensure you have:

```bash
# Azure AD Configuration (already configured)
AZURE_AD_CLIENT_ID=your_application_client_id_here
AZURE_AD_CLIENT_SECRET=your_client_secret_value_here
AZURE_AD_TENANT_ID=your_tenant_id_here

# NextAuth Configuration (already configured)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Step 3: User Phone Number Setup

For users to receive SMS messages, they need phone numbers in their Azure AD profiles:

1. **Admin Setup** (Recommended):
   - Go to Azure Portal → Azure Active Directory → Users
   - Select a user → Profile
   - Add "Mobile phone" or "Business phone"
   - Save changes

2. **User Self-Service**:
   - Users can update their own profiles at https://myprofile.microsoft.com
   - Go to "Personal info" → "Contact info"
   - Add or update phone numbers

## How It Works

### 1. Group Selection
- Browse and search through available Azure AD groups
- Select one or multiple groups
- View group type (Security vs Distribution)

### 2. Member Preview
- Automatically fetch group members
- Show members with phone numbers (will receive SMS)
- Show members without phone numbers (won't receive SMS)
- Deduplicate users who are in multiple groups

### 3. SMS Sending
- Send SMS to all members with phone numbers
- Track success/failure for each member
- Store message history with user information
- Support custom sender ID

## Features

### Group Management
- **Search Groups**: Find groups by name
- **Group Types**: Support for both Security and Distribution groups
- **Multiple Selection**: Select multiple groups at once
- **Member Preview**: See who will receive messages before sending

### Phone Number Detection
- **Mobile Phone**: Primary phone number from Azure AD
- **Business Phone**: Fallback to business phone numbers
- **Validation**: Only users with phone numbers can receive SMS
- **Deduplication**: Users in multiple groups are only contacted once

### SMS Features
- **Custom Sender ID**: Use alphanumeric sender ID (max 11 characters)
- **Message Tracking**: Full message history with user details
- **Error Handling**: Detailed error reporting for failed messages
- **Bulk Processing**: Efficient handling of large groups

## Usage

### 1. Access AD Groups SMS
- Go to SMS Management page
- Click on "AD Groups" tab
- The interface will load available groups

### 2. Select Groups
- Use the search bar to find specific groups
- Click on groups to select them
- View selected groups in the summary

### 3. Preview Members
- See how many members have phone numbers
- Review members who will receive SMS
- Check members without phone numbers

### 4. Compose and Send
- Write your SMS message
- Optionally set a custom sender ID
- Click "Send SMS" to deliver messages

## Security Considerations

### Permissions
- **Delegated Permissions**: Uses the current user's permissions
- **Admin Consent Required**: Group permissions require admin consent
- **Scope Limitation**: Only accesses groups the user can see

### Data Privacy
- **Phone Number Access**: Only accesses phone numbers from Azure AD
- **No Data Storage**: Phone numbers are not stored permanently
- **Audit Trail**: All SMS activities are logged

### Access Control
- **Azure AD Authorization**: Uses existing Azure AD user management
- **Group Visibility**: Only shows groups the user has access to
- **Member Privacy**: Respects Azure AD privacy settings

## Troubleshooting

### Common Issues

1. **"No groups found"**
   - Check if user has access to groups in Azure AD
   - Verify Group.Read.All permission is granted
   - Ensure admin consent is provided

2. **"No members with phone numbers"**
   - Check if users have phone numbers in Azure AD
   - Verify phone numbers are in correct format
   - Ensure users have updated their profiles

3. **"Permission denied"**
   - Verify GroupMember.Read.All permission
   - Check if admin consent is granted
   - Ensure user has access to selected groups

4. **"Failed to fetch groups"**
   - Check Azure AD app registration permissions
   - Verify environment variables are correct
   - Check network connectivity to Microsoft Graph

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NEXTAUTH_DEBUG=true
```

### Testing

1. **Test Group Access**:
   - Verify you can see groups in the interface
   - Check if group members are loaded correctly

2. **Test Phone Numbers**:
   - Ensure test users have phone numbers in Azure AD
   - Verify phone number format is correct

3. **Test SMS Sending**:
   - Start with small groups for testing
   - Verify SMS delivery and tracking

## API Endpoints

The integration includes these API endpoints:

- `GET /api/azure-ad/groups` - Fetch available groups
- `GET /api/azure-ad/groups/[groupId]/members` - Get group members
- `POST /api/azure-ad/send-sms` - Send SMS to group members

## Support

For additional help:

- [Microsoft Graph Groups API](https://docs.microsoft.com/en-us/graph/api/resources/group)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Graph Permissions Reference](https://docs.microsoft.com/en-us/graph/permissions-reference)
