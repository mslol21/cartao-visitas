import { MusicTemplateId, MusicPlatformId } from '@/types/music';

export interface MusicPlatformDefinition {
  id: MusicPlatformId;
  name: string;
  brandColor: string;
  badgeBg: string;
  hoverBg: string;
  domainUrlHint: string;
  iconName: string;
}

export const MUSIC_PLATFORMS: Record<MusicPlatformId, MusicPlatformDefinition> = {
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    brandColor: '#1DB954',
    badgeBg: 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30',
    hoverBg: 'hover:bg-[#1DB954]/20 hover:border-[#1DB954]/60',
    domainUrlHint: 'open.spotify.com',
    iconName: 'Spotify'
  },
  apple_music: {
    id: 'apple_music',
    name: 'Apple Music',
    brandColor: '#FA243C',
    badgeBg: 'bg-[#FA243C]/10 text-[#FA243C] border-[#FA243C]/30',
    hoverBg: 'hover:bg-[#FA243C]/20 hover:border-[#FA243C]/60',
    domainUrlHint: 'music.apple.com',
    iconName: 'Apple'
  },
  deezer: {
    id: 'deezer',
    name: 'Deezer',
    brandColor: '#A238FF',
    badgeBg: 'bg-[#A238FF]/10 text-[#A238FF] border-[#A238FF]/30',
    hoverBg: 'hover:bg-[#A238FF]/20 hover:border-[#A238FF]/60',
    domainUrlHint: 'deezer.com',
    iconName: 'Deezer'
  },
  youtube_music: {
    id: 'youtube_music',
    name: 'YouTube Music',
    brandColor: '#FF0000',
    badgeBg: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
    hoverBg: 'hover:bg-[#FF0000]/20 hover:border-[#FF0000]/60',
    domainUrlHint: 'music.youtube.com',
    iconName: 'PlayCircle'
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    brandColor: '#FF0000',
    badgeBg: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30',
    hoverBg: 'hover:bg-[#FF0000]/20 hover:border-[#FF0000]/60',
    domainUrlHint: 'youtube.com',
    iconName: 'Youtube'
  },
  amazon_music: {
    id: 'amazon_music',
    name: 'Amazon Music',
    brandColor: '#00A8E1',
    badgeBg: 'bg-[#00A8E1]/10 text-[#00A8E1] border-[#00A8E1]/30',
    hoverBg: 'hover:bg-[#00A8E1]/20 hover:border-[#00A8E1]/60',
    domainUrlHint: 'music.amazon.com',
    iconName: 'Radio'
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    brandColor: '#FF5500',
    badgeBg: 'bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/30',
    hoverBg: 'hover:bg-[#FF5500]/20 hover:border-[#FF5500]/60',
    domainUrlHint: 'soundcloud.com',
    iconName: 'CloudRain'
  },
  bandcamp: {
    id: 'bandcamp',
    name: 'Bandcamp',
    brandColor: '#1DA0C3',
    badgeBg: 'bg-[#1DA0C3]/10 text-[#1DA0C3] border-[#1DA0C3]/30',
    hoverBg: 'hover:bg-[#1DA0C3]/20 hover:border-[#1DA0C3]/60',
    domainUrlHint: 'bandcamp.com',
    iconName: 'Disc'
  },
  mixcloud: {
    id: 'mixcloud',
    name: 'Mixcloud',
    brandColor: '#5000FF',
    badgeBg: 'bg-[#5000FF]/10 text-[#5000FF] border-[#5000FF]/30',
    hoverBg: 'hover:bg-[#5000FF]/20 hover:border-[#5000FF]/60',
    domainUrlHint: 'mixcloud.com',
    iconName: 'Radio'
  },
  tidal: {
    id: 'tidal',
    name: 'TIDAL',
    brandColor: '#000000',
    badgeBg: 'bg-zinc-800 text-white border-zinc-700',
    hoverBg: 'hover:bg-zinc-700',
    domainUrlHint: 'tidal.com',
    iconName: 'Waves'
  },
  custom: {
    id: 'custom',
    name: 'Plataforma',
    brandColor: '#6366F1',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    hoverBg: 'hover:bg-indigo-500/20 hover:border-indigo-500/60',
    domainUrlHint: '',
    iconName: 'ExternalLink'
  }
};

export interface MusicTemplateMetadata {
  id: MusicTemplateId;
  name: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  accentClass: string;
  cardBg: string;
  recommendedFor: string[];
}

export const MUSIC_TEMPLATES: Record<MusicTemplateId, MusicTemplateMetadata> = {
  elegance: {
    id: 'elegance',
    name: 'Elegance',
    subtitle: 'Clássico, Cerimônias e Casamentos',
    description: 'Estética refinada em preto, champanhe e dourado discreto. Perfeito para casamentos, música clássica e eventos corporativos de alto padrão.',
    primaryColor: '#eab308', // Gold / Champagne
    secondaryColor: '#fef08a',
    fontFamily: 'serif',
    accentClass: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
    cardBg: 'bg-zinc-950/90 border-amber-500/20',
    recommendedFor: ['Casamentos', 'Cerimônias Religiosas', 'Música Instrumental', 'Música Clássica', 'Eventos Corporativos']
  },
  stage: {
    id: 'stage',
    name: 'Stage',
    subtitle: 'Bandas, Shows e Palco',
    description: 'Fundo ultra escuro, alto contraste, energia marcante e tipografia expressiva para quem vive na estrada e nos palcos.',
    primaryColor: '#ef4444', // Crimson / Electric Red
    secondaryColor: '#f43f5e',
    fontFamily: 'sans',
    accentClass: 'text-red-400 border-red-500/40 bg-red-500/10',
    cardBg: 'bg-zinc-950/95 border-red-500/20',
    recommendedFor: ['Bandas de Rock', 'Pop / Shows', 'Festivais', 'Grupos Musicais', 'Cantores de Palco']
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    subtitle: 'DJs, Eletrônica e Produtores',
    description: 'Estética futurista e imersiva com preto profundo, roxo elétrico, ciano e gradientes luminosos elegantes.',
    primaryColor: '#8b5cf6', // Electric Purple
    secondaryColor: '#06b6d4', // Electric Cyan
    fontFamily: 'sans',
    accentClass: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    cardBg: 'bg-zinc-950/90 border-purple-500/20',
    recommendedFor: ['DJs', 'Produtores Musicais', 'Música Eletrônica', 'Trap / Hip Hop', 'Baladas']
  },
  acoustic: {
    id: 'acoustic',
    name: 'Acoustic',
    subtitle: 'Voz e Violão, MPB e Autoral',
    description: 'Tons terrosos, bege, madeira e visual minimalista e orgânico. Ideal para MPB, folk, pop leve e voz e violão.',
    primaryColor: '#d97706', // Warm Amber / Earth
    secondaryColor: '#f59e0b',
    fontFamily: 'sans',
    accentClass: 'text-amber-200 border-amber-600/30 bg-amber-950/20',
    cardBg: 'bg-stone-950/90 border-stone-800',
    recommendedFor: ['MPB', 'Voz e Violão', 'Cantores Independentes', 'Jazz / Bossa Nova', 'Cafés e Bares']
  }
};

export const MUSIC_DEFAULT_EVENT_TYPES = [
  'Casamentos',
  'Cerimônias Religiosas',
  'Aniversários & 15 Anos',
  'Eventos Corporativos',
  'Bares & Restaurantes',
  'Festivais & Feiras',
  'Shows Particulares',
  'Recepções & Coquetéis'
];

export const MUSIC_PLANS = {
  music: {
    id: 'music',
    name: 'Konnexy Music',
    priceMonthly: 14.90,
    priceYearly: 149.00,
    features: [
      'Perfil artístico profissional',
      'Links oficiais de streaming',
      'Redes sociais integradas',
      'Botão direto para WhatsApp',
      'QR Code estilizado para palco e cartazes',
      'Template básico de alta conversão'
    ]
  },
  music_pro: {
    id: 'music_pro',
    name: 'Konnexy Music Pro',
    priceMonthly: 29.90,
    priceYearly: 299.00,
    features: [
      'Todos os recursos do Konnexy Music',
      '4 Templates Premium (Elegance, Stage, Neon, Acoustic)',
      'Discografia completa com player embutido',
      'Smart Links individuais por lançamento',
      'Galeria de vídeos de apresentações com player',
      'Repertório interativo para eventos com filtros',
      'Agenda de shows com eventos públicos e privados',
      'Botão destacado "Contratar para Eventos"',
      'Estatísticas avançadas com cliques por plataforma',
      'Personalização visual avançada e ordem das seções'
    ]
  },
  assisted_setup: {
    id: 'assisted_setup',
    name: 'Implantação Assistida',
    priceOneTime: 197.00,
    description: 'Configuração profissional completa feita pelos especialistas da Konnexy: montagem de biografia, cadastro de discografia, vídeos e repertório.'
  }
};

export const DEFAULT_MUSIC_HIRE_MESSAGE =
  'Olá! Conheci seu trabalho pelo seu portfólio Konnexy e gostaria de informações sobre disponibilidade e valores para uma apresentação.';
