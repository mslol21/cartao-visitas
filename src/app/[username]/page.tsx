import { cache } from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { generatePageGraph } from '@/lib/seo/structured-data';
import { pageMetadata } from "@/lib/seo/site";
import { createClient } from '@/utils/supabase/server';
import { MassamiTagProfile } from '@/components/card/MassamiTagProfile';
import { KonnexyPageIntro } from '@/components/brand/KonnexyPageIntro';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { trackEvent } from '@/app/actions/analytics';

interface Props {
  params: Promise<{ username: string }>;
}

const getPublicProfile = cache(async (username: string) => {
  const supabase = await createClient();
  const {data} = await supabase.from('profiles').select('*').eq('username', username).single();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  if (username.toLowerCase() === 'massami') {
    const title = 'Massami | Konnexy • Developer Full-Stack & Phygital SaaS';
    const description =
      'Desenvolvedor de software, soluções SaaS e tecnologia Phygital para transformar negócios locais. Fale com Massami via WhatsApp ou conheça as soluções da Konnexy.';
    return pageMetadata(title, description, '/massami', 'profile');
  }

  const profile = await getPublicProfile(username);

  if (!profile || profile.ativo === false) notFound();

  const name = profile.business_name || profile.name || username;
  const title = profile.seo_title || `${name} | Konnexy Profissional`;
  const description =
    profile.seo_description ||
    profile.subtitle ||
    profile.tagline ||
    `Confira o cartão de visita digital de ${name}. Contato via WhatsApp, redes sociais e serviços.`;

  return pageMetadata(title, description, `/${encodeURIComponent(profile.username || username)}`, 'profile');
}

export const revalidate = 0;

export default async function PublicPage({ params }: Props) {
  const { username } = await params;
  const isMassami = username.toLowerCase() === 'massami';

  const profile = await getPublicProfile(username);

  if ((!profile && !isMassami) || profile?.ativo === false) notFound();

  // Rastrear visualização de página (silenciosamente no servidor)
  if (profile?.id) {
    trackEvent(profile.id, 'page_view').catch(console.error);
  }

  // Renderiza o layout Konnexy Tag em todo o sistema e todas as contas
  return (
    <KonnexyPageIntro>
      <StructuredData data={generatePageGraph({ title: profile?.business_name || profile?.name || username, description: profile?.seo_description || profile?.subtitle || profile?.tagline || 'Perfil profissional Konnexy', path: `/${encodeURIComponent(profile?.username || username)}` })} />
      <MassamiTagProfile profile={profile} />
    </KonnexyPageIntro>
  );
}
