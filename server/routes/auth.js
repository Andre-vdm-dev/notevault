import express from "express";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// store the JWT in an http-only cookie so JavaScript in the browser can't read it
function setAuthCookie(res, session) {
  res.cookie("access_token", session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: session.expires_in * 1000,
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (data.session) {
    setAuthCookie(res, data.session);
  }

  res.status(201).json({ user: { id: data.user.id, email: data.user.email } });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  setAuthCookie(res, data.session);
  res.json({ user: { id: data.user.id, email: data.user.email } });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } });
});

export default router;