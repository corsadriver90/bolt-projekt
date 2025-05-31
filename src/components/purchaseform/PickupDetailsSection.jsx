import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { motion } from 'framer-motion';

    const PickupDetailsSection = ({ pickupDate, pickupTime, pickupNotes, handleChange }) => (
      <motion.fieldset 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-6 p-4 border rounded-lg shadow-sm overflow-hidden"
      >
        <legend className="text-xl font-semibold text-foreground px-2">Details zur Abholung</legend>
        <p className="text-sm text-muted-foreground px-2">
          Wir werden uns mit dir in Verbindung setzen, um den genauen Abholtermin zu bestätigen. 
          Du kannst hier deine Wunschtermine und Anmerkungen hinterlassen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="pickupDate" className="text-base">Wunschdatum für Abholung</Label>
            <Input 
              id="pickupDate" 
              name="pickupDate" 
              type="date" 
              value={pickupDate} 
              onChange={handleChange} 
              className="mt-1" 
              min={new Date().toISOString().split('T')[0]} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Label htmlFor="pickupTime" className="text-base">Ungefähre Wunschuhrzeit</Label>
            <Input 
              id="pickupTime" 
              name="pickupTime" 
              type="time" 
              value={pickupTime} 
              onChange={handleChange} 
              className="mt-1" 
            />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Label htmlFor="pickupNotes" className="text-base">Anmerkungen zur Abholung</Label>
          <Textarea 
            id="pickupNotes" 
            name="pickupNotes" 
            value={pickupNotes} 
            onChange={handleChange} 
            placeholder="z.B. Besonderheiten bei der Anfahrt, Etage, etc." 
            className="mt-1"
            rows={3}
          />
        </motion.div>
      </motion.fieldset>
    );

    export default PickupDetailsSection;