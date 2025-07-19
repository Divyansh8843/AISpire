"use client"
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Link from "next/link";
import { stats } from "../data/stats";
import { steps } from "../data/steps";
import { ArrowRight } from "lucide-react";
import { fquestions } from "../data/questions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { features } from "../data/features";
import FlipCard from "@/components/FlipCard";
import StepsAnimated from "@/components/StepsAnimated";
import { FadeInUp, ScaleIn, SlideInLeft, SlideInRight } from "@/components/AdvancedScrollAnimations";

const page = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js");
      });
    }
  }, []);

  return (
    <div>
      <div className="grid-background"></div>
      <FadeInUp delay={100}>
        <HeroSection />
      </FadeInUp>

      <FadeInUp delay={200}>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-12">
              Powerful Features to Unlock Your Career Potential
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-8xl mx-auto">
              {features.map((feature, idx) => (
                <FlipCard key={idx} feature={feature} delay={idx * 100} />
              ))}
            </div>
          </div>
        </section>
      </FadeInUp>

      <ScaleIn delay={300}>
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
              {stats.map((stat, indx) => {
                return (
                  <div
                    key={indx}
                    className="flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300"
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                      {stat.title}
                    </h3>
                    <p className="text-muted-foreground">{stat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScaleIn>

      <SlideInLeft delay={400}>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Four simple steps to accelerate your career growth
              </p>
            </div>
            <StepsAnimated steps={steps} />
          </div>
        </section>
      </SlideInLeft>

      <SlideInRight delay={500}>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Answers to your most common questions.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-white/80 dark:bg-black/40 rounded-2xl shadow-xl p-6 md:p-10 space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {fquestions.map((fquestion, idx) => (
                  <Accordion key={idx} type="single" collapsible>
                    <AccordionItem value={`item-${idx}`}
                      className="rounded-xl border border-primary/10 bg-white/70 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                      <AccordionTrigger className="font-semibold text-lg md:text-xl text-primary px-4 py-3 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200">
                        {fquestion.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base md:text-lg px-4 pb-4 pt-2 leading-relaxed">
                        {fquestion.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </SlideInRight>

      <FadeInUp delay={600}>
        <section className="w-full">
          <div className="mx-auto py-24 bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-600">
                Ready to Level Up Your Career?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                Join thousands of professionals advancing their careers with
                AI-powered guidance.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-11 mt-5 animate-bounce"
                >
                  Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInUp>
    </div>
  );
};
export default page;
