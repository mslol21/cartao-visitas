"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Settings, 
  LayoutDashboard, 
  ShieldCheck,
  CreditCard,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", href: "/admin" },
  { icon: Users, label: "Usuários", href: "/admin/users" },
  { icon: CreditCard, label: "Assinaturas", href: "/admin/billing" },
  { icon: Settings, label: "Configurações", href: "/admin/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen">
      <div className="p-8">
        <Logo className="w-32" />
        <div className="mt-8 px-4 py-2 bg-primary/10 rounded-xl flex items-center gap-2 border border-primary/20">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Admin Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-slate-200 dark:border-slate-800">
        <Link 
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sair para User
        </Link>
      </div>
    </aside>
  );
}
