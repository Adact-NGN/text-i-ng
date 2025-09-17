import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { addMessage } from "@/lib/messageStorage";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumbers, message, fromName } = await request.json();

    // Validate required fields
    if (!phoneNumbers || !message) {
      return NextResponse.json(
        { error: "Phone numbers and message are required" },
        { status: 400 }
      );
    }

    // Parse phone numbers (support comma and semicolon separators)
    const phoneNumberList = phoneNumbers
      .split(/[,;]/)
      .map((num: string) => num.trim())
      .filter((num: string) => num.length > 0);

    if (phoneNumberList.length === 0) {
      return NextResponse.json(
        { error: "At least one valid phone number is required" },
        { status: 400 }
      );
    }

    // Validate Twilio credentials
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      return NextResponse.json(
        {
          error:
            "Twilio credentials not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    // Validate phone number formats
    for (const phoneNumber of phoneNumberList) {
      if (!phoneNumber.startsWith("+")) {
        return NextResponse.json(
          {
            error: `Phone number "${phoneNumber}" must include country code (e.g., +1234567890)`,
          },
          { status: 400 }
        );
      }
    }

    // Validate message length
    if (message.length > 160) {
      return NextResponse.json(
        { error: "Message is too long (max 160 characters)" },
        { status: 400 }
      );
    }

    // Validate sender ID if provided
    if (fromName) {
      // Check length (max 11 characters)
      if (fromName.length > 11) {
        return NextResponse.json(
          { error: "Sender ID must be 11 characters or less" },
          { status: 400 }
        );
      }

      // Check format (must contain at least one letter, alphanumeric only)
      const alphanumericRegex = /^[A-Za-z0-9\s+\-_&]+$/;
      if (!alphanumericRegex.test(fromName)) {
        return NextResponse.json(
          {
            error:
              "Sender ID can only contain letters, numbers, spaces, +, -, _, and &",
          },
          { status: 400 }
        );
      }

      // Must contain at least one letter
      if (!/[A-Za-z]/.test(fromName)) {
        return NextResponse.json(
          { error: "Sender ID must contain at least one letter" },
          { status: 400 }
        );
      }
    }

    // Determine sender (alphanumeric ID or phone number)
    const sender = fromName ? fromName.trim() : process.env.TWILIO_PHONE_NUMBER;

    // Send SMS to all phone numbers
    const results = [];
    const errors = [];

    for (const phoneNumber of phoneNumberList) {
      try {
        const twilioMessage = await client.messages.create({
          body: message,
          from: sender,
          to: phoneNumber,
        });

        // Save message to storage
        const storedMessage = addMessage({
          phoneNumber,
          message,
          status: "sent",
          messageId: twilioMessage.sid,
          fromName: fromName ? fromName.trim() : undefined,
        });

        results.push({
          phoneNumber,
          messageId: twilioMessage.sid,
          status: twilioMessage.status,
          id: storedMessage.id,
        });
      } catch (error: any) {
        console.error(`Error sending SMS to ${phoneNumber}:`, error);

        // Save failed message to storage
        const storedMessage = addMessage({
          phoneNumber,
          message,
          status: "failed",
          messageId: null,
          error: error.message || "Failed to send SMS",
          fromName: fromName ? fromName.trim() : undefined,
        });

        errors.push({
          phoneNumber,
          error: error.message || "Failed to send SMS",
          id: storedMessage.id,
        });
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Processed ${phoneNumberList.length} phone numbers`,
      results,
      errors,
      summary: {
        total: phoneNumberList.length,
        sent: results.length,
        failed: errors.length,
      },
    });
  } catch (error: any) {
    console.error("Error sending SMS:", error);

    // Handle specific Twilio errors
    if (error.code) {
      return NextResponse.json(
        {
          error: "Failed to send SMS",
          details: error.message,
          code: error.code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
