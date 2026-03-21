// Types for the new profession structure
export type ProfessionCategory = 
  | 'barbearia' 
  | 'manicure' 
  | 'cabeleireiro' 
  | 'personal_trainer' 
  | 'advogado' 
  | 'psicologo' 
  | 'designer' 
  | 'fotografo' 
  | 'tecnico_informatica' 
  | 'esteticista'
  | 'pedreiro'
  | 'mecanico'
  | 'eletricista'
  | 'encanador'
  | 'diarista'
  | 'frete'
  | 'ar_condicionado'
  | 'montador_moveis'
  | 'gesseiro'
  | 'vidraceiro'
  | 'pintor'
  | 'serralheiro'
  | 'marceneiro'
  | 'assistencia_celular'
  | 'quentinhas'
  | 'beauty'
  | 'health'
  | 'sales'
  | 'food'
  | 'tech'
  | 'real_estate'
  | 'driver'
  | 'petshop'
  | 'veterinario'
  | 'artesao'
  | 'service'
  | 'musico'
  | 'van_escolar'
  | 'guia_turistico'
  | 'mestre_de_obras'
  | 'loja_online'
  | 'area_lazer'
  | 'pizzaria'
  | 'default';

export interface Service {
  nome: string;
  descricao?: string;
  preco?: string;
  duracao?: string;
}

export interface CustomFields {
  // Cores personalizadas
  cor_fundo?: string;
  cor_texto?: string;
  cor_botoes?: string;
  cor_texto_botoes?: string;
  
  // QR Code Customization
  cor_qr_fundo?: string;
  cor_qr_pontos?: string;
  cor_qr_cantos_quadrado?: string;
  cor_qr_cantos_ponto?: string;
  
  // Pagamentos
  chave_pix?: string;
  tipo_chave_pix?: string;
  
  // Barbearia / Cabeleireiro
  aceita_agendamento?: boolean;
  trabalha_com_horario_marcado?: boolean;
  atende_noiva?: boolean;
  especialista_loiras?: boolean;
  atendimento_kids?: boolean;
  dia_do_noivo?: boolean;
  quimica_relaxamento?: boolean;
  produtos_venda?: boolean;
  massagem_facial?: boolean;
  lavagem_especial?: boolean;
  dia_da_noiva?: boolean;
  mechas_luzes?: boolean;
  progressiva_botox?: boolean;
  penteados?: boolean;
  cronograma_capilar?: boolean;
  // Manicure / Estética
  atende_domicilio?: boolean;
  procedimentos?: string[];
  unhas_fibra?: boolean;
  unhas_gel?: boolean;
  blindagem?: boolean;
  spa_pes_maos?: boolean;
  limpeza_pele?: boolean;
  drenagem_linfatica?: boolean;
  massagem_relaxante?: boolean;
  micropigmentacao?: boolean;
  extensao_cilios?: boolean;
  design_sobrancelhas?: boolean;
  // Personal Trainer
  atende_em_academia?: boolean;
  online?: boolean;
  // Advogado
  especialidades?: string[];
  numero_oab?: string;
  // Psicólogo
  abordagem_terapeutica?: string;
  atendimento_online?: boolean;
  // Fotógrafo / Designer / Tech
  tipo_eventos?: string[];
  entrega_digital?: boolean;
  tipos_de_servico?: string[];
  // Músico
  estilo_musical?: string;
  spotify_link?: string;
  youtube_link?: string;
  suporte_remoto?: boolean;
  atende_empresas?: boolean;
  remoto_presencial?: string;
  stack?: string[];
  // Construção / Manutenção
  trabalha_com_reforma?: boolean;
  anos_experiencia?: string;
  nr10_ativo?: boolean;
  atendimento_emergencial?: boolean;
  caca_vazamento?: boolean;
  leva_produtos?: boolean;
  faxina_pos_obra?: boolean;
  possu_ajudante?: boolean;
  instalacao_higienizacao?: boolean;
  ferramentas_proprias?: boolean;
  faz_sanca?: boolean;
  drywall?: boolean;
  vidro_temperado?: boolean;
  box_banheiro?: boolean;
  pintura_residencial?: boolean;
  pintura_comercial?: boolean;
  trabalha_aluminio?: boolean;
  trabalha_ferro?: boolean;
  moveis_planejados?: boolean;
  leitura_projetos?: boolean;
  gerencia_equipe?: boolean;
  cronograma_obra?: boolean;
  // Automotivo / Transporte
  socorro_24h?: boolean;
  especialidade_carros?: string;
  tipo_veiculo?: string;
  atende_viagens?: boolean;
  possui_monitor?: boolean;
  bancos_reclinaveis?: boolean;
  atende_escolas?: string[];
  // Vendas / Gastronomia
  tem_delivery?: boolean;
  aceita_vr?: boolean;
  delivery_proprio?: boolean;
  retirada_local?: boolean;
  // Veterinário
  crmv?: string;
  especialidades_vet?: string[];
  plantao_24h?: boolean;
  atendimento_domicilio_vet?: boolean;

  // Imobiliário / Outros
  creci?: string;
  venda_aluguel?: string;
  banho_tosa?: boolean;
  atendimento_clinico?: boolean;
  pecas_originais?: boolean;

  // Guias de Turismo
  cadastur?: string;
  idiomas?: string[];
  veiculo_proprio?: boolean;

  // Artesão
  materiais_utilizados?: string[];
  aceita_encomendas?: boolean;
  prazo_medio_producao?: string;
  produtos_pronta_entrega?: boolean;
  
  // Área de Lazer / Eventos
  capacidade_pessoas?: string;
  possui_piscina?: boolean;
  possui_churrasqueira?: boolean;
  espaco_kids?: boolean;
  permite_som?: boolean;
  wifi_disponivel?: boolean;
  estacionamento_proprio?: boolean;
  
  // Pizzaria
  bordas_recheadas?: boolean;
  rodizio_disponivel?: boolean;
  especialista_calzones?: boolean;
  massa_artesanal?: boolean;

  // Loja Online
  envio_nacional?: boolean;
  frete_gratis?: boolean;
  link_catalogo?: string;
  aceita_encomendas?: boolean;
  atendimento_humano?: boolean;
  garantia_troca?: boolean;
  parcelamento_sem_juros?: boolean;
  desconto_pix?: boolean;
}

// Keeping old items for backwards compatibility during migration
export interface ServiceItem {
  name: string;
  icon?: string;
  price?: string;
  description?: string;
}

export interface CustomLink {
  title: string;
  url: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  
  // -- New Standard Profession Fields --
  profession: ProfessionCategory | string | null;
  business_name: string | null;
  subtitle: string | null;
  area_atendimento: string | null;
  tipo_atendimento: string | null;
  horario_funcionamento: string | null;
  whatsapp: string | null;
  instagram: string | null;
  has_physical_location: boolean;
  endereco_completo: string | null;
  bio_profissional: string | null;
  diferenciais: string[];
  servicos: Service[];
  plano: string;
  ativo: boolean;
  custom_fields: CustomFields;
  // ------------------------------------

  // Old fields (kept for migration purposes)
  name: string | null;
  tagline: string | null;
  city: string | null;
  address: string | null;
  service_area: string | null;
  services: ServiceItem[];
  plan: 'free' | 'pro' | 'fundador_local';
  billing_type: 'stripe' | 'manual';
  plan_expires_at: string | null;
  is_founder: boolean;
  category: ProfessionCategory | string | null;
  can_customize_theme: boolean;
  role: 'user' | 'admin';
  verified: boolean;
  
  // Customization mappings
  photo_url: string | null;
  linkedin: string | null;
  facebook: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  website: string | null;
  custom_links?: CustomLink[];
  cta_text: string;
  seo_title: string | null;
  seo_description: string | null;
  theme_color: string;
  theme_style: 'standard' | 'oled' | 'glass' | 'minimalist';
  font_family: string;
  expert_area: string | null;
  founded_year: number | null;
  avatar_frame: string | null;
  photo_filter: string | null;
  photo_border_effect: string | null;
  background_video_url: string | null;
  created_at: string;
  updated_at: string;
  business_hours?: Record<string, string>;
}

export interface ProfileFormData extends Partial<Profile> {
  // Can be typed based on Profile directly
}
