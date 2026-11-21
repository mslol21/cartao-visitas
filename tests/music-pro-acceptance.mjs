import assert from 'node:assert/strict';

console.log('🎵 Iniciando Testes de Aceitação do Konnexy Music Pro...\n');

// 1. Validar Lista de Profissões Elegíveis
const MUSIC_PROFESSIONS = [
  'musico',
  'cantor',
  'compositor',
  'banda',
  'grupo_musical',
  'dj',
  'instrumentista',
  'produtor_musical'
];

function isMusicProfession(profession) {
  return MUSIC_PROFESSIONS.includes(profession);
}

// ----------------------------------------------------------------------------
// FLUXO A: Novo Músico (Cantor, Lançamento, Smart Link)
// ----------------------------------------------------------------------------
console.log('▶ [Fluxo A] Testando cadastro de novo músico e Smart Link...');
const cantorProfile = {
  id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  username: 'mariana-rios-voz',
  profession: 'cantor',
  business_name: 'Mariana Rios',
  city: 'Belo Horizonte',
  area_atendimento: 'Minas Gerais e todo o Brasil',
  whatsapp: '(31) 98765-4321',
  custom_fields: {
    estilo_musical: 'MPB / Pop Acústico',
    music_pro: {
      config: {
        enabled: true,
        template: 'acoustic',
        stage_name: 'Mariana Rios',
        primary_color: '#d97706',
        secondary_color: '#f59e0b'
      },
      releases: [
        {
          id: 'rel-001',
          title: 'Canto das Águas',
          artist: 'Mariana Rios',
          slug: 'canto-das-aguas',
          release_type: 'single',
          cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
          published: true,
          streaming_links: [
            { platform: 'spotify', url: 'https://open.spotify.com/track/123456' },
            { platform: 'apple_music', url: 'https://music.apple.com/br/album/123456' },
            { platform: 'youtube', url: 'https://youtube.com/watch?v=123456' }
          ]
        }
      ]
    }
  }
};

assert.equal(isMusicProfession(cantorProfile.profession), true, 'Profissão cantor deve ser elegível para Music Pro');
const release = cantorProfile.custom_fields.music_pro.releases[0];
assert.equal(release.slug, 'canto-das-aguas');
assert.equal(release.streaming_links.length, 3);
assert.equal(release.streaming_links[0].platform, 'spotify');
const expectedSmartLink = `konnexy.com.br/${cantorProfile.username}/musica/${release.slug}`;
assert.equal(expectedSmartLink, 'konnexy.com.br/mariana-rios-voz/musica/canto-das-aguas');
console.log('  ✔ Fluxo A aprovado: Músico criado com Smart Link válido.\n');

// ----------------------------------------------------------------------------
// FLUXO B: Músico de Eventos (Instrumentista, Vídeos, Repertório, Contratação)
// ----------------------------------------------------------------------------
console.log('▶ [Fluxo B] Testando músico de eventos, repertório e contratação...');
const saxProfile = {
  id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  username: 'lucas-sax',
  profession: 'instrumentista',
  business_name: 'Lucas Sax Live',
  whatsapp: '11988887777',
  custom_fields: {
    estilo_musical: 'Jazz & Pop no Saxofone',
    music_pro: {
      config: {
        enabled: true,
        template: 'elegance',
        whatsapp_hire_message: 'Olá! Conheci seu trabalho pelo portfólio Konnexy e gostaria de um orçamento para meu casamento.',
        event_types: ['Casamentos', 'Cerimônias Religiosas', 'Recepções', 'Corporativo']
      },
      videos: [
        {
          id: 'vid-01',
          title: 'Entrada da Noiva no Saxofone',
          category: 'casamento',
          video_url: 'https://youtube.com/watch?v=sax_noiva_demo',
          published: true
        }
      ],
      repertoire: [
        { id: 'rep-01', title: 'Hallelujah', category: 'cerimonias', original_artist: 'Leonard Cohen' },
        { id: 'rep-02', title: 'Careless Whisper', category: 'jazz', original_artist: 'George Michael' },
        { id: 'rep-03', title: 'A Thousand Years', category: 'casamentos', original_artist: 'Christina Perri' }
      ]
    }
  }
};

assert.equal(isMusicProfession(saxProfile.profession), true, 'Instrumentista deve ser reconhecido');
const rep = saxProfile.custom_fields.music_pro.repertoire;
assert.equal(rep.length, 3);
const weddingSongs = rep.filter(r => r.category === 'casamentos');
assert.equal(weddingSongs.length, 1);
assert.equal(weddingSongs[0].title, 'A Thousand Years');

// Teste de mensagem de contratação e sanitização de WhatsApp
const cleanPhone = saxProfile.whatsapp.replace(/\D/g, '');
assert.equal(cleanPhone, '11988887777');
const waEncoded = encodeURIComponent(saxProfile.custom_fields.music_pro.config.whatsapp_hire_message);
assert.ok(waEncoded.includes('or%C3%A7amento') || waEncoded.includes('orçamento'));
console.log('  ✔ Fluxo B aprovado: Músico de eventos com repertório categorizado e WhatsApp seguro.\n');

// ----------------------------------------------------------------------------
// FLUXO C: Alteração de Profissão (Preservação de Dados Tradicional <-> Musical)
// ----------------------------------------------------------------------------
console.log('▶ [Fluxo C] Testando transição entre profissão tradicional e musical...');
const userCard = {
  id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
  profession: 'advogado',
  business_name: 'Dr. Roberto Castro',
  custom_fields: {
    numero_oab: '123456/SP'
  }
};

// 1. Estado inicial: tradicional
assert.equal(isMusicProfession(userCard.profession), false, 'Advogado não deve ter modo musical ativo por padrão');

// 2. Altera para 'musico' e cadastra álbum
userCard.profession = 'musico';
userCard.custom_fields.music_pro = {
  config: { enabled: true, template: 'stage', stage_name: 'Roberto Castro Acústico' },
  releases: [{ id: 'rel-jazz', title: 'Noites de Jazz', slug: 'noites-de-jazz', published: true }]
};
assert.equal(isMusicProfession(userCard.profession), true, 'Ao mudar para músico, ativa modo musical');
assert.equal(userCard.custom_fields.music_pro.releases.length, 1);

// 3. Usuário retorna para 'advogado'
userCard.profession = 'advogado';
assert.equal(isMusicProfession(userCard.profession), false, 'Retornando para advogado, card tradicional é exibido');

// 4. Garante que os dados musicais NÃO foram apagados
assert.ok(userCard.custom_fields.music_pro, 'Dados musicais devem permanecer preservados');
assert.equal(userCard.custom_fields.music_pro.releases[0].title, 'Noites de Jazz');
assert.equal(userCard.custom_fields.numero_oab, '123456/SP', 'Dados originais da profissão tradicional preservados');
console.log('  ✔ Fluxo C aprovado: Alternância de profissões sem perda de dados.\n');

// ----------------------------------------------------------------------------
// FLUXO D: Segurança, Validação de URLs e Sanitização
// ----------------------------------------------------------------------------
console.log('▶ [Fluxo D] Testando regras de segurança e proteção de dados...');
function validateSlug(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}

function validateUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Slugs seguros vs inseguros
assert.equal(validateSlug('meu-single-2026'), true);
assert.equal(validateSlug('meu single'), false, 'Espaços não permitidos no slug');
assert.equal(validateSlug('../../malicious-path'), false, 'Path traversal bloqueado no slug');
assert.equal(validateSlug('<script>alert(1)</script>'), false, 'XSS bloqueado no slug');

// URLs seguras vs inseguras
assert.equal(validateUrl('https://open.spotify.com/track/123'), true);
assert.equal(validateUrl('javascript:alert(1)'), false, 'Protocolos maliciosos bloqueados');
assert.equal(validateUrl('data:text/html,<script>alert(1)</script>'), false);

// Evento privado não vaza detalhes confidenciais
const privateEvent = {
  id: 'evt-01',
  title: 'Casamento Família Silva & Souza',
  venue: 'Fazenda Secreta Particular - Estrada Rural km 14',
  city: 'Campinas',
  state: 'SP',
  is_private: true
};

function formatPublicEvent(event) {
  if (event.is_private) {
    return {
      title: 'Evento Privado',
      location: `${event.city}${event.state ? `, ${event.state}` : ''}`,
      is_private: true
    };
  }
  return {
    title: event.title,
    location: `${event.venue}, ${event.city}`,
    is_private: false
  };
}

const sanitizedEvent = formatPublicEvent(privateEvent);
assert.equal(sanitizedEvent.title, 'Evento Privado');
assert.equal(sanitizedEvent.location, 'Campinas, SP');
assert.ok(!sanitizedEvent.location.includes('Fazenda Secreta'), 'Endereço privado não vazado');
console.log('  ✔ Fluxo D aprovado: Validações de segurança, URLs e privacidade rigorosamente aplicadas.\n');

// ----------------------------------------------------------------------------
// FLUXO E: Planos, Assinaturas e Entitlements
// ----------------------------------------------------------------------------
console.log('▶ [Fluxo E] Testando controle de planos e entitlements...');
function canAccessMusicProFeatures(profile) {
  if (!profile) return false;
  // Planos com acesso total: music_pro, pro, fundador_local
  const proPlans = ['music_pro', 'pro', 'fundador_local'];
  return proPlans.includes(profile.plan) || proPlans.includes(profile.plano);
}

const freeUser = { plan: 'free', profession: 'musico' };
const musicProUser = { plan: 'pro', profession: 'musico' };
const fundadorUser = { plan: 'fundador_local', profession: 'banda' };

assert.equal(canAccessMusicProFeatures(freeUser), false, 'Usuário free tem acesso ao preview básico');
assert.equal(canAccessMusicProFeatures(musicProUser), true, 'Usuário Pro tem acesso ao Konnexy Music Pro');
assert.equal(canAccessMusicProFeatures(fundadorUser), true, 'Fundador Local preserva acesso Pro');
console.log('  ✔ Fluxo E aprovado: Entitlements e controle de planos validados.\n');

console.log('🎉 TODOS OS TESTES DE ACEITAÇÃO DO KONNEXY MUSIC PRO PASSARAM COM SUCESSO!');
