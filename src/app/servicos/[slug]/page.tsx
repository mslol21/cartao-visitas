import { pageMetadata } from "@/lib/seo/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { generatePageGraph } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const services = {
  "criacao-de-sites": {
    title: "Criação de Sites Profissionais em São Paulo",
    metaTitle: "Criação de Sites Profissionais em São Paulo",
    description: "Sites profissionais, responsivos e rápidos para empresas e prestadores de serviço. Atendimento em São Paulo e online para todo o Brasil.",
    h1: "Criação de sites profissionais para empresas que querem ser encontradas e gerar contatos",
    intro: "A Konnexy desenvolve sites rápidos, responsivos e preparados para apresentar sua empresa com clareza, fortalecer sua presença no Google e transformar visitantes em contatos pelo WhatsApp.",
    benefits: ["Site responsivo para celular, tablet e computador", "Estrutura pensada para SEO e indexação no Google", "Integração com WhatsApp e formulários", "Domínio próprio e certificado SSL", "Layout personalizado para a identidade do negócio"],
    audience: "Empresas, profissionais liberais, clínicas, lojas, prestadores de serviço e negócios locais.",
    keywords: ["criação de sites", "site profissional", "criação de site em São Paulo", "desenvolvimento de sites", "site para empresa", "web designer São Paulo"]
  },
  "otimizacao-perfil-google": {
    title: "Otimização do Perfil da Empresa no Google",
    metaTitle: "Otimização do Perfil da Empresa no Google e Maps",
    description: "Organização e otimização do Perfil da Empresa no Google para melhorar presença nas buscas locais e no Google Maps.",
    h1: "Otimização do Perfil da Empresa no Google para negócios locais",
    intro: "Organizamos categorias, serviços, descrição, fotos, contatos e informações do seu perfil para que clientes entendam melhor o que sua empresa oferece e encontrem caminhos claros para ligar, pedir rota ou chamar no WhatsApp.",
    benefits: ["Revisão das informações comerciais", "Categorias e serviços organizados", "Descrição estratégica do negócio", "Orientação para fotos e avaliações", "Ajustes de contato, site, horário e área atendida"],
    audience: "Comércios locais, clínicas, restaurantes, oficinas, salões, lojas e prestadores de serviço.",
    keywords: ["otimização Google Meu Negócio", "Perfil da Empresa no Google", "Google Maps empresa", "SEO local", "aparecer no Google", "otimização perfil Google"]
  },
  "trafego-pago": {
    title: "Gestão de Tráfego Pago e Google Ads",
    metaTitle: "Gestão de Tráfego Pago e Google Ads em São Paulo",
    description: "Campanhas de Google Ads e Meta Ads com foco em gerar contatos, pedidos e oportunidades para empresas e negócios locais.",
    h1: "Tráfego pago para colocar sua oferta diante de quem tem potencial de comprar",
    intro: "A Konnexy planeja campanhas de mídia paga conectando anúncio, página e atendimento. O objetivo é levar pessoas qualificadas para sua oferta e acompanhar os resultados de forma clara.",
    benefits: ["Planejamento de campanhas", "Google Ads e Meta Ads", "Segmentação por região e público", "Acompanhamento de conversões", "Otimização contínua conforme desempenho"],
    audience: "Empresas e profissionais que já possuem uma oferta clara e querem ampliar alcance e captação.",
    keywords: ["gestão de tráfego pago", "Google Ads", "Meta Ads", "tráfego pago São Paulo", "anúncios Google", "gestor de tráfego"]
  },
  "sistemas-web": {
    title: "Desenvolvimento de Sistemas Web Sob Medida",
    metaTitle: "Desenvolvimento de Sistemas Web Sob Medida",
    description: "Sistemas web personalizados para agenda, pedidos, orçamento, estoque, PDV, ordem de serviço e gestão de processos.",
    h1: "Sistemas web sob medida para organizar processos e reduzir tarefas manuais",
    intro: "Desenvolvemos soluções digitais de acordo com a operação do negócio, criando fluxos mais simples para atendimento, vendas, estoque, agenda, orçamento e gestão.",
    benefits: ["Painéis administrativos", "Agendamento e atendimento", "PDV e controle de estoque", "Orçamentos e ordens de serviço", "Integrações e automações conforme o projeto"],
    audience: "Pequenas e médias empresas que precisam organizar processos sem depender de planilhas e tarefas repetitivas.",
    keywords: ["sistema web personalizado", "desenvolvimento de sistema", "sistema para empresa", "PDV online", "sistema de estoque", "automação empresarial"]
  },
  "link-profissional": {
    title: "Link Profissional para Empresas e Profissionais",
    metaTitle: "Link Profissional com WhatsApp, Redes e Portfólio",
    description: "Página profissional em um único link com WhatsApp, localização, redes sociais, serviços, portfólio e informações do negócio.",
    h1: "Seu negócio inteiro em um único link profissional",
    intro: "Reúna os principais canais da sua empresa em uma página personalizada para compartilhar no WhatsApp, Instagram, cartão de visita, QR Code ou NFC.",
    benefits: ["WhatsApp direto", "Localização e redes sociais", "Serviços e portfólio", "Formas de pagamento", "Página personalizada para sua marca"],
    audience: "Profissionais, prestadores de serviço, lojas, consultores e pequenos negócios.",
    keywords: ["link profissional", "link para bio", "cartão digital", "página profissional", "link WhatsApp Instagram", "cartão de visita digital"]
  },
  "catalogo-cardapio-digital": {
    title: "Catálogo e Cardápio Digital com WhatsApp",
    metaTitle: "Catálogo e Cardápio Digital com Pedidos no WhatsApp",
    description: "Catálogo e cardápio digital para organizar produtos e receber pedidos pelo WhatsApp de forma simples e profissional.",
    h1: "Catálogo e cardápio digital para facilitar pedidos e apresentar seus produtos",
    intro: "Organize produtos, serviços, categorias e informações em uma vitrine digital acessível por link ou QR Code, facilitando a escolha do cliente e o envio do pedido para o WhatsApp.",
    benefits: ["Categorias e produtos organizados", "Pedidos direcionados ao WhatsApp", "Acesso por link e QR Code", "Layout responsivo", "Atualização de produtos e informações"],
    audience: "Lojas, restaurantes, lanchonetes, adegas, moda, presentes, artesanato e delivery.",
    keywords: ["catálogo digital", "cardápio digital", "catálogo WhatsApp", "cardápio WhatsApp", "vitrine digital", "pedidos pelo WhatsApp"]
  },
  "nfc-qr-code": {
    title: "NFC e QR Code para Empresas",
    metaTitle: "Placa NFC e QR Code para Google, WhatsApp e Links",
    description: "Soluções NFC e QR Code para avaliações no Google, WhatsApp, cardápios, catálogos e páginas profissionais.",
    h1: "Conecte o atendimento físico ao digital com NFC e QR Code",
    intro: "Criamos experiências simples para o cliente aproximar o celular ou escanear um QR Code e acessar avaliações, contatos, WhatsApp, cardápios, catálogos ou páginas profissionais.",
    benefits: ["Acesso por aproximação NFC", "QR Code personalizado", "Avaliações no Google", "Atalhos para WhatsApp e redes sociais", "Conteúdo atualizável conforme a solução"],
    audience: "Lojas, balcões, recepções, restaurantes, clínicas, profissionais e eventos.",
    keywords: ["placa NFC", "QR Code empresa", "NFC Google avaliações", "QR Code WhatsApp", "placa para avaliação Google", "NFC para empresas"]
  }
} as const;

type ServiceSlug = keyof typeof services;

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];
  if (!service) return { title: "Serviço não encontrado" };

  return pageMetadata(`${service.metaTitle} | Konnexy`, service.description, `/servicos/${slug}`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];
  if (!service) notFound();

  const schema = generatePageGraph({ title: service.title, description: service.description, path: `/servicos/${slug}`, services: [{ title: service.title, description: service.description, href: `/servicos/${slug}` }] });

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <StructuredData data={schema} />
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <Link href="/" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">← Konnexy</Link>
        <div className="mt-8 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Solução Konnexy</span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{service.h1}</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{service.intro}</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {service.benefits.map((benefit) => (
            <div key={benefit} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
              <span className="text-sm font-semibold text-slate-200">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-violet-400/20 bg-violet-500/[0.06] p-7">
          <h2 className="text-2xl font-black">Para quem esta solução é indicada?</h2>
          <p className="mt-3 leading-relaxed text-slate-300">{service.audience}</p>
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-3xl font-black">Solução digital com foco em presença, atendimento e resultado</h2>
          <p className="mt-5 leading-relaxed text-slate-300">
            Cada projeto da Konnexy começa com uma análise do negócio. A proposta é indicar a solução adequada ao momento da empresa, integrar os principais canais de contato e entregar uma estrutura profissional que possa evoluir conforme a operação cresce.
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">
            O atendimento pode ser realizado em São Paulo e também de forma online para outras regiões do Brasil.
          </p>
        </section>

        <div className="mt-14 flex flex-wrap gap-4">
          <a
            href="https://wa.me/5516991551200?text=Olá,%20vi%20uma%20solução%20no%20site%20da%20Konnexy%20e%20quero%20entender%20como%20funciona."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 transition hover:brightness-110"
          >
            Solicitar análise <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/servicos" className="inline-flex items-center rounded-2xl border border-white/15 px-6 py-4 text-sm font-bold text-white hover:bg-white/5">
            Ver todos os serviços
          </Link>
        </div>
      </section>
    </main>
  );
}
