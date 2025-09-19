import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "./tokenRefresh";

export function withAuth(handler: (request: NextRequest, accessToken: string, ...args: any[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      const accessToken = await getValidAccessToken();
      return await handler(request, accessToken, ...args);
    } catch (error) {
      console.error("Authentication error:", error);
      
      if (error instanceof Error && error.message.includes("sign in again")) {
        return NextResponse.json({
          success: false,
          error: "Authentication expired. Please sign in again.",
          code: "AUTH_EXPIRED"
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
