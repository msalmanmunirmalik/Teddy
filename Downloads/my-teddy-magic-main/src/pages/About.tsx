import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Star } from "lucide-react";
import teddyCollection from "@/assets/teddy-collection.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Crafting Magical Moments
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At My Teddy, we believe in the power of a hug. Every stuffed friend we create is designed to bring comfort, joy, and a touch of magic to your life.
          </p>
        </div>

        {/* Image Card */}
        <Card className="overflow-hidden border-0 shadow-soft rounded-3xl mb-16 bg-gradient-to-br from-secondary/30 to-background">
          <img
            src={teddyCollection}
            alt="My Teddy Collection"
            className="w-full h-96 object-cover"
          />
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-card rounded-3xl p-8 text-center bg-gradient-to-br from-primary/5 to-background">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Made with Love</h3>
            <p className="text-muted-foreground">
              Every teddy is crafted with care and attention to detail, ensuring premium quality in every stitch.
            </p>
          </Card>

          <Card className="border-0 shadow-card rounded-3xl p-8 text-center bg-gradient-to-br from-accent/5 to-background">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Magical Comfort</h3>
            <p className="text-muted-foreground">
              Ultra-soft materials and hypoallergenic filling create the perfect cuddle companion for all ages.
            </p>
          </Card>

          <Card className="border-0 shadow-card rounded-3xl p-8 text-center bg-gradient-to-br from-secondary/20 to-background">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary fill-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Premium Quality</h3>
            <p className="text-muted-foreground">
              Safety tested and built to last, our teddies become cherished companions for years to come.
            </p>
          </Card>
        </div>

        {/* Story */}
        <Card className="border-0 shadow-soft rounded-3xl p-12 bg-gradient-to-br from-secondary/20 to-background">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold text-foreground">A Journey of Warmth</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My Teddy was born from a simple belief: everyone deserves comfort and joy. What started as a small collection has grown into a family of magical companions, each one designed to bring smiles and create lasting memories.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We source the finest materials, work with skilled artisans, and pour love into every creation. From our family to yours, thank you for making My Teddy part of your story.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
