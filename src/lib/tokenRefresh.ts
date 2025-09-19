import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function getValidAccessToken(): Promise<string> {
  const session = await getServerSession(authOptions);
  
  console.log("Session debug:", {
    hasSession: !!session,
    hasAccessToken: !!session?.accessToken,
    tokenLength: session?.accessToken?.length || 0,
    userEmail: session?.user?.email
  });
  
  if (!session?.accessToken) {
    throw new Error("No valid session or access token found");
  }

  // For now, just return the current token
  // TODO: Implement proper token refresh logic
  return session.accessToken;
}
