# Twilio Alphanumeric Sender ID Setup Guide

## What is Alphanumeric Sender ID?

Instead of recipients seeing your phone number (like +1234567890), they'll see your company name (like "YourCompany") in their SMS list. This enhances brand recognition and trust.

## Requirements & Limitations

### ✅ **What's Allowed:**

- **Length:** Up to 11 characters
- **Characters:** Letters (A-Z, a-z), numbers (0-9), spaces, +, -, \_, &
- **Must contain:** At least one letter
- **Examples:** "YourCompany", "MyBrand", "Support", "ABC Corp"

### ❌ **What's NOT Allowed:**

- More than 11 characters
- Only numbers (must have at least one letter)
- Special characters like @, #, $, %, etc.
- Examples: "1234567890", "My@Company", "Brand#1"

## Country Support

⚠️ **Important:** Not all countries support Alphanumeric Sender IDs. Some require pre-registration.

### **Countries that typically support it:**

- United States
- Canada
- United Kingdom
- Australia
- Most European countries

### **Countries that may require registration:**

- India
- Philippines
- Indonesia
- Some African countries

**Check Twilio's documentation for the most current list:** https://www.twilio.com/docs/glossary/what-alphanumeric-sender-id

## Setup Steps

### 1. Enable in Twilio Console

1. Log in to your Twilio Console
2. Go to **Programmable SMS** → **Settings**
3. Ensure "Alphanumeric Sender ID" is **Enabled**

### 2. Test Your Sender ID

1. Use the SMS form with a simple sender ID like "Test"
2. Send to a test number
3. Check if the recipient sees "Test" instead of your phone number

### 3. Register if Required

If you get errors about unsupported countries:

1. Check Twilio's country requirements
2. Complete any required registration forms
3. Wait for approval (can take several days)

## How It Works in This App

### **Individual SMS:**

- Enter sender ID (optional) → Recipients see your company name
- Leave blank → Recipients see your Twilio phone number

### **Bulk SMS:**

- Add "Sender ID" column to Excel file
- Each row can have different sender IDs
- Recipients see the specified sender ID

### **Message History:**

- Shows which sender ID was used for each message
- Helps track different campaigns or departments

## Best Practices

### **Good Sender IDs:**

- "YourCompany" (clear, branded)
- "Support" (functional)
- "Sales" (department-specific)
- "ABC Corp" (professional)

### **Avoid:**

- "Test123" (unprofessional)
- "MyCompany123456789" (too long)
- "123456" (no letters)
- "My@Company" (invalid characters)

## Troubleshooting

### **"Sender ID not supported" error:**

- Check if the country supports alphanumeric sender IDs
- Verify your Twilio account has the feature enabled
- Try a different sender ID format

### **"Registration required" error:**

- Complete the registration process in Twilio Console
- Wait for approval before using the sender ID
- Use your phone number as fallback in the meantime

### **Messages not delivered:**

- Some carriers may block alphanumeric sender IDs
- Test with different phone numbers/carriers
- Consider using your verified phone number as backup

## Fallback Strategy

If alphanumeric sender IDs don't work:

1. The app will automatically fall back to your Twilio phone number
2. Your messages will still be delivered
3. Recipients will see your phone number instead of your company name

## Testing

Before using in production:

1. Test with different countries/regions
2. Verify delivery with various carriers
3. Check that recipients see the correct sender ID
4. Test both individual and bulk messaging

Remember: Alphanumeric sender IDs are typically **one-way** - recipients cannot reply directly to them.

