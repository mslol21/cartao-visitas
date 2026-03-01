import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToHsl(hex: string): string {
  // Normalize hex
  let hx = hex.replace(/^#/, '');
  if (hx.length === 3) hx = hx.split('').map(c => c + c).join('');
  if (hx.length !== 6) return '221 83% 53%'; // Fallback

  const r = parseInt(hx.substring(0, 2), 16) / 255;
  const g = parseInt(hx.substring(2, 4), 16) / 255;
  const b = parseInt(hx.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
