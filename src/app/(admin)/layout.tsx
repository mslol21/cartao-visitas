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
  
  let currentUser = null;

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!authError && user) {
      currentUser = user;
    }
  } catch (err) {
    console.error('SERVER ADMIN: Session validation failed', err);
  }

  
  if (!currentUser) {
     return (
       <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-red-500/30">
         <h1 className="text-2xl font-black text-red-400 mb-4">Acesso Administrativo Bloqueado</h1>
         <p className="text-sm text-slate-400 mb-6">Não foi possível validar sua sessão administrativa. Certifique-se de estar logado com uma conta autorizada.</p>
         
         <div className="space-y-4">
           <div className="bg-black/50 p-4 rounded-xl font-mono text-xs">
             <p className="text-amber-400">Sua sessão expirou ou você não tem as permissões necessárias.</p>
           </div>
         </div>
       </div>
     );
  }


  // 2. Verificar Cargo (Ignora RLS)
  const supabaseAdmin = await createAdminClient();
  
  if (!supabaseAdmin) {
    return (
      <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-amber-500/30">
        <h1 className="text-2xl font-black text-amber-400 mb-4">Configuração Incompleta</h1>
        <p className="text-sm text-slate-400 mb-6">A chave administrativa (SERVICE_ROLE_KEY) não foi detectada. O acesso ao painel admin exige esta configuração no Vercel.</p>
        <div className="bg-black/50 p-4 rounded-xl font-mono text-[10px] text-slate-500">
          <p>Dica: Adicione SUPABASE_SERVICE_ROLE_KEY nas Environment Variables do seu projeto.</p>
        </div>
      </div>
    );
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', currentUser.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    console.warn('SERVER ADMIN: Access denied for user', currentUser.id);
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
