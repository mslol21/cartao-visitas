import { MetadataRoute } from 'next'
import { publicProfileEntries } from '@/lib/seo/public-profiles'
import { SITE_URL } from '@/lib/seo/site'
import { seoIntentPages } from '@/config/seo-intent-pages'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const profiles = await publicProfileEntries()

  const servicePages = [
    'criacao-de-sites',
    'otimizacao-perfil-google',
    'trafego-pago',
    'sistemas-web',
    'link-profissional',
    'catalogo-cardapio-digital',
    'nfc-qr-code',
  ]

  const intentPages = Object.keys(seoIntentPages)

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/servicos`,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    ...servicePages.map((slug) => ({
      url: `${baseUrl}/servicos/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/solucoes`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...intentPages.map((slug) => ({
      url: `${baseUrl}/solucoes/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...Array.from(new Map([{username: 'massami'}, ...profiles].map(profile => [profile.username, profile])).values()).map(profile => ({
      url: `${baseUrl}/${encodeURIComponent(profile.username)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...('updated_at' in profile && profile.updated_at && !Number.isNaN(Date.parse(profile.updated_at as string)) ? {lastModified: profile.updated_at as string} : {}),
    })),
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
