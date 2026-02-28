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
    customFields: []
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
