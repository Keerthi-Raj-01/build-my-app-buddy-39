import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, MapPin, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PhotoReview = () => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhoto = sessionStorage.getItem("capturedPhoto");
    if (storedPhoto) {
      setPhotoUrl(storedPhoto);
    } else {
      navigate("/camera");
    }
  }, [navigate]);

  const nearbyRestaurants = [
    { id: 1, name: "Sunset Bistro", distance: "0.5 mi" },
    { id: 2, name: "The Garden Cafe", distance: "1.2 mi" },
    { id: 3, name: "Urban Kitchen", distance: "2.1 mi" },
  ];

  const handleSubmit = async () => {
    if (!selectedRestaurant) {
      toast({
        title: "Restaurant Required",
        description: "Please select a restaurant for your photo.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval);
      setUploading(false);
      sessionStorage.removeItem("capturedPhoto");
      
      toast({
        title: "Photo Uploaded!",
        description: "You've earned a 5% discount for your next visit.",
      });
      
      navigate("/discounts");
    }, 2500);
  };

  if (!photoUrl) return null;

  return (
    <AppLayout>
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="flex items-center gap-4 py-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/camera">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Review Photo</h1>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        {/* Photo Preview */}
        <div className="mb-6 rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
          <img
            src={photoUrl}
            alt="Captured photo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Upload Form */}
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <Label htmlFor="restaurant">Restaurant *</Label>
            <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
              <SelectTrigger id="restaurant" className="mt-2">
                <SelectValue placeholder="Select restaurant" />
              </SelectTrigger>
              <SelectContent>
                {nearbyRestaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{restaurant.name}</span>
                      <Badge variant="outline" className="ml-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {restaurant.distance}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Can't find your restaurant? It will be added soon.
            </p>
          </div>

          <div>
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Textarea
              id="caption"
              placeholder="Describe your experience..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-2 min-h-24"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {caption.length}/200 characters
            </p>
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="e.g., great atmosphere, busy, romantic"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Location Confirmation */}
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-sm">Location verified</span>
            <Check className="h-4 w-4 text-accent ml-auto" />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              asChild
              disabled={uploading}
            >
              <Link to="/camera">Retake</Link>
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={uploading || !selectedRestaurant}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </div>
      </ScreenLayout>
    </AppLayout>
  );
};

export default PhotoReview;
