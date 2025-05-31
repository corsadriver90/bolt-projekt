import React, { useState, useEffect, useCallback } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { fetchExistingLabelUrls, validateLabelPayload, createLabelAndGetUrl } from '@/components/confirmation/returnLabelUtils';
    import ReturnLabelSectionUI from '@/components/confirmation/ReturnLabelSectionUI';
    import { logAdminEvent } from '@/lib/utils';
    import { Loader2 } from 'lucide-react';

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rdkczrfvfnytwgdgjbjn.supabase.co';
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJka2N6cmZ2Zm55dHdnZGdqYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTgyMjAsImV4cCI6MjA2Mjk5NDIyMH0.eImMFCmK9fuaVradXF_bcY18sj-ltNpfw_f-suldnkg';
    
    const ReturnLabelSection = ({ submissionData, onLabelStatusChange, numberOfLabelsToCreate }) => {
      const { toast } = useToast();
      const [isLoadingLabel, setIsLoadingLabel] = useState(false);
      const [generatedUrls, setGeneratedUrls] = useState([]);
      const [labelError, setLabelError] = useState(null);
      const [buttonText, setButtonText] = useState(numberOfLabelsToCreate > 1 ? "Versandlabels anfordern" : "Versandlabel anfordern");
      const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
      const [allLabelsInitiallyGenerated, setAllLabelsInitiallyGenerated] = useState(false);

      const getModifiedOrderNumber = (baseOrderNumber, index) => {
        if (numberOfLabelsToCreate === 1) return baseOrderNumber;
        return `${baseOrderNumber}-L${index + 1}`;
      };
      
      const updateButtonState = useCallback((currentUrls) => {
        const allGenerated = currentUrls.length === numberOfLabelsToCreate && numberOfLabelsToCreate > 0;
        setAllLabelsInitiallyGenerated(allGenerated);

        if(allGenerated) {
          setButtonText(numberOfLabelsToCreate > 1 ? "Alle Labels erneut herunterladen" : "Label erneut herunterladen");
        } else if (currentUrls.length > 0) {
          setButtonText(`Fehlende Labels anfordern (${numberOfLabelsToCreate - currentUrls.length})`);
        } else {
          setButtonText(numberOfLabelsToCreate > 1 ? "Versandlabels anfordern" : "Versandlabel anfordern");
        }
      }, [numberOfLabelsToCreate]);

      useEffect(() => {
        const fetchInitial = async () => {
          if (!submissionData?.ankaufRequestId || numberOfLabelsToCreate === 0) {
            if (onLabelStatusChange) onLabelStatusChange(false, 0, []);
            setIsInitialFetchDone(true);
            setAllLabelsInitiallyGenerated(false);
            return;
          }
          try {
            const urls = await fetchExistingLabelUrls(submissionData.ankaufRequestId, submissionData.ankaufsNummer, numberOfLabelsToCreate);
            const validUrls = urls.filter(url => url !== null);
            setGeneratedUrls(validUrls);
            if (onLabelStatusChange) onLabelStatusChange(validUrls.length > 0, validUrls.length, validUrls);
            updateButtonState(validUrls);
          } catch (err) {
            console.warn("Exception fetching existing label URLs initially:", err);
            if (onLabelStatusChange) onLabelStatusChange(false, 0, []);
             logAdminEvent('warning', 'ReturnLabelSection', 'Error fetching initial labels', { error: err.message, ankaufsNummer: submissionData?.ankaufsNummer });
             setAllLabelsInitiallyGenerated(false);
             updateButtonState([]);
          } finally {
            setIsInitialFetchDone(true);
          }
        };
        fetchInitial();
      }, [submissionData, numberOfLabelsToCreate, onLabelStatusChange, updateButtonState]);


      const handleGenerateLabelsClick = async () => {
        if (!submissionData || !submissionData.ankaufRequestId || numberOfLabelsToCreate === 0) {
          toast({ title: "Fehler", description: "Ankaufsdaten unvollständig oder keine Labels angefordert.", variant: "destructive" });
          return;
        }

        if (allLabelsInitiallyGenerated) { // If all labels are already generated, just open them
          generatedUrls.forEach(url => window.open(url, '_blank'));
          toast({ title: "Labels geöffnet", description: `Die vorhandenen ${generatedUrls.length} Versandlabel wurden in neuen Tabs geöffnet.`, variant: "default" });
          return;
        }

        setIsLoadingLabel(true);
        setLabelError(null);
        
        const { name, street, city, zip, email, phone, ankaufsNummer, companyName } = submissionData;

        const streetParts = street.match(/^(.+?)\s+(\d{1,5}[a-zA-Z]?)$/);
        const customer_street_name = streetParts ? streetParts[1].trim() : street.trim();
        const customer_house_number = streetParts ? streetParts[2].trim() : '';
        
        let successfullyCreatedCountThisSession = 0;
        const tempGeneratedUrls = [...generatedUrls]; 
        let anyErrorOccurred = false;


        for (let i = 0; i < numberOfLabelsToCreate; i++) {
          const modifiedOrderNumber = getModifiedOrderNumber(ankaufsNummer, i);
          
          const labelAlreadyExists = tempGeneratedUrls[i] && tempGeneratedUrls[i] !== null;
          if(labelAlreadyExists) {
            continue; 
          }

          const customerDataForLabel = {
            customer_name: name,
            customer_street_name: customer_street_name,
            customer_house_number: customer_house_number,
            customer_city: city,
            customer_zip: zip,
            customer_email: email,
            customer_phone: phone || "",
            company_name: companyName || "",
            order_number: modifiedOrderNumber,
            ankauf_request_id: submissionData.ankaufRequestId,
          };
          
          const validationError = validateLabelPayload(customerDataForLabel);
          if (validationError) {
            toast({ title: `Ungültige Eingabe für Label ${i + 1}`, description: validationError, variant: 'destructive' });
            setLabelError(validationError);
            logAdminEvent('error', 'ReturnLabelSection', `Validation error for label ${i+1}`, { error: validationError, ankaufsNummer: modifiedOrderNumber });
            anyErrorOccurred = true;
            break; 
          }
          
          const payloadForEdgeFunction = { submissionData: customerDataForLabel };

          try {
            toast({ title: `Erstelle Label für ${modifiedOrderNumber}...`, variant: 'info', duration: 3000 });
            const newLabelUrl = await createLabelAndGetUrl(payloadForEdgeFunction, SUPABASE_URL, SUPABASE_ANON_KEY);
            tempGeneratedUrls[i] = newLabelUrl;
            window.open(newLabelUrl, '_blank');
            successfullyCreatedCountThisSession++;
          } catch (error) {
            console.error(`Error creating label ${i + 1}:`, error);
            const errorMessage = error.message || "Ein unerwarteter Fehler ist aufgetreten.";
            setLabelError(`Fehler bei Label für ${modifiedOrderNumber}: ${errorMessage}`);
            toast({ title: `Fehler bei Label für ${modifiedOrderNumber}`, description: errorMessage, variant: 'destructive', duration: 7000 });
            logAdminEvent('error', 'ReturnLabelSection', `Error creating label ${modifiedOrderNumber}`, { error: errorMessage, ankaufsNummer: modifiedOrderNumber });
            anyErrorOccurred = true;
            break; 
          }
        }
        
        const finalGeneratedUrls = tempGeneratedUrls.filter(url => url !== null);
        setGeneratedUrls([...finalGeneratedUrls]); 
        if (onLabelStatusChange) onLabelStatusChange(finalGeneratedUrls.length > 0, finalGeneratedUrls.length, finalGeneratedUrls);

        if (successfullyCreatedCountThisSession > 0) {
          toast({
            title: `${successfullyCreatedCountThisSession} Label(s) erfolgreich erstellt & geöffnet!`,
            variant: 'success',
            duration: 5000,
          });
        }
        
        updateButtonState(finalGeneratedUrls);
        if (anyErrorOccurred && finalGeneratedUrls.length < numberOfLabelsToCreate) {
             setButtonText(numberOfLabelsToCreate > 1 ? "Fehler - Erneut versuchen" : "Fehler - Erneut versuchen");
        }


        setIsLoadingLabel(false);
      };
      
      if (!isInitialFetchDone) {
         return (
          <div className="p-6 bg-sky-50 rounded-lg border border-sky-200 space-y-3 flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-sky-600" />
            <p className="text-sm text-sky-700">Label-Status wird geladen...</p>
          </div>
        );
      }

      return (
        <ReturnLabelSectionUI
          isLoadingLabel={isLoadingLabel}
          generatedUrls={generatedUrls}
          labelError={labelError}
          buttonText={buttonText}
          onGenerateLabelsClick={handleGenerateLabelsClick}
          numberOfLabelsToCreate={numberOfLabelsToCreate}
          allLabelsGenerated={allLabelsInitiallyGenerated}
        />
      );
    };

    export default ReturnLabelSection;