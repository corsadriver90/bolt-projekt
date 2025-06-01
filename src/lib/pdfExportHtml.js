// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
// ← Hier: importiere die richtige Funktion aus `pdfExportHtml.js`:
import { generatePdfExportHtml } from '@/lib/pdfExportHtml.js';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Wartet darauf, dass alle <img> im Container fertig geladen sind,
 * damit html2canvas den Screenshot wirklich korrekt macht.
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
   * Diese Funktion wird von der ConfirmationPage aufgerufen,
   * sobald die QR-Codedaten da sind und Bestätigungsdaten vorliegen.
   * Sie generiert das vollständige HTML, rendert ein PDF daraus
   * und lädt es in den Supabase-Bucket hoch.
   */
  const generateAndUploadPdf = useCallback(
    async (confirmationData, ankaufsNummer, qrCodeDataURL) => {
      console.log('usePdfUpload: generateAndUploadPdf called with Ankaufsnummer:', ankaufsNummer);

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

      // 2) Verhindern, dass derselbe Upload mehrfach getriggert wird
      if (pdfUploadStatus.uploading) {
        console.log('usePdfUpload: Ein Upload läuft bereits, breche ab.');
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        console.log('usePdfUpload: Upload bereits erfolgt, URL:', pdfUploadStatus.url);
        return pdfUploadStatus.url;
      }

      // Setze Status „uploading“
      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        console.log('usePdfUpload: Erstelle temporären Container…');
        // 3) Container anlegen (off-screen, aber sichtbar für html2canvas)
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // ca. A4-Breite in px (210mm × 96dpi)
          height: '1123px', // ca. A4-Höhe in px (297mm × 96dpi)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) Formatiere das aktuelle Datum
        const now = new Date();
        const dateString = now.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        // 5) Extrahiere die benötigten Felder aus confirmationData
        const {
          name = '',
          email = '',
          address = '',
          totalWeight = 0,
        } = confirmationData;

        // 6) Rufe generatePdfExportHtml auf statt dem alten „generatePurchaseConfirmationHTML“
        console.log('usePdfUpload: Generiere HTML via generatePdfExportHtml…');
        const htmlContent = generatePdfExportHtml({
          ankaufsNummer,
          name,
          email,
          address,
          totalWeight,
          date: dateString,
          qrCodeDataURL: qrCodeDataURL || '',
          onlyBody: false, // wir wollen das komplette Dokument inkl. <head>
        });

        // Optional: Debug-Logs, um sicherzustellen, dass htmlContent wirklich da ist
        console.log('▶▶▶ htmlContent Länge:', htmlContent.length);
        console.log('▶▶▶ htmlContent (erste 300 Zeichen):', htmlContent.substring(0, 300));

        // 7) Schreibe das HTML in den Container und hänge den Container ins DOM
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container ins DOM gehängt, warte kurz, damit Styles greifen…');

        // Kleiner Timeout, damit Styles und Fonts angewendet werden, bevor html2canvas schießt:
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 8) Warte, bis alle Bilder (insbesondere QR-Code) fertig geladen sind
        await waitForAllImagesInContainer(tempContainer);
        console.log('usePdfUpload: Alle Bilder geladen, starte html2pdf…');

        // 9) html2pdf.js Optionen konfigurieren
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

        // 10) Erstelle den PDF-Blob
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF blob generated, Größe:', pdfBlob.size, 'bytes');

        // 11) Entferne den temporären Container wieder
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 12) Prüfe, ob der Blob realistische Größe hat (> 2 KB)
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF-Blob sehr klein oder leer:', pdfBlob?.size);
        }

        // 13) Lade den Blob in Supabase Storage hoch
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

        // 14) Lese die Public-URL aus
        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('usePdfUpload: Konnte keine öffentliche URL für PDF erhalten.');
        }
        console.log('usePdfUpload: Public URL:', publicPdfUrl);

        // 15) Schreibe die URL in deine Tabelle „ankauf_requests“
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

        // 16) Setze den Erfolg-Status
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
        // Stelle sicher, dass der Container wirklich weg ist
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
