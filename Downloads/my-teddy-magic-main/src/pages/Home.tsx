import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Star, Cloud } from "lucide-react";
import heroTeddy from "@/assets/hero-teddy.jpg";
import teddyCollection from "@/assets/teddy-collection.jpg";
import teddyPurple from "@/assets/teddy-purple.jpg";
import bunnyPink from "@/assets/bunny-pink.jpg";
import teddyCream from "@/assets/teddy-cream.jpg";

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Lavender Dreams Teddy",
      price: "$34.99",
      image: teddyPurple,
    },
    {
      id: 2,
      name: "Cotton Candy Bunny",
      price: "$29.99",
      image: bunnyPink,
    },
    {
      id: 3,
      name: "Classic Cream Bear",
      price: "$32.99",
      image: teddyCream,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/20 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <Cloud className="absolute top-20 left-10 w-24 h-24 text-primary/10 animate-float" />
          <Star className="absolute top-40 right-20 w-8 h-8 text-accent/30 animate-sparkle" />
          <Sparkles className="absolute bottom-40 left-1/4 w-12 h-12 text-primary/20 animate-sparkle" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Premium Plush Collection</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Magical Hugs
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  For Every Heart
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Discover our enchanting collection of premium stuffed toys designed to bring comfort, joy, and magical moments to your life.
              </p>
              
              <div className="flex gap-4">
                <Link to="/shop">
                  <Button size="lg" className="rounded-full shadow-soft">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="rounded-full">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroTeddy}
                alt="Adorable teddy bear"
                className="relative rounded-3xl shadow-soft w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-teddy-cloud">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Teddies</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Best Hugs Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked favorites that spread the most joy and comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="group cursor-pointer border-0 shadow-card hover:shadow-soft transition-all rounded-3xl overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary/30 to-background">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
                      <Link to={`/product/${product.id}`}>
                        <Button size="sm" className="rounded-full">
                          Cuddle Me
                          <Heart className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Teddies
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-0 shadow-soft rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-background">
            <div className="absolute inset-0 opacity-20">
              <Star className="absolute top-10 right-10 w-16 h-16 text-primary animate-sparkle" />
              <Cloud className="absolute bottom-10 left-10 w-20 h-20 text-accent animate-float" />
            </div>
            
            <CardContent className="relative z-10 p-12 md:p-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src={teddyCollection}
                    alt="Teddy collection"
                    className="rounded-2xl shadow-card"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-foreground">
                    Join the My Teddy Family
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Every teddy has a story, and we can't wait to help you create yours. Explore our magical collection today.
                  </p>
                  <Link to="/shop">
                    <Button size="lg" className="rounded-full">
                      Start Your Journey
                      <Heart className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
