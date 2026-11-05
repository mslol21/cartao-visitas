"use client";

import { ReactNode, useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopFinePointer = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    if (reducedMotion || !desktopFinePointer) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const activate = async () => {
      const [{ default: Lenis }, { ensureGsapRegistered }] = await Promise.all([
        import("lenis"),
        import("@/lib/motion/gsap"),
      ]);
      if (cancelled) return;

      const { gsap, ScrollTrigger } = ensureGsapRegistered();
      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        touchMultiplier: 1,
        autoRaf: false,
      });

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    };

    const startOnce = () => {
      window.removeEventListener("wheel", startOnce);
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("keydown", startOnce);
      void activate();
    };

    window.addEventListener("wheel", startOnce, { passive: true, once: true });
    window.addEventListener("pointerdown", startOnce, { once: true });
    window.addEventListener("keydown", startOnce, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", startOnce);
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("keydown", startOnce);
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
