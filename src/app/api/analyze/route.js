import { NextResponse } from "next/server";
import OpenAI from "openai";

// Avoid importing the top-level `pdf-parse` module directly because its
// `index.js` contains a debug block that runs on require and tries to open
// a local test PDF (causing ENOENT). We'll dynamically import the
// implementation file inside the handler.

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("cvFile");
		const jobDescription = formData.get("jobDescription");
		const jobLink = formData.get("jobLink");

		// Dynamically import the implementation to avoid the test harness in
		// `pdf-parse`'s top-level index.js.
		const pdfModule = await import("pdf-parse/lib/pdf-parse.js");
		const pdf = pdfModule.default || pdfModule;

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
