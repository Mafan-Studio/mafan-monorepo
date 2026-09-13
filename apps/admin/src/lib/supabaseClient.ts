import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set");
}

/**
 * Browser client using the public anon key. Safe to expose — read access
 * to inquiries/images is gated by RLS policies scoped to the one admin
 * user, not by keeping this key secret.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
