"use client";

import { RefObject, useEffect } from "react";
import { ensureGsapRegistered } from "@/lib/motion/gsap";

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

    const { gsap, ScrollTrigger } = ensureGsapRegistered();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, [duration, scope, selector, stagger, start, y]);
}
