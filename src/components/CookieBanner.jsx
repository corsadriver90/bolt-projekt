import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Cookie, ShieldCheck, X } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const COOKIE_CONSENT_KEY = 'buchretter_cookie_consent';

    const CookieBanner = () => {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
          setIsVisible(true);
        }
      }, []);

      const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setIsVisible(false);
      };

      const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
        setIsVisible(false);
      };
      
      const handleClose = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'closed_without_choice');
        setIsVisible(false);
      }

      return (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
            >
              <Card className="max-w-2xl mx-auto shadow-2xl border-t-4 border-primary bg-background/95 backdrop-blur-sm">
                <CardHeader className="relative">
                  <div className="flex items-center">
                    <Cookie className="h-8 w-8 text-primary mr-3" />
                    <CardTitle className="text-xl md:text-2xl">Wir verwenden Cookies</CardTitle>
                  </div>
                   <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </Button>
                  <CardDescription className="text-sm md:text-base mt-2">
                    Um unsere Webseite für Sie optimal zu gestalten und fortlaufend verbessern zu können, verwenden wir Cookies und ähnliche Technologien (wie `localStorage` für den Warenkorb). Durch die weitere Nutzung der Webseite stimmen Sie der Verwendung von technisch notwendigen Cookies zu.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Einige Cookies sind technisch notwendig, um die Funktionalität der Seite zu gewährleisten (z.B. für den Warenkorb). 
                    Wir setzen keine Tracking-Cookies von Drittanbietern ein, die Ihr Surfverhalten über unsere Seite hinaus verfolgen.
                    Weitere Informationen finden Sie in unserer <Link to="/datenschutz" className="underline text-primary hover:text-primary/80">Datenschutzerklärung</Link>.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAccept} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4" /> Alle akzeptieren
                  </Button>
                  <Button onClick={handleDecline} variant="outline" className="w-full sm:w-auto">
                    Nur notwendige akzeptieren
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      );
    };

    export default CookieBanner;