"use server";
import { db } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function createCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      id: true,
      industry: true,
      experience: true,
      skills: true,
      bio: true,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const prompt = `Write a professional cover letter for a ${
      data.jobTitle
    } position at ${data.companyName}.
      
      About the candidate:
      - Industry: ${user.industry}
      - Years of Experience: ${user.experience}
      - Skills: ${user.skills?.join(", ")}
      - Professional Background: ${user.bio}
      
      Job Description:
      ${data.jobDescription}
      
      Requirements:
      1. Use a professional, enthusiastic tone
      2. Highlight relevant skills and experience
      3. Show understanding of the company's needs
      4. Keep it concise (max 400 words)
      5. Use proper business letter formatting in markdown
      6. Include specific examples of achievements
      7. Relate candidate's background to job requirements
      
      Format the letter in markdown.
    `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const coverletterContent = response.text().trim();
    const coverletter = await db.CoverLetter.create({
      data: {
        userId: user.id,
        content: coverletterContent,
        jobDescription: data.jobDescription,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
      },
    });
    return coverletter;
  } catch (err) {
    console.error("Error Building Cover Letter", err.message);
    throw new Error(`failed to Build Cover Letter: ${err.message}`);
  }
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    if (!id) throw new Error("Id not found");
    const coverletter = await db.CoverLetter.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    return coverletter;
  } catch (err) {
    console.error(
      `Error while fetching the cover letter by id ${id}`,
      err.message
    );
    throw new Error(`Error while fetching the cover letter: ${err.message}`);
  }
}

export async function getCoverletters() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const letters = await db.CoverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return letters;
  } catch (err) {
    console.error("Error while fetching the CoverLetters", err.message);
    throw new Error(`Error while fetching the CoverLetters: ${err.message}`);
  }
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    if (!id) throw new Error("Id not found");
    await db.CoverLetter.delete({
      where: {
        userId: user.id,
        id,
      },
    });
  } catch (err) {
    console.error(
      `Error while deleting the cover letter by id ${id}`,
      err.message
    );
    throw new Error(`Error while deleting the cover letter: ${err.message}`);
  }
}
