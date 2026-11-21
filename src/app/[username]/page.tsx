import { StructuredData } from '@/components/seo/StructuredData';
import { generatePageGraph } from '@/lib/seo/structured-data';
import { pageMetadata, SITE_URL } from "@/lib/seo/site";
import { getPublicProfile } from '@/lib/seo/public-profile';
import { MassamiTagProfile } from '@/components/card/MassamiTagProfile';
import { MusicProfileView } from '@/components/music/MusicProfileView';
import { isMusicProfession } from '@/types/music';
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
    return pageMetadata(title, description, '/massami', 'profile');
  }

  const profile = await getPublicProfile(username);

  if (!profile || profile.ativo === false) notFound();

  const isMusic = isMusicProfession(profile.profession) || (profile.custom_fields as any)?.music_pro?.config?.enabled;
  const name = profile.business_name || profile.name || username;
  const title = profile.seo_title || (isMusic ? `${name} | Portfólio Musical Konnexy` : `${name} | Konnexy Profissional`);
  const description =
    profile.seo_description ||
    profile.subtitle ||
    profile.tagline ||
    profile.bio_profissional ||
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

  const isMusic = !isMassami && profile && (
    isMusicProfession(profile.profession) || 
    Boolean((profile.custom_fields as any)?.music_pro?.config?.enabled)
  );

  const name = profile?.business_name || profile?.name || username;
  const path = `/${encodeURIComponent(profile?.username || username)}`;

  const schemaData = isMusic
    ? {
        '@context': 'https://schema.org',
        '@type': profile?.profession === 'banda' || profile?.profession === 'grupo_musical' ? 'MusicGroup' : 'Person',
        name,
        description: profile?.seo_description || profile?.subtitle || profile?.bio_profissional || 'Portfólio musical oficial',
        image: profile?.photo_url || undefined,
        url: `${SITE_URL}${path}`,
        genre: (profile?.custom_fields as any)?.estilo_musical || 'Música'
      }
    : generatePageGraph({ 
        title: name, 
        description: profile?.seo_description || profile?.subtitle || profile?.tagline || 'Perfil profissional Konnexy', 
        path 
      });

  return (
    <KonnexyPageIntro>
      <StructuredData data={schemaData} />
      {isMusic && profile ? (
        <MusicProfileView profile={profile} />
      ) : (
        <MassamiTagProfile profile={profile} />
      )}
    </KonnexyPageIntro>
  );
}
