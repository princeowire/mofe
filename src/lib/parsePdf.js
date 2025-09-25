import pdf from "pdf-parse";

/**
 * Extracts text from a PDF file
 * @param {File} file - PDF file from input
 * @returns {Promise<string>} text content
 */
export async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer(); // convert browser File → ArrayBuffer
  const data = await pdf(Buffer.from(buffer));
  return data.text;
}
