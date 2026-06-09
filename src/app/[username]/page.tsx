import { createClient } from '@/utils/supabase/server';
import { ProfileClientWrapper } from '@/components/card/ProfileClientWrapper';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trackEvent } from '@/app/actions/analytics';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) return { title: 'Perfil não encontrado' };

  const name = profile.name || username;
  const title = profile.seo_title || `${name} | Konnexy Profissional`;
  const description = profile.seo_description || profile.tagline || `Confira o cartão de visita digital de ${name}. Contato via WhatsApp, redes sociais e serviços.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
      type: 'profile',
      url: `https://konnexy.com.br/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    alternates: {
      canonical: `https://konnexy.com.br/${username}`,
    },
  };
}

export const revalidate = 0;

export default async function PublicPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) notFound();

  // Rastrear visualização de página (silenciosamente no servidor)
  trackEvent(profile.id, 'page_view').catch(console.error);

  const themeColor = profile.theme_color || '#3b82f6';
  const customFields = (profile.custom_fields as any) || {};

  // Profissões com cartão naturalmente escuro precisam de fundo escuro na página
  const DARK_PROFESSIONS = new Set([
    'tech', 'tecnico_informatica', 'designer', 'fotografo',
    'barbearia',
    'estetica_automotiva', 'manutencao_automotiva', 'vistoria_veicular',
    'driver', 'advogado', 'musico',
    'chef_eventos',
  ]);
  const profession = profile.profession || profile.category || '';
  const isDarkCard = DARK_PROFESSIONS.has(profession);

  // Prioridade: 1) cor_fundo customizada pelo usuário  2) detectada pela profissão  3) default neutro claro
  let pageBg: string;
  if (customFields.cor_fundo) {
    pageBg = customFields.cor_fundo;
  } else if (isDarkCard) {
    // Fundo escuro com halo sutil na cor do tema do usuário
    pageBg = `radial-gradient(ellipse 80% 40% at 50% -5%, ${themeColor}22 0%, #020617 55%)`;
  } else {
    pageBg = '#f8fafc';
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500"
      style={{ background: pageBg }}
    >
      <ProfileClientWrapper profile={profile} themeColor={themeColor} isDarkCard={isDarkCard} />
    </div>
  );
}
