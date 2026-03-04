const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const { data: profiles } = await supabase.from('profiles').select('user_id');
  
  const profileIds = new Set(profiles.map(p => p.user_id));
  const missing = authUsers.users.filter(u => !profileIds.has(u.id));

  console.log('Missing profiles for:', missing.map(m => m.email));
  for (const m of missing) {
     const cleanName = m.email.split('@')[0];
     const { error } = await supabase.from('profiles').upsert({
         user_id: m.id,
         username: cleanName,
         plan: 'free'
     }, { onConflict: 'user_id' });
     if (error) console.error('Error for', m.email, error);
     else console.log('Created profile for', m.email);
  }
}

run();
