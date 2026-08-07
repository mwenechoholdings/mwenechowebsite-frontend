import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Heart } from "lucide-react";

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
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Meet Our Team</h1>
        <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Dedicated professionals and community members working together to deliver exceptional experiences.
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-6 flex-shrink-0">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-accent font-semibold mb-2">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Community Partnerships</h3>
              <p className="text-muted-foreground">
                We work closely with local farmers, artisans, and cultural groups to create authentic experiences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Expert Guides</h3>
              <p className="text-muted-foreground">
                Our knowledgeable guides are passionate locals who share their expertise and cultural heritage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Dedicated Service</h3>
              <p className="text-muted-foreground">
                Every team member is committed to providing warm hospitality and unforgettable experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
