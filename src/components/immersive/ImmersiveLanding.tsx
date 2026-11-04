"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ExternalLink, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SmoothScrollProvider } from "@/components/immersive/SmoothScrollProvider";
import { ensureGsapRegistered } from "@/lib/motion/gsap";

const shell = "mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8";
const whatsappHref =
  "https://wa.me/5516991551200?text=Olá,%20quero%20conhecer%20as%20soluções%20da%20Konnexy%20para%20meu%20negócio.";

const cases = [
  {
    number: "01",
    title: "Konnexy Menu",
    category: "Food & Delivery",
    image: "/catalogo.png",
    href: "https://menu.konnexy.com.br",
    copy: "Cardápio, pedidos, retirada e delivery em uma experiência simples para quem vende comida todos os dias.",
  },
  {
    number: "02",
    title: "Konnexy Tag",
    category: "NFC & QR",
    image: "/link.png",
    href: "https://tag.konnexy.com.br",
    copy: "Aproximação e QR Code para avaliações, contatos, portfólio e presença digital no ponto físico.",
  },
  {
    number: "03",
    title: "Konnexy Agenda",
    category: "Booking",
    image: "/pet.png",
    href: "https://agenda.konnexy.com.br",
    copy: "Agendamento online para negócios que trabalham com horários, serviços e atendimento recorrente.",
  },
  {
    number: "04",
    title: "Konnexy PDV",
    category: "Retail Ops",
    image: "/fabrica.png",
    href: "https://pdv.konnexy.com.br",
    copy: "Venda, caixa e estoque organizados para pequenos negócios que precisam operar sem complicação.",
  },
] as const;

const serviceRows = [
  {
    number: "01",
    title: "Ser encontrado",
    copy: "Perfil da Empresa no Google, SEO local e mídia paga para quem precisa aparecer quando o cliente já está procurando.",
    href: "/servicos/otimizacao-perfil-google",
  },
  {
    number: "02",
    title: "Apresentar melhor",
    copy: "Sites, landing pages e links profissionais para transformar informação solta em uma presença clara e confiável.",
    href: "/servicos/criacao-de-sites",
  },
  {
    number: "03",
    title: "Organizar a operação",
    copy: "Catálogos, cardápios, NFC, QR Code e sistemas web para reduzir tarefas manuais e facilitar o atendimento.",
    href: "/servicos/sistemas-web",
  },
] as const;

function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-soft-light"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.65'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    const { gsap } = ensureGsapRegistered();
    const state = { value: 0 };
    const tween = gsap.to(state, {
      value: 100,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => setProgress(Math.round(state.value)),
      onComplete: () => {
        if (!ref.current) return setVisible(false);
        gsap.to(ref.current, {
          yPercent: -100,
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => setVisible(false),
        });
      },
    });

    return () => tween.kill();
  }, []);

  if (!visible) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex items-end bg-[#0A0A0A] p-5 text-[#F1EEE7] sm:p-8">
      <div className="flex w-full items-end justify-between border-t border-[#F1EEE7]/20 pt-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#F1EEE7]/55">Konnexy / loading</div>
        <div className="text-5xl font-black tracking-[-0.05em] sm:text-7xl">{progress.toString().padStart(3, "0")}</div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !dotRef.current || !labelRef.current) return;

    const { gsap } = ensureGsapRegistered();
    const xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.22, ease: "power3.out" });
    const scaleTo = gsap.quickTo(dotRef.current, "scale", { duration: 0.2, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      labelRef.current!.textContent = target.dataset.cursor || "Ver";
      scaleTo(1.6);
    };
    const onOut = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      labelRef.current!.textContent = "";
      scaleTo(1);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F1EEE7] text-[#0A0A0A] mix-blend-difference md:flex"
    >
      <span ref={labelRef} className="font-mono text-[8px] font-bold uppercase tracking-[0.12em]" />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Cases", "#cases"],
    ["Serviços", "#servicos"],
    ["Processo", "#processo"],
    ["Contato", "#contato"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#F1EEE7]/10 bg-[#0A0A0A]/85 backdrop-blur-md">
      <div className={`${shell} flex h-16 items-center justify-between`}>
        <Link href="/" className="flex items-center gap-3" data-cursor="Home">
          <Image src="/logo.png" alt="Konnexy" width={38} height={38} priority className="h-9 w-9 object-contain" />
          <span className="text-sm font-black uppercase tracking-[0.08em] text-[#F1EEE7]">Konnexy</span>
        </Link>

        <nav className="hidden gap-7 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={label} href={href} data-cursor={label} className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1EEE7]/55 transition hover:text-[#F1EEE7]">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="h-10 rounded-none border border-[#D6A84B] bg-transparent px-4 text-xs font-black uppercase tracking-[0.08em] text-[#D6A84B] shadow-none hover:bg-[#D6A84B] hover:text-[#0A0A0A]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="Chamar">WhatsApp</a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center border border-[#F1EEE7]/15 text-[#F1EEE7] lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#F1EEE7]/10 bg-[#0A0A0A] lg:hidden">
          <nav className={`${shell} flex flex-col py-4`}>
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className="border-b border-[#F1EEE7]/10 py-4 text-sm font-black uppercase tracking-[0.08em] text-[#F1EEE7]">
                {label}
              </a>
            ))}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-4 bg-[#D6A84B] px-4 py-3 text-center text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A]">
              Conversar pelo WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { gsap, SplitText } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector("[data-hero-title]");
      const support = gsap.utils.toArray<HTMLElement>("[data-hero-support]", ref.current!);
      if (!title) return;

      if (reduced) {
        gsap.set([title, ...support], { opacity: 1, y: 0 });
        return;
      }

      const split = SplitText.create(title, { type: "lines" });
      gsap.set(split.lines, { overflow: "hidden" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1 })
        .fromTo(support, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, stagger: 0.06 }, "-=0.58");

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 9,
          scale: 1.035,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      return () => split.revert();
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[92svh] overflow-hidden bg-[#0A0A0A] pt-16 text-[#F1EEE7]">
      <div className={`${shell} grid min-h-[calc(92svh-4rem)] items-end gap-10 py-12 lg:grid-cols-12 lg:py-16`}>
        <div className="relative z-10 lg:col-span-8">
          <div data-hero-support className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D6A84B] opacity-0">
            Konnexy / São Paulo / digital para negócios reais
          </div>
          <h1 data-hero-title className="max-w-[1050px] text-[clamp(3.6rem,8.2vw,8.2rem)] font-black leading-[0.84] tracking-[-0.065em]">
            Tecnologia para negócios que acontecem no mundo <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontWeight: 400 }}>real.</span>
          </h1>
          <div data-hero-support className="mt-8 grid max-w-3xl gap-6 border-t border-[#F1EEE7]/20 pt-5 opacity-0 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-2xl text-base leading-7 text-[#F1EEE7]/65">
              Sites, presença no Google, sistemas e produtos digitais feitos para aproximar pequenos negócios de quem já quer comprar, chamar ou agendar.
            </p>
            <a href="#cases" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1EEE7]" data-cursor="Ver">
              Ver cases <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-4 lg:pb-8">
          <div ref={imageRef} className="relative ml-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden will-change-transform">
            <Image src="/images/landing/demo_miltonbarros.png" alt="Projeto real desenvolvido pela Konnexy" fill priority sizes="(max-width: 1024px) 70vw, 360px" className="object-cover contrast-110" />
          </div>
          <div className="absolute -left-4 bottom-5 bg-[#D6A84B] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#0A0A0A] lg:-left-10">
            projeto real / web
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const words = useMemo(
    () => "Seu cliente não precisa entender tecnologia. Precisa encontrar, escolher, chamar e comprar sem perder tempo.".split(" "),
    [],
  );

  useEffect(() => {
    if (!ref.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-word]", ref.current!);
      if (reduced) return gsap.set(targets, { opacity: 1 });

      gsap.fromTo(
        targets,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.035,
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
    <section ref={ref} className="bg-[#F1EEE7] py-20 text-[#0A0A0A] sm:py-24 lg:py-28">
      <div className={shell}>
        <div className="mb-8 flex items-center justify-between border-b border-[#0A0A0A]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>01 / manifesto</span><span>menos atrito, mais clareza</span>
        </div>
        <p className="max-w-5xl text-[clamp(2.3rem,5.6vw,5.5rem)] font-black leading-[0.98] tracking-[-0.045em]">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} data-word className="mr-[0.2em] inline-block">{word}</span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const track = ref.current.querySelector("[data-marquee-track]");
    if (!track) return;

    const tween = gsap.to(track, { xPercent: -50, duration: 22, repeat: -1, ease: "none" });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const direction = self.getVelocity() < 0 ? -1 : 1;
        const speed = Math.min(2.2, Math.max(0.75, Math.abs(self.getVelocity()) / 1600));
        gsap.to(tween, { timeScale: direction * speed, duration: 0.35, ease: "power3.out" });
      },
    });

    return () => {
      tween.kill();
      st.kill();
    };
  }, []);

  const label = "MENU / TAG / AGENDA / PDV / SITES / GOOGLE / SISTEMAS / ";
  return (
    <div ref={ref} className="overflow-hidden border-y border-[#F1EEE7]/15 bg-[#0A0A0A] py-5 text-[#F1EEE7]">
      <div data-marquee-track className="flex w-max whitespace-nowrap text-[clamp(2.4rem,5vw,5.2rem)] font-black uppercase tracking-[-0.04em]">
        <span className="pr-6">{label}</span><span className="pr-6">{label}</span>
      </div>
    </div>
  );
}

function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !viewportRef.current || !trackRef.current) return;
    const { gsap } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1280px)", () => {
      if (reduced || !viewportRef.current || !trackRef.current) return;
      const distance = () => Math.max(0, trackRef.current!.scrollWidth - viewportRef.current!.clientWidth);
      const skewTo = gsap.quickTo(trackRef.current, "skewX", { duration: 0.35, ease: "power3.out" });

      const tween = gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.max(distance(), window.innerHeight)}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => skewTo(gsap.utils.clamp(-1.4, 1.4, self.getVelocity() / -1800)),
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-case-image]", trackRef.current).forEach((media) => {
        gsap.fromTo(media, { xPercent: -3 }, {
          xPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: media,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: 1,
          },
        });
      });

      return () => tween.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="cases" ref={sectionRef} className="relative bg-[#0A0A0A] text-[#F1EEE7] xl:min-h-screen">
      <div className={`${shell} py-16 lg:py-20 xl:absolute xl:left-1/2 xl:top-0 xl:z-20 xl:-translate-x-1/2`}>
        <div className="flex items-center justify-between border-b border-[#F1EEE7]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>02 / produtos</span><span>arraste ou role</span>
        </div>
        <h2 className="mt-5 max-w-3xl text-[clamp(2.4rem,4.8vw,4.7rem)] font-black leading-[0.96] tracking-[-0.045em]">
          Quatro produtos. Uma ideia: <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontWeight: 400 }}>tirar atrito</span> da rotina.
        </h2>
      </div>

      <div ref={viewportRef} className="overflow-hidden xl:flex xl:min-h-screen xl:items-center">
        <div ref={trackRef} className="flex gap-5 overflow-x-auto px-5 pb-14 [scroll-snap-type:x_mandatory] sm:px-6 xl:w-max xl:gap-10 xl:overflow-visible xl:px-[max(2rem,calc((100vw-74rem)/2+2rem))] xl:pb-0 xl:pt-48">
          {cases.map((item) => (
            <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" data-cursor="Ver"
              className="group grid min-w-[88vw] max-w-[88vw] snap-center border-t border-[#F1EEE7]/25 pt-3 sm:min-w-[70vw] sm:max-w-[70vw] xl:min-w-[58vw] xl:max-w-[58vw] xl:grid-cols-[1.1fr_.9fr] xl:gap-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171717] xl:aspect-[5/4]">
                <div data-case-image className="absolute -inset-[3%] will-change-transform">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 1279px) 88vw, 36vw" loading="lazy" className="object-cover grayscale-[20%] contrast-110 transition duration-700 group-hover:scale-[1.02]" />
                </div>
              </div>
              <div className="flex flex-col justify-between py-5 xl:py-0">
                <div>
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-[#F1EEE7]/45">
                    <span>{item.number}</span><span>{item.category}</span>
                  </div>
                  <h3 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{item.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-6 text-[#F1EEE7]/55">{item.copy}</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#D6A84B]">
                  abrir produto <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FullscreenCase() {
  const ref = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !mediaRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap } = ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.fromTo(mediaRef.current,
        { scale: 0.9, clipPath: "inset(12% 14% 12% 14%)" },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 32%", scrub: 1 },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-[#F1EEE7] py-20 text-[#0A0A0A] sm:py-24">
      <div className={shell}>
        <div className="mb-8 flex items-center justify-between border-b border-[#0A0A0A]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>03 / case real</span><span>site institucional</span>
        </div>
        <div ref={mediaRef} className="relative h-[62vh] min-h-[420px] overflow-hidden will-change-transform sm:h-[72vh]">
          <Image src="/images/landing/demo_clinica.png" alt="Case real de site institucional desenvolvido pela Konnexy" fill sizes="100vw" loading="lazy" className="object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 max-w-2xl bg-[#F1EEE7] p-5 sm:p-7">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#0A0A0A]/55">presença digital / web</div>
            <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Uma presença profissional antes do primeiro contato.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="bg-[#0A0A0A] py-20 text-[#F1EEE7] sm:py-24">
      <div className={shell}>
        <div className="mb-10 flex items-center justify-between border-b border-[#F1EEE7]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>04 / serviços</span><span>comece pelo problema</span>
        </div>
        <div>
          {serviceRows.map((item, index) => (
            <Link key={item.title} href={item.href} data-cursor="Abrir"
              className={`group grid gap-5 border-b border-[#F1EEE7]/15 py-8 transition sm:grid-cols-[80px_1fr_1fr_auto] sm:items-start ${index === 0 ? "border-t" : ""}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D6A84B]">{item.number}</div>
              <h3 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">{item.title}</h3>
              <p className="max-w-lg text-sm leading-6 text-[#F1EEE7]/55">{item.copy}</p>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["01", "entender", "Você mostra como o negócio funciona e onde está o atrito."],
    ["02", "desenhar", "A Konnexy propõe uma solução proporcional à necessidade."],
    ["03", "colocar no ar", "Configuramos, publicamos e mostramos como usar."],
  ];

  return (
    <section id="processo" className="bg-[#D6A84B] py-20 text-[#0A0A0A] sm:py-24">
      <div className={shell}>
        <div className="mb-10 flex items-center justify-between border-b border-[#0A0A0A]/25 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>05 / processo</span><span>sem complicação desnecessária</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-3">
          {steps.map(([number, title, copy]) => (
            <div key={number} className="border-t border-[#0A0A0A]/35 pt-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em]">{number}</div>
              <h3 className="mt-6 text-4xl font-black tracking-[-0.05em]">{title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#0A0A0A]/65">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const { gsap, SplitText } = ensureGsapRegistered();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const title = ref.current!.querySelector("[data-footer-title]");
      if (!title || reduced) return;
      const split = SplitText.create(title, { type: "lines" });
      gsap.fromTo(split.lines, { yPercent: 100, opacity: 0 }, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contato" ref={ref} className="overflow-hidden bg-[#0A0A0A] pt-20 text-[#F1EEE7]">
      <div className={shell}>
        <div className="flex items-center justify-between border-b border-[#F1EEE7]/20 pb-3 font-mono text-[9px] uppercase tracking-[0.16em]">
          <span>06 / contato</span><span>São Paulo + online</span>
        </div>
        <div className="py-14 sm:py-20">
          <div className="max-w-5xl overflow-hidden">
            <h2 data-footer-title className="text-[clamp(3.6rem,9vw,8.6rem)] font-black leading-[0.84] tracking-[-0.065em]">
              Tem um negócio para <span style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontWeight: 400 }}>organizar?</span>
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild className="h-12 rounded-none bg-[#D6A84B] px-5 text-sm font-black uppercase tracking-[0.08em] text-[#0A0A0A] shadow-none hover:bg-[#E3BB60]">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-magnetic data-cursor="Chamar">
                <MessageCircle className="h-4 w-4" /> Conversar pelo WhatsApp
              </a>
            </Button>
            <Link href="/servicos" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1EEE7]/55 hover:text-[#F1EEE7]">
              ver todos os serviços <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-[#F1EEE7]/15 py-7 text-xs text-[#F1EEE7]/45 sm:flex-row sm:items-center sm:justify-between">
          <div>Konnexy — conecta, organiza, vende.</div>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/konnexy.web" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1EEE7]">Instagram</a>
            <a href="https://menu.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1EEE7]">Menu</a>
            <a href="https://tag.konnexy.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-[#F1EEE7]">Tag</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MagneticButtons() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const { gsap } = ensureGsapRegistered();
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = elements.map((element) => {
      const xTo = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
      const move = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * 0.18);
        yTo((event.clientY - (rect.top + rect.height / 2)) * 0.18);
      };
      const leave = () => { xTo(0); yTo(0); };
      element.addEventListener("mousemove", move);
      element.addEventListener("mouseleave", leave);
      return () => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
  return null;
}

function RefreshAfterAssets() {
  useEffect(() => {
    const { ScrollTrigger } = ensureGsapRegistered();
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    const images = Array.from(document.images);
    let pending = images.filter((image) => !image.complete).length;
    if (pending === 0) refresh();
    const done = () => { pending -= 1; if (pending <= 0) refresh(); };
    images.forEach((image) => {
      if (image.complete) return;
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });
    return () => {
      images.forEach((image) => {
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
      <Preloader />
      <CustomCursor />
      <MagneticButtons />
      <RefreshAfterAssets />
      <Grain />
      <div className="overflow-x-clip bg-[#0A0A0A] font-sans selection:bg-[#D6A84B] selection:text-[#0A0A0A]">
        <Header />
        <main>
          <Hero />
          <Manifesto />
          <Marquee />
          <Cases />
          <FullscreenCase />
          <Services />
          <Process />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
