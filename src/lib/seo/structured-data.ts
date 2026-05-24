export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Konnexy',
    url: 'https://konnexy.com.br',
    logo: 'https://konnexy.com.br/logo.png',
    description: 'Plataforma de catálogo digital e organização de pedidos pelo WhatsApp para pequenos varejistas',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Portuguese'],
    },
    sameAs: [
      // Adicione aqui as redes sociais da empresa quando disponíveis
      // 'https://www.instagram.com/konnexy',
      // 'https://www.facebook.com/konnexy',
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
        name: 'Plano Gratuito',
        price: '0',
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Plano PRO',
        price: '49',
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
