import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-farm.jpg";
import culturalDance from "@/assets/cultural-dance.jpg";
import tradeIcon from "@/assets/trade-icon.svg"; // 💡 Placeholder for a trade-related image/icon
import livestock from "@/assets/livestock.jpg";
import { Calendar, MapPin, Award, Users, Globe } from "lucide-react"; // 💡 Added Globe icon

const Index = () => {
    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />
                </div>

                <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl">
                    {/* EDITED: text-5xl -> text-4xl on mobile (default) */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Experience Malawi's Rich Culture & Nature
                    </h1>
                    {/* EDITED: text-xl -> text-lg on mobile (default) */}
                    <p className="text-lg md:text-2xl mb-8 opacity-95">
                        Located in the heart of Mangochi, Mwenecho Holdings blends sustainable farming, 
                        <b> agricultural trade</b>, and cultural tourism into one unforgettable experience.
                        {/* Removed: and eco-lodging */}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/events">
                            <Button size="lg" className="text-lg bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground backdrop-blur-sm hover:bg-primary-foreground hover:text-primary">
                                Explore Cultural Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { icon: MapPin, title: "9 Hectares", desc: "Owned Land" },
                        { icon: Award, title: "First of Its Kind", desc: "Agri-Tourism in Region" },
                        { icon: Users, title: "Community Focused", desc: "Empowerment Programs" },
                        { icon: Calendar, title: "Year-Round", desc: "Events & Activities" },
                    ].map((stat, index) => (
                        <Card key={index} className="bg-card shadow-lg">
                            <CardContent className="p-6 text-center">
                                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">{stat.title}</h3>
                                <p className="text-muted-foreground">{stat.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* --- NEW: Export/Import Section --- */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
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
                <div className="text-center mb-12">
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
                        <div className="h-48 overflow-hidden bg-primary/20 flex items-center justify-center">
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