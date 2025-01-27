import { query } from "../../lib/db";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    try {
      // Check if the user already exists
      const existingUser = await query({
        query: "SELECT * FROM users WHERE email = ?",
        values: [email],
      });

      if (existingUser.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      // If user doesn't exist, insert new account
      const newAccount = await query({
        query: "INSERT INTO users (email, password) VALUES (?, ?)",
        values: [email, hashedPassword],
      });

      res.status(200).json({ newAccount });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else if (req.method === "GET") {
    const users = await query({
      query: "SELECT * FROM users",
    });
    res.status(200).json({ users: users });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
