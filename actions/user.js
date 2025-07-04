"use server";

import { db } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard.js";
export async function updateUser(data) {
  console.log("Updating user with data:", data);
  console.log("industry is", data.industry);
  const { userId } = await auth();
  console.log(userId);
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });
  console.log("user & data", user, data);
  if (!user) throw new Error("User not found");
  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.IndustryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);
          console.log("insights at update", insights);
          industryInsight = await db.IndustryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
        console.log("new industryInght", industryInsight);
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        console.log("user became updated", updatedUser);
        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );
    return { success: true, ...result };
  } catch (err) {
    console.error("Error updating user:", err.message);
    throw new Error(`Failed to update user + ${err.message}`);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });
    if (!user) throw new Error("User not found");
    return {
      isOnboarded: !!user?.industry,
    };
  } catch (err) {
    console.error("Error fetching user onboarding status:", err.message);
    throw new Error("Failed to fetch user onboarding status");
  }
}
