# Konnexy — Landing Editorial

A home da Konnexy usa **Next.js + GSAP + ScrollTrigger + SplitText + Lenis** com direção editorial escura, tipografia autoral e movimento concentrado nos pontos que realmente valorizam o conteúdo.

## Arquivos principais

- `src/components/immersive/ImmersiveLanding.tsx` — estrutura da landing e animações.
- `src/components/immersive/SmoothScrollProvider.tsx` — Lenis sincronizado ao ticker do GSAP.
- `src/lib/motion/gsap.ts` — registro centralizado de ScrollTrigger e SplitText.
- `src/app/page.tsx` — tipografia e metadata da home.

## Estrutura

1. Preloader curto com contador 0–100.
2. Header fixo com menu e CTA.
3. Hero com SplitText + parallax de imagem.
4. Manifesto com palavras acendendo no scroll.
5. Marquee controlado pela velocidade do scroll.
6. Galeria horizontal dos produtos Konnexy no desktop largo.
7. Scroll nativo com snap em telas menores.
8. Case fullscreen com scale + clip-path.
9. Serviços em composição editorial.
10. Processo em três etapas.
11. Footer com reveal tipográfico e CTA.

## Paleta

- Fundo: `#0A0A0A`
- Texto: `#F1EEE7`
- Acento: `#D6A84B`

## Tipografia

A home usa fontes carregadas via `next/font`:

- `Space Grotesk` — interface e corpo.
- `Instrument Serif` — contrastes editoriais.

Elas ficam restritas à home e não alteram as demais rotas.

## Ajustar velocidades

### Preloader

No componente `Preloader()`:

```ts
duration: 0.9
```

E na saída da cortina:

```ts
duration: 0.7
ease: "expo.inOut"
```

### Hero

No `Hero()`:

```ts
duration: 1.05
stagger: 0.1
ease: "expo.out"
```

O parallax usa:

```ts
scrub: 1
yPercent: 9
scale: 1.035
```

### Manifesto

No `Manifesto()`:

```ts
stagger: 0.035
start: "top 72%"
end: "bottom 48%"
scrub: 1
```

### Marquee

No `Marquee()`:

```ts
duration: 22
repeat: -1
```

A velocidade é ajustada dinamicamente com `ScrollTrigger.getVelocity()`.

### Galeria horizontal

O pin só é ativado a partir de:

```ts
(min-width: 1280px)
```

O comprimento do pin é calculado pela largura real da track.

Para reduzir a sensação de movimento, diminua:

```ts
xPercent: 3
```

do parallax interno.

### Fullscreen case

O recorte inicial:

```ts
clipPath: "inset(12% 14% 12% 14%)"
scale: 0.9
```

O estado final:

```ts
clipPath: "inset(0% 0% 0% 0%)"
scale: 1
```

## Cursor e magnetismo

O cursor customizado só funciona em dispositivos com `pointer:fine`.

Elementos interativos podem receber:

```html
data-cursor="Ver"
```

Para magnetismo:

```html
data-magnetic
```

O movimento usa `gsap.quickTo()`, evitando criar tweens novos a cada `mousemove`.

## Mobile e acessibilidade

Quando `prefers-reduced-motion: reduce` estiver ativo:

- Lenis não é iniciado.
- parallax é desativado.
- SplitText não anima.
- marquee não roda.
- pin horizontal é desativado.
- cursor customizado é desativado.

No mobile, a galeria usa scroll horizontal nativo com snap.

## Performance

- Imagem do hero usa `priority`.
- Imagens abaixo da dobra usam lazy loading.
- `ScrollTrigger.refresh()` é executado após fontes e imagens carregarem.
- Motion usa principalmente `transform`, `opacity` e `clip-path`.
- O bundle da home ficou em aproximadamente **62,4 kB**, com First Load JS em aproximadamente **181 kB** no build validado da Vercel.

## Observações

O projeto ainda exibe um aviso de versão:

```
@next/swc 15.5.7
Next.js 15.5.11
```

O aviso não bloqueou o deploy, mas vale alinhar as versões em uma manutenção futura.

A versão atual foi validada por build de produção na Vercel e publicada em:

- `https://konnexy.com.br`
- `https://www.konnexy.com.br`
