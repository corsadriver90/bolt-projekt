// src/hooks/usePdfUpload.js

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator.jsx';
import { getPdfStyles } from '@/lib/pdfStyles.jsx';
import { useToast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js';

/**
 * Entfernt alle "@import url(...);" aus einem CSS-String:
 * so lädt html2pdf/html2canvas keine externen Fonts nach.
 */
const stripCssImports = (cssString) => {
  return cssString.replace(/@import\s+url\([^)]*\)\s*;/g, '');
};

/**
 * Wartet, bis alle <img>-Elemente im Container fertig geladen sind,
 * bevor html2canvas das Rendering anfertigt.
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
 * - Erzeugt mit html2pdf.js einen zweiseitigen Begleitschein (nur BODY-Inhalt + Inline-CSS).
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
        // Off-Screen-Container anlegen
        tempContainer = document.createElement('div');
        tempContainer.id = 'pdf_temp_container';
        Object.assign(tempContainer.style, {
          position: 'absolute',
          top: '-10000px',
          left: '0px',
          width: '794px',
          height: '1123px',
          backgroundColor: '#FFFFFF',
          overflow: 'visible',
        });

        if (!confirmationData.submissionDate) {
          confirmationData.submissionDate = new Date().toISOString();
        }

        const dataForPdf = {
          ...confirmationData,
          ankaufsNummer,
          qrCodeDataURL: qrCodeDataURL || '',
        };

        // Nur den BODY-Inhalt generieren (kein <html> oder <head>)
        const bodyContent = generatePurchaseConfirmationHTML(dataForPdf, 'bodyContent');

        // Komplettes CSS holen und @import-Zeilen entfernen
        const rawCss = getPdfStyles();
        const cleanedCss = stripCssImports(rawCss);

        // Container mit Inline-CSS + Body-HTML füllen
        tempContainer.innerHTML = `
          <style>
            ${cleanedCss}
          </style>
          ${bodyContent}
        `;

        document.body.appendChild(tempContainer);
        // Kurzes Timeout, damit Inline-CSS angewendet wird
        await new Promise((resolve) => setTimeout(resolve, 200));

        await waitForAllImagesInContainer(tempContainer);

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

        const pdfBlob = await html2pdf().from(tempContainer).set(options).outputPdf('blob');

        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
          tempContainer = null;
        }

        if (!pdfBlob || pdfBlob.size < 2000) {
          console.warn('usePdfUpload: PDF-Blob ist sehr klein oder leer:', pdfBlob?.size);
        }

        // Upload zu Supabase Storage (Bucket "lieferschein")
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

        const { data: publicUrlData } = supabase.storage.from('lieferschein').getPublicUrl(fileName);
        const publicPdfUrl = publicUrlData?.publicUrl;
        if (!publicPdfUrl) {
          throw new Error('Konnte keine öffentliche URL für das PDF erhalten.');
        }

        const { error: dbError } = await supabase
          .from('ankauf_requests')
          .update({ pdf_url: publicPdfUrl })
          .eq('ankaufs_nummer', ankaufsNummer);

        if (dbError) {
          throw new Error(dbError.message);
        }

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
        if (tempContainer && document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    },
    [toast, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfUploadStatus.url]
  );

  return { pdfUploadStatus, generateAndUploadPdf };
};
