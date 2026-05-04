"use client";

import { ProfileClientWrapper } from '@/components/card/ProfileClientWrapper';
import { Profile } from '@/types/profile';

const streetupProfile: Profile = {
  id: 'demo-streetup',
  user_id: 'demo',
  username: 'streetup',
  business_name: 'StreetUp Brindes',
  name: 'StreetUp Brindes',
  profession: 'Brindes Corporativos de Luxo',
  subtitle: 'A excelência em personalização para sua marca',
  tagline: 'Soluções Premium em Brindes & Identidade Corporativa',
  bio_profissional: 'Especialistas em transformar objetos em experiências memoráveis. Atendemos empresas que buscam elevar sua marca através de brindes sofisticados e exclusivos.',
  whatsapp: '5516997331462',
  whatsapp_message: 'Olá StreetUp! Desejo consultar o catálogo de brindes corporativos premium.',
  instagram: 'streetuppersonalizados',
  website: 'https://streetupbrindes.com/',
  plano: 'pro',
  plan: 'pro',
  ativo: true,
  theme_color: '#D4AF37', // Gold Premium
  theme_style: 'oled',
  photo_url: 'https://streetupbrindes.com/wp-content/uploads/2023/10/logo-street-up-300x300.png',
  background_video_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=2070&auto=format&fit=crop', // Workshop sofisticado
  servicos: [
    { nome: 'Linha Executive Gold', descricao: 'Itens exclusivos com acabamento em metal nobre.', preco: 'Consultar' },
    { nome: 'Kits Welcome Premium', descricao: 'A primeira impressão perfeita para novos parceiros.', preco: 'Consultar' },
    { nome: 'Copo Térmico Personalizado', descricao: 'Gravação a laser permanente de alta definição.', preco: 'A partir de R$ 95' },
    { nome: 'Papelaria Boutique', descricao: 'Cadernos Moleskine com logo em baixo relevo.', preco: 'Consultar' }
  ],
  diferenciais: [
    'Atendimento Consultivo Exclusivo',
    'Curadoria de Produtos Premium',
    'Logística e Distribuição Nacional',
    'Qualidade Rigorosa de Acabamento'
  ],
  custom_fields: {
    cor_fundo: '#000000',
    cor_texto: '#FFFFFF',
    cor_botoes: '#D4AF37',
    cor_texto_botoes: '#000000',
    portfolio_images: [
      'https://images.unsplash.com/photo-1549463327-34033b404d7e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop'
    ],
    aceita_cartao: true,
    desconto_pix: true,
    envio_nacional: true,
    atendimento_humano: true,
    garantia_troca: true,
    alto_padrao: true
  },
  cta_text: 'Fazer Orçamento',
  font_family: 'Inter',
  is_founder: false,
  role: 'user',
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  has_physical_location: false,
  area_atendimento: 'Brasil',
  tipo_atendimento: 'Online / Entrega',
  horario_funcionamento: 'Segunda a Sexta: 08h às 18h'
} as Profile;

export default function StreetUpDemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] p-6 relative overflow-hidden">
      <ProfileClientWrapper profile={streetupProfile} themeColor="#FF0000" />
      
      {/* Botão para voltar à landing page */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <a 
          href="/" 
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white font-bold uppercase tracking-widest transition-all"
        >
          Criado com Konnexy
        </a>
      </div>
    </div>
  );
}
