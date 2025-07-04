import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCoverletters } from "@/actions/coverletter";
import CoverLetterAll from "./_components/CoverLetterAll";
const CoverLettersPage = async () => {
  const coverLetters = await getCoverletters();
  return (
    <div className="py-4">
      <div className="flex md:flex-row flex-col items-center justify-between gap-2">
        <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
          My CoverLetters
        </h1>
        <Link href="/cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>
      <CoverLetterAll coverLetters={coverLetters} />
    </div>
  );
};

export default CoverLettersPage;
