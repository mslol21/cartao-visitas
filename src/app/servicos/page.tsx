import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Serviços Digitais para Empresas",
  description: "Conheça os serviços da Konnexy: criação de sites, Perfil da Empresa no Google, tráfego pago, sistemas web, catálogos, link profissional, NFC e QR Code.",
  alternates: { canonical: "https://konnexy.com.br/servicos" }
};

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
  return (
    <main className="min-h-screen bg-[#050711] text-white">
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
      </section>
    </main>
  );
}
