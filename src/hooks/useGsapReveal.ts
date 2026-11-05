"use client";

import { RefObject, useEffect } from "react";

type RevealOptions = {
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
};

export function useGsapReveal(
  scope: RefObject<HTMLElement | null>,
  {
    selector = "[data-reveal]",
    y = 48,
    stagger = 0.1,
    start = "top 82%",
    duration = 0.9,
  }: RevealOptions = {},
) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const { ensureGsapRegistered } = await import("@/lib/motion/gsap");
      if (cancelled) return;

      const { gsap, ScrollTrigger } = ensureGsapRegistered();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, root);
        if (!targets.length) return;

        if (reducedMotion) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start,
              once: true,
            },
          },
        );
      }, root);

      ScrollTrigger.refresh();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void run();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      ctx?.revert();
    };
  }, [duration, scope, selector, stagger, start, y]);
}
