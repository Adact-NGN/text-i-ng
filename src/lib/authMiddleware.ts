import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "./tokenRefresh";

export async function withAuth(handler: (request: NextRequest, accessToken: string) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const accessToken = await getValidAccessToken();
      return await handler(request, accessToken);
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
