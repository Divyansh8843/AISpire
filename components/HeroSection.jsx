"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
const HeroSection = () => {
  const imageRef = useRef(null);
  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <section className="w-full pt-36 md:pt-38 pb-10 overflow-hidden">
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-6 mx-auto">
          <h1 className="bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent text-5xl font-bold md:text-6xl lg:txt-7xl xl:text-8xl tracking-tighter bg-clip-text pb-2 pr-2">
            Your Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Inspiring careers through AI. Get personalized guidance, resources,
            and support for your professional journey.
          </p>
        </div>
        <div className="flex justify-center  gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/dashbaord">
            <Button size="lg" variant="outline" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="https://media.licdn.com/dms/image/v2/D5612AQHiyWWGuGLhFg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1733814700081?e=2147483647&v=beta&t=NQeMb2OoFxWjRCRgp8JYA8wc_06g_rYr7YDvV9zORIY"
              width={1280}
              height={720}
              alt="Banner AIspire"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
