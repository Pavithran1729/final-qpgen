
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://iqevpgfdcpwejsliufue.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZXZwZ2ZkY3B3ZWpzbGl1ZnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNTgxNTgsImV4cCI6MjA0NjgzNDE1OH0.ms5l48mtv8kTPNaTFNm4ewysxuYWCZXjZD0wvHm2s5c";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'apikey': supabaseKey,
    },
  },
});
