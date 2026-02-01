import { createClient } from '@/utils/supabase/server';
import { CardPreview } from '@/components/card/CardPreview';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) return { title: 'Perfil não encontrado' };

  const name = profile.name || params.username;
  const title = profile.seo_title || `${name} | ConnectCard Profissional`;
  const description = profile.seo_description || profile.tagline || `Confira o cartão de visita digital de ${name}. Contato via WhatsApp, redes sociais e serviços.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
      type: 'profile',
      url: `https://connectcard.io/${params.username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.photo_url ? [profile.photo_url] : [],
    },
    alternates: {
      canonical: `https://connectcard.io/${params.username}`,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!profile) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background based on user theme */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundColor: profile.theme_color || '#3b82f6' }} />
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse-slow"
           style={{ backgroundColor: profile.theme_color || '#3b82f6' }} />
      
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-10 animate-pulse-slow"
           style={{ backgroundColor: profile.theme_color || '#3b82f6' }} />

      <div className="relative w-full max-w-md py-12">
        <CardPreview
          data={profile}
          showBranding={profile.plan !== 'pro'}
        />

        {/* Floating conversion for the platform */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-xs font-bold text-muted-foreground hover:text-primary transition-all bg-white dark:bg-slate-900 shadow-xl px-6 py-3 rounded-2xl border border-border/50"
          >
            Quero um cartão profissional como este
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase">Grátis</span>
          </Link>
          
          <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-[0.2em]">
            Digital • Sustentável • Conversão
          </p>
        </div>
      </div>
    </div>
  );
}
