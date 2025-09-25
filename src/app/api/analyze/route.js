import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("cvFile");
    const jobDescription = formData.get("jobDescription");
    const jobLink = formData.get("jobLink");

    let cvText = "";
    if (file && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdf(buffer);
      cvText = pdfData.text;
    } else {
      cvText = "Unsupported file type.";
    }

    const prompt = `
      You are a CV analyst.
      Compare this CV:
      """${cvText}"""

      with this job: ${jobDescription || jobLink}.

      Return ONLY JSON in this format:
      {
        "matchScore": number,
        "strengths": string[],
        "gaps": string[],
        "suggestions": string[]
      }
    `;

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    let raw = res.choices[0].message.content.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/```(json)?/g, "").trim();
    }

    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze CV" },
      { status: 500 }
    );
  }
}
