// Events.tsx

import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import { Calendar, MapPin, Users, Clock, Loader2 } from "lucide-react";
import culturalDance from "@/assets/cultural-dance.jpg";

// 💡 Import the public-only fetch function
import { fetchEvents } from '@/service/api'; 
// 💡 Import the reusable CTA component (now includes the subscription form)
import StayUpdatedCta from "@/components/StayUpdatedCta"; 


// 🌐 Helper function to parse and format the start_time date
const formatDate = (datetimeString: string): { date: string, time: string } => {
    if (!datetimeString) return { date: 'N/A', time: 'N/A' };
    
    try {
        const date = new Date(datetimeString);
        
        // Format the date part (e.g., March 15, 2025)
        const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const datePart = date.toLocaleDateString('en-US', dateOptions);

        // Format the time part (e.g., 2:00 PM)
        const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const timePart = date.toLocaleTimeString('en-US', timeOptions);
        
        return { date: datePart, time: timePart };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { date: 'Invalid Date', time: 'Invalid Time' };
    }
}


const Events = () => {
    // State to hold fetched events
    const [events, setEvents] = useState<any[]>([]); 
    // State for loading indicator
    const [isLoading, setIsLoading] = useState(true); 
    // State for error messages
    const [error, setError] = useState<string | null>(null); 

    // 🚀 Data Fetching Logic
    useEffect(() => {
        const loadEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Call the API function (which hits GET /api/events)
                const response = await fetchEvents(); 
                
                // Assuming the API returns the array of events directly under response.data
                setEvents(response.data);
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError('Could not load events. Check API connection or server status.');
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []); // Empty dependency array runs once on mount


    // --- Loading State Renderer ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow container mx-auto px-4 py-32 text-center text-xl">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Fetching upcoming events...</p>
                </div>
                <Footer />
            </div>
        );
    }

    // --- Error State Renderer ---
    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex-grow container mx-auto px-4 py-32 text-center text-xl text-red-600">
                    <p className="font-bold mb-2">Error</p>
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <PageHero
                eyebrow="Events & celebrations"
                title="Experience Malawi’s culture through vibrant festivals and estate gatherings."
                description="Join our seasonal events, community celebrations, and immersive farm experiences designed to connect you with local traditions and sustainable living."
                image={culturalDance}
                imageAlt="Traditional Malawian cultural performance"
            />

            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-12">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
                        <p className="text-muted-foreground text-lg md:text-xl">
                            Discover the latest cultural festivals, agricultural workshops, and community gatherings happening at Mwenecho Holdings.
                        </p>
                    </div>

                    {events.length === 0 ? (
                        <div className="rounded-lg border border-border bg-muted p-8 text-center sm:p-10">
                            <p className="text-xl font-semibold text-foreground mb-3">No upcoming events currently scheduled.</p>
                            <p className="text-muted-foreground">Check back soon for new festival dates and heritage experiences.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {events.map((event) => {
                                const { date: formattedDate, time: formattedTime } = formatDate(event.start_time);

                                return (
                                    <Card key={event.id} className="overflow-hidden border border-border shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm uppercase tracking-[0.28em] text-secondary font-semibold">
                                                        Featured Event
                                                    </div>
                                                    <h3 className="text-3xl font-serif font-bold text-foreground">{event.title}</h3>
                                                    <p className="text-muted-foreground max-w-2xl">{event.description}</p>
                                                </div>
                                                <div className="grid gap-3 text-sm text-muted-foreground">
                                                    <div className="rounded-md border border-border bg-muted p-4">
                                                        <div className="font-semibold text-foreground mb-2">Date</div>
                                                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" />{formattedDate}</div>
                                                    </div>
                                                    <div className="rounded-md border border-border bg-muted p-4">
                                                        <div className="font-semibold text-foreground mb-2">Time</div>
                                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" />{formattedTime}</div>
                                                    </div>
                                                    <div className="rounded-md border border-border bg-muted p-4">
                                                        <div className="font-semibold text-foreground mb-2">Location</div>
                                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{event.location}</div>
                                                    </div>
                                                    <div className="rounded-md border border-border bg-muted p-4">
                                                        <div className="font-semibold text-foreground mb-2">Capacity</div>
                                                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" />{event.max_attendees} people</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex flex-wrap gap-3">
                                                <Button className="min-w-[180px] bg-secondary text-secondary-foreground hover:bg-secondary/90">Book Tickets</Button>
                                                <Button variant="outline" className="min-w-[180px]">View Details</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    <div className="rounded-lg border border-border bg-muted p-8 text-center">
                        <h3 className="text-3xl font-bold text-foreground mb-3">Want event updates first?</h3>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Subscribe to our newsletter and be the first to know when new festivals, workshops, and tours are announced.
                        </p>
                        <StayUpdatedCta
                            subscriptionEndpoint="public/subscribe"
                            title="Join Our Event Community"
                            description="Get early access to event passes, seasonal announcements, and cultural experiences from Mwenecho Holdings."
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Events;