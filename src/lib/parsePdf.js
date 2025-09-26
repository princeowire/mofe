/**
 * Extracts text from a PDF file
 * @param {File} file - PDF file from input
 * @returns {Promise<string>} text content
 */
export async function extractTextFromPdf(file) {
  const buffer = await file.arrayBuffer(); // convert browser File → ArrayBuffer
  // Dynamically import the implementation to avoid the pdf-parse index
  // test harness from running at module load time.
  const pdfModule = await import("pdf-parse/lib/pdf-parse.js");
  const pdf = pdfModule.default || pdfModule;
  const data = await pdf(Buffer.from(buffer));
  return data.text;
}
