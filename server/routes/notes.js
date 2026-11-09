import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// every notes route needs a logged-in user
router.use(requireAuth);

// GET /api/notes - read all my notes
router.get("/", async (req, res) => {
  const { data, error } = await req.supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /api/notes - create a note
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const { data, error } = await req.supabase
    .from("notes")
    .insert({ title: title.trim(), content, user_id: req.user.id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

// PUT /api/notes/:id - update a note
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const { data, error } = await req.supabase
    .from("notes")
    .update({
      title: title.trim(),
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  // RLS hides other people's notes, so this also covers "not yours"
  if (!data) return res.status(404).json({ error: "Note not found" });

  res.json(data);
});

// DELETE /api/notes/:id - delete a note
router.delete("/:id", async (req, res) => {
  const { data, error } = await req.supabase
    .from("notes")
    .delete()
    .eq("id", req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) return res.status(404).json({ error: "Note not found" });

  res.json({ message: "Note deleted" });
});

export default router;