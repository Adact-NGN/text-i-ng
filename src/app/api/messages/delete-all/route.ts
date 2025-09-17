import { NextRequest, NextResponse } from "next/server";
import { deleteAllMessages } from "@/lib/messageStorage";

export async function DELETE(request: NextRequest) {
  try {
    const success = await deleteAllMessages();

    if (success) {
      return NextResponse.json({
        success: true,
        message: "All messages deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete all messages" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting all messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
