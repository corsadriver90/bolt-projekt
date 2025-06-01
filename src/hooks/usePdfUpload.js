// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Hilfsfunktion: Entfernt alle @import-Regeln aus einem CSS-String.
 * Beispiel: "@import url('https://fonts.googleapis.com/...');"
 */
const stripCssImports = (cssString) => {
  return cssString.replace(/@import[^;]+;/g, '');
};

/**
 * Wartet darauf, dass alle <img>-Elemente im Container fertig geladen sind,
 * bevor html2canvas den Screenshot anfertigt.
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
 * - Erzeugt mit html2pdf.js einen PDF‐Begleitschein (zwei Seiten).
 * - Lädt den PDF-Blob in Supabase Storage (Bucket 'lieferschein').
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

      // 2) Doppel-Upload verhindern
      if (pdfUploadStatus.uploading) {
        console.log('usePdfUpload: Ein Upload läuft bereits, breche ab.');
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        console.log('usePdfUpload: Upload bereits erfolgreich, URL:', pdfUploadStatus.url);
        return pdfUploadStatus.url;
      }

      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        console.log('usePdfUpload: Erstelle Off-Screen-Container…');
        // 3) Container außerhalb des Viewports anlegen (nicht display:none!)
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // A4-Breite in px (210mm × 96dpi ≈ 794px)
          height: '1123px', // A4-Höhe in px (297mm × 96dpi ≈ 1123px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) Stelle sicher, dass submissionDate gesetzt ist
        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        // 5) Baue das vollständige dataForPdf-Objekt
        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // 6) Generiere das rohe HTML-Dokument (inkl. <html><head>…)
        console.log('usePdfUpload: Generiere HTML via generatePurchaseConfirmationHTML…');
        let fullHtml = generatePurchaseConfirmationHTML(dataForPdf, 'fullDocument');

        // 7) Entferne ggf. alle @import-Regeln direkt aus dem <style>-Block,
        //    damit html2canvas *nicht* versucht, externe Fonts nachzuladen.
        fullHtml = fullHtml.replace(
          /<style>([\s\S]*?)<\/style>/,
          (_, cssContent) =>
            `<style>${stripCssImports(cssContent)}</style>`
        );

        // Debug: Prüfe Länge und ersten Teil des HTML-Strings
        console.log('▶▶▶ htmlContent Länge:', fullHtml.length);
        console.log('▶▶▶ htmlContent (erste 300 Zeichen):', fullHtml.substring(0, 300));

        // 8) Fülle den Container mit dem bereinigten HTML und hänge ihn ins DOM
        tempContainer.innerHTML = fullHtml;
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container eingefügt, warte kurz, damit CSS greift…');

        // Kurzes Timeout, damit alle CSS-Regeln (ohne @import) angewendet werden
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 9) Warte, bis alle Bilder (z. B. QR-Code) vollständig geladen sind
        await waitForAllImagesInContainer(tempContainer);
        console.log('usePdfUpload: Alle Bilder geladen, starte html2pdf…');

        // 10) Definiere html2pdf-Optionen
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

        // 11) Erzeuge den PDF-Blob (Seite 1 & Seite 2)
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF-Blob erstellt, Größe:', pdfBlob.size, 'Bytes');

        // 12) Entferne den temporären Container sofort
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 13) Optionaler Größen-Check
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF-Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // 14) Upload in Supabase Storage (Bucket "lieferschein")
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

        // 15) Hole die Public-URL des hochgeladenen PDFs
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für PDF erhalten.');
        }
        console.log('usePdfUpload: Public URL:', publicPdfUrl);

        // 16) Speichere die URL in der Supabase-Tabelle "ankauf_requests"
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

        // 17) Setze Erfolg-Status und gib URL zurück
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
        // Sicherstellen, dass der Container, falls noch im DOM, entfernt wird
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
