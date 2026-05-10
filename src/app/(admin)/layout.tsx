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
  const allCookies = (await cookies()).getAll();
  const cookieNames = allCookies.map(c => c.name).join(', ');

  try {
    // Usa getSession() como primário - lê o JWT do cookie localmente sem chamada de rede
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (!sessionError && session?.user) {
      currentUser = session.user;
    }
  } catch (err) {
    console.error('SERVER ADMIN: Session validation failed', err);
  }



  
  if (!currentUser) {
     return (
       <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-red-500/30">
         <h1 className="text-2xl font-black text-red-400 mb-4">Acesso Administrativo Bloqueado</h1>
         <p className="text-sm text-slate-400 mb-6">Não foi possível validar sua sessão administrativa no servidor. Isso pode acontecer se o seu login expirou ou se os cookies não foram sincronizados.</p>
         
         <div className="space-y-4">
           <div className="bg-black/50 p-4 rounded-xl font-mono text-[10px]">
             <p className="text-amber-400 mb-2">Dica: Tente fazer logout e login novamente para atualizar suas credenciais.</p>
             <p className="text-slate-500 break-all">Debug Cookies: {cookieNames || 'Nenhum cookie detectado'}</p>
           </div>
           <div className="flex gap-4">
             <a href="/login" className="px-6 py-2 bg-white text-black rounded-xl font-bold text-xs uppercase">Ir para Login</a>
             <a href="/admin" className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase">Tentar Novamente</a>
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
