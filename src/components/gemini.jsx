"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CvAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert uploaded file → Base64
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
      alert("Please upload a CV and enter job description");
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
Give strengths, weaknesses, and a match score (0–100).`,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Mofe CV Analyst</h1>
        <button
          onClick={() => alert("Coming soon 🚀")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center"
        >
          Optimize Your CV with AI
        </motion.h2>

        {/* Job Description */}
        <textarea
          className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows="4"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {/* Upload CV */}
        <label className="block">
          <span className="block text-gray-700 font-medium mb-2">
            Upload Your CV (PDF)
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleAnalyze}
            className="block w-full border rounded-lg p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </label>

        {/* Loader */}
        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-600 font-medium text-center"
          >
            ⏳ Analyzing CV...
          </motion.p>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border p-4 rounded-lg bg-white shadow whitespace-pre-wrap"
          >
            {analysis}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} Mofe CV Analyst. Built with ❤️
      </footer>
    </div>
  );
}
