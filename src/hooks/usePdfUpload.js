// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { getPdfStyles } from '@/lib/pdfStyles.jsx';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';

/**
 * Entfernt alle "@import url(...);" aus einem CSS-String,
 * damit keine externen Fonts geladen werden müssen.
 */
const stripCssImports = (cssString) => {
  return cssString.replace(/@import\s+url\([^)]*\)\s*;/g, '');
};

/**
 * Wartet, bis alle <img>-Elemente im Container fertig geladen sind,
 * bevor jsPDF das Rendering anstößt.
 */
const waitForAllImagesInContainer = (containerElement) => {
  return new Promise((resolve) => {
    const images = Array.from(containerElement.querySelectorAll('img'));
    let loadedCount = 0;
    const total = images.length;

    if (total === 0) {
      resolve();
      return;
    }

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0 && img.naturalHeight !== 0) {
        loadedCount++;
        if (loadedCount === total) resolve();
      } else {
        const markLoaded = () => {
          loadedCount++;
          if (loadedCount === total) resolve();
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
 * - Erzeugt mit jsPDF (html-Methode) einen zweiseitigen Begleitschein (nur BODY-Inhalt + Inline-CSS).
 * - Lädt den PDF-Blob in Supabase Storage (Bucket 'lieferschein').
 * - Speichert anschließend die Public-URL in der Tabelle 'ankauf_requests'.
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
      if (!confirmationData || !ankaufsNummer) {
        setPdfUploadStatus((prev) => ({
          ...prev,
          error: 'Fehlende Daten für PDF-Generierung.',
        }));
        return null;
      }

      if (pdfUploadStatus.uploading) {
        return pdfUploadStatus.url;
      }
      if (pdfUploadStatus.success && pdfUploadStatus.url) {
        return pdfUploadStatus.url;
      }

      setPdfUploadStatus({ uploading: true, success: false, error: null, url: null });
      let tempContainer = null;

      try {
        // 1) Off-Screen-Container anlegen
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',   // A4-Breite in px ≈ 794 (bei 96dpi)
          height: '1123px', // A4-Höhe in px  ≈ 1123 (bei 96dpi)
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        // 2) Bei Bedarf Datei-Datum setzen
        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        // 3) Daten-Objekt für den PDF-Generator zusammenbauen
        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // 4) **Nur BODY-Content** erzeugen (kein <html> oder <head>)
        const bodyContent = generatePurchaseConfirmationHTML(dataForPdf);
        //    bodyContent ist z. B. "<div class='pdf-container'>…Seite1 + Seite2…</div>"

        // 5) Vollständiges CSS holen und "@import"-Zeilen entfernen
        const rawCss = getPdfStyles();
        const cleanedCss = stripCssImports(rawCss);

        // 6) Container mit Inline-CSS + Body-Content füllen
        tempContainer.innerHTML = `
          <style>
            ${cleanedCss}
          </style>
          ${bodyContent}
        `;

        // 7) Container ins DOM hängen, damit CSS greift
        document.body.appendChild(tempContainer);
        // Kurzes Timeout, damit CSS angewendet wird
        await new Promise((resolve) => setTimeout(resolve, 200));

        // 8) Auf alle Bilder (QR-Code, Logos etc.) warten
        await waitForAllImagesInContainer(tempContainer);

        // 9) jsPDF-Instanz erzeugen (A4-Porträt, Standard 72dpi → passt zu 794×1123 px)
        const doc = new jsPDF({
          unit: 'px',
          format: [794, 1123],
          orientation: 'portrait',
        });

        // 10) Body-HTML rendern lassen (zwei Seiten werden automatisch umgebrochen)
        await new Promise((resolve, reject) => {
          doc.html(tempContainer, {
            x: 0,
            y: 0,
            html2canvas: { scale: 1, useCORS: true, backgroundColor: '#FFFFFF' },
            callback: async (doc) => {
              try {
                // 11) PDF-Blob aus jsPDF generieren
                const pdfBlob = doc.output('blob');
                // Container entfernen
                if (tempContainer && document.body.contains(tempContainer)) {
                  document.body.removeChild(tempContainer);
                  tempContainer = null;
                }

                // 12) Minimaler Größen-Check
                if (!pdfBlob || pdfBlob.size < 2000) {
                  console.warn('usePdfUpload: PDF-Blob ist sehr klein oder leer:', pdfBlob?.size);
                }

                // 13) Blob in Supabase Storage (Bucket "lieferschein") hochladen
                const fileName = `begleitschein_${ankaufsNummer.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
                const { error: uploadError } = await supabase.storage
                  .from('lieferschein')
                  .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf',
                    upsert: true,
                  });

                if (uploadError) {
                  throw new Error(uploadError.message);
                }

                // 14) Public-URL abrufen
                const { data: publicUrlData } = supabase.storage
                  .from('lieferschein')
                  .getPublicUrl(fileName);
                const publicPdfUrl = publicUrlData?.publicUrl;
                if (!publicPdfUrl) {
                  throw new Error('Konnte keine öffentliche URL für das PDF erhalten.');
                }

                // 15) URL in Supabase-Tabelle "ankauf_requests" speichern
                const { error: dbError } = await supabase
                  .from('ankauf_requests')
                  .update({ pdf_url: publicPdfUrl })
                  .eq('ankaufs_nummer', ankaufsNummer);

                if (dbError) {
                  throw new Error(dbError.message);
                }

                // 16) Status setzen und Promise auflösen
                setPdfUploadStatus({ uploading: false, success: true, error: null, url: publicPdfUrl });
                resolve(publicPdfUrl);
              } catch (e) {
                reject(e);
              }
            },
          });
        });
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
