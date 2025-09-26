// "use client";

// import { useState, useRef } from "react";
// import Stepper from "./Stepper";
// import FileUpload from "./FileUpload";
// import JobDescriptionForm from "./JobDescriptionForm";
// import AnalysisResults from "./AnalysisResults";
// import { ChevronRightIcon, LoadingSpinner } from "./Icons";

// export default function MofeCVAnalyst() {
//   const [step, setStep] = useState(0);
//   const [cvFile, setCvFile] = useState(null);
//   const [jobDescription, setJobDescription] = useState("");
//   const [jobLink, setJobLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [analysisResult, setAnalysisResult] = useState(null);

//   const fileInputRef = useRef(null);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setCvFile(file);
//   };

//   const triggerFileInput = () => fileInputRef.current.click();

//   const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));

//   // Send the CV file and job info to the server API which runs OpenAI and returns JSON
//   const handleAnalyze = async () => {
//     if (!cvFile || (!jobDescription && !jobLink)) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("cvFile", cvFile);
//       formData.append("jobDescription", jobDescription);
//       formData.append("jobLink", jobLink);

//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         body: formData
//       });

//       if (!response.ok) {
//         const errBody = await response.text();
//         throw new Error(`API error: ${response.status} ${errBody}`);
//       }

//       const parsed = await response.json();
//       setAnalysisResult(parsed);
//       setStep(2);
//     } catch (err) {
//       console.error("Analyze error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const steps = [
//     { title: "Upload CV", description: "Upload your resume" },
//     { title: "Job Details", description: "Paste description or link" },
//     { title: "Results", description: "See your analysis" }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center">
//       <div className="max-w-[1000px] flex-1 flex flex-col justify-center items-center">
//         {/* Header */}
//         <header className="text-center mb-10 w-full">
//           <h1 className="text-4xl font-extrabold text-gray-800">Mofe CV Analyst</h1>
//           <p className="mt-2 text-gray-600">Smart AI-driven CV optimization tool</p>
//         </header>

//         {/* Stepper */}
//         <Stepper steps={steps} currentStep={step} />

//         {/* Step Content */}
//         <div className="mt-8">
//           {step === 0 && (
//             <FileUpload
//               cvFile={cvFile}
//               onUpload={handleFileUpload}
//               triggerFileInput={triggerFileInput}
//               fileInputRef={fileInputRef}
//             />
//           )}

//           {step === 1 && (
//             <JobDescriptionForm
//               jobDescription={jobDescription}
//               setJobDescription={setJobDescription}
//               jobLink={jobLink}
//               setJobLink={setJobLink}
//             />
//           )}

//           {step === 2 && !loading && analysisResult && (
//             <AnalysisResults analysisResult={analysisResult} />
//           )}

//           {loading && (
//             <div className="flex justify-center py-10">
//               <LoadingSpinner />
//             </div>
//           )}
//         </div>

//         {/* Footer Buttons */}
//         <div className="mt-10 flex justify-center">
//           {step < 1 && (
//             <button
//               onClick={handleNext}
//               disabled={!cvFile}
//               className={`flex items-center px-6 py-3 rounded-xl font-semibold transition ${
//                 cvFile
//                   ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Next <ChevronRightIcon className="ml-2" />
//             </button>
//           )}

//           {step === 1 && (
//             <button
//               onClick={handleAnalyze}
//               disabled={!jobDescription && !jobLink}
//               className={`flex items-center px-6 py-3 rounded-xl font-semibold transition ${
//                 jobDescription || jobLink
//                   ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
//                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//             >
//               Analyze CV
//             </button>
//           )}
//         </div>

//         {/* Footer Note */}
//         <footer className="mt-12 text-center text-gray-400 text-sm">
//           © {new Date().getFullYear()} Mofe CV Analyst. All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }
