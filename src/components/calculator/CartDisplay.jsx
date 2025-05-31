import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Trash2, ShoppingCart } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { getIconComponent } from '@/hooks/useCart'; // Corrected import

    const CartDisplay = ({ cartItems, totalWeight, totalPrice, onRemoveItem, onUpdateItemWeight }) => {
      
      const renderItemIcon = (iconName) => {
        const icon = getIconComponent(iconName, { className: "h-8 w-8 text-primary mr-3 flex-shrink-0" });
        return icon;
      };

      return (
        <Card className="shadow-xl sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <ShoppingCart className="mr-3 h-7 w-7" /> Dein Warenkorb
            </CardTitle>
            {cartItems.length === 0 && <CardDescription>Dein Warenkorb ist leer. Füge Artikel hinzu, um den Wert zu sehen.</CardDescription>}
          </CardHeader>
          <CardContent className={`space-y-4 ${cartItems.length > 0 ? 'max-h-[calc(100vh-30rem)] overflow-y-auto pr-2' : ''}`}>
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                  layout
                  className="p-4 border rounded-lg shadow-sm bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      {renderItemIcon(item.iconName)}
                      <div>
                        <p className="font-semibold text-foreground text-base">{item.category.split('(')[0].trim()}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.requiresContact ? 'Preis auf Anfrage' : `${(item.pricePerKg || 0).toFixed(2)} €/kg`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)} className="text-destructive hover:text-destructive/80 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`weight-${item.id}`} className="text-sm whitespace-nowrap">Gewicht (kg):</Label>
                    <Input
                      id={`weight-${item.id}`}
                      type="text"
                      inputMode="decimal"
                      value={item.weight === 0 && item.price === 0 && !item.requiresContact ? '' : item.weight.toString()}
                      onChange={(e) => onUpdateItemWeight(item.id, e.target.value)}
                      className="w-24 h-9 text-sm"
                      disabled={item.requiresContact}
                    />
                    <p className="text-sm font-medium text-foreground ml-auto">= {(item.price || 0).toFixed(2)} €</p>
                  </div>
                  {item.requiresContact && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">Preis wird nach Kontaktaufnahme festgelegt.</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
          {cartItems.length > 0 && (
            <CardFooter className="flex-col items-stretch space-y-4 pt-6 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Gesamtgewicht:</span>
                <span className="text-primary">{totalWeight.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-2xl font-bold">
                <span className="text-foreground">Gesamtpreis:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} €</span>
              </div>
              <Button asChild size="lg" className="w-full text-lg py-7 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg mt-4">
                <Link to="/ankaufsformular">
                  Ankauf abschließen <ShoppingCart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      );
    };

    export default CartDisplay;