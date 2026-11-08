import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/admin', '/management', '/login', '/signup', '/auth/'],
      },
    ],
    sitemap: 'https://www.konnexy.com.br/sitemap.xml',
    host: 'https://www.konnexy.com.br',
  }
}
