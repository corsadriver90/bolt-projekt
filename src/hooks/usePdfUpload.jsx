import { useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator';
    import { getPdfStyles } from '@/lib/pdfStyles'; 
    import rawIndexCss from '@/index.css?raw'; 
    import { useToast } from '@/components/ui/use-toast';
    import { logAdminEvent } from '@/lib/utils';
    import html2pdf from 'html2pdf.js';

    const allStyles = rawIndexCss + getPdfStyles();
    console.log('usePdfUpload.jsx: RAW INDEX CSS INITIAL LOAD LENGTH:', rawIndexCss.length);
    if (rawIndexCss.length < 10000) { 
      console.warn("usePdfUpload.jsx: RAW INDEX CSS IS POSSIBLY TOO SHORT! Expected >10000 for Tailwind + custom styles. Potential issue with Vite's ?raw import or index.css content.", rawIndexCss.substring(0,200));
      logAdminEvent('warning', 'usePdfUpload', 'RAW INDEX CSS IS POSSIBLY TOO SHORT!', { length: rawIndexCss.length, start: rawIndexCss.substring(0,100) }, 'GLOBAL');
    } else {
      console.log('usePdfUpload.jsx: RAW INDEX CSS (first 300 chars):', rawIndexCss.substring(0,300) + "...");
    }
    console.log('usePdfUpload.jsx: getPdfStyles LENGTH:', getPdfStyles().length);
    console.log('usePdfUpload.jsx: TOTAL allStyles LENGTH:', allStyles.length);


    export const usePdfUpload = () => {
      const { toast } = useToast();
      const [pdfUploadStatus, setPdfUploadStatus] = useState({
        uploading: false,
        success: false,
        error: null,
        url: null,
      });

      const generateAndUploadPdf = useCallback(async (confirmationData, ankaufsNummer, qrCodeDataURL) => {
        console.log('usePdfUpload.jsx: generateAndUploadPdf called with ankaufsNummer:', ankaufsNummer);
        
        if (!confirmationData || !ankaufsNummer) {
          const missingDataMsg = "PDF Upload: Missing confirmationData or ankaufsNummer.";
          console.warn("usePdfUpload.jsx:", missingDataMsg, { ankaufsNummer: ankaufsNummer || 'N/A' });
          setPdfUploadStatus(prev => ({ ...prev, error: "Fehlende Daten für PDF-Generierung."}));
          logAdminEvent('error', 'usePdfUpload', missingDataMsg, { ankaufsNummer: ankaufsNummer || 'N/A' }, ankaufsNummer || 'N/A');
          return null;
        }
        
        let finalQrCodeDataURL = qrCodeDataURL;
        if (!qrCodeDataURL || !qrCodeDataURL.startsWith('data:image/png') || qrCodeDataURL.length < 100) { // Increased minimum length for QR check
            const qrMsg = `PDF Upload: QR Code Data URL is missing, invalid, or too short (length: ${qrCodeDataURL ? qrCodeDataURL.length : 'undefined'}). PDF will be generated without QR code.`;
            console.warn("usePdfUpload.jsx:", qrMsg, { ankaufsNummer });
            logAdminEvent('warning', 'usePdfUpload', qrMsg, { ankaufsNummer, qrCodeDataURLLength: qrCodeDataURL ? qrCodeDataURL.length : 'undefined' }, ankaufsNummer);
            finalQrCodeDataURL = ''; 
        } else {
            console.log("usePdfUpload.jsx: Valid QR Code Data URL received for ankaufsNummer:", ankaufsNummer, `Length: ${qrCodeDataURL.length}`);
        }

        if (pdfUploadStatus.uploading) {
          console.log("usePdfUpload.jsx: PDF Upload läuft bereits für Ankaufsnummer:", ankaufsNummer);
          return pdfUploadStatus.url; 
        }
        
        setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
        let container = null; 
        console.log(`usePdfUpload.jsx: Starting PDF generation for ${ankaufsNummer}.`);

        try {
          container = document.createElement('div');
          container.id = '__pdfExport_temp_container_jsx'; // Unique ID for .jsx version
          container.style.cssText = `
            width: 794px; 
            min-height: 1123px; 
            background-color: #ffffff; 
            position: absolute; 
            top: -30000px; /* Further off-screen */
            left: -30000px; /* Further off-screen */
            overflow: visible !important; 
            border: 2px solid darkgreen; /* Distinct debug border */
            padding: 0;
            margin: 0;
            font-size: 10pt; 
          `;
          
          let generatedBodyHtml = generatePurchaseConfirmationHTML({ ...confirmationData, qrCodeDataURL: finalQrCodeDataURL }, 'bodyContent');
          
          console.log(`usePdfUpload.jsx: Generated body HTML for ${ankaufsNummer} (length: ${generatedBodyHtml.length}, first 300 chars): ${generatedBodyHtml.substring(0,300)}...`);
          
          if (generatedBodyHtml.trim().length < 500) { // Increased minimum length check
             console.error("usePdfUpload.jsx: CRITICAL: Generated body HTML is extremely short. Potential issue in pdfGenerator.jsx or data.");
             generatedBodyHtml = `<div style="color: red; font-size: 24px; padding: 50px; border: 2px solid red;">FEHLER: HTML-Inhalt konnte nicht generiert werden oder ist zu kurz. Länge: ${generatedBodyHtml.trim().length}</div>`;
             logAdminEvent('critical', 'usePdfUpload', 'Generated body HTML is too short', {length: generatedBodyHtml.trim().length, ankaufsNummer}, ankaufsNummer);
          }
          
          container.innerHTML = `
            <style type="text/css">${allStyles}</style>
            ${generatedBodyHtml}
          `;
          document.body.appendChild(container);
          console.log(`usePdfUpload.jsx: Temporary container for ${ankaufsNummer} appended to body. Checking styles...`);
          
          await new Promise(resolve => setTimeout(resolve, 750)); // Increased timeout further

          await Promise.all(Array.from(container.querySelectorAll('img')).map(img => {
            return new Promise(resolve => {
              if (img.complete && img.naturalHeight !== 0 && img.naturalWidth !== 0) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => {
                  console.warn(`usePdfUpload.jsx: Image failed to load: ${img.src ? img.src.substring(0,100) : '(no src)'}.`);
                  resolve(false); 
                };
                if (!img.src) resolve(true); 
              }
            });
          }));
          console.log(`usePdfUpload.jsx: Images awaited for ${ankaufsNummer}.`);
          
          const containerScrollWidth = container.scrollWidth;
          const containerScrollHeight = container.scrollHeight;
          
          console.log(`usePdfUpload.jsx: Container dimensions for ${ankaufsNummer}: scrollWidth: ${containerScrollWidth}, scrollHeight: ${containerScrollHeight}`);
          
          if (containerScrollWidth < 700 || containerScrollHeight < 1000) { // Stricter check for dimensions
            console.error(`usePdfUpload.jsx: CRITICAL: Container scroll dimensions for ${ankaufsNummer} are too small. PDF will likely be blank or incorrect. Dumping container content (first 2000 chars):`);
            console.log(container.outerHTML.substring(0, 2000) + "...");
            logAdminEvent('critical', 'usePdfUpload', `Container scroll dimensions are too small for ${ankaufsNummer}`, {width: containerScrollWidth, height: containerScrollHeight, htmlLength: container.outerHTML.length}, ankaufsNummer);
          }

          const opt = {
            margin:       10, 
            filename:     `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              backgroundColor: "#ffffff",
              scale: 2.5, // Slightly increased scale for potentially better rendering
              useCORS: true,
              allowTaint: true, 
              width: containerScrollWidth > 100 ? containerScrollWidth : 794, 
              height: containerScrollHeight > 100 ? containerScrollHeight : 1123,
              windowWidth: containerScrollWidth > 100 ? containerScrollWidth + 50 : 1200, // Ensure window is slightly larger
              windowHeight: containerScrollHeight > 100 ? containerScrollHeight + 50 : 1600,
              removeContainer: true, 
              logging: true, 
              scrollX: 0,
              scrollY: 0,
              letterRendering: true, 
              foreignObjectRendering: true,
              onclone: (clonedDoc) => {
                console.log(`usePdfUpload.jsx: html2canvas onclone: Document cloned for ${ankaufsNummer}.`);
                const qrImg = clonedDoc.querySelector('.qr-code-container img');
                if (qrImg) {
                    console.log(`usePdfUpload.jsx: html2canvas onclone: QR image found in cloned doc. Src: ${qrImg.src ? qrImg.src.substring(0,100) + '...' : 'No src'}`);
                } else {
                    console.warn(`usePdfUpload.jsx: html2canvas onclone: QR image NOT found in cloned doc for ${ankaufsNummer}.`);
                }
              }
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          const pdfBlob = await html2pdf().from(container).set(opt).outputPdf('blob');
          console.log(`usePdfUpload.jsx: PDF blob generated for ${ankaufsNummer}. Size: ${pdfBlob.size} bytes.`);
          
          console.log(`usePdfUpload.jsx: Opening PDF blob in new window for local inspection (ankaufsNummer: ${ankaufsNummer})...`);
          window.open(URL.createObjectURL(pdfBlob));

          if (container && document.body.contains(container)) { 
            document.body.removeChild(container);
            container = null; 
          }

          if (pdfBlob.size < 3000) { // Increased threshold for "small PDF" warning
            const message = `PDF blob size is very small for ${ankaufsNummer} (${pdfBlob.size} bytes). It might be blank or incomplete.`;
            console.warn("usePdfUpload.jsx:", message);
            logAdminEvent('warning', 'usePdfUpload', message, { size: pdfBlob.size, hasQr: !!finalQrCodeDataURL }, ankaufsNummer);
          }
          
          const fileName = `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
          
          const { error: uploadError } = await supabase.storage
            .from('lieferschein') 
            .upload(fileName, pdfBlob, {
              contentType: 'application/pdf',
              upsert: true, 
            });

          if (uploadError) {
            console.error(`usePdfUpload.jsx: Supabase storage upload error for ${ankaufsNummer}:`, uploadError);
            throw new Error(`Supabase Storage: ${uploadError.message}`);
          }
          
          const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
          const publicPdfUrl = publicUrlData?.publicUrl;

          if (!publicPdfUrl) {
            console.error(`usePdfUpload.jsx: Failed to get public URL for PDF for ${ankaufsNummer}:`, publicUrlData);
            throw new Error('Konnte keine öffentliche URL für das PDF erhalten.');
          }

          const { error: dbUpdateError } = await supabase
            .from('ankauf_requests')
            .update({ pdf_url: publicPdfUrl })
            .eq('ankaufs_nummer', ankaufsNummer);

          if (dbUpdateError) {
            console.error(`usePdfUpload.jsx: Supabase DB update error (pdf_url) for ${ankaufsNummer}:`, dbUpdateError);
            throw new Error(`DB Update: ${dbUpdateError.message}`);
          }
          
          setPdfUploadStatus({ uploading: false, success: true, error: null, url: publicPdfUrl });
          logAdminEvent('info', 'usePdfUpload', `PDF successfully uploaded for ${ankaufsNummer}`, { url: publicPdfUrl }, ankaufsNummer);
          console.log(`usePdfUpload.jsx: PDF process fully completed for ${ankaufsNummer}. URL: ${publicPdfUrl}`);
          return publicPdfUrl;

        } catch (error) {
          console.error(`usePdfUpload.jsx: Error in generateAndUploadPdf (client-side) for ${ankaufsNummer}:`, error);
          const errorMessage = error.message || 'Unbekannter Fehler beim PDF-Upload.';
          setPdfUploadStatus({ uploading: false, success: false, error: errorMessage, url: null });
          logAdminEvent('error', 'usePdfUpload', `PDF upload failed for ${ankaufsNummer}: ${errorMessage}`, { errorStack: error.stack, ankaufsNummer }, ankaufsNummer);
          toast({
            title: 'Fehler beim PDF-Upload',
            description: 'Der Begleitschein konnte nicht als PDF hochgeladen werden. Unser Team wurde informiert.',
            variant: 'destructive',
          });
          return null;
        } finally {
           if (container && document.body.contains(container)) { 
            document.body.removeChild(container);
            console.log(`usePdfUpload.jsx: Temporary container (for ${ankaufsNummer}) removed from body in finally block.`);
          }
        }
      }, [toast, pdfUploadStatus.uploading]); // Removed success and url from dependencies as they are set inside

      return { pdfUploadStatus, generateAndUploadPdf };
    };