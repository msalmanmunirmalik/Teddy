import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, loading, removeFromWishlist, userId } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!loading && !userId) {
      navigate("/auth");
    }
  }, [loading, userId, navigate]);

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: 1,
      image: item.product.images?.[0] || "/placeholder.svg",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-teddy-cloud to-teddy-purple-light">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teddy-cloud to-teddy-purple-light p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            My Wishlist
          </h1>
          <p className="text-center text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="border-2 border-teddy-purple-light shadow-soft rounded-3xl">
            <CardContent className="text-center py-16">
              <Heart className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add your favorite teddies to your wishlist! 🧸
              </p>
              <Button onClick={() => navigate("/shop")} className="gap-2">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="border-2 border-teddy-purple-light shadow-soft rounded-3xl overflow-hidden group hover:shadow-glow transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.product.images?.[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 rounded-full"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ${item.product.price}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
