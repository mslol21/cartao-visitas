"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Configurações do Sistema</h1>
        <p className="text-slate-500 font-medium">Configure as regras e integrações (Em breve).</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Página em Construção</h2>
        <p className="text-slate-500 max-w-sm">
          Este painel em breve conterá opções gerais do sistema, chaves de API e temas.
        </p>
      </div>
    </div>
  );
}
