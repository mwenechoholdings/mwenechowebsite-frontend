import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-foreground mb-6 text-center">About Mwenecho Holdings</h1>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mwenecho Holdings Ltd was founded with a vision to create a unique destination that celebrates 
              the rich agricultural heritage and vibrant culture of Malawi. Located in the scenic district of 
              Mangochi, our 9 hectares of owned land serve as the foundation for sustainable farming practices, 
              cultural preservation, and eco-tourism excellence.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-primary mb-4">Leadership</h2>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Mr. James Gabriel Chilita</h3>
                <p className="text-accent font-semibold mb-4">Founder & Managing Director (MBA)</p>
                <p className="text-muted-foreground leading-relaxed">
                  With a Master of Business Administration and a passion for sustainable development, 
                  Mr. Chilita brings visionary leadership to Mwenecho Holdings. His commitment to community 
                  empowerment and cultural preservation drives our mission to create meaningful experiences 
                  that benefit both visitors and local communities.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-primary mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Mission</h3>
                  <p className="text-muted-foreground">
                    To provide authentic agri-tourism experiences that promote sustainable farming 
                    and preserve Malawian culture.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Vision</h3>
                  <p className="text-muted-foreground">
                    To be the leading agri-tourism destination in the region, 
                    recognized for community impact and cultural authenticity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Core Values</h3>
                  <p className="text-muted-foreground">
                    Sustainability, cultural respect, community empowerment, 
                    and exceptional guest experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-primary mb-4">Mangochi: Our Home</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Mangochi is a stunning district in southern Malawi, known for its natural beauty and rich cultural heritage. 
              Located near Lake Malawi, the region offers breathtaking landscapes including the majestic Nkungulu Hills 
              that surround our property.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The area is home to diverse communities with deep-rooted traditions in farming, fishing, and craftsmanship. 
              By choosing Mwenecho Holdings, you're not just visiting a destination—you're becoming part of a community 
              committed to sustainable development and cultural preservation.
            </p>
          </section>

          <section className="bg-muted rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary mb-4">What Makes Us Unique</h2>
            <ul className="space-y-3 text-lg text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span>First-of-its-kind agri-tourism experience in the region</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span>9 hectares of owned, debt-free land with eco-driven operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span>Authentic cultural experiences led by local communities</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span>Sustainable farming practices with hands-on learning opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-3">✓</span>
                <span>Community empowerment through training and partnerships</span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
