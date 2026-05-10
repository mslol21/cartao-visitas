
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXhkbmp2eHBoaGdlc3RmdnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg5MjI0NywiZXhwIjoyMDg1NDY4MjQ3fQ.rzPi1OHEegcxFzfkesYRN_MzwCrbRq98dhu7dlUNJ8U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function improveProfile() {
  const username = 'estetica613';
  
  console.log(`Improving profile for ${username}...`);

  const profileUpdate = {
    photo_url: "https://cdn.pixabay.com/photo/2016/11/23/17/25/automobile-1853939_1280.jpg",
    theme_style: "glass",
    theme_color: "#f59e0b",
    background_video_url: "https://assets.mixkit.co/videos/preview/mixkit-detailed-view-of-a-man-washing-a-car-4670-large.mp4",
    servicos: [
      { 
        nome: "Lavagem Detalhada", 
        descricao: "Limpeza técnica com pH neutro e descontaminação ferrosa.", 
        preco: "R$ 150",
        image_url: "https://cdn.pixabay.com/photo/2017/09/20/19/33/car-wash-2769947_1280.jpg"
      },
      { 
        nome: "Polimento Técnico", 
        descricao: "Correção de pintura em 3 etapas para remoção de 95% dos riscos.", 
        preco: "R$ 800",
        image_url: "https://cdn.pixabay.com/photo/2019/11/04/13/20/car-polishing-4601111_1280.jpg"
      },
      { 
        nome: "Vitrificação 9H", 
        descricao: "Proteção cerâmica premium com dureza 9H e brilho profundo.", 
        preco: "R$ 1.800",
        image_url: "https://cdn.pixabay.com/photo/2020/05/25/11/48/car-5218204_1280.jpg"
      },
      { 
        nome: "Higienização Interna", 
        descricao: "Limpeza completa de bancos, teto e carpetes com extração e ozônio.", 
        preco: "R$ 350",
        image_url: "https://cdn.pixabay.com/photo/2021/01/21/11/09/car-5937053_1280.jpg"
      }
    ],
    custom_fields: {
      estetica_automotiva: true,
      leva_e_traz: true,
      orcamento_gratis: true,
      aceita_cartao: true,
      cor_fundo: "#020617",
      cor_texto: "#ffffff",
      cor_botoes: "#f59e0b",
      cor_texto_botoes: "#000000",
      portfolio_images: [
        "https://cdn.pixabay.com/photo/2016/11/18/14/01/automobile-1834771_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/09/02/12/25/bmw-918408_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg"
      ]
    },
    seo_title: "Elite Shine Detailing - Estética Automotiva Premium em SP",
    seo_description: "Especialistas em polimento técnico, vitrificação e higienização interna. O melhor cuidado para o seu carro em São Paulo."
  };

  const { error } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('username', username);

  if (error) {
    console.error('Error updating profile:', error);
  } else {
    console.log('Profile improved successfully!');
  }
}

improveProfile();
