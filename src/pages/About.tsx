import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart } from "lucide-react";
import ecoLodge from "@/assets/eco-lodge.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero
        eyebrow="Our story"
        title="Built on heritage agriculture, community impact, and authentic Malawian hospitality."
        description="Mwenecho Holdings is grounded in sustainable farming, cultural preservation, and an immersive guest experience rooted in Malawi’s natural beauty."
        image={ecoLodge}
        imageAlt="Eco-lodge at Mwenecho Holdings"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-14">
          <section className="space-y-6">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mwenecho Holdings Ltd was founded with a vision to create a unique destination that celebrates the rich agricultural heritage and vibrant culture of Malawi. Located in the scenic district of Mangochi, our 9 hectares of owned land serve as the foundation for sustainable farming practices, cultural preservation, and eco-tourism excellence.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted p-6 sm:p-8">
              <h3 className="text-3xl font-semibold text-foreground mb-4">Leadership</h3>
              <Card>
                <CardContent className="p-8 bg-white/80 backdrop-blur-sm shadow-sm">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Mr. James Gabriel Chilita</h3>
                  <p className="text-accent font-semibold mb-4">Founder & Managing Director (MBA)</p>
                  <p className="text-muted-foreground leading-relaxed">
                    With a Master of Business Administration and a passion for sustainable development, Mr. Chilita brings visionary leadership to Mwenecho Holdings. His commitment to community empowerment and cultural preservation drives our mission to create meaningful experiences that benefit both visitors and local communities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-3">Mission</h3>
                    <p className="text-muted-foreground">
                      To provide authentic agri-tourism experiences that promote sustainable farming and preserve Malawian culture.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-3">Vision</h3>
                    <p className="text-muted-foreground">
                      To be the leading agri-tourism destination in the region, recognized for community impact and cultural authenticity.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-3">Core Values</h3>
                    <p className="text-muted-foreground">
                      Sustainability, cultural respect, community empowerment, and exceptional guest experiences.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted p-6 sm:p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Mangochi: Our Home</h2>
              <div className="grid gap-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mangochi is a stunning district in southern Malawi, known for its natural beauty and rich cultural heritage. Located near Lake Malawi, the region offers breathtaking landscapes including the majestic Nkungulu Hills that surround our property.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The area is home to diverse communities with deep-rooted traditions in farming, fishing, and craftsmanship. By choosing Mwenecho Holdings, you&apos;re not just visiting a destination—you&apos;re becoming part of a community committed to sustainable development and cultural preservation.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-6 shadow-sm sm:p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Makes Us Unique</h2>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-accent">✓</span>
                  <span>First-of-its-kind agri-tourism experience in the region</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-accent">✓</span>
                  <span>9 hectares of owned, debt-free land with eco-driven operations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-accent">✓</span>
                  <span>Authentic cultural experiences led by local communities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-accent">✓</span>
                  <span>Sustainable farming practices with hands-on learning opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-accent">✓</span>
                  <span>Community empowerment through training and partnerships</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
