// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ← AUSSCHLIESSLICH generatePurchaseConfirmationHTML aus pdfGenerator nutzen:
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';

import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Wartet darauf, dass alle <img>-Elemente im Container geladen sind,
 * bevor html2canvas den Screenshot macht.
 */
const waitForAllImagesInContainer = (containerElement) => {
  return new Promise((resolve) => {
    const images = Array.from(containerElement.querySelectorAll('img'));
    let loadedImagesCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0 && img.naturalHeight !== 0) {
        loadedImagesCount++;
        if (loadedImagesCount === totalImages) resolve();
      } else {
        const markLoaded = () => {
          loadedImagesCount++;
          if (loadedImagesCount === totalImages) resolve();
          img.removeEventListener('load', markLoaded);
          img.removeEventListener('error', markLoaded);
        };
        img.addEventListener('load', markLoaded);
        img.addEventListener('error', markLoaded);
      }
    });
  });
};

/**
 * Hook: usePdfUpload
 * - Generiert mit html2pdf.js einen PDF‐Begleitschein
 * - Lädt den erzeugten Blob in den Supabase‐Bucket „lieferschein“
 * - Speichert anschließend die publicUrl in der Tabelle „ankauf_requests“
 */
export const usePdfUpload = () => {
  const { toast } = useToast();
  const [pdfUploadStatus, setPdfUploadStatus] = useState({
    uploading: false,
    success: false,
    error: null,
    url: null,
  });

  const generateAndUploadPdf = useCallback(
    async (confirmationData, ankaufsNummer, qrCodeDataURL) => {
      console.log(
        'usePdfUpload: generateAndUploadPdf aufgerufen mit Ankaufsnummer:',
        ankaufsNummer
      );

      // 1) Basis‐Validierung
      if (!confirmationData || !ankaufsNummer) {
        const msg = 'PDF Upload: Fehlende Bestätigungsdaten oder Ankaufsnummer.';
        console.warn(msg, { ankaufsNummer });
        setPdfUploadStatus((prev) => ({
          ...prev,
          error: 'Fehlende Daten für PDF-Generierung.',
        }));
        return null;
      }

      // 2) Verhindern, dass derselbe Upload mehrfach läuft
      if (pdfUploadStatus.uploading) {
        console.log('usePdfUpload: Ein Upload läuft bereits, breche ab.');
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        console.log('usePdfUpload: Upload bereits erfolgreich, URL:', pdfUploadStatus.url);
        return pdfUploadStatus.url;
      }

      // Setze Upload‐Status
      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        console.log('usePdfUpload: Erstelle Off-Screen-Container…');
        // 3) Erstelle den Container, der zwar außerhalb des Viewports liegt,
        //    aber NICHT display:none, damit html2canvas rendern kann.
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px', // weit außerhalb des sichtbaren Bereichs
          left: '0px',
          width: '794px',   // A4-Breite in Pixel (210mm × 96dpi ≈ 794px)
          height: '1123px', // A4-Höhe in Pixel (297mm × 96dpi ≈ 1123px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) Erstelle einen deutschen Datums-String (z.B. 01.06.2025, 14:30)
        const now = new Date();
        const dateString = now.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        // 5) Extrahiere die nötigen Felder aus confirmationData
        //    (Diese Felder müssen zu dem passen, was euer pdfGenerator erwartet)
        const {
          submissionDate,
          name = '',
          email = '',
          address = '',
          totalWeight = 0,
          // … ggf. weitere Felder, die euer Template braucht …
        } = confirmationData;

        // 6) Generiere den vollständigen HTML-String (inkl. <html><head>…<body>…</body></html>)
        console.log('usePdfUpload: Generiere HTML via generatePurchaseConfirmationHTML…');
        const htmlContent = generatePurchaseConfirmationHTML(
          {
            // Pflicht-Felder für euren Generator:
            submissionDate,
            ankaufsNummer,
            name,
            email,
            address,
            totalWeight,
            qrCodeDataURL: qrCodeDataURL || '',
            // … falls weitere Felder im Template erwartet werden, hier ergänzen …
          },
          'fullDocument' // ← unbedingt fullDocument, damit <head> + Inline-Styles mitkommen
        );

        // Debug: Output‐Length prüfen
        console.log('▶▶▶ htmlContent Länge:', htmlContent.length);
        console.log('▶▶▶ htmlContent (erste 300 Zeichen):', htmlContent.substring(0, 300));

        // 7) Fülle den Container und hänge ihn ins DOM
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container eingefügt, warte kurz, damit CSS greift…');

        // Kurzer Delay, damit CSS/Fonts angewendet werden, bevor html2canvas ansetzt
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 8) Warte, bis alle <img> (z.B. QR-Code) geladen sind
        await waitForAllImagesInContainer(tempContainer);
        console.log('usePdfUpload: Alle Bilder geladen, starte html2pdf…');

        // 9) Konfiguriere html2pdf‐Optionen
        const options = {
          margin: 0,
          filename: `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#FFFFFF',
            width: 794,
            height: 1123,
            logging: false,
          },
          jsPDF: { unit: 'pt', format: [794, 1123], orientation: 'portrait' },
        };

        // 10) Erzeuge den PDF-Blob
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF-Blob erstellt, Größe:', pdfBlob.size, 'Bytes');

        // 11) Entferne den Container wieder
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 12) Minimaler Größen-Check: Blob muss > 2 KB sein
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF-Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // 13) Lade den PDF-Blob in Supabase Storage hoch (Bucket „lieferschein“)
        console.log('usePdfUpload: Starte Upload zu Supabase…');
        const fileName = `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('lieferschein')
          .upload(fileName, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error('usePdfUpload: Supabase Upload Error:', uploadError);
          throw new Error(uploadError.message);
        }
        console.log('usePdfUpload: Upload erfolgreich.');

        // 14) Hole die Public-URL des hochgeladenen PDFs
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für PDF erhalten.');
        }
        console.log('usePdfUpload: Public URL:', publicPdfUrl);

        // 15) Schreibe die URL in die Supabase-Tabelle „ankauf_requests“
        console.log('usePdfUpload: Aktualisiere Datenbank…');
        const { error: dbError } = await supabase
          .from('ankauf_requests')
          .update({ pdf_url: publicPdfUrl })
          .eq('ankaufs_nummer', ankaufsNummer);

        if (dbError) {
          console.error('usePdfUpload: Supabase DB-Update Error:', dbError);
          throw new Error(dbError.message);
        }
        console.log('usePdfUpload: DB-Update erfolgreich.');

        // 16) Setze Erfolg-Status und gib URL zurück
        setPdfUploadStatus({ uploading: false, success: true, error: null, url: publicPdfUrl });
        return publicPdfUrl;
      } catch (err) {
        console.error('usePdfUpload: Fehler beim Generieren/Hochladen des PDF:', err);
        setPdfUploadStatus({
          uploading: false,
          success: false,
          error: err.message || 'Unbekannter Fehler beim PDF-Upload.',
          url: null,
        });
        toast({
          title: 'Fehler beim Begleitschein-Export',
          description: err.message || 'Die PDF-Datei konnte nicht erstellt werden.',
          variant: 'destructive',
        });
        return null;
      } finally {
        // Stelle sicher, dass der Container wirklich entfernt wird
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
