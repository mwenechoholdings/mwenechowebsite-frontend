import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/livestock.jpg";
import landscapeImage from "@/assets/hero-farm.jpg";
import culturalDance from "@/assets/cultural-dance.jpg";
import livestock from "@/assets/livestock.jpg";
import { ArrowRight, Calendar, MapPin, Award, Users, Globe, ShieldCheck, Truck, Leaf, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative h-[calc(100svh-190px)] min-h-[430px] max-h-[700px] overflow-hidden bg-slate-950">
        <img src={heroImage} alt="Livestock grazing at Mwenecho Holdings in Malawi" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

        <div className="container relative z-10 mx-auto flex h-full items-center px-6 sm:px-8">
          <div className="animate-fade-up max-w-3xl py-10 text-white">
            <div className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
              <span className="h-px w-9 bg-amber-300" />
              Agriculture, culture & trade
            </div>
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.04] text-white sm:text-6xl md:text-7xl">
              Mwenecho Holdings
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Rooted in Malawi. Growing a future through sustainable agriculture, authentic culture, and thoughtful trade.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/book">
                <Button className="h-12 w-full gap-2 rounded-md bg-amber-400 px-6 font-semibold text-slate-950 hover:bg-amber-300 sm:w-auto">
                  Plan a visit <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="h-12 w-full rounded-md border-white/50 bg-white/5 px-6 text-white hover:bg-white/15 hover:text-white sm:w-auto">
                  Discover our story
                </Button>
              </Link>
            </div>
            <p className="mt-8 flex items-center gap-2 text-sm text-white/75">
              <MapPin className="h-4 w-4 text-amber-300" /> Mangochi, Malawi
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="container mx-auto grid grid-cols-2 gap-y-7 px-6 py-8 sm:grid-cols-4 sm:gap-0 sm:py-7">
          {[
            { icon: MapPin, title: "9 hectares", desc: "in Mangochi" },
            { icon: Leaf, title: "Sustainable", desc: "farming practices" },
            { icon: Users, title: "Community-led", desc: "local partnerships" },
            { icon: Globe, title: "Connected", desc: "to global markets" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 sm:justify-center sm:border-l sm:border-border first:sm:border-l-0">
              <item.icon className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="animate-fade-in relative overflow-hidden rounded-md">
            <img src={landscapeImage} alt="The landscape and hills surrounding the Mwenecho Holdings farm" className="h-[360px] w-full object-cover sm:h-[480px]" />
            <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-3 shadow-lg shadow-slate-950/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our home</p>
              <p className="mt-1 text-sm font-medium text-slate-900">Mangochi, Malawi</p>
            </div>
          </div>

          <div className="animate-fade-up">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4" />
              Rooted in purpose
            </div>
            <h2 className="mb-5 max-w-xl text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">A place where land, culture, and opportunity meet.</h2>
            <p className="mb-8 max-w-2xl leading-7 text-slate-600">
              From sustainable farming to cultural experiences and dependable trade, we bring people closer to the richness and possibility of Malawi.
            </p>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {[
                { icon: ShieldCheck, title: "Care in every detail", description: "Quality produce and guest experiences delivered with care." },
                { icon: Truck, title: "Trade that connects", description: "Reliable export and import support for local and global partners." },
                { icon: Leaf, title: "A future worth growing", description: "Responsible practices that support land and community." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 py-4">
                  <item.icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4 sm:gap-8 sm:px-8">
          {[
            { icon: MapPin, title: "9 Hectares", desc: "Mangochi, Malawi" },
            { icon: Award, title: "Trusted Quality", desc: "Organic produce" },
            { icon: Users, title: "Community First", desc: "Local partnerships" },
            { icon: Calendar, title: "Open Daily", desc: "Farm visits & tours" },
          ].map((stat, index) => (
            <div key={index} className="animate-fade-up text-center">
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold text-slate-900">{stat.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

            {/* --- NEW: Export/Import Section --- */}
            <section className="container mx-auto px-4 py-16">
                <div className="animate-fade-up rounded-lg border border-border bg-muted p-6 shadow-sm md:p-10">
                    <div className="text-center mb-8">
                        {/* EDITED: text-4xl -> text-3xl on mobile */}
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Agricultural Trade Services
                        </h2>
                        {/* EDITED: text-xl -> text-base on mobile */}
                        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Connecting Malawian farmers to global markets while bringing quality agricultural 
                            products and essential equipment to local producers.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold text-foreground mb-3">Export Services</h3>
                                <p className="text-muted-foreground mb-4">
                                    We export premium Malawian agricultural products including organic maize, 
                                    livestock products, and fresh produce to international markets. All exports 
                                    meet international quality standards and certifications.
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Organic crops and grains</li>
                                    <li>Dairy and livestock products</li>
                                    <li>Fresh fruits and vegetables</li>
                                    <li>Traditional Malawian products</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold text-foreground mb-3">Import Services</h3>
                                <p className="text-muted-foreground mb-4">
                                    We import high-quality farming equipment, seeds, and agricultural supplies 
                                    to support local farmers and enhance productivity across the region.
                                </p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                    <li>Modern farming equipment</li>
                                    <li>Quality seeds and fertilizers</li>
                                    <li>Agricultural technology</li>
                                    <li>Livestock feed and supplies</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            {/* --- END NEW SECTION --- */}

            {/* Services Overview */}
            <section className="container mx-auto px-4 py-20">
                <div className="animate-fade-up text-center mb-12">
                    {/* EDITED: text-4xl -> text-3xl on mobile */}
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Offerings</h2>
                    {/* EDITED: text-xl -> text-base on mobile */}
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover authentic Malawian experiences through our diverse services
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 overflow-hidden">
                            <img src={livestock} alt="Agri-Tourism" className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-foreground mb-3">Agri-Tourism</h3>
                            <p className="text-muted-foreground mb-4">
                                Guided farm visits, hands-on farming activities, and livestock shows featuring goats, ducks, sheep, and chickens.
                            </p>
                            <Link to="/services">
                                <Button variant="outline" className="w-full">Learn More</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 overflow-hidden">
                            <img src={culturalDance} alt="Cultural Events" className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-foreground mb-3">Cultural Events</h3>
                            <p className="text-muted-foreground mb-4">
                                Traditional dance festivals, storytelling sessions, and craft markets celebrating authentic Malawian culture.
                            </p>
                            <Link to="/events">
                                <Button variant="outline" className="w-full">View Events</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* --- NEW/REPLACED SERVICE CARD: Agricultural Trade --- */}
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                        <div className="h-48 overflow-hidden bg-muted flex items-center justify-center">
                            {/* Using the Globe icon as a placeholder for a trade-related image */}
                            <Globe className="h-16 w-16 text-primary" /> 
                            {/* You can use a dedicated image like: <img src={tradeIcon} alt="Agricultural Trade" className="w-full h-full object-cover" /> */}
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-foreground mb-3">Agricultural Trade</h3>
                            <p className="text-muted-foreground mb-4">
                                Specializing in the <b>export</b> of premium Malawian produce and the <b>import</b> of essential farming equipment and supplies.
                            </p>
                            <Link to="#trade-services"> {/* Link to the new section above */}
                                <Button variant="outline" className="w-full">View Trade Services</Button>
                            </Link>
                        </CardContent>
                    </Card>
                    {/* --- END REPLACED SERVICE CARD --- */}

                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-primary to-secondary py-20">
                <div className="container mx-auto px-4 text-center">
                    {/* EDITED: text-4xl -> text-3xl on mobile */}
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                        Ready to Partner or Explore?
                    </h2>
                    {/* EDITED: text-xl -> text-base on mobile */}
                    <p className="text-base md:text-xl text-primary-foreground mb-8 max-w-2xl mx-auto opacity-95">
                        Join us for an unforgettable journey through sustainable farming, rich culture, and global trade connections.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" variant="secondary" className="text-lg">
                            Get in Touch
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Index;