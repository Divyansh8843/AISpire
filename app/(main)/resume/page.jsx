import React from "react";
import { getResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import ResumeBuilder from "./_components/resume-builder";
import ResumeATSScore from "./_components/ResumeATSScore";
import { redirect } from "next/navigation";
import {ChartNoAxesColumnIncreasing} from "lucide-react"
import { getUserOnboardingStatus } from "../../../actions/user";
import Link from "next/link";
const Resume = async () => {
  try {
    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect("/onboarding");
    }
    const resume = await getResume();
    return (
      <div className="container mx-auto py-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2 text-center">
          Resume Builder
        </h1>
        <div className="flex flex-col items-center justify-center mt-12 mb-8">
          <div className="text-lg font-medium text-gray-300 mb-2 text-center max-w-xl">
          Get noticed! Check your ATS score now and unlock quick fixes to boost your resume.          
          </div>
          <Link href="/resume/ats-score">
            <Button variant="outline">
                 <ChartNoAxesColumnIncreasing className="h-4 w-4"/>
                 Get Your ATS Score
            </Button>
          </Link>
        </div>
        <ResumeBuilder initialContent={resume?.content} />
      </div>
    );
  } catch (err) {
    console.error("Resume page error:", err);
    if (err?.message?.includes("User industry is not set") || err?.message?.includes("not found")) {
      redirect("/onboarding");
    }
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }
};

export default Resume;
