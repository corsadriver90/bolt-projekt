import { useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator';
    import { getPdfStyles } from '@/lib/pdfStyles';
    import { useToast } from '@/components/ui/use-toast';
    import { logAdminEvent } from '@/lib/utils';
    import html2pdf from 'html2pdf.js';

    const waitForAllImagesInContainer = (containerElement) => {
      return new Promise((resolve) => {
        const images = Array.from(containerElement.querySelectorAll('img'));
        let loadedImagesCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          console.log("usePdfUpload: waitForAllImages: No images found in container.");
          resolve();
          return;
        }
        console.log(`usePdfUpload: waitForAllImages: Found ${totalImages} images. Waiting for them to load...`);

        images.forEach((img) => {
          if (img.complete && img.naturalHeight !== 0 && img.naturalWidth !== 0) {
            loadedImagesCount++;
            console.log(`usePdfUpload: waitForAllImages: Image ${img.src ? img.src.substring(0,50) : 'N/A'} already complete.`);
          } else {
            const imgLoadHandler = () => {
              loadedImagesCount++;
              console.log(`usePdfUpload: waitForAllImages: Image ${img.src ? img.src.substring(0,50) : 'N/A'} loaded.`);
              if (loadedImagesCount === totalImages) {
                console.log("usePdfUpload: waitForAllImages: All images loaded.");
                resolve();
              }
              img.removeEventListener('load', imgLoadHandler);
              img.removeEventListener('error', imgErrorHandler);
            };
            const imgErrorHandler = () => {
              console.warn(`usePdfUpload: waitForAllImages: Image failed to load: ${img.src ? img.src.substring(0,50) : 'N/A'}. Proceeding anyway.`);
              loadedImagesCount++;
              if (loadedImagesCount === totalImages) {
                console.log("usePdfUpload: waitForAllImages: All images processed (some may have failed).");
                resolve();
              }
              img.removeEventListener('load', imgLoadHandler);
              img.removeEventListener('error', imgErrorHandler);
            };
            img.addEventListener('load', imgLoadHandler);
            img.addEventListener('error', imgErrorHandler);
          }
        });

        if (loadedImagesCount === totalImages) {
          console.log("usePdfUpload: waitForAllImages: All images were already complete.");
          resolve();
        }
      });
    };


    export const usePdfUpload = () => {
      const { toast } = useToast();
      const [pdfUploadStatus, setPdfUploadStatus] = useState({
        uploading: false,
        success: false,
        error: null,
        url: null,
      });

      const generateAndUploadPdf = useCallback(async (confirmationData, ankaufsNummer, qrCodeDataURL) => {
        if (!confirmationData || !ankaufsNummer) {
          const missingDataMsg = "PDF Upload: Missing confirmationData or ankaufsNummer.";
          console.warn(missingDataMsg, { ankaufsNummer: ankaufsNummer || 'N/A' });
          setPdfUploadStatus(prev => ({ ...prev, error: "Fehlende Daten für PDF-Generierung."}));
          logAdminEvent('error', 'usePdfUpload', missingDataMsg, { ankaufsNummer: ankaufsNummer || 'N/A' }, ankaufsNummer || 'N/A');
          return null;
        }
        
        let finalQrCodeDataURL = qrCodeDataURL;
        if (!qrCodeDataURL || !qrCodeDataURL.startsWith('data:image/png') || qrCodeDataURL.length < 50) {
            const qrMsg = "PDF Upload: QR Code Data URL is missing, invalid, or too short. PDF will be generated without QR code.";
            console.warn(qrMsg, { ankaufsNummer, qrCodeDataURLLength: qrCodeDataURL ? qrCodeDataURL.length : 'undefined' });
            logAdminEvent('warning', 'usePdfUpload', qrMsg, { ankaufsNummer, qrCodeDataURLLength: qrCodeDataURL ? qrCodeDataURL.length : 'undefined' }, ankaufsNummer);
            finalQrCodeDataURL = ''; 
        } else {
            console.log("usePdfUpload: Valid QR Code Data URL received for ankaufsNummer:", ankaufsNummer, `Length: ${qrCodeDataURL.length}`);
        }

        if (pdfUploadStatus.uploading) {
          console.log("usePdfUpload: PDF Upload läuft bereits für Ankaufsnummer:", ankaufsNummer);
          return pdfUploadStatus.url; 
        }
        if (pdfUploadStatus.success && pdfUploadStatus.url) {
            console.log("usePdfUpload: PDF bereits erfolgreich hochgeladen für Ankaufsnummer:", ankaufsNummer);
            return pdfUploadStatus.url;
        }

        setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
        let tempPdfContainer = null; 
        console.log(`usePdfUpload: Starting PDF generation for ${ankaufsNummer}.`);

        try {
          tempPdfContainer = document.createElement('div');
          tempPdfContainer.id = '__pdfExport';


          const styleTag = document.createElement('style');
          styleTag.innerHTML = getPdfStyles(); 
          tempPdfContainer.appendChild(styleTag);
          
          
          const htmlContentForContainer = generatePurchaseConfirmationHTML({ ...confirmationData, qrCodeDataURL: finalQrCodeDataURL }, true); 
          
          
          const contentWrapper = document.createElement('div');
          contentWrapper.innerHTML = htmlContentForContainer;
          tempPdfContainer.appendChild(contentWrapper);
          
          Object.assign(tempPdfContainer.style, {
            width: '794px', 
            height: '1123px', 
            backgroundColor: '#ffffff',
            overflow: 'visible',
            position: 'absolute',
            top: '-9999px',
            left: '0px' 
          });
          document.body.appendChild(tempPdfContainer);
          console.log(`usePdfUpload: Temporary container for ${ankaufsNummer} appended to body.`);
          
          await waitForAllImagesInContainer(tempPdfContainer);
          console.log(`usePdfUpload: Images awaited for ${ankaufsNummer}.`);
          
          
          const opt = {
            margin:       10, 
            filename:     `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
              backgroundColor: '#ffffff',
              scale: 2, 
              useCORS: true,
              allowTaint: true, 
              width: tempPdfContainer.scrollWidth,
              height: tempPdfContainer.scrollHeight,
              removeContainer: true, 
              logging: true, 
              scrollX: 0,
              scrollY: 0,
              letterRendering: true, 
              foreignObjectRendering: true,
              onclone: (clonedDoc) => {
                console.log(`usePdfUpload: html2canvas onclone: Document cloned for ${ankaufsNummer}.`);
                const qrImg = clonedDoc.querySelector('.qr-code-container img');
                if (qrImg) {
                    console.log(`usePdfUpload: html2canvas onclone: QR image found in cloned doc. Src: ${qrImg.src ? qrImg.src.substring(0,100) + '...' : 'No src'}`);
                    console.log(`usePdfUpload: html2canvas onclone: QR image naturalWidth: ${qrImg.naturalWidth}, naturalHeight: ${qrImg.naturalHeight}, complete: ${qrImg.complete}`);
                } else {
                    console.warn(`usePdfUpload: html2canvas onclone: QR image NOT found in cloned doc for ${ankaufsNummer}. This is expected if finalQrCodeDataURL was empty.`);
                }
              }
            },
            jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
          };

          const pdfBlob = await html2pdf().from(tempPdfContainer).set(opt).outputPdf('blob');
          console.log(`usePdfUpload: PDF blob generated for ${ankaufsNummer}. Size: ${pdfBlob.size} bytes.`);
          

          if (tempPdfContainer && document.body.contains(tempPdfContainer)) { 
            document.body.removeChild(tempPdfContainer);
            tempPdfContainer = null; 
            console.log(`usePdfUpload: Temporary container (for ${ankaufsNummer}) removed from body (after blob generation).`);
          }

          if (pdfBlob.size < 1000 && finalQrCodeDataURL) { 
            console.warn(`usePdfUpload: PDF blob size is very small for ${ankaufsNummer} (${pdfBlob.size} bytes) despite having a QR code. It might be blank.`);
            logAdminEvent('warning', 'usePdfUpload', `Generated PDF blob size is suspiciously small for ${ankaufsNummer} (with QR)`, { size: pdfBlob.size }, ankaufsNummer);
          } else if (pdfBlob.size < 500 && !finalQrCodeDataURL) {
             console.warn(`usePdfUpload: PDF blob size is very small for ${ankaufsNummer} (${pdfBlob.size} bytes) (no QR). It might be blank.`);
             logAdminEvent('warning', 'usePdfUpload', `Generated PDF blob size is suspiciously small for ${ankaufsNummer} (no QR)`, { size: pdfBlob.size }, ankaufsNummer);
          }
          
          const fileName = `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
          
          const { error: uploadError } = await supabase.storage
            .from('lieferschein') 
            .upload(fileName, pdfBlob, {
              contentType: 'application/pdf',
              upsert: true, 
            });

          if (uploadError) {
            console.error(`usePdfUpload: Supabase storage upload error for ${ankaufsNummer}:`, uploadError);
            throw new Error(`Supabase Storage: ${uploadError.message}`);
          }
          console.log(`usePdfUpload: PDF uploaded to Supabase for ${ankaufsNummer}.`);
          
          const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
          const publicPdfUrl = publicUrlData?.publicUrl;

          if (!publicPdfUrl) {
            console.error(`usePdfUpload: Failed to get public URL for PDF for ${ankaufsNummer}:`, publicUrlData);
            throw new Error('Konnte keine öffentliche URL für das PDF erhalten.');
          }

          const { error: dbUpdateError } = await supabase
            .from('ankauf_requests')
            .update({ pdf_url: publicPdfUrl })
            .eq('ankaufs_nummer', ankaufsNummer);

          if (dbUpdateError) {
            console.error(`usePdfUpload: Supabase DB update error (pdf_url) for ${ankaufsNummer}:`, dbUpdateError);
            throw new Error(`DB Update: ${dbUpdateError.message}`);
          }
          
          setPdfUploadStatus({ uploading: false, success: true, error: null, url: publicPdfUrl });
          logAdminEvent('info', 'usePdfUpload', `PDF successfully uploaded for ${ankaufsNummer}`, { url: publicPdfUrl }, ankaufsNummer);
          console.log(`usePdfUpload: PDF process fully completed for ${ankaufsNummer}. URL: ${publicPdfUrl}`);
          return publicPdfUrl;

        } catch (error) {
          console.error(`usePdfUpload: Error in generateAndUploadPdf (client-side) for ${ankaufsNummer}:`, error);
          const errorMessage = error.message || 'Unbekannter Fehler beim PDF-Upload.';
          setPdfUploadStatus({ uploading: false, success: false, error: errorMessage, url: null });
          logAdminEvent('error', 'usePdfUpload', `PDF upload failed for ${ankaufsNummer}: ${errorMessage}`, { error: error.stack }, ankaufsNummer);
          toast({
            title: 'Fehler beim PDF-Upload',
            description: 'Der Begleitschein konnte nicht als PDF hochgeladen werden. Unser Team wurde informiert.',
            variant: 'destructive',
          });
          return null;
        } finally {
           if (tempPdfContainer && document.body.contains(tempPdfContainer)) { 
            document.body.removeChild(tempPdfContainer);
            console.log(`usePdfUpload: Temporary container (for ${ankaufsNummer}) removed from body in finally block.`);
          }
        }
      }, [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]);

      return { pdfUploadStatus, generateAndUploadPdf };
    };