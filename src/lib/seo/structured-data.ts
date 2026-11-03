export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://konnexy.com.br/#organization',
    name: 'Konnexy',
    url: 'https://konnexy.com.br',
    logo: 'https://konnexy.com.br/logo.png',
    image: 'https://konnexy.com.br/images/koi_hero.png',
    description: 'Soluções digitais para empresas: criação de sites, otimização do Perfil da Empresa no Google, tráfego pago, catálogos, NFC e QR Code e sistemas web sob medida.',
    telephone: '+55 16 99155-1200',
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    knowsAbout: [
      'Criação de sites',
      'SEO local',
      'Perfil da Empresa no Google',
      'Google Ads',
      'Tráfego pago',
      'Desenvolvimento de sistemas web',
      'Catálogo digital',
      'NFC',
      'QR Code',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55 16 99155-1200',
      contactType: 'customer service',
      availableLanguage: ['Portuguese'],
      areaServed: 'BR',
    },
    sameAs: [
      'https://www.instagram.com/konnexy.web',
    ],
  }
}

export function generateProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Catálogo Digital Konnexy',
    description: 'Catálogo digital profissional com carrinho de compras integrado, formas de pagamento e pedidos automatizados no WhatsApp',
    brand: {
      '@type': 'Brand',
      name: 'Konnexy',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Plano Konnexy Pro',
        price: '49.90',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
      },
    ],
  }
}

export function generateWebPageSchema(pageData: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageData.title,
    description: pageData.description,
    url: pageData.url,
    publisher: {
      '@type': 'Organization',
      name: 'Konnexy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://konnexy.com.br/logo.png',
      },
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
