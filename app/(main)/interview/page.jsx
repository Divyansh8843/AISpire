import React from "react";
import { getAssesment } from "@/actions/interview";
import StatsCard from "./_components/statscard";
import PerformanceChart from "./_components/performancechart";
import QuizList from "./_components/quizlist";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "../../../actions/user";
const InterviewPage = async () => {
  try {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const assesments = await getAssesment();
  return (
    <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2 text-center">
          Interview Preparation
      </h1>
      <div className="space-y-6">
        <StatsCard assesments={assesments} />
        <PerformanceChart assesments={assesments} />
        <QuizList assesments={assesments} />
      </div>
    </div>
  );
  } catch (err) {
    console.error("Interview page error:", err);
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

export default InterviewPage;
