import { pageMetadata } from "@/lib/seo/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { generatePageGraph } from "@/lib/seo/structured-data";
import { seoIntentPages, type SeoIntentSlug } from "@/config/seo-intent-pages";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Search, Target } from "lucide-react";

export function generateStaticParams() {
  return Object.keys(seoIntentPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = seoIntentPages[slug as SeoIntentSlug];
  if (!page) return { title: "Solução não encontrada" };

  return {
    ...pageMetadata(`${page.metaTitle} | Konnexy`, page.description, `/solucoes/${slug}`),
    keywords: [page.title, page.intent, "Konnexy", "pequenos negócios", "São Paulo"],
  };
}

export default async function SeoIntentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = seoIntentPages[slug as SeoIntentSlug];
  if (!page) notFound();

  const faq = page.faq.map(([question, answer]) => ({ question, answer }));
  const schema = generatePageGraph({
    title: page.title,
    description: page.description,
    path: `/solucoes/${slug}`,
    services: [{ title: page.serviceName, description: page.description, href: `/solucoes/${slug}` }],
    faq,
  });

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <StructuredData data={schema} />
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/" className="hover:text-cyan-300">Konnexy</Link>
          <span className="mx-2">/</span>
          <Link href="/solucoes" className="hover:text-cyan-300">Soluções</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{page.title}</span>
        </nav>

        <div className="mt-10 max-w-4xl">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            <Search className="h-4 w-4" /> Solução por necessidade
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">{page.intro}</p>
          <div className="mt-7 inline-flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.05] px-5 py-4">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">Objetivo desta página</p>
              <p className="mt-1 text-sm text-slate-300">{page.intent}</p>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-black">Problemas que esta solução resolve</h2>
            <div className="mt-6 space-y-4">
              {page.problems.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-violet-400/20 bg-violet-500/[0.06] p-7">
            <h2 className="text-2xl font-black">O que pode fazer parte da entrega</h2>
            <div className="mt-6 space-y-4">
              {page.deliverables.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                  <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-3xl font-black">Como a Konnexy aborda esta necessidade</h2>
          <p className="mt-5 leading-relaxed text-slate-300">
            A proposta não é apenas instalar uma ferramenta. Primeiro entendemos como o cliente encontra o negócio, como entra em contato e como a operação funciona. A solução é então estruturada para reduzir atrito entre descoberta, atendimento e execução.
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">{page.localContext}</p>
          <Link href={page.serviceHref} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">
            Ver serviço relacionado <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-title">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Perguntas frequentes</span>
          <h2 id="faq-title" className="mt-3 text-3xl font-black">Respostas rápidas</h2>
          <div className="mt-7 space-y-4">
            {page.faq.map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer list-none font-bold text-white">{question}</summary>
                <p className="mt-3 leading-relaxed text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-7 md:p-9">
          <h2 className="text-2xl font-black">Quer avaliar esta solução no seu negócio?</h2>
          <p className="mt-3 max-w-2xl text-slate-300">Explique brevemente o que você precisa e a Konnexy identifica a estrutura mais adequada.</p>
          <a
            href="https://wa.me/5516991551200?text=Olá,%20vi%20uma%20solução%20no%20site%20da%20Konnexy%20e%20quero%20uma%20análise."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-slate-950 transition hover:brightness-110"
          >
            Solicitar análise <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
