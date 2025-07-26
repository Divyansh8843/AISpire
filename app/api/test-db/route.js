import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await db.$connect();
    
    // Get basic database info
    const userCount = await db.user.count();
    const assessmentCount = await db.assessment.count();
    const coverLetterCount = await db.coverLetter.count();
    const resumeCount = await db.resume.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      database: 'Azure Neon PostgreSQL',
      stats: {
        users: userCount,
        assessments: assessmentCount,
        coverLetters: coverLetterCount,
        resumes: resumeCount
      },
      connection: {
        host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'hidden',
        database: 'AIspire'
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      error: error.message,
      suggestion: 'Check your DATABASE_URL environment variable'
    }, { status: 500 });
  }
} 