"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getAllUsersOverview, updateUserPlan, createNewUser, deleteUser } from '@/app/actions/admin';
import { 
  Users, 
  Search, 
  Plus, 
  ShieldAlert, 
  Loader2, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export default function ManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile && profile.role === 'admin') {
      loadUsers();
    }
  }, [profile]);

  async function loadUsers() {
    try {
      setLoading(true);
      const result = await getAllUsersOverview();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const result = await createNewUser(newEmail, newPassword, newUsername);
      if (result.success) {
        toast.success("Usuário criado com sucesso!");
        setIsCreating(false);
        setNewEmail('');
        setNewUsername('');
        setNewPassword('');
        loadUsers();
      } else {
        toast.error(result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) return;
    
    try {
      setActionLoading(true);
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success("Usuário removido.");
        loadUsers();
      } else {
        toast.error(result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full bg-slate-900 rounded-[2.5rem] border border-red-500/20 p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white">Acesso Negado</h1>
          <p className="text-slate-400 text-sm">Apenas administradores podem acessar esta área de gestão.</p>
          <Button asChild className="w-full rounded-2xl">
            <Link href="/dashboard">Voltar para Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <Logo variant="icon" className="scale-75" />
            <h1 className="text-lg font-black tracking-tight hidden sm:block">Gestão do Sistema</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsCreating(true)} className="rounded-xl h-11 px-6 gap-2">
              <Plus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Usuários ({users.length})</h2>
            <p className="text-slate-500 text-sm font-medium">Controle total sobre os perfis da plataforma.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por e-mail, nome ou ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Usuário</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Plano / Expiração</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary/40 mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-slate-500 italic">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.user_id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {u.display_name?.[0] || u.email?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.display_name || 'Sem nome'}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                            u.plan === 'pro' ? "bg-amber-500/20 text-amber-500" : "bg-slate-500/20 text-slate-500"
                          )}>
                            {u.plan}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            {u.plan_expires_at ? new Date(u.plan_expires_at).toLocaleDateString() : u.billing_type === 'stripe' ? 'Assinatura Ativa' : 'Sem expiração'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedUser(u)}
                            className="rounded-xl h-9 px-3 hover:bg-primary/20 text-primary"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={actionLoading}
                            onClick={() => handleDeleteUser(u.user_id)}
                            className="rounded-xl h-9 px-3 hover:bg-red-500/20 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <h2 className="text-2xl font-black tracking-tighter">Novo Usuário</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input required value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="ex: joao.silva" className="bg-white/5" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@exemplo.com" className="bg-white/5" />
                </div>
                <div className="space-y-2">
                  <Label>Senha Temporária</Label>
                  <Input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="bg-white/5" />
                </div>
                <div className="flex gap-3 pt-6">
                  <Button type="submit" disabled={actionLoading} className="flex-1 rounded-2xl h-12">
                    {actionLoading ? "Criando..." : "Criar Conta"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-2xl h-12 bg-transparent border-white/10">
                    Cancelar
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
            >
              <h2 className="text-2xl font-black tracking-tighter">Editar Plano</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Usuário</Label>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm font-medium">
                    {selectedUser.display_name || selectedUser.email}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Plano</Label>
                  <select 
                    value={selectedUser.plan || 'free'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, plan: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-white/10 bg-white/5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status de Cobrança</Label>
                  <select 
                    value={selectedUser.status || 'free'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    className="w-full h-12 px-4 rounded-2xl border border-white/10 bg-white/5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="active">Active (Manual + 10 anos)</option>
                    <option value="stripe_active">Stripe Active</option>
                    <option value="canceled">Expirado / Cancelado</option>
                    <option value="free">Voltar para Free</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button 
                  onClick={async () => {
                    setActionLoading(true);
                    const res = await updateUserPlan(selectedUser.user_id, { plan: selectedUser.plan, status: selectedUser.status });
                    if (res.success) {
                      toast.success('Atualizado com sucesso!');
                      setSelectedUser(null);
                      loadUsers();
                    } else {
                      toast.error(res.error || 'Erro ao atualizar');
                    }
                    setActionLoading(false);
                  }} 
                  disabled={actionLoading} 
                  className="flex-1 rounded-2xl h-12 bg-primary hover:bg-primary/90"
                >
                  {actionLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedUser(null)} className="rounded-2xl h-12 bg-transparent border-white/10">
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
