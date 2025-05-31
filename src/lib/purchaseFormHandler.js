import { supabase } from '@/lib/supabaseClient';

    const upsertCustomer = async (formData) => {
      const { data: existingCustomer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (customerError && customerError.code !== 'PGRST116') {
        console.error('Error fetching customer:', customerError);
        throw new Error(`Fehler beim Überprüfen der Kundendaten: ${customerError.message}`);
      }

      if (existingCustomer) {
        const { error: updateCustomerError } = await supabase
          .from('customers')
          .update({
            name: formData.name,
            phone: formData.phone,
            street: formData.street,
            zip: formData.zip,
            city: formData.city,
            company_name: formData.companyName || null,
          })
          .eq('id', existingCustomer.id);
        if (updateCustomerError) {
          console.error('Error updating customer:', updateCustomerError);
          throw new Error(`Fehler beim Aktualisieren der Kundendaten: ${updateCustomerError.message}`);
        }
        return existingCustomer.id;
      } else {
        const { data: newCustomer, error: newCustomerError } = await supabase
          .from('customers')
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            zip: formData.zip,
            city: formData.city,
            company_name: formData.companyName || null,
          })
          .select('id')
          .single();
        if (newCustomerError) {
          console.error('Error creating customer:', newCustomerError);
          throw new Error(`Fehler beim Erstellen des Kundenprofils: ${newCustomerError.message}`);
        }
        return newCustomer.id;
      }
    };

    const createAnkaufRequest = async (customerId, formData, cartItems, totalWeight, totalPrice, ankaufsNummer) => {
      const ankaufRequestData = {
        customer_id: customerId,
        submission_date: new Date().toISOString(),
        delivery_type: formData.deliveryType,
        total_weight: totalWeight,
        total_price: totalPrice,
        items: cartItems,
        iban: formData.iban ? formData.iban.replace(/\s/g, '').toUpperCase() : null,
        paypal: formData.paypal,
        agb_accepted: formData.agbAccepted,
        own_items_confirmed: formData.ownItemsConfirmed,
        status: 'pending',
        ankaufs_nummer: ankaufsNummer,
        number_of_labels: parseInt(formData.numberOfLabels, 10) || 0,
      };

      const { data: ankaufRequest, error: ankaufRequestError } = await supabase
        .from('ankauf_requests')
        .insert(ankaufRequestData)
        .select('id, ankaufs_nummer')
        .single();

      if (ankaufRequestError) {
        console.error('Error inserting ankauf_request:', ankaufRequestError);
        if (ankaufRequestError.code === '23505' && ankaufRequestError.message.includes('ankauf_requests_ankaufs_nummer_key')) {
          throw new Error('Ein interner Fehler ist aufgetreten (Ankaufsnummer-Konflikt). Bitte versuchen Sie es in Kürze erneut.');
        }
        throw new Error(`Fehler beim Speichern der Ankaufsanfrage: ${ankaufRequestError.message}`);
      }
      return ankaufRequest;
    };

    const createDeliverySpecificRecord = async (deliveryType, ankaufRequestId, customerId, formData) => {
      if (deliveryType === 'abholung') {
        const { error: pickupError } = await supabase
          .from('pickup_requests')
          .insert({
            ankauf_request_id: ankaufRequestId,
            customer_id: customerId,
            pickup_date: formData.pickupDetails?.date || formData.pickupDate || null,
            pickup_time: formData.pickupDetails?.time || formData.pickupTime || null,
            notes: formData.pickupDetails?.notes || formData.pickupNotes || null,
          });
        if (pickupError) {
          console.warn('Error inserting pickup_request (non-critical):', pickupError);
        }
      } else if (deliveryType === 'selbstanlieferung') {
        const { error: selfDeliveryError } = await supabase
          .from('self_delivery_appointments')
          .insert({
            ankauf_request_id: ankaufRequestId,
            customer_id: customerId,
            delivery_date: formData.deliveryDate || null,
            time_slot: formData.selectedTimeSlot || null,
            notes: formData.deliveryDetails?.notes || formData.selfDeliveryNotes || null,
          });
        if (selfDeliveryError) {
          console.warn('Error inserting self_delivery_appointment (non-critical):', selfDeliveryError);
        }
      }
    };
    
    export const handleSubmitPurchaseToSupabase = async (formData, cartItems, totalWeight, totalPrice) => {
      const submissionDate = new Date().toISOString();
      const ankaufsNummer = `BR-${new Date(submissionDate).getTime().toString().slice(-8)}`;
      let customerId;
      let ankaufRequestId;
      let returnedAnkaufsNummer;

      try {
        customerId = await upsertCustomer(formData);
        const ankaufRequest = await createAnkaufRequest(customerId, formData, cartItems, totalWeight, totalPrice, ankaufsNummer);
        ankaufRequestId = ankaufRequest.id;
        returnedAnkaufsNummer = ankaufRequest.ankaufs_nummer;

        await createDeliverySpecificRecord(formData.deliveryType, ankaufRequestId, customerId, formData);
        
        const submissionDataForLocalStorage = {
          ...formData,
          cartItems,
          totalWeight,
          totalPrice,
          submissionDate,
          ankaufsNummer: returnedAnkaufsNummer,
          ankaufRequestId: ankaufRequestId,
          numberOfLabels: formData.numberOfLabels,
          pickupDetails: formData.deliveryType === 'abholung' ? {
            date: formData.pickupDetails?.date || formData.pickupDate,
            time: formData.pickupDetails?.time || formData.pickupTime,
            notes: formData.pickupDetails?.notes || formData.pickupNotes,
          } : null,
          deliveryDetails: formData.deliveryType === 'selbstanlieferung' ? {
            notes: formData.deliveryDetails?.notes || formData.selfDeliveryNotes, 
            deliveryDate: formData.deliveryDate,
            selectedTimeSlot: formData.selectedTimeSlot,
          } : null,
        };
        localStorage.setItem('lastPurchaseSubmission', JSON.stringify(submissionDataForLocalStorage));
        
        return { 
          success: true, 
          error: null, 
          ankaufsNummer: returnedAnkaufsNummer, 
          ankaufRequestId: ankaufRequestId,
        };

      } catch (error) {
        console.error('handleSubmitPurchaseToSupabase error:', error);
        return { 
          success: false, 
          error: error.message || 'Ein unbekannter Fehler ist aufgetreten.', 
          ankaufsNummer: returnedAnkaufsNummer || null, 
          ankaufRequestId: ankaufRequestId || null,
        };
      }
    };