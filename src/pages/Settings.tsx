import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Bell,
  MapPin,
  Moon,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Trash2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    locationServices: true,
    darkMode: false,
    discountAlerts: true,
    weeklyDigest: false,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
    navigate("/login");
  };

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          id: "pushNotifications",
          label: "Push Notifications",
          description: "Receive updates about your discounts and activity",
        },
        {
          id: "emailNotifications",
          label: "Email Notifications",
          description: "Get weekly summaries and important updates via email",
        },
        {
          id: "discountAlerts",
          label: "Discount Alerts",
          description: "Notify me when my discounts are about to expire",
        },
        {
          id: "weeklyDigest",
          label: "Weekly Digest",
          description: "Receive a summary of nearby restaurants and offers",
        },
      ],
    },
    {
      title: "Privacy & Location",
      icon: MapPin,
      items: [
        {
          id: "locationServices",
          label: "Location Services",
          description: "Allow AmbienSee to access your location for nearby restaurants",
        },
      ],
    },
    {
      title: "Appearance",
      icon: Moon,
      items: [
        {
          id: "darkMode",
          label: "Dark Mode",
          description: "Switch between light and dark theme",
        },
      ],
    },
  ];

  const navigationItems = [
    { icon: Shield, label: "Account Security", path: "/security" },
    { icon: Globe, label: "Language & Region", path: "/language" },
    { icon: HelpCircle, label: "Help & Support", path: "/support" },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="flex items-center justify-between py-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
            <div className="w-10" />
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        <div className="py-6 space-y-6">
          {/* Settings Sections */}
          {settingsSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor={item.id} className="text-base font-medium cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.id}
                        checked={settings[item.id as keyof typeof settings]}
                        onCheckedChange={(checked) => updateSetting(item.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Navigation Items */}
          <Card>
            <CardContent className="p-0">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth ${
                    index !== navigationItems.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Delete Account",
                    description: "This feature will be available in Phase 5",
                  });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>AmbienSee v1.0.0</p>
            <p className="mt-1">© 2024 AmbienSee. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/terms" className="hover:text-primary">Terms</Link>
              <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            </div>
          </div>
        </div>
      </ScreenLayout>
    </AppLayout>
  );
};

export default Settings;
