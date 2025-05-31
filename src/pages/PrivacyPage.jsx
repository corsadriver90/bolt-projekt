import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Link } from 'react-router-dom';

    const PrivacyPage = () => {
      const lastUpdated = "28.05.2025"; 

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto shadow-xl glassmorphism border-t-4 border-primary">
              <CardHeader className="text-center bg-slate-50 dark:bg-slate-800/50 py-8 rounded-t-lg">
                <CardTitle className="text-4xl font-bold text-primary">Datenschutzerklärung</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 prose dark:prose-invert max-w-none text-muted-foreground">
                <p className="text-sm">Stand: {lastUpdated}</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">Verantwortlicher:</h2>
                <p>
                  die-buchretter GbR<br />
                  Inhaber: Andy Prengel & Dirk Prengel<br />
                  Triftstr. 21B, 16348 Wandlitz<br />
                  E-Mail: kontakt@die-buchretter.de<br />
                  Telefon: [Ihre Telefonnummer]
                </p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">1. Allgemeines</h2>
                <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und halten uns strikt an die Regeln der Datenschutzgesetze. Personenbezogene Daten werden auf dieser Webseite nur im technisch notwendigen Umfang erhoben.</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">2. Erhebung und Verarbeitung von Daten</h2>
                <p>Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Vertragsabwicklung erforderlich ist. Dies betrifft insbesondere:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Name</li>
                  <li>Adresse</li>
                  <li>Bankverbindung oder PayPal-Adresse</li>
                </ul>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">3. Zweck der Datenverarbeitung</h2>
                <p>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt ausschließlich zur Abwicklung des Ankaufprozesses.</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">4. Rechtsgrundlage</h2>
                <p>Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">5. Speicherdauer</h2>
                <p>Ihre Daten werden nach Abschluss des Kaufvorgangs und Zahlung für drei Monate gespeichert und anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">6. Weitergabe von Daten</h2>
                <p>Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nicht, es sei denn, dies ist zur Vertragsabwicklung erforderlich oder gesetzlich vorgeschrieben.</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">7. Ihre Rechte</h2>
                <p>Sie haben das Recht auf:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Auskunft über Ihre gespeicherten Daten</li>
                  <li>Berichtigung unrichtiger Daten</li>
                  <li>Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten bestehen</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Widerspruch gegen die Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                </ul>
                <p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: kontakt@die-buchretter.de</p>

                <h2 className="text-2xl font-semibold text-foreground border-b pb-2">8. Beschwerderecht</h2>
                <p>Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten nicht rechtmäßig erfolgt.</p>
                
                {/* Existing detailed sections from previous version, if they should be kept, can be merged here. 
                    For now, strictly using the user provided text.
                    If the user wants to merge with existing detailed sections, they need to specify.
                */}

              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default PrivacyPage;