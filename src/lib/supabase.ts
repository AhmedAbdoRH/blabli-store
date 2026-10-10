import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://sijndhvpkynflteltrsj.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpam5kaHZwa3luZmx0ZWx0cnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjE4MTMsImV4cCI6MjA5NzgzNzgxM30.Qyin-4zQ_sv97uFNTfjXGazX06Z6LgRRPP-UKoraVBc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
