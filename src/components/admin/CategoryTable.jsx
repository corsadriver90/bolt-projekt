import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Edit3, Trash2, Loader2, Package, ArrowUpDown } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import * as LucideIcons from 'lucide-react';

    const IconRenderer = ({ iconName, ...props }) => {
      const IconComponent = LucideIcons[iconName] || Package;
      return <IconComponent {...props} />;
    };

    const CategoryTable = ({ categories, isLoading, onEdit, onDelete, onSort }) => {
      if (isLoading && categories.length === 0) {
        return (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }

      if (!isLoading && categories.length === 0) {
        return <p className="text-muted-foreground text-center py-4">Noch keine Kategorien vorhanden.</p>;
      }

      return (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Vorhandene Ankaufkategorien</CardTitle>
            <CardDescription>Liste aller Kategorien und deren Preise. Klicken Sie auf Spaltenüberschriften zum Sortieren.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary" onClick={() => onSort('name')}>
                      Name <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary" onClick={() => onSort('price_per_kg')}>
                      Preis (€) <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Typ</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary" onClick={() => onSort('sort_order')}>
                      Reihenf. <ArrowUpDown className="inline-block ml-1 h-3 w-3" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Aktiv</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {categories.map(category => (
                    <tr key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <IconRenderer iconName={category.icon_name} className="h-5 w-5 text-primary" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{parseFloat(category.price_per_kg).toFixed(2)} / {category.category_type && category.category_type.includes('kg') ? 'kg' : 'Stk.'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              category.category_type === 'kg' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' :
                              category.category_type === 'stueck' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                            }`}>
                            {category.category_type}
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{category.sort_order}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}>
                          {category.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(category)} aria-label="Kategorie bearbeiten">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" aria-label="Kategorie löschen">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Diese Aktion kann nicht rückgängig gemacht werden. Die Kategorie "{category.name}" wird dauerhaft gelöscht.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(category.id)} className="bg-destructive hover:bg-destructive/90">
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Insgesamt {categories.length} Kategorien.</p>
          </CardFooter>
        </Card>
      );
    };

    export default CategoryTable;