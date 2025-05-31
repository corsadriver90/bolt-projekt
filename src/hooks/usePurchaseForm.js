import { useState, useCallback } from 'react';

    const ELIGIBLE_PICKUP_ZIPS_PREFIXES = ['16', '130', '131', '134'];

    export const usePurchaseForm = (initialFormData = {}) => {
      const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        street: '',
        zip: '',
        city: '',
        deliveryType: '',
        iban: '',
        paypal: '',
        agbAccepted: false,
        ownItemsConfirmed: false,
        pickupDetails: { date: null, time: '', notes: '' },
        deliveryDetails: { notes: '' },
        selectedTimeSlot: '',
        deliveryDate: null,
        numberOfLabels: 1,
        ...initialFormData,
      });

      const [zipEligibility, setZipEligibility] = useState({ isEligible: false, message: '', type: '' });

      const checkZipEligibility = useCallback((zip) => {
        if (zip.length === 5) {
          const isEligible = ELIGIBLE_PICKUP_ZIPS_PREFIXES.some(prefix => zip.startsWith(prefix));
          if (isEligible) {
            setZipEligibility({ isEligible: true, message: 'Abholung für diese PLZ verfügbar.', type: 'success' });
          } else {
            setZipEligibility({ isEligible: false, message: 'Abholung für diese PLZ leider nicht verfügbar.', type: 'error' });
          }
        } else {
          setZipEligibility({ isEligible: false, message: '', type: '' });
        }
      }, []);

      const handleChange = useCallback((field, eventOrValue) => {
        let value;
        if (eventOrValue && typeof eventOrValue === 'object' && eventOrValue.target) {
          const target = eventOrValue.target;
          value = target.type === 'checkbox' ? target.checked : target.value;
        } else {
          value = eventOrValue;
        }
        
        setFormData((prev) => ({ ...prev, [field]: value }));
        
        if (field === 'zip') {
          checkZipEligibility(value);
        }
      }, [checkZipEligibility]);

      const handleSelectChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }, []);
      
      const handleNestedChange = useCallback((section, field, value) => {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
      }, []);

      return {
        formData,
        setFormData,
        zipEligibility,
        handleChange,
        handleSelectChange,
        handleNestedChange,
        checkZipEligibility,
      };
    };