import { getPage1Content, getPage2Content } from '@/lib/pdfContentGenerator';
    import { getPdfStyles } from '@/lib/pdfStyles';

    export const generatePurchaseConfirmationHTML = (data, outputType = 'fullDocument') => {
      const { submissionDate, ankaufsNummer: providedAnkaufsNummer } = data;
      const ankaufsNummer = providedAnkaufsNummer || `BR-${new Date(submissionDate).getTime().toString().slice(-8)}`;
      const formattedDate = new Date(submissionDate).toLocaleDateString('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
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