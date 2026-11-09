import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// server-side: don't store sessions, we use our own cookie
const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

// used for sign up, login and checking tokens
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// a client that acts as the logged-in user,
// so RLS knows whose notes to return
export function supabaseForUser(token) {
  return createClient(supabaseUrl, supabaseKey, {
    ...options,
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}