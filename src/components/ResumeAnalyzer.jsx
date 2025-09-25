"use client";
import { useState } from "react";

export default function ResumeAnalyzer() {
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    if (!cvFile || (!jobDescription && !jobLink)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cvFile", cvFile);
      formData.append("jobDescription", jobDescription);
      formData.append("jobLink", jobLink);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Frontend error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Resume Analyzer</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setCvFile(e.target.files[0])}
        className="mb-4"
      />

      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <input
        type="text"
        placeholder="or paste job link"
        value={jobLink}
        onChange={(e) => setJobLink(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze CV"}
      </button>

      {analysisResult && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">Match Score: {analysisResult.matchScore}</h3>
          <p><strong>Strengths:</strong> {analysisResult.strengths.join(", ")}</p>
          <p><strong>Gaps:</strong> {analysisResult.gaps.join(", ")}</p>
          <p><strong>Suggestions:</strong> {analysisResult.suggestions.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
