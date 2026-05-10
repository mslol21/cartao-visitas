
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXhkbmp2eHBoaGdlc3RmdnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg5MjI0NywiZXhwIjoyMDg1NDY4MjQ3fQ.rzPi1OHEegcxFzfkesYRN_MzwCrbRq98dhu7dlUNJ8U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listColumns() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    console.log('No data in profiles table.');
  }
}

listColumns();
