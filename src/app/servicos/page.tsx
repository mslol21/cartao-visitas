import { pageMetadata } from "@/lib/seo/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { generatePageGraph } from "@/lib/seo/structured-data";
import { seoIntentPages } from "@/config/seo-intent-pages";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata('Serviços digitais para empresas | Konnexy', 'Sites, presença no Google, tráfego pago, catálogos e sistemas para pequenos negócios em São Paulo.', '/servicos');

const services = [
  ["Criação de Sites Profissionais", "/servicos/criacao-de-sites", "Sites responsivos, rápidos e preparados para gerar contatos."],
  ["Otimização do Perfil da Empresa no Google", "/servicos/otimizacao-perfil-google", "Organização do perfil para melhorar presença nas buscas locais e no Maps."],
  ["Gestão de Tráfego Pago", "/servicos/trafego-pago", "Google Ads e Meta Ads conectados à sua oferta e atendimento."],
  ["Sistemas Web Sob Medida", "/servicos/sistemas-web", "Soluções para agenda, estoque, PDV, orçamento, OS e gestão."],
  ["Link Profissional", "/servicos/link-profissional", "WhatsApp, localização, redes, serviços e portfólio em um único link."],
  ["Catálogo e Cardápio Digital", "/servicos/catalogo-cardapio-digital", "Produtos e pedidos organizados com integração ao WhatsApp."],
  ["NFC e QR Code", "/servicos/nfc-qr-code", "Acesso rápido a avaliações, contatos, cardápios e páginas profissionais."]
] as const;

export default function ServicesPage() {
  const intentEntries = Object.entries(seoIntentPages);

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <StructuredData data={generatePageGraph({ title: "Serviços", description: "Serviços digitais da Konnexy", path: "/servicos" })} />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Link href="/" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">← Konnexy</Link>

        <div className="mt-8 max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Serviços Konnexy</span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Soluções digitais para empresas serem encontradas, atenderem melhor e venderem mais</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">Escolha uma solução específica ou solicite uma análise para identificar o que faz mais sentido para o seu negócio.</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map(([title, href, description]) => (
            <Link key={href} href={href} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.04]">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-cyan-300">Saiba mais →</span>
            </Link>
          ))}
        </div>

        <section className="mt-20 border-t border-white/10 pt-14">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">Busque pelo seu objetivo</span>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Não sabe o nome do serviço? Encontre pela necessidade</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              Estas páginas explicam soluções para buscas e problemas específicos, como criar um site em São Paulo, melhorar SEO local, escolher um PDV ou implantar cardápio digital.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {intentEntries.map(([slug, page]) => (
              <Link
                key={slug}
                href={`/solucoes/${slug}`}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-300"
              >
                {page.title}
              </Link>
            ))}
          </div>

          <Link href="/solucoes" className="mt-7 inline-flex text-sm font-black text-cyan-300 hover:text-cyan-200">
            Ver todas as soluções por necessidade →
          </Link>
        </section>
      </section>
    </main>
  );
}
