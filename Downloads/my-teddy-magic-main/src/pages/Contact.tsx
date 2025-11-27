import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Mail, MessageCircle, Sparkles } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Send Us a Hug
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Reach out and let's chat!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-0 shadow-soft rounded-3xl p-8 bg-gradient-to-br from-secondary/20 to-background">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    className="rounded-2xl border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-2xl border-border bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    className="rounded-2xl border-border bg-background resize-none"
                  />
                </div>

                <Button size="lg" className="w-full rounded-full shadow-soft">
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  Send a Hug
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-0 shadow-card rounded-3xl p-8 bg-gradient-to-br from-primary/5 to-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Email Us</h3>
                    <p className="text-muted-foreground">
                      uswamustafa15@gmail.com
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-card rounded-3xl p-8 bg-gradient-to-br from-accent/5 to-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Live Chat</h3>
                    <p className="text-muted-foreground">
                      Available Mon-Fri, 9am-5pm EST
                    </p>
                    <Button variant="link" className="px-0 text-primary hover:text-primary/80 mt-2">
                      Start a conversation →
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="border-0 shadow-card rounded-3xl p-8 bg-gradient-to-br from-secondary/20 to-background">
                <h3 className="font-semibold text-lg text-foreground mb-4">Quick FAQs</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary fill-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Free shipping on orders over $50
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary fill-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      30-day return policy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-primary fill-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      All products are machine washable
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
