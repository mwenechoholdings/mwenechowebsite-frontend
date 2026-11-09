import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Heart } from "lucide-react";
import livestock from "@/assets/livestock.jpg";

const Team = () => {
  const teamMembers = [
    {
      name: "Mr. James Gabriel Chilita",
      role: "Founder & Managing Director",
      credentials: "MBA",
      bio: "Visionary leader with expertise in sustainable development and community empowerment. James founded Mwenecho Holdings to create a unique agri-tourism destination that celebrates Malawian culture while promoting sustainable practices.",
    },
    {
      name: "Farm Management Team",
      role: "Agricultural Operations",
      bio: "Our experienced farm managers oversee daily operations, ensuring sustainable farming practices and the wellbeing of our livestock. They guide visitors through authentic farming experiences.",
    },
    {
      name: "Cultural Coordinators",
      role: "Cultural Programs",
      bio: "Local cultural experts who organize traditional dance performances, storytelling sessions, and craft workshops. They ensure authentic representation of Malawian traditions.",
    },
    {
      name: "Guest Services Team",
      role: "Hospitality & Lodging",
      bio: "Dedicated professionals who manage our eco-lodges and ensure every guest has a comfortable, memorable stay while maintaining our commitment to sustainability.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero
        eyebrow="Our team"
        title="Meet the people bringing our agricultural vision to life."
        description="Experienced leaders, local specialists, and hospitality professionals united by sustainable farming and cultural stewardship."
        image={livestock}
        imageAlt="Livestock grazing at Mwenecho Holdings"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10">
          <div className="max-w-4xl mx-auto text-center hero-panel p-10">
            <p className="text-xl text-muted-foreground">
              Dedicated professionals and community members working together to deliver exceptional experiences across agriculture, culture, and hospitality.
            </p>
          </div>

          <div className="space-y-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border border-border shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-accent font-semibold mb-4">
                        {member.role}
                        {member.credentials && ` (${member.credentials})`}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="section-surface shadow-xl p-6">
              <CardContent className="p-0 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Community Partnerships</h3>
                <p className="text-muted-foreground">
                  We work closely with local farmers, artisans, and cultural groups to create authentic experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-xl p-6">
              <CardContent className="p-0 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Expert Guides</h3>
                <p className="text-muted-foreground">
                  Our knowledgeable guides are passionate locals who share their expertise and cultural heritage.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-xl p-6">
              <CardContent className="p-0 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Dedicated Service</h3>
                <p className="text-muted-foreground">
                  Every team member is committed to providing warm hospitality and unforgettable experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
