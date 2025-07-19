import { BrainCircuit, Briefcase, EditIcon, LineChart, ScrollText } from "lucide-react";
import feature1 from "../public/feature1.png"
import feature2 from "../public/feature2.png"
import feature3 from "../public/feature3.png"
import feature4 from "../public/feature4.png"
import feature5 from "../public/feature5.png"
export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:"Get personalized career advice and insights powered by advanced AI technology.",
    image: feature1
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:"Practice with role-specific questions and get instant feedback to improve your performance.",
    image: feature2,
    details: "Master your interviews with AI-powered mock sessions, real-time feedback, and industry-specific question banks designed to boost your confidence."
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:"Stay ahead with real-time industry trends, salary data, and market analysis.",
    image: feature3,
    details: "Access comprehensive market intelligence including salary benchmarks, skill demand trends, and industry growth projections to make informed career decisions."
  },
  {
    icon: <EditIcon className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Cover Letter Builder",
    description: "Craft personalized, job-specific cover letters instantly with AI.",
    image: feature4,
    details: "Create compelling cover letters that match job requirements and company culture with our intelligent writing assistant that adapts to your voice and style."
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
    image: feature5,
    details: "Build professional resumes that pass ATS screening with smart formatting, keyword optimization, and industry-specific templates designed for maximum impact."
  },
];


