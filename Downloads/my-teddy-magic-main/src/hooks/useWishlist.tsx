import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        fetchWishlist(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
        if (session?.user?.id) {
          fetchWishlist(session.user.id);
        } else {
          setWishlistItems([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async (uid: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product_id,
          created_at,
          product:products(id, name, price, images, description)
        `)
        .eq("user_id", uid);

      if (error) throw error;
      setWishlistItems((data as any) || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!userId) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: userId, product_id: productId });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist",
          });
        } else {
          throw error;
        }
        return;
      }

      await fetchWishlist(userId);
      toast({
        title: "Added to wishlist",
        description: "Item successfully added to your wishlist",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistItemId);

      if (error) throw error;

      await fetchWishlist(userId);
      toast({
        title: "Removed from wishlist",
        description: "Item removed from your wishlist",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const getWishlistItemId = (productId: string) => {
    return wishlistItems.find(item => item.product_id === productId)?.id;
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItemId,
    userId,
  };
};