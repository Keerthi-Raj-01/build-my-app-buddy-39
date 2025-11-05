import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, QrCode, Clock, MapPin, CheckCircle2 } from "lucide-react";
import QRCodeLib from "qrcode";

interface Discount {
  id: number;
  restaurant: string;
  percentage: number;
  code: string;
  expiresAt: Date;
  usedAt?: Date;
  address: string;
}

const Discounts = () => {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const activeDiscounts: Discount[] = [
    {
      id: 1,
      restaurant: "Sunset Bistro",
      percentage: 5,
      code: "AMB-SB-2024-001",
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      address: "123 Main Street",
    },
    {
      id: 2,
      restaurant: "Urban Kitchen",
      percentage: 5,
      code: "AMB-UK-2024-002",
      expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      address: "456 Oak Avenue",
    },
  ];

  const usedDiscounts: Discount[] = [
    {
      id: 3,
      restaurant: "The Garden Cafe",
      percentage: 5,
      code: "AMB-GC-2024-003",
      expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      usedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      address: "789 Pine Road",
    },
  ];

  useEffect(() => {
    if (selectedDiscount) {
      generateQRCode(selectedDiscount.code);
    }
  }, [selectedDiscount]);

  const generateQRCode = async (code: string) => {
    try {
      const url = await QRCodeLib.toDataURL(code, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error("QR Code generation error:", error);
    }
  };

  const calculateDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <AppLayout>
      <div className="border-b bg-card">
        <ScreenLayout>
          <div className="py-4">
            <h1 className="text-2xl font-bold mb-2">My Discounts</h1>
            <p className="text-muted-foreground">
              Earn 5% off by uploading restaurant photos
            </p>
          </div>
        </ScreenLayout>
      </div>

      <ScreenLayout>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">
              Active ({activeDiscounts.length})
            </TabsTrigger>
            <TabsTrigger value="used">
              Used ({usedDiscounts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeDiscounts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Active Discounts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload photos to earn discounts!
                  </p>
                  <Button>Upload Photo</Button>
                </CardContent>
              </Card>
            ) : (
              activeDiscounts.map((discount) => {
                const daysRemaining = calculateDaysRemaining(discount.expiresAt);
                return (
                  <Card key={discount.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-primary text-primary-foreground">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                          {discount.percentage}% OFF
                        </CardTitle>
                        <Gift className="h-8 w-8" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {discount.restaurant}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{discount.address}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Expires in{" "}
                          <span
                            className={
                              daysRemaining <= 7
                                ? "text-destructive font-semibold"
                                : "font-semibold"
                            }
                          >
                            {daysRemaining} days
                          </span>
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => setSelectedDiscount(discount)}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR Code
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="used" className="space-y-4">
            {usedDiscounts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Used Discounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Your discount history will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              usedDiscounts.map((discount) => (
                <Card key={discount.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {discount.restaurant}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{discount.address}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        {discount.percentage}% OFF
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>
                        Used on{" "}
                        {discount.usedAt?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </ScreenLayout>

      {/* QR Code Modal */}
      <Dialog
        open={!!selectedDiscount}
        onOpenChange={() => setSelectedDiscount(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedDiscount?.restaurant}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full h-auto"
                />
              )}
            </div>

            <div className="text-center">
              <Badge className="mb-2" variant="secondary">
                {selectedDiscount?.percentage}% OFF
              </Badge>
              <p className="text-sm text-muted-foreground">
                Show this QR code to the staff
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {selectedDiscount?.code}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Discount expires in
              </p>
              <p className="font-semibold">
                {selectedDiscount &&
                  calculateDaysRemaining(selectedDiscount.expiresAt)}{" "}
                days
              </p>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Terms: Valid for one-time use. Cannot be combined with other
              offers.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Discounts;
