"use client";
import dynamic from "next/dynamic";
import React from "react";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export default function StepsAnimated({ steps }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-2 md:px-4 lg:px-0 py-6">
      {steps.map((step, idx) => {
        const directions = [
          { x: -60, y: 0 },   // left
          { x: 60, y: 0 },    // right
          { x: 0, y: -60 },   // top
          { x: 0, y: 60 },    // bottom
        ];
        const dir = directions[idx % 4];
        return (
          <MotionDiv
            key={idx}
            className={
              "relative w-full h-80 flex flex-col items-center text-center rounded-3xl shadow-2xl border-2 border-primary/20 bg-white/60 dark:bg-black/40 backdrop-blur-xl overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-3xl"
            }
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            }}
            initial={{ opacity: 0, ...dir }}
            animate={{ opacity: 1, x: 0, y: 0, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
            transition={{ duration: 0.7, delay: idx * 0.15, type: 'spring', stiffness: 60 }}
            whileHover={{ scale: 1.09, boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.25)" }}
          >
            {/* Glowing Border Effect */}
            <span
              className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent z-20"
              style={{
                boxShadow:
                  "0 0 0 0px #a78bfa, 0 0 12px 4px #38bdf8, 0 0 24px 8px #a78bfa",
                transition: "box-shadow 0.4s",
                opacity: 0.6,
              }}
            />
            {/* On hover, stronger glow using group-hover */}
            <span
              className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent z-20 group-hover:opacity-100 group-hover:shadow-[0_0_0_2px_#a78bfa,0_0_24px_8px_#38bdf8,0_0_48px_16px_#a78bfa] opacity-0 transition-all duration-500"
            />
            {/* Card Content - better vertical arrangement */}
            <div className="flex flex-col flex-grow justify-center items-center h-full w-full px-2">
              <div className="relative z-10 w-16 h-16 mb-4 mt-2 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl md:text-4xl lg:text-5xl">{step.icon}</span>
              </div>
              <h3 className="font-extrabold text-base md:text-lg text-primary drop-shadow-lg z-10 mb-1">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-base md:text-lg z-10 max-w-xs mx-auto mb-0">
                {step.description}
              </p>
            </div>
            {/* Glass shine effect */}
            <span className="absolute left-1/4 top-0 w-1/2 h-1/3 bg-white/30 rounded-full blur-2xl opacity-40 pointer-events-none z-20 animate-shine" />
            <style>{`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
              }
              .animate-float { animation: float 2.5s ease-in-out infinite; }
              @keyframes shine {
                0% { left: 0; opacity: 0.2; }
                50% { left: 60%; opacity: 0.5; }
                100% { left: 100%; opacity: 0.2; }
              }
              .animate-shine { animation: shine 2.8s linear infinite; }
            `}</style>
          </MotionDiv>
        );
      })}
    </div>
  );
} 