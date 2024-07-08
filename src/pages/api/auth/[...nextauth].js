import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "../../../lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch("https://ias-project.vercel.app/api/signin", {
            //must be http://localhost:3000/api/signin
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Failed to authenticate");
          }

          const user = await res.json();
          console.log(user);

          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Error in authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email ?? user.name;

      if (!email) {
        console.error("Email is undefined");
        return false;
      }

      // Check if user exists in the database
      const existingUser = await query({
        query: "SELECT * FROM users WHERE email = ?",
        values: [email],
      });

      if (existingUser.length === 0) {
        // User doesn't exist, insert new user
        await query({
          query:
            "INSERT INTO users (email, name, provider, identifier) VALUES (?, ?, ?, ?)",
          values: [email, user.name, account.provider, user.id],
        });
      } else {
        user.account_id = existingUser[0].account_id; // Add account_id to user object
      }

      return true;
    },
    async session({ session, token, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // If the provider is Facebook, use session.user.name as session.user.email
      if (session.user && !session.user.email) {
        session.user.email = session.user.name;
      }

      return session;
    },
    async redirect(url, baseUrl) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Assuming user.id is the unique identifier you want to use
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
