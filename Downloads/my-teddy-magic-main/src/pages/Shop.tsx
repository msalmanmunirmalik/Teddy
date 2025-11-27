import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart, Filter, Search, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("name-asc");
  
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useWishlist();
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ["all", ...Array.from(new Set(cats))];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Our Magical Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your perfect cuddle companion from our enchanting selection
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for cuddle companions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-secondary/30 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                min={0}
                max={100}
                step={5}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters summary */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange([0, 100]);
                setSortBy("name-asc");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading adorable friends...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your filters.</p>
            <Button 
              variant="outline" 
              className="mt-4 rounded-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange([0, 100]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer border-0 shadow-card hover:shadow-soft transition-all rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/30 to-background">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        const inWishlist = isInWishlist(product.id);
                        if (inWishlist) {
                          const wishlistItemId = getWishlistItemId(product.id);
                          if (wishlistItemId) removeFromWishlist(wishlistItemId);
                        } else {
                          addToWishlist(product.id);
                        }
                      }}
                      className={cn(
                        "absolute top-4 right-4 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors",
                        isInWishlist(product.id) 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background/80 hover:bg-primary hover:text-primary-foreground"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
                    </button>
                    {product.category && (
                      <div className="absolute bottom-4 left-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-accent-foreground">{product.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <div className="flex items-center gap-2">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({
                                productId: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                                image: product.images?.[0] || "/placeholder.svg",
                              });
                            }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <Link to={`/product/${product.id}`}>
                          <Button size="sm" className="rounded-full">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
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

export default Shop;
