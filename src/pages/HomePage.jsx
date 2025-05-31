import React from 'react';
    import { motion } from 'framer-motion';
    import HeroSection from '@/components/homepage/HeroSection';
    import HowItWorksSection from '@/components/homepage/HowItWorksSection';
    import AdvantagesSection from '@/components/homepage/AdvantagesSection';
    import AcceptedItemsPreviewSection from '@/components/homepage/AcceptedItemsPreviewSection';
    import TestimonialSection from '@/components/homepage/TestimonialSection';
    import FaqSection from '@/components/homepage/FaqSection';
    import CallToActionSection from '@/components/homepage/CallToActionSection';
    import SaveStressSection from '@/components/homepage/SaveStressSection';
    import DeliveryVisualisationSection from '@/components/homepage/DeliveryVisualisationSection';

    const HomePage = () => {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-16 md:space-y-24"
        >
          <HeroSection />
          <HowItWorksSection />
          <SaveStressSection />
          <DeliveryVisualisationSection />
          <AdvantagesSection />
          <AcceptedItemsPreviewSection />
          <TestimonialSection />
          <FaqSection />
          <CallToActionSection />
        </motion.div>
      );
    };

    export default HomePage;