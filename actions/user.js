"use server";

import { db } from "../lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
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
   
    let industryInsight = await db.IndustryInsight.findUnique({
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
    const updatedUser = await db.user.update({
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
    return { success: true, updatedUser, industryInsight };
  } catch (err) {
    console.error("Error updating user:", err.message);
    throw new Error(`Failed to update user + ${err.message}`);
  }
}

export async function getUserOnboardingStatus() {
  try {
  const { userId } = await auth();
    console.log("getUserOnboardingStatus - User ID:", userId);
    
    if (!userId) {
      console.log("No user ID found");
      return { isOnboarded: false };
    }
    
    // First, try to find the user
    let user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });
    
    console.log("Found user in DB:", user);
    
    // If user doesn't exist, create them
    if (!user) {
      console.log("User not found, creating new user...");
      const clerkUser = await currentUser();
      
      if (clerkUser) {
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            name: name || 'User',
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            imageUrl: clerkUser.imageUrl,
          },
          select: {
            industry: true,
          },
        });
        console.log("Created new user:", user);
      }
    }
    
    // Check if user has completed onboarding
    const isOnboarded = user && user.industry && user.industry.trim() !== '';
    console.log("Onboarding status:", isOnboarded, "Industry:", user?.industry);
    
    return {
      isOnboarded: isOnboarded,
    };
  } catch (err) {
    console.error("Error fetching user onboarding status:", err.message);
    return { isOnboarded: false };
  }
}
