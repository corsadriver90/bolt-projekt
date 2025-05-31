import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { CheckCircle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };
    
    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.4,
          ease: "easeOut"
        }
      })
    };

    const AcceptedCategoryCard = ({ category }) => {
      return (
        <motion.section 
          key={category.title} 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
        >
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden border-l-4 border-primary">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
              <div className="flex items-center space-x-4">
                {category.icon}
                <CardTitle className="text-3xl font-semibold text-primary">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-2 gap-6">
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <motion.li 
                    key={item} 
                    className="flex items-start"
                    custom={itemIndex}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
              {category.notes && (
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-md border border-emerald-200 dark:border-emerald-700">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Unsere Philosophie dazu:</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{category.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      );
    };

    export default AcceptedCategoryCard;