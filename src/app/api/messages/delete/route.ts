import { NextRequest, NextResponse } from "next/server";
import { deleteMessage } from "@/lib/messageStorage";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const success = await deleteMessage(messageId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete message" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
