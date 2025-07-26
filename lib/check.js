import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export async function checkEnvironment() {
  const requiredEnvVars = [
    'GEMINI_API_KEY',
    'CLERK_SECRET_KEY',
    'CLERK_PUBLISHABLE_KEY',
    'DATABASE_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Test database connection
  try {
    await db.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Database connection failed');
  }
}

export async function checkUserProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        industry: true,
        experience: true,
        skills: true,
        bio: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.industry) {
      throw new Error('User profile incomplete. Please complete your profile first.');
    }

    return user;
  } catch (error) {
    console.error('Error checking user profile:', error);
    throw error;
  }
}
