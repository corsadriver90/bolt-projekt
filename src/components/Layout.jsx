import React from 'react';
    import { Outlet } from 'react-router-dom';
    import Header from '@/components/shared/Header';
    import Footer from '@/components/shared/Footer';
    import { Toaster } from '@/components/ui/toaster';
    import CookieBanner from '@/components/CookieBanner'; 

    const Layout = () => {
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 text-foreground transition-colors duration-300">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
          <CookieBanner />
        </div>
      );
    };

    export default Layout;