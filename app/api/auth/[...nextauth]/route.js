import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        passwordHash: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.passwordHash) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(credentials.passwordHash, user.passwordHash);
        if (!passwordsMatch) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role, authProvider: user.authProvider };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existingUser) {
          // New Google user - create them in database with no role yet
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              authProvider: 'google',
              passwordHash: null, // No password for Google users
              role: null // Will be set on /select-role page
            }
          });
          // Redirect to /select-role after sign in
          return true;
        }
        // Existing user - check if they have a role
        if (!existingUser.role) {
          return true; // Will redirect to role selection
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.authProvider = user.authProvider;
      }
      if (account?.provider === "google" && profile) {
        // Find user by email to get their role
        const dbUser = await prisma.user.findUnique({ where: { email: profile.email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.authProvider = dbUser.authProvider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { 
        session.user.id = token.id; 
        session.user.role = token.role; 
        session.user.authProvider = token.authProvider;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/select-role" // Redirect new users (including Google) to role selection
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "development_secret_key"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
