import React from "react";
import { getAssesment } from "@/actions/interview";
import StatsCard from "./_components/statscard";
import PerformanceChart from "./_components/performancechart";
import QuizList from "./_components/quizlist";
const InterviewPage = async () => {
  const assesments = await getAssesment();
  console.log(assesments);
  return (
    <div>
      <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
        Interview Prepration
      </h1>
      <div className="space-y-6">
        <StatsCard assesments={assesments} />
        <PerformanceChart assesments={assesments} />
        <QuizList assesments={assesments} />
      </div>
    </div>
  );
};

export default InterviewPage;
