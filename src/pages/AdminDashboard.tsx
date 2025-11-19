import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Image as ImageIcon, User, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PendingPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  tags: string[] | null;
  timestamp: string | null;
  user_id: string;
  restaurant_id: string;
  restaurant: {
    name: string;
    address: string | null;
  } | null;
  user_profile?: {
    display_name: string | null;
  } | null;
}

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingPhotos();
    }
  }, [isAdmin]);

  const fetchPendingPhotos = async () => {
    try {
      const { data: photos, error } = await supabase
        .from('restaurant_photos')
        .select(`
          *,
          restaurant:restaurants(name, address)
        `)
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
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

        setPendingPhotos(photosWithProfiles);
      } else {
        setPendingPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching pending photos:', error);
      toast({
        title: "Error",
        description: "Failed to load pending photos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (photoId: string, userId: string, restaurantId: string) => {
    setProcessingId(photoId);
    try {
      // 1. Mark photo as verified
      const { error: verifyError } = await supabase
        .from('restaurant_photos')
        .update({ verified: true })
        .eq('id', photoId);

      if (verifyError) throw verifyError;

      // 2. Generate discount code
      const discountCode = `AMB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

      const { error: discountError } = await supabase
        .from('discounts')
        .insert({
          user_id: userId,
          restaurant_id: restaurantId,
          photo_id: photoId,
          discount_percentage: 5,
          qr_code: discountCode,
          expires_at: expiresAt.toISOString(),
        });

      if (discountError) throw discountError;

      toast({
        title: "Photo Verified",
        description: "Photo approved and discount generated successfully!",
      });

      // Refresh the list
      fetchPendingPhotos();
    } catch (error) {
      console.error('Error verifying photo:', error);
      toast({
        title: "Error",
        description: "Failed to verify photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (photoId: string) => {
    setProcessingId(photoId);
    try {
      const { error } = await supabase
        .from('restaurant_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Photo Rejected",
        description: "Photo has been removed from the system.",
      });

      fetchPendingPhotos();
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast({
        title: "Error",
        description: "Failed to reject photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <ScreenLayout>
        <div className="py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Review and verify uploaded restaurant photos</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/10">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingPhotos.length}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Photos */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pending Photos</h2>
            
            {pendingPhotos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No pending photos to review</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={photo.image_url}
                        alt="Pending review"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3" variant="secondary">
                        Pending Review
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{photo.restaurant?.name}</CardTitle>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{photo.user_profile?.display_name || 'Anonymous User'}</span>
                        </div>
                        {photo.timestamp && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(photo.timestamp).toLocaleDateString()}</span>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {photo.caption && (
                        <div>
                          <p className="text-sm font-medium mb-1">Caption:</p>
                          <p className="text-sm text-muted-foreground">{photo.caption}</p>
                        </div>
                      )}
                      {photo.tags && photo.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Tags:</p>
                          <div className="flex flex-wrap gap-2">
                            {photo.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleVerify(photo.id, photo.user_id, photo.restaurant_id)}
                          disabled={processingId === photo.id}
                          className="flex-1"
                        >
                          {processingId === photo.id ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve & Generate Discount
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(photo.id)}
                          disabled={processingId === photo.id}
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScreenLayout>
    </AppLayout>
  );
};

export default AdminDashboard;
