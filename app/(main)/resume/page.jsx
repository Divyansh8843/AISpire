import React from "react";
import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
const Resume = async () => {
  const resume = await getResume();
  return (
    <div className="container mx-auto py-4">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
};

export default Resume;
