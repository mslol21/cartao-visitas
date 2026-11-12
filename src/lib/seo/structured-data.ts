import { SITE_URL, SOCIAL_IMAGE } from './site';

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const areaServed = [
  { '@type': 'Country', name: 'Brasil' },
  { '@type': 'AdministrativeArea', name: 'São Paulo', containedInPlace: { '@type': 'Country', name: 'Brasil' } },
];

export function generateOrganizationSchema() {
  return { '@context': 'https://schema.org', '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': organizationId,
      name: 'Konnexy',
      alternateName: 'Konnexy Web',
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', '@id': `${SITE_URL}/#logo`, url: `${SITE_URL}/images/koi_hero.png`, width: 1024, height: 1024 },
      image: SOCIAL_IMAGE.url,
      description: 'Empresa de tecnologia e presença digital que desenvolve sites, otimiza presença no Google, gerencia tráfego pago e cria sistemas web, catálogos, cardápios digitais, NFC e QR Code para pequenos negócios.',
      slogan: 'Conecta • Organiza • Vende',
      areaServed,
      knowsAbout: [
        'Criação de sites',
        'SEO técnico',
        'SEO local',
        'Perfil da Empresa no Google',
        'Google Ads',
        'Meta Ads',
        'Sistemas web',
        'PDV',
        'Agendamento online',
        'Cardápio digital',
        'Catálogo digital',
        'NFC',
        'QR Code',
      ],
      sameAs: ['https://www.instagram.com/konnexy.web'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+55 16 99155-1200',
        contactType: 'sales',
        availableLanguage: ['pt-BR'],
        areaServed: 'BR',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Soluções digitais Konnexy',
        itemListElement: [
          'Criação de sites',
          'Otimização do Perfil da Empresa no Google',
          'Gestão de tráfego pago',
          'Sistemas web',
          'Catálogos e cardápios digitais',
          'Link profissional',
          'NFC e QR Code',
        ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: 'Konnexy',
      description: 'Soluções digitais para presença, atendimento, vendas e operação de pequenos negócios.',
      inLanguage: 'pt-BR',
      publisher: { '@id': organizationId },
    },
  ] };
}

export function generatePageGraph({ title, description, path, services = [], faq = [] }: {
  title: string;
  description: string;
  path: string;
  services?: readonly { title: string; description: string; href: string }[];
  faq?: readonly { question: string; answer: string }[];
}) {
  const url = new URL(path, SITE_URL).href;
  const pageId = `${url}#webpage`;
  const crumbs = [{ name: 'Konnexy', url: `${SITE_URL}/` }];
  if (path.startsWith('/servicos')) crumbs.push({ name: 'Serviços', url: `${SITE_URL}/servicos` });
  else if (path !== '/') crumbs.push({ name: title, url });
  if (path.startsWith('/servicos/')) crumbs.push({ name: title, url });

  return { '@context': 'https://schema.org', '@graph': [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url,
      name: title,
      description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      publisher: { '@id': organizationId },
      primaryImageOfPage: { '@type': 'ImageObject', url: SOCIAL_IMAGE.url, width: 1200, height: 630 },
      ...(path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      ...(faq.length ? { mainEntity: { '@id': `${url}#faq` } } : {}),
    },
    ...(path !== '/' ? [{
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    }] : []),
    ...services.map(service => ({
      '@type': 'Service',
      '@id': `${new URL(service.href, SITE_URL).href}#service`,
      name: service.title,
      description: service.description,
      url: new URL(service.href, SITE_URL).href,
      provider: { '@id': organizationId },
      areaServed,
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: new URL(service.href, SITE_URL).href,
        availableLanguage: { '@type': 'Language', name: 'Português', alternateName: 'pt-BR' },
      },
      mainEntityOfPage: { '@id': pageId },
    })),
    ...(faq.length ? [{
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    }] : []),
  ] };
}
