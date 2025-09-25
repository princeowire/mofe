// lib/pdfUtils.js
import * as pdfjsLib from "pdfjs-dist";

// worker file setup: avoid importing the worker module directly (some bundlers
// report "Export default doesn't exist" for the worker). Instead point the
// workerSrc at a CDN-hosted worker that matches the installed pdfjs-dist
// version. This keeps bundlers happy and works in the browser at runtime.
// Update the version below if you upgrade pdfjs-dist in package.json.
const PDFJS_DIST_VERSION = "5.4.149";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_DIST_VERSION}/build/pdf.worker.min.mjs`;

export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}
