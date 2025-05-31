import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { ThumbsUp, HelpCircle, BookOpenCheck, XCircle, PackagePlus } from 'lucide-react';
    import { motion } from 'framer-motion';

    const acceptedItemsPreviewData = [
      { name: "Bücher, CDs, DVDs, Spiele (auch Retro!)", icon: <BookOpenCheck className="h-6 w-6 text-green-600 mr-2" /> },
      { name: "Schallplatten, Kassetten, Modellautos, Eisenbahnen", icon: <PackagePlus className="h-6 w-6 text-green-600 mr-2" /> },
      { name: "Lego, Playmobil, Brettspiele (auch mit kleinen Fehlern)", icon: <ThumbsUp className="h-6 w-6 text-green-600 mr-2" /> },
    ];

    const notAcceptedItemsPreviewData = [
      { name: "Artikel aus Raucherhaushalten", icon: <XCircle className="h-6 w-6 text-red-600 mr-2" /> },
      { name: "Schimmlige oder stark riechende Artikel", icon: <XCircle className="h-6 w-6 text-red-600 mr-2" /> },
      { name: "Massiv beschädigte oder unbrauchbare Dinge", icon: <XCircle className="h-6 w-6 text-red-600 mr-2" /> },
    ];

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5,
          ease: "easeOut"
        }
      })
    };
    
    const AcceptedItemsPreviewSection = () => {
      return (
        <motion.section 
          className="py-16" 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Was wir lieben: Deine gebrauchten Schätze!</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Wir glauben an zweite Chancen! Statt wegzuwerfen, kaufen wir deine Artikel auf, bereiten sie auf und finden neue Liebhaber.
          </p>
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div variants={itemVariants} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <Card className="shadow-lg rounded-xl border-green-500 border-2 h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-600 dark:text-green-400 flex items-center"><ThumbsUp className="mr-3 h-8 w-8"/>Das kaufen wir gerne an (Auswahl):</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {acceptedItemsPreviewData.map(item => (
                    <div key={item.name} className="flex items-center text-muted-foreground">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground pt-3 italic">
                    Für die vollständige Liste und Details, besuche unsere Seite <Link to="/was-wir-annehmen" className="text-primary underline hover:text-primary/80">"Was wir annehmen"</Link>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <Card className="shadow-lg rounded-xl border-red-500 border-2 h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-600 dark:text-red-400 flex items-center"><HelpCircle className="mr-3 h-8 w-8"/>Das können wir leider nicht annehmen:</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                   {notAcceptedItemsPreviewData.map(item => (
                    <div key={item.name} className="flex items-center text-muted-foreground">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                   <p className="text-sm text-muted-foreground pt-3 italic">
                    Mehr Details und Ausnahmen findest du auf unserer <Link to="/was-wir-annehmen" className="text-primary underline hover:text-primary/80">Infoseite</Link>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      );
    };

    export default AcceptedItemsPreviewSection;