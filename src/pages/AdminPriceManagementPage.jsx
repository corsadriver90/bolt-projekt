import React, { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Loader2, LogOut } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import AdminNavigation from '@/components/admin/AdminNavigation';
    import CategoryForm from '@/components/admin/CategoryForm';
    import CategoryTable from '@/components/admin/CategoryTable';

    const AdminPriceManagementPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [categories, setCategories] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [showForm, setShowForm] = useState(false);
      const [currentCategory, setCurrentCategory] = useState({ 
        name: '', 
        price_per_kg: '', 
        icon_name: 'Package', 
        category_type: 'kg', 
        requires_weight: true, 
        is_active: true,
        sort_order: 100 
      });
      const [editingCategoryId, setEditingCategoryId] = useState(null);
      const [currentUser, setCurrentUser] = useState(null);
      const [sortConfig, setSortConfig] = useState({ key: 'sort_order', direction: 'ascending' });

      const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order(sortConfig.key, { ascending: sortConfig.direction === 'ascending' })
          .order('name', { ascending: true }); // Secondary sort by name

        if (error) {
          console.error('Error fetching categories:', error);
          toast({ title: "Fehler", description: "Kategorien konnten nicht geladen werden.", variant: "destructive" });
        } else {
          setCategories(data);
        }
        setIsLoading(false);
      }, [toast, sortConfig]);

      useEffect(() => {
        const checkUserSession = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            navigate('/admin/login');
            toast({ title: "Nicht angemeldet", description: "Bitte zuerst anmelden.", variant: "destructive"});
          } else {
            setCurrentUser(session.user);
            // fetchCategories is called after sortConfig is initialized
          }
        };
        checkUserSession();
      }, [navigate, toast]);
      
      useEffect(() => {
        if(currentUser) { // Fetch categories only if user is logged in and sortConfig is set
            fetchCategories();
        }
      }, [currentUser, fetchCategories, sortConfig]);


      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentCategory(prev => ({ 
          ...prev, 
          [name]: type === 'checkbox' ? checked : (name === 'sort_order' || name === 'price_per_kg' ? (value === '' ? '' : parseFloat(value)) : value)
        }));
      };
      
      const handleSwitchChange = (name, checked) => {
        setCurrentCategory(prev => ({ ...prev, [name]: checked }));
      };

      const resetForm = () => {
        setShowForm(false);
        setEditingCategoryId(null);
        setCurrentCategory({ name: '', price_per_kg: '', icon_name: 'Package', category_type: 'kg', requires_weight: true, is_active: true, sort_order: 100 });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
          toast({ title: "Fehler", description: "Kein Benutzer angemeldet. Bitte erneut anmelden.", variant: "destructive" });
          navigate('/admin/login');
          return;
        }
        setIsSubmitting(true);

        const categoryData = {
          name: currentCategory.name,
          price_per_kg: parseFloat(currentCategory.price_per_kg) || 0,
          icon_name: currentCategory.icon_name,
          category_type: currentCategory.category_type,
          requires_weight: currentCategory.requires_weight,
          is_active: currentCategory.is_active,
          sort_order: parseInt(currentCategory.sort_order, 10) || 100,
        };

        let result;
        if (editingCategoryId) {
          const { data, error } = await supabase
            .from('product_categories')
            .update(categoryData)
            .eq('id', editingCategoryId)
            .select()
            .single();
          result = { data, error };
        } else {
          const { data, error } = await supabase
            .from('product_categories')
            .insert([categoryData])
            .select()
            .single();
          result = { data, error };
        }
        
        setIsSubmitting(false);

        if (result.error) {
          console.error('Error saving category:', result.error);
          toast({ title: "Fehler", description: `Kategorie konnte nicht gespeichert werden: ${result.error.message}`, variant: "destructive" });
        } else {
          toast({ title: "Erfolg!", description: `Kategorie ${editingCategoryId ? 'aktualisiert' : 'erstellt'}.`, variant: "success" });
          resetForm();
          fetchCategories(); 
        }
      };

      const handleEdit = (category) => {
        setEditingCategoryId(category.id);
        setCurrentCategory({ 
          name: category.name, 
          price_per_kg: category.price_per_kg.toString(), 
          icon_name: category.icon_name || 'Package',
          category_type: category.category_type || 'kg',
          requires_weight: category.requires_weight === null ? true : category.requires_weight,
          is_active: category.is_active === null ? true : category.is_active,
          sort_order: category.sort_order === null ? 100 : category.sort_order,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      
      const handleDelete = async (categoryId) => {
        const { error } = await supabase
          .from('product_categories')
          .delete()
          .eq('id', categoryId);

        if (error) {
          console.error('Error deleting category:', error);
          toast({ title: "Fehler", description: "Kategorie konnte nicht gelöscht werden.", variant: "destructive" });
        } else {
          toast({ title: "Erfolg!", description: "Kategorie gelöscht.", variant: "success" });
          fetchCategories(); 
        }
      };

      const openNewCategoryForm = () => {
        resetForm();
        // Find the highest sort_order and add 10, or default to 100
        const maxSortOrder = categories.reduce((max, cat) => Math.max(max, cat.sort_order || 0), 0);
        setCurrentCategory(prev => ({ ...prev, sort_order: (maxSortOrder || 90) + 10 }));
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      
      const handleLogout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        setIsLoading(false);
        if (error) {
          toast({ title: "Fehler beim Abmelden", description: error.message, variant: "destructive"});
        } else {
          setCurrentUser(null);
          navigate('/admin/login');
          toast({ title: "Abgemeldet", description: "Sie wurden erfolgreich abgemeldet.", variant: "info"});
        }
      };

      const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };

      if (isLoading && !currentUser && categories.length === 0) { 
        return (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-primary">Preisverwaltung</h1>
              <Button variant="destructive" onClick={handleLogout} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <LogOut className="mr-2 h-4 w-4" /> Abmelden
              </Button>
            </div>

            <AdminNavigation />

            <div className="mb-6">
              <Button onClick={openNewCategoryForm} className="bg-emerald-500 hover:bg-emerald-600">
                <PlusCircle className="mr-2 h-5 w-5" /> Neue Kategorie erstellen
              </Button>
            </div>

            <AnimatePresence>
              <CategoryForm
                showForm={showForm}
                editingCategoryId={editingCategoryId}
                currentCategory={currentCategory}
                handleInputChange={handleInputChange}
                handleSwitchChange={handleSwitchChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={resetForm}
              />
            </AnimatePresence>

            <CategoryTable
              categories={categories}
              isLoading={isLoading && categories.length === 0} // Show loader only if categories are empty
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSort={handleSort}
            />
          </motion.div>
        </div>
      );
    };

    export default AdminPriceManagementPage;