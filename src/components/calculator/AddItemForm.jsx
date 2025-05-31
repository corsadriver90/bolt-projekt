import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { PlusCircle, AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const AddItemForm = ({
      currentItem,
      calculatedPrice,
      categories,
      onCategoryChange,
      onWeightChange,
      onAddItem,
      weightInputRef
    }) => {
      return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Artikel hinzufügen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="category" className="font-semibold">Kategorie auswählen*</Label>
              <Select onValueChange={onCategoryChange} value={currentItem.category}>
                <SelectTrigger id="category" className="w-full text-base py-3">
                  <SelectValue placeholder="Bitte Kategorie wählen" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      <div className="flex items-center">
                        {cat.icon}
                        <span className="ml-2">{cat.name} ({cat.pricePerKg > 0 ? `${cat.pricePerKg.toFixed(2)} €/kg` : 'Preis auf Anfrage'})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="weight" className="font-semibold">Gewicht in kg* (z.B. 2.5)</Label>
              <Input
                ref={weightInputRef}
                id="weight"
                type="text"
                inputMode="decimal"
                value={currentItem.weight}
                onChange={onWeightChange}
                placeholder="z.B. 2.5"
                className="text-base py-3"
              />
            </div>
            {currentItem.requiresContact && currentItem.category && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-start p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-300 text-sm"
              >
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Für diese Kategorie ("Sonstiges") wird der Preis individuell nach Kontaktaufnahme festgelegt. Der hier angezeigte Preis von 0,00 € dient als Platzhalter.</span>
              </motion.div>
            )}
            <div className="text-right">
              <p className="text-lg font-semibold">Geschätzter Preis: <span className="text-primary">{currentItem.requiresContact ? "0.00" : calculatedPrice.toFixed(2)} €</span></p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onAddItem} size="lg" className="w-full text-lg py-7 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> Zum Warenkorb hinzufügen
            </Button>
          </CardFooter>
        </Card>
      );
    };

    export default AddItemForm;