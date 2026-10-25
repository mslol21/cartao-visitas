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
    // Validação criptográfica padrão via Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!userError && user) {
      currentUser = user;
    } else {
      // Fallback estrito: se houver token em cookie, validar assinatura criptográfica com Supabase
      const allCookies = (await cookies()).getAll();
      const authCookie = allCookies.find(c => c.name.includes('auth-token'));
      if (authCookie?.value) {
        let accessToken: string | undefined = undefined;
        try {
          if (authCookie.value.startsWith('{')) {
            accessToken = JSON.parse(authCookie.value)?.access_token;
          } else {
            const possibleJson = Buffer.from(authCookie.value, 'base64').toString('utf-8');
            accessToken = JSON.parse(possibleJson)?.access_token;
          }
        } catch {
          // Cookie não é JSON
        }

        if (accessToken) {
          const { data: verifiedData, error: verifyError } = await supabase.auth.getUser(accessToken);
          if (!verifyError && verifiedData?.user) {
            currentUser = verifiedData.user;
          }
        }
      }
    }
  } catch (err) {
    console.error('SERVER ADMIN: Session validation failed', err);
  }

  if (!currentUser) {
    return (
      <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-red-500/30">
        <h1 className="text-2xl font-black text-red-400 mb-4">Acesso Administrativo Bloqueado</h1>
        <p className="text-sm text-slate-400 mb-6">Sua sessão expirou ou não possui privilégios para acessar o painel administrativo.</p>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <a href="/login" className="px-6 py-2 bg-white text-black rounded-xl font-bold text-xs uppercase">Ir para Login</a>
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

  try {
    const userId = currentUser.id || (currentUser as any).sub;
    
    if (!userId) {
      console.error('SERVER ADMIN: User ID missing in currentUser', currentUser);
      redirect("/login?error=user-id-missing");
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle(); // Usar maybeSingle para evitar erro se não existir

    if (error || !profile || profile.role !== 'admin') {
      console.warn('SERVER ADMIN: Access denied or profile error', { error, profile, userId });
      redirect("/dashboard?error=permissao-negada-admin");
    }
  } catch (err) {
    // Se o erro for o próprio redirect do Next.js, temos que rethrow
    if ((err as any)?.digest?.includes('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('SERVER ADMIN: Critical error during role check', err);
    return (
      <div className="p-8 max-w-3xl mx-auto mt-20 bg-slate-900 text-white rounded-3xl shadow-2xl border border-red-500/30">
        <h1 className="text-2xl font-black text-red-400 mb-4">Erro Crítico de Validação</h1>
        <p className="text-sm text-slate-400 mb-6">Ocorreu um erro ao verificar suas permissões de administrador no servidor.</p>
        <div className="bg-black/50 p-4 rounded-xl font-mono text-[10px] text-slate-500 italic">
          {err instanceof Error ? err.message : 'Erro desconhecido'}
        </div>
      </div>
    );
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
