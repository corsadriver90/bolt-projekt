import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { ChevronLeft, ChevronRight } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const ImageSlider = ({ images }) => {
      const [currentIndex, setCurrentIndex] = useState(0);

      const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, [images.length]);

      const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      };

      useEffect(() => {
        if (images && images.length > 0) {
          const timer = setTimeout(nextSlide, 7000); 
          return () => clearTimeout(timer);
        }
      }, [currentIndex, nextSlide, images]);

      if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 md:h-96 lg:h-[500px] bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-2xl shadow-2xl">
                <div className="text-center p-4">
                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Bilder laden...</h3>
                    <p className="text-slate-500 dark:text-slate-400">Momentan sind keine Bilder verfügbar. Wir arbeiten daran!</p>
                    <img  alt="Platzhalterbild für Slider" className="mt-4 w-32 h-32 opacity-50" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                </div>
            </div>
        );
      }
      
      const currentImage = images[currentIndex];

      return (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {currentImage.srcUrl ? (
                <img  
                  className="w-full h-full object-cover"
                  alt={currentImage.alt || 'Slider Bild'}
                  src={currentImage.srcUrl} />
              ) : (
                <img  
                  className="w-full h-full object-cover"
                  alt={currentImage.alt || 'Slider Bild'}
                 src="https://images.unsplash.com/photo-1691527385266-62295bbcabb1" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <motion.h3 
                  className="text-2xl md:text-4xl font-bold mb-2 shadow-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {currentImage.title}
                </motion.h3>
                <motion.p 
                  className="text-sm md:text-lg leading-relaxed max-w-xl shadow-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {currentImage.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
            onClick={prevSlide}
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
            onClick={nextSlide}
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-7 w-7" />
          </Button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-primary scale-125' : 'bg-white/60 hover:bg-white/90'}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Gehe zu Bild ${index + 1}`}
              />
            ))}
          </div>
        </div>
      );
    };

    export default ImageSlider;