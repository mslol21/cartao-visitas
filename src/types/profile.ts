// Types for the new profession structure
export type ProfessionCategory = 
  | 'barbearia' 
  | 'manicure' 
  | 'cabeleireiro' 
  | 'personal_trainer' 
  | 'advogado' 
  | 'psicologo' 
  | 'designer' 
  | 'fotografo' 
  | 'tecnico_informatica' 
  | 'esteticista'
  | 'default';

export interface Service {
  nome: string;
  descricao?: string;
  preco?: string;
  duracao?: string;
}

export interface CustomFields {
  // Barbearia
  aceita_agendamento?: boolean;
  trabalha_com_horario_marcado?: boolean;
  // Manicure
  atende_domicilio?: boolean;
  // Personal Trainer
  atende_em_academia?: boolean;
  online?: boolean;
  // Advogado
  especialidades?: string[];
  numero_oab?: string;
  // Psicólogo
  abordagem_terapeutica?: string;
  atendimento_online?: boolean;
  // Fotógrafo
  tipo_eventos?: string[];
  entrega_digital?: boolean;
  // Técnico Informática
  atende_empresas?: boolean;
  suporte_remoto?: boolean;
  // Esteticista
  procedimentos?: string[];
  // Designer
  tipos_de_servico?: string[];
}

// Keeping old items for backwards compatibility during migration
export interface ServiceItem {
  name: string;
  icon?: string;
  price?: string;
  description?: string;
}

export interface CustomLink {
  title: string;
  url: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  
  // -- New Standard Profession Fields --
  profession: ProfessionCategory | string | null;
  business_name: string | null;
  subtitle: string | null;
  area_atendimento: string | null;
  tipo_atendimento: string | null;
  horario_funcionamento: string | null;
  whatsapp: string | null;
  instagram: string | null;
  has_physical_location: boolean;
  endereco_completo: string | null;
  bio_profissional: string | null;
  diferenciais: string[];
  servicos: Service[];
  plano: string;
  ativo: boolean;
  custom_fields: CustomFields;
  // ------------------------------------

  // Old fields (kept for migration purposes)
  name: string | null;
  tagline: string | null;
  city: string | null;
  address: string | null;
  service_area: string | null;
  services: ServiceItem[];
  plan: 'free' | 'pro' | 'fundador_local';
  billing_type: 'stripe' | 'manual';
  plan_expires_at: string | null;
  is_founder: boolean;
  category: 'default' | 'barbearia' | 'beauty' | 'health' | 'sales' | 'food' | 'service' | 'advogado' | 'tech' | 'real_estate' | 'driver' | 'petshop';
  can_customize_theme: boolean;
  role: 'user' | 'admin';
  verified: boolean;
  
  // Customization mappings
  photo_url: string | null;
  linkedin: string | null;
  facebook: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  website: string | null;
  custom_links?: CustomLink[];
  cta_text: string;
  seo_title: string | null;
  seo_description: string | null;
  theme_color: string;
  theme_style: 'standard' | 'oled' | 'glass' | 'minimalist';
  font_family: string;
  expert_area: string | null;
  founded_year: number | null;
  avatar_frame: string | null;
  photo_filter: string | null;
  photo_border_effect: string | null;
  background_video_url: string | null;
  created_at: string;
  updated_at: string;
  business_hours?: Record<string, string>;
}

export interface ProfileFormData extends Partial<Profile> {
  // Can be typed based on Profile directly
}
