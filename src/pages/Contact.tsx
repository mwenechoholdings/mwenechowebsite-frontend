import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchWebDetails, submitInquiry } from "@/service/api";

interface WebDetails {
  business_name?: string;
  business_description?: string;
  phone?: string;
  email?: string;
  secondary_email?: string;
  fax?: string;
  business_address?: string;
  website_url?: string;
  logo_url?: string;
  map_latitude?: number | string;
  map_longitude?: number | string;
  map_zoom?: number | string;
  business_hours?: Record<string, { open: string; close: string }>;
  social_media?: Record<string, string>;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact = () => {
  const [webDetails, setWebDetails] = useState<WebDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    loadWebDetails();
  }, []);

  const loadWebDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchWebDetails();
      setWebDetails(data);
    } catch (error) {
      console.error("Error loading web details:", error);
      toast.error("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await submitInquiry({
        type: "contact",
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || null,
        message: formData.message,
      });

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatBusinessHours = () => {
    if (!webDetails?.business_hours) return null;
    
    const today = new Date()
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const todayHours = webDetails.business_hours[today];
    
    if (!todayHours) return null;
    
    if (todayHours.open === '00:00' && todayHours.close === '00:00') {
      return 'Closed today';
    }
    
    return `Today: ${todayHours.open} — ${todayHours.close}`;
  };

  const getMapEmbedUrl = () => {
    if (webDetails?.map_latitude != null && webDetails?.map_longitude != null) {
      const latitude = Number(webDetails.map_latitude);
      const longitude = Number(webDetails.map_longitude);
      const zoom = Number(webDetails.map_zoom ?? 15) || 15;

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      const bbox = 0.01 / Math.pow(2, zoom - 15);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - bbox},${latitude - bbox},${longitude + bbox},${latitude + bbox}&layer=mapnik&marker=${latitude},${longitude}`;
    }

    if (webDetails?.business_address) {
      return `https://www.openstreetmap.org/search?query=${encodeURIComponent(webDetails.business_address)}`;
    }

    return null;
  };

  const getMapLinkUrl = () => {
    if (webDetails?.map_latitude != null && webDetails?.map_longitude != null) {
      const latitude = Number(webDetails.map_latitude);
      const longitude = Number(webDetails.map_longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
    }

    if (webDetails?.business_address) {
      return `https://www.openstreetmap.org/search?query=${encodeURIComponent(webDetails.business_address)}`;
    }

    return null;
  };

  const mapEmbedUrl = getMapEmbedUrl();
  const mapLinkUrl = getMapLinkUrl();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Contact Us</h1>
        {webDetails?.business_name && (
          <p className="text-2xl font-medium text-primary text-center mb-2">
            {webDetails.business_name}
          </p>
        )}
        <p className="text-xl text-muted-foreground text-center mb-4 max-w-3xl mx-auto">
          Have questions or want to learn more? We're here to help. Reach out to us anytime!
        </p>
        {webDetails?.business_description && (
          <p className="text-base text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            {webDetails.business_description}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-6">
              {webDetails?.phone && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Phone</h3>
                        <p className="text-muted-foreground">{webDetails.phone}</p>
                        {webDetails.secondary_email && (
                          <p className="text-muted-foreground text-sm mt-1">(Alternative contact available)</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {webDetails?.email && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Email</h3>
                        <p className="text-muted-foreground">{webDetails.email}</p>
                        {webDetails.secondary_email && (
                          <p className="text-muted-foreground text-sm">{webDetails.secondary_email}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {webDetails?.business_address && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Location</h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {webDetails.business_address}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {webDetails?.website_url && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Globe className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Website</h3>
                        <a
                          href={webDetails.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-accent transition-colors break-all"
                        >
                          {webDetails.website_url}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {webDetails?.fax && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Fax</h3>
                        <p className="text-muted-foreground">{webDetails.fax}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {mapEmbedUrl && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Find Us on OpenStreetMap</h3>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <iframe
                        title="Company location"
                        src={mapEmbedUrl}
                        className="w-full h-72"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    {mapLinkUrl && (
                      <a
                        href={mapLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex text-sm text-primary hover:text-accent transition-colors"
                      >
                        Open in OpenStreetMap
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {webDetails?.business_hours && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Business Hours</h3>
                        <p className="text-muted-foreground text-sm font-semibold mb-2">
                          {formatBusinessHours()}
                        </p>
                        <div className="space-y-1">
                          {Object.entries(webDetails.business_hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-sm text-muted-foreground">
                              <span className="capitalize">{day}</span>
                              <span>
                                {hours.open === '00:00' && hours.close === '00:00'
                                  ? 'Closed'
                                  : `${hours.open} — ${hours.close}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {webDetails?.social_media && Object.values(webDetails.social_media).some(v => v) && (
                <Card className="bg-muted">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">Follow Us</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Stay connected and follow our journey on social media for updates and announcements.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {webDetails.social_media.facebook && (
                        <a
                          href={webDetails.social_media.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-accent transition-colors text-sm"
                        >
                          Facebook
                        </a>
                      )}
                      {webDetails.social_media.instagram && (
                        <a
                          href={webDetails.social_media.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-accent transition-colors text-sm"
                        >
                          Instagram
                        </a>
                      )}
                      {webDetails.social_media.twitter && (
                        <a
                          href={webDetails.social_media.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-accent transition-colors text-sm"
                        >
                          Twitter
                        </a>
                      )}
                      {webDetails.social_media.linkedin && (
                        <a
                          href={webDetails.social_media.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:text-accent transition-colors text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
