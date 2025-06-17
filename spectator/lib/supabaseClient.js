// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = 'https://uxynahfbhkpvnsbsllmv.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4eW5haGZiaGtwdm5zYnNsbG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjk4MTcsImV4cCI6MjA2MTg0NTgxN30.FC-XQVcm7a45DjqF3yhirpqAtjAIpquGOLuuFR2im8s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
