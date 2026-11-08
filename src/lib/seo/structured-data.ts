import { SITE_URL, SOCIAL_IMAGE } from './site';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

export function generateOrganizationSchema() {
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': organizationId, name: 'Konnexy', url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', '@id': `${SITE_URL}/#logo`, url: `${SITE_URL}/images/koi_hero.png`, width: 1024, height: 1024 },
      description: 'Sites, presença no Google, catálogos, NFC e QR Code e sistemas web para pequenos negócios.',
      slogan: 'Conecta • Organiza • Vende',
      sameAs: ['https://www.instagram.com/konnexy.web'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+55 16 99155-1200', contactType: 'customer service', availableLanguage: ['pt-BR'] },
    },
    { '@type': 'WebSite', '@id': websiteId, url: `${SITE_URL}/`, name: 'Konnexy', inLanguage: 'pt-BR', publisher: { '@id': organizationId } },
  ] };
}

export function generatePageGraph({title, description, path, services = []}: {
  title: string; description: string; path: string;
  services?: readonly {title: string; description: string; href: string}[];
}) {
  const url = new URL(path, SITE_URL).href;
  const pageId = `${url}#webpage`;
  const crumbs = [{name: 'Konnexy', url: `${SITE_URL}/`}];
  if (path.startsWith('/servicos')) crumbs.push({name: 'Serviços', url: `${SITE_URL}/servicos`});
  else if (path !== '/') crumbs.push({name: title, url});
  if (path.startsWith('/servicos/')) crumbs.push({name: title, url});
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': pageId, url, name: title, description, inLanguage: 'pt-BR',
      isPartOf: { '@id': websiteId }, publisher: { '@id': organizationId },
      primaryImageOfPage: { '@type': 'ImageObject', url: SOCIAL_IMAGE.url, width: 1200, height: 630 },
      ...(path !== '/' ? {breadcrumb: {'@id': `${url}#breadcrumb`}} : {}),
    },
    ...(path !== '/' ? [{ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: crumbs.map((item,index) => ({ '@type': 'ListItem', position: index+1, name: item.name, item: item.url })) }] : []),
    ...services.map(service => ({ '@type': 'Service', '@id': `${new URL(service.href, SITE_URL).href}#service`, name: service.title, description: service.description, url: new URL(service.href,SITE_URL).href, provider: {'@id': organizationId}, areaServed: { '@type': 'City', name: 'São Paulo' }, mainEntityOfPage: {'@id': pageId} })),
  ] };
}
