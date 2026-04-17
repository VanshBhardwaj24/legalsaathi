import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security: Validate env vars at startup so missing config is caught early.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[LegalSaathi] Missing Supabase environment variables. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in frontend/.env'
  );
}

// We ONLY use the anon (publishable) key here — NEVER the service_role key.
// RLS policies enforce all access control at the database level.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist sessions across tabs and page refreshes
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Typed helper: get the current authenticated user safely
export const getCurrentUser = async () => {
  // NOTE: Always use getUser() (server-verified) not getSession().user
  // getSession() reads from local storage and can be spoofed.
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('[Supabase] getUser error:', error.message);
    return null;
  }
  return data.user;
};
