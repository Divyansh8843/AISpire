import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const systemPrompt = `You are an AI Career Coach for AIspire, a comprehensive career development platform designed for students and professionals at all levels. 

PLATFORM FEATURES:
- Resume Builder with ATS optimization and scoring
- Cover Letter templates and writing assistance
- Interview preparation with mock interviews and tips
- Industry insights and career guidance
- Professional development resources
- Dashboard with personalized insights
- Onboarding process for new users

YOUR ROLE:
1. Provide expert career advice for college students, graduates, and professionals
2. Guide users through platform features and navigation
3. Offer resume writing tips, ATS optimization strategies, and interview preparation
4. Share industry insights and career development strategies
5. Help with cover letter writing and professional communication
6. Support career transitions and professional growth
7. Answer questions about AIspire's tools and services

RESPONSE STYLE:
- Always be concise, clear, and professional
- Avoid unnecessary verbosity
- Use 2-4 sentences or bullet points for most answers
- Reference platform features when relevant
- Use bullet points for multiple suggestions
- Maintain a supportive, mentor-like tone

TARGET AUDIENCE:
- College students seeking internships and entry-level positions
- Recent graduates entering the job market
- Mid-career professionals looking to advance
- Career changers and professionals seeking new opportunities
- Anyone looking to improve their professional skills

Always be helpful, accurate, and encourage users to explore the relevant sections of the AIspire platform for hands-on tools and resources.`;

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 