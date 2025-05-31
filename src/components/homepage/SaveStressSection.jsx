import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Zap, ShieldCheck, Smile } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const features = [
      {
        icon: <Zap className="h-10 w-10 text-primary mb-4" />,
        title: 'Blitzschnell alles loswerden',
        description: 'Kein ewiges Warten auf Käufer, keine unzähligen Nachrichten. Einmal alles einpacken, Preis erhalten, fertig!',
      },
      {
        icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
        title: 'Sicher & Zuverlässig',
        description: 'Vermeide unsichere Treffen und Betrugsversuche. Wir sind ein etabliertes Unternehmen und garantieren eine faire Abwicklung.',
      },
      {
        icon: <Smile className="h-10 w-10 text-primary mb-4" />,
        title: 'Mehr Zeit für dich',
        description: 'Statt Stunden mit Fotografieren, Beschreiben und Verhandeln zu verbringen, genieße deine Freizeit. Wir übernehmen den Rest.',
      },
    ];

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }}
    };

    const SaveStressSection = () => {
      return (
        <motion.section 
          className="py-16 bg-slate-50 dark:bg-slate-800/30"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl font-bold text-center mb-4 text-foreground"
              variants={itemVariants}
            >
              Spar dir den Stress beim Einzelverkauf!
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Warum mühsam Einzelteile auf Plattformen wie eBay Kleinanzeigen verkaufen, wenn es auch einfach geht? Mit uns wirst du alles auf einmal los – schnell, sicher und fair.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden text-center glassmorphism">
                    <CardHeader>
                      <div className="flex justify-center">{feature.icon}</div>
                      <CardTitle className="text-2xl text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="text-center mt-12"
              variants={itemVariants}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white shadow-lg transform hover:scale-105 transition-transform duration-300 px-8 py-6 text-lg">
                <Link to="/rechner">
                  Jetzt Vorteile entdecken & Preis berechnen
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      );
    };

    export default SaveStressSection;