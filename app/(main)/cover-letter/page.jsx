import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCoverletters } from "@/actions/coverletter";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "../../../actions/user";
import CoverLetterAll from "./_components/CoverLetterAll";
const CoverLettersPage = async () => {
  try {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const coverLetters = await getCoverletters();
  return (
      <div className="py-4 px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2 text-center mb-6">
          My Cover Letters
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <Link href="/cover-letter/new">
            <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4"/>
            Create New
          </Button>
        </Link>
      </div>
      <CoverLetterAll coverLetters={coverLetters} />
    </div>
  );
  } catch (err) {
    console.error("Cover letter page error:", err);
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

export default CoverLettersPage;
