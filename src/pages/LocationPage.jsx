import React from 'react';
    import { MapPin, Car, Package, Info, Home } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';

    const LocationPage = () => {
      const address = "Triftstr. 21B, 16348 Wandlitz OT Klosterfelde";
      // Korrekte Koordinaten für Triftstr. 21B, 16348 Wandlitz OT Klosterfelde
      const lat = 52.79001; 
      const lon = 13.46005; 
      const zoomLevel = 17; 
      
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.002},${lat-0.001},${lon+0.002},${lat+0.001}&layer=mapnik&marker=${lat},${lon}`;

      const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" }
        }
      };

      const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i) => ({
          opacity: 1,
          scale: 1,
          transition: {
            delay: i * 0.15,
            duration: 0.5,
            ease: "easeOut"
          }
        })
      };

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <MapPin className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Unser Standort & Abholservice</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hier findest du Informationen zu unserer Ankaufstation in Klosterfelde und unserem Abholbereich.
            </p>
          </motion.div>

          <motion.section 
            className="mb-16"
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card className="shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 p-6">
                <CardTitle className="text-3xl font-semibold text-primary flex items-center">
                  <MapPin className="h-8 w-8 mr-3" /> Ankaufstation Klosterfelde
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground mb-4">
                  Du kannst deine Artikel direkt bei uns abgeben:
                  <br />
                  <strong className="text-foreground">{address}</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Bitte vereinbare vorab einen Termin über unser <Link to="/kontakt?subject=Terminvereinbarung%20Selbstanlieferung" className="text-primary underline hover:text-primary/80">Kontaktformular</Link> oder telefonisch, damit wir uns Zeit für dich nehmen können.
                </p>
                <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md border">
                  <iframe
                    width="100%"
                    height="450"
                    loading="lazy"
                    allowFullScreen={false} 
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapUrl}
                    title="Kartenansicht unseres Standorts"
                    className="border-0"
                    style={{ pointerEvents: 'none' }} 
                  ></iframe>
                   <div 
                    className="absolute top-0 left-0 w-full h-full" 
                    onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoomLevel}/${lat}/${lon}`, '_blank')}
                    style={{ cursor: 'pointer' }}
                    aria-label="Klicken, um die Karte in OpenStreetMap zu öffnen"
                    role="button"
                  ></div>
                </div>
                 <p className="text-xs text-muted-foreground mt-2 text-center">Klicken Sie auf die Karte, um sie in OpenStreetMap zu öffnen und zu interagieren.</p>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Abgabe- & Versandoptionen</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div custom={0} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 p-4 rounded-full w-fit mb-4">
                      <Home className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Selbstanlieferung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Bring deine Artikel nach Terminabsprache direkt zu unserer Station in Klosterfelde. Schnell, einfach und persönlich.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={1} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                   <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg shadow-md">
                    Beliebt
                  </div>
                  <CardHeader>
                    <div className="mx-auto bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-800/50 dark:to-blue-800/50 p-4 rounded-full w-fit mb-4">
                     <Car className="h-10 w-10 text-sky-600 dark:text-sky-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-sky-700 dark:text-sky-300">Persönliche Abholung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Im Umkreis von ca. <strong>30 km um Klosterfelde</strong> (z.B. Bernau, Oranienburg, Teile von Berlin-Nord) holen wir größere Mengen (ab 15kg) nach Absprache gerne persönlich bei dir ab.
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <Info className="inline h-4 w-4 mr-1" /> Der genaue Abholradius wird bei der Terminanfrage im <Link to="/ankaufsformular" className="underline font-semibold">Ankaufsformular</Link> geprüft.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={2} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-800/50 dark:to-amber-800/50 p-4 rounded-full w-fit mb-4">
                      <Package className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-orange-700 dark:text-orange-300">Versand per Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Wohnst du weiter weg? Kein Problem! Sende uns deine Artikel einfach per Post zu. Ab 10kg Gesamtgewicht ist der Versand für dich kostenlos (wir senden dir ein Versandlabel).
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        </div>
      );
    };

    export default LocationPage;