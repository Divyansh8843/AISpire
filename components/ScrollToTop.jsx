"use client";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

let lenisInstance = null;

const getLenis = () => {
  if (typeof window !== "undefined") {
    if (!lenisInstance && window.Lenis) {
      lenisInstance = window.Lenis;
    } else if (!lenisInstance && window.lenis) {
      lenisInstance = window.lenis;
    } else if (!lenisInstance) {
      // Try to find Lenis instance from global
      const all = Object.values(window);
      for (const v of all) {
        if (v && v.constructor && v.constructor.name === "Lenis") {
          lenisInstance = v;
          break;
        }
      }
    }
  }
  return lenisInstance;
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId;
    function update() {
      let lenis = getLenis();
      let scrollTop = lenis && typeof lenis.scroll === 'number' ? lenis.scroll : (window.scrollY || window.pageYOffset);
      let docHeight = lenis && typeof lenis.limit === 'number' ? lenis.limit : (document.documentElement.scrollHeight - window.innerHeight);
      let percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      percent = Math.min(percent, 100);
      setScrollProgress(percent);
      setIsVisible(scrollTop > 300);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <div className="relative">
            <ChevronUp className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" />
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 