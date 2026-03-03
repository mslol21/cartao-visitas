import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Identificar se há logon
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    console.error('SERVER: Admin Layout - Login not detected.');
    redirect("/login?message=Faça login para acessar esta área.");
  }

  // 2. Verificar Cargo via Admin Client (Ignora RLS e Garante Confiança)
  const supabaseAdmin = await createAdminClient();
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role, email')
    .eq('user_id', user.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    console.warn(`SERVER: Unauthorized attempt by ${user.email}. Role detected: ${profile?.role || 'null'}`);
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
