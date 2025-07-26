import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Loading component
const QuizLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const MockInterviewPage = () => {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div>
        <Link href={"/interview"}>
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>
        <div className="mx-2 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-2 pr-2">
            Mock Interview
          </h1>
          <p className="text-muted-foreground">
            Practice your interview skills with realistic mock interview
            questions.
          </p>
        </div>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<QuizLoading />}>
          <Quiz />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default MockInterviewPage;
