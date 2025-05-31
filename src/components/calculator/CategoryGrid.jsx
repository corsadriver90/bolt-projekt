import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { ChevronRight } from 'lucide-react';
    import { getIconComponent } from '@/hooks/useCart'; // Corrected import

    const CategoryGrid = ({ categories, onCategorySelect }) => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        },
      };

      return (
        <div>
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Wähle eine Kategorie</h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => (
              <motion.div key={category.name} variants={itemVariants}>
                <Card
                  onClick={() => onCategorySelect(category)}
                  className="cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-200 ease-in-out group overflow-hidden h-full flex flex-col"
                >
                  <CardHeader className="p-4 flex-grow">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      {getIconComponent(category.iconName, { className: "h-8 w-8 md:h-10 md:h-10 text-primary" })}
                    </div>
                    <CardTitle className="text-sm md:text-base font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                      {category.name.split('(')[0].trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 text-center">
                     <p className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {category.pricePerKg > 0 ? `${category.pricePerKg.toFixed(2)} €/kg` : 'Auf Anfrage'}
                     </p>
                  </CardContent>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 text-center text-xs font-medium text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center">
                    Auswählen <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      );
    };

    export default CategoryGrid;