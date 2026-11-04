# Konnexy — Landing Comercial

A home da Konnexy foi reorganizada para priorizar **clareza, projetos reais e conversão pelo WhatsApp**.

## Arquivos principais

- `src/components/immersive/ImmersiveLanding.tsx` — conteúdo, seções e animações discretas.
- `src/hooks/useGsapReveal.ts` — reveal reutilizável com GSAP.
- `src/lib/motion/gsap.ts` — registro centralizado do ScrollTrigger.
- `src/app/page.tsx` — metadata e entrada da home.

## Seções

1. Header com navegação e menu mobile.
2. Hero com proposta de valor e CTAs.
3. Soluções organizadas por necessidade.
4. Projetos reais da Konnexy.
5. Como funciona em três etapas.
6. Diferenciais da Konnexy.
7. Perguntas frequentes.
8. CTA final.
9. Footer.

## Editar conteúdo

Os textos, projetos, soluções e FAQ ficam no próprio arquivo:

`src/components/immersive/ImmersiveLanding.tsx`

Procure pelos arrays:

- `solutions`
- `projects`
- `faq`

## Editar contatos

O link principal do WhatsApp fica na constante:

```ts
const whatsappHref = "https://wa.me/..."
```

O Instagram está no footer.

## Editar imagens

Os projetos usam imagens existentes em `public/`.

Troque apenas o valor de `image` no array `projects`, preservando proporções adequadas e textos alternativos.

## Motion

A landing utiliza apenas reveals curtos com o hook `useGsapReveal`.

Para deixar a entrada mais rápida ou mais lenta, ajuste:

```ts
y: 20
stagger: 0.06
start: "top 84%"
```

- `y`: deslocamento vertical inicial.
- `stagger`: intervalo entre elementos.
- `start`: ponto da viewport em que a animação começa.

Não há pin horizontal, scroll artificial obrigatório ou animações longas.

## Acessibilidade

- menu mobile usa botão com `aria-expanded`;
- navegação funciona com âncoras;
- FAQ usa `details/summary` nativos;
- conteúdo essencial permanece visível sem depender de hover;
- `prefers-reduced-motion` continua respeitado pelo hook de motion.

## Performance

- imagem principal usa prioridade;
- imagens abaixo da dobra usam lazy loading;
- não há vídeo obrigatório antes do conteúdo;
- não há animações contínuas pesadas;
- a home usa componentes e bibliotecas já existentes no projeto.
