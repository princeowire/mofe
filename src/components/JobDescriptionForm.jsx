export default function JobDescriptionForm({ jobDescription, setJobDescription, jobLink, setJobLink }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Job Description / Link</h3>
      <textarea
        placeholder="Paste job description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Paste job URL"
        value={jobLink}
        onChange={(e) => setJobLink(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
