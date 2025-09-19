import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "./tokenRefresh";

export function withAuth(handler: (request: NextRequest, accessToken: string, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const accessToken = await getValidAccessToken();
      return await handler(request, accessToken, ...args);
    } catch (error) {
      console.error("Authentication error:", error);
      
      if (error instanceof Error && (
        error.message.includes("expired") || 
        error.message.includes("sign in again") ||
        error.message.includes("invalid")
      )) {
        return NextResponse.json({
          success: false,
          error: "Your session has expired. Please sign in again.",
          code: "TOKEN_EXPIRED",
          requiresReauth: true
        }, { status: 401 });
      }
      
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
        code: "AUTH_ERROR"
      }, { status: 500 });
    }
  };
}
