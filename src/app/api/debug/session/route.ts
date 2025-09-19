import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      session: {
        hasSession: !!session,
        hasAccessToken: !!session?.accessToken,
        tokenLength: session?.accessToken?.length || 0,
        userEmail: session?.user?.email,
        userName: session?.user?.name,
        userId: session?.user?.id,
        // Don't expose the actual token for security
        tokenPreview: session?.accessToken ? `${session.accessToken.substring(0, 20)}...` : null
      }
    });
  } catch (error) {
    console.error("Error getting session:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get session",
    }, { status: 500 });
  }
}
