# Konnexy — Landing Imersiva

A home da Konnexy usa **GSAP + ScrollTrigger + Lenis** com foco em motion guiado por scroll, performance e acessibilidade.

## Arquivos principais

- `src/components/immersive/ImmersiveLanding.tsx` — composição das seções e timelines.
- `src/components/immersive/SmoothScrollProvider.tsx` — Lenis integrado ao ticker do GSAP.
- `src/hooks/useGsapReveal.ts` — hook reutilizável para reveals.
- `src/lib/motion/gsap.ts` — registro centralizado do ScrollTrigger.
- `src/app/globals.css` — integração Lenis e fallback de reduced motion.

## Seções

1. Hero com reveal por linha e parallax.
2. Manifesto com palavras reveladas via scrub.
3. Galeria horizontal pinned no desktop.
4. Galeria nativa com scroll-snap no mobile.
5. Imagem de impacto com scale + clip-path.
6. Contadores acionados por viewport.
7. Cards de serviços com stagger.
8. CTA final e footer.

## Ajustar velocidade das animações

### Scrub

Procure por:

```ts
scrub: 1
```

Valores maiores tornam a animação mais “pesada” e atrasada em relação ao scroll. Para resposta mais direta, use algo entre `0.5` e `0.8`.

### Hero reveal

Em `Hero()`, ajuste:

```ts
duration: 1.1
stagger: 0.12
```

### Manifesto

A progressão das palavras usa:

```ts
stagger: 0.045
start: "top 72%"
end: "bottom 45%"
```

### Galeria horizontal

O pin é criado somente acima de 768px:

```ts
mm.add("(min-width: 768px)", ...)
```

Para alterar o comprimento do pin, ajuste o `end` no ScrollTrigger da track.

### Zoom

A imagem usa apenas `scale` e `clipPath`:

```ts
scale: 0.82
clipPath: "inset(10% 8% 10% 8% round 2.5rem)"
```

## Mobile

Abaixo de 768px não existe pin horizontal. Os cards usam:

- `overflow-x-auto`
- `scroll-snap-type: x mandatory`
- cards com `snap-center`

## Acessibilidade

Quando `prefers-reduced-motion: reduce` estiver ativo:

- Lenis não é iniciado.
- parallax e pin são desativados.
- reveals ficam em estado estático ou fade simples.
- a navegação continua funcional.

## Imagens e ScrollTrigger

Após o carregamento das imagens é chamado:

```ts
ScrollTrigger.refresh()
```

Isso evita offsets incorretos quando o layout muda depois do carregamento.

## Performance

- Hero usa `priority`.
- Demais imagens usam lazy loading.
- Elementos animados usam `will-change` de forma pontual.
- Motion prioriza `transform` e `opacity`; `clip-path` é usado apenas na seção de zoom.
- O layout mobile evita pinning para reduzir custo de renderização.
