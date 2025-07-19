"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FlipCard = ({ feature, delay = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group w-full h-80 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full bg-card rounded-xl shadow-lg overflow-hidden">
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full bg-card rounded-xl shadow-lg p-6 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-card-foreground text-center">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
