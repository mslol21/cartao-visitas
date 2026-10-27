import { createClient } from '@/utils/supabase/server';
import { MassamiTagProfile } from '@/components/card/MassamiTagProfile';
import { KonnexyPageIntro } from '@/components/brand/KonnexyPageIntro';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trackEvent } from '@/app/actions/analytics';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  if (username.toLowerCase() === 'massami') {
    const title = 'Massami | Konnexy • Developer Full-Stack & Phygital SaaS';
    const description =
      'Desenvolvedor de software, soluções SaaS e tecnologia Phygital para transformar negócios locais. Fale com Massami via WhatsApp ou conheça as soluções da Konnexy.';
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ['/images/koi_hero.png'],
        type: 'profile',
        url: 'https://konnexy.com.br/massami',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/images/koi_hero.png'],
      },
      alternates: {
        canonical: 'https://konnexy.com.br/massami',
      },
    };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) return { title: 'Perfil não encontrado' };

  const name = profile.business_name || profile.name || username;
  const title = profile.seo_title || `${name} | Konnexy Profissional`;
  const description =
    profile.seo_description ||
    profile.subtitle ||
    profile.tagline ||
    `Confira o cartão de visita digital de ${name}. Contato via WhatsApp, redes sociais e serviços.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : ['/images/koi_hero.png'],
      type: 'profile',
      url: `https://konnexy.com.br/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : ['/images/koi_hero.png'],
    },
    alternates: {
      canonical: `https://konnexy.com.br/${username}`,
    },
  };
}

export const revalidate = 0;

export default async function PublicPage({ params }: Props) {
  const { username } = await params;
  const isMassami = username.toLowerCase() === 'massami';

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile && !isMassami) notFound();

  // Rastrear visualização de página (silenciosamente no servidor)
  if (profile?.id) {
    trackEvent(profile.id, 'page_view').catch(console.error);
  }

  // Renderiza o layout Konnexy Tag em todo o sistema e todas as contas
  return (
    <KonnexyPageIntro>
      <MassamiTagProfile profile={profile} />
    </KonnexyPageIntro>
  );
}
