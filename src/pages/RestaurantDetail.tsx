import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, MapPin, Phone, Clock, Share2, Navigation } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const { id } = useParams();

  const restaurant = {
    name: "Sunset Bistro",
    cuisine: "French",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
    rating: 4.5,
    photoCount: 124,
    coverPhoto: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  };

  const recentPhotos = [
    { id: 1, url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", user: "Sarah M.", time: "2 hours ago" },
    { id: 2, url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", user: "John D.", time: "5 hours ago" },
    { id: 3, url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", user: "Emma W.", time: "Yesterday" },
    { id: 4, url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", user: "Mike R.", time: "Yesterday" },
    { id: 5, url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", user: "Lisa K.", time: "2 days ago" },
    { id: 6, url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400", user: "Tom B.", time: "2 days ago" },
  ];

  return (
    <AppLayout>
      {/* Header with Cover Photo */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.coverPhoto}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button variant="secondary" size="icon" asChild>
            <Link to="/restaurants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
          <p className="text-white/90">{restaurant.cuisine}</p>
        </div>
      </div>

      <ScreenLayout>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 -mt-6 mb-6">
          <Button size="lg" className="h-14" asChild>
            <Link to="/camera">
              <Camera className="mr-2 h-5 w-5" />
              Upload Photo
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14">
            <Navigation className="mr-2 h-5 w-5" />
            Directions
          </Button>
        </div>

        {/* Restaurant Info */}
        <Card className="mb-6">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">{restaurant.hours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <Card className="flex-1">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{restaurant.photoCount}</div>
              <p className="text-sm text-muted-foreground">Photos</p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{restaurant.rating}</div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Photos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Photos</h2>
            <Badge variant="secondary">{restaurant.photoCount} total</Badge>
          </div>

          <GridLayout>
            {recentPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group cursor-pointer">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={photo.url}
                    alt="Restaurant photo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
                    <p className="text-white text-sm font-medium">{photo.user}</p>
                    <p className="text-white/80 text-xs">{photo.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </GridLayout>

          <Button variant="outline" className="w-full mt-4">
            Load More Photos
          </Button>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardContent className="p-6 text-center">
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
            <p className="text-primary-foreground/80 mb-4">
              Upload a photo and earn 5% off your next visit!
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/camera">
                <Camera className="mr-2 h-5 w-5" />
                Upload Photo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </ScreenLayout>
    </AppLayout>
  );
};

export default RestaurantDetail;
