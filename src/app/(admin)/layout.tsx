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
  
  // 1. Identificar Logon (Dual-Check)
  const { data: { user } } = await supabase.auth.getUser();
  let currentUser = user;

  if (!currentUser) {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user || null;
  }
  
  if (!currentUser) {
     const allCookies = (await cookies()).getAll();
     const hasAuthCookie = allCookies.some(c => c.name.includes('auth-token') || c.name.includes('sb-'));
     
     const errorType = hasAuthCookie ? 'auth_sync_error' : 'no_session_cookie';
     console.error(`SERVER: Admin Access Refused (${errorType}). Cookies:`, allCookies.map(c => c.name));
     
     redirect(`/dashboard?error=admin-auth-failed-${errorType}`);
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
