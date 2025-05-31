import React from 'react';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { motion } from 'framer-motion';
    import { AlertCircle } from 'lucide-react';

    const DeliveryOptionsSection = ({ formData, handleSelectChange, totalWeight, zipEligibility }) => {
      const safeZipEligibility = zipEligibility || { isEligible: false, message: "PLZ Prüfung ausstehend." };
      const isAbholungDisabled = totalWeight < 15 || (formData.zip.length === 5 && !safeZipEligibility.isEligible);
      
      return (
        <fieldset className="space-y-6 p-4 border rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-foreground px-2">Abgabeart wählen*</legend>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="deliveryType" className="text-base">Wie möchtest du uns deine Artikel zukommen lassen?</Label>
            <Select name="deliveryType" value={formData.deliveryType} onValueChange={(value) => handleSelectChange('deliveryType', value)}>
              <SelectTrigger id="deliveryType" className="mt-1 w-full text-base">
                <SelectValue placeholder="Bitte wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="versand" className="text-base">Versand per Post/DHL (deutschlandweit)</SelectItem>
                <SelectItem value="selbstanlieferung" className="text-base">Selbstanlieferung (Triftstr. 21B, 16348 Wandlitz)</SelectItem>
                <SelectItem value="abholung" disabled={isAbholungDisabled} className="text-base">
                  Persönliche Abholung durch uns (ab 15kg, nur PLZ 16xxx & 130xx, 131xx, 134xx)
                </SelectItem>
              </SelectContent>
            </Select>
            {formData.deliveryType === 'abholung' && totalWeight < 15 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-sm flex items-start"
              >
                <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <div>
                  Für eine kostenlose Abholung ist ein Mindestgewicht von 15kg erforderlich. Dein aktuelles Gesamtgewicht beträgt {totalWeight.toFixed(2)}kg.
                  Bitte füge weitere Artikel hinzu oder wähle eine andere Abgabeart.
                </div>
              </motion.div>
            )}
             {formData.deliveryType === 'abholung' && formData.zip.length === 5 && !safeZipEligibility.isEligible && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm flex items-start"
              >
                <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                <div>
                  {safeZipEligibility.message}
                </div>
              </motion.div>
            )}
          </motion.div>
          <p className="text-xs text-muted-foreground">* Pflichtfeld</p>
        </fieldset>
      );
    };

    export default DeliveryOptionsSection;