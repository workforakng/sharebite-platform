export async function callAI(prompt, systemInstruction = "") {
  const provider = process.env.AI_PROVIDER || "nim";
  
  if (provider === "mock") {
    return getMockResponse(prompt);
  }

  if (provider === "nim") {
    try {
      return await callNIM(prompt, systemInstruction);
    } catch (err) {
      console.warn("NIM failed, falling back to Gemini:", err.message);
      try {
        return await callGemini(prompt, systemInstruction);
      } catch (err2) {
        console.warn("Gemini failed, falling back to Mock:", err2.message);
        return getMockResponse(prompt);
      }
    }
  }

  if (provider === "gemini") {
    try {
      return await callGemini(prompt, systemInstruction);
    } catch (err) {
      console.warn("Gemini failed, falling back to NIM:", err.message);
      try {
        return await callNIM(prompt, systemInstruction);
      } catch (err2) {
        console.warn("NIM failed, falling back to Mock:", err2.message);
        return getMockResponse(prompt);
      }
    }
  }

  // If some unknown provider is set
  try {
    return await callNIM(prompt, systemInstruction);
  } catch (err) {
    return getMockResponse(prompt);
  }
}

async function callGemini(prompt, systemInstruction) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API Error: ${error}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return cleanJSON(text);
}

async function callNIM(prompt, systemInstruction) {
  const apiKey = process.env.NIM_API_KEY;
  if (!apiKey) throw new Error("NIM_API_KEY is not set.");
  const url = "https://integrate.api.nvidia.com/v1/chat/completions";
  
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const fallbackModels = [
    "meta/llama-3.1-8b-instruct",
    "google/gemma-2-2b-it",
    "mistralai/mistral-nemotron",
    "nvidia/nemotron-mini-4b-instruct"
  ];

  let lastError = null;

  for (const model of fallbackModels) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.1,
          max_tokens: 1024,
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Model ${model} failed: ${errorText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      return cleanJSON(text);

    } catch (err) {
      console.warn(`NIM Fallback Triggered. ${err.message}`);
      lastError = err;
      continue; // Try the next model
    }
  }

  throw new Error(`All NIM fallback models failed. Last error: ${lastError?.message}`);
}

function cleanJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7, cleaned.length - 3).trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3, cleaned.length - 3).trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return { response: text }; // fallback
  }
}

function getMockResponse(prompt) {
  const p = prompt.toLowerCase();
  
  if (p.includes("classify")) {
    return { category: "Perishable", urgency: "High", rescuePriority: 90 };
  } else if (p.includes("expiry")) {
    return { suggestedExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), reason: "Fresh food expires quickly." };
  } else if (p.includes("match")) {
    return { bestMatch: "Local Food Bank", matchScore: 95, distance: "2 km" };
  } else if (p.includes("summary")) {
    return { summary: "Rescued 50 meals of fresh produce for Local Food Bank." };
  } else if (p.includes("flagging") || p.includes("suspicious")) {
    return { isSuspicious: false, confidence: 98, reason: "Looks like a valid donation." };
  } else if (p.includes("alert")) {
    return { alertLevel: "CRITICAL", notify: ["admin", "local_ngos"] };
  } else if (p.includes("analytics")) {
    return { mealsSaved: 120, activeDonors: 15, trend: "+10% this week" };
  } else {
    return { answer: "I can help you list this item. Just fill in the title and quantity!" };
  }
}
