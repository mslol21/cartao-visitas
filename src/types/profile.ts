export interface ServiceItem {
  name: string;
  icon?: string;
}

export interface CustomLink {
  title: string;
  url: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  name: string | null;
  photo_url: string | null;
  tagline: string | null;
  whatsapp: string | null;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  website: string | null;
  custom_links?: CustomLink[];
  city: string | null;
  address: string | null;
  service_area: string | null;
  services: ServiceItem[];
  cta_text: string;
  plan: 'free' | 'pro' | 'fundador_local';
  billing_type: 'stripe' | 'manual';
  plan_expires_at: string | null;
  is_founder: boolean;
  category: 'default' | 'barbearia';
  can_customize_theme: boolean;
  role: 'user' | 'admin';
  verified: boolean;
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
}

export interface ProfileFormData {
  username?: string | null;
  name?: string | null;
  photo_url?: string | null;
  tagline?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  website?: string | null;
  custom_links?: CustomLink[];
  city?: string | null;
  address?: string | null;
  service_area?: string | null;
  expert_area?: string | null;
  founded_year?: number | null;
  avatar_frame?: string | null;
  photo_filter?: string | null;
  photo_border_effect?: string | null;
  services?: ServiceItem[];
  cta_text?: string;
  plan?: 'free' | 'pro' | 'fundador_local';
  billing_type?: 'stripe' | 'manual';
  plan_expires_at?: string | null;
  is_founder?: boolean;
  category?: 'default' | 'barbearia';
  can_customize_theme?: boolean;
  role?: 'user' | 'admin';
  seo_title?: string | null;
  seo_description?: string | null;
  theme_color?: string;
  theme_style?: 'standard' | 'oled' | 'glass' | 'minimalist';
  font_family?: string;
  background_video_url?: string | null;
}
