import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Verificação de Identidade
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Admin Layout Auth Error:', authError);
    redirect("/login?message=Sessão expirada. Faça login novamente.");
  }

  // 2. Verificação de Cargo (Usando Admin Client para burlar RLS de leitura)
  const { createAdminClient } = await import("@/utils/supabase/server");
  const supabaseAdmin = await createAdminClient();
  
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    console.warn('Unauthorized admin access attempt:', user.email, profileError);
    redirect("/dashboard?message=Acesso restrito: Requer conta de administrador");
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
