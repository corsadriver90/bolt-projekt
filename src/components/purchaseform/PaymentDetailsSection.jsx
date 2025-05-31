import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { motion } from 'framer-motion';

    const PaymentDetailsSection = ({ formData, handleChange, deliveryType }) => {
      const showPaymentOptions = deliveryType === 'versand' || deliveryType === 'abholung' || (deliveryType === 'selbstanlieferung' && (formData.paypal || formData.iban));

      if (deliveryType === 'selbstanlieferung' && !formData.paypal && !formData.iban) {
        return (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border rounded-lg shadow-sm bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700"
          >
            <p className="text-base text-blue-700 dark:text-blue-300">
              Bei Selbstanlieferung erfolgt die Auszahlung in der Regel direkt vor Ort in Bar. 
              Wenn Sie eine Auszahlung per Überweisung oder PayPal wünschen, geben Sie bitte unten Ihre Daten an.
            </p>
          </motion.div>
        );
      }

      return (
        <fieldset className="space-y-6 p-4 border rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-foreground px-2">Auszahlungsinformationen*</legend>
          <p className="text-sm text-muted-foreground px-2">
            Bitte gib an, wie du dein Geld erhalten möchtest. Die Auszahlung erfolgt nach Prüfung deiner Artikel.
          </p>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="iban" className="text-base">IBAN (für Überweisung)</Label>
            <Input 
              id="iban" 
              name="iban" 
              value={formData.iban} 
              onChange={(e) => handleChange('iban', e)} 
              placeholder="DE12..." 
              className="mt-1" 
              disabled={!!formData.paypal && formData.paypal.trim() !== ''}
            />
            {formData.paypal && formData.paypal.trim() !== '' && <p className="text-xs text-muted-foreground mt-1">IBAN ist deaktiviert, da PayPal ausgefüllt ist.</p>}
          </motion.div>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">ODER</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Label htmlFor="paypal" className="text-base">PayPal E-Mail-Adresse</Label>
            <Input 
              id="paypal" 
              name="paypal" 
              type="email" 
              value={formData.paypal} 
              onChange={(e) => handleChange('paypal', e)} 
              placeholder="paypal@beispiel.de" 
              className="mt-1" 
              disabled={!!formData.iban && formData.iban.trim() !== ''}
            />
            {formData.iban && formData.iban.trim() !== '' && <p className="text-xs text-muted-foreground mt-1">PayPal ist deaktiviert, da IBAN ausgefüllt ist.</p>}
          </motion.div>
          <p className="text-xs text-muted-foreground">* Bitte mindestens eine Auszahlungsart angeben, es sei denn, Sie wählen Barzahlung bei Selbstanlieferung.</p>
        </fieldset>
      );
    };

    export default PaymentDetailsSection;