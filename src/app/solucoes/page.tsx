import { seoIntentPages } from "@/config/seo-intent-pages";
import { pageMetadata } from "@/lib/seo/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { generatePageGraph } from "@/lib/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Soluções digitais por necessidade | Konnexy",
  "Encontre soluções da Konnexy por objetivo: criar site, melhorar SEO local, otimizar Google, organizar loja, usar PDV ou cardápio digital.",
  "/solucoes"
);

export default function SolutionsIndexPage() {
  const entries = Object.entries(seoIntentPages);

  return (
    <main className="min-h-screen bg-[#050711] text-white">
      <StructuredData data={generatePageGraph({
        title: "Soluções digitais por necessidade",
        description: "Soluções da Konnexy organizadas por necessidade e intenção de busca.",
        path: "/solucoes"
      })} />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Link href="/" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">← Konnexy</Link>
        <div className="mt-8 max-w-4xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Encontre pela necessidade</span>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Soluções digitais para problemas reais do pequeno negócio</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            Escolha o objetivo mais próximo do que você precisa. Cada página explica o problema, a solução e o que pode fazer parte da entrega.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {entries.map(([slug, page]) => (
            <Link
              key={slug}
              href={`/solucoes/${slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.04]"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{page.intent}</p>
              <h2 className="mt-3 text-2xl font-black">{page.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{page.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                Ver solução <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
