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
  city: string | null;
  services: string[];
  cta_text: string;
  plan: 'free' | 'pro';
  verified: boolean;
  seo_title: string | null;
  seo_description: string | null;
  theme_color: string;
  theme_style: 'standard' | 'oled' | 'glass' | 'minimalist';
  font_family: string;
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
  city?: string | null;
  services?: string[];
  cta_text?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  theme_color?: string;
  theme_style?: 'standard' | 'oled' | 'glass' | 'minimalist';
  font_family?: string;
  background_video_url?: string | null;
}
