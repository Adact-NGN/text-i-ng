import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

// Extend the Session and JWT types to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?: number;
  }
}

// Optional: Domain-based authorization
const AUTHORIZED_DOMAINS =
  process.env.AUTHORIZED_DOMAINS?.split(",").map((domain) => domain.trim()) ||
  [];

// Function to check if user is authorized
function isUserAuthorized(user: any): boolean {
  // If no domain restrictions are configured, allow all authenticated users
  if (AUTHORIZED_DOMAINS.length === 0) {
    return true;
  }

  // Get user identifier
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

const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope:
            "openid profile email User.Read Group.Read.All GroupMember.Read.All",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      console.log("SignIn callback:", { user, account, profile });

      // Check if user is authorized to access the application
      if (isUserAuthorized(profile || user)) {
        return true;
      }

      // Log unauthorized access attempt
      const userIdentifier =
        user.email ||
        profile?.upn ||
        profile?.preferred_username ||
        profile?.unique_name;
      console.log(`Unauthorized access attempt from: ${userIdentifier}`);
      return false;
    },
    async jwt({ token, account, profile }: any) {
      console.log("JWT callback:", {
        hasAccount: !!account,
        hasProfile: !!profile,
        tokenSub: token.sub,
      });

      // Persist the OAuth access_token to the token
      if (account) {
        console.log("Setting account tokens");
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600000;
      }
      if (profile) {
        console.log("Setting profile data");
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
        token.phone = profile.phone_number || profile.mobile_phone;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      session.user.phone = token.phone as string;
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      console.log("NextAuth redirect callback:", { url, baseUrl });

      // Force redirect to home page after successful login
      const redirectUrl = baseUrl;
      console.log("Redirecting to:", redirectUrl);
      return redirectUrl;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
