// src/lib/pdfGenerator.jsx

import { getPage1Content, getPage2Content } from '@/lib/pdfContentGenerator';
import { getPdfStyles } from '@/lib/pdfStyles';

/**
 * Baut das vollständige HTML-Dokument für den Begleitschein.
 *
 * @param {Object} data
 *   - submissionDate: ISO-String (z.B. "2025-06-01T12:34:56.789Z")
 *   - ankaufsNummer: String (z.B. "BR-12345678")
 *   - name: String
 *   - email: String
 *   - address: String
 *   - totalWeight: Number
 *   - qrCodeDataURL: String (Data-URL des QR-Codes)
 *   - (ggf. weitere Felder, die getPage1Content/getPage2Content nutzen)
 * @param {'bodyContent'|'fullDocument'} outputType
 *   Wenn 'bodyContent', wird nur der <body>-Block zurückgegeben. Bei 'fullDocument'
 *   wird das komplette <!DOCTYPE html>…-Dokument inkl. Inline-Styles gebaut.
 */
export const generatePurchaseConfirmationHTML = (data, outputType = 'fullDocument') => {
  const { submissionDate, ankaufsNummer: providedAnkaufsNummer } = data;
  const ankaufsNummer =
    providedAnkaufsNummer ||
    `BR-${new Date(submissionDate).getTime().toString().slice(-8)}`;
  const formattedDate = new Date(submissionDate).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const bodyContent = `
    <div class="pdf-container">
      <div class="pdf-page pdf-page-1">
        ${getPage1Content(data, ankaufsNummer, formattedDate)}
      </div>
      <div class="page-break"></div>
      <div class="pdf-page pdf-page-2">
        ${getPage2Content(data)}
      </div>
    </div>
  `;

  if (outputType === 'bodyContent') {
    return bodyContent;
  }

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8">
        <title>Begleitschein - ${ankaufsNummer}</title>
        <style>
          ${getPdfStyles()}
        </style>
      </head>
      <body>
        ${bodyContent}
      </body>
    </html>
  `;
};
