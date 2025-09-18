import { NextRequest, NextResponse } from "next/server";
import { deleteOldMessages } from "@/lib/messageStorage";

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🧹 Starting scheduled cleanup of old messages...");
    
    // Delete messages older than 48 hours (2 days)
    const result = await deleteOldMessages(2);
    
    if (result.error) {
      console.error("❌ Error during cleanup:", result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
        deleted: result.deleted
      }, { status: 500 });
    }

    console.log(`✅ Cleanup completed: ${result.deleted} messages deleted`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deleted} messages older than 48 hours`,
      deleted: result.deleted,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Cron job error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
