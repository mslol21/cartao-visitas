'use client';

import { NeonGradientCard, type NeonColorsProps } from '@/components/tag/NeonGradientCard';
import type { Profile } from '@/types/profile';
import { KONNEXY_PORTFOLIO } from '@/config/konnexy-projects';

function safeUrl(value: string): string | undefined {
  const trimmed = value.trim();
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function PublicProfileDetails({ profile, isMassami, neonColors }: { profile?: Profile | null; isMassami: boolean; neonColors: NeonColorsProps }) {
  const secondary = profile?.whatsapp_secondary?.replace(/\D/g, '');
  const secondaryPhone = secondary && !secondary.startsWith('55') ? `55${secondary}` : secondary;
  const projects = isMassami ? [
    { name: 'Konnexy Menu', category: 'Cardápio e pedidos', href: 'https://menu.konnexy.com.br/' },
    { name: 'Konnexy Agenda', category: 'Agendamentos', href: 'https://agenda.konnexy.com.br/' },
    { name: 'Konnexy PDV', category: 'Vendas e estoque', href: 'https://pdv.konnexy.com.br/' },
    { name: 'Konnexy Tag', category: 'NFC e QR Code', href: 'https://tag.konnexy.com.br/' },
    { name: 'Konnexy OS Auto', category: 'Gestão automotiva', href: 'https://osauto.konnexy.com.br/' },
    { name: 'Vitriniza', category: 'Comércio local', href: 'https://vitriniza.konnexy.com.br/' },
    { name: 'KonnexyFé', category: 'Comunidades de fé', href: 'https://konnexyfe.vercel.app/' },
    { name: 'Feito de Nós', category: 'Convites e presentes', href: 'https://feitos-de-nos.vercel.app/' },
    ...KONNEXY_PORTFOLIO,
  ] : [];

  return (
    <>
      {projects.length > 0 && (
        <NeonGradientCard borderRadius={24} borderSize={2} neonColors={neonColors}>
          <section aria-label="Portfólio de projetos">
            <h2 className="text-lg font-bold text-white">Portfólio de projetos</h2>
            <p className="mt-2 text-sm text-zinc-300">Conheça os projetos e demonstrações da Konnexy.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {projects.map(project => (
                <a
                  key={project.href}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-white transition hover:border-cyan-300 focus-visible:outline focus-visible:outline-cyan-300"
                >
                  <span className="block text-xs text-cyan-200">{project.category}</span>
                  <span className="mt-1 block font-semibold">{project.name}</span>
                  <span className="mt-3 block text-sm text-zinc-300">Visualizar projeto ↗</span>
                </a>
              ))}
            </div>
          </section>
        </NeonGradientCard>
      )}

      {!isMassami && (secondaryPhone || profile?.twitter) && (
        <NeonGradientCard borderRadius={24} borderSize={2} neonColors={neonColors}>
          <section aria-label="Contatos adicionais" className="space-y-3">
            {secondaryPhone && (
              <a
                className="flex min-h-11 items-center text-sm font-semibold text-emerald-200 underline"
                href={`https://wa.me/${secondaryPhone}?text=${encodeURIComponent(profile?.whatsapp_secondary_message || '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp adicional: {profile?.whatsapp_secondary}
              </a>
            )}
            {profile?.twitter && safeUrl(profile.twitter.startsWith('http') ? profile.twitter : `https://x.com/${profile.twitter.replace('@', '')}`) && (
              <a
                className="block text-sm text-cyan-200 underline"
                href={safeUrl(profile.twitter.startsWith('http') ? profile.twitter : `https://x.com/${profile.twitter.replace('@', '')}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                X / Twitter
              </a>
            )}
          </section>
        </NeonGradientCard>
      )}
    </>
  );
}
