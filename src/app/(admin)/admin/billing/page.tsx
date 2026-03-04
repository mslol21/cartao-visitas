"use client";

import { CreditCard } from "lucide-react";

export default function AdminBillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Assinaturas e Faturamento</h1>
        <p className="text-slate-500 font-medium">Gerencie pagamentos, planos e faturas (Em breve).</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Módulo em Desenvolvimento</h2>
        <p className="text-slate-500 max-w-sm">
          A capacidade de gerenciar assinaturas manualmente estará disponível em breve com a nova integração.
        </p>
      </div>
    </div>
  );
}
