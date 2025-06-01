import React, { useEffect, useState, useCallback } from 'react';
    import { useLocation, Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { CheckCircle, AlertTriangle, Home, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import BegleitscheinSection from '@/components/confirmation/BegleitscheinSection';
    import ReturnLabelSection from '@/components/confirmation/ReturnLabelSection';
    import ConfirmationDetails from '@/components/confirmation/ConfirmationDetails';
    import { QRCodeCanvas } from 'qrcode.react';
    import { usePdfUpload } from '@/hooks/usePdfUpload.jsx'; // Explicitly use .jsx
    import { logAdminEvent } from '@/lib/utils';

    const ConfirmationPage = () => {
      const location = useLocation();
      
      const [confirmationData, setConfirmationData] = useState(null);
      const [ankaufsNummer, setAnkaufsNummer] = useState(null);
      const [ankaufRequestId, setAnkaufRequestId] = useState(null);
      
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const [hasExistingLabel, setHasExistingLabel] = useState(false);
      // eslint-disable-next-line no-unused-vars
      const [numberOfGeneratedLabels, setNumberOfGeneratedLabels] = useState(0);
      const [qrCodeDataURLForEmailAndPdf, setQrCodeDataURLForEmailAndPdf] = useState('');
      const [isQrReadyForPdf, setIsQrReadyForPdf] = useState(false);
      const [pdfTriggered, setPdfTriggered] = useState(false);

      const { pdfUploadStatus, generateAndUploadPdf } = usePdfUpload();

      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      useEffect(() => {
        let dataToUse = location.state;
        let source = 'state';
        
        if (!dataToUse?.ankaufsNummer || !dataToUse?.formData) {
          const storedData = localStorage.getItem('lastPurchaseConfirmation');
          if (storedData) {
            try {
              dataToUse = JSON.parse(storedData);
              source = 'localStorage';
            } catch (e) {
              console.error("Error parsing stored confirmation data:", e);
              logAdminEvent('error', 'ConfirmationPage', 'Error parsing stored confirmation data', { error: e.message });
              setError("Ungültige Bestätigungsdaten. Bitte starte den Prozess neu.");
              setIsLoading(false);
              return;
            }
          } else {
            logAdminEvent('warning', 'ConfirmationPage', 'No confirmation data found in state or localStorage.');
            setError("Keine Bestätigungsdaten gefunden. Bitte starte den Prozess neu.");
            setIsLoading(false);
            return;
          }
        }
        
        setAnkaufsNummer(dataToUse.ankaufsNummer);
        setConfirmationData(dataToUse.formData);
        setAnkaufRequestId(dataToUse.formData?.ankaufRequestId || dataToUse.ankaufRequestId || null);

        if (source === 'localStorage') { 
          localStorage.setItem('lastPurchaseConfirmation', JSON.stringify(dataToUse));
        }
        setIsLoading(false);

      }, [location.state]);

      useEffect(() => {
        if (ankaufsNummer && !isQrReadyForPdf) {
          let attemptCount = 0;
          const maxAttempts = 15; 
          let qrTimeoutId = null;

          const attemptGetQr = () => {
            attemptCount++;
            if (attemptCount > maxAttempts) {
              console.error("ConfirmationPage: Max attempts reached for QR code generation. PDF upload might fail or be without QR.");
              logAdminEvent('error', 'ConfirmationPage', 'Max attempts for QR generation reached', { ankaufsNummer }, ankaufsNummer);
              setIsQrReadyForPdf(true); 
              return;
            }
            try {
              const canvas = document.getElementById('qrCodeCanvasHiddenConfirmation');
              if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                if(dataUrl && dataUrl.startsWith('data:image/png') && dataUrl.length > 'data:image/png;base64,'.length + 50) { 
                    setQrCodeDataURLForEmailAndPdf(dataUrl);
                    setIsQrReadyForPdf(true); 
                    console.log("ConfirmationPage: QR Code for PDF/Upload successfully generated and set after", attemptCount, "attempts.");
                    if(qrTimeoutId) clearTimeout(qrTimeoutId);
                } else {
                    console.warn(`ConfirmationPage: Generated QR Code Data URL is invalid or empty (Attempt ${attemptCount}/${maxAttempts}). Retrying...`, dataUrl ? dataUrl.substring(0, 50) : "No Data URL");
                    qrTimeoutId = setTimeout(attemptGetQr, 500); 
                }
              } else {
                console.warn(`ConfirmationPage: QR Code Canvas not found yet (Attempt ${attemptCount}/${maxAttempts}). Retrying...`);
                qrTimeoutId = setTimeout(attemptGetQr, 500);  
              }
            } catch (err) {
              console.error(`ConfirmationPage: Error generating QR code data URL (Attempt ${attemptCount}/${maxAttempts}):`, err);
              logAdminEvent('error', 'ConfirmationPage', `Error generating QR code for PDF/Email (Attempt ${attemptCount})`, { error: err.message, ankaufsNummer }, ankaufsNummer);
              qrTimeoutId = setTimeout(attemptGetQr, 500); 
            }
          };
          attemptGetQr();
          return () => { if(qrTimeoutId) clearTimeout(qrTimeoutId); };
        }
      }, [ankaufsNummer, isQrReadyForPdf]);
      
      useEffect(() => {
        if (confirmationData && ankaufsNummer && isQrReadyForPdf && !pdfTriggered && !pdfUploadStatus.uploading && !pdfUploadStatus.success) {
          console.log("ConfirmationPage: Triggering PDF generation and upload. QR is ready:", isQrReadyForPdf, "Ankaufsnummer:", ankaufsNummer, "QR Data URL length:", qrCodeDataURLForEmailAndPdf.length);
          setPdfTriggered(true); 
          generateAndUploadPdf(confirmationData, ankaufsNummer, qrCodeDataURLForEmailAndPdf);
        }
      }, [confirmationData, ankaufsNummer, isQrReadyForPdf, qrCodeDataURLForEmailAndPdf, generateAndUploadPdf, pdfUploadStatus.uploading, pdfUploadStatus.success, pdfTriggered]);


      const handleLabelStatusChange = useCallback((labelExists, count, _urls) => {
        setHasExistingLabel(labelExists);
        setNumberOfGeneratedLabels(count);
      }, []);


      if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <p className="text-xl font-semibold text-slate-700">Lade Bestätigungsdaten...</p>
                <p className="text-slate-500">Einen kleinen Moment Geduld bitte.</p>
            </div>
        );
      }

      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold text-destructive mb-4">Fehler</h1>
            <p className="text-muted-foreground text-lg mb-8">{error}</p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-3 px-6">
              <Link to="/rechner">Zurück zum Rechner</Link>
            </Button>
          </div>
        );
      }
      
      if (!ankaufsNummer || !confirmationData) {
        return (
           <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold text-destructive mb-4">Keine Daten</h1>
            <p className="text-muted-foreground text-lg mb-8">Es konnten keine Bestätigungsdaten geladen werden. Bitte versuche den Ankauf erneut.</p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-3 px-6">
              <Link to="/rechner">Neuen Ankauf starten</Link>
            </Button>
          </div>
        );
      }


      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="max-w-3xl mx-auto shadow-2xl overflow-hidden border-2 border-emerald-500">
              <CardHeader className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-8">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 180, damping: 12 }}>
                  <CheckCircle className="h-24 w-24 mx-auto mb-4" />
                </motion.div>
                <CardTitle className="text-4xl md:text-5xl font-bold text-center tracking-tight">Ankauf Erfolgreich!</CardTitle>
                <CardDescription className="text-emerald-100 text-lg md:text-xl text-center mt-3">
                  Deine Ankaufsnummer: <strong className="font-semibold tracking-wider">{ankaufsNummer}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-8">
                
                <ConfirmationDetails 
                  submissionData={confirmationData} 
                  hasExistingLabel={hasExistingLabel}
                />

                <BegleitscheinSection 
                  submissionData={{...confirmationData, ankaufsNummer: ankaufsNummer}}
                  autoOpenPdf={true} 
                  qrCodeForPdfId="qrCodeCanvasHiddenConfirmation" 
                />

                {confirmationData.deliveryType === 'versand' && confirmationData.totalWeight >= 1 && (
                  <ReturnLabelSection 
                    submissionData={{...confirmationData, ankaufsNummer: ankaufsNummer, ankaufRequestId: ankaufRequestId}}
                    onLabelStatusChange={handleLabelStatusChange}
                    numberOfLabelsToCreate={confirmationData.numberOfLabels || 1}
                  />
                )}

                <div className="text-center pt-4 space-y-2">
                  {pdfUploadStatus.uploading && (
                    <p className="text-blue-600 dark:text-blue-400 text-sm flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Begleitschein PDF wird im Hintergrund verarbeitet...
                    </p>
                  )}
                   {pdfUploadStatus.success && pdfUploadStatus.url && (
                     <p className="text-green-600 dark:text-green-400 text-sm">
                       Begleitschein PDF erfolgreich erstellt und gespeichert.
                     </p>
                   )}
                   {pdfUploadStatus.error && (
                     <p className="text-red-600 dark:text-red-400 text-sm">
                       Fehler beim Erstellen des Begleitschein PDFs: {pdfUploadStatus.error}
                     </p>
                   )}
                </div>


                <div className="text-center pt-6 mt-6 border-t-2 border-dashed border-gray-200 space-y-4">

                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to="/">
                      <Home className="mr-2 h-5 w-5" /> Zurück zur Startseite
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {ankaufsNummer && (
            <div style={{ display: 'none' }}>
              <QRCodeCanvas id="qrCodeCanvasHiddenConfirmation" value={ankaufsNummer} size={256} level="H" imageSettings={{excavate:false}}/>
            </div>
          )}
        </div>
      );
    };

    export default ConfirmationPage;