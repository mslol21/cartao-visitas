import { z } from 'zod';
import { ProfessionCategory } from '@/types/profile';

// Reusable base rules
export const baseProfileSchema = z.object({
  business_name: z.string().min(2, "Nome do negócio é obrigatório"),
  subtitle: z.string().optional(),
  area_atendimento: z.string().min(2, "Área de atendimento é obrigatória"),
  tipo_atendimento: z.string().min(2, "Tipo de atendimento é obrigatório"),
  horario_funcionamento: z.string().min(2, "Horário é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp é obrigatório e deve ser válido"),
  instagram: z.string().optional(),
  has_physical_location: z.boolean().default(false),
  endereco_completo: z.string().optional(),
  bio_profissional: z.string().min(120, "Bio profissional deve ter pelo menos 120 caracteres"),
  diferenciais: z.array(z.string()).default([]),
  servicos: z.array(
    z.object({
      nome: z.string().min(2, "Nome do serviço é obrigatório"),
      descricao: z.string().optional(),
      preco: z.string().optional(),
      duracao: z.string().optional(),
    })
  ).min(1, "É necessário adicionar pelo menos 1 serviço"),
}).superRefine((data, ctx) => {
  if (data.has_physical_location && (!data.endereco_completo || data.endereco_completo.length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Endereço completo é obrigatório quando há local físico",
      path: ["endereco_completo"],
    });
  }
});

// Custom fields configurations
export type FieldConfig = {
  name: string;
  label: string;
  type: 'boolean' | 'text' | 'array';
  placeholder?: string;
};

export interface ProfessionConfig {
  id: ProfessionCategory;
  label: string;
  theme: {
    color: string;
    style: 'standard' | 'oled' | 'glass' | 'minimalist';
  };
  customFields: FieldConfig[];
}

export const professionsMap: Record<ProfessionCategory, ProfessionConfig> = {
  barbearia: {
    id: 'barbearia',
    label: 'Barbearia',
    theme: { color: 'amber', style: 'oled' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'trabalha_com_horario_marcado', label: 'Horário Marcado?', type: 'boolean' }
    ]
  },
  manicure: {
    id: 'manicure',
    label: 'Manicure',
    theme: { color: 'pink', style: 'glass' },
    customFields: [
      { name: 'atende_domicilio', label: 'Atende em Domicílio?', type: 'boolean' }
    ]
  },
  cabeleireiro: {
    id: 'cabeleireiro',
    label: 'Cabeleireiro',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'atende_noiva', label: 'Atendimento Noivas / Debutantes?', type: 'boolean' },
      { name: 'especialista_loiras', label: 'Especialista em Loiras / Mechas?', type: 'boolean' }
    ]
  },
  personal_trainer: {
    id: 'personal_trainer',
    label: 'Personal Trainer',
    theme: { color: 'green', style: 'standard' },
    customFields: [
      { name: 'online', label: 'Consultoria Online?', type: 'boolean' },
      { name: 'atende_em_academia', label: 'Atende em Academias Parceiras?', type: 'boolean' }
    ]
  },
  advogado: {
    id: 'advogado',
    label: 'Advogado',
    theme: { color: 'slate', style: 'minimalist' },
    customFields: [
      { name: 'numero_oab', label: 'Número da OAB', type: 'text', placeholder: 'Ex: 123456/SP' },
      { name: 'especialidades', label: 'Especialidades', type: 'array', placeholder: 'Ex: Direito Civil' }
    ]
  },
  psicologo: {
    id: 'psicologo',
    label: 'Psicólogo',
    theme: { color: 'teal', style: 'glass' },
    customFields: [
      { name: 'abordagem_terapeutica', label: 'Abordagem Terapêutica', type: 'text', placeholder: 'Ex: TCC, Psicanálise' },
      { name: 'atendimento_online', label: 'Atendimento Online?', type: 'boolean' }
    ]
  },
  designer: {
    id: 'designer',
    label: 'Designer',
    theme: { color: 'purple', style: 'glass' },
    customFields: [
      { name: 'tipos_de_servico', label: 'Tipos de Serviços', type: 'array', placeholder: 'Ex: Identidade Visual, UI/UX' }
    ]
  },
  fotografo: {
    id: 'fotografo',
    label: 'Fotógrafo',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'tipo_eventos', label: 'Tipos de Eventos', type: 'array', placeholder: 'Ex: Casamentos, Ensaios' },
      { name: 'entrega_digital', label: 'Entrega Digital?', type: 'boolean' }
    ]
  },
  tecnico_informatica: {
    id: 'tecnico_informatica',
    label: 'Técnico de Informática',
    theme: { color: 'blue', style: 'standard' },
    customFields: [
      { name: 'suporte_remoto', label: 'Suporte Remoto?', type: 'boolean' },
      { name: 'atende_empresas', label: 'Atende Empresas?', type: 'boolean' }
    ]
  },
  esteticista: {
    id: 'esteticista',
    label: 'Esteticista',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'procedimentos', label: 'Procedimentos Principais', type: 'array', placeholder: 'Ex: Limpeza de Pele' }
    ]
  },
  pedreiro: {
    id: 'pedreiro',
    label: 'Pedreiro & Obras',
    theme: { color: 'orange', style: 'standard' },
    customFields: [
      { name: 'trabalha_com_reforma', label: 'Faz Reformas?', type: 'boolean' },
      { name: 'anos_experiencia', label: 'Anos de Experiência', type: 'text', placeholder: 'Ex: 10 anos' }
    ]
  },
  mecanico: {
    id: 'mecanico',
    label: 'Mecânico / Auto',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'socorro_24h', label: 'Socorro 24h?', type: 'boolean' },
      { name: 'especialidade_carros', label: 'Especialista em', type: 'text', placeholder: 'Ex: Câmbio, Suspensão' }
    ]
  },
  eletricista: {
    id: 'eletricista',
    label: 'Eletricista',
    theme: { color: 'amber', style: 'standard' },
    customFields: [
      { name: 'nr10_ativo', label: 'NR10 Ativo?', type: 'boolean' },
      { name: 'atendimento_emergencial', label: 'Atendimento Emergencial?', type: 'boolean' }
    ]
  },
  encanador: {
    id: 'encanador',
    label: 'Encanador / Hidráulica',
    theme: { color: 'blue', style: 'standard' },
    customFields: [
      { name: 'caca_vazamento', label: 'Caça Vazamento?', type: 'boolean' }
    ]
  },
  diarista: {
    id: 'diarista',
    label: 'Diarista / Limpeza',
    theme: { color: 'sky', style: 'glass' },
    customFields: [
      { name: 'leva_produtos', label: 'Leva produtos próprios?', type: 'boolean' },
      { name: 'faxina_pos_obra', label: 'Faz pós-obra?', type: 'boolean' }
    ]
  },
  frete: {
    id: 'frete',
    label: 'Fretes & Carretos',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'possui_ajudante', label: 'Possui Ajudante?', type: 'boolean' },
      { name: 'tipo_veiculo', label: 'Tipo de Veículo', type: 'text', placeholder: 'Ex: Fiorino, HR, Caminhão' }
    ]
  },
  ar_condicionado: {
    id: 'ar_condicionado',
    label: 'Ar Condicionado',
    theme: { color: 'cyan', style: 'glass' },
    customFields: [
      { name: 'instalacao_higienizacao', label: 'Instalação e Higienização?', type: 'boolean' }
    ]
  },
  montador_moveis: {
    id: 'montador_moveis',
    label: 'Montador de Móveis',
    theme: { color: 'stone', style: 'standard' },
    customFields: [
      { name: 'ferramentas_proprias', label: 'Ferramentas Próprias?', type: 'boolean' }
    ]
  },
  gesseiro: {
    id: 'gesseiro',
    label: 'Gesseiro / Drywall',
    theme: { color: 'stone', style: 'standard' },
    customFields: [
      { name: 'faz_sanca', label: 'Faz Sancas?', type: 'boolean' },
      { name: 'drywall', label: 'Trabalha com Drywall?', type: 'boolean' }
    ]
  },
  vidraceiro: {
    id: 'vidraceiro',
    label: 'Vidraceiro',
    theme: { color: 'cyan', style: 'glass' },
    customFields: [
      { name: 'vidro_temperado', label: 'Vidro Temperado?', type: 'boolean' },
      { name: 'box_banheiro', label: 'Instala Box de Banheiro?', type: 'boolean' }
    ]
  },
  pintor: {
    id: 'pintor',
    label: 'Pintor',
    theme: { color: 'indigo', style: 'standard' },
    customFields: [
      { name: 'pintura_residencial', label: 'Pintura Residencial?', type: 'boolean' },
      { name: 'pintura_comercial', label: 'Pintura Comercial?', type: 'boolean' }
    ]
  },
  serralheiro: {
    id: 'serralheiro',
    label: 'Serralheiro',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'trabalha_aluminio', label: 'Trabalha com Alumínio?', type: 'boolean' },
      { name: 'trabalha_ferro', label: 'Trabalha com Ferro?', type: 'boolean' }
    ]
  },
  marceneiro: {
    id: 'marceneiro',
    label: 'Marceneiro',
    theme: { color: 'orange', style: 'standard' },
    customFields: [
      { name: 'moveis_planejados', label: 'Faz Móveis Planejados?', type: 'boolean' }
    ]
  },
  assistencia_celular: {
    id: 'assistencia_celular',
    label: 'Assistência Celular',
    theme: { color: 'blue', style: 'oled' },
    customFields: [
      { name: 'troca_tela', label: 'Faz Troca de Tela?', type: 'boolean' },
      { name: 'peças_originais', label: 'Peças Originais?', type: 'boolean' }
    ]
  },
  quentinhas: {
    id: 'quentinhas',
    label: 'Quentinhas / Marmitex',
    theme: { color: 'red', style: 'standard' },
    customFields: [
      { name: 'tem_delivery', label: 'Tem Delivery?', type: 'boolean' },
      { name: 'aceita_vr', label: 'Aceita VR / Ticket?', type: 'boolean' }
    ]
  },
  beauty: {
    id: 'beauty',
    label: 'Beleza & Estética',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'atende_domicilio', label: 'Atendimento em Domicílio?', type: 'boolean' },
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' }
    ]
  },
  health: {
    id: 'health',
    label: 'Saúde & Bem-Estar',
    theme: { color: 'emerald', style: 'standard' },
    customFields: [
      { name: 'atendimento_online', label: 'Faz Atendimento Online?', type: 'boolean' },
      { name: 'convenios', label: 'Aceita Convênios?', type: 'boolean' }
    ]
  },
  sales: {
    id: 'sales',
    label: 'Vendas & Comércio',
    theme: { color: 'violet', style: 'standard' },
    customFields: [
      { name: 'entrega_rapida', label: 'Possui Entrega Rápida?', type: 'boolean' },
      { name: 'catalogo_online', label: 'Possui Catálogo Online?', type: 'boolean' }
    ]
  },
  food: {
    id: 'food',
    label: 'Gastronomia / Delivery',
    theme: { color: 'red', style: 'standard' },
    customFields: [
      { name: 'tem_delivery', label: 'Atende Delivery?', type: 'boolean' },
      { name: 'retirada_local', label: 'Aceita Retirada no Local?', type: 'boolean' },
      { name: 'aceita_vr', label: 'Aceita VR / Ticket?', type: 'boolean' }
    ]
  },
  tech: {
    id: 'tech',
    label: 'Tecnologia / Digital',
    theme: { color: 'blue', style: 'oled' },
    customFields: [
      { name: 'remoto_presencial', label: 'Forma de Trabalho', type: 'text', placeholder: 'Ex: 100% Remoto' },
      { name: 'stack', label: 'Tecnologias (Separado por vírgula)', type: 'array', placeholder: 'Ex: React, Node, SQL' }
    ]
  },
  real_estate: {
    id: 'real_estate',
    label: 'Imobiliários',
    theme: { color: 'emerald', style: 'glass' },
    customFields: [
      { name: 'creci', label: 'Número do CRECI', type: 'text', placeholder: 'Ex: 123456-F' },
      { name: 'venda_aluguel', label: 'Tipos de Imóveis', type: 'text', placeholder: 'Ex: Venda e Aluguel' }
    ]
  },
  driver: {
    id: 'driver',
    label: 'Motorista / Entregas',
    theme: { color: 'slate', style: 'standard' },
    customFields: [
      { name: 'tipo_veiculo', label: 'Seu Veículo', type: 'text', placeholder: 'Ex: Carro Sedan' },
      { name: 'atende_viagens', label: 'Faz Viagens Intermunicipais?', type: 'boolean' }
    ]
  },
  petshop: {
    id: 'petshop',
    label: 'Petshop / Veterinária',
    theme: { color: 'purple', style: 'glass' },
    customFields: [
      { name: 'banho_tosa', label: 'Oferece Banho e Tosa?', type: 'boolean' },
      { name: 'atendimento_clinico', label: 'Possui Atendimento Clínico?', type: 'boolean' }
    ]
  },
  service: {
    id: 'service',
    label: 'Manutenção / Serviços',
    theme: { color: 'amber', style: 'standard' },
    customFields: [
      { name: 'orcamento_gratis', label: 'Orçamento Gratuito?', type: 'boolean' },
      { name: 'garantia_servico', label: 'Oferece Garantia?', type: 'boolean' }
    ]
  },
  default: {
    id: 'default',
    label: 'Outros Profissionais',
    theme: { color: 'blue', style: 'standard' },
    customFields: []
  }
};

export function getProfessionConfig(profession: ProfessionCategory | string | null | undefined): ProfessionConfig {
  if (!profession || !professionsMap[profession as ProfessionCategory]) {
    return professionsMap.default;
  }
  return professionsMap[profession as ProfessionCategory];
}
