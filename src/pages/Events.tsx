// Events.tsx

import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Loader2 } from "lucide-react";

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
        <div className="min-h-screen flex flex-col">
            <Navigation />
            
            <div className="container mx-auto px-4 py-12 flex-grow">
                <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Events & Festivals</h1>
                <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                    Join us for exciting cultural celebrations, seasonal festivals, and community gatherings throughout the year.
                </p>

                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold text-primary mb-6">Upcoming Events</h2>
                    
                    {/* --- Dynamic Content Mapping --- */}
                    {events.length === 0 ? (
                        <p className="text-center text-lg text-muted-foreground">
                            No upcoming events are currently scheduled. Check back soon!
                        </p>
                    ) : (
                        events.map((event) => {
                            // Format the date/time for display
                            const { date: formattedDate, time: formattedTime } = formatDate(event.start_time);
                            
                            return (
                                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-foreground">{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {/* Date from API's start_time */}
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="h-5 w-5 mr-2 text-accent" />
                                                <span>{formattedDate}</span> 
                                            </div>
                                            {/* Time from API's start_time */}
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="h-5 w-5 mr-2 text-accent" />
                                                <span>{formattedTime}</span>
                                            </div>
                                            {/* Location */}
                                            <div className="flex items-center text-muted-foreground">
                                                <MapPin className="h-5 w-5 mr-2 text-accent" />
                                                <span>{event.location}</span>
                                            </div>
                                            {/* Capacity from API's max_attendees */}
                                            <div className="flex items-center text-muted-foreground">
                                                <Users className="h-5 w-5 mr-2 text-accent" />
                                                <span>{event.max_attendees} people</span> 
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mb-4">{event.description}</p>
                                        {/* You'd use event.id here to link to a booking page */}
                                        <Button>Book Tickets</Button> 
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                    {/* --- End Dynamic Content --- */}

                    
                    {/* 💡 ACTION: Use the reusable StayUpdatedCta component */}
                    {/* Customize title and description for the events context. 
                    The subscriptionEndpoint defaults to the unified endpoint in StayUpdatedCta. */}
                    <div className="mt-12">
                        <StayUpdatedCta
                            subscriptionEndpoint="/public/subscribe"
                            title="Grow Smarter: Get Our Latest Posts!"
                            description="Join our community! Subscribe for weekly deep dives into sustainable agriculture, eco-tourism best practices, and rural development news."
                        />
                    </div>
                    {/* --- End CTA --- */}

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Events;