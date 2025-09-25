"use client";
import { useState } from "react";

export default function CvAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert PDF to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleAnalyze = async (e) => {
    const file = e.target.files[0];
    if (!file || !jobDescription) {
      alert("Upload a CV and add job description");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const base64Pdf = await fileToBase64(file);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this CV against the job description. 
Job Description: ${jobDescription}. 
Give strengths, weaknesses, and match score (0–100).`,
                  },
                  {
                    inline_data: {
                      mime_type: "application/pdf",
                      data: base64Pdf,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        console.error("Gemini API error:", data.error);
        setAnalysis("❌ " + data.error.message);
        return;
      }


      setAnalysis(
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "⚠️ No analysis returned"
      );
    } catch (err) {
      console.error(err);
      setAnalysis("❌ Error analyzing CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Mofe CV Analyst</h1>

      {/* Job description input */}
      <textarea
        className="w-full border p-2 rounded"
        rows="4"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {/* CV upload */}
      <input type="file" accept="application/pdf" onChange={handleAnalyze} />

      {/* Loading indicator */}
      {loading && <p className="text-blue-600">⏳ Analyzing CV...</p>}

      {/* Results */}
      {analysis && (
        <div className="border p-4 rounded bg-gray-50 whitespace-pre-wrap">
          {analysis}
        </div>
      )}
    </div>
  );
}
