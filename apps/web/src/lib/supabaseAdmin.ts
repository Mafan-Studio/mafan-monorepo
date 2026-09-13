import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set");
}

/**
 * Bypasses RLS — server-side only, never import this from a client
 * component. The `server-only` import above throws at build time if
 * something tries to bundle it into client code.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
