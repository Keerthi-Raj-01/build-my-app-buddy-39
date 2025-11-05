import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera as CameraIcon, SwitchCamera, Zap, ZapOff, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const Camera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    getLocation();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera access to upload photos.",
        variant: "destructive",
      });
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const photoUrl = URL.createObjectURL(blob);
            // Store photo URL in sessionStorage for the review page
            sessionStorage.setItem("capturedPhoto", photoUrl);
            navigate("/photo-review");
          }
        });
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      sessionStorage.setItem("capturedPhoto", photoUrl);
      navigate("/photo-review");
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            asChild
          >
            <Link to="/dashboard">
              <X className="h-6 w-6" />
            </Link>
          </Button>

          {location && (
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              <span className="text-xs">{location}</span>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setFlashEnabled(!flashEnabled)}
          >
            {flashEnabled ? <Zap className="h-6 w-6" /> : <ZapOff className="h-6 w-6" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center gap-8">
            {/* Gallery Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="w-12 h-12 rounded-lg border-2 border-white/50 flex items-center justify-center hover:bg-white/20 transition-smooth">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
            </label>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-smooth flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>

            {/* Switch Camera Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={switchCamera}
            >
              <SwitchCamera className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
