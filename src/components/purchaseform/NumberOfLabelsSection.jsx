import React from 'react';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { motion } from 'framer-motion';
    import { Package } from 'lucide-react';

    const NumberOfLabelsSection = ({ numberOfLabels, handleSelectChange }) => {
      return (
        <motion.fieldset 
          className="space-y-4 p-4 border rounded-lg shadow-sm bg-sky-50/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <legend className="text-xl font-semibold text-foreground px-2 flex items-center">
            <Package className="mr-2 h-5 w-5 text-sky-600" /> Anzahl Versandlabels
          </legend>
          <div className="space-y-2">
            <Label htmlFor="numberOfLabels" className="text-base font-medium text-gray-700">
              Wie viele kostenlose DHL Versandlabels (bis 31,5 kg pro Paket) benötigen Sie?
            </Label>
            <Select
              name="numberOfLabels"
              value={numberOfLabels}
              onValueChange={(value) => handleSelectChange('numberOfLabels', value)}
            >
              <SelectTrigger id="numberOfLabels" className="w-full md:w-1/2 bg-white">
                <SelectValue placeholder="Anzahl auswählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Label</SelectItem>
                <SelectItem value="2">2 Labels</SelectItem>
                <SelectItem value="3">3 Labels</SelectItem>
                <SelectItem value="4">4 Labels</SelectItem>
                <SelectItem value="0">Mehr als 4? Bitte gesondert anfragen.</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Jedes Label ist für ein Paket bis max. 31,5 kg gültig. Wenn Sie mehr als 4 Labels benötigen, wählen Sie "Gesondert anfragen" und wir kontaktieren Sie.
            </p>
          </div>
        </motion.fieldset>
      );
    };

    export default NumberOfLabelsSection;