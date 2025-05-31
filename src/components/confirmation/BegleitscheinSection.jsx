import React, { useState, useCallback, useEffect } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator';
    import { QRCodeCanvas } from 'qrcode.react';
    import { Button } from '@/components/ui/button';
    import { Eye, DownloadCloud } from 'lucide-react';

    const BegleitscheinSection = ({ submissionData, autoOpenPdf = true, qrCodeForPdfId }) => {
      const { toast } = useToast();
      const [qrCodeDataURL, setQrCodeDataURL] = useState('');
      const [isQrCodeReadyForManualDownload, setIsQrCodeReadyForManualDownload] = useState(false);

      const getQrCode = useCallback(() => {
        if (submissionData && submissionData.ankaufsNummer && qrCodeForPdfId) {
          try {
            const canvas = document.getElementById(qrCodeForPdfId);
            if (canvas) {
              const dataUrl = canvas.toDataURL('image/png');
              if (dataUrl && dataUrl.startsWith('data:image/png') && dataUrl.length > 'data:image/png;base64,'.length + 20) {
                setQrCodeDataURL(dataUrl);
                setIsQrCodeReadyForManualDownload(true); 
                return dataUrl; 
              } else {
                console.warn(`QR Code Canvas with ID ${qrCodeForPdfId} generated invalid data URL. Length: ${dataUrl?.length}. Retrying...`);
                return null;
              }
            } else {
              console.warn(`QR Code Canvas with ID ${qrCodeForPdfId} not found. Retrying...`);
              return null;
            }
          } catch (error) {
            console.error("Error generating QR code data URL for Begleitschein:", error);
            setQrCodeDataURL('');
            setIsQrCodeReadyForManualDownload(false);
            return null;
          }
        } else if (submissionData && submissionData.ankaufsNummer && !qrCodeForPdfId) {
          console.warn("qrCodeForPdfId prop is missing, QR code cannot be embedded in PDF.");
          setQrCodeDataURL('');
          setIsQrCodeReadyForManualDownload(false);
          return null;
        }
        return null;
      }, [submissionData, qrCodeForPdfId]);

      useEffect(() => {
        const attemptGetQrCode = () => {
          const dataUrl = getQrCode();
          if (!dataUrl) {
            setTimeout(attemptGetQrCode, 500); 
          }
        };
        attemptGetQrCode();
      }, [getQrCode]);


      const openPdfInNewWindow = useCallback((htmlContent, action = 'print') => {
        if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim() === '') {
            console.error("HTML content for PDF is empty or invalid.");
            toast({
                title: 'Fehler beim Anzeigen des Begleitscheins',
                description: 'Der Inhalt für den Begleitschein konnte nicht generiert werden.',
                variant: 'destructive',
            });
            return;
        }
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          try {
            newWindow.document.open();
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            if (action === 'print' && newWindow.document.readyState === 'complete') {
                newWindow.print();
            } else if (action === 'print') {
                newWindow.onload = () => {
                    if(newWindow.document.readyState === 'complete'){
                        newWindow.print();
                    } else {
                        setTimeout(() => newWindow.print(), 500); 
                    }
                };
            }
          } catch (e) {
            console.error("Error writing to new window or printing:", e);
            toast({
                title: 'Fehler beim Öffnen des Begleitscheins',
                description: 'Ein Fehler ist beim Anzeigen des Dokuments aufgetreten.',
                variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Fehler beim Öffnen des Begleitscheins',
            description: 'Dein Browser hat das Öffnen eines neuen Fensters blockiert. Bitte erlaube Pop-ups für diese Seite.',
            variant: 'destructive',
          });
        }
      }, [toast]);

      const handleOpenOrPrintBegleitschein = useCallback((action = 'print') => {
        if (submissionData) {
          if (!qrCodeDataURL || !isQrCodeReadyForManualDownload) {
             console.warn("QR Code data URL is not yet available for manual open/print. Waiting...");
             toast({ title: "QR Code wird noch geladen", description: "Bitte warte einen Moment, der QR Code für den Begleitschein wird noch generiert.", variant: "default"});
             const currentQr = getQrCode();
             if(!currentQr) return; 
          }
          const htmlContent = generatePurchaseConfirmationHTML({ ...submissionData, qrCodeDataURL: qrCodeDataURL });
          openPdfInNewWindow(htmlContent, action);
        }
      }, [submissionData, qrCodeDataURL, isQrCodeReadyForManualDownload, openPdfInNewWindow, toast, getQrCode]);
      
      useEffect(() => {
        if (submissionData && qrCodeDataURL && isQrCodeReadyForManualDownload && autoOpenPdf && !localStorage.getItem(`begleitschein_opened_${submissionData.ankaufsNummer}`)) {
            const timeoutId = setTimeout(() => {
                 toast({
                    title: "Begleitschein wird vorbereitet...",
                    description: "Dein PDF-Begleitschein wird jetzt zum Speichern oder Drucken geöffnet.",
                    duration: 3000,
                });
                handleOpenOrPrintBegleitschein('print');
                localStorage.setItem(`begleitschein_opened_${submissionData.ankaufsNummer}`, 'true');
            }, 1000); 
            return () => clearTimeout(timeoutId);
        }
      }, [submissionData, qrCodeDataURL, isQrCodeReadyForManualDownload, handleOpenOrPrintBegleitschein, toast, autoOpenPdf]);


      if (!submissionData) return null;

      return (
        <div className="text-center space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700">Dein Ankaufsbeleg (Begleitschein):</h3>
          <p className="text-sm text-gray-600">
            Dein Begleitschein wird automatisch zum Drucken geöffnet. Bitte lege ihn deiner Sendung bei oder zeige ihn bei Abholung/Anlieferung vor.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <Button 
              onClick={() => handleOpenOrPrintBegleitschein('view')} 
              variant="outline" 
              className="w-full sm:w-auto"
              disabled={!isQrCodeReadyForManualDownload}
            >
              <Eye className="mr-2 h-4 w-4" />
              Vorschau Begleitschein
            </Button>
            <Button 
              onClick={() => handleOpenOrPrintBegleitschein('print')} 
              variant="default" 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={!isQrCodeReadyForManualDownload}
            >
              <DownloadCloud className="mr-2 h-4 w-4" />
              Begleitschein erneut herunterladen/drucken
            </Button>
          </div>

          {!qrCodeForPdfId && submissionData.ankaufsNummer && (
             <div style={{ display: 'none' }}>
                 <QRCodeCanvas id={`qrCodeCanvasHiddenBegleitschein_local_${submissionData.ankaufsNummer}`} value={submissionData.ankaufsNummer} size={256} level="H" />
             </div>
           )}
        </div>
      );
    };

    export default BegleitscheinSection;