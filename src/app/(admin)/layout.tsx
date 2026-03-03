import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // 1. Verificação de Identidade (Lado do Servidor - muito mais rápido e seguro)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login?message=Acesso restrito");
  }

  // 2. Verificação de Cargo (Admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect("/dashboard?error=unauthorized");
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
