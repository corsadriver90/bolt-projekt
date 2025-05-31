import React from 'react';
    import DeliveryOptionsSection from '@/components/purchaseform/DeliveryOptionsSection';
    import PaymentDetailsSection from '@/components/purchaseform/PaymentDetailsSection';
    import PickupDetailsSection from '@/components/purchaseform/PickupDetailsSection';
    import SelfDeliveryDetailsSection from '@/components/purchaseform/SelfDeliveryDetailsSection';
    import ConfirmationSection from '@/components/purchaseform/ConfirmationSection';
    import NumberOfLabelsSection from '@/components/purchaseform/NumberOfLabelsSection';
    import { motion } from 'framer-motion';

    const DeliveryPaymentConfirmationSection = ({ formData, setFormData, handleChange, handleSelectChange, handleNestedChange, totalWeight, zipEligibility }) => {
      return (
        <div className="space-y-8">
          <DeliveryOptionsSection
            formData={formData}
            handleSelectChange={handleSelectChange}
            totalWeight={totalWeight}
            zipEligibility={zipEligibility}
          />

          {formData.deliveryType === 'versand' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <NumberOfLabelsSection formData={formData} handleSelectChange={handleSelectChange} />
            </motion.div>
          )}

          {formData.deliveryType === 'abholung' && zipEligibility.isEligible && totalWeight >= 15 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <PickupDetailsSection 
                pickupDetails={formData.pickupDetails} 
                handleNestedChange={handleNestedChange} 
                setFormData={setFormData}
              />
            </motion.div>
          )}

          {formData.deliveryType === 'selbstanlieferung' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <SelfDeliveryDetailsSection 
                deliveryDetails={formData.deliveryDetails}
                handleNestedChange={handleNestedChange}
                formData={formData}
                setFormData={setFormData}
              />
            </motion.div>
          )}
          
          <PaymentDetailsSection
            formData={formData}
            handleChange={handleChange}
            deliveryType={formData.deliveryType}
            zipEligibility={zipEligibility}
          />
          
          <ConfirmationSection
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      );
    };

    export default DeliveryPaymentConfirmationSection;