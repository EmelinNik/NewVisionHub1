import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.emelin8n.ru';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2ODE2NDI0MCwiZXhwIjo0OTIzODM3ODQwLCJyb2xlIjoiYW5vbiJ9.5qGhMhMY5d-jYXyanqkUOvVUJ0fWUvQsqNgGC6zidFU'; 

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});