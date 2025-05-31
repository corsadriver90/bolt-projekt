import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Briefcase, BookOpen, Users, Layers, Archive, RefreshCw, ShoppingBag } from 'lucide-react';

    const BusinessPage = () => {
      const partners = [
        { icon: <BookOpen className="h-8 w-8 text-primary" />, name: 'Verlage & Buchhandlungen', description: 'Restauflagen, Mängelexemplare, Ladenhüter.' },
        { icon: <Users className="h-8 w-8 text-primary" />, name: 'Bibliotheken & Archive', description: 'Ausgesonderte Bestände, Dubletten.' },
        { icon: <Layers className="h-8 w-8 text-primary" />, name: 'Entrümpler & Haushaltsauflöser', description: 'Komplette Sammlungen, Nachlässe.' },
        { icon: <Archive className="h-8 w-8 text-primary" />, name: 'Universitäten & Institutionen', description: 'Fachliteratur, wissenschaftliche Sammlungen.' },
        { icon: <RefreshCw className="h-8 w-8 text-primary" />, name: 'Retouren-Management', description: 'Ankauf von Retouren und B-Ware im Medienbereich.' },
        { icon: <ShoppingBag className="h-8 w-8 text-primary" />, name: 'Restposten & Überbestände', description: 'Wir kaufen auch größere Mengen an Restposten und Lagerüberhängen.' },
      ];

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

      const itemVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      };

      return (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="container mx-auto px-4 py-12"
        >
          <Card className="shadow-xl glassmorphism border-t-4 border-primary">
            <CardHeader className="text-center bg-slate-50 dark:bg-slate-800/50 py-10 rounded-t-lg">
              <motion.div variants={itemVariants} className="flex justify-center mb-4">
                <Briefcase className="h-16 w-16 text-primary" />
              </motion.div>
              <CardTitle className="text-4xl font-bold text-primary">Ankauf für Gewerbekunden</CardTitle>
              <CardDescription className="text-xl text-muted-foreground mt-2">
                Ihr zuverlässiger Partner für den Ankauf größerer Mengen und Sammlungen.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12 space-y-10">
              <motion.section variants={itemVariants}>
                <h2 className="text-3xl font-semibold text-foreground mb-6 text-center">Wir kaufen von:</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex justify-center mb-3">{partner.icon}</div>
                          <CardTitle className="text-xl text-foreground">{partner.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm">{partner.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                 <p className="text-center text-muted-foreground mt-8 text-lg">
                    Auch von <span className="font-semibold text-foreground">Privatpersonen</span> kaufen wir gerne an – von einzelnen Büchern bis palettenweise!
                  </p>
              </motion.section>

              <motion.section variants={itemVariants} className="text-center">
                <h2 className="text-3xl font-semibold text-foreground mb-6">Ihre Vorteile mit uns:</h2>
                <ul className="space-y-4 text-lg text-muted-foreground max-w-2xl mx-auto list-none md:list-disc md:list-inside">
                  <motion.li variants={itemVariants} className="flex items-center justify-center md:justify-start">
                    <span className="text-primary mr-2 text-2xl">&#10004;</span> Faire und transparente Preisgestaltung, auch für Großmengen.
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-center justify-center md:justify-start">
                    <span className="text-primary mr-2 text-2xl">&#10004;</span> Schnelle und unkomplizierte Abwicklung.
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-center justify-center md:justify-start">
                    <span className="text-primary mr-2 text-2xl">&#10004;</span> Abholung größerer Posten nach Absprache möglich.
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-center justify-center md:justify-start">
                    <span className="text-primary mr-2 text-2xl">&#10004;</span> Nachhaltige Weiterverwertung Ihrer Bestände.
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-center justify-center md:justify-start">
                    <span className="text-primary mr-2 text-2xl">&#10004;</span> Ankauf von einzelnen Artikeln bis zu Palettenware.
                  </motion.li>
                </ul>
              </motion.section>

              <motion.section variants={itemVariants} className="text-center pt-8">
                <h2 className="text-3xl font-semibold text-foreground mb-4">Interesse geweckt?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Kontaktieren Sie uns für ein individuelles Angebot oder nutzen Sie unseren Ankaufsrechner für eine erste Einschätzung.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white shadow-lg px-8 py-6 text-lg">
                    <Link to="/kontakt?form=gewerbe">Direkt Kontakt aufnehmen</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg">
                    <Link to="/rechner">Zum Ankaufsrechner</Link>
                  </Button>
                </div>
              </motion.section>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default BusinessPage;