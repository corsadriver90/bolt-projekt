import React, { useState, useEffect, useRef } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { PlusCircle, ShoppingCart, AlertTriangle, Weight } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useCart, getIconComponent } from '@/hooks/useCart'; // Corrected import
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import CalculatorInfoBox from '@/components/calculator/CalculatorInfoBox';
    import CartDisplay from '@/components/calculator/CartDisplay';
    import CategoryGrid from '@/components/calculator/CategoryGrid';

    const CalculatorPage = () => {
      const { toast } = useToast();
      const { 
        cartItems, 
        addItemToCart, 
        removeItemFromCart, 
        updateItemWeightInCart, 
        totalWeight, 
        totalPrice, 
        categories,
        isLoadingCategories 
      } = useCart();
      
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [currentWeight, setCurrentWeight] = useState('');
      const [calculatedPrice, setCalculatedPrice] = useState(0);
      const weightInputRef = useRef(null);

      useEffect(() => {
        if (selectedCategory && currentWeight) {
          const weightNum = parseFloat(currentWeight) || 0;
          setCalculatedPrice(weightNum * selectedCategory.pricePerKg);
        } else {
          setCalculatedPrice(0);
        }
      }, [selectedCategory, currentWeight]);

      const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentWeight('');
        setCalculatedPrice(0);
        if (weightInputRef.current) {
          setTimeout(() => weightInputRef.current.focus(), 0);
        }
      };

      const handleWeightChange = (e) => {
        const weightValue = e.target.value;
        if (/^\d*\.?\d*$/.test(weightValue)) { // Allow empty string, numbers, and one decimal point
          setCurrentWeight(weightValue);
        }
      };

      const handleAddItem = () => {
        if (!selectedCategory) {
          toast({
            title: 'Fehlende Kategorie',
            description: 'Bitte wähle zuerst eine Kategorie aus.',
            variant: 'destructive',
          });
          return;
        }
        if (!currentWeight && !selectedCategory.requiresContact) {
           toast({
            title: 'Fehlendes Gewicht',
            description: 'Bitte gib ein Gewicht für die ausgewählte Kategorie ein.',
            variant: 'destructive',
          });
          return;
        }

        const weightNum = parseFloat(currentWeight) || 0; // Default to 0 if empty or invalid for contact items

        if (weightNum <= 0 && !selectedCategory.requiresContact) {
          toast({
            title: 'Ungültiges Gewicht',
            description: 'Das Gewicht muss eine positive Zahl sein.',
            variant: 'destructive',
          });
          return;
        }
        
        addItemToCart({
          category: selectedCategory.name,
          weight: weightNum,
          pricePerKg: selectedCategory.pricePerKg,
          price: selectedCategory.requiresContact ? 0 : weightNum * selectedCategory.pricePerKg,
          requiresContact: selectedCategory.requiresContact,
          iconName: selectedCategory.iconName 
        });

        toast({
          title: 'Artikel hinzugefügt',
          description: `${selectedCategory.name} (${weightNum > 0 ? `${weightNum} kg` : 'Auf Anfrage'}) wurde zum Warenkorb hinzugefügt.`,
          variant: 'success'
        });
        setSelectedCategory(null); 
        setCurrentWeight('');
        setCalculatedPrice(0);
      };
      
      const handleCartItemWeightChange = (id, newWeightString) => {
        // Allow empty string for clearing, otherwise validate
        if (newWeightString === '' || /^\d*\.?\d*$/.test(newWeightString)) {
          const weightNum = newWeightString === '' ? 0 : parseFloat(newWeightString);
          if (!isNaN(weightNum) && weightNum >= 0) {
            updateItemWeightInCart(id, weightNum);
          } else if (newWeightString !== '' && (isNaN(weightNum) || weightNum < 0)) {
            // If not empty and invalid, do not update, or show toast
             toast({ title: "Ungültige Eingabe", description: "Bitte geben Sie eine gültige Zahl für das Gewicht ein.", variant: "destructive" });
          }
        } else {
           toast({ title: "Ungültige Eingabe", description: "Bitte geben Sie eine gültige Zahl für das Gewicht ein.", variant: "destructive" });
        }
      };

      if (isLoadingCategories) {
        return (
          <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              {getIconComponent("Coins", { className: "h-16 w-16 text-primary" })}
            </motion.div>
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CalculatorInfoBox totalWeight={totalWeight} />
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {!selectedCategory ? (
                  <CategoryGrid categories={categories} onCategorySelect={handleCategorySelect} />
                ) : (
                  <motion.div
                    key={selectedCategory.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl text-primary flex items-center">
                            {getIconComponent(selectedCategory.iconName, { className: "h-7 w-7 mr-3" })}
                            {selectedCategory.name}
                          </CardTitle>
                          <Button variant="link" onClick={() => setSelectedCategory(null)} className="text-sm">
                            Andere Kategorie wählen
                          </Button>
                        </div>
                        <CardDescription>
                          {selectedCategory.pricePerKg > 0 ? `Preis: ${selectedCategory.pricePerKg.toFixed(2)} €/kg` : 'Preis auf Anfrage'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {!selectedCategory.requiresContact && (
                          <div>
                            <Label htmlFor="weight" className="font-semibold text-lg flex items-center">
                              <Weight className="mr-2 h-5 w-5 text-muted-foreground" />
                              Gewicht in kg* (z.B. 2.5)
                            </Label>
                            <Input
                              ref={weightInputRef}
                              id="weight"
                              type="text"
                              inputMode="decimal"
                              value={currentWeight}
                              onChange={handleWeightChange}
                              placeholder="z.B. 2.5"
                              className="text-xl py-6 mt-2"
                            />
                          </div>
                        )}
                        {selectedCategory.requiresContact && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 flex items-start p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md text-amber-700 dark:text-amber-300 text-sm"
                          >
                            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Für diese Kategorie wird der Preis individuell nach Kontaktaufnahme festgelegt. Der hier angezeigte Preis von 0,00 € dient als Platzhalter. Fügen Sie den Artikel hinzu und wir kontaktieren Sie.</span>
                          </motion.div>
                        )}
                        <div className="text-right">
                          <p className="text-2xl font-semibold">
                            Geschätzter Preis: <span className="text-primary">{selectedCategory.requiresContact ? "0.00" : calculatedPrice.toFixed(2)} €</span>
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={handleAddItem} size="lg" className="w-full text-lg py-7 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-md">
                          <PlusCircle className="mr-2 h-6 w-6" /> Artikel hinzufügen
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-1">
                <CartDisplay
                  cartItems={cartItems}
                  totalWeight={totalWeight}
                  totalPrice={totalPrice}
                  onRemoveItem={removeItemFromCart}
                  onUpdateItemWeight={handleCartItemWeightChange}
                />
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    export default CalculatorPage;