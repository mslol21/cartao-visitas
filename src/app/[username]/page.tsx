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
      url: `https://konnexy.io/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    alternates: {
      canonical: `https://konnexy.io/${username}`,
    },
  };
}

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-slate-950 p-6 relative overflow-hidden">
      <ProfileClientWrapper profile={profile} themeColor={themeColor} />
    </div>
  );
}
