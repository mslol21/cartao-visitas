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
  Layout,
  Type,
  Video,
  Layers,
  Sparkles as SparklesIcon,
  QrCode as QrIcon,
  Star,
  Briefcase,
  Code,
  Paintbrush,
  Utensils,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Cpu,
  Hammer,
  Wrench,
  Scissors,
  Music,
  GraduationCap,
  Stethoscope,
  Scale,
  Calculator,
  Building2,
  Rocket,
  Zap,
  Target,
  Users,
  Award,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StyledQRCode } from '../StyledQRCode';
import { Profile, ProfileFormData } from '@/types/profile';
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
  const videoInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const firstRender = useRef(true);
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = useCallback(async (silent = false) => {
    if (isSaving) return;
    
    if (!formData.username?.trim()) {
      if (!silent) toast.error('O Username (URL) é obrigatório!');
      return;
    }
    if (!formData.whatsapp?.trim()) {
      if (!silent) toast.error('O WhatsApp é obrigatório!');
      return;
    }
    
    if (usernameStatus === 'taken') {
      if (!silent) toast.error('Este Username já está em uso!');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(formData);
      setIsDirty(false);
      if (!silent) toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      if (!silent) toast.error('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, usernameStatus, onSubmit, isSaving]);

  // Auto-save logic
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!isDirty || isSaving) return;

    const timer = setTimeout(() => {
      if (usernameStatus === 'available' || usernameStatus === 'idle') {
        handleSave(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, usernameStatus, isDirty, isSaving, handleSave]);

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


  const handleChange = <T extends keyof ProfileFormData>(field: T, value: ProfileFormData[T]) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
    setIsDirty(true);
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

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast.error('Formato inválido. Use MP4, WebM, PNG, JPG ou WEBP.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      handleChange('background_video_url', publicUrl);
      toast.success('Fundo atualizado com sucesso!');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Erro ao carregar arquivo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const [newCustomLink, setNewCustomLink] = useState({ title: '', url: '' });

  const addCustomLink = () => {
    if (!newCustomLink.title || !newCustomLink.url) {
      toast.error('Preencha o título e a URL do link!');
      return;
    }
    const currentLinks = formData.custom_links || [];
    handleChange('custom_links', [...currentLinks, newCustomLink]);
    setNewCustomLink({ title: '', url: '' });
  };

  const removeCustomLink = (index: number) => {
    const currentLinks = formData.custom_links || [];
    handleChange('custom_links', currentLinks.filter((_, i) => i !== index));
  };

  const AVAILABLE_ICONS = [
    { name: 'Sparkles', icon: SparklesIcon },
    { name: 'Star', icon: Star },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Code', icon: Code },
    { name: 'Paintbrush', icon: Paintbrush },
    { name: 'Camera', icon: Camera },
    { name: 'Utensils', icon: Utensils },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'Heart', icon: Heart },
    { name: 'User', icon: User },
    { name: 'Settings', icon: Settings },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'Globe', icon: Globe },
    { name: 'Cpu', icon: Cpu },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Hammer', icon: Hammer },
    { name: 'Wrench', icon: Wrench },
    { name: 'Scissors', icon: Scissors },
    { name: 'Music', icon: Music },
    { name: 'Video', icon: Video },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Stethoscope', icon: Stethoscope },
    { name: 'Scale', icon: Scale },
    { name: 'Calculator', icon: Calculator },
    { name: 'Building2', icon: Building2 },
    { name: 'Rocket', icon: Rocket },
    { name: 'Zap', icon: Zap },
    { name: 'Target', icon: Target },
    { name: 'Users', icon: Users },
    { name: 'Award', icon: Award },
  ];

  const addService = () => {
    if (!newService.trim()) return;
    const currentServices = (formData.services || []).map(s => 
      typeof s === 'string' ? { name: s, icon: 'Sparkles' } : s
    );
    const updatedServices = [...currentServices, { name: newService.trim(), icon: 'Sparkles' }];
    
    if (updatedServices.length <= (isPro ? 20 : 3)) {
      handleChange('services', updatedServices);
      setNewService('');
    } else {
      toast.error(isPro ? 'Máximo de 20 serviços' : 'Upgrade para Pro para adicionar mais serviços');
    }
  };

  const updateServiceIcon = (index: number, iconName: string) => {
    if (!isPro) return;
    const services = (formData.services || []).map(s => 
      typeof s === 'string' ? { name: s, icon: 'Sparkles' } : s
    );
    if (services[index]) {
      services[index] = { ...services[index], icon: iconName };
      handleChange('services', services);
    }
  };

  const removeService = (index: number) => {
    const services = (formData.services || [])
      .map(s => typeof s === 'string' ? { name: s, icon: 'Sparkles' } : s)
      .filter((_, i) => i !== index);
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
        <div className="flex items-center gap-3">
          {isDirty && !isSaving && (
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">
              Alterações pendentes...
            </span>
          )}
          <Button 
            onClick={() => handleSave(false)} 
            disabled={isSaving || usernameStatus === 'checking'}
            variant={isDirty ? "default" : "outline"}
            className={cn(
              "rounded-full font-bold shadow-lg transition-all duration-500",
              !isDirty && !isSaving ? "opacity-50 grayscale" : "shadow-primary/20"
            )}
            size="sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                <span className="text-xs">Salvando...</span>
              </>
            ) : isDirty ? (
              <>
                <Check className="w-3 h-3 mr-2" />
                <span className="text-xs">Salvar Agora</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 mr-2 text-green-500" />
                <span className="text-xs">Salvo!</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto p-1.5 gap-2 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <TabsTrigger 
            value="basic" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800"
          >
            <User className="w-4 h-4" /> 
            <span className="truncate">Perfil</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="social" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800"
          >
            <LinkIcon className="w-4 h-4" /> 
            <span className="truncate">Links</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="visual" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800"
          >
            <Palette className="w-4 h-4" /> 
            <span className="truncate">Visual</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="seo" 
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800"
          >
            <Search className="w-4 h-4" /> 
            <span className="truncate">SEO</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="qrcode" 
            className="col-span-2 sm:col-span-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-800"
          >
            <QrIcon className="w-4 h-4" /> 
            <span className="truncate">QR Code</span>
            {!isPro && <SparklesIcon className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse ml-0.5" />}
          </TabsTrigger>
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
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">CEP (Auto-preencher)</Label>
                  <div className="relative">
                    <Input
                      onChange={async (e) => {
                        const cep = e.target.value.replace(/\D/g, '');
                        if (cep.length === 8) {
                          try {
                            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                            const data = await res.json();
                            if (!data.erro) {
                              handleChange('city', `${data.localidade}, ${data.uf}`);
                            } else {
                              toast.error('CEP não encontrado');
                            }
                          } catch (err) {
                            toast.error('Erro ao buscar CEP');
                          }
                        }
                      }}
                      placeholder="00000-000"
                      className="rounded-2xl h-12"
                      maxLength={9}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Cidade / Estado</Label>
                  <Input
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="São Paulo, SP"
                    className="rounded-2xl h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                    Endereço Completo (Opcional)
                  </Label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Av. Paulista, 1000 - Sala 12"
                    className="rounded-2xl h-12"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                    Região de Atendimento
                    {!isPro && <SparklesIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                  </Label>
                  <div className="relative">
                    <Input
                      value={formData.service_area || ''}
                      onChange={(e) => isPro && handleChange('service_area', e.target.value)}
                      placeholder={isPro ? "Ex: Toda Grande SP, Interior..." : "Exclusivo PRO"}
                      disabled={!isPro}
                      className={cn(
                        "rounded-2xl h-12 pr-10",
                        !isPro && "bg-slate-50 dark:bg-slate-900 border-dashed cursor-not-allowed opacity-60"
                      )}
                    />
                    {!isPro && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  {!isPro && (
                    <p className="text-[10px] font-medium text-amber-600 dark:text-amber-500 italic mt-1">
                      Upgrade para PRO para informar sua região de atuação.
                    </p>
                  )}
                </div>
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

              <div className="space-y-2">
                <Label className="text-[#25D366] font-bold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp (Obrigatório)
                </Label>
                <Input
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 5511999999999"
                  className={cn(
                    "rounded-2xl h-12 border-[#25D366]/30 focus-visible:ring-[#25D366]",
                    !formData.whatsapp && "border-red-300"
                  )}
                />
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
              <div className="flex flex-col gap-2">
                {formData.services?.map((serviceItem, i) => {
                  const service = typeof serviceItem === 'string' ? { name: serviceItem, icon: 'Sparkles' } : serviceItem;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/40 rounded-2xl group/item">
                      {/* Icon Picker (Pro Only) */}
                      {isPro ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-primary/50 transition-colors">
                              {(() => {
                                const Icon = AVAILABLE_ICONS.find(idx => idx.name === service.icon)?.icon || SparklesIcon;
                                return <Icon className="w-5 h-5 text-primary" />;
                              })()}
                            </Button>
                          </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-3 rounded-2xl" align="start">
                          <div className="grid grid-cols-5 gap-2">
                            {AVAILABLE_ICONS.map((iconData) => (
                              <Button
                                key={iconData.name}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-10 w-10 rounded-lg",
                                  service.icon === iconData.name && "bg-primary/10 text-primary"
                                )}
                                onClick={() => updateServiceIcon(i, iconData.name)}
                              >
                                <iconData.icon className="w-5 h-5" />
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide">{service.name}</p>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeService(i)}
                      className="h-8 w-8 rounded-lg opacity-0 group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )})}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-0">
            <div className="space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label className="flex items-center gap-2 opacity-60"><Facebook className="w-4 h-4" /> Facebook</Label>
                      <Input
                        value={formData.facebook || ''}
                        onChange={(e) => handleChange('facebook', e.target.value)}
                        placeholder="facebook.com/voce"
                        className="rounded-2xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 opacity-60"><Music className="w-4 h-4" /> TikTok</Label>
                      <Input
                        value={formData.tiktok || ''}
                        onChange={(e) => handleChange('tiktok', e.target.value.replace('@', ''))}
                        placeholder="tiktok.com/@voce"
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
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 opacity-60"><Twitter className="w-4 h-4" /> Twitter / X</Label>
                      <Input
                        value={formData.twitter || ''}
                        onChange={(e) => handleChange('twitter', e.target.value.replace('@', ''))}
                        placeholder="seu_perfil"
                        className="rounded-2xl h-12"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2 opacity-60"><Globe className="w-4 h-4" /> Website Profissional</Label>
                      <Input
                        value={formData.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://seu-site.com"
                        className="rounded-2xl h-12"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-border/50 my-4" />

                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Links Personalizados (Ex: Portfólio, Agenda, etc)
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                      <Input
                        value={newCustomLink.title}
                        onChange={(e) => setNewCustomLink({ ...newCustomLink, title: e.target.value })}
                        placeholder="Título (ex: Meu Portfólio)"
                        className="rounded-2xl h-12"
                      />
                      <Input
                        value={newCustomLink.url}
                        onChange={(e) => setNewCustomLink({ ...newCustomLink, url: e.target.value })}
                        placeholder="URL (ex: https://...)"
                        className="rounded-2xl h-12"
                      />
                      <Button type="button" onClick={addCustomLink} className="h-12 w-12 rounded-2xl">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(formData.custom_links || []).map((link, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/40 rounded-2xl group/link">
                          <LinkIcon className="w-4 h-4 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide truncate">{link.title}</p>
                            <p className="text-[10px] opacity-60 truncate">{link.url}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeCustomLink(i)}
                            className="h-8 w-8 rounded-lg opacity-0 group-hover/link:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
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

            <div className="h-[1px] bg-border/50 my-6" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><Layers className="w-4 h-4 text-primary" /> Estilo do Tema</Label>
                {!isPro && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">PRO</span>}
              </div>
              
              <div className={cn("grid grid-cols-2 gap-3", !isPro && "opacity-40 pointer-events-none")}>
                {[
                  { id: 'standard', label: 'Padrão', desc: 'Limpo e moderno' },
                  { id: 'oled', label: 'OLED Dark', desc: 'Preto profundo' },
                  { id: 'glass', label: 'Glassmorphism', desc: 'Efeito de vidro' },
                  { id: 'minimalist', label: 'Minimalist', desc: 'Foco no conteúdo' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleChange('theme_style', style.id as any)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all hover:border-primary/50",
                      formData.theme_style === style.id ? "border-primary bg-primary/5 shadow-md" : "border-border/50 bg-card"
                    )}
                  >
                    <p className="text-xs font-bold">{style.label}</p>
                    <p className="text-[10px] opacity-60">{style.desc}</p>
                  </button>
                ))}
              </div>
              {!isPro && (
                <Link href="/pricing" className="text-[10px] text-primary font-bold hover:underline block mt-2 text-center">
                  Faça upgrade para desbloquear temas premium
                </Link>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><Type className="w-4 h-4 text-primary" /> Tipografia Premium</Label>
                {!isPro && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">PRO</span>}
              </div>
              
              <div className={cn("grid grid-cols-2 gap-3", !isPro && "opacity-40 pointer-events-none")}>
                {['Inter', 'Outfit', 'Playfair Display', 'Sora', 'Plus Jakarta Sans', 'Bento'].map((font) => (
                  <button
                    key={font}
                    onClick={() => handleChange('font_family', font)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center text-sm",
                      formData.font_family === font ? "border-primary bg-primary/5 font-bold" : "border-border/50"
                    )}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><ImageIcon className="w-4 h-4 text-primary" /> Fundo Personalizado</Label>
                {!isPro && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">PRO</span>}
              </div>
              <div className={cn("space-y-3", !isPro && "opacity-40 pointer-events-none")}>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleBackgroundUpload}
                  accept="video/*,image/*"
                  className="hidden"
                />
                
                {formData.background_video_url ? (
                  <div className="relative group/video rounded-2xl overflow-hidden border border-border">
                    {formData.background_video_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video 
                        src={formData.background_video_url} 
                        className="w-full h-32 object-cover opacity-60"
                        muted
                        loop
                      />
                    ) : (
                      <img 
                        src={formData.background_video_url} 
                        className="w-full h-32 object-cover opacity-60"
                        alt="Background Preview"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/video:opacity-100 transition-opacity">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="rounded-xl h-9"
                        onClick={() => handleChange('background_video_url', undefined)}
                      >
                        <X className="w-4 h-4 mr-2" /> Remover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full h-24 border-2 border-dashed rounded-[2rem] flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 p-0"
                    disabled={uploading}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enviar Foto ou Vídeo</span>
                      </>
                    )}
                  </Button>
                )}
                <p className="text-[10px] text-muted-foreground ml-1">
                  Máximo 10MB. Suporta vídeos (MP4) e imagens (JPG, PNG).
                </p>
              </div>
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
          <TabsContent value="qrcode" className="space-y-6 mt-0">
            {!isPro ? (
              <div className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
                <QrIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code Personalizado bloqueado</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Usuários PRO podem baixar o QR Code do perfil com sua foto no centro e nas cores da sua marca para usar em materiais impressos.
                </p>
                <Button asChild className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
                  <Link href="/pricing">Quero meu QR Code Pro</Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <StyledQRCode 
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${formData.username}`} 
                  isPro={isPro} 
                  username={formData.username || 'user'} 
                  photoUrl={formData.photo_url || undefined}
                />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
