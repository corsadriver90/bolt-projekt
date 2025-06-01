// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Entfernt exakt alle @import url(...) …;‐Regeln aus einem CSS‐String,
 * sodass html2pdf/html2canvas nicht versucht, Google‐Fonts & Co. extern nachzuladen.
 */
const stripCssImports = (cssString) => {
  // Dieses Regex findet jede Zeile der Form "@import url(…);"
  // und entfernt sie vollständig, auch wenn in der URL innerliche Semikolons stehen.
  return cssString.replace(/@import\s+url\([^)]*\)\s*;/g, '');
};

/**
 * Wartet darauf, dass alle <img>-Elemente im Container fertig geladen sind,
 * bevor html2canvas das Rendering vornimmt.
 */
const waitForAllImagesInContainer = (containerElement) => {
  return new Promise((resolve) => {
    const images = Array.from(containerElement.querySelectorAll('img'));
    let loadedImagesCount = 0;
    const totalImages = images.length;

    // Gibt sofort zurück, wenn keine Bilder vorhanden sind
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
 * - Erzeugt aus den Bestätigungsdaten mit html2pdf.js ein zweiseitiges PDF
 * - Lädt den erzeugten PDF‐Blob in den Supabase‐Bucket "lieferschein" hoch
 * - Speichert anschließend die öffentliche PDF‐URL in der Tabelle "ankauf_requests"
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

      // 1) Basis-Validierung: Fehlende Daten verhindern
      if (!confirmationData || !ankaufsNummer) {
        const msg = 'PDF Upload: Fehlende Bestätigungsdaten oder Ankaufsnummer.';
        console.warn(msg, { ankaufsNummer });
        setPdfUploadStatus((prev) => ({
          ...prev,
          error: 'Fehlende Daten für PDF-Generierung.',
        }));
        return null;
      }

      // 2) Verhindere doppelten Upload: wenn schon läuft oder bereits erfolgreich
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
        console.log('usePdfUpload: Erstelle Off‐Screen‐Container…');
        // 3) Off‐Screen‐Container anlegen (nicht display:none, sondern position außerhalb des Viewports)
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // A4‐Breite in px (210 mm × 96 dpi ≈ 794 px)
          height: '1123px', // A4‐Höhe in px  (297 mm × 96 dpi ≈ 1123 px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) Setze Einreich‐Datum, falls nicht bereits in confirmationData enthalten
        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        // 5) Bereite alle Daten für die HTML‐Generierung vor,
        //    inklusive QR‐Code und sämtlicher Felder, die pdfContentGenerator erwartet.
        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // 6) Erzeuge das vollständige HTML‐Dokument (inkl. <html>…<style>…)
        console.log('usePdfUpload: Generiere HTML via generatePurchaseConfirmationHTML…');
        let fullHtml = generatePurchaseConfirmationHTML(dataForPdf, 'fullDocument');

        // 7) Entferne hier alle "@import url(…);" aus dem CSS‐Block,
        //    damit html2canvas die Inline‐Styles korrekt rendert (ohne externe Fonts).
        fullHtml = fullHtml.replace(
          /<style>([\s\S]*?)<\/style>/,
          (_, cssContent) => `<style>${stripCssImports(cssContent)}</style>`
        );

        // 8) Debug: Länge und ersten Teil des HTML anzeigen
        console.log('▶▶▶ htmlContent Länge:', fullHtml.length);
        console.log('▶▶▶ htmlContent (erste 300 Zeichen):', fullHtml.substring(0, 300));

        // 9) Befülle den Container mit dem bereinigten HTML und hänge ihn ins DOM
        tempContainer.innerHTML = fullHtml;
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container eingefügt, warte kurz, damit CSS greift…');

        // Kurzer Delay, damit alle CSS‐Regeln (ohne @import) tatsächlich angewendet werden
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 10) Warte, bis alle Bilder (z. B. QR‐Code‐PNG) geladen sind
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

        // 12) Erzeuge den PDF‐Blob (Seite 1 + Seite 2) via html2pdf.js
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF‐Blob erstellt, Größe:', pdfBlob.size, 'Bytes');

        // 13) Entferne den temporären Container sofort wieder
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 14) Kleiner Größen‐Check: Blob sollte größer als ~2 KB sein
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF‐Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // 15) Lade den PDF‐Blob in Supabase Storage (Bucket "lieferschein") hoch
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

        // 16) Hole die Public‐URL des hochgeladenen PDFs
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für das PDF erhalten.');
        }
        console.log('usePdfUpload: Public URL:', publicPdfUrl);

        // 17) Aktualisiere die Supabase‐Tabelle "ankauf_requests" mit der neuen PDF‐URL
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

        // 18) Setze den PDF‐Upload‐Status auf erfolgreich und gib die URL zurück
        setPdfUploadStatus({ uploading: false, success: true, error: null, url: publicPdfUrl });
        return publicPdfUrl;
      } catch (err) {
        console.error('usePdfUpload: Fehler beim Generieren/Hochladen des PDF:', err);
        setPdfUploadStatus({
          uploading: false,
          success: false,
          error: err.message || 'Unbekannter Fehler beim PDF‐Upload.',
          url: null,
        });
        toast({
          title: 'Fehler beim Begleitschein-Export',
          description: err.message || 'Die PDF-Datei konnte nicht erstellt werden.',
          variant: 'destructive',
        });
        return null;
      } finally {
        // Sicherstellen, dass der Container – falls noch im DOM – entfernt wird
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
