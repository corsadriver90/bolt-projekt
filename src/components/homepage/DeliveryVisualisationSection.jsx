import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Package, Truck, Home, ArrowRight } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const deliveryOptions = [
      {
        icon: <Package className="h-12 w-12 text-primary mb-4" />,
        title: 'Versand per Post',
        description: 'Ab 10 kg übernehmen wir die Versandkosten für dich. Einfach verpacken und losschicken!',
        link: '/standort#versand',
      },
      {
        icon: <Truck className="h-12 w-12 text-primary mb-4" />,
        title: 'Persönliche Abholung',
        description: 'Bequem bei dir zu Hause. Wir holen deine Schätze im Umkreis von ca. 30 km um Wandlitz ab.',
        link: '/standort#abholung',
      },
      {
        icon: <Home className="h-12 w-12 text-primary mb-4" />,
        title: 'Selbstanlieferung',
        description: 'Bring uns deine Artikel direkt in Klosterfelde vorbei. Flexible Zeiten nach Vereinbarung.',
        link: '/standort#selbstanlieferung',
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
      hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" }}
    };

    const DeliveryVisualisationSection = () => {
      return (
        <motion.section 
          className="py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 text-foreground"
              variants={itemVariants}
            >
              So einfach kommen deine Schätze zu uns
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {deliveryOptions.map((option, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden text-center glassmorphism flex flex-col">
                    <CardHeader>
                      <div className="flex justify-center">{option.icon}</div>
                      <CardTitle className="text-2xl text-foreground">{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-6">{option.description}</p>
                    </CardContent>
                    <div className="p-6 mt-auto">
                       <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary group">
                         <Link to={option.link}>
                           Mehr erfahren <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                         </Link>
                       </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      );
    };

    export default DeliveryVisualisationSection;