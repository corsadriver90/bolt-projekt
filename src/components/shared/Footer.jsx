import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Facebook, Instagram, Mail, Phone, MapPin, ChevronRight, Youtube, Linkedin, Landmark, CreditCard, Coins as HandCoins, Briefcase, Users, Send, Loader2, BookOpen } from 'lucide-react';
    import { useTheme } from '@/hooks/useTheme';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { motion } from 'framer-motion';

    const PlaceholderLogo = ({ className, isDark }) => (
      <BookOpen className={`${className} ${isDark ? 'text-slate-200' : 'text-slate-700'}`} strokeWidth={1.5} />
    );

    const Footer = () => {
      const { theme } = useTheme();
      const currentYear = new Date().getFullYear();
      const { toast } = useToast();
      const [newsletterEmail, setNewsletterEmail] = useState('');
      const [isSubscribing, setIsSubscribing] = useState(false);

      const footerLinks = [
        {
          title: 'Schnell-Links',
          links: [
            { label: 'Startseite', path: '/' },
            { label: 'Ankaufsrechner', path: '/rechner' },
            { label: 'Was wir annehmen', path: '/was-wir-annehmen' },
            { label: 'Standort & Abholung', path: '/standort' },
            { label: 'Gewerbekunden', path: '/gewerbe' },
            { label: 'Blog', path: '/blog' },
          ],
        },
        {
          title: 'Unternehmen',
          links: [
            { label: 'Über Uns', path: '/ueber-uns', icon: <Users className="h-4 w-4 mr-1.5 text-primary/80 group-hover:text-primary transition-colors" /> },
            { label: 'Karriere', path: '/karriere', icon: <Briefcase className="h-4 w-4 mr-1.5 text-primary/80 group-hover:text-primary transition-colors" /> },
            { label: 'Kontakt', path: '/kontakt' },
          ],
        },
        {
          title: 'Rechtliches',
          links: [
            { label: 'Impressum', path: '/impressum' },
            { label: 'Datenschutz', path: '/datenschutz' },
            { label: 'AGB', path: '/agb' },
          ],
        },
      ];

      const socialMediaLinks = [
        { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61560273002283', icon: <Facebook className="h-5 w-5" />, ariaLabel: "Besuchen Sie uns auf Facebook" },
        { name: 'Instagram', href: '#', icon: <Instagram className="h-5 w-5" />, ariaLabel: "Folgen Sie uns auf Instagram" },
        { name: 'TikTok', href: 'https://www.tiktok.com/@diebuchretter?_t=8mP19L8nF7B&_r=1', icon: <Youtube className="h-5 w-5" />, ariaLabel: "Finden Sie uns auf TikTok" },
        { name: 'LinkedIn', href: '#', icon: <Linkedin className="h-5 w-5" />, ariaLabel: "Verbinden Sie sich mit uns auf LinkedIn" },
      ];

      const paymentMethods = [
        { name: 'Banküberweisung', icon: <Landmark className="h-7 w-7 text-blue-600 dark:text-blue-400" />, alt: 'Banküberweisung Logo' },
        { name: 'PayPal', icon: <CreditCard className="h-7 w-7 text-sky-500 dark:text-sky-400" />, alt: 'PayPal Logo' },
        { name: 'Barzahlung bei Abgabe', icon: <HandCoins className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />, alt: 'Barzahlung Logo' },
      ];

      const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) {
          toast({
            variant: "destructive",
            title: "Fehlende E-Mail-Adresse",
            description: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
          });
          return;
        }
        setIsSubscribing(true);
        const { error } = await supabase
          .from('newsletter_subscriptions')
          .insert([{ email: newsletterEmail }]);

        if (error) {
          if (error.code === '23505') { // Unique violation
             toast({
              variant: "warning",
              title: "Bereits angemeldet!",
              description: "Diese E-Mail-Adresse ist bereits für unseren Newsletter registriert.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Fehler bei der Anmeldung",
              description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            });
          }
        } else {
          toast({
            variant: "success",
            title: "Erfolgreich angemeldet!",
            description: "Vielen Dank für Ihr Interesse an unserem Newsletter.",
          });
          setNewsletterEmail('');
        }
        setIsSubscribing(false);
      };

      return (
        <footer className="bg-slate-100 dark:bg-slate-800 text-muted-foreground border-t-2 border-primary/30 mt-auto shadow-inner">
          <div className="container mx-auto px-4 py-12 md:py-16">

            <div className="mb-12 pt-8 pb-10 border-y border-border/40">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="font-semibold text-foreground text-xl md:text-2xl mb-3">Bleiben Sie auf dem Laufenden!</p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Abonnieren Sie unseren Newsletter für exklusive Angebote, Neuigkeiten und Tipps rund ums Thema Buchrettung.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <Input 
                            type="email" 
                            placeholder="Ihre E-Mail-Adresse" 
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="bg-background dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 focus:ring-primary/50 flex-grow py-3 px-4 text-base"
                            aria-label="E-Mail für Newsletter"
                            required
                        />
                        <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg sm:w-auto py-3 px-6 text-base" disabled={isSubscribing}>
                            {isSubscribing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                            Abonnieren
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-4 lg:col-span-5 space-y-5">
                <Link to="/" className="flex items-center space-x-3 group">
                   <PlaceholderLogo className="h-10 w-10 transform group-hover:scale-105 transition-transform duration-300" isDark={theme === 'dark'} />
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 group-hover:opacity-80 transition-opacity duration-300">
                    Die Buchretter
                  </span>
                </Link>
                <p className="text-sm leading-relaxed">
                  Wir geben Ihren gebrauchten Büchern, Medien und mehr ein neues Leben. Einfach, fair und nachhaltig. Werden Sie Teil unserer Community und entdecken Sie tolle Angebote und Neuigkeiten!
                </p>
                <div className="space-y-2.5 text-sm">
                  <a href="https://www.google.com/maps/search/?api=1&query=Triftstr.+21B,+16348+Wandlitz+OT+Klosterfelde" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors group">
                    <MapPin className="h-4 w-4 mr-2.5 text-primary/80 group-hover:text-primary flex-shrink-0" aria-hidden="true" />
                    Triftstr. 21B, 16348 Wandlitz OT Klosterfelde
                  </a>
                  <a href="tel:033396748863" className="flex items-center hover:text-primary transition-colors group">
                    <Phone className="h-4 w-4 mr-2.5 text-primary/80 group-hover:text-primary flex-shrink-0" aria-hidden="true" />
                    033396 748863
                  </a>
                  <a href="mailto:info@die-buchretter.de" className="flex items-center hover:text-primary transition-colors group">
                    <Mail className="h-4 w-4 mr-2.5 text-primary/80 group-hover:text-primary flex-shrink-0" aria-hidden="true" />
                    info@die-buchretter.de
                  </a>
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                {footerLinks.map((section) => (
                  <div key={section.title}>
                    <p className="font-semibold text-foreground mb-5 text-lg">{section.title}</p>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.path}
                            className="flex items-center text-sm hover:text-primary transition-colors group"
                            aria-label={`Gehe zu ${link.label}`}
                          >
                            {link.icon ? link.icon : <ChevronRight className="h-4 w-4 mr-1.5 text-primary/70 group-hover:text-primary transition-colors" aria-hidden="true" />}
                            <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                 <div>
                    <p className="font-semibold text-foreground mb-5 text-lg">Folgen Sie uns</p>
                    <div className="flex space-x-3">
                    {socialMediaLinks.map((social) => (
                        <motion.a 
                        key={social.name} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary transition-all duration-300 hover:scale-110"
                        aria-label={social.ariaLabel}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        {social.icon}
                        </motion.a>
                    ))}
                    </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-10 border-t border-border/40">
                 <p className="font-semibold text-foreground mb-4 text-center text-lg">Sichere Zahlungsmethoden</p>
                 <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {paymentMethods.map((method) => (
                      <div key={method.name} title={method.name} className="p-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" aria-label={method.alt}>
                        {method.icon}
                      </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 pt-10 border-t border-border/50 text-center text-xs flex flex-col sm:flex-row justify-between items-center">
              <p className="text-muted-foreground">&copy; {currentYear} Die Buchretter GbR. Alle Rechte vorbehalten.</p>
              <Link to="/admin/login" className="text-xs text-slate-400 hover:text-primary transition-colors mt-2 sm:mt-0">
                Admin Login
              </Link>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;