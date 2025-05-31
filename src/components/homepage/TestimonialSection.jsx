import React, { useState, useEffect } from 'react';
    import { Card, CardContent } from '@/components/ui/card';
    import { Star } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const allTestimonials = [
      {
        id: 1,
        name: 'Anna M.',
        location: 'Berlin',
        text: 'Super unkompliziert! Ich habe eine riesige Kiste Bücher und DVDs verkauft und war überrascht, wie schnell und fair die Abwicklung war. Endlich wieder Platz im Regal!',
        rating: 5,
        avatarText: 'AM'
      },
      {
        id: 2,
        name: 'Markus S.',
        location: 'Potsdam',
        text: 'Die Abholung hat perfekt geklappt. Nettes Team und das Geld war schnell auf dem Konto. Kein lästiges Einzel-Einscannen, einfach alles in Kisten und weg damit. Kann ich nur empfehlen, besonders für größere Mengen.',
        rating: 5,
        avatarText: 'MS'
      },
      {
        id: 3,
        name: 'Familie K.',
        location: 'Oranienburg',
        text: 'Wir haben altes Lego und Playmobil unserer Kinder verkauft. Der Preis war fair und es ist schön zu wissen, dass die Sachen noch weiter genutzt werden und nicht im Müll landen.',
        rating: 4,
        avatarText: 'FK'
      },
      {
        id: 4,
        name: 'Lisa P.',
        location: 'Bernau',
        text: 'Ich hatte viele alte Konsolenspiele und Schallplatten. Die Buchretter haben alles genommen, sogar die Retro-Sachen. Viel einfacher als auf Flohmärkten oder Kleinanzeigen zu verkaufen!',
        rating: 5,
        avatarText: 'LP'
      },
      {
        id: 5,
        name: 'Tom B.',
        location: 'Eberswalde',
        text: 'Endlich eine Möglichkeit, meine ganze Sammlung an Modellautos auf einmal loszuwerden, ohne jedes einzeln fotografieren zu müssen. Top Service!',
        rating: 5,
        avatarText: 'TB'
      },
       {
        id: 6,
        name: 'Sabine W.',
        location: 'Wandlitz',
        text: 'Sehr freundlicher Kontakt und die Bewertung meiner alten Schallplattensammlung war transparent und fair. Gerne wieder!',
        rating: 5,
        avatarText: 'SW'
      },
      {
        id: 7,
        name: 'Jürgen H.',
        location: 'Berlin-Pankow',
        text: 'Ich bin froh, dass meine alten Fachbücher noch einen Wert hatten. Die Abwicklung über das Online-Formular war einfach und die Abholung pünktlich.',
        rating: 4,
        avatarText: 'JH'
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

    const itemVariants = {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" }},
      exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" }}
    };

    const TestimonialSection = () => {
      const [currentIndex, setCurrentIndex] = useState(0);
      const testimonialsToShow = 3;

      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length);
        }, 7000); 
        return () => clearInterval(interval);
      }, []);

      const displayedTestimonials = [];
      for (let i = 0; i < testimonialsToShow; i++) {
        displayedTestimonials.push(allTestimonials[(currentIndex + i) % allTestimonials.length]);
      }

      return (
        <motion.section 
          className="py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Das sagen unsere Kunden</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[350px] md:min-h-[320px]">
            <AnimatePresence mode="sync">
              {displayedTestimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id} 
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex"
                >
                  <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden glassmorphism flex flex-col">
                    <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-6 leading-relaxed flex-grow">"{testimonial.text}"</p>
                      <div className="flex items-center mt-auto">
                         <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg mr-3">
                           {testimonial.avatarText}
                         </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      );
    };

    export default TestimonialSection;