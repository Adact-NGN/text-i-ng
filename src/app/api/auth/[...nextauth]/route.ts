import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

// Extend the Profile type to include Azure AD specific properties
interface AzureADProfile {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  upn?: string;
  preferred_username?: string;
  unique_name?: string;
}

// Extend the Session and JWT types to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}

// Optional: Domain-based authorization (if you want to restrict to specific domains)
const AUTHORIZED_DOMAINS =
  process.env.AUTHORIZED_DOMAINS?.split(",").map((domain) => domain.trim()) ||
  [];

// Function to check if user is authorized
function isUserAuthorized(user: AzureADProfile): boolean {
  // If no domain restrictions are configured, allow all authenticated users
  if (AUTHORIZED_DOMAINS.length === 0) {
    return true;
  }

  // Get user identifier - check multiple possible fields from Azure AD
  const userIdentifier =
    user.email || user.upn || user.preferred_username || user.unique_name;

  if (!userIdentifier) {
    console.log("No user identifier found in profile:", user);
    return false;
  }

  // Check if user's domain is authorized
  const userDomain = userIdentifier.split("@")[1];
  const isAuthorized = AUTHORIZED_DOMAINS.includes(userDomain);

  if (!isAuthorized) {
    console.log(
      `Domain check failed for ${userIdentifier} (domain: ${userDomain})`
    );
    console.log(`Authorized domains: ${AUTHORIZED_DOMAINS.join(", ")}`);
  }

  return isAuthorized;
}

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Cast profile to our extended type
      const azureProfile = profile as AzureADProfile;
      
      // Log the full profile for debugging
      console.log("Azure AD Profile received:", {
        email: azureProfile?.email,
        upn: azureProfile?.upn,
        preferred_username: azureProfile?.preferred_username,
        unique_name: azureProfile?.unique_name,
        name: azureProfile?.name,
        sub: azureProfile?.sub,
      });

      // Check if user is authorized to access the application
      if (isUserAuthorized(azureProfile || user)) {
        return true;
      }

      // Log unauthorized access attempt with all available identifiers
      const userIdentifier =
        user.email ||
        azureProfile?.upn ||
        azureProfile?.preferred_username ||
        azureProfile?.unique_name;
      console.log(`Unauthorized access attempt from: ${userIdentifier}`);
      return false;
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (profile) {
        const azureProfile = profile as AzureADProfile;
        token.name = azureProfile.name;
        token.email = azureProfile.email;
        token.picture = azureProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If user is trying to access login page, redirect to home
      if (url.includes('/login')) {
        return baseUrl;
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // If it's the same origin, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Default to home page
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=AccessDenied",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
