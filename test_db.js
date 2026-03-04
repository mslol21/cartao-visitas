const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('admin_users_overview').select('*');
  if (error) console.error(error);
  console.log(JSON.stringify(data, null, 2));
}

run();
