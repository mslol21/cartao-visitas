"use client";

import { useState, useEffect } from 'react';
import { getAllUsersOverview, updateUserPlan, createNewUser } from '@/app/actions/admin';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Users, 
  Search, 
  Calendar, 
  Crown, 
  Zap, 
  Clock, 
  MoreVertical 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const result = await getAllUsersOverview();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(u => 
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const result = await createNewUser(newEmail, newPassword, newUsername);
      if (result.success) {
        toast.success("Usuário criado com sucesso!");
        setIsCreating(false);
        loadUsers();
      } else {
        toast.error(result.error);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 font-medium">Gerencie contas, planos e acessos.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button onClick={() => setIsCreating(true)} className="rounded-xl h-12 px-6 gap-2 w-full sm:w-auto">
            <UserPlus className="w-4 h-4" />
            Novo Usuário
          </Button>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 h-12 w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuário</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Plano</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 uppercase">
                      {u.display_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{u.display_name || 'Sem nome'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {u.plan === 'pro' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                    <span className="text-xs font-black uppercase">{u.plan}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    u.status.includes('active') ? "border-green-200 bg-green-50 text-green-600" : "border-slate-200 bg-slate-50 text-slate-500"
                  )}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)} className="font-bold text-[10px] uppercase">
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <h2 className="text-2xl font-black">Novo Usuário</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Username</Label>
                  <Input required value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="joao.silva" />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Senha Temporária</Label>
                  <Input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={createLoading} className="flex-1 rounded-xl">
                    {createLoading ? "Criando..." : "Criar Conta"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
                    Cancelar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <h2 className="text-2xl font-black">Editar {selectedUser.display_name || 'Usuário'}</h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>ID do Usuário</Label>
                  <Input disabled value={selectedUser.id} className="bg-slate-50 dark:bg-slate-800" />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Plano Atual</Label>
                  <select 
                    value={selectedUser.plan || 'free'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, plan: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select 
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                  >
                    <option value="active">Active (Manual)</option>
                    <option value="stripe_active">Stripe Active</option>
                    <option value="canceled">Canceled</option>
                    <option value="free">Free</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={async () => {
                    setCreateLoading(true);
                    const res = await updateUserPlan(selectedUser.id, { plan: selectedUser.plan, status: selectedUser.status });
                    if (res.success) {
                      toast.success('Atualizado com sucesso!');
                      setSelectedUser(null);
                      loadUsers();
                    } else {
                      toast.error(res.error || 'Erro ao atualizar');
                    }
                    setCreateLoading(false);
                  }} 
                  disabled={createLoading} 
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {createLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedUser(null)} className="rounded-xl">
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
