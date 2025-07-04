"use server";
import { db } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function improveResume({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      industryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const prompt = `You are an expert resume writer. Rewrite the following ${type} for a ${user.industry} professional. Make it concise, clear, and results-oriented. Use strong action verbs, relevant metrics, and industry-specific keywords. Limit the response to 1-2 impactful sentences.
    Current: "${current}"`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improveContent = response.text().trim();
    return improveContent;
  } catch (err) {
    console.error("Error improving resume", err);
    throw new Error("failed to improve resume");
  }
}

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const resume = await db.Resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });
    revalidatePath("/resume");
    return resume;
  } catch (err) {
    console.error("Error while saving the resume ", err.message);
    throw new Error(`Error occurred while saving the resume : ${err.message}`);
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.User.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const resume = await db.Resume.findUnique({
      where: {
        userId: user.id,
      },
    });
    return resume;
  } catch (err) {
    console.error(
      "Error while fetching the resume from the Resume Database",
      err.message
    );
    throw new Error(
      `Error while fetching the resume from the Resume Database: ${err.message}`
    );
  }
}
