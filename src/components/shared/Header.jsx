import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { BookHeart, Calculator, Home, ShoppingCart, MapPin, Briefcase, Phone, Sun, Moon, Menu as MenuIcon, X as XIcon, BookOpen } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useCart } from '@/hooks/useCart';
    import { useTheme } from '@/hooks/useTheme';

    const navItems = [
      { name: 'Startseite', path: '/', icon: <Home className="h-5 w-5" /> },
      { name: 'Ankaufsrechner', path: '/rechner', icon: <Calculator className="h-5 w-5" /> },
      { name: 'Was wir annehmen', path: '/was-wir-annehmen', icon: <BookHeart className="h-5 w-5" /> },
      { name: 'Standort & Abholung', path: '/standort', icon: <MapPin className="h-5 w-5" /> },
      { name: 'Gewerbekunden', path: '/gewerbe', icon: <Briefcase className="h-5 w-5" /> },
      { name: 'Kontakt', path: '/kontakt', icon: <Phone className="h-5 w-5" /> },
    ];

    const PlaceholderLogo = ({ className, isDark }) => (
      <BookOpen className={`${className} ${isDark ? 'text-slate-200' : 'text-slate-700'}`} strokeWidth={1.5} />
    );


    const Header = () => {
      const location = useLocation();
      const { cartItems } = useCart();
      const { theme, toggleTheme } = useTheme();
      const [isMenuOpen, setIsMenuOpen] = React.useState(false);

      const totalItemsInCart = cartItems.reduce((sum, item) => sum + (item.isManualEntry ? 1 : 1), 0);

      const isActive = (path) => location.pathname === path;

      const NavLink = ({ item, onClick, className }) => (
        <Link
          to={item.path}
          onClick={onClick}
          className={`relative group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
            ${isActive(item.path)
              ? 'text-primary dark:text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground '
            } ${className}`}
           aria-label={`Gehe zu ${item.name}`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
          <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
      );
      
      return (
        <motion.header
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.1 }}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl shadow-lg dark:shadow-slate-800/60 border-b border-border/50"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-24">
              <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group" aria-label="Zur Startseite von Die Buchretter">
                <motion.div 
                  className="transform group-hover:scale-105 transition-transform duration-300"
                  whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.4 } }}
                >
                   <PlaceholderLogo className="h-10 w-10" isDark={theme === 'dark'} />
                </motion.div>
                <span className="self-center text-3xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 hidden sm:inline group-hover:opacity-80 transition-opacity duration-300">
                  Die Buchretter
                </span>
              </Link>

              <div className="flex items-center space-x-2 md:space-x-3">
                <nav className="hidden md:flex items-center space-x-1" aria-label="Hauptnavigation">
                  {navItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </nav>

                <Link to="/rechner" className="relative p-2.5 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group" aria-label={`Warenkorb, ${totalItemsInCart} Artikel`}>
                  <ShoppingCart className="h-6 w-6 text-primary group-hover:animate-pulse" />
                  {totalItemsInCart > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full shadow-md" aria-hidden="true">
                      {totalItemsInCart}
                    </span>
                  )}
                </Link>

                <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors rounded-full p-2.5" aria-label={`Wechsle zum ${theme === 'light' ? 'dunklen' : 'hellen'} Modus`}>
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground hover:text-foreground rounded-full p-2.5"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden bg-background border-t border-border shadow-xl overflow-hidden"
              >
                <nav className="flex flex-col p-4 space-y-2" aria-label="Mobile Navigation">
                  {navItems.map((item) => (
                    <NavLink 
                      key={item.name} 
                      item={item} 
                      onClick={() => setIsMenuOpen(false)} 
                      className="w-full justify-start text-base py-3"
                    />
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      );
    };

    export default Header;