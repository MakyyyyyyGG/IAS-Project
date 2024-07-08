import { query } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { author } = req.query; // Extract the author name from query parameters

    const notes = await query({
      query: "SELECT * FROM notes where author = ? ORDER BY updated DESC ",
      values: [author],
    });
    res.status(200).json({ notes });
  } else if (req.method === "POST") {
    const { title, body, author } = req.body;
    const newNote = await query({
      query:
        "INSERT INTO notes (title, body, author, updated) VALUES (?, ?, ?, NOW())",
      values: [title, body, author],
    });
    res.status(200).json({ newNote });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      const deletedNote = await query({
        query: "DELETE FROM notes WHERE id = ?",
        values: [id],
      });
      res
        .status(200)
        .json({ message: "Note deleted successfully", deletedNote });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete note", error: error.message });
    }
  } else if (req.method === "PUT") {
    const { id, title, body } = req.body;
    await query({
      query:
        "UPDATE notes SET title = ?, body = ? , updated = NOW() WHERE id = ?",
      values: [title, body, id],
    });

    // Fetch the updated note from the database
    const updatedNote = await query({
      query: "SELECT * FROM notes WHERE id = ?",
      values: [id],
    });

    res.status(200).json({ updatedNote: updatedNote[0] });
  }
}
