import { NextRequest, NextResponse } from "next/server";
import { getRecentMessages, getMessagesByPhone } from "@/lib/messageStorage";
import { initializeDatabase } from "@/lib/neon";

export async function GET(request: NextRequest) {
  try {
    // Initialize database once
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phoneNumber");
    const limit = parseInt(searchParams.get("limit") || "50");

    let messages;

    if (phoneNumber) {
      messages = await getMessagesByPhone(phoneNumber);
    } else {
      messages = await getRecentMessages(limit);
    }

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

