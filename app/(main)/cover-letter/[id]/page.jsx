import React from "react";
import Link from "next/link";
import { getCoverLetter } from "@/actions/coverletter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoverLetterPreview from "../_components/CoverLetterPreview";
const CoverLetter = async ({ params }) => {
  const id = await params.id;
  const coverLetter = await getCoverLetter(id);
  return (
    <div>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-2">
          <Link href="/cover-letter">
            <Button variant="link" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
          <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
            {coverLetter?.jobTitle} at {coverLetter?.companyName}
          </h1>
        </div>
        <CoverLetterPreview content={coverLetter?.content} />
      </div>
    </div>
  );
};

export default CoverLetter;
