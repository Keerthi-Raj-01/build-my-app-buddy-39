import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Gift, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Share & Earn",
      description: "Upload real-time restaurant photos and earn 5% discounts on your next visit",
      color: "text-primary"
    },
    {
      icon: MapPin,
      title: "Discover Nearby",
      description: "Find restaurants with authentic, current photos from real customers",
      color: "text-accent"
    },
    {
      icon: Gift,
      title: "Instant Rewards",
      description: "Get QR code discounts instantly after posting your experience",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Follow foodies, interact with content, and build your reputation",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Updates",
      description: "See current ambience, crowd levels, and food quality before you go",
      color: "text-primary"
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Earn points, unlock badges, and climb the leaderboard",
      color: "text-accent"
    }
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-subtle overflow-hidden">
        <ScreenLayout>
          <div className="py-16 sm:py-24 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              Phase 1: Design System Complete ✓
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AmbienSee
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Discover Restaurants Through Real-Time Community Photos
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your dining experiences and earn 5% discounts. See authentic, current photos before you visit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="min-w-[160px]" asChild>
                <Link to="/register">
                  <Camera className="mr-2 h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[160px]" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </ScreenLayout>
      </div>

      {/* Features Section */}
      <ScreenLayout className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community-driven platform and transform how you discover restaurants
          </p>
        </div>

        <GridLayout>
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:border-primary/20">
              <CardHeader>
                <div className="mb-4 inline-flex">
                  <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-smooth ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </GridLayout>
      </ScreenLayout>

      {/* Design System Showcase */}
      <div className="bg-muted/30">
        <ScreenLayout className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Design System Preview
            </h2>
            <p className="text-lg text-muted-foreground">
              Phase 1 Foundation: Colors, Typography, and Components
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Component Showcase</CardTitle>
              <CardDescription>Interactive elements using AmbienSee design tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-sm font-medium mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-sm font-medium mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-sm font-medium mb-3">Typography</h3>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Heading 1 - Poppins Bold</h1>
                  <h2 className="text-3xl font-semibold">Heading 2 - Poppins Semibold</h2>
                  <h3 className="text-2xl font-medium">Heading 3 - Poppins Medium</h3>
                  <p className="text-base">Body text - Inter Regular. The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-sm text-muted-foreground">Small text - Inter Regular with muted color.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScreenLayout>
      </div>

      {/* Footer CTA */}
      <ScreenLayout className="py-16">
        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Sharing?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of food lovers discovering authentic dining experiences
            </p>
            <Button size="lg" variant="secondary" className="min-w-[160px]" asChild>
              <Link to="/register">
                <Camera className="mr-2 h-5 w-5" />
                Join AmbienSee
              </Link>
            </Button>
          </CardContent>
        </Card>
      </ScreenLayout>
    </AppLayout>
  );
};

export default Index;
