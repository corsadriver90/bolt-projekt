import React from 'react';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';

    const ConfirmationSection = ({ formData, handleChange }) => (
      <fieldset className="space-y-6 p-4 border rounded-lg shadow-sm">
        <legend className="text-xl font-semibold text-foreground px-2">Bestätigungen</legend>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="items-top flex space-x-3"
        >
          <Checkbox 
            id="agbAccepted" 
            name="agbAccepted" 
            checked={formData.agbAccepted} 
            onCheckedChange={(checked) => handleChange('agbAccepted', checked)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="agbAccepted" className="text-base font-medium">
              Ich habe die <Link to="/agb" target="_blank" className="text-primary hover:underline">Allgemeinen Geschäftsbedingungen</Link> gelesen und akzeptiere diese.*
            </Label>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="items-top flex space-x-3"
        >
          <Checkbox 
            id="ownItemsConfirmed" 
            name="ownItemsConfirmed" 
            checked={formData.ownItemsConfirmed} 
            onCheckedChange={(checked) => handleChange('ownItemsConfirmed', checked)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="ownItemsConfirmed" className="text-base font-medium">
              Ich bestätige, dass ich der rechtmäßige Eigentümer der Artikel bin oder zum Verkauf berechtigt bin.*
            </Label>
          </div>
        </motion.div>
        <p className="text-xs text-muted-foreground">* Pflichtfeld</p>
      </fieldset>
    );

    export default ConfirmationSection;