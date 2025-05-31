import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Briefcase, PackageCheck, Package, Warehouse, Laptop, CalendarDays, DollarSign, GraduationCap, School, Users } from 'lucide-react';
    import { motion } from 'framer-motion';
    import ApplicationModal from '@/components/career/ApplicationModal';

    const initialJobOpenings = [
      {
        id: "wareneingang_vz_tz",
        title: "Mitarbeiter Wareneingangsprüfung (m/w/d)",
        type: "Vollzeit / Teilzeit",
        icon: <PackageCheck className="h-10 w-10 text-primary mb-4" />,
        description: "Als wichtiger Teil unseres Teams sind Sie für die sorgfältige Prüfung und Erfassung aller eingehenden Waren zuständig. Sie stellen sicher, dass die Qualität und Quantität der Lieferungen unseren Standards entspricht und dokumentieren alles lückenlos in unserem System.",
        responsibilities: [
          "Annahme und Kontrolle von Warenlieferungen",
          "Prüfung auf Vollständigkeit, Qualität und Beschädigungen",
          "Erfassung der Artikel im Warenwirtschaftssystem",
          "Vorbereitung der Waren für die Einlagerung",
          "Enge Zusammenarbeit mit dem Lagerteam"
        ],
        qualifications: [
          "Erste Erfahrung im Bereich Lagerlogistik oder Wareneingang von Vorteil",
          "Sorgfältige und genaue Arbeitsweise",
          "Grundlegende PC-Kenntnisse",
          "Teamfähigkeit und Zuverlässigkeit",
          "Gute Deutschkenntnisse in Wort und Schrift"
        ]
      },
      {
        id: "versand_lager_vz_tz",
        title: "Mitarbeiter Versand / Lager (m/w/d)",
        type: "Vollzeit / Teilzeit",
        icon: <Package className="h-10 w-10 text-primary mb-4" />,
        description: "Sie sorgen dafür, dass unsere Schätze sicher und pünktlich bei ihren neuen Besitzern ankommen und unterstützen im gesamten Lagerbereich. Ihre Aufgaben umfassen das Kommissionieren, Verpacken, Frankieren von Sendungen sowie allgemeine Lagertätigkeiten.",
        responsibilities: [
          "Kommissionierung der bestellten Artikel",
          "Sachgerechtes Verpacken der Waren",
          "Erstellung von Versandetiketten und Lieferscheinen",
          "Übergabe der Pakete an Versanddienstleister",
          "Bearbeitung von Retouren",
          "Ein- und Auslagerung von Waren",
          "Bestandsführung und -kontrolle"
        ],
        qualifications: [
          "Erfahrung im Versand oder in der Logistik wünschenswert",
          "Gewissenhafte und zügige Arbeitsweise",
          "Körperliche Belastbarkeit",
          "Teamgeist und Flexibilität",
          "Gute Deutschkenntnisse"
        ]
      },
      {
        id: "lager_minijob",
        title: "Lagermitarbeiter (m/w/d)",
        type: "Minijob",
        icon: <Warehouse className="h-10 w-10 text-primary mb-4" />,
        description: "Auf Minijob-Basis unterstützen Sie unser Lagerteam bei alltäglichen Aufgaben, wie der Warenverräumung, Ordnungshaltung und Vorbereitung von Artikeln für den Versand.",
        responsibilities: [
          "Ein- und Auslagerung von Waren nach Anweisung",
          "Unterstützung bei der Aufrechterhaltung von Ordnung und Sauberkeit im Lager",
          "Mithilfe bei Inventurarbeiten nach Bedarf",
          "Vorbereitung von Verpackungsmaterialien"
        ],
        qualifications: [
          "Erste Erfahrung im Lagerbereich von Vorteil, aber nicht zwingend",
          "Sinn für Ordnung und Zuverlässigkeit",
          "Bereitschaft zur körperlichen Arbeit im Rahmen eines Minijobs",
          "Teamfähigkeit und Engagement"
        ]
      },
      {
        id: "buero_vz_tz",
        title: "Bürokraft / Kaufmännischer Mitarbeiter (m/w/d)",
        type: "Vollzeit / Teilzeit",
        icon: <Laptop className="h-10 w-10 text-primary mb-4" />,
        description: "Als Organisationstalent unterstützen Sie unser Team bei allen anfallenden administrativen und kaufmännischen Aufgaben. Sie sind die erste Anlaufstelle für Kundenanfragen und sorgen für einen reibungslosen Büroalltag.",
        responsibilities: [
          "Bearbeitung von Kundenanfragen per Telefon und E-Mail",
          "Auftragsabwicklung und Rechnungserstellung",
          "Datenpflege und Dokumentenmanagement",
          "Allgemeine Büroorganisation und administrative Tätigkeiten",
          "Unterstützung der Geschäftsführung"
        ],
        qualifications: [
          "Abgeschlossene kaufmännische Ausbildung oder vergleichbare Qualifikation",
          "Sehr gute MS-Office-Kenntnisse",
          "Ausgeprägte Kommunikationsfähigkeit und Kundenorientierung",
          "Organisationsgeschick und selbstständige Arbeitsweise",
          "Sehr gute Deutschkenntnisse in Wort und Schrift"
        ]
      },
      {
        id: "customer_service_vz_tz",
        title: "Customer Service Mitarbeiter (m/w/d)",
        type: "Vollzeit / Teilzeit",
        icon: <Users className="h-10 w-10 text-primary mb-4" />,
        description: "Sie sind die Stimme unseres Unternehmens und erster Ansprechpartner für unsere Kunden. Mit Freundlichkeit und Kompetenz bearbeiten Sie Anfragen, lösen Probleme und sorgen für eine hohe Kundenzufriedenheit.",
        responsibilities: [
          "Professionelle Beantwortung von Kundenanfragen via E-Mail, Telefon und ggf. Chat",
          "Beratung zu unseren Dienstleistungen und Ankaufsprozessen",
          "Bearbeitung von Reklamationen und Finden kundenorientierter Lösungen",
          "Dokumentation von Kundeninteraktionen im CRM-System",
          "Enge Zusammenarbeit mit anderen Abteilungen zur Klärung von Anliegen"
        ],
        qualifications: [
          "Erfahrung im Kundenservice oder einer vergleichbaren Position",
          "Ausgezeichnete Kommunikationsfähigkeiten in Wort und Schrift (Deutsch)",
          "Hohe Kunden- und Serviceorientierung",
          "Geduld, Empathie und Problemlösungskompetenz",
          "Sicherer Umgang mit gängigen PC-Anwendungen"
        ]
      },
      {
        id: "ferienjob_lager_versand",
        title: "Ferienjob im Lager & Versand (m/w/d)",
        type: "Ferienjob",
        icon: <CalendarDays className="h-10 w-10 text-primary mb-4" />,
        description: "Unterstütze unser Team während der Ferienzeit! Du hilfst bei allgemeinen Lagerarbeiten, beim Verpacken von Bestellungen und sorgst mit dafür, dass alles rund läuft. Ideal für Schüler und Studenten, die Praxiserfahrung sammeln möchten.",
        responsibilities: [
          "Mithilfe bei der Warenannahme und -kontrolle",
          "Unterstützung beim Kommissionieren und Verpacken",
          "Allgemeine Lagertätigkeiten und Aufrechterhaltung der Ordnung",
          "Einfache Dateneingaben"
        ],
        qualifications: [
          "Mindestalter 16 Jahre",
          "Motivation und Engagement",
          "Teamfähigkeit und Zuverlässigkeit",
          "Bereitschaft, Neues zu lernen",
          "Gute Deutschkenntnisse"
        ]
      },
      {
        id: "minijob_buero_lager",
        title: "Minijob: Unterstützung im Büro & Lager (m/w/d)",
        type: "Minijob",
        icon: <DollarSign className="h-10 w-10 text-primary mb-4" />,
        description: "Wir suchen flexible Unterstützung auf Minijob-Basis für unser Büro und Lager. Deine Aufgaben sind vielfältig und reichen von administrativen Tätigkeiten bis zur Mithilfe bei der Warenverarbeitung.",
        responsibilities: [
          "Unterstützung bei der Büroorganisation",
          "Dateneingabe und -pflege",
          "Mithilfe bei leichten Lagertätigkeiten",
          "Vorbereitung von Versandmaterialien"
        ],
        qualifications: [
          "Sorgfältige und strukturierte Arbeitsweise",
          "Grundlegende PC-Kenntnisse",
          "Flexibilität hinsichtlich der Arbeitszeiten (nach Absprache)",
          "Zuverlässigkeit und Teamgeist",
          "Gute Deutschkenntnisse"
        ]
      },
      {
        id: "praktikum_logistik_ecommerce",
        title: "Praktikum Lagerlogistik & E-Commerce (m/w/d)",
        type: "Praktikum",
        icon: <GraduationCap className="h-10 w-10 text-primary mb-4" />,
        description: "Sammle wertvolle Praxiserfahrung in einem dynamischen E-Commerce-Umfeld! Du erhältst Einblicke in alle Prozesse von Wareneingang über Lagerhaltung bis zum Versand und kannst aktiv mitarbeiten.",
        responsibilities: [
          "Kennenlernen der logistischen Abläufe",
          "Mitarbeit in verschiedenen Lagerbereichen",
          "Unterstützung bei der Optimierung von Prozessen",
          "Einblicke in das Warenwirtschaftssystem",
          "Projektbezogene Aufgaben nach Absprache"
        ],
        qualifications: [
          "Laufendes Studium oder Ausbildung im Bereich Logistik, BWL oder vergleichbar, oder Schülerpraktikum",
          "Interesse an E-Commerce und Logistikprozessen",
          "Eigeninitiative und Lernbereitschaft",
          "Teamfähigkeit",
          "Gute Deutschkenntnisse"
        ]
      },
       {
        id: "praktikum_orientierung_allround",
        title: "Schülerpraktikum / Orientierungspraktikum (Büro, Lager, Versand) (m/w/d)",
        type: "Praktikum",
        icon: <School className="h-10 w-10 text-primary mb-4" />,
        description: "Du möchtest erste Einblicke in die vielfältige Arbeit eines Online-Handels bekommen? Bei uns lernst du kaufmännische Grundlagen, Kundenkommunikation und die Organisation im Hintergrund kennen, aber auch die Abläufe in Lager und Versand.",
        responsibilities: [
          "Kennenlernen der Büroorganisation und administrativer Aufgaben",
          "Einblick in die Kundenbetreuung und Datenpflege",
          "Mitarbeit bei leichten Lagertätigkeiten (z.B. Warenannahme, Sortierung)",
          "Unterstützung im Versandprozess (z.B. Verpackungsvorbereitung)"
        ],
        qualifications: [
          "Schüler/in (mind. 9. Klasse) oder auf der Suche nach beruflicher Orientierung",
          "Interesse an kaufmännischen und logistischen Tätigkeiten",
          "Zuverlässigkeit, Neugier und Teamgeist",
          "Grundlegende PC-Kenntnisse von Vorteil"
        ]
      }
    ];

    const CareerPage = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedJobTitle, setSelectedJobTitle] = useState('');
      const [selectedJobTypePreset, setSelectedJobTypePreset] = useState('');

      const handleOpenModal = (title, type) => {
        setSelectedJobTitle(title);
        // If type contains multiple options like "Vollzeit / Teilzeit", let user choose in modal
        if (type.includes("/") || type.toLowerCase() === "initiativbewerbung") {
             setSelectedJobTypePreset(""); // No preset, user must choose
        } else {
            setSelectedJobTypePreset(type);
        }
        setIsModalOpen(true);
      };

      return (
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <Briefcase className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500">
              Karriere bei Die Buchretter
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Werden Sie Teil unseres Teams und helfen Sie uns, gebrauchten Schätzen ein neues Leben zu geben. Wir suchen engagierte Talente, die unsere Leidenschaft für Nachhaltigkeit und fairen Handel teilen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {initialJobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary">
                  <CardHeader className="items-center text-center">
                    {job.icon}
                    <CardTitle className="text-2xl font-semibold">{job.title}</CardTitle>
                    <CardDescription className="text-sm text-primary">{job.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="mb-4 text-center text-sm text-muted-foreground">{job.description}</p>
                    
                    <div className="mb-3">
                      <h4 className="font-semibold text-foreground mb-1">Ihre Aufgaben:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.responsibilities.map(resp => <li key={resp}>{resp}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Ihr Profil:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.qualifications.map(qual => <li key={qual}>{qual}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button 
                      onClick={() => handleOpenModal(job.title, job.type)}
                      className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
                      aria-label={`Jetzt für ${job.title} bewerben`}
                    >
                      Jetzt bewerben
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: initialJobOpenings.length * 0.1 + 0.2 }}
            className="mt-16 text-center p-8 bg-gradient-to-r from-emerald-50 via-green-50 to-sky-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-sky-900/30 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-3">Nicht die passende Stelle dabei?</h2>
            <p className="text-muted-foreground mb-6">
              Wir sind immer auf der Suche nach motivierten Menschen. Schicken Sie uns gerne Ihre Initiativbewerbung!
            </p>
            <Button 
              onClick={() => handleOpenModal("Initiativbewerbung", "Initiativbewerbung")} 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Initiativbewerbung senden
            </Button>
          </motion.div>

          <ApplicationModal 
            isOpen={isModalOpen} 
            onOpenChange={setIsModalOpen} 
            jobTitle={selectedJobTitle}
            jobTypePreset={selectedJobTypePreset}
          />
        </div>
      );
    };

    export default CareerPage;