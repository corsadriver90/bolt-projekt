import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { ArrowRight, Sparkles } from 'lucide-react';
    import { motion } from 'framer-motion';
    import ImageSlider from '@/components/homepage/ImageSlider';

    const heroSectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };

    const HeroSection = () => {
      const sliderImages = [
        { srcUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/a246d51a-92e3-46ad-93fe-e6e65b520ac8/57472e86e82ae9c92c286e5b2d2f005d.png", alt: "Bücherstapel mit Controller und Geld, bereit zum Verkauf", title: "Deine Schätze verdienen ein neues Zuhause!", description: "Verwandle gebrauchte Bücher, Spiele & mehr einfach in Geld. Schnell, fair & stressfrei." },
        { srcUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/a246d51a-92e3-46ad-93fe-e6e65b520ac8/41638a06735ec237f412e5ea13c52e99.jpg", alt: "Offenes Buch in Bibliothek", title: "Platz schaffen leicht gemacht!", description: "Kein mühsames Einzelverkaufen. Wir nehmen alles auf einmal – du erhältst sofort dein Geld." },
        { srcUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/a246d51a-92e3-46ad-93fe-e6e65b520ac8/71c798cd61285c06ef5d433ddd699831.jpg", alt: "Schallplattensammlung", title: "Mehr als nur Bücher!", description: "Von CDs über Konsolenspiele bis zu Modellautos – entdecke, was wir alles ankaufen." },
        { srcUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/a246d51a-92e3-46ad-93fe-e6e65b520ac8/8ed5ee1d1e9c685c1d604e29704f11cc.jpg", alt: "Nachhaltig handeln, fair profitieren", title: "Nachhaltig handeln, fair profitieren.", description: "Gib deinen Artikeln eine zweite Chance und tu gleichzeitig etwas Gutes für deinen Geldbeutel." }
      ];

      return (
        <motion.section 
          className="text-center pt-10 md:pt-12 pb-10 md:pb-20 bg-gradient-to-br from-emerald-50 via-green-50 to-sky-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-sky-900/30 rounded-b-3xl md:rounded-b-[50px] shadow-2xl overflow-hidden"
          variants={heroSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div 
              className="mb-8 md:mb-10"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <ImageSlider images={sliderImages} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mb-10"
            >
              <Button 
                asChild 
                size="xl" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl transform hover:scale-105 transition-transform duration-300 ease-out px-10 py-7 text-lg font-semibold rounded-full group"
              >
                <Link to="/rechner">
                  <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                  Jetzt schnell & einfach verkaufen – Ankaufspreis sofort berechnen!
                </Link>
              </Button>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500">Die Buchretter</span>
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground mb-10 font-medium max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Wir kaufen deine gebrauchten Schätze – einfach nach Gewicht. Mehr als nur Bücher!
            </motion.p>
            
          </div>
        </motion.section>
      );
    };

    export default HeroSection;