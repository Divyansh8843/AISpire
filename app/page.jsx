import { Button } from "@/components/ui/button";
import React from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { features } from "../data/features";
const page = () => {
  return (
    <div>
      <div className="grid-background"></div>

      <HeroSection />

      <section className='"w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-gray-200 text-center mb-12">
            Powerful Features for Unlock Your Career Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-8xl mx-auto">
            {features.map((feature, idx) => {
              return (
                <Card
                  key={idx}
                  className="border-2 hover:border-primary transition-colors duration-300"
                >
                  <CardContent className="pt-2 text-center flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center">
                      {feature.icon}
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className='"w-full py-12 md:py-24 bg-muted/50 '>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
            {stats.map((stat, indx) => {
              return (
                <div
                  key={indx}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <h3 className="text-4xl font-bold">{stat.title}</h3>
                  <p className="text-muted-foreground">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className='"w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='"w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently asked Questions
            </h2>
            <p className="text-muted-foreground">
              Answers to your most common questions.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {fquestions.map((fquestion, idx) => {
                return (
                  <Accordion key={idx} type="single" collapsible>
                    <AccordionItem value={`item-${idx}`}>
                      <AccordionTrigger>{fquestion.question}</AccordionTrigger>
                      <AccordionContent>{fquestion.answer}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      <section className='"w-full'>
        <div className="mx-auto py-24 bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 ">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
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
    </div>
  );
};
export default page;
