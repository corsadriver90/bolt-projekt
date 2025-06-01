// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Wartet darauf, dass alle <img>-Elemente im Container geladen sind,
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
 * - Erzeugt mit html2pdf.js einen PDF-Begleitschein (zwei Seiten).
 * - Lädt den PDF-Blob in Supabase-Storage (Bucket "lieferschein").
 * - Speichert anschließend die publicUrl in der Tabelle "ankauf_requests".
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
        // 3) Off-Screen-Container anlegen (nicht display:none, damit html2canvas rendern kann)
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // A4-Breite in px (210 mm × 96 dpi ≈ 794 px)
          height: '1123px', // A4-Höhe in px  (297 mm × 96 dpi ≈ 1123 px)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 4) (Optional) Datums-String erzeugen – wird aber ohnehin in data.submissionDate übergeben
        //    Falls confirmationData.submissionDate fehlt, setzen wir ihn hier:
        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        // 5) Stelle sicher, dass confirmationData mindestens folgende Felder enthält:
        //    - submissionDate (ISO-String)
        //    - cartItems (Array<{ category, weight, price }>)
        //    - totalWeight (Number)
        //    - totalPrice (Number)
        //    - deliveryType (String)
        //    - (Optional) iban, paypal, pickupDetails, selectedTimeSlot, deliveryDate, selfDeliveryNotes
        //    - name, email, address
        //    - qrCodeDataURL (setzen wir gleich)
        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // 6) Erzeuge den vollständigen HTML-String für 2-seitigen PDF
        console.log('usePdfUpload: Generiere HTML via generatePurchaseConfirmationHTML…');
        const htmlContent = generatePurchaseConfirmationHTML(dataForPdf, 'fullDocument');

        // Debug-Logging: Länge und Anfang des HTML-Strings prüfen
        console.log('▶▶▶ htmlContent Länge:', htmlContent.length);
        console.log('▶▶▶ htmlContent (erste 300 Zeichen):', htmlContent.substring(0, 300));

        // 7) Befülle den Container und hänge ihn ins DOM
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        console.log('usePdfUpload: Container ins DOM, warte kurz, damit CSS greift…');

        // Kleiner Delay, damit alle CSS- und Font-Stile angewendet werden, bevor html2canvas abfotografiert
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 8) Warte, bis alle Bilder (insbesondere QR-Code) geladen sind
        await waitForAllImagesInContainer(tempContainer);
        console.log('usePdfUpload: Alle Bilder geladen, starte html2pdf…');

        // 9) Definiere html2pdf-Optionen
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

        // 10) Erzeuge den PDF-Blob (Seiten 1 + 2)
        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');
        console.log('usePdfUpload: PDF-Blob erstellt, Größe:', pdfBlob.size, 'Bytes');

        // 11) Entferne den Container wieder
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
          console.log('usePdfUpload: Container entfernt.');
        }

        // 12) Größen-Check: Blob sollte mindestens ~ 2 KB groß sein
        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF-Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // 13) Lade den Blob in Supabase Storage hoch (Bucket “lieferschein”)
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

        // 15) Schreibe die URL in die Tabelle “ankauf_requests”
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

        // 16) Setze Erfolg-Status und gib die URL zurück
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
