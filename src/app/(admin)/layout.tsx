import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Verificação de Identidade (Modo Resiliente)
  // Tentamos getUser primeiro, se falhar mas houver sessão, podemos tentar prosseguir
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('SERVER: Admin Layout - No user found:', authError);
    // Em vez de redirecionar para login de cara, vamos ver se há uma sessão
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
       console.error('SERVER: Admin Layout - No session found either.');
       redirect("/login?message=Acesso negado. Faça login novamente.");
    }
    // Se houver sessão mas getUser falhou, usamos o user da sessão (com cautela)
    // Mas o ideal é que getUser funcione.
  }

  const userId = user?.id || (await supabase.auth.getSession()).data.session?.user.id;

  if (!userId) {
     redirect("/login");
  }

  // 2. Verificação de Cargo (Usando Admin Client para total confiabilidade)
  const supabaseAdmin = await createAdminClient();
  
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role, email')
    .eq('user_id', userId)
    .single();

  if (profileError || !profile) {
    console.error('SERVER: Error fetching admin profile:', profileError);
    redirect("/dashboard?error=admin_profile_missing");
  }

  if (profile.role !== 'admin') {
    console.warn(`SERVER: Unauthorized admin access attempt by ${profile.email || userId}`);
    redirect("/dashboard?error=not_an_admin");
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
