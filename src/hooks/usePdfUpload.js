// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { getPdfStyles } from '@/lib/pdfStyles.jsx';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Entfernt exakt alle @import url(...) …;‐Regeln aus einem CSS‐String,
 * damit html2pdf/html2canvas keine externen Fonts laden muss.
 */
const stripCssImports = (cssString) => {
  return cssString.replace(/@import\s+url\([^)]*\)\s*;/g, '');
};

/**
 * Wartet darauf, dass alle <img>-Elemente im Container fertig geladen sind,
 * bevor html2canvas das Rendering anfertigt.
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
 *
 * - Erzeugt mit html2pdf.js einen PDF‐Begleitschein (2 Seiten).
 * - Lädt den Blob in Supabase Storage (Bucket 'lieferschein') hoch.
 * - Speichert anschließend die publicUrl in der Tabelle 'ankauf_requests'.
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

      // 1) Basis-Validierung
      if (!confirmationData || !ankaufsNummer) {
        const msg = 'PDF Upload: Fehlende Bestätigungsdaten oder Ankaufsnummer.';
        console.warn(msg, { ankaufsNummer });
        setPdfUploadStatus((prev) => ({
          ...prev,
          error: 'Fehlende Daten für PDF-Generierung.',
        }));
        return null;
      }

      // 2) Doppelte Uploads verhindern
      if (pdfUploadStatus.uploading) {
        console.log('usePdfUpload: Ein Upload läuft bereits. Breche ab.');
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        console.log('usePdfUpload: Upload bereits erfolgreich, URL:', pdfUploadStatus.url);
        return pdfUploadStatus.url;
      }

      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        console.log('usePdfUpload: Erstelle Off‐Screen‐Container…');
        // 3) Off‐Screen‐Container anlegen (nicht display:none!)
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // A4-Breite in px  (210mm × 96dpi ≈ 794px)
          height: '1123px', // A4-Höhe in px   (297mm × 96dpi ≈ 1123px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) Falls noch kein submissionDate vorhanden: Erzeuge eines
        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        // 5) Baue das Daten‐Objekt für den PDF‐Generator (pdfContentGenerator) zusammen
        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // 6) Erzeuge **nur den Body‐Inhalt** (also ohne <html><head>…)
        console.log('usePdfUpload: Generiere Body‐HTML via generatePurchaseConfirmationHTML…');
        const bodyContent = generatePurchaseConfirmationHTML(dataForPdf, 'bodyContent');
        //    (deliver nur "<div class='pdf-container'>…</div>")

        // 7) Hole das komplette CSS aus pdfStyles, entferne die @import‐Zeilen
        const rawCss = getPdfStyles();
        const cleanedCss = stripCssImports(rawCss);

        // 8) Baue in den Container ein <style>…</style> + den Body‐HTML
        tempContainer.innerHTML = `
          <style>
            ${cleanedCss}
          </style>
          ${bodyContent}
        `;

        // 9) Hänge den Container ins DOM, damit Styles greifen können
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container eingefügt, warte kurz, damit CSS greift…');

        // Kurzes Timeout, damit alle CSS‐Regeln (ohne @import) wirklich angewendet werden
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 10) Warte auf alle Bilder im Container (z.B. QR‐Code, Logos)
        await waitForAllImagesInContainer(tempContainer);
        console.log('usePdfUpload: Alle Bilder geladen, starte html2pdf…');

        // 11) Definiere html2pdf‐Optionen
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

        // 12) Erzeuge den PDF‐Blob (nur Body‐Inhalt plus Inline‐CSS!)
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF‐Blob erstellt, Größe:', pdfBlob.size, 'Bytes');

        // 13) Entferne den temporären Container sofort wieder
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 14) Optionaler Größen‐Check
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF‐Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // 15) Lade das PDF in Supabase Storage (Bucket "lieferschein") hoch
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

        // 16) Hole die Public‐URL des gerade hochgeladenen PDFs
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für das PDF erhalten.');
        }
        console.log('usePdfUpload: Public URL:', publicPdfUrl);

        // 17) Speichere die PDF‐URL in der Supabase‐Tabelle "ankauf_requests"
        console.log('usePdfUpload: Aktualisiere Datenbank…');
        const { error: dbError } = await supabase
          .from('ankauf_requests')
          .update({ pdf_url: publicPdfUrl })
          .eq('ankaufs_nummer', ankaufsNummer);

        if (dbError) {
          console.error('usePdfUpload: Supabase DB‐Update Error:', dbError);
          throw new Error(dbError.message);
        }
        console.log('usePdfUpload: DB‐Update erfolgreich.');

        // 18) Setze den Status auf Erfolg und gib die URL zurück
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
        // Falls der Container wider Erwarten noch im DOM ist → entferne ihn
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
