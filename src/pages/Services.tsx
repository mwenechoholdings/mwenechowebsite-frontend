import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchServices } from "@/service/api"; // Path to your api.js
import { Leaf, Music, ShoppingBag, Globe, Users, Loader2 } from "lucide-react";
import livestock from "@/assets/livestock.jpg";
import culturalDance from "@/assets/cultural-dance.jpg";

// Define the shape of our Service data
interface Service {
  id: number;
  name: string;
  description: string[]; // This is now an array from Laravel
  price: string;
  category: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await fetchServices();
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  // Helper to assign icons/images based on category or name
  const getServiceAssets = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("agri") || lowerName.includes("farm")) 
        return { icon: <Leaf className="h-8 w-8 text-primary mr-3" />, img: livestock };
    if (lowerName.includes("cultural") || lowerName.includes("dance")) 
        return { icon: <Music className="h-8 w-8 text-primary mr-3" />, img: culturalDance };
    if (lowerName.includes("trade") || lowerName.includes("export")) 
        return { icon: <Globe className="h-8 w-8 text-primary mr-3" />, img: null };
    return { icon: <ShoppingBag className="h-8 w-8 text-primary mr-3" />, img: null };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <PageHero
        eyebrow="Services & experiences"
        title="Heritage services grounded in sustainable agriculture and culture."
        description="Explore our carefully curated activities—from estate farming and community tourism to agricultural trade and export services."
        image={livestock}
        imageAlt="Livestock at the Mwenecho Holdings farm"
      />

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-10">
            {services.map((service, index) => {
              const { icon, img } = getServiceAssets(service.name);
              const isEven = index % 2 === 0;

              return (
                <Card key={service.id} className="overflow-hidden border border-border shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className={`relative h-72 ${!isEven ? 'lg:order-2' : ''}`}>
                      {img ? (
                        <img src={img} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          {icon}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-primary-foreground">
                        <p className="text-sm uppercase tracking-[0.32em] font-semibold">{service.category}</p>
                      </div>
                    </div>

                    <CardContent className={`p-10 ${!isEven ? 'lg:order-1' : ''}`}>
                      <div className="mb-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="rounded-full bg-secondary/10 p-3 text-secondary">{icon}</div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Service</p>
                            <h2 className="text-3xl font-serif font-semibold text-foreground">{service.name}</h2>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{service.description.join(' ')}</p>
                      </div>

                      <div className="grid gap-3">
                        {service.description.map((point, idx) => (
                          <div key={idx} className="rounded-md border border-border bg-muted p-4 text-muted-foreground">
                            <span className="block font-semibold text-foreground mb-1">{idx + 1}. </span>
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-muted-foreground text-sm">Starting at</p>
                          <p className="text-3xl font-bold text-primary">${service.price}</p>
                        </div>
                        <Link to="/contact" className="w-full sm:w-auto">
                          <Button size="lg" className="w-full sm:w-auto">Inquire Now</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;