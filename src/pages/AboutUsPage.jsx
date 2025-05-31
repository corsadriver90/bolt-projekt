import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, BookOpen, Recycle, HeartHandshake, Target, Eye, Sparkles } from 'lucide-react';

    const AboutUsPage = () => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 100 }
        }
      };

      return (
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants}>
              <Users className="mx-auto h-16 w-16 text-primary mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500">
                Über Die Buchretter
              </h1>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Wir sind mehr als nur ein Ankaufsportal. Wir sind eine Gemeinschaft von Bücherfreunden, Nachhaltigkeits-Enthusiasten und Menschen, die an die Kraft der Wiederverwendung glauben. Erfahren Sie mehr über unsere Geschichte, unsere Werte und was uns antreibt.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <img 
                className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-video"
                alt="Das Team von Die Buchretter bei der Arbeit im Lager"
               src="https://images.unsplash.com/photo-1655758196097-2b6425fa520d" />
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Unsere Geschichte: Von der Idee zur Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Die Buchretter GbR wurde aus einer einfachen Beobachtung geboren: Viele wertvolle Bücher, Medien und Sammlerstücke verstauben ungenutzt in Regalen oder landen im Müll, obwohl sie anderen noch Freude bereiten könnten. Gleichzeitig ist der Einzelverkauf oft mühsam und zeitaufwendig.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unsere Gründer, selbst leidenschaftliche Sammler und Leser, sahen hier eine Chance, etwas Positives zu bewirken. So entstand die Idee, einen unkomplizierten und fairen Ankaufsservice zu schaffen, der es jedem leicht macht, gebrauchten Artikeln ein zweites Leben zu schenken – und dabei auch noch den eigenen Geldbeutel zu schonen. Seit unserer Gründung in Wandlitz OT Klosterfelde haben wir es uns zur Aufgabe gemacht, den Prozess des Verkaufens so einfach und transparent wie möglich zu gestalten.
              </p>
            </motion.div>
          </motion.div>

          <motion.section variants={containerVariants} className="mb-16">
            <h2 className="text-3xl font-semibold text-foreground text-center mb-10">Was uns antreibt: Unsere Werte</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Recycle className="h-10 w-10 text-emerald-500" />, title: "Nachhaltigkeit", description: "Wir fördern aktiv die Kreislaufwirtschaft, indem wir gebrauchten Artikeln eine neue Chance geben und so Ressourcen schonen." },
                { icon: <HeartHandshake className="h-10 w-10 text-rose-500" />, title: "Fairness & Transparenz", description: "Klare Ankaufskriterien und eine nachvollziehbare Preisgestaltung sind für uns selbstverständlich. Wir möchten, dass Sie sich bei uns gut aufgehoben fühlen." },
                { icon: <BookOpen className="h-10 w-10 text-sky-500" />, title: "Liebe zum Detail", description: "Jedes Buch, jede CD, jedes Spiel hat eine Geschichte. Wir schätzen den Wert dieser Artikel und behandeln sie mit Sorgfalt." },
                { icon: <Sparkles className="h-10 w-10 text-amber-500" />, title: "Einfachheit", description: "Der Verkaufsprozess soll für Sie so unkompliziert wie möglich sein – vom ersten Klick bis zur Auszahlung." },
                { icon: <Users className="h-10 w-10 text-indigo-500" />, title: "Gemeinschaft", description: "Wir sehen uns als Teil einer Gemeinschaft, die den Wert von Gebrauchtem erkennt und einen Beitrag zu einer bewussteren Konsumkultur leistet." },
                { icon: <Target className="h-10 w-10 text-teal-500" />, title: "Zuverlässigkeit", description: "Sie können sich auf uns verlassen. Wir halten unsere Versprechen und stehen Ihnen bei Fragen jederzeit zur Verfügung." }
              ].map(value => (
                <motion.div variants={itemVariants} key={value.title} className="p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-primary/10 transition-shadow">
                  <div className="flex items-center justify-center mb-4 bg-primary/10 rounded-full h-16 w-16 mx-auto">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 text-center">{value.title}</h3>
                  <p className="text-muted-foreground text-sm text-center">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={containerVariants} className="bg-gradient-to-br from-emerald-50 via-green-50 to-sky-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-sky-900/30 p-8 md:p-12 rounded-xl shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div variants={itemVariants} className="space-y-4">
                <Eye className="h-12 w-12 text-primary mb-3" />
                <h2 className="text-3xl font-semibold text-foreground">Unsere Vision für die Zukunft</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Wir möchten die erste Anlaufstelle für alle werden, die unkompliziert und fair gebrauchte Bücher, Medien und Sammlerstücke verkaufen möchten. Unsere Vision ist eine Welt, in der Wiederverwendung selbstverständlich ist und wertvolle Ressourcen geschont werden.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Dafür arbeiten wir kontinuierlich an der Verbesserung unserer Prozesse, erweitern unser Ankaufsportfolio und suchen nach neuen Wegen, um Nachhaltigkeit und Kundenzufriedenheit zu verbinden. Wir freuen uns darauf, diesen Weg gemeinsam mit Ihnen zu gehen!
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <img 
                  className="rounded-xl shadow-lg w-full h-auto object-cover aspect-square"
                  alt="Symbolbild für eine grüne Zukunft mit recycelten Büchern"
                 src="https://images.unsplash.com/photo-1683723258154-95ff25452a3f" />
              </motion.div>
            </div>
          </motion.section>

          <motion.div 
            variants={itemVariants} 
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-4">Haben Sie Fragen oder möchten Sie uns kennenlernen?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Zögern Sie nicht, uns zu <a href="/kontakt" className="text-primary hover:underline font-medium">kontaktieren</a>. Wir freuen uns auf Ihre Nachricht!
            </p>
          </motion.div>
        </div>
      );
    };

    export default AboutUsPage;