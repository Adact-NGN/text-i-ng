# Twilio SMS App Setup Guide

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/)
2. A Twilio phone number with SMS capabilities

## Step 1: Get Your Twilio Credentials

1. **Log in to your Twilio Console**: https://console.twilio.com/
2. **Find your Account SID and Auth Token**:
   - Go to the main dashboard
   - Copy your "Account SID" and "Auth Token"
3. **Get your Twilio Phone Number**:
   - Go to Phone Numbers → Manage → Active numbers
   - Copy your Twilio phone number (it should look like +1234567890)

## Step 2: Configure Environment Variables

1. **Open the `.env.local` file** in your project root
2. **Replace the placeholder values** with your actual Twilio credentials:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 3: Test Your Setup

1. **Restart your development server**:

   ```bash
   npm run dev
   ```

2. **Open the app** at http://localhost:3000

3. **Send a test SMS**:
   - Enter a phone number (with country code, e.g., +1234567890)
   - Enter a test message
   - Click "Send SMS"

## Features Available

### Individual SMS

- Send single SMS messages through the web interface
- Real-time validation and error handling
- Success/failure feedback

### Bulk SMS Upload

- Upload Excel files (.xlsx or .xls) with phone numbers and messages
- Required columns: "Phone Number", "Message"
- Optional column: "Name"
- Batch processing with detailed results

### Message History

- View sent messages (currently shows sample data)
- Status tracking (sent, delivered, failed)

## Troubleshooting

### Common Issues

1. **"Twilio credentials not configured" error**:

   - Check that your `.env.local` file exists and has the correct values
   - Restart your development server after updating environment variables

2. **"Invalid phone number" error**:

   - Ensure phone numbers include country code (e.g., +1 for US)
   - Check that the phone number format is correct

3. **"Message too long" error**:

   - SMS messages are limited to 160 characters
   - Consider breaking longer messages into multiple parts

4. **Authentication errors**:
   - Verify your Account SID and Auth Token are correct
   - Check that your Twilio account is active and in good standing

### Getting Help

- Check the Twilio Console for account status and usage
- Review the Twilio documentation: https://www.twilio.com/docs/sms
- Check the browser console for detailed error messages

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Auth Token secure and private
- Consider using environment variables in production deployments

