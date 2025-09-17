import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

// Optional: Domain-based authorization (if you want to restrict to specific domains)
const AUTHORIZED_DOMAINS =
  process.env.AUTHORIZED_DOMAINS?.split(",").map((domain) => domain.trim()) ||
  [];

// Function to check if user is authorized
function isUserAuthorized(user: any): boolean {
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
      // Log the full profile for debugging
      console.log("Azure AD Profile received:", {
        email: profile?.email,
        upn: profile?.upn,
        preferred_username: profile?.preferred_username,
        unique_name: profile?.unique_name,
        name: profile?.name,
        sub: profile?.sub,
      });

      // Check if user is authorized to access the application
      if (isUserAuthorized(profile || user)) {
        return true;
      }

      // Log unauthorized access attempt with all available identifiers
      const userIdentifier =
        user.email ||
        profile?.upn ||
        profile?.preferred_username ||
        profile?.unique_name;
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
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to root page after successful authentication
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
