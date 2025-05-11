import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,                // ✅ corrected here
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
