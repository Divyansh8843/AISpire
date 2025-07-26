import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GenerateCoverLetter from "../_components/GenerateCoverLetter";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Loading component
const CoverLetterLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const NewCoverLetter = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col gap-2">
        <Link href="/cover-letter">
          <Button variant="link">
            <ArrowLeft className="h-4 w-4" />
            Back to cover letters
          </Button>
        </Link>
        <div className="pb-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
            Build Cover Letter
          </h1>
          <p className="text-muted-foreground">
            Build a cover letter for your job application
          </p>
        </div>
      </div>
      <ErrorBoundary>
        <Suspense fallback={<CoverLetterLoading />}>
          <GenerateCoverLetter />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default NewCoverLetter;
