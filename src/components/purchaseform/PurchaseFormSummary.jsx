import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { ShoppingCart, Package, Euro } from 'lucide-react';
    import { motion } from 'framer-motion';

    const PurchaseFormSummary = ({ cartItems, totalWeight, totalPrice }) => {
      if (cartItems.length === 0) {
        return null;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-slate-50 to-gray-100 shadow-lg border-t-4 border-sky-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-sky-700 flex items-center justify-center">
                <ShoppingCart className="mr-3 h-7 w-7 text-sky-600" />
                Deine Ankaufsübersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between items-center text-lg p-3 bg-white rounded-md shadow">
                <span className="font-medium text-gray-700 flex items-center">
                  <Package className="mr-2 h-5 w-5 text-sky-500" />
                  Gesamtgewicht:
                </span>
                <span className="font-bold text-sky-600">{totalWeight.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center text-lg p-3 bg-white rounded-md shadow">
                <span className="font-medium text-gray-700 flex items-center">
                  <Euro className="mr-2 h-5 w-5 text-emerald-500" />
                  Geschätzter Ankaufswert:
                </span>
                <span className="font-bold text-emerald-600">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-600 mb-2 text-center">Enthaltene Artikel:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-500 max-h-32 overflow-y-auto px-3">
                  {cartItems.map((item, index) => (
                    <li key={index} className="truncate">
                      {item.category}: {item.weight.toFixed(2)} kg ({item.price.toFixed(2)} €)
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default PurchaseFormSummary;