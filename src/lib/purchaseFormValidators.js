const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const hasStreetAndHouseNumber = (street) => {
      if (!street) return false;
      const parts = street.trim().match(/^(.+?)\s+([\da-zA-ZÄÖÜäöüß]+[a-zA-Z]?(-[\da-zA-Z]+)?)$/);
      return parts && parts.length === 4 && parts[1].trim().length > 0 && parts[2].trim().length > 0;
    };
        
    const isValidGermanZip = (zip) => {
      return /^\d{5}$/.test(zip);
    };

    export const validateStep1Logic = (formData) => {
      if (!formData.name.trim()) return "Name ist ein Pflichtfeld.";
      if (formData.name.trim().split(' ').length < 2) return "Bitte geben Sie Ihren vollständigen Vor- und Nachnamen ein.";
      if (!formData.email.trim()) return "E-Mail ist ein Pflichtfeld.";
      if (!isValidEmail(formData.email)) return "Bitte gib eine gültige E-Mail-Adresse ein.";
      if (!formData.street.trim()) return "Straße und Hausnummer sind ein Pflichtfeld.";
      if (!hasStreetAndHouseNumber(formData.street)) return "Die Straße muss eine Hausnummer enthalten (z.B. Musterweg 1a).";
      if (!formData.zip.trim()) return "PLZ ist ein Pflichtfeld.";
      if (!isValidGermanZip(formData.zip)) return "Die PLZ muss 5 Ziffern haben.";
      if (!formData.city.trim()) return "Ort ist ein Pflichtfeld.";
      if (formData.city.trim().length < 2) return "Bitte geben Sie einen gültigen Ort ein.";
      return null;
    };

    export const validateStep2Logic = (formData, zipEligibility, totalWeight) => {
      if (!formData.deliveryType) return "Abgabeart ist ein Pflichtfeld.";
      
      const paymentMethodRequired = formData.deliveryType === 'versand' || 
                                (formData.deliveryType === 'abholung' && zipEligibility.isEligible) || 
                                formData.deliveryType === 'selbstanlieferung';

      if (paymentMethodRequired) {
          if (!formData.iban.trim() && !formData.paypal.trim()) {
              return "Für die gewählte Abgabeart ist IBAN oder PayPal E-Mail für die Auszahlung erforderlich.";
          }
          if (formData.paypal.trim() && !isValidEmail(formData.paypal)) {
              return "Bitte gib eine gültige PayPal E-Mail-Adresse ein.";
          }
          if (formData.iban && (formData.iban.replace(/\s/g, '').length < 15 || formData.iban.replace(/\s/g, '').length > 34 || !/^[A-Z0-9]+$/.test(formData.iban.replace(/\s/g, '')))) {
            return "Bitte geben Sie eine gültige IBAN ein.";
          }
      }

      if (formData.deliveryType === 'abholung') {
          if (!zipEligibility.isEligible && formData.zip.length === 5) return "Abholung für diese PLZ nicht verfügbar.";
          if (totalWeight < 15) return `Für eine Abholung sind 15kg erforderlich (aktuell ${totalWeight.toFixed(2)}kg).`;
          if (!formData.pickupDetails.date) return "Abholdatum ist ein Pflichtfeld für Abholung.";
      }
      if (formData.deliveryType === 'selbstanlieferung') {
          if (!formData.deliveryDate) return "Anlieferdatum ist ein Pflichtfeld für Selbstanlieferung.";
          if (!formData.selectedTimeSlot) return "Zeitfenster ist ein Pflichtfeld für Selbstanlieferung.";
      }
      if (!formData.agbAccepted) return "Bitte akzeptiere die AGB.";
      if (!formData.ownItemsConfirmed) return "Bitte bestätige, dass es sich um dein Eigentum handelt.";
      return null;
    };