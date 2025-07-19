"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'both',
      smoothTouch: true,
      touchMultiplier: 3,
      infinite: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    
    if (typeof window !== 'undefined') {
      window.Lenis = lenis;
      window.lenis = lenis;
    }
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete window.Lenis;
        delete window.lenis;
      }
    };
  }, []);
  return children;
} 