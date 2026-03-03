import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Identificar Usuário (Método Rápido)
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    console.error('SERVER: No session/user found for admin layout');
    redirect("/login?message=Faça login para continuar");
  }

  // 2. Verificação de Cargo (Usando Service Role para evitar falhas de RLS)
  const supabaseAdmin = await createAdminClient();
  const { data: profile, error: dbError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (dbError || !profile || profile.role !== 'admin') {
    console.warn(`Unauthorized access attempt by ${user.email}`);
    redirect("/dashboard?error=permissao-negada");
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
