
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXhkbmp2eHBoaGdlc3RmdnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg5MjI0NywiZXhwIjoyMDg1NDY4MjQ3fQ.rzPi1OHEegcxFzfkesYRN_MzwCrbRq98dhu7dlUNJ8U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfile() {
  const email = 'estetica' + Math.floor(Math.random() * 1000) + '@konnexy.com.br';
  const password = 'Password123!';
  const username = 'estetica' + Math.floor(Math.random() * 1000);

  console.log(`Creating user: ${email}...`);

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (userError) {
    console.error('Error creating user:', userError);
    return;
  }

  const userId = userData.user.id;
  console.log(`User created with ID: ${userId}`);

  const profileData = {
    user_id: userId,
    username: username,
    business_name: "Elite Shine Estética Automotiva",
    subtitle: "O Cuidado que seu Carro Merece",
    profession: "estetica_automotiva",
    category: "estetica_automotiva",
    bio_profissional: "Transformamos o visual do seu veículo com técnicas avançadas de detalhamento. Especialistas em vitrificação, polimento técnico e higienização profunda.",
    area_atendimento: "Grande São Paulo",
    tipo_atendimento: "Presencial e Delivery",
    horario_funcionamento: "Seg a Sex: 08h - 18h | Sáb: 08h - 13h",
    whatsapp: "5511987654321",
    whatsapp_message: "Olá! Gostaria de agendar uma avaliação para meu veículo.",
    instagram: "eliteshine_detailing",
    diferenciais: ["Produtos Premium", "Garantia de 1 ano", "Atendimento em domicílio", "Parcelamento em 12x"],
    servicos: [
      { nome: "Lavagem Detalhada", descricao: "Limpeza técnica com proteção de cera carnaúba.", preco: "A partir de R$ 120" },
      { nome: "Polimento Técnico", descricao: "Correção de pintura em 3 etapas para brilho máximo.", preco: "R$ 600" },
      { nome: "Vitrificação (Gyeon)", descricao: "Proteção cerâmica de alta performance.", preco: "R$ 1.500" },
      { nome: "Higienização Interna", descricao: "Limpeza de estofados com extração e oxi-sanitização.", preco: "R$ 300" }
    ],
    custom_fields: {
      estetica_automotiva: true,
      leva_e_traz: true,
      orcamento_gratis: true,
      aceita_cartao: true,
      cor_fundo: "#020617",
      cor_texto: "#f8fafc",
      cor_botoes: "#f59e0b"
    },
    plan: 'pro',
    billing_type: 'manual',
    plan_expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString(),
    theme_style: 'oled',
    theme_color: '#f59e0b'
  };

  console.log(`Creating profile for ${username}...`);

  const { error: profileError } = await supabase
    .from('profiles')
    .insert(profileData);

  if (profileError) {
    console.error('Error creating profile:', profileError);
  } else {
    console.log('Profile created successfully!');
    console.log(`Access at: https://www.konnexy.com.br/${username}`);
    console.log(`Credentials: ${email} / ${password}`);
  }
}

createProfile();
