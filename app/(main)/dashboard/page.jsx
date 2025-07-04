import React from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/DashboardView";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
const DashboardPage = async ({ children }) => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default DashboardPage;
