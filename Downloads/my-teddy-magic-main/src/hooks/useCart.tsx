import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Cart item structure - defines what each product in cart looks like
export interface CartItem {
  id: string;           // Unique ID for this cart item
  name: string;         // Product name
  price: number;        // Product price
  quantity: number;     // How many of this product
  image: string;        // Product image URL
  productId: string;    // Reference to original product
}

export const useCart = () => {
  // State management for cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize cart when component mounts
  useEffect(() => {
    const initializeCart = async () => {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        await fetchCart(session.user.id);
      }
      setLoading(false);
    };

    initializeCart();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          fetchCart(session.user.id);
        } else {
          // User logged out - clear cart
          setUserId(null);
          setCartItems([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch cart data from database
  const fetchCart = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("carts")
        .select("*")
        .eq("user_id", uid)
        .maybeSingle(); // Get single row or null if not exists

      if (error) throw error;

      // Parse cart items from database
      if (data?.items) {
        const items = data.items as unknown as CartItem[];
        setCartItems(Array.isArray(items) ? items : []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  // Add item to cart or increase quantity if already exists
  const addToCart = async (item: Omit<CartItem, "id">) => {
    // Check if user is logged in
    if (!userId) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      // Check if product already in cart
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Product exists - increase quantity
        updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
      } else {
        // New product - add to cart
        const newItem: CartItem = {
          ...item,
          id: crypto.randomUUID(), // Generate unique ID
        };
        updatedItems = [...cartItems, newItem];
      }

      // Calculate new total
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Save to database (upsert = update if exists, insert if not)
      const { error } = await supabase
        .from("carts")
        .upsert({
          user_id: userId,
          items: updatedItems as unknown as any,
          total,
        }, {
          onConflict: 'user_id' // Use unique constraint on user_id
        });

      if (error) throw error;

      // Update local state
      setCartItems(updatedItems);
      toast.success("Added to cart! 🧸");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Remove item from cart completely
  const removeFromCart = async (itemId: string) => {
    if (!userId) return;

    try {
      // Filter out the item to remove
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      
      // Calculate new total
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      if (updatedItems.length === 0) {
        // Cart is empty - delete cart record
        const { error } = await supabase
          .from("carts")
          .delete()
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Update cart with remaining items
        const { error } = await supabase
          .from("carts")
          .update({
            items: updatedItems as unknown as any,
            total,
          })
          .eq("user_id", userId);

        if (error) throw error;
      }

      // Update local state
      setCartItems(updatedItems);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  // Update quantity of an item (+ or - buttons)
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    // Don't allow quantity less than 1
    if (!userId || newQuantity < 1) return;

    try {
      // Update the quantity for specific item
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // Calculate new total
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Save to database
      const { error } = await supabase
        .from("carts")
        .update({
          items: updatedItems as unknown as any,
          total,
        })
        .eq("user_id", userId);

      if (error) throw error;

      // Update local state
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Clear entire cart (used after checkout)
  const clearCart = async () => {
    if (!userId) return;

    try {
      // Delete cart from database
      const { error } = await supabase
        .from("carts")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      // Clear local state
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  // Calculate total price (auto-updates when cartItems change)
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Return cart data and functions to use in components
  return {
    cartItems,      // Array of items in cart
    loading,        // Is cart loading?
    total,          // Total price
    addToCart,      // Function to add item
    removeFromCart, // Function to remove item
    updateQuantity, // Function to change quantity
    clearCart,      // Function to empty cart
    userId,         // Current user ID
  };
};
