// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifeznxfonmvfqnnpwhxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZXpueGZvbm12ZnFubnB3aHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMDYyMzEsImV4cCI6MjA2MTY4MjIzMX0.DmUTYRzlZryijBqlXJ-ppMs4p358e54Y13LcBK5RiJ4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
