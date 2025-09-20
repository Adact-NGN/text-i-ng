import { getServerSession } from "next-auth";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function getValidAccessToken(): Promise<string> {
  const session = await getServerSession();
  
  console.log("Session debug:", {
    hasSession: !!session,
    hasAccessToken: !!session?.accessToken,
    tokenLength: session?.accessToken?.length || 0,
    userEmail: session?.user?.email
  });
  
  if (!session?.accessToken) {
    throw new Error("No valid session or access token found");
  }

  // Test the token by making a simple Graph API call
  try {
    const testResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (testResponse.status === 401) {
      console.log("Access token is expired (401 from Graph API)");
      throw new Error("Access token expired. Please sign in again.");
    }

    if (!testResponse.ok) {
      console.log(`Token test failed with status: ${testResponse.status}`);
      throw new Error("Access token is invalid. Please sign in again.");
    }

    console.log("Access token is valid");
    return session.accessToken;
    
  } catch (error) {
    if (error instanceof Error && error.message.includes("expired")) {
      throw error;
    }
    
    console.error("Error testing access token:", error);
    throw new Error("Access token validation failed. Please sign in again.");
  }
}
