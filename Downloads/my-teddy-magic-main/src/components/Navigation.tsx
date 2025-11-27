import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Sparkles, User, Package, Heart as HeartIcon, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems } = useCart();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Goodbye! 🧸",
        description: "You've been logged out successfully",
      });
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-primary fill-primary group-hover:animate-bounce-gentle transition-all" />
              <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Teddy
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-base font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-base font-medium transition-colors hover:text-primary ${
                isActive("/shop") ? "text-primary" : "text-foreground"
              }`}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`text-base font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-foreground"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-base font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative rounded-full hover:bg-teddy-purple-light transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {/* User Dropdown Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full hover:bg-teddy-purple-light transition-colors border-2 hover:border-primary"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 bg-background border-2 border-teddy-purple-light rounded-2xl shadow-soft animate-in slide-in-from-top-2 duration-300"
                >
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-xl py-3 px-4 focus:bg-teddy-purple-light hover:bg-teddy-purple-light transition-colors"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-xl py-3 px-4 focus:bg-teddy-purple-light hover:bg-teddy-purple-light transition-colors"
                    onClick={() => navigate("/orders")}
                  >
                    <Package className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-xl py-3 px-4 focus:bg-teddy-purple-light hover:bg-teddy-purple-light transition-colors"
                    onClick={() => navigate("/wishlist")}
                  >
                    <HeartIcon className="w-4 h-4 mr-3 text-primary" />
                    <span className="font-medium">Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-border" />
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-xl py-3 px-4 focus:bg-destructive/10 hover:bg-destructive/10 transition-colors text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default"
                onClick={() => navigate("/auth")}
                className="rounded-full"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
