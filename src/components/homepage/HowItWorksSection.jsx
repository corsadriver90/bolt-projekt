import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Send, Coins, PackageSearch } from 'lucide-react';
    import { motion } from 'framer-motion';

    const stepsData = [
      { title: 'Einfach Wiegen', description: 'Wiege deine Bücher, Medien oder Spielzeuge. Keine komplizierte Einzelbewertung nötig!', icon: <Coins className="h-12 w-12 text-primary" /> },
      { title: 'Sicher Versenden oder Abgeben', description: 'Sende uns dein Paket (ab 10kg kostenlos) oder gib es direkt bei uns ab.', icon: <Send className="h-12 w-12 text-primary" /> },
      { title: 'Schnell Geld Erhalten', description: 'Nach kurzer Prüfung überweisen wir dir den Betrag – unkompliziert und fair.', icon: <PackageSearch className="h-12 w-12 text-primary" /> },
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

    const HowItWorksSection = () => {
      return (
        <motion.section 
          className="py-16" 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">So einfach geht's zum Geld</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {stepsData.map((step, index) => (
              <motion.div
                key={step.title}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="text-center h-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-out glassmorphism transform hover:-translate-y-1 rounded-xl">
                  <CardHeader>
                    <div className="mx-auto bg-gradient-to-br from-emerald-100 to-sky-100 dark:from-emerald-800/50 dark:to-sky-800/50 p-5 rounded-full w-fit mb-5 shadow-inner">
                      {step.icon}
                    </div>
                    <CardTitle className="text-2xl font-semibold text-primary">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-md leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      );
    };

    export default HowItWorksSection;