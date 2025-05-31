import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const TermsPage = () => {
      const agbStand = "28.05.2025";

      const renderParagraph = (text) => {
        return text.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      };

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto shadow-xl bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-primary">Allgemeine Geschäftsbedingungen (AGB)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                
                <p className="font-semibold">Hinweis gemäß § 36 VSBG:</p>
                <p>Wir nehmen nicht an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.</p>

                <h2 id="geltungsbereich" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 1 Geltungsbereich</h2>
                <p>(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten ausschließlich für den Ankauf von Waren durch die<br />
                die-buchretter GbR, Inhaber Andy Prengel & Dirk Prengel,<br />
                Triftstr. 21B, 16348 Wandlitz<br />
                über das Online-Ankaufsportal www.die-buchretter.de.</p>
                <p>(2) Unsere AGB gelten ausschließlich; entgegenstehende oder abweichende Bedingungen des Kunden erkennen wir nicht an.</p>

                <h2 id="ankaufsvoraussetzungen" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 2 Allgemeine Ankaufsvoraussetzungen</h2>
                <p>(1) Berechtigt zur Nutzung unseres Ankaufservices sind unbeschränkt geschäftsfähige natürliche Personen mit Wohnsitz in Deutschland.</p>
                <p>(2) Wir kaufen folgende Warengruppen zum Kilopreis an:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Bücher</li>
                  <li>CDs, DVDs, MC-Kassetten, VHS-Kassetten, Schallplatten</li>
                  <li>Modellautos, Lego, Playmobil, Spielzeug u. Ä.</li>
                </ul>
                <p>(3) Das Angebot erfolgt als Kilopakete (max. 31,5 kg pro Paket). Die zum Kilopreis aktuell veröffentlichten Werte auf unserer Website www.die-buchretter.de sind verbindlich.</p>

                <h2 id="angebot-vertragsschluss" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 3 Angebot und Vertragsschluss</h2>
                <p>(1) Der Kunde gibt sein verbindliches Ankaufangebot ab, indem er die Ware an unser Lager übersendet bzw. persönlich anliefert.</p>
                <p>(2) Der Vertrag kommt zustande, wenn die Sendung bei uns eingegangen und vom Paketdienst als „zugestellt“ im System vermerkt oder – bei persönlicher Abgabe – von uns quittiert wurde.</p>

                <h2 id="preisermittlung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 4 Preisermittlung</h2>
                <p>(1) Die zugrunde liegenden Kilopreise sind jederzeit auf www.die-buchretter.de abrufbar und gelten in der zum Zeitpunkt des Vertragsschlusses veröffentlichten Fassung.</p>
                <p>(2) Etwaige Staffelpreise oder spezielle Aktionspreise werden auf der Website ausgewiesen und sind dann maßgeblich.</p>

                <h2 id="versandkosten-lieferung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 5 Versandkosten und Lieferung</h2>
                <p>(1) Ab einem Warengewicht von 10 kg stellen wir ein kostenfreies DHL-Versandlabel zur Verfügung und übernehmen die Versandkosten.</p>
                <p>(2) Liegt das Gewicht unter 10 kg oder möchte der Kunde selbst versenden, trägt er die Versandkosten und kann ein eigenes Versandunternehmen wählen.</p>
                <p>(3) Maximal zulässiges Gewicht pro Paket: 31,5 kg.</p>

                <h2 id="pruefung-gegenangebot-ruecksendung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 6 Prüfung, Gegenangebot und Rücksendung</h2>
                <p>(1) Nach Wareneingang prüfen wir die gelieferten Artikel auf Übereinstimmung von Menge, Barcodes/EAN und Zustand.</p>
                <p>(2) Stimmen die gelieferten Artikel nicht mit dem Angebot überein, unterbreiten wir ein angepasstes Gegenangebot und informieren den Kunden per E-Mail.</p>
                <p>(3) Der Kunde kann das Gegenangebot innerhalb von 30 Tagen annehmen oder ablehnen. Nimmt er nicht fristgerecht Stellung, gilt das Gegenangebot als angenommen.</p>
                <p>(4) Lehnt der Kunde das Gegenangebot ab, trägt er die Rücksendekosten in Höhe von 6,99 € pro Paket; wir senden die Ware dann zurück.</p>

                <h2 id="zahlung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 7 Zahlung</h2>
                <p>(1) Wir zahlen den vereinbarten Ankaufpreis innerhalb von drei Werktagen nach Lagerzugang.</p>
                <p>(2) Zahlungsarten: PayPal, Überweisung oder bei persönlicher Abgabe Barzahlung bis 100 €. Beträge über 100 € werden per Überweisung oder PayPal ausgezahlt.</p>
                <p>(3) Für die Zahlung entstehen keine Zusatzgebühren.</p>

                <h2 id="datenspeicherung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 8 Datenspeicherung</h2>
                <p>(1) Wir speichern Name, Adresse sowie Bank- und/oder PayPal-Verbindungsdaten ausschließlich für die Abwicklung des Ankaufprozesses.</p>
                <p>(2) Nach Abschluss des Kaufvorgangs und Zahlung werden alle Daten nach drei Monaten gelöscht.</p>
                <p>(3) Unsere vollständige Datenschutzerklärung finden Sie unter: <a href="https://die-buchretter.de/datenschutz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://die-buchretter.de/datenschutz</a></p>

                <h2 id="haftung-gewaehrleistung" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 9 Haftung und Gewährleistung</h2>
                <p>(1) Da wir als Käufer auftreten, schließen wir jegliche Gewährleistung für die angebotene Ware aus.</p>
                <p>(2) Unsere Haftung für leicht fahrlässige Pflichtverletzungen ist – soweit gesetzlich zulässig – ausgeschlossen.</p>

                <h2 id="schlussbestimmungen" className="text-xl font-semibold pt-4 text-slate-800 dark:text-slate-200">§ 10 Anwendbares Recht, Vertragssprache, Salvatorische Klausel</h2>
                <p>(1) Es gilt ausschließlich deutsches Recht unter Ausschluss des UN-Kaufrechts.</p>
                <p>(2) Vertragssprache ist Deutsch.</p>
                <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>

                <p className="mt-8 font-semibold">Stand: {agbStand}</p>
                
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default TermsPage;