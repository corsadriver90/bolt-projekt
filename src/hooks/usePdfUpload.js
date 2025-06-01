// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePdfExportHtml } from '@/lib/pdfExportHtml';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Warte darauf, dass alle <img> im Container fertig geladen sind,
 * bevor der PDF-Export beginnt.
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

export const usePdfUpload = () => {
  const { toast } = useToast();
  const [pdfUploadStatus, setPdfUploadStatus] = useState({
    uploading: false,
    success: false,
    error: null,
    url: null,
  });

  /**
   * Generiert das PDF für den Begleitschein und lädt es
   * dann in den Supabase-Bucket hoch. Gibt die Public-URL zurück.
   *
   * @param {Object} confirmationData – alle Formular-Daten aus der Bestätigung
   * @param {string} ankaufsNummer    – eindeutige Ankaufsnummer
   * @param {string} qrCodeDataURL    – Data-URL des QR-Codes (falls vorhanden)
   */
  const generateAndUploadPdf = useCallback(
    async (confirmationData, ankaufsNummer, qrCodeDataURL) => {
      // 1. Basis-Validierung
      if (!confirmationData || !ankaufsNummer) {
        const msg = 'PDF Upload: Fehlende Bestätigungsdaten oder Ankaufsnummer.';
        console.warn(msg, { ankaufsNummer });
        setPdfUploadStatus((prev) => ({
          ...prev,
          error: 'Fehlende Daten für PDF-Generierung.',
        }));
        return null;
      }

      // 2. Verhindern, dass bestehender Upload mehrfach getriggert wird
      if (pdfUploadStatus.uploading) {
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        return pdfUploadStatus.url;
      }

      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        // 3. Container erstellen und komplett mit Inline-Styles befüllen
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',   // Offscreen, aber renderbar
          left: '0px',
          width: '794px',    // A4-Breite in px (ca. 210 mm × 96 dpi ≈ 794 px)
          height: '1123px',  // A4-Höhe in px  (ca. 297 mm × 96 dpi ≈ 1123 px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4. vollständiges HTML für den Begleitschein erzeugen
        const now = new Date();
        const dateString = now.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        // Hole alle benötigten Felder aus confirmationData (ersetze nach Bedarf!)
        const {
          name = '',
          email = '',
          address = '',
          totalWeight = 0,
        } = confirmationData;

        const htmlContent = generatePdfExportHtml({
          ankaufsNummer,
          name,
          email,
          address,
          totalWeight,
          date: dateString,
          qrCodeDataURL: qrCodeDataURL || '',
          onlyBody: false, // wir wollen komplette TAGS inkl. <html><head>…</body>
        });

        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);

        // 5. Auf Bilder warten (z.B. QR-Code oder sonstige Grafiken)
        await waitForAllImagesInContainer(tempContainer);

        // 6. html2pdf.js-Optionen definieren
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

        // 7. PDF-Blob generieren (await ist entscheidend)
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');

        // 8. Container sofort entfernen (nach Blob-Erzeugung)
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
        }

        // 9. Minimaler Check: Blob-Größe muss größer als ein paar KB sein
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn(
            'usePdfUpload: PDF-Blob ist sehr klein (möglicherweise leer).',
            { size: pdfBlob?.size }
          );
        }

        // 10. PDF-Blob in Supabase-Bucket hochladen
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

        // 11. Public-URL abrufen
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für PDF erhalten.');
        }

        // 12. Datenbank aktualisieren (Spalte pdf_url in ankauf_requests)
        const { error: dbError } = await supabase
          .from('ankauf_requests')
          .update({ pdf_url: publicPdfUrl })
          .eq('ankaufs_nummer', ankaufsNummer);

        if (dbError) {
          console.error('usePdfUpload: Supabase DB-Update Error:', dbError);
          throw new Error(dbError.message);
        }

        // 13. Status auf Erfolg setzen
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
        // Sicherstellen, dass Container wirklich entfernt wird
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
