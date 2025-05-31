import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { motion, AnimatePresence } from 'framer-motion';
    import { AlertCircle } from 'lucide-react';
    import PickupDetailsSection from '@/components/purchaseform/PickupDetailsSection';
    import SelfDeliveryDetailsSection from '@/components/purchaseform/SelfDeliveryDetailsSection';
    import PaymentDetailsSection from '@/components/purchaseform/PaymentDetailsSection';

    const DeliveryPaymentSection = ({ formData, setFormData, handleSelectChange, totalWeight, handleNestedChange, handleChange }) => {
      
      const showPaymentFields = formData.deliveryType === 'versand' || formData.deliveryType === 'abholung' || formData.deliveryType === 'selbstanlieferung';

      return (
      <>
        <h3 className="text-xl font-semibold text-foreground border-b pb-2 pt-4">Abgabeart & Auszahlung</h3>
        <div>
          <Label htmlFor="deliveryType">Abgabeart*</Label>
          <Select name="deliveryType" onValueChange={(value) => handleSelectChange('deliveryType', value)} value={formData.deliveryType} required>
            <SelectTrigger id="deliveryType">
              <SelectValue placeholder="Bitte auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selbstanlieferung">Selbstanlieferung</SelectItem>
              <SelectItem value="versand">Versand (kostenlos ab 10kg)</SelectItem>
              <SelectItem value="abholung">Abholung (nur im 30km Umkreis, ab 15kg)</SelectItem>
            </SelectContent>
          </Select>
          {formData.deliveryType === 'versand' && totalWeight < 10 && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-start p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300 text-sm"
             >
               <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
               <span>Für kostenlosen Versand werden 10kg Gesamtgewicht benötigt. Aktuell: {totalWeight.toFixed(2)}kg. Versandkosten könnten anfallen.</span>
             </motion.div>
          )}
           {formData.deliveryType === 'abholung' && totalWeight < 15 && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-start p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md text-yellow-700 dark:text-yellow-300 text-sm"
             >
               <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
               <span>Für eine Abholung werden mindestens 15kg Gesamtgewicht benötigt. Aktuell: {totalWeight.toFixed(2)}kg.</span>
             </motion.div>
          )}
        </div>

        <AnimatePresence>
          {formData.deliveryType === 'abholung' && (
            <PickupDetailsSection 
              pickupDetails={formData.pickupDetails} 
              handleNestedChange={(field, value) => handleNestedChange('pickupDetails', field, value)} 
            />
          )}
          {formData.deliveryType === 'selbstanlieferung' && (
            <SelfDeliveryDetailsSection 
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showPaymentFields && (
            <PaymentDetailsSection 
              formData={formData} 
              handleSelectChange={handleSelectChange} 
              deliveryType={formData.deliveryType}
            />
          )}
        </AnimatePresence>
         <p className="text-xs text-muted-foreground">* Pflichtfeld</p>
      </>
    );
  }

    export default DeliveryPaymentSection;