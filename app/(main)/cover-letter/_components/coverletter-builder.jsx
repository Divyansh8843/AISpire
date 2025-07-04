"use client";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { saveCoverLetter } from "@/actions/coverletter";
import CoverLetterForm from "./coverletter-form";
import useFetch from "@/hooks/user-fetch";
const CoverLetterBuilder = () => {
  const {
    loading: savingCoverLetter,
    data: savedCoverLetter,
    fn: saveCoverLetterFn,
    error: saveError,
  } = useFetch(saveCoverLetter);

  useEffect(() => {
    if (savedCoverLetter && !savingCoverLetter) {
      toast.success("CoverLetter saved successfully");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save CoverLetter");
    }
  }, [savedCoverLetter, savingCoverLetter, saveError]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 ">
        <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
          Cover Letter Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            disabled={savingCoverLetter}
            // onClick={}
          >
            {savingCoverLetter ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving CoverLetter...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save CoverLetter
              </>
            )}
          </Button>
        </div>
      </div>
      <CoverLetterForm />
    </div>
  );
};

export default CoverLetterBuilder;
