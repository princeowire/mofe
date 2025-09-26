'use client'

import React, { useState } from "react";
import { Loader2, Upload, FileText, Send, Sparkles } from "lucide-react";

const CVUploader = () => {
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      setError("Please upload your CV first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("cvFile", cvFile);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/match-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResponse(data.matchingResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Sparkles className="w-6 h-6" />
            Mofe Cv
          </div>
          <div className="hidden md:flex gap-6 text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">Features</a>
            <a href="#" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#" className="hover:text-blue-600 transition">About</a>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center px-6 py-12 bg-gradient-to-br from-blue-50 to-white">
        <h1 className="text-4xl font-bold text-gray-800 max-w-2xl">
          Make Every Application Count 🚀
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          Upload your CV, paste a job description, and let our AI analyze your match instantly.  
          No more guessing — apply smarter, not harder.
        </p>
      </header>

      {/* Main Card */}
      <main className="flex-grow flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            CV & Job Matcher
          </h2>
          <p className="text-center text-gray-500 text-sm">
            Get personalized insights in seconds.
          </p>

          {/* Drag & Drop CV Upload */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              id="cv-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="cv-upload" className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              {cvFile ? (
                <span className="text-gray-700 font-medium">{cvFile.name}</span>
              ) : (
                <span className="text-gray-500">
                  Drag & drop or click to upload CV
                </span>
              )}
            </label>
          </div>

          {/* Job Description */}
          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Job Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit
                </>
              )}
            </button>
          </div>

          {/* Response */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 font-medium">
              ❌ {error}
            </div>
          )}
          {response && (
            <div className="p-4 rounded-xl bg-green-50 text-green-700 font-medium whitespace-pre-line">
              ✅ {response}
            </div>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">Why Use Mofe Cv?</h2>
          <p className="text-gray-600 mt-2">
            Stand out from the crowd with tailored feedback.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-2">Quick Analysis</h3>
              <p className="text-gray-600 text-sm">
                Upload, paste, and get instant AI-powered insights — no delays.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-2">Smarter Applications</h3>
              <p className="text-gray-600 text-sm">
                Learn where your CV aligns (and doesn’t) with the role.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-gray-800 mb-2">Boost Confidence</h3>
              <p className="text-gray-600 text-sm">
                Apply knowing exactly how well you fit the job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <span>© {new Date().getFullYear()} Mofe Cv. All rights reserved.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CVUploader;
