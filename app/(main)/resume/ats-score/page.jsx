import ResumeATSScore from "../_components/ResumeATSScore";

export default function ResumeATSScorePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-0 relative overflow-x-hidden scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="w-full max-w-6xl mx-auto text-center pt-16 pb-12 z-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2 text-center">
          Get Your Resume ATS Score
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-0 text-center">
          Upload your resume and instantly see how it performs in Applicant Tracking Systems. Get expert, actionable tips to make your resume stand out and land more interviews!
        </p>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
          <ResumeATSScore />
      </div>
    </div>
  );
} 