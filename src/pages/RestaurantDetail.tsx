import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { GridLayout } from "@/components/layout/GridLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, MapPin, Phone, Clock, Share2, Navigation } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

interface VerifiedPhoto {
  id: string;
  image_url: string;
  timestamp: string;
  user_profile?: {
    display_name: string | null;
  } | null;
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const [verifiedPhotos, setVerifiedPhotos] = useState<VerifiedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifiedPhotos();
  }, [id]);

  const fetchVerifiedPhotos = async () => {
    try {
      const { data: photos, error } = await supabase
        .from('restaurant_photos')
        .select('*')
        .eq('restaurant_id', id || '')
        .eq('verified', true)
        .order('timestamp', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (photos && photos.length > 0) {
        const userIds = [...new Set(photos.map(p => p.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const photosWithProfiles = photos.map(photo => ({
          ...photo,
          user_profile: profileMap.get(photo.user_id) || null
        }));

        setVerifiedPhotos(photosWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching verified photos:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurant photos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const photoDate = new Date(timestamp);
    const diffMs = now.getTime() - photoDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

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
            <h2 className="text-xl font-bold">Verified Photos</h2>
            <Badge variant="secondary">{verifiedPhotos.length} verified</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : verifiedPhotos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">No verified photos yet</p>
                <p className="text-sm text-muted-foreground">Be the first to share this restaurant!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <GridLayout>
                {verifiedPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt="Restaurant photo"
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
                        <p className="text-white text-sm font-medium">
                          {photo.user_profile?.display_name || 'Anonymous'}
                        </p>
                        <p className="text-white/80 text-xs">{getTimeAgo(photo.timestamp || '')}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </GridLayout>
            </>
          )}
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
