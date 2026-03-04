"use client";

import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, Users, Crown } from "lucide-react";
import { getAllUsersOverview } from "@/app/actions/admin";

export default function AdminBillingPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const result = await getAllUsersOverview();
      if (result.success && result.data) {
        setUsers(result.data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const totalUsers = users.length;
  const proUsers = users.filter((u) => u.plan === "pro").length;
  const freeUsers = users.filter((u) => u.plan === "free" || !u.plan).length;
  const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Assinaturas e Faturamento</h1>
        <p className="text-slate-500 font-medium">Visão geral do desempenho de assinaturas PRO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Usuários Totais</p>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-3xl font-black">{totalUsers}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-3xl border border-amber-500/30 p-6 flex items-center gap-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -z-0" />
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 z-10">
            <Crown className="w-6 h-6" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">Assinantes PRO</p>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-3xl font-black">{proUsers}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 overflow-hidden rounded-3xl border border-emerald-500/30 p-6 flex items-center gap-4 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-0" />
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 z-10">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="z-10">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Taxa de Conversão</p>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-3xl font-black">{conversionRate}%</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Integração de Pagamentos Manual</h2>
        <p className="text-slate-500 max-w-sm mb-6">
          Para aprovar assinaturas manualmente, utilize a seção de "Usuários" e clique no botão "Editar" de um usuário específico para alterar seu plano para PRO e o status para "Active (Manual)".
        </p>
      </div>
    </div>
  );
}
