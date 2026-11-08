import type { Metadata } from 'next';

export const SITE_URL = 'https://www.konnexy.com.br';
export const SITE_NAME = 'Konnexy';
export const SITE_DESCRIPTION = 'Sites, cardápios digitais, agendamento e PDV para pequenos negócios. Conheça as soluções da Konnexy e encontre a ideal para sua empresa.';
export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/images/konnexy-social.png`,
  width: 1200, height: 630, type: 'image/png',
  alt: 'Konnexy — Conecta • Organiza • Vende, com a Koi prateada',
};
export function pageMetadata(title: string, description: string, path: string, type: 'website' | 'profile' = 'website'): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    openGraph: { type, locale: 'pt_BR', siteName: SITE_NAME, url, title, description, images: [SOCIAL_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }] },
  };
}
