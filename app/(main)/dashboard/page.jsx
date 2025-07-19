import React from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/DashboardView";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import { Button} from "../../../components/ui/button"
import Link from "next/link";

const DashboardPage = async () => {
  // Onboarding check: redirect if not onboarded
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  try {
    console.log("Dashboard page loading...")
    console.log("Loading insights...");
    const insights = await getIndustryInsights();
    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
  } catch (err) {
    console.error("Dashboard error:", err);
        return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground mb-4">Complete your profile to get personalized insights.</p>
          <Link href="/onboarding">
          <Button variant="outline">
             Complete Your Profile
          </Button>
          </Link>
        </div>
      </div>
    );
  }
};

export default DashboardPage;
