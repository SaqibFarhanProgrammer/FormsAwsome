import { connectDB } from "@/core/DB/ConnectDB";
import { User } from "@/models/User.models";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // ─────────────────────────────
    // 1. Credentials
    // ─────────────────────────────
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log("Credentials:   ", credentials);

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          return null;
        }

        // User must verify email before login
        if (!user.emailVerified) {
          return null;
        }

        const passwordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!passwordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image ?? null,
        };
      },
    }),

    // ─────────────────────────────
    // 2. Google
    // ─────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ─────────────────────────────
    // 3. GitHub
    // ─────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // OAuth provider
      if (account?.provider === "google" || account?.provider === "github") {
        await connectDB();

        if (!user.email) {
          return false;
        }

        // OAuth user handling goes here
        console.log("OAuth user:", user);
        console.log("Provider:", account.provider);

        return true;
      }

      // Credentials
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
};
