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
  
  if (!session?.accessToken) {
    throw new Error("No valid session or access token found");
  }

  // Check if token is expired (with 5 minute buffer)
  const now = Date.now();
  const tokenExpiry = (session as any).expiresAt || (now + 3600000); // Default to 1 hour if not set
  
  if (now < tokenExpiry - 300000) { // 5 minute buffer
    return session.accessToken;
  }

  // Token is expired or about to expire, try to refresh
  try {
    const refreshToken = (session as any).refreshToken;
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("Refreshing expired access token...");
    
    const response = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh failed:", response.status, errorText);
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const tokenData: RefreshTokenResponse = await response.json();
    
    // Update the session with new tokens (this is a simplified approach)
    // In a real implementation, you'd want to update the JWT token
    console.log("Token refreshed successfully");
    
    return tokenData.access_token;
    
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Failed to refresh access token. Please sign in again.");
  }
}
