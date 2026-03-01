"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  Lock,
  Clock,
  Car,
  ChevronRight,
  PawPrint,
  Info,
  FileText,
  Tag
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StyledQRCode } from '../StyledQRCode';
import { Profile, ProfileFormData, ProfessionCategory, CustomFields } from '@/types/profile';
import { getProfessionConfig, professionsMap } from '@/config/professions';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { findImages } from '@/config/imageMap';

interface EditorFormProps {
  initialData: Partial<ProfileFormData>;
  onSubmit: (data: Partial<ProfileFormData>) => Promise<void>;
  onChange: (data: Partial<ProfileFormData>) => void;
  isPro?: boolean;
  canCustomizeTheme?: boolean;
}

export function EditorForm({ initialData, onSubmit, onChange, isPro = false, canCustomizeTheme = true }: EditorFormProps) {
  const [formData, setFormData] = useState<Partial<ProfileFormData>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const firstRender = useRef(true);
  const [isDirty, setIsDirty] = useState(false);
  const [pixabaySearch, setPixabaySearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSave = useCallback(async (silent = false) => {
    if (isSaving) return;
    
    // Novas validações obrigatórias
    if (!formData.username?.trim()) {
      if (!silent) toast.error('O Username (URL) é obrigatório!');
      return;
    }
    if (!formData.business_name?.trim()) {
       if (!silent) toast.error('Nome do negócio é obrigatório!');
       return;
    }
    if (!formData.profession || formData.profession === 'default') {
       if (!silent) toast.error('Selecione uma profissão específica!');
       return;
    }
    if (!formData.whatsapp?.trim()) {
      if (!silent) toast.error('O WhatsApp é obrigatório!');
      return;
    }

    const currentServices = formData.servicos || [];
    if (currentServices.length === 0) {
       if (!silent) toast.error('Adicione pelo menos 1 serviço!');
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

  const handleCustomFieldChange = (fieldName: keyof CustomFields, value: any) => {
    const updatedCustomFields = { ...(formData.custom_fields || {}), [fieldName]: value };
    const updated = { ...formData, custom_fields: updatedCustomFields };
    setFormData(updated as ProfileFormData);
    onChange(updated as ProfileFormData);
    setIsDirty(true);
  };

  const professionConfig = useMemo(() => 
    getProfessionConfig(formData.profession as ProfessionCategory), 
    [formData.profession]
  );

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
      toast.success('Fundo atualizado!');
    } catch (error: any) {
      toast.error('Erro ao subir arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const handlePixabaySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixabaySearch.trim()) return;

    setIsSearching(true);
    setSearchResults([]); // Clear for loading state
    
    try {
      // Small delay for better UX feel
      await new Promise(r => setTimeout(r, 600));
      
      // 1. First check our curated Pixabay-based premium library
      const localMatches = findImages(pixabaySearch);
      
      // 2. Dynamic Fetch from Pixabay API
      const API_KEY = '48995393-9c869be7400d92297af0e2069'; // Public key for this context or use your own
      const response = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(pixabaySearch)}&image_type=photo&orientation=vertical&per_page=12&safesearch=true`);
      const data = await response.json();
      
      const apiResults = data.hits?.map((hit: any) => hit.largeImageURL) || [];
      const combined = Array.from(new Set([...localMatches, ...apiResults])).slice(0, 15);

      if (combined.length > 0) {
        setSearchResults(combined);
      } else {
        toast.error('Nenhuma imagem encontrada para este termo no Pixabay.');
      }
    } catch (error) {
      console.error('Pixabay search error:', error);
      toast.error('Erro na conexão com Pixabay.');
    } finally {
      setIsSearching(false);
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
      typeof s === 'string' ? { name: s, icon: 'Sparkles', price: '', description: '' } : s
    );
    const updatedServices = [...currentServices, { 
      name: newService.trim(), 
      icon: 'Sparkles', 
      price: newServicePrice.trim(),
      description: newServiceDescription.trim()
    }];
    
    if (updatedServices.length <= (isPro ? 20 : 3)) {
      handleChange('services', updatedServices);
      setNewService('');
      setNewServicePrice('');
      setNewServiceDescription('');
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

            <div className="grid gap-6">
              {/* 1. PADRONIZAÇÃO GLOBAL */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="w-4 h-4 text-primary" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest">Informações Gerais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Sua Profissão</Label>
                     <Select 
                       value={formData.profession || 'default'} 
                         onValueChange={(val) => {
                           const conf = (professionsMap as any)[val] || professionsMap.default;
                           const colorMap: Record<string, string> = {
                             amber: '#f59e0b',
                             blue: '#3b82f6',
                             orange: '#f97316',
                             red: '#ef4444',
                             zinc: '#71717a',
                             violet: '#8b5cf6',
                             emerald: '#10b981',
                             stone: '#78716c',
                             cyan: '#06b6d4',
                             indigo: '#6366f1',
                             sky: '#0ea5e9',
                             pink: '#ec4899',
                             rose: '#f43f5e',
                             teal: '#14b8a6',
                             purple: '#a855f7',
                             slate: '#64748b'
                           };
                           const updates = { 
                             profession: val,
                             category: val === 'default' ? 'default' : val,
                             theme_color: colorMap[conf.theme.color] || '#3b82f6',
                             theme_style: conf.theme.style,
                             font_family: val === 'barbearia' ? 'Sora' : 
                                         val === 'advogado' ? 'Playfair Display' : 
                                         val === 'tech' ? 'JetBrains Mono' : 'Inter',
                             cta_text: val === 'barbearia' ? 'Agendar Corte 💈' :
                                      val === 'manicure' ? 'Agendar Horário ✨' :
                                      val === 'quentinhas' ? 'Fazer Pedido 🍱' :
                                      ['mecanico', 'encanador', 'eletricista', 'serralheiro'].includes(val) ? 'Pedir Orçamento 🛠️' : 'Falar no WhatsApp'
                           };
                           const updated = { ...formData, ...updates };
                           setFormData(updated);
                           if (onChange) onChange(updated);
                         }}
                     >
                       <SelectTrigger className="rounded-2xl h-12 bg-white dark:bg-slate-950">
                         <SelectValue placeholder="Selecione sua profissão" />
                       </SelectTrigger>
                       <SelectContent className="rounded-2xl">
                         {Object.values(professionsMap).map(p => (
                           <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-2">
                     <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Nome do Negócio (Exibição Principal)</Label>
                     <Input
                       value={formData.business_name || ''}
                       onChange={(e) => handleChange('business_name', e.target.value)}
                       placeholder="Ex: Barbearia do João"
                       className="rounded-2xl h-12"
                     />
                   </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Subtítulo / Especialidade</Label>
                  <Input
                    value={formData.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="Ex: Especialista em Degradê e Barba"
                    className="rounded-2xl h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Área de Atendimento</Label>
                    <Input
                      value={formData.area_atendimento || ''}
                      onChange={(e) => handleChange('area_atendimento', e.target.value)}
                      placeholder="Ex: São Paulo e Grande SP"
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Tipo de Atendimento</Label>
                    <Input
                      value={formData.tipo_atendimento || ''}
                      onChange={(e) => handleChange('tipo_atendimento', e.target.value)}
                      placeholder="Ex: Presencial / Domiciliar"
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Horário de Funcionamento</Label>
                  <Input
                    value={formData.horario_funcionamento || ''}
                    onChange={(e) => handleChange('horario_funcionamento', e.target.value)}
                    placeholder="Ex: Seg a Sáb, 09h às 19h"
                    className="rounded-2xl h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#25D366] font-bold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> WhatsApp (Obrigatório)
                    </Label>
                    <Input
                      value={formData.whatsapp || ''}
                      onChange={(e) => handleChange('whatsapp', e.target.value.replace(/\D/g, ''))}
                      placeholder="5511999999999"
                      className="rounded-2xl h-12 border-[#25D366]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#E1306C] font-bold flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram (Opcional)
                    </Label>
                    <Input
                      value={formData.instagram || ''}
                      onChange={(e) => handleChange('instagram', e.target.value.replace('@', ''))}
                      placeholder="seu.usuario"
                      className="rounded-2xl h-12 border-[#E1306C]/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                   <Checkbox 
                     id="has_loc" 
                     checked={formData.has_physical_location} 
                     onCheckedChange={(checked) => handleChange('has_physical_location', !!checked)} 
                   />
                   <Label htmlFor="has_loc" className="text-sm font-bold cursor-pointer">Possuo endereço físico para atendimento</Label>
                </div>

                {formData.has_physical_location && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                     <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Endereço Completo</Label>
                     <Input
                       value={formData.endereco_completo || ''}
                       onChange={(e) => handleChange('endereco_completo', e.target.value)}
                       placeholder="Av. Paulista, 1000 - São Paulo, SP"
                       className="rounded-2xl h-12"
                     />
                   </div>
                )}
              </div>

              {/* 2. CAMPOS ESPECÍFICOS (Dinamismo por Profissão) */}
              {professionConfig.customFields.length > 0 && (
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="p-2 bg-primary/10 rounded-lg">
                        <SparklesIcon className="w-4 h-4 text-primary" />
                     </div>
                     <h3 className="text-sm font-black uppercase tracking-widest">Destaques {professionConfig.label}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {professionConfig.customFields.map((field) => (
                      <div key={field.name} className="flex flex-col gap-2">
                        {field.type === 'boolean' ? (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <Label className="text-sm font-bold opacity-80">{field.label}</Label>
                            <Switch 
                              checked={!!(formData.custom_fields as any)?.[field.name]}
                              onCheckedChange={(checked) => handleCustomFieldChange(field.name as keyof CustomFields, checked)}
                            />
                          </div>
                        ) : field.type === 'text' ? (
                          <>
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">{field.label}</Label>
                            <Input
                              value={(formData.custom_fields as any)?.[field.name] || ''}
                              onChange={(e) => handleCustomFieldChange(field.name as keyof CustomFields, e.target.value)}
                              placeholder={field.placeholder}
                              className="rounded-2xl h-11"
                            />
                          </>
                        ) : field.type === 'array' ? (
                          <>
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">{field.label} (Separado por vírgula)</Label>
                            <Input
                              value={((formData.custom_fields as any)?.[field.name] || []).join(', ')}
                              onChange={(e) => handleCustomFieldChange(field.name as keyof CustomFields, e.target.value.split(',').map(s => s.trim()))}
                              placeholder={field.placeholder}
                              className="rounded-2xl h-11"
                            />
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. BIO E DIFERENCIAIS */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">Biografia & Diferenciais</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Bio Profissional</Label>
                    </div>
                    <Textarea
                      value={formData.bio_profissional || ''}
                      onChange={(e) => handleChange('bio_profissional', e.target.value)}
                      placeholder="Conte sobre sua trajetória, valores e especialidades..."
                      className="rounded-2xl min-h-[120px] bg-white dark:bg-slate-950"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Uma bio bem escrita ajuda a transmitir profissionalismo e confiança.</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Diferenciais (Um por linha)</Label>
                    <Textarea
                      value={formData.diferenciais?.join('\n') || ''}
                      onChange={(e) => handleChange('diferenciais', e.target.value.split('\n').filter(l => l.trim()))}
                      placeholder="Ex: 5 anos de experiência&#10;Atendimento Premium&#10;Produtos de alta qualidade"
                      className="rounded-2xl min-h-[100px] bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>
              </div>

              {/* 4. SERVIÇOS (Mínimo 1) */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="w-4 h-4 text-primary" />
                   </div>
                   <h3 className="text-sm font-black uppercase tracking-widest">Catálogo de Serviços</h3>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs opacity-60">Adicione seus serviços principais com valores.</Label>
                  <div className="grid grid-cols-[1fr_100px] gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Nome do Serviço"
                      className="rounded-2xl h-11"
                    />
                    <Input
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="Preço R$"
                      className="rounded-2xl h-11"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                      placeholder="Descrição opcional"
                      className="rounded-2xl h-11 flex-1"
                    />
                    <Button type="button" size="icon" onClick={() => {
                      if (!newService.trim()) return;
                      const srv = formData.servicos || [];
                      handleChange('servicos', [...srv, { 
                        nome: newService.trim(), 
                        preco: newServicePrice.trim(), 
                        descricao: newServiceDescription.trim() 
                      }]);
                      setNewService('');
                      setNewServicePrice('');
                      setNewServiceDescription('');
                    }} className="h-11 w-11 rounded-xl">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {(formData.servicos || []).map((s, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 group/srv">
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold uppercase">{s.nome}</p>
                           <p className="text-[10px] text-primary font-black">{s.preco || 'Sob consulta'}</p>
                         </div>
                         <Button variant="ghost" size="icon" onClick={() => {
                           const srv = formData.servicos || [];
                           handleChange('servicos', srv.filter((_, i) => i !== idx));
                         }} className="opacity-0 group-hover/srv:opacity-100 transition-opacity">
                           <X className="w-4 h-4 text-red-500" />
                         </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* URL PERMANENTE */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Seu Link Exclusivo (URL)</Label>
                <div className="relative">
                  <Input
                    value={formData.username || ''}
                    onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="seu.nome"
                    className={cn(
                      "rounded-2xl h-12 pr-10",
                      usernameStatus === 'taken' && "border-red-500",
                      usernameStatus === 'available' && "border-green-500"
                    )}
                  />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-500" />}
                    {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
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
              <div className={cn("flex flex-wrap gap-2", (formData.category === 'barbearia' && !canCustomizeTheme) && "opacity-40 pointer-events-none")}>
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
                placeholder="Ex: Falar Agora ou Atendimento Direto"
                className="rounded-2xl h-12"
              />
            </div>

            <div className="h-[1px] bg-border/50 my-6" />

              <div className="space-y-6">
                <div className="mb-2">
                  <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                    <SparklesIcon className="w-4 h-4 text-primary" /> Estilização da Foto
                  </Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Filtros e efeitos de borda (Exclusivo PRO)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Filtro de Imagem</Label>
                    <Select 
                      value={formData.photo_filter || 'none'} 
                      onValueChange={(val) => isPro && handleChange('photo_filter', val)}
                      disabled={!isPro}
                    >
                      <SelectTrigger className="rounded-xl h-10">
                        <SelectValue placeholder="Nenhum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Padrão</SelectItem>
                        <SelectItem value="bw">Preto e Branco</SelectItem>
                        <SelectItem value="vintage">Vintage (Sépia)</SelectItem>
                        <SelectItem value="vivid">Vibrante</SelectItem>
                        <SelectItem value="golden">Dourado</SelectItem>
                        <SelectItem value="cold">Frio / Azulado</SelectItem>
                        <SelectItem value="dramatic">Dramático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-40">Efeito de Borda</Label>
                    <Select 
                      value={formData.photo_border_effect || 'none'} 
                      onValueChange={(val) => isPro && handleChange('photo_border_effect', val)}
                      disabled={!isPro}
                    >
                      <SelectTrigger className="rounded-xl h-10">
                        <SelectValue placeholder="Nenhum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Simples</SelectItem>
                        <SelectItem value="glow">Brilho Neon</SelectItem>
                        <SelectItem value="rainbow">Arco-íris (Giro)</SelectItem>
                        <SelectItem value="pulse">Pulsação</SelectItem>
                        <SelectItem value="shimmer">Brilho Metálico</SelectItem>
                        <SelectItem value="spin">Giro Cromático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

                {/* ── HORÁRIO DE ATENDIMENTO ───────────────────────────────────── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                      <Clock className="w-4 h-4 text-primary" /> Horário de Atendimento
                    </Label>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Dom'].map((day) => {
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase w-16 text-muted-foreground">{day}</span>
                          <Input
                            value={formData.business_hours?.[day] || ''}
                            onChange={(e) => {
                              const newHours = { ...(formData.business_hours || {}), [day]: e.target.value };
                              handleChange('business_hours', newHours);
                            }}
                            placeholder="Ex: 09:00 - 18:00 ou Fechado"
                            className="rounded-xl h-10 text-xs"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="h-[1px] bg-border/50 my-6" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><Type className="w-4 h-4 text-primary" /> Tipografia Premium</Label>
                {!isPro && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">PRO</span>}
              </div>
              
              <div className={cn("grid grid-cols-2 gap-3", (!isPro || !canCustomizeTheme || (formData.category === 'barbearia' && !canCustomizeTheme)) && "opacity-40 pointer-events-none")}>
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
              <div className={cn("space-y-3", (!isPro || !canCustomizeTheme || (formData.category === 'barbearia' && !canCustomizeTheme)) && "opacity-40 pointer-events-none")}>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleBackgroundUpload}
                  accept="video/*,image/*"
                  className="hidden"
                />
                
                {formData.background_video_url ?
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
                 : 
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
                }
                <p className="text-[10px] text-muted-foreground ml-1">
                  Máximo 10MB. Suporta vídeos (MP4) e imagens (JPG, PNG).
                </p>

                {/* --- SEARCH & SUGGESTED GALLERY --- */}
                {isPro && (
                  <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Pixabay Search Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Search className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pesquisar Banco Pixabay (Premium)</span>
                      </div>
                      <form onSubmit={handlePixabaySearch} className="flex gap-2">
                        <Input 
                          placeholder="Ex: dentista, barbearia, advocacia..."
                          value={pixabaySearch}
                          onChange={(e) => setPixabaySearch(e.target.value)}
                          className="h-10 rounded-xl text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        />
                        <Button 
                          type="submit" 
                          disabled={isSearching}
                          className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90"
                        >
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </Button>
                      </form>
                      <p className="text-[8px] text-muted-foreground italic px-1">
                        * Busca inteligente em Português e Inglês para profissionais.
                      </p>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resultados da Pesquisa</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 p-0 ml-auto text-[8px] font-black text-slate-400 uppercase hover:text-red-500"
                            onClick={() => setSearchResults([])}
                          >
                            Limpar
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {searchResults.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => handleChange('background_video_url', url)}
                              className={cn(
                                "relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 group/search-item shadow-sm",
                                formData.background_video_url === url ? "border-primary ring-4 ring-primary/20 shadow-xl" : "border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100"
                              )}
                            >
                              <img 
                                src={url} 
                                className="w-full h-full object-cover transition-opacity duration-500" 
                                alt="Search result" 
                                loading="lazy"
                                onLoad={(e) => {
                                  (e.target as HTMLImageElement).classList.add('opacity-100');
                                }}
                                onError={(e) => {
                                  // Se falhar o link dinâmico, coloca um fallback de luz/negócios
                                  (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2016/03/26/13/09/workspace-1280538_1280.jpg';
                                }}
                              />
                              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/search-item:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[7px] font-black text-white uppercase tracking-tighter">Selecionar</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sugestões para sua Profissão</span>
                      </div>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
                        {(professionConfig.suggestedBackgrounds || []).map((bgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChange('background_video_url', bgUrl)}
                            className={cn(
                              "relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.05] active:scale-95 group/suggest",
                              formData.background_video_url === bgUrl ? "border-primary ring-4 ring-primary/20" : "border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100"
                            )}
                          >
                            <img 
                              src={bgUrl} 
                              alt={`Suggested background ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2016/03/26/13/09/workspace-1280538_1280.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/suggest:opacity-100 transition-opacity">
                              <span className="text-[8px] font-black text-white uppercase tracking-widest bg-primary px-2 py-1 rounded-full shadow-lg">Usar</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
