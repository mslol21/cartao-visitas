"use client";

import Image from "next/image";
import { KONNEXY_PORTFOLIO } from "@/config/konnexy-projects";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SmoothScrollProvider } from "@/components/immersive/SmoothScrollProvider";
import { DeferredProductPresentation } from "@/components/immersive/DeferredProductPresentation";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const shell = "mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8";
const sectionY = "py-14 sm:py-16 lg:py-20";

const manifesto =
  "Seu cliente procura compara entra em contato e decide em poucos segundos. A Konnexy conecta presença digital tecnologia e conversão para transformar atenção em oportunidade real.";

type Product = {
  id: string; name: string; category: string; audience: string; title: string;
  description: string; image: string; href?: string; features: string[]; steps: string[];
};

const whatsapp = (subject: string) => `https://wa.me/5516991551200?text=${encodeURIComponent(`Olá, quero conhecer ${subject}. Podemos agendar uma demonstração?`)}`;

const products: Product[] = [
  {
    id: "menu", name: "Konnexy Menu", category: "Pedidos", audience: "Restaurantes, lanchonetes e delivery",
    title: "Seu cardápio na mão do cliente. Seus pedidos organizados.",
    description: "Apresente pratos, facilite a escolha e organize pedidos para delivery e retirada.",
    image: "/catalogo.png", href: "https://menu.konnexy.com.br",
    features: ["Cardápio digital", "Pedidos", "Painel de cozinha (KDS)", "Delivery e retirada"],
    steps: ["O cliente consulta o cardápio e escolhe os itens.", "O estabelecimento recebe e acompanha o pedido.", "A equipe organiza o preparo e a entrega ou retirada."],
  },
  {
    id: "agenda", name: "Konnexy Agenda", category: "Agendamentos", audience: "Salões, barbearias e profissionais de beleza",
    title: "Uma agenda organizada para cada atendimento.",
    description: "Reúna serviços, profissionais e horários para facilitar a rotina de quem atende com hora marcada.",
    image: "/images/landing/demo_admin.png", href: "https://agenda.konnexy.com.br",
    features: ["Agenda online", "Serviços", "Profissionais", "Gestão de horários"],
    steps: ["Cadastre os serviços e profissionais do negócio.", "Organize os horários e agendamentos na agenda.", "Acompanhe os atendimentos do dia em um só lugar."],
  },
  {
    id: "pdv", name: "Konnexy PDV", category: "Vendas e gestão", audience: "Lojas e pequenos comércios",
    title: "Da venda ao fechamento do caixa, tudo conectado.",
    description: "Centralize vendas, produtos, estoque e caixa, com operação offline e sincronização.",
    image: "/fabrica.png", href: "https://pdv.konnexy.com.br",
    features: ["Frente de caixa", "Controle de estoque", "Relatórios", "Offline e sincronização"],
    steps: ["Abra o caixa e selecione os produtos da venda.", "Registre o pagamento e a movimentação do estoque.", "Acompanhe os resultados e faça o fechamento do caixa."],
  },
  {
    id: "pet", name: "Konnexy Pet", category: "Agendamentos", audience: "Pet shops e prestadores de serviços pet",
    title: "Mais facilidade para o tutor. Mais organização para o pet shop.",
    description: "Apresente serviços e produtos e ofereça uma experiência de agendamento com a identidade do seu negócio.",
    image: "/pet.png",
    features: ["Agendamento", "Serviços pet", "Vitrine de produtos", "Página personalizada"],
    steps: ["O tutor conhece os serviços na página do pet shop.", "Acessa o agendamento para escolher o atendimento.", "O negócio acompanha os serviços e organiza sua rotina."],
  },
  {
    id: "auto", name: "Konnexy OS Auto", category: "Vendas e gestão", audience: "Oficinas e serviços automotivos",
    title: "Orçamentos e ordens de serviço com acompanhamento digital.",
    description: "Organize clientes, veículos e serviços e facilite a apresentação do orçamento ao cliente.",
    image: "/images/landing/demo_admin.png", href: "https://osauto.konnexy.com.br/",
    features: ["Orçamentos", "Ordens de serviço", "Histórico de veículos", "Acompanhamento digital"],
    steps: ["Cadastre o cliente, o veículo e os serviços do orçamento.", "Compartilhe o orçamento por um link para o cliente.", "Acompanhe a ordem de serviço e o histórico do veículo."],
  },
  {
    id: "tag", name: "Konnexy Tag", category: "Presença digital", audience: "Comércios, recepções e profissionais",
    title: "Aproxime o celular. Conecte o cliente ao seu negócio.",
    description: "Use NFC e QR Code para levar o cliente à sua página, contatos e avaliações no Google.",
    image: "/link.png", href: "https://tag.konnexy.com.br",
    features: ["Placas NFC", "QR Code", "Avaliações no Google", "Contatos e links"],
    steps: ["A placa fica disponível no balcão ou na recepção.", "O cliente aproxima o celular ou lê o QR Code.", "Acessa a página do estabelecimento e escolhe o próximo passo."],
  },
];

const services = [
  {
    title: "Catálogos e vitrines digitais",
    description: "Seus produtos organizados por categorias, com fotos e pedidos pelo WhatsApp.",
    href: "/servicos/catalogo-cardapio-digital",
  },
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
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      visual.style.transform = `translate3d(0, ${progress * 8}%, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      visual.style.transform = "";
    };
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
          fetchPriority="high"
          quality={40}
          sizes="(max-width: 640px) 58vw, (max-width: 1024px) 52vw, 484px"
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
              Sites, presença no Google e sistemas para facilitar suas vendas e seu atendimento. Conheça as soluções e veja qual combina com o seu negócio.
            </p>
            <Button asChild variant="ghost" className="h-auto w-fit p-0 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-transparent hover:text-cyan-300">
              <a href="#produtos">Ver soluções e apresentações <ArrowDown className="ml-2 h-4 w-4" /></a>
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
    const root = ref.current;
    if (!root) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const { ensureGsapRegistered } = await import("@/lib/motion/gsap");
      if (cancelled) return;

      const { gsap } = ensureGsapRegistered();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>("[data-word]", root);
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
              trigger: root,
              start: "top 72%",
              end: "bottom 48%",
              scrub: 1,
            },
          },
        );
      }, root);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void run();
      },
      { rootMargin: "260px 0px" },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      ctx?.revert();
    };
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
  const [filter, setFilter] = useState("Todas");
  const filters = ["Todas", "Pedidos", "Agendamentos", "Vendas e gestão", "Presença digital"];
  const visible = products.filter(product => filter === "Todas" || product.category === filter);

  const filterMounted = useRef(false);

  useEffect(() => {
    if (!filterMounted.current) {
      filterMounted.current = true;
      return;
    }

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void import("@/lib/motion/gsap").then(({ ensureGsapRegistered }) => {
        if (!cancelled) ensureGsapRegistered().ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [filter]);

  return (
    <section id="produtos" aria-labelledby="products-title" className="relative scroll-mt-6 overflow-hidden bg-[#050711] text-white">
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-96 w-96 rounded-full bg-fuchsia-500/[0.08] blur-[130px]" />
      <div className={`${shell} ${sectionY} relative`}>
        <Eyebrow>Sistemas para o seu negócio</Eyebrow>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <h2 id="products-title" className="max-w-3xl text-[clamp(2rem,4.1vw,3.8rem)] font-black leading-[1.05] tracking-[-0.045em]">Escolha o que você quer facilitar no seu dia a dia.</h2>
          <p className="max-w-xl text-sm leading-7 text-slate-300">Veja para quem cada solução foi criada, entenda o fluxo de uso e solicite uma demonstração para o seu negócio.</p>
        </div>
        <div role="group" aria-label="Filtrar soluções por necessidade" className="mt-8 flex flex-wrap gap-2">
          {filters.map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 ${filter === item ? "border-cyan-200/60 bg-cyan-300 text-[#04111b] shadow-[0_0_24px_rgba(34,211,238,.18)]" : "border-white/15 bg-white/[0.03] text-slate-300 hover:border-cyan-300/50 hover:text-white"}`}>{item}</button>)}
        </div>
        <p role="status" className="mt-4 text-xs text-slate-400">{visible.length} {visible.length === 1 ? "solução disponível nesta seleção" : "soluções nesta seleção"}</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(product => (
            <article id={`produto-${product.id}`} key={product.id} className="group flex min-w-0 scroll-mt-8 flex-col overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#0a0d17]/95 shadow-[0_0_35px_rgba(34,211,238,.07)] transition duration-300 hover:border-cyan-300/45 hover:shadow-[0_0_45px_rgba(34,211,238,.13)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={product.image} alt={`Ilustração da solução ${product.name}`} fill quality={58} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(50vw - 36px), 358px" className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d17] via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#03050d]/90 px-3 py-1.5 text-xs font-semibold text-cyan-200">{product.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-xs font-semibold text-cyan-300">{product.audience}</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">{product.name}</h3>
                <p className="mt-2 text-base font-semibold leading-6 text-white">{product.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
                <ul className="my-5 grid gap-2">
                  {product.features.map(feature => <li key={feature} className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />{feature}</li>)}
                </ul>
                <div className="mt-auto border-t border-white/10 pt-5">
                  {product.href && <Button asChild className="mb-3 h-12 w-full rounded-full bg-cyan-300 px-5 font-bold text-[#04111b] shadow-[0_0_24px_rgba(34,211,238,.18)] hover:bg-cyan-200"><a href={product.href} target="_blank" rel="noopener noreferrer" aria-label={`Visualizar projeto: ${product.name}`}>Visualizar projeto <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
                  {!product.href && <p className="mb-3 rounded-xl border border-white/10 px-3 py-2 text-center text-xs text-slate-400">Visualização online temporariamente indisponível</p>}
                  <DeferredProductPresentation product={product} /><a href={whatsapp(product.name)} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-200"><MessageCircle className="h-4 w-4" />Conversar sobre esta solução</a></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  const platforms = [
    { name: "Vitriniza", label: "Comércio local", description: "Uma vitrine para aproximar comércios e serviços dos moradores da região.", href: "https://vitriniza.konnexy.com.br/" },
    { name: "KonnexyFé", label: "Comunidades", description: "Descoberta de comunidades de fé, com mapa, eventos e horários.", href: "https://konnexyfe.vercel.app" },
    { name: "Feito de Nós", label: "Convites e presentes", description: "Convites digitais e presentes interativos para compartilhar histórias e momentos especiais.", href: "https://feitos-de-nos.vercel.app" },
  ];
  return <section id="ecossistema" className={`${sectionY} border-t border-white/10 bg-[#08091a] text-white`}><div className={shell}>
    <Eyebrow>Outras conexões</Eyebrow><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Conheça também nosso ecossistema.</h2>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{platforms.map(platform => <a key={platform.name} href={platform.href} target="_blank" rel="noopener noreferrer" className="group rounded-3xl border border-violet-300/20 bg-white/[0.03] p-6 transition hover:border-violet-300/50 hover:shadow-[0_0_32px_rgba(167,139,250,.10)]"><p className="text-xs font-semibold text-violet-300">{platform.label}</p><h3 className="mt-3 text-xl font-bold">{platform.name}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{platform.description}</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-violet-200">Visualizar projeto <ExternalLink className="h-4 w-4" /></span></a>)}</div>
  </div></section>;
}

function Portfolio() {
  const projects = KONNEXY_PORTFOLIO;
  return <section id="projetos" className={`${sectionY} bg-[#050711] text-white`}><div className={shell}>
    <Eyebrow>Projetos e demonstrações</Eyebrow><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Veja a Konnexy na prática.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Explore projetos e páginas demonstrativas para diferentes segmentos e conheça possibilidades para apresentar a sua empresa.</p>
    <div className="mt-8 grid gap-5 md:grid-cols-3">{projects.map(project => <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer" className="group overflow-hidden rounded-3xl border border-white/15 bg-white/[0.02] transition hover:border-cyan-300/40"><div className="relative aspect-[4/3]">{project.image ? <Image src={project.image} alt={`Apresentação do projeto ${project.name}`} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full flex-col justify-between bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,.15),transparent_65%),linear-gradient(135deg,#101a30,#080d1c)] p-6"><span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">{project.category}</span><span className="max-w-xs text-3xl font-black tracking-tight text-white">{project.name}</span><span className="flex items-center gap-2 text-xs text-slate-300">Abrir site <ExternalLink className="h-4 w-4" /></span></div>}</div><div className="p-5"><p className="text-xs text-cyan-300">{project.category}</p><h3 className="mt-2 text-xl font-bold">{project.name}</h3><span className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-300">Visitar projeto <ExternalLink className="h-4 w-4" /></span></div></a>)}</div>
  </div></section>;
}

function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const image = imageRef.current;
    const copy = copyRef.current;
    if (!root || !image || !copy) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const { ensureGsapRegistered } = await import("@/lib/motion/gsap");
      if (cancelled) return;

      const { gsap } = ensureGsapRegistered();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      ctx = gsap.context(() => {
        gsap.fromTo(
          image,
          { scale: 0.9, clipPath: "inset(7% 5% 7% 5% round 32px)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          copy,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 62%",
              end: "top 38%",
              scrub: 1,
            },
          },
        );
      }, root);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void run();
      },
      { rootMargin: "260px 0px" },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      ctx?.revert();
    };
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
    { value: products.length, suffix: "", label: "sistemas para vendas, atendimento e gestão" },
    { value: services.length, suffix: "", label: "serviços para presença digital e operação" },
    { value: 1, suffix: "", label: "marca conectando tecnologia e negócio" },
  ];

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const { ensureGsapRegistered } = await import("@/lib/motion/gsap");
      if (cancelled) return;

      const { gsap } = ensureGsapRegistered();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-counter]", root).forEach((el) => {
          const target = Number(el.dataset.counter || "0");
          if (reduced) {
            el.textContent = String(target);
            return;
          }

          el.textContent = "0";
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
      }, root);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void run();
      },
      { rootMargin: "220px 0px" },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={ref} className={`${sectionY} border-y border-violet-400/10 bg-[#08091a] text-white`}>
      <div className={shell}>
        <Eyebrow>Estrutura Konnexy</Eyebrow>
        <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {values.map((item) => (
            <div key={item.label} className="border-t border-cyan-300/20 pt-5">
              <div className="text-[clamp(3.1rem,5.6vw,5.2rem)] font-black leading-none tracking-[-0.05em]">
                <span data-counter={item.value}>{item.value}</span>{item.suffix}
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
              Serviços para sua empresa ser encontrada e escolhida.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400 lg:justify-self-end">
            Da criação do site à divulgação: escolha o apoio que seu negócio precisa e conheça o que está incluído em cada serviço.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              data-service-card
              key={service.title}
              href={service.href}
              className="group min-h-[190px] rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(13,18,32,.96),rgba(8,10,25,.94))] p-5 shadow-[0_0_26px_rgba(37,99,235,.06)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_0_34px_rgba(34,211,238,.13),0_0_48px_rgba(124,58,237,.08)] sm:p-6"
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
        <div data-final><Eyebrow>Próximo passo</Eyebrow></div>
        <h2 data-final className="mt-4 max-w-4xl text-[clamp(2.35rem,4.7vw,4.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
          Vamos encontrar a solução para o seu negócio?
        </h2>
        <p data-final className="mt-5 max-w-xl text-sm font-medium leading-6 text-slate-300 sm:text-base">
          Conte o que você vende e o que deseja facilitar. Apresentamos as opções e mostramos como a solução pode funcionar na sua rotina.
        </p>

        <div data-final className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="h-12 rounded-full border border-emerald-300/30 bg-[#25D366] px-6 text-sm font-black text-[#04110a] shadow-[0_0_28px_rgba(37,211,102,.18)] transition hover:bg-[#34df76] hover:shadow-[0_0_38px_rgba(37,211,102,.28)]">
            <a href="https://wa.me/5516991551200?text=Olá,%20quero%20conhecer%20as%20soluções%20da%20Konnexy%20e%20agendar%20uma%20demonstração." target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Quero uma demonstração
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
    <footer className="border-t border-white/10 bg-[#03050d] pb-28 pt-10 text-white sm:pt-12">
      <div className={`${shell} grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end`}>
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Konnexy" width={42} height={42} className="h-10 w-10 object-contain" />
            <div>
              <div className="text-lg font-black">Konnexy</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Conecta • Organiza • Vende</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Produtos e soluções digitais para pequenos negócios conectarem presença, atendimento e operação.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-300">
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
    <nav aria-label="Navegação da apresentação" className="fixed bottom-5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 justify-between rounded-full border border-cyan-300/20 bg-[#050711]/88 px-2 py-2 shadow-[0_0_34px_rgba(34,211,238,.12),0_18px_48px_rgba(0,0,0,.42)] backdrop-blur-xl">
      {[
        ["Início", "#"],
        ["Projetos", "#projetos"],
        ["Soluções", "#produtos"],
        ["Serviços", "#servicos"],
      ].map(([label, href]) => (
        <a
          key={label}
          href={href}
          className={`${label === "Início" ? "hidden sm:inline-flex" : "inline-flex"} min-h-11 items-center rounded-full px-2 py-2 text-[11px] font-bold text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-4`}
        >
          {label}
        </a>
      ))}
      <a
        href="https://wa.me/5516991551200"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 inline-flex items-center gap-2 rounded-full bg-cyan-300 min-h-11 px-3 py-2 text-[11px] font-black text-[#04111b] shadow-[0_0_20px_rgba(34,211,238,.16)]"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Contato
      </a>
    </nav>
  );
}

export function ImmersiveLanding() {
  return (
    <SmoothScrollProvider>
      <div className="overflow-x-clip bg-[#03050d] font-sans text-white selection:bg-cyan-300/30">
        <Hero />
        <Products />
        <Services />
        <Portfolio />
        <Ecosystem />
        <Manifesto />
        <BrandStatement />
        <Numbers />
        <FinalCTA />
        <Footer />
        <QuickNav />
      </div>
    </SmoothScrollProvider>
  );
}
