import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Bell, Gift, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const onboardingSteps = [
  {
    icon: Camera,
    title: "Share Your Experience",
    description: "Take photos of your meals and the restaurant ambience. Your authentic content helps fellow food lovers make informed decisions.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Gift,
    title: "Earn Instant Rewards",
    description: "Get a 5% discount code instantly after uploading. Use it on your next visit to any participating restaurant.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MapPin,
    title: "Discover Nearby",
    description: "We'll help you find great restaurants nearby using your location. See real-time photos from the community before you visit.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    permission: "location",
  },
  {
    icon: Bell,
    title: "Stay Updated",
    description: "Get notified about new restaurants, special offers, and when your discount codes are about to expire.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    permission: "notifications",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const requestPermission = async (type: "location" | "notifications") => {
    try {
      if (type === "location") {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => {
              setPermissions((prev) => ({ ...prev, location: true }));
              toast({
                title: "Location Access Granted",
                description: "We can now show you nearby restaurants!",
              });
            },
            () => {
              toast({
                title: "Location Access Denied",
                description: "You can enable this later in settings.",
                variant: "destructive",
              });
            }
          );
        }
      } else if (type === "notifications") {
        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            setPermissions((prev) => ({ ...prev, notifications: true }));
            toast({
              title: "Notifications Enabled",
              description: "You'll receive updates about your rewards!",
            });
          } else {
            toast({
              title: "Notifications Denied",
              description: "You can enable this later in settings.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Permission error:", error);
    }
  };

  const handleNext = async () => {
    const permission = currentStepData.permission as "location" | "notifications" | undefined;
    if (permission && !permissions[permission]) {
      await requestPermission(permission);
    }

    if (isLastStep) {
      navigate("/dashboard");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <Card className="border-0 shadow-elevated">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <div className={`p-6 rounded-2xl ${currentStepData.bgColor}`}>
                    <currentStepData.icon className={`h-16 w-16 ${currentStepData.color}`} />
                  </div>
                </div>

                <Badge className="mb-4">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </Badge>

                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {currentStepData.title}
                </h1>

                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {currentStepData.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="sm:w-auto"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  {isLastStep ? "Get Started" : "Continue"}
                  {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>

                {!isLastStep && (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="sm:w-auto"
                  >
                    Skip
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Onboarding;
