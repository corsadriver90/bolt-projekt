import { useState, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { generatePurchaseConfirmationHTML } from '@/lib/pdfGenerator';
    import { useToast } from '@/components/ui/use-toast';

    export const useConfirmationEmail = () => {
      const { toast } = useToast();
      const [emailStatus, setEmailStatus] = useState({
        sending: false,
        sent: false,
        error: null,
      });

      const sendFinalConfirmationEmail = useCallback(async (confirmationData, ankaufsNummer, qrCodeDataURL, labelUrls = [], pdfUrl = null) => {
        if (!confirmationData || !ankaufsNummer || !qrCodeDataURL) {
          console.warn("Email Send: Missing required data", { confirmationData, ankaufsNummer, qrCodeDataURL });
          setEmailStatus(prev => ({ ...prev, error: "Fehlende Daten für E-Mail-Versand."}));
          return;
        }

        if (emailStatus.sending) {
          console.log("E-Mail-Versand läuft bereits.");
          return;
        }
        
        setEmailStatus({ sending: true, sent: false, error: null });

        const purchaseConfirmationHtml = generatePurchaseConfirmationHTML({ ...confirmationData, qrCodeDataURL });
        
        const emailPayload = {
          customer_email: confirmationData.email,
          customer_name: confirmationData.name,
          order_id: ankaufsNummer,
          total_price: parseFloat(confirmationData.totalPrice),
          submission_date_raw: confirmationData.submissionDate,
          items_raw: confirmationData.cartItems.map(item => ({ ...item, price: parseFloat(item.price), weight: parseFloat(item.weight) })),
          total_weight_raw: parseFloat(confirmationData.totalWeight),
          delivery_type_raw: confirmationData.deliveryType,
          purchase_confirmation_html_content_raw: purchaseConfirmationHtml,
          label_urls_raw: labelUrls, 
          pdf_attachment_url_raw: pdfUrl,
        };

        try {
          const { data: functionResponse, error: emailError } = await supabase.functions.invoke('send_email_with_attachments', {
            body: JSON.stringify(emailPayload),
          });

          if (emailError) {
            console.error("Supabase function error (send_email_with_attachments):", emailError);
            throw new Error(`Fehler beim E-Mail-Versand: ${emailError.message}`);
          }
          if (functionResponse && functionResponse.success === false) {
            console.error("Email function reported failure:", functionResponse);
            throw new Error(functionResponse.error || "Die Edge Function hat einen Fehler beim E-Mail-Versand gemeldet.");
          }

          toast({
            title: 'Bestätigungs-E-Mail versandt!',
            description: `Eine E-Mail mit dem Begleitschein ${labelUrls.length > 0 ? `und ${labelUrls.length} Versandlabel(s)`: ''} wurde an ${confirmationData.email} gesendet.`,
            variant: 'success',
            duration: 9000,
          });
          setEmailStatus({ sending: false, sent: true, error: null });
          localStorage.setItem(`final_email_sent_${ankaufsNummer}`, 'true');

        } catch (error) {
          console.error('Error sending final confirmation email:', error);
          const errorMessage = error.message || 'Die Bestätigungs-E-Mail konnte nicht gesendet werden.';
          setEmailStatus({ sending: false, sent: false, error: errorMessage });
          toast({
            title: 'Fehler beim E-Mail-Versand',
            description: `${errorMessage} Bitte versuche es später erneut oder kontaktiere uns.`,
            variant: 'warning',
            duration: 10000,
          });
        }
      }, [toast, emailStatus.sending]);

      return { emailStatus, sendFinalConfirmationEmail };
    };