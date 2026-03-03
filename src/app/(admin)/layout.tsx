import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Identificar Logon (Dual-Check)
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  let currentUser = user;
  let getSessionError = null;

  if (!currentUser) {
    const { data: { session }, error } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    getSessionError = error;
  }
  
  if (!currentUser) {
     const allCookies = (await cookies()).getAll();
     return (
       <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-red-500/30">
         <h1 className="text-2xl font-black text-red-400 mb-4">Acesso Administrativo Bloqueado - Diagnóstico</h1>
         <p className="text-sm text-slate-400 mb-6">O servidor não conseguiu validar sua sessão do Supabase. Por favor, tire um print desta tela para o desenvolvedor.</p>
         
         <div className="space-y-4">
           <div className="bg-black/50 p-4 rounded-xl font-mono text-xs overflow-auto">
             <p className="font-bold text-amber-400 mb-2">Supabase Auth Errors:</p>
             <p>getUser() Error: {JSON.stringify(getUserError)}</p>
             <p>getSession() Error: {JSON.stringify(getSessionError)}</p>
           </div>

           <div className="bg-black/50 p-4 rounded-xl font-mono text-xs overflow-auto">
             <p className="font-bold text-blue-400 mb-2">Environment Config:</p>
             <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
             <p>Has ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
           </div>

           <div className="bg-black/50 p-4 rounded-xl font-mono text-xs overflow-auto">
             <p className="font-bold text-emerald-400 mb-2">Server Cookies Received:</p>
             {allCookies.map(c => (
               <p key={c.name} className="truncate">{c.name}: {c.value.substring(0, 30)}...</p>
             ))}
           </div>
         </div>
       </div>
     );
  }

  // 2. Verificar Cargo (Ignora RLS)
  const supabaseAdmin = await createAdminClient();
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', currentUser.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    redirect("/dashboard?error=permissao-negada-admin");
  }



  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
