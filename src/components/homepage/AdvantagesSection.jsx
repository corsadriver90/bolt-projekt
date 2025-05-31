import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Zap, TrendingUp, Smile, ThumbsUp, Recycle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const advantagesData = [
      { title: 'Einfach & Direkt – Ohne Scannen!', description: 'Kein mühsames Einscannen jedes Artikels, keine komplizierten Listen. Einfach wiegen, grob sortieren und Geld erhalten!', icon: <Zap className="h-10 w-10 text-emerald-500" /> },
      { title: 'Faire Kilopreise – Sofort Klarheit', description: 'Wir zahlen transparente Kilopreise. Den Wert deiner Schätze siehst du direkt im Rechner, ohne Überraschungen.', icon: <TrendingUp className="h-10 w-10 text-sky-500" /> },
      { title: 'Mehr Platz & Gutes Gewissen', description: 'Schaffe Raum für Neues und gib deinen gebrauchten Artikeln eine zweite Chance. Das ist nachhaltig und schont Ressourcen.', icon: <Recycle className="h-10 w-10 text-green-500" /> },
      { title: 'Wir lieben Vielfalt!', description: 'Im Gegensatz zu vielen anderen nehmen wir eine breite Palette an Büchern, Medien und Spielzeug an – auch wenn mal ein Teil fehlt oder Gebrauchsspuren vorhanden sind. Details auf unserer "Was wir annehmen"-Seite.', icon: <ThumbsUp className="h-10 w-10 text-indigo-500" /> },
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

    const AdvantagesSection = () => {
      return (
        <motion.section 
          className="py-16 bg-gradient-to-b from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-900 rounded-2xl shadow-lg" 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Warum Die Buchretter? Deine Vorteile auf einen Blick:</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 px-6">
            {advantagesData.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start space-x-4 p-6 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                      {advantage.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold mt-1">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      );
    };

    export default AdvantagesSection;