"use server";
import { db } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      id: true,
      industry: true,
      skills: true,
    },
  });
  if (!user) throw new Error("User not found");
  try {
    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    Each question should be multiple choice with 4 options.
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);
    return quiz.questions;
  } catch (err) {
    console.error("Error generating quiz", err);
    throw new Error("failed to generate quiz questions");
  }
}

export async function saveQuizResult({ questions, answers, score }) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      id: true,
      industry: true,
      skills: true,
    },
  });
  if (!user) throw new Error("User not found");

  const questionResults = questions.map((que, idx) => ({
    question: que.question,
    answer: que.correctAnswer,
    userAnswer: answers[idx] ?? null,
    isCorrect: que.correctAnswer === answers[idx],
    explanation: que.explanation,
  }));

  const wrongAnswers = questionResults.filter((que) => !que.isCorrect);
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (que) =>
          `Question: "${que.question}"\nCorrect Answer: "${que.answer}"\nUser Answer: "${que.userAnswer}"`
      )
      .join("\n\n");
    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
    try {
      const result = await model.generateContent(improvementPrompt);
      const response = result.response;
      improvementTip = response.text().trim();
    } catch (err) {
      throw new Error("Error occurred while generating Improvement Tip");
    }
  }
  try {
    const assessment = await db.Assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (err) {
    console.error(
      "Error while saving the data to the Assessment Table",
      err.message
    );
    throw new Error(
      `Error occurred while saving the scoreResult to the Assessment Table: ${err.message}`
    );
  }
}

export async function getAssesment() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      id: true,
      industry: true,
      skills: true,
    },
  });
  if (!user) throw new Error("User not found");

  try {
    const assesments = await db.Assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return assesments;
  } catch (err) {
    console.error(
      "Error while fetching the assesment from the Assessment Database",
      err.message
    );
    throw new Error(
      `Error while fetching the assesment from the Assessment Database: ${err.message}`
    );
  }
}
