import React from 'react';
    import {
      Accordion,
      AccordionContent,
      AccordionItem,
      AccordionTrigger,
    } from "@/components/ui/accordion";
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';

    const faqs = [
      {
        question: "Wie funktioniert die Preisberechnung?",
        answer: "Wir berechnen den Preis basierend auf dem Gewicht deiner Artikel und der jeweiligen Kategorie. Die aktuellen Kilopreise findest du direkt in unserem Ankaufsrechner. Für 'Sonstige' Artikel oder sehr spezielle Sammlungen machen wir dir ein individuelles Angebot."
      },
      {
        question: "Was passiert, wenn Artikel nicht den Annahmekriterien entsprechen?",
        answer: "Sollten einzelne Artikel stark von unseren Annahmekriterien abweichen (z.B. stark verschimmelt, extreme Geruchsbelästigung), können wir diese leider nicht vergüten. Wir informieren dich in so einem Fall. Unser Ziel ist es aber, so viel wie möglich anzunehmen und einer Wiederverwendung zuzuführen. Details findest du auf unserer Seite 'Was wir annehmen'."
      },
      {
        question: "Wie lange dauert die Auszahlung?",
        answer: "Bei Selbstanlieferung ist oft eine direkte Barauszahlung möglich. Bei Versand oder Abholung erfolgt die Auszahlung per Überweisung oder PayPal in der Regel innerhalb von 3-5 Werktagen nach Eingang und Prüfung deiner Artikel."
      },
      {
        question: "Muss ich die Artikel vor dem Verkauf reinigen?",
        answer: "Die Artikel sollten in einem sauberen und akzeptablen Zustand sein. Eine Grundreinigung (z.B. Staub entfernen) ist wünschenswert. Stark verschmutzte Artikel können wir leider nicht annehmen."
      },
      {
        question: "Kann ich auch sehr große Mengen verkaufen (z.B. aus Haushaltsauflösung)?",
        answer: "Ja, absolut! Wir sind auch auf den Ankauf von großen Mengen von Händlern, Verlagen, Bibliotheken oder Haushaltsauflösern spezialisiert. Kontaktiere uns einfach über das Formular für Gewerbekunden für ein individuelles Angebot und eine mögliche Abholung."
      },
      {
        question: "Was ist, wenn ich mehr als 4 Versandlabels benötige?",
        answer: "Im Ankaufsformular kannst du bis zu 4 kostenlose DHL-Versandlabels (bis 31,5 kg pro Paket) auswählen. Solltest du mehr benötigen, wähle bitte die Option 'Mehr als 4? Bitte gesondert anfragen.' und wir kontaktieren dich, um eine Lösung zu finden."
      },
      {
        question: "Gibt es ein Mindestgewicht für den kostenlosen Versand oder die Abholung?",
        answer: "Ja, für den kostenlosen Versand per DHL benötigen wir ein Mindestgesamtgewicht von 10 kg. Für eine kostenlose Abholung im Umkreis von ca. 30 km um Klosterfelde (PLZ 16348) ist ein Mindestgewicht von 15 kg erforderlich."
      },
      {
        question: "Welche Artikel kann ich genau verkaufen?",
        answer: <span>Eine detaillierte Liste aller Artikelkategorien, die wir annehmen, sowie Beispiele und Ausschlusskriterien findest du auf unserer Seite <Link to="/was-wir-annehmen" className="text-primary underline hover:text-primary/80">Was wir annehmen</Link>.</span>
      },
      {
        question: "Wie verpacke ich meine Artikel am besten für den Versand?",
        answer: "Verwende stabile Kartons, die das Gewicht deiner Artikel tragen können. Fülle Leerräume gut aus, um ein Verrutschen zu verhindern. Achte darauf, dass die Kartons gut verschlossen sind. Lege den ausgedruckten Begleitschein deiner Sendung bei."
      },
      {
        question: "Was passiert mit meinen Daten?",
        answer: <span>Deine Daten werden streng vertraulich behandelt und nur zur Abwicklung des Ankaufs verwendet. Weitere Informationen findest du in unserer <Link to="/datenschutz" className="text-primary underline hover:text-primary/80">Datenschutzerklärung</Link>.</span>
      }
    ];

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };
    
    const FaqSection = () => {
      return (
        <motion.section 
          className="py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Häufig gestellte Fragen (FAQ)</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md px-6 py-2 border-l-4 border-primary">
                    <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline text-foreground data-[state=open]:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.section>
      );
    };

    export default FaqSection;