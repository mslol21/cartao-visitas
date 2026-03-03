"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getAllUsersOverview, updateUserPlan, createNewUser } from '@/app/actions/admin';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Settings2, 
  Calendar, 
  LayoutDashboard,
  Crown,
  UserCheck,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadUsers();
    }
  }, [profile]);

  async function loadUsers() {
    try {
      setUsers([]); // Limpa para mostrar loading limpo
      setLoading(true);
      const result = await getAllUsersOverview();
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        toast.error(result.error || "Falha ao carregar usuários");
      }
    } catch (err) {
      toast.error("Erro interno ao carregar usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    try {
      setCreateLoading(true);
      const result = await createNewUser(newEmail, newPassword);
      if (result.success) {
        toast.success("Usuário criado com sucesso!");
        setNewEmail('');
        setNewPassword('');
        setIsCreating(false);
        loadUsers();
      } else {
        toast.error(result.error || "Erro ao criar usuário");
      }
    } catch (err) {
      toast.error("Erro interno");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdate = async (userId: string, updates: any) => {
    try {
      const result = await updateUserPlan(userId, updates);
      if (result.success) {
        toast.success("Plano atualizado!");
        setSelectedUser(null);
        loadUsers();
      } else {
        toast.error(result.error || "Erro ao atualizar");
      }
    } catch (err) {
      toast.error("Falha na comunicação com o servidor");
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-red-400 mx-auto" />
          <h1 className="text-2xl font-black">Acesso Restrito</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <span className="w-8 h-[2px] bg-primary rounded-full" />
              Admin Center
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Gestão de Usuários</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsCreating(true)}
              variant="hero" 
              className="h-14 rounded-2xl gap-2 font-bold px-6 shadow-xl shadow-primary/20"
            >
               <UserPlus className="w-5 h-5" />
               <span className="hidden sm:inline">Novo Usuário</span>
            </Button>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Buscar por e-mail..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-6 h-14 w-full md:w-[250px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
              />
            </div>
            <Button onClick={loadUsers} variant="secondary" className="h-14 w-14 rounded-2xl p-0">
               <Zap className={cn("w-5 h-5", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Stats Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuário</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Plano</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Expiração</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filteredUsers.map((u) => (
                  <motion.tr 
                    layoutId={u.id}
                    key={u.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                          {u.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[200px]">{u.email}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{u.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         {u.plan === 'pro' && <Crown className="w-4 h-4 text-amber-500" />}
                         {u.plan === 'fundador_local' && <Zap className="w-4 h-4 text-primary fill-current" />}
                         <span className="text-xs font-black uppercase tracking-tight">
                           {u.plan === 'fundador_local' ? 'Fundador' : u.plan.toUpperCase()}
                         </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-tighter">
                        Via {u.billing_type}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        u.status === 'manual_active' ? "bg-green-100 text-green-600 dark:bg-green-500/10" :
                        u.status === 'stripe_active' ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10" :
                        u.status === 'expired' ? "bg-red-100 text-red-600 dark:bg-red-500/10" :
                        "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      )}>
                        {u.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 opacity-40" />
                        {u.plan_expires_at ? new Date(u.plan_expires_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button 
                        onClick={() => setSelectedUser(u)}
                        variant="ghost" 
                        size="sm"
                        className="rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary"
                      >
                        Gerenciar
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedUser(null)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 lg:p-10 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Gerenciar Plano</h3>
                <p className="text-sm text-muted-foreground">Atualizando assinatura para: <span className="text-foreground font-bold">{selectedUser.email}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Plano</Label>
                  <select 
                    className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-sm focus:ring-2 focus:ring-primaryOutline appearance-none"
                    value={selectedUser.plan}
                    onChange={e => setSelectedUser({...selectedUser, plan: e.target.value})}
                  >
                    <option value="free">FREE</option>
                    <option value="pro">PRO</option>
                    <option value="fundador_local">FUNDADOR LOCAL</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Faturamento</Label>
                  <select 
                    className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-sm outline-none"
                    value={selectedUser.billing_type}
                    onChange={e => setSelectedUser({...selectedUser, billing_type: e.target.value})}
                  >
                    <option value="stripe">STRIPE (AUTO)</option>
                    <option value="manual">MANUAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Categoria</Label>
                  <select 
                    className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 font-bold text-sm outline-none"
                    value={selectedUser.category}
                    onChange={e => setSelectedUser({...selectedUser, category: e.target.value})}
                  >
                    <option value="default">PADRÃO</option>
                    <option value="barbearia">BARBEARIA</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Expiração</Label>
                  <Input 
                    type="date"
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800"
                    onChange={e => setSelectedUser({...selectedUser, plan_expires_at: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button 
                  onClick={() => handleUpdate(selectedUser.user_id, {
                    plan: selectedUser.plan,
                    billing_type: selectedUser.billing_type,
                    plan_expires_at: selectedUser.plan_expires_at,
                    category: selectedUser.category,
                    is_founder: selectedUser.plan === 'fundador_local',
                    can_customize_theme: selectedUser.plan === 'pro'
                  })}
                  className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs"
                >
                  Confirmar Alterações
                </Button>
                <Button 
                  onClick={() => setSelectedUser(null)}
                  variant="outline" 
                  className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Create User Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsCreating(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 lg:p-10 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Novo Usuário</h3>
                <p className="text-sm text-muted-foreground">Cadastre uma nova conta no sistema.</p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">E-mail</Label>
                  <Input 
                    type="email"
                    required
                    placeholder="email@exemplo.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50">Senha Temp</Label>
                  <Input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs"
                  >
                    {createLoading ? "Criando..." : "Criar Conta"}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    variant="outline" 
                    className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
