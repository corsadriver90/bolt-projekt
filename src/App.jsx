import React from 'react';
    import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import CalculatorPage from '@/pages/CalculatorPage';
    import PurchaseFormPage from '@/pages/PurchaseFormPage';
    import BusinessPage from '@/pages/BusinessPage';
    import ContactPage from '@/pages/ContactPage';
    import TermsPage from '@/pages/TermsPage';
    import ImpressumPage from '@/pages/ImpressumPage';
    import PrivacyPage from '@/pages/PrivacyPage';
    import ConfirmationPage from '@/pages/ConfirmationPage';
    import AcceptedItemsPage from '@/pages/AcceptedItemsPage';
    import LocationPage from '@/pages/LocationPage';
    import BlogPage from '@/pages/BlogPage'; 
    import BlogPostPage from '@/pages/BlogPostPage';
    import AdminLoginPage from '@/pages/AdminLoginPage';
    import AdminBlogDashboardPage from '@/pages/AdminBlogDashboardPage';
    import AdminPriceManagementPage from '@/pages/AdminPriceManagementPage';
    import CareerPage from '@/pages/CareerPage'; 
    import AboutUsPage from '@/pages/AboutUsPage'; 
    import { CartProvider } from '@/hooks/useCart';
    import { ThemeProvider } from '@/hooks/useTheme'; 

    const ScrollToTop = () => {
      const { pathname } = useLocation();
      React.useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
      return null;
    };

    function App() {
      return (
        <ThemeProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="rechner" element={<CalculatorPage />} />
                  <Route path="ankauf" element={<PurchaseFormPage />} /> 
                  <Route path="ankaufsformular" element={<PurchaseFormPage />} />
                  <Route path="gewerbe" element={<BusinessPage />} />
                  <Route path="kontakt" element={<ContactPage />} />
                  <Route path="agb" element={<TermsPage />} />
                  <Route path="impressum" element={<ImpressumPage />} />
                  <Route path="datenschutz" element={<PrivacyPage />} />
                  <Route path="bestaetigung" element={<ConfirmationPage />} />
                  <Route path="was-wir-annehmen" element={<AcceptedItemsPage />} />
                  <Route path="standort" element={<LocationPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:postId" element={<BlogPostPage />} />
                  <Route path="karriere" element={<CareerPage />} /> 
                  <Route path="ueber-uns" element={<AboutUsPage />} /> 
                  
                  <Route path="admin/login" element={<AdminLoginPage />} />
                  <Route path="admin/blog" element={<AdminBlogDashboardPage />} /> 
                  <Route path="admin/preise" element={<AdminPriceManagementPage />} />
                  
                  <Route path="*" element={<HomePage />} /> 
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </ThemeProvider>
      );
    }

    export default App;