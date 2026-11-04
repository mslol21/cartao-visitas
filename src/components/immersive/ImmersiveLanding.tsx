"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { SmoothScrollProvider } from "@/components/immersive/SmoothScrollProvider";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ensureGsapRegistered } from "@/lib/motion/gsap";

const manifesto =
  "Seu cliente procura compara entra em contato e decide em poucos segundos. A Konnexy conecta presença digital tecnologia e conversão para transformar atenção em oportunidade real.";

const showcase = [
  {
    eyebrow: "Konnexy Menu",
    title: "Cardápio digital com operação de verdade por trás.",
    copy: "Cardápio, pedidos, retirada e delivery com fluxo pensado para restaurantes, lanchonetes e operações de alimentação.",
    image: "/catalogo.png",
    href: "https://menu.konnexy.com.br",
    domain: "menu.konnexy.com.br",
    tag: "Food & Delivery",
    features: ["Cardápio digital", "Pedidos via WhatsApp", "KDS / operação", "Delivery e retirada"],
  },
  {
    eyebrow: "Konnexy Tag",
    title: "Aproxime. Escaneie. Conecte o cliente ao seu negócio.",
    copy: "NFC e QR Code para avaliações no Google, WhatsApp, redes sociais, links profissionais e experiências phygital.",
    image: "/link.png",
    href: "https://tag.konnexy.com.br",
    domain: "tag.konnexy.com.br",
    tag: "NFC & QR",
    features: ["NFC", "QR Code", "Avaliações Google", "Link profissional"],
  },
  {
    eyebrow: "Konnexy Agenda",
    title: "Agendamento simples para quem atende por horário.",
    copy: "Uma experiência de agendamento pensada para salões, barbearias, clínicas, pet shops e prestadores de serviço.",
    image: "/pet.png",
    href: "https://agenda.konnexy.com.br",
    domain: "agenda.konnexy.com.br",
    tag: "Agenda & Booking",
    features: ["Agenda online", "Horários disponíveis", "Gestão de serviços", "Atendimento organizado"],
  },
  {
    eyebrow: "Konnexy PDV",
    title: "Venda, estoque e caixa em uma operação integrada.",
    copy: "PDV para pequenos negócios com estoque, caixa, relatórios, operadores e operação offline com sincronização.",
    image: "/fabrica.png",
    href: "https://pdv.konnexy.com.br",
    domain: "pdv.konnexy.com.br",
    tag: "PDV & Gestão",
    features: ["PDV", "Estoque", "Caixa", "Offline + sincronização"],
  },
];

const services = [
  ["Criação de sites", "Interfaces profissionais, mobile-first e focadas em conversão.", "/servicos/criacao-de-sites"],
  ["Google & SEO local", "Estrutura para melhorar presença nas buscas e no Maps.", "/servicos/otimizacao-perfil-google"],
  ["Tráfego pago", "Campanhas conectadas à oferta, página e atendimento.", "/servicos/trafego-pago"],
  ["Sistemas web", "Soluções personalizadas para organizar processos e operação.", "/servicos/sistemas-web"],
  ["Link profissional", "WhatsApp, localização, redes e portfólio em um único endereço.", "/servicos/link-profissional"],
  ["NFC & QR Code", "Experiências phygital para avaliações, contato e acesso rápido.", "/servicos/nfc-qr-code"],
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const supporting = gsap.utils.toArray<HTMLElement>("[data-hero-support]");

      if (reduce) {
        gsap.set([...lines, ...supporting], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        lines,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        },
      );

      gsap.fromTo(
        supporting,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          delay: 0.35,
          ease: "power3.out",
        },
      );

      if (visualRef.current) {
        gsap.to(visualRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#03050d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.09),transparent_25%),linear-gradient(180deg,#02040b_0%,#050913_100%)]" />
      <div ref={visualRef} className="absolute inset-x-0 top-[10%] mx-auto h-[72%] max-w-[980px] will-change-transform">
        <div className="absolute inset-0 rounded-[50%] bg-cyan-300/10 blur-[100px]" />
        <Image
          src="/images/koi_hero.png"
          alt="Símbolo Konnexy"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 980px"
          className="object-contain opacity-30 mix-blend-screen"
        />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Konnexy" width={44} height={44} priority className="h-11 w-11 object-contain" />
          <span className="text-lg font-black tracking-tight">Konnexy</span>
        </Link>
        <a
          href="https://wa.me/5516991551200"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.08]"
        >
          Falar no WhatsApp
        </a>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-100px)] max-w-7xl items-end gap-12 px-6 pb-16 pt-20 lg:grid-cols-12 lg:pb-20">
        <div className="lg:col-span-9">
          <span data-hero-support className="mb-6 inline-block text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">
            Conecta • Organiza • Vende
          </span>

          <h1 className="max-w-5xl text-[clamp(3.4rem,9vw,8.8rem)] font-black leading-[0.86] tracking-[-0.065em] text-white">
            <span className="block overflow-hidden pb-[0.08em]"><span data-hero-line className="block will-change-transform">Tecnologia</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-hero-line className="block will-change-transform">que conecta</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-hero-line className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-[#d6b45a] bg-clip-text text-transparent will-change-transform">negócios ao digital.</span></span>
          </h1>

          <div data-hero-support className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Produtos próprios e serviços digitais conectados em um mesmo ecossistema: Menu, Tag, Agenda, PDV, sites, Google, tráfego pago e soluções sob medida.
            </p>
            <a
              href="#manifesto"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white"
            >
              Explorar <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div data-hero-support className="hidden justify-self-end lg:block lg:col-span-3">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <span className="h-12 w-px bg-gradient-to-b from-cyan-300 to-transparent" />
            role para descobrir
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const words = useMemo(() => manifesto.split(" "), []);

  useEffect(() => {
    if (!ref.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-word]");
      if (reduce) {
        gsap.set(targets, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 72%",
            end: "bottom 45%",
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={ref} className="bg-[#f2f0e9] px-6 py-28 text-[#07111f] md:py-40">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-xs font-black uppercase tracking-[0.24em] text-slate-500">O problema não é estar online.</div>
        <p className="max-w-5xl text-[clamp(2.2rem,6.5vw,6.2rem)] font-black leading-[0.98] tracking-[-0.05em]">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} data-word className="mr-[0.22em] inline-block will-change-[opacity]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function HorizontalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const mm = gsap.matchMedia();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mm.add("(min-width: 768px)", () => {
      if (reduce || !sectionRef.current || !trackRef.current) return;

      const distance = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      const tween = gsap.to(trackRef.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${Math.max(distance, window.innerWidth)}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-card-media]", trackRef.current).forEach((media) => {
        gsap.fromTo(
          media,
          { xPercent: -4 },
          {
            xPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: media,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: 1,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="solucoes" className="overflow-hidden bg-[#050711] py-24 text-white md:min-h-screen md:py-0">
      <div className="mx-auto max-w-7xl px-6 pb-10 md:absolute md:left-1/2 md:top-12 md:z-20 md:w-full md:-translate-x-1/2">
        <span className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Produtos Konnexy</span>
        <h2 className="mt-3 max-w-4xl text-[clamp(2.2rem,5vw,4.8rem)] font-black leading-[0.96] tracking-[-0.045em]">
          Um ecossistema de produtos para organizar, atender e vender melhor.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
          Cada produto possui seu próprio subdomínio oficial, mas todos fazem parte da mesma estrutura Konnexy.
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto px-6 pb-5 pt-3 [scroll-snap-type:x_mandatory] md:w-max md:items-center md:gap-8 md:overflow-visible md:px-[8vw] md:pb-0 md:pt-44"
      >
        {showcase.map((item) => (
          <article
            key={item.eyebrow}
            className="group relative min-w-[86vw] max-w-[86vw] snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0d17] md:min-w-[68vw] md:max-w-[68vw]"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div data-card-media className="absolute -inset-[5%] will-change-transform">
                <Image
                  src={item.image}
                  alt={item.eyebrow}
                  fill
                  sizes="(max-width: 767px) 86vw, 68vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-transparent to-transparent" />
            </div>
            <div className="relative grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">{item.eyebrow}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{item.tag}</span>
                </div>
                <h3 className="mt-3 max-w-3xl text-2xl font-black leading-tight sm:text-4xl">{item.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{item.copy}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold text-slate-300">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-5 font-mono text-[11px] text-slate-500">{item.domain}</div>
              </div>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white">
                Acessar produto <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ZoomFeature() {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !imageRef.current || !copyRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([imageRef.current, copyRef.current], { opacity: 1 });
        return;
      }

      gsap.fromTo(
        imageRef.current,
        { scale: 0.82, clipPath: "inset(10% 8% 10% 8% round 2.5rem)" },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "bottom 35%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 55%",
            end: "top 30%",
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[120vh] overflow-hidden bg-[#03050d] text-white">
      <div ref={imageRef} className="sticky top-0 h-screen will-change-transform">
        <Image
          src="/images/landing/demo_miltonbarros.png"
          alt="Projeto digital desenvolvido pela Konnexy"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,13,.15),rgba(3,5,13,.78))]" />
      </div>
      <div ref={copyRef} className="pointer-events-none absolute inset-x-0 bottom-20 z-10 mx-auto max-w-7xl px-6 will-change-transform">
        <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d6b45a]">Phygital por essência</span>
        <h2 className="mt-4 max-w-5xl text-[clamp(3rem,8vw,7.4rem)] font-black leading-[0.9] tracking-[-0.055em]">
          Do físico ao digital. Do clique ao cliente.
        </h2>
      </div>
    </section>
  );
}

function Numbers() {
  const ref = useRef<HTMLElement>(null);
  const values = [
    { value: 7, suffix: "+", label: "frentes de solução" },
    { value: 3, suffix: "", label: "camadas conectadas: presença, atendimento e operação" },
    { value: 1, suffix: "", label: "objetivo: reduzir atrito entre negócio e cliente" },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = Number(el.dataset.counter || "0");
        if (reduce) {
          el.textContent = String(target);
          return;
        }
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-[#eef0f3] px-6 py-28 text-[#07111f] md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-3">
          {values.map((item) => (
            <div key={item.label} className="border-t border-slate-300 pt-5">
              <div className="text-[clamp(4.5rem,9vw,8rem)] font-black leading-none tracking-[-0.06em]">
                <span data-counter={item.value}>0</span>{item.suffix}
              </div>
              <p className="mt-4 max-w-xs text-sm font-semibold leading-6 text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-service-card]", y: 42, stagger: 0.08, start: "top 78%" });

  return (
    <section ref={ref} className="bg-[#050711] px-6 py-28 text-white md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Serviços</span>
            <h2 className="mt-4 text-[clamp(2.8rem,6vw,6rem)] font-black leading-[0.94] tracking-[-0.05em]">Tecnologia com função comercial.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">
            Sem pacote genérico. A solução começa pela necessidade real do negócio e conecta apenas o que faz sentido para o momento da operação.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, description, href], index) => (
            <Link
              data-service-card
              key={title}
              href={href}
              className="group min-h-[270px] bg-[#080b14] p-7 opacity-0 will-change-transform hover:bg-[#0c1220]"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black text-slate-600">0{index + 1}</span>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-final]", y: 52, stagger: 0.12, start: "top 72%" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#d6b45a] px-6 py-28 text-[#07111f] md:py-36">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.28),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div data-final className="text-[10px] font-black uppercase tracking-[0.28em] opacity-0">Próximo passo</div>
        <h2 data-final className="mt-5 max-w-5xl text-[clamp(3.3rem,8vw,8rem)] font-black leading-[0.88] tracking-[-0.06em] opacity-0">
          Seu negócio já existe. Agora faça ele ser encontrado.
        </h2>
        <div data-final className="mt-10 flex flex-wrap gap-4 opacity-0">
          <a
            href="https://wa.me/5516991551200?text=Olá,%20quero%20uma%20análise%20do%20meu%20negócio."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#07111f] px-6 py-4 text-sm font-black text-white"
          >
            <MessageCircle className="h-5 w-5" /> Quero uma análise
          </a>
          <Link href="/servicos" className="inline-flex items-center gap-3 rounded-full border border-[#07111f]/30 px-6 py-4 text-sm font-black">
            Ver serviços <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050d] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Konnexy" width={42} height={42} className="h-10 w-10 object-contain" />
            <span className="text-xl font-black">Konnexy</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">Soluções web e tecnologia para negócios que querem conectar presença, atendimento e operação.</p>
        </div>
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-600">Conecta • Organiza • Vende</div>
      </div>
    </footer>
  );
}

function RefreshAfterImages() {
  useEffect(() => {
    const { ScrollTrigger } = ensureGsapRegistered();
    const images = Array.from(document.images);
    const pending = images.filter((image) => !image.complete);

    if (!pending.length) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    let remaining = pending.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    pending.forEach((image) => {
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });

    return () => {
      pending.forEach((image) => {
        image.removeEventListener("load", done);
        image.removeEventListener("error", done);
      });
    };
  }, []);

  return null;
}

export function ImmersiveLanding() {
  return (
    <SmoothScrollProvider>
      <RefreshAfterImages />
      <div className="overflow-x-clip bg-[#03050d] font-sans">
        <Hero />
        <Manifesto />
        <HorizontalShowcase />
        <ZoomFeature />
        <Numbers />
        <Services />
        <FinalCTA />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
