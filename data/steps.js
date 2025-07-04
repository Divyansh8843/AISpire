import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const steps = [
  {
    title: "Personalized Onboarding",
    description: "Tell us your industry and goals to receive tailored career support.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your  Documents",
    description: "Generate ATS-friendly resumes and impactful cover letters with ease.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Ace Every Interview",
    description: "Sharpen your skills through AI-driven mock interviews specific to your role.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Measure Your Growth",
    description: "Stay on track with performance insights and progress analytics.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
