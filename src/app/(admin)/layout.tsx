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
  
  // 1. Extração direta e blindada do Token (Bypass SSR bugs)
  const allCookies = (await cookies()).getAll();
  const authCookie = allCookies.find(c => c.name.includes('-auth-token'));
  
  let accessToken: string | undefined = undefined;
  if (authCookie?.value) {
    try {
      // Formato JSON padrão
      if (authCookie.value.startsWith('{')) {
        accessToken = JSON.parse(authCookie.value)?.access_token;
      } else {
        // Formato base64 (usado em novas versões do SSR)
        const possibleJson = atob(authCookie.value);
        accessToken = JSON.parse(possibleJson)?.access_token;
      }
    } catch (err) {
      console.warn('SERVER: Failed to parse auth cookie manually', err);
    }
  }

  // 2. Validar o token de forma explícita com o servidor Supabase
  let currentUser = null;
  let getUserError = null;

  if (accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    currentUser = user;
    getUserError = error;
  }

  // Fallback se nãop houver token manual
  if (!currentUser) {
    const { data } = await supabase.auth.getSession();
    currentUser = data.session?.user || null;
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
