import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { ArrowRight } from 'lucide-react';
    import { motion } from 'framer-motion';

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    };

    const CallToActionSection = () => {
      return (
        <motion.section 
          className="py-20 text-center bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-700 dark:to-sky-700 rounded-3xl shadow-xl"
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Bereit, Platz zu schaffen und Geld zu verdienen?</h2>
            <p className="text-lg text-emerald-100 dark:text-emerald-200 mb-10">
              Starte jetzt und entdecke, wie einfach Verkaufen sein kann. Deine alten Schätze sind bei uns in guten Händen!
            </p>
            <Button asChild size="xl" variant="outline" className="bg-white text-primary hover:bg-gray-100 border-2 border-white hover:border-gray-200 shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out px-10 py-7 text-lg font-semibold rounded-full group">
              <Link to="/rechner">
                Direkt zum Ankaufsrechner <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.section>
      );
    };

    export default CallToActionSection;