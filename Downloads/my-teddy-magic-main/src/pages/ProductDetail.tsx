import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useWishlist();
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || "/placeholder.svg",
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    const inWishlist = isInWishlist(product.id);
    if (inWishlist) {
      const wishlistItemId = getWishlistItemId(product.id);
      if (wishlistItemId) removeFromWishlist(wishlistItemId);
    } else {
      addToWishlist(product.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-soft rounded-3xl bg-gradient-to-br from-secondary/30 to-background">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Premium Collection</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(48 reviews)</span>
              </div>
              <p className="text-3xl font-bold text-primary mb-6">${product.price}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Materials & Size */}
            {(product.materials || product.size) && (
              <Card className="border-0 shadow-card rounded-2xl bg-secondary/20 p-6">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Product Details</h3>
                <div className="space-y-2">
                  {product.materials && (
                    <div>
                      <span className="text-sm text-muted-foreground">Materials: </span>
                      <span className="text-sm font-medium text-foreground">{product.materials}</span>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <span className="text-sm text-muted-foreground">Size: </span>
                      <span className="text-sm font-medium text-foreground">{product.size}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">Quantity:</span>
                <div className="flex items-center gap-3 bg-secondary/30 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 rounded-full shadow-soft"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant={isInWishlist(product.id) ? "default" : "outline"}
                  className="rounded-full"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
