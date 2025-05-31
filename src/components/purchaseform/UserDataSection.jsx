import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { motion } from 'framer-motion';

    const UserDataSection = ({ formData, handleChange }) => (
      <fieldset className="space-y-6 p-4 border rounded-lg shadow-sm">
        <legend className="text-xl font-semibold text-foreground px-2">Ihre Daten</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="name" className="text-base">Vor- und Nachname*</Label>
            <Input id="name" name="name" value={formData.name} onChange={(e) => handleChange('name', e)} placeholder="Max Mustermann" required className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Label htmlFor="companyName" className="text-base">Firma (optional)</Label>
            <Input id="companyName" name="companyName" value={formData.companyName} onChange={(e) => handleChange('companyName', e)} placeholder="Musterfirma GmbH" className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Label htmlFor="email" className="text-base">E-Mail-Adresse*</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e)} placeholder="max.mustermann@beispiel.de" required className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <Label htmlFor="phone" className="text-base">Telefon (optional, für Rückfragen)</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e)} placeholder="0123 4567890" className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Label htmlFor="street" className="text-base">Straße und Hausnummer*</Label>
            <Input id="street" name="street" value={formData.street} onChange={(e) => handleChange('street', e)} placeholder="Musterstraße 1a" required className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <Label htmlFor="zip" className="text-base">Postleitzahl*</Label>
            <Input id="zip" name="zip" value={formData.zip} onChange={(e) => handleChange('zip', e)} placeholder="12345" required maxLength="5" pattern="\d{5}" className="mt-1" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2">
            <Label htmlFor="city" className="text-base">Ort*</Label>
            <Input id="city" name="city" value={formData.city} onChange={(e) => handleChange('city', e)} placeholder="Musterstadt" required className="mt-1" />
          </motion.div>
        </div>
        <p className="text-xs text-muted-foreground">* Pflichtfeld</p>
      </fieldset>
    );

    export default UserDataSection;