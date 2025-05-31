import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { Mail, Phone, MapPin, Globe, UserCheck } from 'lucide-react';

    const ImpressumPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12"
        >
          <Card className="max-w-3xl mx-auto shadow-xl glassmorphism border-t-4 border-primary">
            <CardHeader className="text-center bg-slate-50 dark:bg-slate-800/50 py-8 rounded-t-lg">
              <CardTitle className="text-4xl font-bold text-primary">Impressum</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8 text-lg text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Angaben gemäß § 5 TMG:</h2>
                <p className="font-semibold text-xl text-foreground">die-buchretter GbR</p>
                <p>Inhaber: Andy Prengel & Dirk Prengel</p>
                <div className="flex items-center mt-2">
                  <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span>Triftstr. 21B</span>
                </div>
                <div className="flex items-center mt-1 ml-8">
                   <span>16348 Wandlitz</span>
                </div>
                 <div className="flex items-center mt-1 ml-8">
                   <span>Deutschland</span>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Kontakt:</h2>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span>Telefon: [Ihre Telefonnummer]</span>
                </div>
                <div className="flex items-center mt-2">
                  <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span>E-Mail: kontakt@die-buchretter.de</span>
                </div>
                <div className="flex items-center mt-2">
                  <Globe className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span>Website: www.die-buchretter.de</span>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Umsatzsteuer-ID:</h2>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                <p>[Ihre USt-ID, falls vorhanden]</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
                 <p>Andy Prengel & Dirk Prengel</p>
                <div className="flex items-center mt-1">
                    <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                    <span>Triftstr. 21B</span>
                </div>
                <div className="flex items-center mt-1 ml-8">
                   <span>16348 Wandlitz</span>
                </div>
              </section>

              {/* Optional: Streitschlichtung, Haftungsausschluss, Urheberrecht sections can be added here if needed, 
                  similar to the previous version of ImpressumPage.jsx. 
                  For now, strictly using the user provided text.
              */}
               <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Streitschlichtung</h2>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr
                  </a>.
                </p>
                <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ImpressumPage;