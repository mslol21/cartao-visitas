import { createClient } from '@supabase/supabase-js'

const DEFAULT_URL = 'https://fyexdnjvxphhgestfvrt.supabase.co';

function getSanitizedUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'undefined' || url === 'null' || url.trim() === '') {
    return DEFAULT_URL;
  }
  
  const sanitized = url.trim().replace(/['"]/g, '').replace(/\/$/, '');
  
  if (!sanitized.startsWith('http')) {
    return DEFAULT_URL;
  }
  
  return sanitized;
}

const SUPABASE_URL = getSanitizedUrl();

export function createAdminClient() {
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/['"]/g, '');

  if (!supabaseServiceKey || supabaseServiceKey === 'undefined') {
    return null;
  }

  return createClient(SUPABASE_URL, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
