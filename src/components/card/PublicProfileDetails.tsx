'use client';

import { NeonGradientCard, type NeonColorsProps } from '@/components/tag/NeonGradientCard';
import type { Profile } from '@/types/profile';
import { getProfessionConfig } from '@/config/professions';
import { KONNEXY_PORTFOLIO } from '@/config/konnexy-projects';

function safeUrl(value: string): string | undefined {
  const trimmed = value.trim();
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function PublicProfileDetails({ profile, isMassami, neonColors }: { profile?: Profile | null; isMassami: boolean; neonColors: NeonColorsProps }) {
  const config = getProfessionConfig(profile?.profession || profile?.category);
  const custom = profile?.custom_fields || {};
  // Only fields explicitly defined in the public editor belong on the public page.
  const fields = (config?.customFields || []).filter(field =>
    !field.name.startsWith('cor_') && !['imagem_fundo', 'portfolio_images', 'portfolio_video_url', 'chave_pix', 'tipo_chave_pix'].includes(field.name)
  ).map(field => {
    const raw = custom[field.name as keyof typeof custom];
    const value = Array.isArray(raw) ? raw.filter(Boolean).join(', ') : raw === true ? 'Sim' : raw === false || raw == null ? '' : String(raw).trim();
    return { label: field.label, value };
  }).filter(field => field.value);
  const details = [
    { label: 'Sobre', value: profile?.bio_profissional },
    { label: 'Apresentação', value: profile?.subtitle || profile?.tagline },
    { label: 'Especialidade', value: profile?.expert_area },
    { label: 'Área de atendimento', value: profile?.area_atendimento || profile?.service_area },
    { label: 'Cidade', value: profile?.city },
    { label: 'Endereço', value: profile?.endereco_completo || profile?.address },
    { label: 'Tipo de atendimento', value: profile?.tipo_atendimento },
    { label: 'Horário de funcionamento', value: profile?.horario_funcionamento },
    { label: 'Desde', value: profile?.founded_year ? String(profile.founded_year) : '' },
    { label: 'Diferenciais', value: profile?.diferenciais?.filter(Boolean).join(' • ') },
    ...fields,
  ].filter(item => item.value?.trim());
  const hours = Object.entries(profile?.business_hours || {}).filter(([, value]) => value?.trim());
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
  return <>
    {projects.length > 0 && <NeonGradientCard borderRadius={24} borderSize={2} neonColors={neonColors}>
      <section aria-label="Portfólio de projetos">
      <h2 className="text-lg font-bold text-white">Portfólio de projetos</h2>
      <p className="mt-2 text-sm text-zinc-300">Conheça os projetos e demonstrações da Konnexy.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{projects.map(project => <a key={project.href} href={project.href} target="_blank" rel="noopener noreferrer" className="min-w-0 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-white transition hover:border-cyan-300 focus-visible:outline focus-visible:outline-cyan-300"><span className="block text-xs text-cyan-200">{project.category}</span><span className="mt-1 block font-semibold">{project.name}</span><span className="mt-3 block text-sm text-zinc-300">Visualizar projeto ↗</span></a>)}</div>
    </section>
    </NeonGradientCard>}
    {!isMassami && (details.length > 0 || hours.length > 0 || secondaryPhone || profile?.twitter) && <NeonGradientCard borderRadius={24} borderSize={2} neonColors={neonColors}>
      <section aria-label="Informações do perfil">
      <h2 className="text-lg font-bold text-white">Sobre e atendimento</h2>
      <dl className="mt-4 space-y-4">{details.map((item, index) => <div key={`${item.label}-${index}`} className="min-w-0"><dt className="text-xs font-semibold text-cyan-200">{item.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-200">{item.value && /^https?:\/\//i.test(item.value) && safeUrl(item.value) ? <a className="underline" href={safeUrl(item.value)} target="_blank" rel="noopener noreferrer">{item.value}</a> : item.value}</dd></div>)}</dl>
      {hours.length > 0 && <div className="mt-5"><h3 className="text-sm font-semibold text-white">Horários por dia</h3><dl className="mt-2 space-y-2">{hours.map(([day, value]) => <div key={day} className="flex flex-wrap justify-between gap-2 text-sm text-zinc-200"><dt>{day}</dt><dd>{value}</dd></div>)}</dl></div>}
      {secondaryPhone && <a className="mt-4 flex min-h-11 items-center text-sm font-semibold text-emerald-200 underline" href={`https://wa.me/${secondaryPhone}?text=${encodeURIComponent(profile?.whatsapp_secondary_message || '')}`} target="_blank" rel="noopener noreferrer">WhatsApp adicional: {profile?.whatsapp_secondary}</a>}
      {profile?.twitter && safeUrl(profile.twitter.startsWith('http') ? profile.twitter : `https://x.com/${profile.twitter.replace('@', '')}`) && <a className="mt-3 block text-sm text-cyan-200 underline" href={safeUrl(profile.twitter.startsWith('http') ? profile.twitter : `https://x.com/${profile.twitter.replace('@', '')}`)} target="_blank" rel="noopener noreferrer">X / Twitter</a>}
    </section>
    </NeonGradientCard>}
  </>;
}
