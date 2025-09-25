import { AttachmentIcon, CheckCircleIcon } from "./Icons";

export default function FileUpload({ cvFile, onUpload, triggerFileInput, fileInputRef }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center w-full">
      <h3 className="text-lg font-semibold mb-4">Upload Your CV</h3>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-blue-400 hover:bg-gray-50"
        onClick={triggerFileInput}
      >
        <AttachmentIcon className="text-blue-500 mx-auto" />
        <p className="mt-2">Drag & drop or click to browse</p>
        <p className="text-sm text-gray-500">Supports PDF and Word</p>
      </div>
      <input type="file" ref={fileInputRef} onChange={onUpload} accept=".pdf,.doc,.docx" className="hidden" />
      {cvFile && (
        <p className="mt-2 text-green-600 flex items-center justify-center">
          <CheckCircleIcon className="mr-2" /> {cvFile.name}
        </p>
      )}
    </div>
  );
}
