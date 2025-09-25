import { motion } from "framer-motion";
import CircularProgress from "./CircularProgress";
import { CheckCircleIcon, WarningIcon, DownloadIcon } from "./Icons";

export default function AnalysisResults({ analysisResult }) {
  if (!analysisResult) return null;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 text-center max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>

      {/* Score */}
      <div className="flex justify-center mb-6">
        <CircularProgress
          value={analysisResult.matchScore}
          size={120}
          strokeWidth={8}
          color={
            analysisResult.matchScore >= 80
              ? "green"
              : analysisResult.matchScore >= 60
              ? "yellow"
              : "red"
          }
        />
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h4 className="font-semibold text-left mb-2">Strengths</h4>
        <ul className="space-y-2 text-left">
          {analysisResult.strengths.map((s, i) => (
            <li key={i} className="flex items-start">
              <CheckCircleIcon className="text-green-500 mr-2" /> {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Gaps */}
      <div className="mb-6">
        <h4 className="font-semibold text-left mb-2">Gaps</h4>
        <ul className="space-y-2 text-left">
          {analysisResult.gaps.map((g, i) => (
            <li key={i} className="flex items-start">
              <WarningIcon className="text-yellow-500 mr-2" /> {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <h4 className="font-semibold text-left mb-2">Suggestions</h4>
        <ul className="space-y-2 text-left">
          {analysisResult.suggestions.map((s, i) => (
            <li key={i} className="flex items-start">
              <CheckCircleIcon className="text-blue-500 mr-2" /> {s}
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center">
        <DownloadIcon className="mr-2" /> Download Full Report
      </button>
    </motion.div>
  );
}
