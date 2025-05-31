import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import * as LucideIcons from 'lucide-react';
    import { Package } from 'lucide-react'; // Default icon

    const CartContext = createContext();

    export const getIconComponent = (iconName, props = {}) => {
      const IconComponent = LucideIcons[iconName] || Package;
      return <IconComponent {...props} />;
    };

    export const CartProvider = ({ children }) => {
      const [cartItems, setCartItems] = useState([]);
      const [totalWeight, setTotalWeight] = useState(0);
      const [totalPrice, setTotalPrice] = useState(0);
      const [categories, setCategories] = useState([]);
      const [isLoadingCategories, setIsLoadingCategories] = useState(true);

      const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true }); // Secondary sort by name

        if (error) {
          console.error('Error fetching categories:', error);
          setCategories([]);
        } else {
          const formattedCategories = data.map(cat => ({
            id: cat.id,
            name: cat.name,
            pricePerKg: parseFloat(cat.price_per_kg),
            iconName: cat.icon_name || 'Package',
            categoryType: cat.category_type,
            requiresWeight: cat.requires_weight,
            isActive: cat.is_active,
            sortOrder: cat.sort_order,
            requiresContact: cat.price_per_kg === 0 // Items with price 0 require contact
          }));
          setCategories(formattedCategories);
        }
        setIsLoadingCategories(false);
      }, []);

      useEffect(() => {
        fetchCategories();
      }, [fetchCategories]);

      useEffect(() => {
        let newTotalWeight = 0;
        let newTotalPrice = 0;
        cartItems.forEach(item => {
          if (item.weight) newTotalWeight += parseFloat(item.weight);
          if (item.price) newTotalPrice += parseFloat(item.price);
        });
        setTotalWeight(newTotalWeight);
        setTotalPrice(newTotalPrice);
      }, [cartItems]);

      const addItemToCart = (item) => {
        setCartItems(prevItems => {
          const existingItemIndex = prevItems.findIndex(i => i.category === item.category);
          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            const existingItem = updatedItems[existingItemIndex];
            const newWeight = (parseFloat(existingItem.weight) || 0) + (parseFloat(item.weight) || 0);
            updatedItems[existingItemIndex] = {
              ...existingItem,
              weight: newWeight,
              price: newWeight * existingItem.pricePerKg,
            };
            return updatedItems;
          } else {
            return [...prevItems, { ...item, id: Date.now() + Math.random() }];
          }
        });
      };

      const removeItemFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      };

      const updateItemWeightInCart = (itemId, newWeight) => {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId
              ? { ...item, weight: newWeight, price: newWeight * item.pricePerKg }
              : item
          )
        );
      };

      const clearCart = () => {
        setCartItems([]);
        setTotalWeight(0);
        setTotalPrice(0);
      };

      return (
        <CartContext.Provider value={{ 
          cartItems, 
          addItemToCart, 
          removeItemFromCart, 
          updateItemWeightInCart, 
          clearCart,
          totalWeight, 
          totalPrice,
          categories,
          isLoadingCategories,
          fetchCategories // Expose fetchCategories to allow manual refresh if needed
        }}>
          {children}
        </CartContext.Provider>
      );
    };

    export const useCart = () => useContext(CartContext);