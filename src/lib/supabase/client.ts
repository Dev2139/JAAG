import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('YOUR_ANON_KEY') &&
  supabaseAnonKey.length > 20;

if (!isConfigured) {
  console.warn(
    '⚠️ Supabase is not configured. Please:\n' +
    '1. Get your credentials from supabase.com dashboard\n' +
    '2. Update .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    '3. Restart the dev server (npm run dev)'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
