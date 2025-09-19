import { NextRequest, NextResponse } from "next/server";
import { azureAdService } from "@/lib/azureAdService";
import { addMessage } from "@/lib/messageStorage";
import { withAuth } from "@/lib/authMiddleware";
import { Twilio } from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const POST = withAuth(async (request: NextRequest, accessToken: string) => {
  try {
    const body = await request.json();
    const { groupIds, message, fromName } = body;

    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Group IDs are required",
      }, { status: 400 });
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Message is required",
      }, { status: 400 });
    }

    // Get all members from selected groups
    const allMembers = await azureAdService.getMultipleGroupMembers(groupIds);
    
    // Filter members who have phone numbers
    const membersWithPhone = allMembers.filter(member => member.hasPhoneNumber);

    if (membersWithPhone.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No members with phone numbers found in the selected groups",
        total: allMembers.length,
        withPhone: 0,
      }, { status: 400 });
    }

    // Send SMS to each member
    const results = [];
    const errors = [];
    const sender = fromName?.trim() || process.env.TWILIO_PHONE_NUMBER;

    for (const member of membersWithPhone) {
      try {
        const twilioMessage = await client.messages.create({
          body: message,
          from: sender,
          to: member.phoneNumber!,
        });

        // Save message to storage
        const storedMessage = await addMessage({
          phoneNumber: member.phoneNumber!,
          message,
          status: "sent",
          messageId: twilioMessage.sid,
          name: member.user.displayName,
          fromName: fromName?.trim() || undefined,
        });

        results.push({
          user: {
            id: member.user.id,
            displayName: member.user.displayName,
            email: member.user.mail,
          },
          phoneNumber: member.phoneNumber,
          messageId: twilioMessage.sid,
          status: twilioMessage.status,
          storedId: storedMessage.id,
        });

      } catch (error: any) {
        console.error(`Error sending SMS to ${member.user.displayName}:`, error);

        // Save failed message to storage
        const storedMessage = await addMessage({
          phoneNumber: member.phoneNumber!,
          message,
          status: "failed",
          messageId: null,
          error: error.message || "Failed to send SMS",
          name: member.user.displayName,
          fromName: fromName?.trim() || undefined,
        });

        errors.push({
          user: {
            id: member.user.id,
            displayName: member.user.displayName,
            email: member.user.mail,
          },
          phoneNumber: member.phoneNumber,
          error: error.message || "Failed to send SMS",
          storedId: storedMessage.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${membersWithPhone.length} members with phone numbers`,
      results,
      errors,
      summary: {
        totalMembers: allMembers.length,
        withPhone: membersWithPhone.length,
        withoutPhone: allMembers.length - membersWithPhone.length,
        sent: results.length,
        failed: errors.length,
      },
    });

  } catch (error: any) {
    console.error("Error sending SMS to AD groups:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS to AD groups",
    }, { status: 500 });
  }
});
