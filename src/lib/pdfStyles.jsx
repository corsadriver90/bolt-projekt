export const getBaseStyles = () => `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
      body { 
        font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #ffffff; 
        color: #2d3748; 
        font-size: 8pt; 
        line-height: 1.4;
      }
      .pdf-container { 
        width: 210mm; 
        margin: 0 auto; 
        background-color: #ffffff; 
        box-sizing: border-box;
      }
      .pdf-page {
        width: 190mm; 
        min-height: 277mm; 
        padding: 0; 
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: visible; 
      }
      .page-content { 
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100%; 
      }
      .page-break { 
        page-break-before: always !important; 
        height: 0; 
        display: block;
        clear: both;
      }
      p, li, div { margin-bottom: 1mm; } 
      strong { font-weight: 500; color: #000; }
    `;

    export const getHeaderAndLogoStyles = () => `
      .header { 
        text-align: center; 
        margin-bottom: 3.5mm; 
        padding-bottom: 2mm; 
        border-bottom: 0.75px solid #10B981; 
      }
      .header h1 { 
        font-size: 14.5pt; 
        color: #10B981; 
        margin: 0 0 0.8mm 0; 
        font-weight: 700; 
      }
      .header .slogan {
        font-size: 8pt;
        color: #4a5568;
        margin-top: 0.6mm;
      }
      .logo-inline { 
        display: inline-block; 
        vertical-align: middle; 
        margin-right: 2.2mm; 
        width: 7.5mm; 
        height: 7.5mm; 
        fill: #10B981; 
      }
    `;

    export const getHeadingStyles = () => `
      .main-section-heading { 
        font-size: 10.5pt; 
        color: #0EA5E9;
        margin-top: 2.5mm;
        margin-bottom: 1.8mm;
        font-weight: 500;
        padding-bottom: 0.8mm;
        border-bottom: 0.35px solid #ccc;
        display: block;
      }
       .section-subheading { 
        font-size: 9pt; 
        color: #10B981;
        margin-top: 1.8mm;
        margin-bottom: 1mm;
        font-weight: 500;
        display: block;
      }
    `;
    
    export const getTextElementStyles = () => `
      .ankauf-details {
        text-align: center;
        font-size: 8.5pt; 
        margin-bottom: 2.5mm;
        padding: 1.2mm;
        background-color: #f8fafc; 
        border-radius: 0.8mm;
      }
      .ankauf-details p { margin: 0.5mm 0; }
      .important-note-combined {
        background-color: #fefcbf; 
        border: 0.35px solid #fef08a; 
        padding: 1.8mm;
        margin-top: 2mm;
        margin-bottom: 2mm;
        border-radius: 0.8mm;
      }
      .important-note-combined p { margin: 0; font-size: 7.5pt; line-height: 1.35;} 
    `;

    export const getTableStyles = () => `
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 1.2mm; 
        margin-bottom: 1.8mm; 
        font-size: 8pt; 
      }
      th, td { 
        border: 0.35px solid #e2e8f0; 
        padding: 1.2mm 1.4mm; 
        text-align: left; 
        vertical-align: top;
      }
      th { 
        background-color: #f1f5f9; 
        font-weight: 500; 
      }
      .total-row td { 
        font-weight: bold; 
        background-color: #e2e8f0; 
      }
    `;

    export const getSectionAndGridStyles = () => `
      .section-compact { 
        margin-bottom: 1.8mm; 
        padding: 1.8mm; 
        background-color: #f8fafc; 
        border-radius: 0.8mm; 
        border: 0.35px solid #f1f5f9; 
      }
      .info-grid { 
        display: flex; 
        justify-content: space-between;
        margin-bottom: 1.8mm;
      }
      .info-block { 
        padding: 1mm;
        width: 48%; 
      }
      .info-block .section-subheading { margin-top: 0; margin-bottom: 0.6mm;}
      
      .main-content-columns { 
        display: flex; 
        justify-content: space-between;
        margin-bottom: 2.5mm;
        flex-grow: 1; 
      }
      .column-left {
        width: 58%;
        display: flex;
        flex-direction: column;
      }
      .column-right {
        width: 40%;
        display: flex;
        flex-direction: column;
      }
    `;
    
    export const getQrCodeAndSignatureStyles = () => `
      .qr-signature-section { 
         display: flex;
         flex-direction: column;
         justify-content: space-between; 
         flex-grow: 1; 
      }
      .qr-code-container {  text-align: left; margin-bottom: 1.8mm; }
      .qr-code-container img { 
        width: 30mm; 
        height: 30mm; 
        border: 0.35px solid #cbd5e1; 
        padding: 1mm; 
        border-radius: 0.8mm; 
        display: block;
      }
      .qr-id { font-size: 6.5pt; color: #64748b; margin-top: 0.6mm; } 
      .signature-area { margin-top: auto; padding-top: 1.8mm; font-size: 8pt; } 
      .signature-area p { margin-bottom: 1.2mm; }
      .signature-line-container { margin-top: 1.8mm; display: block;}
      .signature-line {
        display: inline-block;
        width: 38mm; 
        border-bottom: 0.35px solid #475569;
        margin-left: 1mm;
      }
    `;

    export const getPage2SpecificStyles = () => `
      .page2-header { margin-top: 0 !important; }
      .page2-header h1 { font-size: 13.5pt; }
      .combined-hints-section {
        margin-top: 2.5mm;
        padding: 2.5mm;
        border: 0.35px solid #e2e8f0;
        border-radius: 0.8mm;
        background-color: #f8fafc;
        flex-grow: 1; 
      }
      .combined-hints-section .section-subheading { 
        font-size: 10pt; 
        margin-bottom: 1.8mm;
      }
      .combined-hints-section ol, .combined-hints-section ul {
        padding-left: 3.5mm; 
        margin-top: 0.6mm;
        margin-bottom: 1.2mm;
      }
      .combined-hints-section li {
        font-size: 7.5pt; 
        line-height: 1.35;
        margin-bottom: 0.6mm;
      }
      .combined-hints-section p { font-size: 7.5pt; line-height: 1.35; margin-bottom: 0.8mm;}
      .combined-hints-section a { color: #10B981; text-decoration: none; }
      .combined-hints-section a:hover { text-decoration: underline; }
    `;

    export const getFooterStyles = () => `
      .footer { 
        margin-top: auto; 
        padding-top: 1.8mm; 
        font-size: 7pt; 
        text-align: center; 
        color: #64748b; 
        border-top: 0.35px solid #cbd5e1; 
        width: 100%; 
      }
      .footer p { margin: 0.5mm 0; }
    `;
    
    export const getPrintSpecificStyles = () => `
      @media print {
        body { background-color: #fff !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;}
        .pdf-container { box-shadow: none !important; border: none !important; margin: 0 auto !important; max-width: 100% !important; border-radius: 0 !important; }
        .pdf-page { 
            padding: 0 !important; 
            min-height: 0; 
            overflow: visible !important; 
        } 
        .no-print { display: none !important; }
        @page { 
          size: A4 portrait;
          margin: 10mm; 
        }
      }
    `;

    export const getPdfStyles = () => `
        ${getBaseStyles()}
        ${getHeaderAndLogoStyles()}
        ${getHeadingStyles()}
        ${getTextElementStyles()}
        ${getTableStyles()}
        ${getSectionAndGridStyles()}
        ${getQrCodeAndSignatureStyles()}
        ${getPage2SpecificStyles()}
        ${getFooterStyles()}
        ${getPrintSpecificStyles()}
    `;