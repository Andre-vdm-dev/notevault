import { supabase, supabaseForUser } from "../config/supabase.js";

// blocks the request unless there's a valid JWT in the cookie
export async function requireAuth(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  // ask Supabase if the token is real and still valid
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }

  // pass the user and a user-scoped Supabase client on to the route
  req.user = data.user;
  req.supabase = supabaseForUser(token);

  next();
}