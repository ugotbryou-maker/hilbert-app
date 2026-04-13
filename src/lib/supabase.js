import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Garde un client null si les variables ne sont pas configurées
// → fetchActualites retombera sur le mock automatiquement
export const supabase =
  supabaseUrl && supabaseKey && !supabaseKey.startsWith("REMPLACE")
    ? createClient(supabaseUrl, supabaseKey)
    : null;
