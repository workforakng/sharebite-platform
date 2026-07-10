import { callAI } from '../../../lib/ai';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, payload } = body;
    let prompt = "";
    let systemInstruction = "You are ShareBite AI Rescue Assistant. Return valid JSON only.";

    switch (action) {
      case "classify":
        prompt = `Classify this food listing. Title: "${payload.title}", Notes: "${payload.notes || ''}". Return JSON with category (string), urgency (Low/Medium/High), and rescuePriority (0-100).`;
        break;
      case "suggest_expiry":
        prompt = `Suggest safe expiry window for food type: "${payload.type}". Current time is ${new Date().toISOString()}. Return JSON with suggestedExpiry (ISO string) and reason (string).`;
        break;
      case "find_match":
        prompt = `Find best NGO/volunteer match for: Location "${payload.location}", Item "${payload.type}", Urgency "${payload.urgency || 'High'}". Return JSON with bestMatch (string), matchScore (0-100), and distance (string).`;
        break;
      case "generate_summary":
        prompt = `Generate a short rescue history summary. Item: "${payload.title}", Donor: "${payload.donorName || 'Unknown'}", Claimer: "${payload.claimerName || 'Unknown'}". Return JSON with summary (string).`;
        break;
      case "ask_assistant":
        systemInstruction = "You are a helpful assistant for ShareBite donors. Keep answers brief.";
        prompt = `Donor asks: "${payload.question}". Return JSON with answer (string).`;
        break;
      case "admin_flagging":
        prompt = `Admin flagging: evaluate risk of listing. Title: "${payload.title}", Quantity: "${payload.quantity}", Notes: "${payload.notes || ''}". Return JSON with isSuspicious (boolean), confidence (0-100), and reason (string).`;
        break;
      case "alert_automation":
        prompt = `Alert automation: evaluate if this listing needs high-priority alerts. Title: "${payload.title}", Quantity: "${payload.quantity}". Return JSON with alertLevel (NORMAL/HIGH/CRITICAL) and notify (array of strings like 'admin', 'local_ngos').`;
        break;
      case "analytics_helper":
        prompt = `Analytics helper: summarize these raw metrics. Raw data: "${payload.data || ''}". Return JSON with mealsSaved (number), activeDonors (number), and trend (string).`;
        break;
      default:
        return NextResponse.json({ error: "Unknown AI action" }, { status: 400 });
    }

    const aiResult = await callAI(prompt, systemInstruction);
    return NextResponse.json(aiResult);

  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message || "AI Error" }, { status: 500 });
  }
}
