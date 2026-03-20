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
  suggestedBackgrounds?: string[];
  defaultBio?: string;
  defaultCta?: string;
  defaultServices?: Array<{ nome: string; descricao?: string; preco?: string; duracao?: string; }>;
}

export const professionsMap: Record<ProfessionCategory, ProfessionConfig> = {
  barbearia: {
    id: 'barbearia',
    label: 'Barbearia',
    theme: { color: 'amber', style: 'oled' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'trabalha_com_horario_marcado', label: 'Horário Marcado?', type: 'boolean' },
      { name: 'atendimento_kids', label: 'Atendimento Kids?', type: 'boolean' },
      { name: 'dia_do_noivo', label: 'Dia do Noivo?', type: 'boolean' },
      { name: 'quimica_relaxamento', label: 'Relaxamento / Química?', type: 'boolean' },
      { name: 'produtos_venda', label: 'Venda de Produtos?', type: 'boolean' },
      { name: 'massagem_facial', label: 'Massagem Facial?', type: 'boolean' },
      { name: 'lavagem_especial', label: 'Lavagem Especial?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1585744944847-1c39059e74cf?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1512690196236-40763bb59023?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Experiência premium em barbearia. Especialista em cortes modernos e clássicos, visagismo, barba terapia com toalha quente e massagem facial. Ambiente climatizado, café gelado e profissionais qualificados para elevar o seu estilo.',
    defaultCta: 'Agendar Horário 💈',
    defaultServices: [
      { nome: 'Corte Degradê / Moderno', descricao: 'Fade impecável terminando no navalhado ou shaver, com acabamento premium.', preco: 'R$ 45' },
      { nome: 'Barba Terapia Ritual', descricao: 'Massagem, toalha quente, óleos essenciais e modelagem perfeita.', preco: 'R$ 40' },
      { nome: 'Combo Master (Corte + Barba)', descricao: 'O cuidado completo para um visual renovado e elegante.', preco: 'R$ 75' },
      { nome: 'Corte Infantil (Kids)', descricao: 'Atendimento lúdico e cuidadoso para os pequenos.', preco: 'R$ 35' }
    ]
  },
  manicure: {
    id: 'manicure',
    label: 'Manicure',
    theme: { color: 'pink', style: 'glass' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'atende_domicilio', label: 'Atende em Domicílio?', type: 'boolean' },
      { name: 'unhas_fibra', label: 'Fibra de Vidro?', type: 'boolean' },
      { name: 'unhas_gel', label: 'Unhas em Gel?', type: 'boolean' },
      { name: 'blindagem', label: 'Blindagem?', type: 'boolean' },
      { name: 'spa_pes_maos', label: 'Possui Spa dos Pés/Mãos?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1621236304846-859dabc6a101?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1632345680197-23517df40df2?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Especialista em embelezamento de mãos e pés. Ofereço desde a cutilagem clássica até técnicas avançadas de alongamento em fibra, blindagem e esmaltação em gel de alta durabilidade. Foco total em biossegurança e acabamento impecável.',
    defaultCta: 'Agendar Horário ✨',
    defaultServices: [
      { nome: 'Manicure & Pedicure', descricao: 'Limpeza, cuticulagem e esmaltação tradicional completa.', preco: 'R$ 60' },
      { nome: 'Alongamento em Fibra', descricao: 'Unhas longas, naturais e resistentes, inclui primeira esmaltação.', preco: 'R$ 150' },
      { nome: 'Esmaltação em Gel', descricao: 'Esmaltação de alta durabilidade (até 20 dias) sem descascar.', preco: 'R$ 50' },
      { nome: 'Blindagem de Unhas', descricao: 'Fortalecimento da unha natural com camada de gel protetora.', preco: 'R$ 70' }
    ]
  },
  cabeleireiro: {
    id: 'cabeleireiro',
    label: 'Cabeleireiro',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'dia_da_noiva', label: 'Atende Dia da Noiva?', type: 'boolean' },
      { name: 'mechas_luzes', label: 'Especialista em Mechas?', type: 'boolean' },
      { name: 'progressiva_botox', label: 'Progressiva / Botox?', type: 'boolean' },
      { name: 'penteados', label: 'Realiza Penteados para Eventos?', type: 'boolean' },
      { name: 'cronograma_capilar', label: 'Trabalha com Cronograma?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Transformando sua auto-estima através da colorimetria avançada, cortes que valorizam seu rosto e tratamentos de reconstrução profunda. Especialista em loiros saudáveis e penteados deslumbrantes para o seu grande dia.',
    defaultCta: 'Consultar Disponibilidade 💇‍♀️',
    defaultServices: [
      { nome: 'Corte Feminino Premium', descricao: 'Visagismo e corte personalizado com lavagem especial.', preco: 'R$ 120' },
      { nome: 'Mechas / Morena Iluminada', descricao: 'Técnica de clareamento preservando a saúde do fio.', preco: 'Sob consulta' },
      { nome: 'Escova e Tratamento', descricao: 'Lavagem com produtos profissionais e escovação modelada.', preco: 'A partir de R$ 80' },
      { nome: 'Cronograma Capilar', descricao: 'Pacote de 4 sessões (Nutrição, Hidratação, Reconstrução).', preco: 'R$ 350' }
    ]
  },
  personal_trainer: {
    id: 'personal_trainer',
    label: 'Personal Trainer',
    theme: { color: 'green', style: 'standard' },
    customFields: [
      { name: 'online', label: 'Consultoria Online?', type: 'boolean' },
      { name: 'atende_em_academia', label: 'Atende em Academias Parceiras?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Especialista em transformação corporal, hipertrofia e emagrecimento. Atendimento personalizado focado em resultados reais, sempre com excelência, acompanhamento diário e metodologias embasadas na ciência do esporte.',
    defaultCta: 'Agendar Aula 💪',
    defaultServices: [
      { nome: 'Consultoria Online', descricao: 'Planilhas de treino personalizadas, suporte diário e ajustes.', preco: 'R$ 150/mês' },
      { nome: 'Personal Presencial', descricao: 'Acompanhamento lado a lado com correção de movimento.', preco: 'Sob consulta' },
      { nome: 'Avaliação Física', descricao: 'Análise de biotipo, composição corporal e alinhamento de metas.', preco: 'R$ 80' }
    ]
  },
  advogado: {
    id: 'advogado',
    label: 'Advogado',
    theme: { color: 'slate', style: 'minimalist' },
    customFields: [
      { name: 'numero_oab', label: 'Número da OAB', type: 'text', placeholder: 'Ex: 123456/SP' },
      { name: 'especialidades', label: 'Especialidades', type: 'array', placeholder: 'Ex: Direito Civil' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  psicologo: {
    id: 'psicologo',
    label: 'Psicólogo',
    theme: { color: 'teal', style: 'glass' },
    customFields: [
      { name: 'abordagem_terapeutica', label: 'Abordagem Terapêutica', type: 'text', placeholder: 'Ex: TCC, Psicanálise' },
      { name: 'atendimento_online', label: 'Atendimento Online?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc48?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1516302752625-fbb345ebb1e5?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1518101645466-7795880fb9f8?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Atendimento psicológico humanizado, focado na saúde mental, autoconhecimento e desenvolvimento pessoal. Um espaço seguro e acolhedor para que você expresse seus sentimentos e encontre novos caminhos.',
    defaultCta: 'Agendar Consulta 🛋️',
    defaultServices: [
      { nome: 'Psicoterapia Individual', descricao: 'Atendimento focado nas suas demandas emocionais e autoconhecimento.', preco: 'R$ 180 / sessão' },
      { nome: 'Terapia Online', descricao: 'Sessões por vídeo chamada no conforto e segurança da sua casa.', preco: 'R$ 150 / sessão' },
      { nome: 'Terapia de Casal', descricao: 'Mediação profissional para criar diálogos saudáveis no relacionamento.', preco: 'R$ 250 / sessão' }
    ]
  },
  designer: {
    id: 'designer',
    label: 'Designer',
    theme: { color: 'purple', style: 'glass' },
    customFields: [
      { name: 'tipos_de_servico', label: 'Tipos de Serviços', type: 'array', placeholder: 'Ex: Identidade Visual, UI/UX' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1545231027-4144e1c6680a?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Design estratégico para transformar ideias em experiências visuais únicas. Criação de branding, peças para redes sociais e interfaces web guiadas não apenas pela estética, mas pelo resultado da sua marca.',
    defaultCta: 'Criar meu Projeto 🎨',
    defaultServices: [
      { nome: 'Identidade Visual', descricao: 'Logo, paleta de cores, tipografia e manual da marca para seu negócio.', preco: 'A partir de R$ 800' },
      { nome: 'Artes para Redes Sociais', descricao: 'Pacote mensal de posts estratégicos para Instagram/Facebook.', preco: 'Sob consulta' },
      { nome: 'UI/UX Design', descricao: 'Desenho de telas para apps e sites com foco na experiência do usuário.', preco: 'Sob consulta' }
    ]
  },
  fotografo: {
    id: 'fotografo',
    label: 'Fotógrafo',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'tipo_eventos', label: 'Tipos de Eventos', type: 'array', placeholder: 'Ex: Casamentos, Ensaios' },
      { name: 'entrega_digital', label: 'Entrega Digital?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1516033519934-84640108db88?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Capturando momentos inesquecíveis através da lente. Especializado em eternizar emoções com sensibilidade e técnica. Ensaios, retratos autênticos e coberturas de eventos com um olhar único.',
    defaultCta: 'Solicitar Orçamento 📸',
    defaultServices: [
      { nome: 'Ensaio Fotográfico', descricao: 'Sessão fotográfica externa com curadoria e edição premium de fotos.', preco: 'A partir de R$ 350' },
      { nome: 'Eventos & Casamentos', descricao: 'Fotografia incrível para eternizar o melhor do seu grande dia.', preco: 'Sob consulta' },
      { nome: 'Retratos Corporativos', descricao: 'Fotos profissionais para fortalecer sua imagem de marca e LinkedIn.', preco: 'R$ 200' }
    ]
  },
  tecnico_informatica: {
    id: 'tecnico_informatica',
    label: 'Técnico de Informática',
    theme: { color: 'blue', style: 'standard' },
    customFields: [
      { name: 'suporte_remoto', label: 'Suporte Remoto?', type: 'boolean' },
      { name: 'atende_empresas', label: 'Atende Empresas?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1563770660941-20978e87081b?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Suporte especializado em TI. Manutenção de computadores, redes e sistemas com diagnóstico rápido, seja remoto ou presencial. Ajudamos a manter sua rotina de tecnologia sempre funcionando.',
    defaultCta: 'Solicitar Suporte 💻',
    defaultServices: [
      { nome: 'Formatação & Limpeza', descricao: 'Instalação do Windows, backup e limpeza física profunda da máquina.', preco: 'R$ 150' },
      { nome: 'Suporte Remoto', descricao: 'Manutenção e resolução de problemas básicos pelo acesso remoto, sem sair de casa.', preco: 'R$ 80 / h' },
      { nome: 'Infraestrutura de Rede', descricao: 'Cabeamento, configuração de roteadores e sinal Wi-Fi.', preco: 'Sob consulta' }
    ]
  },
  esteticista: {
    id: 'esteticista',
    label: 'Esteticista',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'limpeza_pele', label: 'Limpeza de Pele?', type: 'boolean' },
      { name: 'drenagem_linfatica', label: 'Drenagem Linfática?', type: 'boolean' },
      { name: 'massagem_relaxante', label: 'Massagem Relaxante?', type: 'boolean' },
      { name: 'micropigmentacao', label: 'Micropigmentação?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1570172619664-2af9fbeca001?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1544161515-4365f1007221?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Recupere o brilho da sua pele e o equilíbrio do seu corpo com protocolos personalizados de estética avançada. Especialista em tratamentos faciais e corporais focados em resultados reais e relaxamento profundo.',
    defaultCta: 'Agendar Avaliação 💆‍♀️',
    defaultServices: [
      { nome: 'Limpeza de Pele Profunda', descricao: 'Extração, peeling de diamante e hidratação calmante.', preco: 'R$ 150' },
      { nome: 'Drenagem Linfática (Sessão)', descricao: 'Redução de medidas e toxinas com técnica exclusiva.', preco: 'R$ 120' },
      { nome: 'Peeling Químico', descricao: 'Renovação celular para tratar manchas e linhas de expressão.', preco: 'R$ 200' },
      { nome: 'Microagulhamento', descricao: 'Tratamento para cicatrizes e rejuvenescimento facial.', preco: 'Sob consulta' }
    ]
  },
  pedreiro: {
    id: 'pedreiro',
    label: 'Pedreiro & Obras',
    theme: { color: 'orange', style: 'standard' },
    customFields: [
      { name: 'trabalha_com_reforma', label: 'Faz Reformas?', type: 'boolean' },
      { name: 'anos_experiencia', label: 'Anos de Experiência', type: 'text', placeholder: 'Ex: 10 anos' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1504307651254-35680f43b1d4?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1541888941259-79273a460da1?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  mestre_de_obras: {
    id: 'mestre_de_obras',
    label: 'Mestre de Obras',
    theme: { color: 'orange', style: 'standard' },
    customFields: [
      { name: 'anos_experiencia', label: 'Anos de Experiência', type: 'text', placeholder: 'Ex: 15 anos' },
      { name: 'gerencia_equipe', label: 'Gerenciamento de Equipes?', type: 'boolean' },
      { name: 'leitura_projetos', label: 'Leitura de Projetos / Plantas?', type: 'boolean' },
      { name: 'cronograma_obra', label: 'Gestão de Cronograma?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1541888941259-79273a460da1?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Mestre de obras com vasta experiência em gestão de canteiros, leitura técnica de projetos e coordenação de equipes. Foco total em qualidade, cumprimento de prazos e otimização de custos para garantir que seu sonho seja construído com segurança e excelência.',
    defaultCta: 'Solicitar Consultoria 🏗️',
    defaultServices: [
      { nome: 'Gerenciamento de Obra', descricao: 'Acompanhamento diário do canteiro, gestão de materiais e conferência de serviços.', preco: 'Sob consulta' },
      { nome: 'Consultoria de Projetos', descricao: 'Análise detalhada de plantas e auxílio na viabilidade técnica da construção.', preco: 'R$ 250 / h' },
      { nome: 'Reforma Completa / Gestão', descricao: 'Gestão integral da reforma, desde a demolição até os acabamentos mais finos.', preco: 'Sob consulta' }
    ]
  },
  mecanico: {
    id: 'mecanico',
    label: 'Mecânico / Auto',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'socorro_24h', label: 'Socorro 24h?', type: 'boolean' },
      { name: 'especialidade_carros', label: 'Especialista em', type: 'text', placeholder: 'Ex: Câmbio, Suspensão' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1486006396193-471068589dca?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1517524008436-bbdb53c54434?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1530046339160-ce3e5b0c792f?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Oficina mecânica especializada em manutenção preventiva e corretiva, injeção eletrônica, suspensão, freios, troca de óleo e revisão pré-viagem. Trabalhamos com transparência e as melhores ferramentas do mercado para a segurança do seu veículo.',
    defaultCta: 'Pedir Orçamento 🛠️',
    defaultServices: [
      { nome: 'Revisão Completa', descricao: 'Check-up de mais de 40 itens, incluindo freios, fluidos, suspensão.', preco: 'Sob consulta' },
      { nome: 'Troca de Óleo e Filtros', descricao: 'Proteja o motor do seu carro com óleos recomendados pelo fabricante.', preco: 'A partir de R$ 150' },
      { nome: 'Escaneamento Avançado', descricao: 'Diagnóstico computadorizado de injeção e módulos eletrônicos.', preco: 'R$ 120' }
    ]
  },
  eletricista: {
    id: 'eletricista',
    label: 'Eletricista',
    theme: { color: 'amber', style: 'standard' },
    customFields: [
      { name: 'nr10_ativo', label: 'NR10 Ativo?', type: 'boolean' },
      { name: 'atendimento_emergencial', label: 'Atendimento Emergencial?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1621905252507-b352224075e8?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Serviços elétricos residenciais, comerciais e industriais. Profissional qualificado executando instalações, reparos, quadro de distribuição, iluminação LED e padrões de entrada, sempre seguindo as normas de segurança (NR10 / NBR5410).',
    defaultCta: 'Pedir Orçamento 🛠️',
    defaultServices: [
      { nome: 'Visita Técnica / Orçamento', descricao: 'Diagnóstico do problema elétrico no local.', preco: 'R$ 80' },
      { nome: 'Instalação de Chuveiro', descricao: 'Instalação elétrica e hidráulica com segurança.', preco: 'R$ 100' },
      { nome: 'Troca de Quadro (Disjuntores)', descricao: 'Atualização e adequação do quadro elétrico.', preco: 'Sob consulta' }
    ]
  },
  encanador: {
    id: 'encanador',
    label: 'Encanador / Hidráulica',
    theme: { color: 'blue', style: 'standard' },
    customFields: [
      { name: 'caca_vazamento', label: 'Caça Vazamento?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1605667504813-f66e067c268d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1542013976693-87748472f3ff?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  diarista: {
    id: 'diarista',
    label: 'Diarista / Limpeza',
    theme: { color: 'sky', style: 'glass' },
    customFields: [
      { name: 'leva_produtos', label: 'Leva produtos próprios?', type: 'boolean' },
      { name: 'faxina_pos_obra', label: 'Faz pós-obra?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1581578731522-745d05db9ad0?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  frete: {
    id: 'frete',
    label: 'Fretes & Carretos',
    theme: { color: 'zinc', style: 'oled' },
    customFields: [
      { name: 'possui_ajudante', label: 'Possui Ajudante?', type: 'boolean' },
      { name: 'tipo_veiculo', label: 'Tipo de Veículo', type: 'text', placeholder: 'Ex: Fiorino, HR, Caminhão' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1586528116311-ad86d72b220b?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1494412574743-0112f0424888?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1519003722824-19fd3599e19d?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  ar_condicionado: {
    id: 'ar_condicionado',
    label: 'Ar Condicionado',
    theme: { color: 'cyan', style: 'glass' },
    customFields: [
      { name: 'instalacao_higienizacao', label: 'Instalação e Higienização?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1621814674068-07e793910c6d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1615818968853-90d5257904e2?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  montador_moveis: {
    id: 'montador_moveis',
    label: 'Montador de Móveis',
    theme: { color: 'stone', style: 'standard' },
    customFields: [
      { name: 'ferramentas_proprias', label: 'Ferramentas Próprias?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1517036660161-aa8e935640e?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  gesseiro: {
    id: 'gesseiro',
    label: 'Gesseiro / Drywall',
    theme: { color: 'stone', style: 'standard' },
    customFields: [
      { name: 'faz_sanca', label: 'Faz Sancas?', type: 'boolean' },
      { name: 'drywall', label: 'Trabalha com Drywall?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1534237711011-41864f2a9316?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1508967566542-f3d212a4bcf6?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  vidraceiro: {
    id: 'vidraceiro',
    label: 'Vidraceiro',
    theme: { color: 'cyan', style: 'glass' },
    customFields: [
      { name: 'vidro_temperado', label: 'Vidro Temperado?', type: 'boolean' },
      { name: 'box_banheiro', label: 'Instala Box de Banheiro?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1520038410233-7141ec7ae74d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1601050690533-33df45f47055?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1497233538033-edfa5950a6da?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  pintor: {
    id: 'pintor',
    label: 'Pintor',
    theme: { color: 'indigo', style: 'standard' },
    customFields: [
      { name: 'pintura_residencial', label: 'Pintura Residencial?', type: 'boolean' },
      { name: 'pintura_comercial', label: 'Pintura Comercial?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1589939705384-5185138a04b9?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1562944061-0b5ef9c8114f?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1599616611502-0fa13d91cca3?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  serralheiro: {
    id: 'serralheiro',
    label: 'Serralheiro',
    theme: { color: 'zinc', style: 'standard' },
    customFields: [
      { name: 'trabalha_aluminio', label: 'Trabalha com Alumínio?', type: 'boolean' },
      { name: 'trabalha_ferro', label: 'Trabalha com Ferro?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5f6127b0?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  marceneiro: {
    id: 'marceneiro',
    label: 'Marceneiro',
    theme: { color: 'orange', style: 'standard' },
    customFields: [
      { name: 'moveis_planejados', label: 'Faz Móveis Planejados?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1501139083526-77839736aaed?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1475518883-ec22d4cb3707?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  assistencia_celular: {
    id: 'assistencia_celular',
    label: 'Assistência Celular',
    theme: { color: 'blue', style: 'oled' },
    customFields: [
      { name: 'troca_tela', label: 'Faz Troca de Tela?', type: 'boolean' },
      { name: 'peças_originais', label: 'Peças Originais?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1597075095440-b617688536be?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1604754737202-31dd242ba98c?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1551817418-471249e02379?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  quentinhas: {
    id: 'quentinhas',
    label: 'Gastronomia / Marmitas',
    theme: { color: 'red', style: 'standard' },
    customFields: [
      { name: 'tem_delivery', label: 'Tem Delivery?', type: 'boolean' },
      { name: 'aceita_vr', label: 'Aceita VR / Ticket?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  beauty: {
    id: 'beauty',
    label: 'Beleza & Estética',
    theme: { color: 'rose', style: 'glass' },
    customFields: [
      { name: 'aceita_agendamento', label: 'Aceita Agendamento Online?', type: 'boolean' },
      { name: 'atende_domicilio', label: 'Atendimento em Domicílio?', type: 'boolean' },
      { name: 'extensao_cilios', label: 'Extensão de Cílios?', type: 'boolean' },
      { name: 'design_sobrancelhas', label: 'Design de Sobrancelhas?', type: 'boolean' },
      { name: 'micropigmentacao', label: 'Micropigmentação?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Realçando seu olhar e sua beleza natural com as técnicas mais modernas do mercado. Especialista em design estratégico de sobrancelhas e extensões de cílios que trazem praticidade e elegância ao seu dia a dia.',
    defaultCta: 'Agendar Procedimento ✨',
    defaultServices: [
      { nome: 'Design de Sobrancelhas', descricao: 'Medição estratégica e remoção de fios com pinça/linha.', preco: 'R$ 45' },
      { nome: 'Extensão de Cílios Fio a Fio', descricao: 'Olhar marcante e natural com aplicação técnica segura.', preco: 'R$ 180' },
      { nome: 'Brown Lamination', descricao: 'Técnica para sobrancelhas mais cheias e alinhadas.', preco: 'R$ 120' },
      { nome: ' Lash Lifting', descricao: 'Curvatura natural dos seus próprios cílios com brilho.', preco: 'R$ 150' }
    ]
  },
  health: {
    id: 'health',
    label: 'Saúde & Bem-Estar',
    theme: { color: 'emerald', style: 'standard' },
    customFields: [
      { name: 'atendimento_online', label: 'Faz Atendimento Online?', type: 'boolean' },
      { name: 'convenios', label: 'Aceita Convênios?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1582719478250-c29ade595da7?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Atendimento de saúde avançado pensando em você como um todo: corpo, mente e rotina. Foco em soluções de longevidade, diagnósticos de rotina e acompanhamento com máximo rigor e cuidado.',
    defaultCta: 'Agendar Consulta 🩺',
    defaultServices: [
      { nome: 'Consulta Inicial / Avaliação', descricao: 'Análise clínica holística, solicitação de exames e mapeamento.', preco: 'R$ 350' },
      { nome: 'Retorno Focado', descricao: 'Leitura de exames e acompanhamento. Incluso no primeiro mês.', preco: 'Retorno' },
      { nome: 'Acompanhamento Contínuo', descricao: 'Sessões recorrentes e renovação de tratamento.', preco: 'Sob consulta' }
    ]
  },
  sales: {
    id: 'sales',
    label: 'Vendas & Comércio',
    theme: { color: 'violet', style: 'standard' },
    customFields: [
      { name: 'entrega_rapida', label: 'Possui Entrega Rápida?', type: 'boolean' },
      { name: 'catalogo_online', label: 'Possui Catálogo Online?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1556742049-02e53695219e?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1441986300913-9af03067ee0a?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  food: {
    id: 'food',
    label: 'Restaurante / Lanchonete',
    theme: { color: 'red', style: 'standard' },
    customFields: [
      { name: 'tem_delivery', label: 'Atende Delivery?', type: 'boolean' },
      { name: 'retirada_local', label: 'Aceita Retirada no Local?', type: 'boolean' },
      { name: 'aceita_vr', label: 'Aceita VR / Ticket?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1080&h=1920&q=80',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1080&h=1920&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1080&h=1920&q=80'
    ],
    defaultBio: 'Sabor e qualidade em cada detalhe! Preparamos pratos deliciosos e sanduíches artesanais com os melhores ingredientes. Venha conhecer nosso espaço acolhedor ou peça no conforto da sua casa.',
    defaultCta: 'Fazer Pedido / Cardápio 🍔',
    defaultServices: [
      { nome: 'Pratos Feitos (PF)', descricao: 'Comida caseira, fresquinha e muito bem servida.', preco: 'A partir de R$ 25' },
      { nome: 'Lanches Artesanais', descricao: 'Hambúrguer de blend especial com fritas.', preco: 'A partir de R$ 35' },
      { nome: 'Porções e Petiscos', descricao: 'Ideais para dividir com a galera e acompanhar uma bebida gelada.', preco: 'Sob consulta' }
    ]
  },
  tech: {
    id: 'tech',
    label: 'Tecnologia / Digital',
    theme: { color: 'blue', style: 'oled' },
    customFields: [
      { name: 'remoto_presencial', label: 'Forma de Trabalho', type: 'text', placeholder: 'Ex: 100% Remoto' },
      { name: 'stack', label: 'Tecnologias (Separado por vírgula)', type: 'array', placeholder: 'Ex: React, Node, SQL' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Criação de soluções de software, aplicativos e arquitetura digital com código limpo e escalável. Transformamos as necessidades do seu negócio em plataformas modernas através da programação.',
    defaultCta: 'Iniciar Projeto 🚀',
    defaultServices: [
      { nome: 'Desenvolvimento Web', descricao: 'Criação de sites institucionais, e-commerces e landing pages rápidas e responsivas.', preco: 'Sob consulta' },
      { nome: 'Sistemas Internos', descricao: 'Automacões para o seu time com sistemas criados especificamente para seu modelo.', preco: 'Sob consulta' },
      { nome: 'Mentoria & Consultoria', descricao: 'Refatoração de código, orientação de carreira e arquitetura para projetos.', preco: 'R$ 200 / h' }
    ]
  },
  real_estate: {
    id: 'real_estate',
    label: 'Imobiliários',
    theme: { color: 'emerald', style: 'glass' },
    customFields: [
      { name: 'creci', label: 'Número do CRECI', type: 'text', placeholder: 'Ex: 123456-F' },
      { name: 'venda_aluguel', label: 'Tipos de Imóveis', type: 'text', placeholder: 'Ex: Venda e Aluguel' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1582408921715-18e7806365bb?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  driver: {
    id: 'driver',
    label: 'Motorista / Entregas',
    theme: { color: 'slate', style: 'standard' },
    customFields: [
      { name: 'tipo_veiculo', label: 'Seu Veículo', type: 'text', placeholder: 'Ex: Carro Sedan' },
      { name: 'atende_viagens', label: 'Faz Viagens Intermunicipais?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1533512930330-4e2e6ca42dc3?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1507136766453-762bc250fbd3?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Motorista parceiro qualificado, priorizando pontualidade, segurança e conforto no seu trajeto. Corridas executivas, transporte de encomendas e pequenas viagens com o melhor custo-benefício e um atendimento simpático.',
    defaultCta: 'Chamar Motorista 🚗',
    defaultServices: [
      { nome: 'Corrida Local (Urbana)', descricao: 'Transporte rápido e seguro dentro da cidade.', preco: 'A partir de R$ 15' },
      { nome: 'Transporte de Encomendas', descricao: 'Coleta e entrega rápida para garantir seu pacote no mesmo dia.', preco: 'Sob consulta' },
      { nome: 'Viagens / Aeroporto', descricao: 'Corridas longas agendadas com conforto garantido.', preco: 'Sob consulta' }
    ]
  },
  petshop: {
    id: 'petshop',
    label: 'Petshop / Banho e Tosa',
    theme: { color: 'purple', style: 'glass' },
    customFields: [
      { name: 'banho_tosa', label: 'Oferece Banho e Tosa?', type: 'boolean' },
      { name: 'atendimento_clinico', label: 'Possui Atendimento Clínico?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Banhos relaxantes, tosas personalizadas, venda de rações premium, acessórios exclusivos e carinho de sobra! Especialistas no bem-estar e na estética do seu melhor amigo com toda a infraestrutura e segurança que ele merece.',
    defaultCta: 'Agendar Banho e Tosa 🐾',
    defaultServices: [
      { nome: 'Banho e Tosa Higiênica', descricao: 'Limpeza completa, tosa, corte das unhas e limpeza dos ouvidos.', preco: 'A partir de R$ 60' },
      { nome: 'Tosa na Máquina/Tesoura', descricao: 'Modelagem do pelo conforme o padrão da raça.', preco: 'A partir de R$ 80' },
      { nome: 'Hidratação Premium', descricao: 'Recuperação dos pelos danificados, trazendo brilho e maciez.', preco: 'R$ 40' }
    ]
  },
  veterinario: {
    id: 'veterinario',
    label: 'Médico Veterinário',
    theme: { color: 'emerald', style: 'glass' },
    customFields: [
      { name: 'crmv', label: 'CRMV', type: 'text', placeholder: 'Ex: CRMV-SP 12345' },
      { name: 'especialidades_vet', label: 'Especialidades', type: 'array', placeholder: 'Ex: Clínica Geral, Cirurgia' },
      { name: 'plantao_24h', label: 'Plantão 24h?', type: 'boolean' },
      { name: 'atendimento_domicilio_vet', label: 'Atendimento Domiciliar?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1628009368231-7bb7cbcb8122?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1596272875729-ed2ff7d6fa9c?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Atendimento veterinário humanizado, ético e especializado, focado no bem-estar, saúde e longevidade do seu melhor amigo. Consultas clínicas, vacinação, exames e orientação preventiva com todo amor e profissionalismo.',
    defaultCta: 'Agendar Consulta 🩺🐾',
    defaultServices: [
      { nome: 'Consulta Clínica Geral', descricao: 'Avaliação completa da saúde do seu pet, diagnóstico e prescrição de tratamentos.', preco: 'R$ 150' },
      { nome: 'Vacinação (V10, Antirrábica)', descricao: 'Prevenção é o melhor remédio. Mantenha as vacinas do seu pet em dia.', preco: 'A partir de R$ 80' },
      { nome: 'Consulta Domiciliar', descricao: 'Atendimento no conforto de casa para maior tranquilidade do seu animal.', preco: 'R$ 200' }
    ]
  },
  service: {
    id: 'service',
    label: 'Manutenção / Serviços',
    theme: { color: 'amber', style: 'standard' },
    customFields: [
      { name: 'orcamento_gratis', label: 'Orçamento Gratuito?', type: 'boolean' },
      { name: 'garantia_servico', label: 'Oferece Garantia?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1581447100595-3a72cb9b60b3?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1504307651254-35680f43b1d4?auto=format&fit=crop&q=80&w=1080&h=1920'
    ]
  },
  musico: {
    id: 'musico',
    label: 'Músico / Banda / Cantor',
    theme: { color: 'fuchsia', style: 'glass' },
    customFields: [
      { name: 'estilo_musical', label: 'Estilo Musical', type: 'text', placeholder: 'Ex: Sertanejo, Rock, Pop' },
      { name: 'spotify_link', label: 'Link do Spotify', type: 'text', placeholder: 'https://open.spotify.com/...' },
      { name: 'youtube_link', label: 'Link do YouTube', type: 'text', placeholder: 'https://youtube.com/...' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1493225457124-a1a2a5f4a13e?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Levando música, sentimento e muita energia para o seu evento. Repertório personalizado para casamentos, formaturas, bares e eventos corporativos, garantindo que cada momento tenha a trilha sonora perfeita.',
    defaultCta: 'Solicitar Orçamento 🎸',
    defaultServices: [
      { nome: 'Show Acústico (Voz e Violão)', descricao: 'Ideal para ambientes intimistas, cerimônias e jantares.', preco: 'A partir de R$ 400' },
      { nome: 'Banda Completa', descricao: 'A energia necessária para fazer todo mundo dançar na sua festa.', preco: 'Sob consulta' },
      { nome: 'Composição Inédita', descricao: 'Música personalizada para homenagens ou projetos especiais.', preco: 'Sob consulta' }
    ]
  },
  van_escolar: {
    id: 'van_escolar',
    label: 'Motorista de Van Escolar / Transporte Universitário',
    theme: { color: 'yellow', style: 'standard' },
    customFields: [
      { name: 'possui_monitor', label: 'Possui Monitor(a)?', type: 'boolean' },
      { name: 'ar_condicionado', label: 'Van com Ar Condicionado?', type: 'boolean' },
      { name: 'atende_escolas', label: 'Escolas/Faculdades (Separadas por vírgula)', type: 'array', placeholder: 'Ex: Colégio Anglo, USP' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1554672408-e87f17b34b9d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1518290372138-cbbcc199b005?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1506869640319-fea1a275306c?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Transporte escolar e universitário legalizado com total segurança, conforto e pontualidade. Veículos vistoriados frequentemente para a tranquilidade dos pais e garantia de um trajeto agradável aos alunos todos os dias.',
    defaultCta: 'Chamar no WhatsApp 🚐',
    defaultServices: [
      { nome: 'Transporte Escolar (Mensal)', descricao: 'Trajeto de ida e volta da escola para crianças e adolescentes. Trajeto monitorado.', preco: 'Sob consulta' },
      { nome: 'Transporte Universitário', descricao: 'Ida e volta noturna/diurna focada em faculdades da região.', preco: 'Sob consulta' },
      { nome: 'Fretamento para Excursões', descricao: 'Locação da van com motorista para passeios, viagens de turma e eventos.', preco: 'Sob consulta' }
    ]
  },
  guia_turistico: {
    id: 'guia_turistico',
    label: 'Guia de Turismo',
    theme: { color: 'emerald', style: 'standard' },
    customFields: [
      { name: 'cadastur', label: 'Número Cadastur', type: 'text', placeholder: 'Ex: 12.345678.90-1' },
      { name: 'idiomas', label: 'Idiomas', type: 'array', placeholder: 'Ex: Português, Inglês' },
      { name: 'veiculo_proprio', label: 'Possui Veículo Próprio?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Explorando destinos incríveis e criando memórias inesquecíveis. Guiamento especializado, roteiros personalizados e profundo conhecimento cultural e histórico da região. Viaje com segurança, conforto e a melhor companhia.',
    defaultCta: 'Agendar Passeio 🗺️',
    defaultServices: [
      { nome: 'City Tour Histórico', descricao: 'Passeio guiado pelos principais pontos históricos e culturais da cidade.', preco: 'Sob consulta' },
      { nome: 'Trilha & Ecoturismo', descricao: 'Aventuras na natureza com total segurança e respeito ao meio ambiente.', preco: 'Sob consulta' },
      { nome: 'Roteiro Personalizado', descricao: 'Planejamento e acompanhamento de viagem sob medida para você.', preco: 'Sob consulta' }
    ]
  },
  artesao: {
    id: 'artesao',
    label: 'Artesão / Feito à Mão',
    theme: { color: 'amber', style: 'glass' },
    customFields: [
      { name: 'materiais_utilizados', label: 'Principais Materiais', type: 'array', placeholder: 'Ex: Madeira, Resina, Fio de Malha' },
      { name: 'aceita_encomendas', label: 'Aceita Encomendas?', type: 'boolean' },
      { name: 'prazo_medio_producao', label: 'Prazo de Produção', type: 'text', placeholder: 'Ex: 10 a 15 dias' },
      { name: 'produtos_pronta_entrega', label: 'Tem Pronta Entrega?', type: 'boolean' }
    ],
    suggestedBackgrounds: [
      'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1456082902841-3335005c3082?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1621814238541-ef12aa0b3b4d?auto=format&fit=crop&q=80&w=1080&h=1920',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1080&h=1920'
    ],
    defaultBio: 'Criação de peças únicas feitas à mão com afeto, qualidade e muita criatividade. Valorize o trabalho artesanal e leve exclusividade para a sua casa, presentes e decoração.',
    defaultCta: 'Ver Catálogo / Encomendar 🎨',
    defaultServices: [
      { nome: 'Peças a Pronta Entrega', descricao: 'Itens exclusivos já produzidos e prontos para envio ou retirada.', preco: 'A partir de R$ 30' },
      { nome: 'Encomenda Personalizada', descricao: 'Seu projeto sob medida! Escolha as cores, tamanho e detalhes do seu produto.', preco: 'Sob consulta' },
      { nome: 'Kits / Lembrandoce', descricao: 'Lembrancinhas feitas a mão para casamentos, batizados e eventos infantis.', preco: 'Sob consulta' }
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
