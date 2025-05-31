import { supabase } from '@/lib/supabaseClient';

    const getModifiedOrderNumberForDB = (baseOrderNumber, index, totalLabels) => {
      if (totalLabels === 1) return baseOrderNumber;
      return `${baseOrderNumber}-L${index + 1}`;
    };

    export const fetchExistingLabelUrls = async (ankaufRequestId, baseOrderNumber, numberOfLabels) => {
      if (!ankaufRequestId || !baseOrderNumber || numberOfLabels === 0) return [];
      
      const urls = [];
      for (let i = 0; i < numberOfLabels; i++) {
        const orderNumberForQuery = getModifiedOrderNumberForDB(baseOrderNumber, i, numberOfLabels);
        try {
          const { data, error } = await supabase
            .from('ankauf_requests')
            .select('pdf_url') // Changed from return_label_url to pdf_url
            .eq('ankaufs_nummer', orderNumberForQuery) 
            .eq('id', ankaufRequestId) 
            .maybeSingle(); 

          if (error && error.code !== 'PGRST116') { 
            console.warn(`Error fetching existing label URL for ${orderNumberForQuery} from DB:`, error);
            urls.push(null); 
          } else {
            urls.push(data?.pdf_url || null); // Changed from return_label_url to pdf_url
          }
        } catch (err) {
          console.warn(`Exception fetching existing label URL for ${orderNumberForQuery} from DB:`, err);
          urls.push(null);
        }
      }
      return urls;
    };


    export const validateLabelPayload = (data) => {
      const requiredFields = {
        customer_name: "Name des Kunden",
        customer_street_name: "Straße des Kunden",
        customer_city: "Stadt des Kunden",
        customer_zip: "PLZ des Kunden",
        customer_email: "E-Mail des Kunden",
        order_number: "Ankaufsnummer (ggf. modifiziert)",
      };
      for (const field in requiredFields) {
        if (!data[field] || String(data[field]).trim() === "") {
          return `Fehlendes Pflichtfeld für Label: ${requiredFields[field]}. Bitte überprüfen Sie Ihre Angaben.`;
        }
      }
      return null;
    };

    export const createLabelAndGetUrl = async (payload, supabaseUrl, supabaseAnonKey) => {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/create-sendcloud-label`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify(payload) 
        });

        const result = await response.json();

        if (!response.ok || !result.success || !result.label_download_url) {
          const apiErrorMessage = result?.error || result?.message || 'Unbekannter Fehler von der Label API.';
          console.error('API response error for label creation:', result);
          throw new Error(apiErrorMessage);
        }
        
        // The Edge function handles updating the DB with the label URL in 'pdf_url' column.
        // No need to update ankauf_requests from the client-side here.
        
        return result.label_download_url;

      } catch (error) {
        console.error('Error in createLabelAndGetUrl:', error);
        throw error; 
      }
    };