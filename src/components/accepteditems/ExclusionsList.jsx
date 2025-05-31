import React from 'react';
    import { XCircle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
          delay: i * 0.05,
          duration: 0.4,
          ease: "easeOut"
        }
      })
    };

    const ExclusionsList = ({ exclusions }) => {
      return (
        <div className="max-w-3xl mx-auto px-6">
          <ul className="space-y-3 columns-1 md:columns-2">
            {exclusions.map((item, index) => (
              <motion.li 
                key={item} 
                className="flex items-start mb-2"
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <XCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      );
    };

    export default ExclusionsList;