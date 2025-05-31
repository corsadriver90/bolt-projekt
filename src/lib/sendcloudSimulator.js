export const simulateSendcloudLabelCreation = async (submissionData) => {
      const apiKey = 'da20b950-80a3-455f-95d4-67d43135a079'; 
      const apiSecret = '7a148a68619a47b0814988e2b9d0ca91'; 

      console.log("Simulating Sendcloud API call with:", submissionData);
      console.log("Test API Key (Public):", apiKey);
      console.log("Test API Secret (Secret):", apiSecret);


      const parcelData = {
        name: submissionData.name,
        company_name: submissionData.companyName || '',
        address: submissionData.street,
        city: submissionData.city,
        postal_code: submissionData.zip,
        country: 'DE', 
        email: submissionData.email,
        telephone: submissionData.phone || '',
        request_label: true,
        shipment: {
          id: 8, 
        },
        weight: submissionData.totalWeight.toFixed(2),
        
        order_number: `BR-${new Date(submissionData.submissionDate).getTime().toString().slice(-6)}`,
        total_order_value: submissionData.totalPrice.toFixed(2),
        quantity: submissionData.cartItems.length,
        
      };

      
      return new Promise((resolve) => {
        setTimeout(() => {
          
          const success = Math.random() > 0.1; 

          if (success) {
            console.log("Sendcloud API (Simulation) - Success:", parcelData);
            resolve({ 
              success: true, 
              labelUrl: `https://example.com/simulated-label-${parcelData.order_number}.pdf`,
              trackingNumber: `DHLTRACK${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            });
          } else {
            const errorMessages = [
              "Ungültige Adresse (Simulation).",
              "Gewichtslimit überschritten (Simulation).",
              "Authentifizierungsfehler mit API-Schlüssel (Simulation).",
              "Netzwerkfehler (Simulation)."
            ];
            const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            console.error("Sendcloud API (Simulation) - Error:", randomError, parcelData);
            resolve({ success: false, error: randomError });
          }
        }, 1500); 
      });
    };