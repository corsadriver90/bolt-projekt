import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
    import { Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';

    const CategoryForm = ({
      showForm,
      editingCategoryId,
      currentCategory,
      handleInputChange,
      handleSwitchChange,
      handleSubmit,
      isSubmitting,
      onCancel,
    }) => {
      if (!showForm) return null;

      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 overflow-hidden"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{editingCategoryId ? 'Kategorie bearbeiten' : 'Neue Kategorie erstellen'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Kategoriename</Label>
                  <Input id="name" name="name" value={currentCategory.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="price_per_kg">Preis pro KG/Stück (€)</Label>
                  <Input id="price_per_kg" name="price_per_kg" type="number" step="0.01" value={currentCategory.price_per_kg} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="icon_name">Icon Name (Lucide Icons)</Label>
                  <Input id="icon_name" name="icon_name" value={currentCategory.icon_name} onChange={handleInputChange} placeholder="z.B. BookMarked, Disc3, Gamepad2" />
                  <p className="text-xs text-muted-foreground mt-1">Eine Liste aller Icons finden Sie auf <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lucide.dev/icons</a>.</p>
                </div>
                <div>
                  <Label htmlFor="category_type">Kategorie Typ</Label>
                   <select 
                    id="category_type" 
                    name="category_type" 
                    value={currentCategory.category_type} 
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="kg">Pro KG</option>
                    <option value="stueck">Pro Stück</option>
                    <option value="defekt_kg">Defekt pro KG</option>
                    <option value="defekt_stueck">Defekt pro Stück</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sort_order">Sortierreihenfolge</Label>
                  <Input id="sort_order" name="sort_order" type="number" value={currentCategory.sort_order} onChange={handleInputChange} placeholder="z.B. 10, 20, 30 (kleinere Zahlen zuerst)" />
                   <p className="text-xs text-muted-foreground mt-1">Gibt die Anzeigeposition an. Kleinere Zahlen werden weiter oben angezeigt.</p>
                </div>
                <div className="flex items-center space-x-2">
                   <Switch 
                    id="requires_weight" 
                    name="requires_weight" 
                    checked={currentCategory.requires_weight} 
                    onCheckedChange={(checked) => handleSwitchChange('requires_weight', checked)}
                  />
                  <Label htmlFor="requires_weight">Benötigt Gewichtsangabe</Label>
                </div>
                 <div className="flex items-center space-x-2">
                   <Switch 
                    id="is_active" 
                    name="is_active" 
                    checked={currentCategory.is_active} 
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Kategorie aktiv (im Rechner sichtbar)</Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingCategoryId ? 'Änderungen speichern' : 'Kategorie erstellen'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default CategoryForm;