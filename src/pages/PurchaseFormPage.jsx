import React, { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { useCart } from '@/hooks/useCart';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from 'lucide-react';
    
    import UserDataSection from '@/components/purchaseform/UserDataSection';
    import DeliveryPaymentConfirmationSection from '@/components/purchaseform/DeliveryPaymentConfirmationSection';
    import FormSteps from '@/components/purchaseform/FormSteps';
    import PurchaseFormSummary from '@/components/purchaseform/PurchaseFormSummary';
    
    import { usePurchaseForm } from '@/hooks/usePurchaseForm';
    import { validateStep1Logic, validateStep2Logic } from '@/lib/purchaseFormValidators';
    import { handleSubmitPurchaseToSupabase } from '@/lib/purchaseFormHandler';

    const TOTAL_STEPS = 3;

    const PurchaseFormPage = () => {
      const { cartItems, totalWeight, totalPrice, clearCart } = useCart();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [currentStep, setCurrentStep] = useState(1);
      const [isLoading, setIsLoading] = useState(false);

      const {
        formData,
        setFormData,
        zipEligibility,
        handleChange,
        handleSelectChange,
        handleNestedChange,
        checkZipEligibility,
      } = usePurchaseForm();

      useEffect(() => {
        window.scrollTo(0, 0);
      }, [currentStep]);

      useEffect(() => {
        if (cartItems.length === 0 && !isLoading) {
          toast({
            title: 'Warenkorb ist leer',
            description: 'Bitte füge zuerst Artikel zum Warenkorb hinzu.',
            variant: 'destructive',
          });
          navigate('/rechner');
        }
      }, [cartItems, navigate, toast, isLoading]);

      useEffect(() => {
        if (formData.zip) {
          checkZipEligibility(formData.zip);
        }
      }, [formData.zip, checkZipEligibility]);

      const validateStep1 = useCallback(() => {
        return validateStep1Logic(formData);
      }, [formData]);

      const validateStep2 = useCallback(() => {
        return validateStep2Logic(formData, zipEligibility, totalWeight);
      }, [formData, zipEligibility, totalWeight]);

      const nextStep = () => {
        let error = null;
        if (currentStep === 1) error = validateStep1();
        if (currentStep === 2) error = validateStep2();

        if (error) {
          toast({ title: 'Validierungsfehler', description: error, variant: 'destructive' });
          return;
        }
        if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
      };

      const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
      };

      const onFinalSubmit = async () => {
        const errorStep2 = validateStep2();
        if (errorStep2) {
          toast({ title: 'Validierungsfehler', description: errorStep2, variant: 'destructive' });
          return;
        }
        
        setIsLoading(true);
        try {
          const submissionData = {
            ...formData,
            cartItems,
            totalWeight,
            totalPrice,
          };
          
          const { success, error, ankaufsNummer, ankaufRequestId } = await handleSubmitPurchaseToSupabase(submissionData, cartItems, totalWeight, totalPrice);

          if (!success) {
            throw new Error(error || 'Ein unbekannter Fehler ist aufgetreten.');
          }
          
          const toastMessage = `Deine Ankaufsnummer lautet: ${ankaufsNummer}. Du wirst nun zur Bestätigungsseite weitergeleitet, wo du deinen Begleitschein und ggf. Versandlabels herunterladen kannst.`;
          
          toast({
            title: 'Ankaufanfrage erfolgreich übermittelt!',
            description: toastMessage,
            variant: 'success',
            duration: 9000,
          });
          
          const confirmationState = { 
            ankaufsNummer, 
            formData: { 
              ...submissionData, 
              ankaufsNummer, 
              ankaufRequestId, 
              submissionDate: new Date().toISOString() 
            }
          };
          
          navigate('/bestaetigung', { state: confirmationState });
          clearCart();

        } catch (error) {
          console.error('Fehler beim Absenden des Formulars:', error);
          toast({
            title: 'Fehler beim Absenden',
            description: error.message || 'Deine Anfrage konnte nicht verarbeitet werden. Bitte versuche es später erneut oder kontaktiere uns.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      const pageTransition = {
        initial: { opacity: 0, x: currentStep === 1 ? -50 : 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: currentStep === 1 ? 50 : -50 },
        transition: { type: "tween", ease: "easeInOut", duration: 0.4 }
      };

      if (cartItems.length === 0 && !isLoading) {
         return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-4">Warenkorb ist leer</h1>
            <p className="text-muted-foreground mb-6">Du musst zuerst Artikel in deinen Warenkorb legen, bevor du den Ankaufsprozess starten kannst.</p>
            <Button onClick={() => navigate('/rechner')}>Zum Ankaufsrechner</Button>
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-primary mb-4 text-center">Ankaufsformular</h1>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              Nur noch wenige Schritte, um deine Schätze an uns zu verkaufen. Fülle einfach die folgenden Felder aus.
            </p>
            
            <FormSteps currentStep={currentStep} totalSteps={TOTAL_STEPS} />

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-xl shadow-xl border">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={pageTransition.initial}
                    animate={pageTransition.animate}
                    exit={pageTransition.exit}
                    variants={pageTransition}
                  >
                    {currentStep === 1 && (
                      <UserDataSection
                        formData={formData}
                        handleChange={handleChange}
                      />
                    )}
                    {currentStep === 2 && (
                      <DeliveryPaymentConfirmationSection
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        handleNestedChange={handleNestedChange}
                        totalWeight={totalWeight}
                        zipEligibility={zipEligibility}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex justify-between items-center">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isLoading} className="text-lg py-6 px-8">
                    <ChevronLeft className="mr-2 h-5 w-5" /> Zurück
                  </Button>
                  {currentStep < TOTAL_STEPS -1 ? (
                    <Button onClick={nextStep} disabled={isLoading} className="text-lg py-6 px-8 bg-primary hover:bg-primary/90">
                      Weiter <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button onClick={onFinalSubmit} disabled={isLoading || !formData.agbAccepted || !formData.ownItemsConfirmed} className="text-lg py-6 px-8 bg-green-500 hover:bg-green-600 text-white">
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                      Ankauf verbindlich absenden & zur Bestätigung
                    </Button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 sticky top-24">
                <PurchaseFormSummary
                  cartItems={cartItems}
                  totalWeight={totalWeight}
                  totalPrice={totalPrice}
                  formData={formData}
                  currentStep={currentStep}
                />
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    export default PurchaseFormPage;