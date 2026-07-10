import { callAI } from '../../../lib/ai';
import { SHAREBITE_SOUL } from '../../../lib/soul';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT = 3;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const isLoggedIn = !!session;

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    
    if (!isLoggedIn && ip !== "unknown") {
      const currentUsage = rateLimitMap.get(ip) || 0;
      if (currentUsage >= RATE_LIMIT) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Maximum 3 prompts allowed per user/IP for non-logged in users." },
          { status: 429 }
        );
      }
      rateLimitMap.set(ip, currentUsage + 1);
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const aiResult = await callAI(prompt, SHAREBITE_SOUL);
    
    return NextResponse.json(aiResult);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "AI Error: " + error.message }, { status: 500 });
  }
}
