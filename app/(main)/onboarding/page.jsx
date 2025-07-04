import React from "react";
import { industries } from "../../../data/industries";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onboarding-form";
const OnboardinPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnboardinPage;
