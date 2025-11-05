import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Star, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const Restaurants = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState([5]);

  const restaurants = [
    {
      id: 1,
      name: "Sunset Bistro",
      cuisine: "French",
      distance: "0.5 mi",
      rating: 4.5,
      photoCount: 124,
      recentPhoto: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      priceRange: "$$"
    },
    {
      id: 2,
      name: "The Garden Cafe",
      cuisine: "Vegetarian",
      distance: "1.2 mi",
      rating: 4.8,
      photoCount: 89,
      recentPhoto: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
      priceRange: "$"
    },
    {
      id: 3,
      name: "Urban Kitchen",
      cuisine: "American",
      distance: "2.1 mi",
      rating: 4.3,
      photoCount: 156,
      recentPhoto: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      priceRange: "$$$"
    },
    {
      id: 4,
      name: "Spice Route",
      cuisine: "Indian",
      distance: "1.8 mi",
      rating: 4.6,
      photoCount: 92,
      recentPhoto: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
      priceRange: "$$"
    },
  ];

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="py-4">
            <h1 className="text-2xl font-bold mb-4">Discover Restaurants</h1>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search restaurants or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div>
                      <Label>Cuisine Type</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="All cuisines" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All cuisines</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="american">American</SelectItem>
                          <SelectItem value="indian">Indian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Price Range</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any price</SelectItem>
                          <SelectItem value="$">$ - Budget</SelectItem>
                          <SelectItem value="$$">$$ - Moderate</SelectItem>
                          <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Distance: {distanceFilter[0]} mi</Label>
                      <Slider
                        value={distanceFilter}
                        onValueChange={setDistanceFilter}
                        max={10}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Sort By</Label>
                      <Select defaultValue="distance">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Distance</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="recent">Recently Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        <div className="text-sm text-muted-foreground mb-4">
          Found {filteredRestaurants.length} restaurants nearby
        </div>

        {viewMode === "grid" ? (
          <GridLayout>
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <Card className="overflow-hidden hover:shadow-elevated transition-smooth cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={restaurant.recentPhoto}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/90">
                      <Camera className="h-3 w-3 mr-1" />
                      {restaurant.photoCount}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <span className="text-muted-foreground">{restaurant.priceRange}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </GridLayout>
        ) : (
          <div className="space-y-3">
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <Card className="hover:shadow-elevated transition-smooth cursor-pointer">
                  <CardContent className="p-0 flex">
                    <div className="w-32 h-32 flex-shrink-0 relative">
                      <img
                        src={restaurant.recentPhoto}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                          <Badge variant="secondary">
                            <Camera className="h-3 w-3 mr-1" />
                            {restaurant.photoCount}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{restaurant.distance}</span>
                        </div>
                        <span className="text-muted-foreground">{restaurant.priceRange}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </ScreenLayout>
      <BottomNav />
    </AppLayout>
  );
};

export default Restaurants;
