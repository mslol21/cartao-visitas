"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SmoothScrollProvider } from "@/components/immersive/SmoothScrollProvider";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { ensureGsapRegistered } from "@/lib/motion/gsap";

const shell = "mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8";
const sectionY = "py-14 sm:py-16 lg:py-20";

const manifesto =
  "Seu cliente procura compara entra em contato e decide em poucos segundos. A Konnexy conecta presença digital tecnologia e conversão para transformar atenção em oportunidade real.";

const products = [
  {
    name: "Konnexy Menu",
    category: "Food & Delivery",
    title: "Cardápio digital com operação de verdade por trás.",
    description:
      "Cardápio, pedidos, retirada e delivery com um fluxo pensado para restaurantes, lanchonetes e operações de alimentação.",
    image: "/catalogo.png",
    href: "https://menu.konnexy.com.br",
    domain: "menu.konnexy.com.br",
    features: ["Cardápio digital", "Pedidos", "KDS", "Delivery e retirada"],
  },
  {
    name: "Konnexy Tag",
    category: "NFC & QR",
    title: "Do atendimento físico para o digital em um toque.",
    description:
      "NFC e QR Code para avaliações no Google, WhatsApp, redes sociais, links profissionais e experiências phygital.",
    image: "/link.png",
    href: "https://tag.konnexy.com.br",
    domain: "tag.konnexy.com.br",
    features: ["NFC", "QR Code", "Google", "Link profissional"],
  },
  {
    name: "Konnexy Agenda",
    category: "Agenda & Booking",
    title: "Agendamento simples para quem atende por horário.",
    description:
      "Uma experiência de agendamento para salões, barbearias, clínicas, pet shops e prestadores de serviço.",
    image: "/pet.png",
    href: "https://agenda.konnexy.com.br",
    domain: "agenda.konnexy.com.br",
    features: ["Agenda online", "Horários", "Serviços", "Atendimento"],
  },
  {
    name: "Konnexy PDV",
    category: "PDV & Gestão",
    title: "Venda, estoque e caixa em uma operação integrada.",
    description:
      "PDV para pequenos negócios com estoque, caixa, relatórios, operadores e operação offline com sincronização.",
    image: "/fabrica.png",
    href: "https://pdv.konnexy.com.br",
    domain: "pdv.konnexy.com.br",
    features: ["PDV", "Estoque", "Caixa", "Offline + sync"],
  },
] as const;

const services = [
  {
    title: "Criação de sites",
    description: "Sites e landing pages profissionais, responsivos e preparados para conversão.",
    href: "/servicos/criacao-de-sites",
  },
  {
    title: "Google & SEO local",
    description: "Estrutura para melhorar presença nas buscas locais e no Google Maps.",
    href: "/servicos/otimizacao-perfil-google",
  },
  {
    title: "Tráfego pago",
    description: "Campanhas conectadas à oferta, página de destino e atendimento.",
    href: "/servicos/trafego-pago",
  },
  {
    title: "Sistemas web",
    description: "Soluções personalizadas para organizar processos e operação.",
    href: "/servicos/sistemas-web",
  },
  {
    title: "Link profissional",
    description: "WhatsApp, localização, redes e portfólio em um único endereço.",
    href: "/servicos/link-profissional",
  },
  {
    title: "NFC & QR Code",
    description: "Experiências phygital para avaliações, contatos e acessos rápidos.",
    href: "/servicos/nfc-qr-code",
  },
] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] ${light ? "text-slate-500" : "text-cyan-300"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-blue-600" : "bg-cyan-300"}`} />
      {children}
    </div>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const supporting = gsap.utils.toArray<HTMLElement>("[data-hero-support]");

      if (reduced) {
        gsap.set([...lines, ...supporting], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.1, ease: "power3.out" },
      );

      gsap.fromTo(
        supporting,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, delay: 0.3, ease: "power3.out" },
      );

      if (visualRef.current) {
        gsap.to(visualRef.current, {
          yPercent: 8,
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
    <section ref={sectionRef} className="relative min-h-[88svh] overflow-hidden bg-[#03050d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(37,99,235,.28),transparent_30%),radial-gradient(circle_at_15%_18%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_86%_78%,rgba(217,70,239,.11),transparent_25%),radial-gradient(circle_at_28%_88%,rgba(124,58,237,.10),transparent_26%),linear-gradient(180deg,#03050d_0%,#050916_58%,#070515_100%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:28px_28px]" />

      <div ref={visualRef} className="pointer-events-none absolute right-[-6%] top-[16%] h-[58%] w-[64%] max-w-[760px] will-change-transform sm:right-[3%]">
        <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-[95px] sm:bg-blue-500/15" />
        <Image
          src="/images/koi_hero.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 76vw, 760px"
          className="object-contain opacity-30 mix-blend-screen"
        />
      </div>

      <header className={`${shell} relative z-20 flex items-center justify-between py-5 sm:py-6`}>
        <Link href="/" className="flex items-center gap-3" aria-label="Konnexy - página inicial">
          <Image src="/logo.png" alt="Konnexy" width={44} height={44} priority className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
          <div className="leading-none">
            <div className="text-base font-black tracking-tight sm:text-lg">Konnexy</div>
            <div className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:block">Soluções web & tecnologia</div>
          </div>
        </Link>

        <Button asChild variant="outline" className="h-10 rounded-full border-cyan-300/35 bg-cyan-300/[0.06] px-4 text-xs font-bold text-white shadow-[0_0_24px_rgba(34,211,238,.14)] transition hover:border-cyan-200/70 hover:bg-cyan-300/[0.12] hover:shadow-[0_0_30px_rgba(34,211,238,.24)] hover:text-white">
          <a href="https://wa.me/5516991551200" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </Button>
      </header>

      <div className={`${shell} relative z-10 flex min-h-[calc(88svh-84px)] items-end pb-12 pt-12 sm:pb-16 lg:pb-16`}>
        <div className="w-full max-w-5xl">
          <div data-hero-support>
            <Eyebrow>Conecta • Organiza • Vende</Eyebrow>
          </div>

          <h1 className="mt-5 text-[clamp(2.65rem,6.2vw,5.35rem)] font-black leading-[0.94] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.08em]"><span data-hero-line className="block will-change-transform">Tecnologia</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-hero-line className="block will-change-transform">que conecta</span></span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line className="block bg-gradient-to-r from-cyan-300 via-blue-400 via-60% to-fuchsia-400 bg-clip-text text-transparent will-change-transform">
                negócios ao digital.
              </span>
            </span>
          </h1>

          <div data-hero-support className="mt-6 grid gap-5 border-t border-white/10 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Produtos próprios e serviços digitais em um único ecossistema: Menu, Tag, Agenda, PDV, sites, presença no Google, tráfego pago e soluções sob medida.
            </p>
            <Button asChild variant="ghost" className="h-auto w-fit p-0 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-transparent hover:text-cyan-300">
              <a href="#sobre">Explorar <ArrowDown className="ml-2 h-4 w-4" /></a>
            </Button>
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-word]");
      if (reduced) {
        gsap.set(targets, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 72%",
            end: "bottom 48%",
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="sobre" ref={ref} className={`${sectionY} relative overflow-hidden border-y border-cyan-300/10 bg-[#060817] text-white`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_25%,rgba(34,211,238,.10),transparent_25%),radial-gradient(circle_at_88%_75%,rgba(217,70,239,.09),transparent_28%)]" />
      <div className={`${shell} relative`}>
        <Eyebrow>Mais do que presença digital</Eyebrow>
        <p className="mt-7 max-w-4xl text-[clamp(1.75rem,3.7vw,3.45rem)] font-black leading-[1.06] tracking-[-0.035em]">
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

function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !viewportRef.current || !trackRef.current) return;
    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const mm = gsap.matchMedia();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mm.add("(min-width: 1280px)", () => {
      if (reduced || !pinRef.current || !viewportRef.current || !trackRef.current) return;

      const getDistance = () => Math.max(0, trackRef.current!.scrollWidth - viewportRef.current!.clientWidth);

      const tween = gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${Math.max(getDistance() * 0.9, window.innerHeight)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-product-media]", trackRef.current).forEach((media) => {
        gsap.fromTo(
          media,
          { xPercent: -3 },
          {
            xPercent: 3,
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

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="produtos" className="relative overflow-hidden bg-[#050711] text-white">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-fuchsia-500/[0.08] blur-[130px]" />
      <div className={`${shell} ${sectionY} relative pb-10 sm:pb-12 lg:pb-14`}>
        <Eyebrow>Produtos Konnexy</Eyebrow>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <h2 className="max-w-3xl text-[clamp(2.1rem,4.1vw,3.8rem)] font-black leading-[0.98] tracking-[-0.045em]">
            Um ecossistema para organizar, atender e vender melhor.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">
            Menu, Tag, Agenda e PDV têm seus próprios subdomínios, mas compartilham a mesma marca, linguagem e proposta de simplificar a rotina de pequenos negócios.
          </p>
        </div>
      </div>

      <div ref={pinRef} className="xl:min-h-[72vh]">
        <div ref={viewportRef} className="overflow-hidden xl:flex xl:min-h-[72vh] xl:items-center">
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto px-5 pb-16 pt-2 [scroll-snap-type:x_mandatory] sm:gap-6 sm:px-6 xl:w-max xl:gap-7 xl:overflow-visible xl:px-[max(2rem,calc((100vw-72rem)/2+2rem))] xl:pb-0 xl:pt-0"
          >
            {products.map((product, index) => (
              <article
                key={product.name}
                className="group relative my-5 min-w-[88vw] max-w-[88vw] snap-center overflow-hidden rounded-[24px] border border-cyan-300/20 bg-[#0a0d17]/95 shadow-[0_0_0_1px_rgba(59,130,246,.08),0_0_38px_rgba(34,211,238,.10),0_22px_55px_rgba(0,0,0,.38)] transition duration-500 hover:border-cyan-300/45 hover:shadow-[0_0_0_1px_rgba(34,211,238,.16),0_0_50px_rgba(34,211,238,.18),0_25px_60px_rgba(0,0,0,.42)] sm:min-w-[68vw] sm:max-w-[68vw] xl:min-w-[46vw] xl:max-w-[46vw]"
              >
                <div className="grid xl:grid-cols-[1.1fr_.9fr]">
                  <div className="relative min-h-[250px] overflow-hidden sm:min-h-[320px] xl:min-h-[380px]">
                    <div data-product-media className="absolute -inset-[4%] will-change-transform">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 1023px) 88vw, 40vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d17] via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0a0d17]/70" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-6 xl:p-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-300">{product.name}</span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-black leading-[1.06] tracking-[-0.03em] sm:text-3xl">{product.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>

                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {product.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <div className="mb-4 font-mono text-[11px] text-slate-500">{product.domain}</div>
                      <Button asChild className="h-11 rounded-full border border-cyan-200/40 bg-cyan-300 px-5 text-xs font-black text-[#04111b] shadow-[0_0_24px_rgba(34,211,238,.18)] transition hover:bg-cyan-200 hover:shadow-[0_0_34px_rgba(34,211,238,.28)]">
                        <a href={product.href} target="_blank" rel="noopener noreferrer">
                          Acessar produto <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !imageRef.current || !copyRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, clipPath: "inset(7% 5% 7% 5% round 32px)" },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        copyRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 62%",
            end: "top 38%",
            scrub: 1,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#03050d] py-16 text-white sm:py-20 lg:py-24">
      <div className={shell}>
        <div ref={imageRef} className="relative h-[56vh] min-h-[420px] max-h-[640px] overflow-hidden rounded-[28px] border border-blue-400/20 shadow-[0_0_0_1px_rgba(34,211,238,.08),0_0_54px_rgba(37,99,235,.16)] will-change-transform">
        <Image
          src="/images/koi_hero.png"
          alt="Identidade visual Konnexy"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover object-center opacity-45"
        />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,.12),transparent_30%),linear-gradient(180deg,rgba(3,5,13,.12),rgba(3,5,13,.9)_92%)]" />
          <div ref={copyRef} className="absolute inset-x-0 bottom-0 z-10 p-6 will-change-transform sm:p-8 lg:p-10">
        <Eyebrow>Ecossistema conectado</Eyebrow>
        <h2 className="mt-4 max-w-4xl text-[clamp(2.35rem,4.7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
          Do físico ao digital. Do clique ao cliente.
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          A Konnexy conecta presença, atendimento e operação para reduzir atrito entre o negócio e quem quer comprar.
        </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Numbers() {
  const ref = useRef<HTMLElement>(null);
  const values = [
    { value: 4, suffix: "", label: "produtos próprios no ecossistema Konnexy" },
    { value: 6, suffix: "+", label: "frentes de serviço para presença, aquisição e operação" },
    { value: 1, suffix: "", label: "marca conectando tecnologia e negócio" },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = Number(el.dataset.counter || "0");
        if (reduced) {
          el.textContent = String(target);
          return;
        }

        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={`${sectionY} border-y border-violet-400/10 bg-[#08091a] text-white`}>
      <div className={shell}>
        <Eyebrow>Estrutura Konnexy</Eyebrow>
        <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {values.map((item) => (
            <div key={item.label} className="border-t border-cyan-300/20 pt-5">
              <div className="text-[clamp(3.1rem,5.6vw,5.2rem)] font-black leading-none tracking-[-0.05em]">
                <span data-counter={item.value}>0</span>{item.suffix}
              </div>
              <p className="mt-4 max-w-xs text-sm font-semibold leading-6 text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, { selector: "[data-service-card]", y: 32, stagger: 0.07, start: "top 80%" });

  return (
    <section ref={ref} id="servicos" className={`${sectionY} border-t border-white/10 bg-[#050711] text-white`}>
      <div className={shell}>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <Eyebrow>Serviços</Eyebrow>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.05rem,4vw,3.7rem)] font-black leading-[0.98] tracking-[-0.045em]">
              Tecnologia com função comercial.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">
            O serviço começa pela necessidade do negócio. A partir disso, conectamos apenas o que faz sentido para presença, aquisição, atendimento ou operação.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              data-service-card
              key={service.title}
              href={service.href}
              className="group min-h-[190px] rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(13,18,32,.96),rgba(8,10,25,.94))] p-5 opacity-0 shadow-[0_0_26px_rgba(37,99,235,.06)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_0_34px_rgba(34,211,238,.13),0_0_48px_rgba(124,58,237,.08)] sm:p-6"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black text-slate-600">0{index + 1}</span>
                  <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{service.description}</p>
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
  useGsapReveal(ref, { selector: "[data-final]", y: 36, stagger: 0.1, start: "top 78%" });

  return (
    <section ref={ref} className={`${sectionY} relative overflow-hidden border-y border-fuchsia-400/15 bg-[#080817] text-white`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_80%_22%,rgba(217,70,239,.16),transparent_28%),radial-gradient(circle_at_62%_100%,rgba(245,158,11,.08),transparent_30%)]" />
      <div className={`${shell} relative`}>
        <div data-final className="opacity-0"><Eyebrow>Próximo passo</Eyebrow></div>
        <h2 data-final className="mt-4 max-w-4xl text-[clamp(2.35rem,4.7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em] opacity-0">
          Seu negócio já existe. Agora faça ele ser encontrado.
        </h2>
        <p data-final className="mt-5 max-w-xl text-sm font-medium leading-6 text-slate-300 opacity-0 sm:text-base">
          Conte como seu negócio funciona hoje. A Konnexy identifica os principais pontos de atrito e indica uma solução sem empurrar um pacote genérico.
        </p>

        <div data-final className="mt-7 flex flex-wrap gap-3 opacity-0">
          <Button asChild className="h-12 rounded-full border border-emerald-300/30 bg-[#25D366] px-6 text-sm font-black text-[#04110a] shadow-[0_0_28px_rgba(37,211,102,.18)] transition hover:bg-[#34df76] hover:shadow-[0_0_38px_rgba(37,211,102,.28)]">
            <a href="https://wa.me/5516991551200?text=Olá,%20quero%20uma%20análise%20do%20meu%20negócio." target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Quero uma análise
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full border-cyan-300/25 bg-cyan-300/[0.04] px-6 text-sm font-black text-white hover:border-cyan-300/45 hover:bg-cyan-300/[0.09] hover:text-white">
            <Link href="/servicos">Ver todos os serviços <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#03050d] py-10 text-white sm:py-12">
      <div className={`${shell} grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end`}>
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Konnexy" width={42} height={42} className="h-10 w-10 object-contain" />
            <div>
              <div className="text-lg font-black">Konnexy</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Conecta • Organiza • Vende</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            Produtos e soluções digitais para pequenos negócios conectarem presença, atendimento e operação.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
          <Link href="/servicos" className="transition hover:text-white">Serviços</Link>
          <a href="https://menu.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Menu</a>
          <a href="https://tag.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Tag</a>
          <a href="https://agenda.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Agenda</a>
          <a href="https://pdv.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">PDV</a>
        </div>
      </div>
    </footer>
  );
}


function QuickNav() {
  return (
    <nav className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 rounded-full border border-cyan-300/20 bg-[#050711]/88 px-2 py-2 shadow-[0_0_34px_rgba(34,211,238,.12),0_18px_48px_rgba(0,0,0,.42)] backdrop-blur-xl lg:flex">
      {[
        ["Início", "#"],
        ["Sobre", "#sobre"],
        ["Produtos", "#produtos"],
        ["Serviços", "#servicos"],
      ].map(([label, href]) => (
        <a
          key={label}
          href={href}
          className="rounded-full px-4 py-2 text-[11px] font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          {label}
        </a>
      ))}
      <a
        href="https://wa.me/5516991551200"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-[11px] font-black text-[#04111b] shadow-[0_0_20px_rgba(34,211,238,.16)]"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Contato
      </a>
    </nav>
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
      <div className="overflow-x-clip bg-[#03050d] font-sans text-white selection:bg-cyan-300/30">
        <Hero />
        <Manifesto />
        <Products />
        <BrandStatement />
        <Numbers />
        <Services />
        <FinalCTA />
        <Footer />
        <QuickNav />
      </div>
    </SmoothScrollProvider>
  );
}
