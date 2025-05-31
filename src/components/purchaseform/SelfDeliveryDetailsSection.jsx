import React, { useState, useEffect } from 'react';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { Calendar } from "@/components/ui/calendar";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Textarea } from '@/components/ui/textarea';
    import { motion } from 'framer-motion';
    import { Calendar as CalendarIcon, Clock } from 'lucide-react';
    import { format, addDays, isWeekend, isSameDay } from 'date-fns';
    import { de } from 'date-fns/locale';

    const generateTimeSlots = () => {
      const slots = [];
      for (let hour = 7; hour < 16; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:00`);
      }
      return slots;
    };

    const timeSlots = generateTimeSlots();

    const SelfDeliveryDetailsSection = ({ formData, setFormData, handleChange }) => {
      const [selectedDate, setSelectedDate] = useState(formData.deliveryDate ? new Date(formData.deliveryDate) : null);

      useEffect(() => {
        if (selectedDate) {
          setFormData(prev => ({ ...prev, deliveryDate: selectedDate.toISOString().split('T')[0] }));
        }
      }, [selectedDate, setFormData]);

      const handleTimeSlotSelect = (slot) => {
        setFormData(prev => ({ ...prev, selectedTimeSlot: slot }));
      };
      
      const disabledDays = (date) => isWeekend(date);

      return (
        <motion.fieldset 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6 p-4 border rounded-lg shadow-sm overflow-hidden"
        >
          <legend className="text-xl font-semibold text-foreground px-2">Details zur Selbstanlieferung</legend>
          <p className="text-sm text-muted-foreground px-2">
            Bitte wähle ein Datum und ein Zeitfenster für deine Anlieferung in unserer Filiale: Triftstr. 21B, 16348 Wandlitz OT Klosterfelde.
            Unsere Annahmezeiten sind Montag bis Freitag, 07:00 - 16:00 Uhr.
          </p>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Label className="text-base mb-2 block">Datum für Anlieferung*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: de }) : <span>Wähle ein Datum</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={de}
                  disabled={(date) => disabledDays(date) || date < new Date(new Date().setDate(new Date().getDate() -1))}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                />
              </PopoverContent>
            </Popover>
          </motion.div>

          {selectedDate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <Label className="text-base mb-2 block">Verfügbare Zeitfenster für {format(selectedDate, "PPP", { locale: de })}*</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={formData.selectedTimeSlot === slot ? "default" : "outline"}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className="flex items-center justify-center text-sm"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {slot}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Label htmlFor="selfDeliveryNotes" className="text-base">Anmerkungen zur Anlieferung (optional)</Label>
            <Textarea 
              id="selfDeliveryNotes" 
              name="selfDeliveryNotes" 
              value={formData.selfDeliveryNotes || ''} 
              onChange={(e) => handleChange('selfDeliveryNotes', e)}
              placeholder="z.B. besondere Anforderungen, große Mengen etc." 
              className="mt-1"
              rows={3}
            />
          </motion.div>
          <p className="text-xs text-muted-foreground">* Pflichtfeld</p>
        </motion.fieldset>
      );
    };

    export default SelfDeliveryDetailsSection;