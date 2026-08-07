import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Our Services</h1>
        <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Discover the diverse experiences we offer—from hands-on farming and cultural celebrations to global agricultural trade.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-12">
            {services.map((service, index) => {
              const { icon, img } = getServiceAssets(service.name);
              const isEven = index % 2 === 0;

              return (
                <Card key={service.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Alternate image position for design variety */}
                    <div className={`h-64 md:h-auto ${!isEven ? 'md:order-2' : ''}`}>
                      {img ? (
                        <img src={img} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                           {icon}
                        </div>
                      )}
                    </div>

                    <CardContent className={`p-8 ${!isEven ? 'md:order-1' : ''}`}>
                      <div className="flex items-center mb-4">
                        {icon}
                        <CardTitle className="text-3xl">{service.name}</CardTitle>
                      </div>
                      
                      {/* Description Bullet Points */}
                      <ul className="space-y-2 mb-6">
                        {service.description.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span className="text-muted-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between">
                         <span className="text-2xl font-bold text-primary">${service.price}</span>
                         <Link to="/contact">
                            <Button>Inquire Now</Button>
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