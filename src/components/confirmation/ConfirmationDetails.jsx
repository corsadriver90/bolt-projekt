import React from 'react';
    import { motion } from 'framer-motion';
    import { MailCheck } from 'lucide-react';

    const getDeliveryTypeGerman = (type) => {
      if (type === 'selbstanlieferung') return 'Selbstanlieferung';
      if (type === 'versand') return 'Versand';
      if (type === 'abholung') return 'Abholung';
      return type;
    };

    const ConfirmationDetails = ({ submissionData, hasExistingLabel }) => {
      if (!submissionData) return null;

      const formattedDate = new Date(submissionData.submissionDate).toLocaleDateString('de-DE', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return (
        <>
          <motion.div
            className="text-center p-6 bg-emerald-50 rounded-lg border border-emerald-200 shadow"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          >
            <MailCheck className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-emerald-700">Vielen Dank, {submissionData.name}!</h2>
            <p className="text-gray-600 mt-1">
              Deine Anfrage vom {formattedDate} Uhr wurde erfolgreich übermittelt.
              Ein Begleitschein wurde automatisch für dich generiert und zum Druck geöffnet. Du erhältst ihn auch in Kürze per E-Mail.
              {submissionData.deliveryType === 'versand' && submissionData.totalWeight >= 1 && (
                hasExistingLabel
                  ? " Du hast bereits ein Retourenlabel erstellt. Du kannst es unten erneut öffnen."
                  : " Bei Versand kannst du unten ein kostenloses DHL Retourenlabel erstellen und direkt öffnen."
              )}
            </p>
          </motion.div>

          <div className="space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-3">Zusammenfassung:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong className="text-slate-600">Name:</strong> {submissionData.name}</div>
              <div><strong className="text-slate-600">E-Mail:</strong> {submissionData.email}</div>
              <div><strong className="text-slate-600">Abgabeart:</strong> {getDeliveryTypeGerman(submissionData.deliveryType)}</div>
              <div><strong className="text-slate-600">Gesamtgewicht:</strong> {submissionData.totalWeight.toFixed(2)} kg</div>
              <div><strong className="text-slate-600">Geschätzter Ankaufswert:</strong> {submissionData.totalPrice.toFixed(2)} €</div>
              {submissionData.iban && <div><strong className="text-slate-600">IBAN:</strong> {submissionData.iban}</div>}
              {submissionData.paypal && <div><strong className="text-slate-600">PayPal:</strong> {submissionData.paypal}</div>}
            </div>
          </div>
        </>
      );
    };

    export default ConfirmationDetails;