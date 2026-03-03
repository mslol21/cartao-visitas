import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Identificar Logon (Dual-Check para estabilidade no servidor)
  const { data: { user } } = await supabase.auth.getUser();
  let currentUser = user;

  if (!currentUser) {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user || null;
  }
  
  if (!currentUser) {
    console.warn('SERVER: Admin Layout - No user session detected.');
    redirect("/login?message=admin_auth_required");
  }

  // 2. Verificar Cargo (Admin Client para ignorar RLS)
  const supabaseAdmin = await createAdminClient();
  const { data: profile, error: dbError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', currentUser.id)
    .single();

  if (dbError || !profile || profile.role !== 'admin') {
    console.error(`SERVER: Access Denied for ${currentUser?.email}. Role: ${profile?.role}`);
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
