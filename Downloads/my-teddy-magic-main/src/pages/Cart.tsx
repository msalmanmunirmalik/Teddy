import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingBag, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, total, removeFromCart, updateQuantity, userId } = useCart();

  useEffect(() => {
    if (!loading && !userId) {
      navigate("/auth");
    }
  }, [loading, userId, navigate]);

  const isEmpty = cartItems.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Your Cart is Empty</h2>
          <p className="text-muted-foreground">
            Time to find your perfect cuddle companion!
          </p>
          <Link to="/shop">
            <Button size="lg" className="rounded-full">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="border-0 shadow-card rounded-3xl p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-secondary/30 to-background rounded-2xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                            <motion.button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              aria-label="Remove item"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-3 bg-secondary/30 rounded-full px-4 py-2 w-fit">
                            <motion.button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              -
                            </motion.button>
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                              transition={{ duration: 0.3 }}
                              className="w-12 text-center font-semibold"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.p 
                            key={item.price * item.quantity}
                            initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl font-bold text-primary"
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </motion.p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="border-0 shadow-soft rounded-3xl p-6 sticky top-24 bg-gradient-to-br from-secondary/20 to-background">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal</span>
                      <motion.span 
                        key={total}
                        initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                        animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                        transition={{ duration: 0.3 }}
                        className="font-semibold"
                      >
                        ${total.toFixed(2)}
                      </motion.span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <motion.span 
                        key={total}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-primary"
                      >
                        ${total.toFixed(2)}
                      </motion.span>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <Button size="lg" className="w-full rounded-full shadow-soft mb-4">
                      <Heart className="w-5 h-5 mr-2 fill-current" />
                      Ready to Cuddle
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="outline" size="lg" className="w-full rounded-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
