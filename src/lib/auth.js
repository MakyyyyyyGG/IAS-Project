import GoogleProvider from "next-auth/providers/google";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // You can add more providers here if needed
  ],
  // Additional NextAuth configuration options can go here
};

export default authConfig;
