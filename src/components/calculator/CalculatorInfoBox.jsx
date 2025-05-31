import React from 'react';
    import { motion } from 'framer-motion';
    import { Info, Truck } from 'lucide-react';

    const CalculatorInfoBox = ({ totalWeight }) => {
      const showFreeShippingBanner = totalWeight >= 10;

      return (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 p-6 bg-gradient-to-r from-sky-100 to-cyan-100 dark:from-sky-800/50 dark:to-cyan-800/50 rounded-xl shadow-lg border border-sky-200 dark:border-sky-700"
        >
          <div className="flex items-center mb-3">
            <Info className="h-7 w-7 text-sky-600 dark:text-sky-400 mr-3 flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-sky-800 dark:text-sky-200">Ankauf leicht gemacht</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-base">
            Nutze unseren Rechner, um den Wert deiner Artikel schnell zu ermitteln. Wähle einfach die Kategorie und gib das Gewicht an.
            Wir kaufen eine Vielzahl von Medien und Sammlerstücken an – gib ihnen eine zweite Chance!
          </p>
          
          {showFreeShippingBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="mt-4 p-4 bg-emerald-500 text-white rounded-lg flex items-center shadow-md"
            >
              <Truck className="h-6 w-6 mr-3 flex-shrink-0" />
              <p className="font-semibold text-base">Super! Ab 10 kg ist der Versand für dich kostenlos!</p>
            </motion.div>
          )}
           {!showFreeShippingBanner && totalWeight > 0 && totalWeight < 10 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="mt-4 p-4 bg-amber-500 text-white rounded-lg flex items-center shadow-md"
            >
              <Truck className="h-6 w-6 mr-3 flex-shrink-0" />
              <p className="font-semibold text-base">Noch { (10 - totalWeight).toFixed(1) } kg bis zum kostenlosen Versand!</p>
            </motion.div>
          )}

          <ul className="list-disc list-inside mt-4 space-y-1 text-muted-foreground text-sm">
            <li>Faire Preise basierend auf Gewicht und Kategorie.</li>
            <li>Schnelle und unkomplizierte Abwicklung.</li>
            <li>Nachhaltig: Deine Artikel bekommen ein neues Leben.</li>
          </ul>
        </motion.div>
      );
    };

    export default CalculatorInfoBox;