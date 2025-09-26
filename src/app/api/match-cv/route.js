import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse"; // for parsing CVs in PDF format

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("cvFile");
    const jobDescription = formData.get("jobDescription");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }
    if (!jobDescription || jobDescription.trim() === "") {
      return new Response(JSON.stringify({ error: "Job description is required" }), { status: 400 });
    }

    // Convert file → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Extract text from CV (PDF only here, but we can add .doc/.docx later)
    let cvText = "";
    if (file.name.endsWith(".pdf")) {
      const pdfData = await pdf(buffer);
      cvText = pdfData.text;
    } else {
      cvText = buffer.toString("utf8"); // fallback for txt/doc
    }

    // ✅ Use Gemini for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Here is a CV:

${cvText}

Here is a job description:

${jobDescription}

Compare them and provide:
- How well the CV matches the job description
- Strengths
- Weaknesses
- Suggestions for improvement
    `;

    const result = await model.generateContent(prompt);

    return new Response(
      JSON.stringify({ matchingResult: result.response.text() }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in /api/match-cv:", err);
    return new Response(JSON.stringify({ error: err.message || "Something went wrong" }), {
      status: 500,
    });
  }
}
