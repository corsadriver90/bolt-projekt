import React from 'react';
    import { BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import AcceptedCategoryCard from '@/components/accepteditems/AcceptedCategoryCard';
    import ExclusionsList from '@/components/accepteditems/ExclusionsList';
    import { acceptedCategoriesData, generalExclusionsData } from '@/components/accepteditems/data';

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };

    const AcceptedItemsPage = () => {
      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <BookOpen className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Was wir annehmen: Deine Schätze bekommen eine 2. Chance!</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bei uns ist (fast) nichts Müll! Wir prüfen jeden Artikel fair und geben ihm die Chance auf ein neues Zuhause. Kein mühsames Einzel-Einscannen, kein automatisches Ablehnen bei kleinen Makeln.
            </p>
          </motion.div>

          <div className="space-y-12">
            {acceptedCategoriesData.map((category) => (
              <AcceptedCategoryCard key={category.title} category={category} />
            ))}
          </div>

          <motion.section 
            className="mt-20 py-12 bg-red-50 dark:bg-red-900/30 rounded-xl shadow-lg"
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="text-center mb-10 px-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Das können wir leider NICHT annehmen</h2>
               <p className="text-md text-muted-foreground max-w-2xl mx-auto mt-2">
                Auch wir haben Grenzen, um die Qualität für Käufer zu sichern und aus hygienischen Gründen.
              </p>
            </div>
            <ExclusionsList exclusions={generalExclusionsData} />
          </motion.section>

          <motion.section 
            className="mt-20 text-center"
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }}
          >
            <HelpCircle className="h-16 w-16 text-sky-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-4">Unsicher? Frag uns einfach!</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Wenn deine Schätze hier nicht eindeutig gelistet sind oder du Fragen zum Zustand hast, zögere nicht, uns zu kontaktieren. Wir finden fast immer eine Lösung! Für "Sonstige" Artikel im Rechner nutze bitte auch den Kontaktweg für eine individuelle Preisabsprache.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
              <Link to="/kontakt">
                Jetzt Kontakt aufnehmen
              </Link>
            </Button>
          </motion.section>
        </div>
      );
    };

    export default AcceptedItemsPage;