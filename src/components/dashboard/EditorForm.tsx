"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Plus, 
  X, 
  Upload, 
  Camera, 
  Check, 
  Globe, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Youtube,
  MessageCircle,
  Smartphone,
  Search,
  Palette,
  Layout
} from 'lucide-react';
import { ProfileFormData } from '@/types/profile';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface EditorFormProps {
  initialData: Partial<ProfileFormData>;
  onSubmit: (data: Partial<ProfileFormData>) => Promise<void>;
  onChange: (data: Partial<ProfileFormData>) => void;
  isPro?: boolean;
}

export function EditorForm({ initialData, onSubmit, onChange, isPro = false }: EditorFormProps) {
  const [formData, setFormData] = useState<Partial<ProfileFormData>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const firstRender = useRef(true);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Real-time username availability check
  useEffect(() => {
    if (!formData.username || formData.username === initialData.username) {
      setUsernameStatus('idle');
      return;
    }

    const checkUsername = async () => {
      setUsernameStatus('checking');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', formData.username)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setUsernameStatus('taken');
        } else {
          setUsernameStatus('available');
        }
      } catch (err) {
        console.error('Error checking username:', err);
        setUsernameStatus('idle');
      }
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [formData.username, initialData.username, supabase]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Don't autosave if the username is taken
    if (usernameStatus === 'taken') return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, onSubmit, usernameStatus]);

  const handleChange = (field: keyof ProfileFormData, value: string | string[] | undefined) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 2MB.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      handleChange('photo_url', publicUrl);
      toast.success('Foto carregada!');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Erro ao carregar foto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addService = () => {
    if (!newService.trim()) return;
    const services = [...(formData.services || []), newService.trim()];
    if (services.length <= (isPro ? 20 : 3)) {
      handleChange('services', services);
      setNewService('');
    } else {
      toast.error(isPro ? 'Máximo de 20 serviços' : 'Upgrade para Pro para adicionar mais serviços');
    }
  };

  const removeService = (index: number) => {
    const services = (formData.services || []).filter((_, i) => i !== index);
    handleChange('services', services);
  };

  const maxServices = isPro ? 20 : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Configurações do Cartão
        </h2>
        {isSaving ? (
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Salvando...
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Check className="w-3 h-3 text-green-500" />
            Sincronizado
          </span>
        )}
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 p-1 gap-1">
          <TabsTrigger value="basic" className="rounded-xl data-[state=active]:shadow-sm text-[10px] sm:text-xs py-2 sm:py-0">Perfil</TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl data-[state=active]:shadow-sm text-[10px] sm:text-xs py-2 sm:py-0">Links</TabsTrigger>
          <TabsTrigger value="visual" className="rounded-xl data-[state=active]:shadow-sm text-[10px] sm:text-xs py-2 sm:py-0">Visual</TabsTrigger>
          <TabsTrigger value="seo" className="rounded-xl data-[state=active]:shadow-sm text-[10px] sm:text-xs py-2 sm:py-0">SEO</TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-6">
          <TabsContent value="basic" className="space-y-6 mt-0">
            {/* Photo Section */}
            <div className="relative group/avatar w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-3xl border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-card flex items-center justify-center transition-all group-hover/avatar:border-primary/50">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Nome Profissional</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                  className="rounded-2xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Proposta de Valor / Tagline</Label>
                <Input
                  value={formData.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Ex: Consultor Sênior em Marketing Digital"
                  className="rounded-2xl h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Cidade / Estado</Label>
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="São Paulo, SP"
                    className="rounded-2xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Username (URL)</Label>
                  <div className="relative">
                    <Input
                      value={formData.username || ''}
                      onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="seu.nome"
                      className={cn(
                        "rounded-2xl h-12 pr-10",
                        usernameStatus === 'taken' && "border-red-500 focus-visible:ring-red-500",
                        usernameStatus === 'available' && "border-green-500 focus-visible:ring-green-500"
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                      {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                      {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                  {usernameStatus === 'taken' && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 ml-1">
                      Este link já está em uso
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Meus Serviços ({formData.services?.length || 0}/{maxServices})</Label>
              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Adicionar especialidade..."
                  className="rounded-2xl h-12"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                />
                <Button type="button" size="icon" onClick={addService} className="h-12 w-12 rounded-2xl">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.services?.map((service, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                    {service}
                    <X className="w-3 h-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => removeService(i)} />
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#25D366] font-bold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp para Contato
                </Label>
                <Input
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                  placeholder="5511999999999"
                  className="rounded-2xl h-12 border-[#25D366]/30 focus-visible:ring-[#25D366]"
                />
              </div>

              {!isPro ? (
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 text-center space-y-3">
                  <Instagram className="w-8 h-8 text-primary/40 mx-auto" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Instagram, Linkedin, Facebook e outras redes são exclusivos para usuários <span className="text-primary font-black">PRO</span>.
                  </p>
                  <Button asChild variant="outline" size="sm" className="rounded-xl h-8 text-[10px] font-black uppercase">
                    <Link href="/pricing">Fazer Upgrade</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 opacity-60"><Instagram className="w-4 h-4" /> Instagram</Label>
                    <Input
                      value={formData.instagram || ''}
                      onChange={(e) => handleChange('instagram', e.target.value.replace('@', ''))}
                      placeholder="seu.insta"
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 opacity-60"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
                    <Input
                      value={formData.linkedin || ''}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      placeholder="perfil-linkedin"
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 opacity-60"><Youtube className="w-4 h-4" /> YouTube</Label>
                    <Input
                      value={formData.youtube || ''}
                      onChange={(e) => handleChange('youtube', e.target.value)}
                      placeholder="canal"
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6 mt-0">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 opacity-60"><Palette className="w-4 h-4" /> Cor de Destaque</Label>
              <div className="flex flex-wrap gap-2">
                {['#3b82f6', '#25D366', '#000000', '#f43f5e', '#8b5cf6', '#f59e0b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleChange('theme_color', color)}
                    className={cn(
                      "w-10 h-10 rounded-2xl border-2 transition-all",
                      formData.theme_color === color ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-50"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Chamada Principal (CTA)</Label>
              <Input
                value={formData.cta_text || ''}
                onChange={(e) => handleChange('cta_text', e.target.value)}
                placeholder="Ex: Solicitar Orçamento Grátis"
                className="rounded-2xl h-12"
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 mt-0">
            {!isPro ? (
              <div className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold">SEO Avançado bloqueado</h3>
                <p className="text-sm text-muted-foreground">Usuários PRO aparecem primeiro no Google e podem personalizar como seu link aparece no WhatsApp e redes sociais.</p>
                <Button className="rounded-2xl px-8 h-12 font-bold">Desbloquear Agora</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Título da Página (Meta Title)</Label>
                  <Input
                    value={formData.seo_title || ''}
                    onChange={(e) => handleChange('seo_title', e.target.value)}
                    placeholder="Ex: Ana Silva | Fotógrafa Profissional em SP"
                    className="rounded-2xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Descrição da Página (Meta Desc)</Label>
                  <Textarea
                    value={formData.seo_description || ''}
                    onChange={(e) => handleChange('seo_description', e.target.value)}
                    placeholder="Uma breve descrição sobre você que aparecerá no Google..."
                    className="rounded-2xl min-h-[100px]"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
