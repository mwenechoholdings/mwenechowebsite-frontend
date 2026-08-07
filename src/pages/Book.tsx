import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
// Import the addBooking function from your service file
import { addBooking } from "@/service/api"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react"; // Added Loader2 for loading state
import { format } from "date-fns";
import { toast } from "sonner";

// Define the type for the form data
interface FormState {
    name: string;
    email: string;
    phone: string;
    tourType: string;
    groupSize: string;
    message: string;
}

// Define the type for the data structure sent to the API
interface BookingData extends FormState {
    preferred_date: string; // The date will be formatted as a string for the API
}

const Book = () => {
    const [date, setDate] = useState<Date | undefined>();
    const [isLoading, setIsLoading] = useState(false); // New state for API submission status

    const [formData, setFormData] = useState<FormState>({
        name: "",
        email: "",
        phone: "",
        tourType: "",
        groupSize: "",
        message: "",
    });

    // Unified handler for text inputs and textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Handler for Select components
    const handleSelectChange = (key: keyof FormState, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation for required date
        if (!date) {
            toast.error("Please select a preferred date.");
            return;
        }

        setIsLoading(true);

        const bookingData: BookingData = {
            ...formData,
            // Format the date into a standard format (e.g., YYYY-MM-DD) for the API
            preferred_date: format(date, 'yyyy-MM-dd'), 
        };

        try {
            // Send data to the API using the imported function
            await addBooking(bookingData); 
            
            // Success feedback
            toast.success("Booking request submitted! We'll contact you shortly.");
            
            // Reset form fields
            setFormData({
                name: "",
                email: "",
                phone: "",
                tourType: "",
                groupSize: "",
                message: "",
            });
            setDate(undefined);

        } catch (error) {
            // Error feedback
            const errorMessage = (error as Error).message || "An unexpected error occurred. Please try again.";
            console.error("Booking submission failed:", error);
            toast.error(`Submission failed: ${errorMessage}`);
        } finally {
            setIsLoading(false); // Ensure loading state is reset regardless of outcome
        }
    };

    const tourPackages = [
        {
            title: "Half-Day Farm Tour",
            duration: "4 hours",
            price: "Starting from $30/person",
            includes: ["Guided farm tour", "Livestock interaction", "Light refreshments"],
        },
        {
            title: "Full-Day Cultural Experience",
            duration: "8 hours",
            price: "Starting from $60/person",
            includes: ["Farm tour", "Traditional lunch", "Cultural performances", "Craft workshop"],
        },
        {
            title: "Overnight Eco-Lodge Stay",
            duration: "2 days, 1 night",
            price: "Starting from $120/person",
            includes: ["Accommodation", "All meals", "Farm activities", "Cultural events", "Nature hike"],
        },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />
            
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-5xl font-bold text-foreground mb-4 text-center">Book Your Experience</h1>
                <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                    Choose from our tour packages or create a custom experience. We can't wait to host you!
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Tour Packages */}
                    <div>
                        <h2 className="text-3xl font-bold text-primary mb-6">Tour Packages</h2>
                        <div className="space-y-6">
                            {tourPackages.map((pkg, index) => (
                                <Card key={index} className="rounded-xl shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                                        <p className="text-muted-foreground">{pkg.duration}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-bold text-accent mb-4">{pkg.price}</p>
                                        <p className="font-semibold mb-2">Includes:</p>
                                        <ul className="space-y-1 text-muted-foreground list-disc pl-5">
                                            {pkg.includes.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="mt-6 bg-muted rounded-xl">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-foreground mb-2">Group & Corporate Bookings</h3>
                                <p className="text-muted-foreground">
                                    Planning a team-building event or group tour? We offer special packages for groups of 10 or more. 
                                    Contact us for custom pricing and arrangements.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Form */}
                    <div>
                        <Card className="rounded-xl shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl">Request a Booking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Input */}
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoading}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    {/* Tour Type Select */}
                                    <div>
                                        <Label htmlFor="tourType">Tour Type *</Label>
                                        <Select 
                                            value={formData.tourType} 
                                            onValueChange={(value) => handleSelectChange("tourType", value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tour package" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="half-day">Half-Day Farm Tour</SelectItem>
                                                <SelectItem value="full-day">Full-Day Cultural Experience</SelectItem>
                                                <SelectItem value="overnight">Overnight Eco-Lodge Stay</SelectItem>
                                                <SelectItem value="custom">Custom Package</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Preferred Date Picker */}
                                    <div>
                                        <Label>Preferred Date *</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                    disabled={isLoading}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                    // Optionally disable past dates
                                                    disabled={(day) => day < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Group Size Select */}
                                    <div>
                                        <Label htmlFor="groupSize">Group Size *</Label>
                                        <Select 
                                            value={formData.groupSize} 
                                            onValueChange={(value) => handleSelectChange("groupSize", value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Number of people" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-2">1-2 people</SelectItem>
                                                <SelectItem value="3-5">3-5 people</SelectItem>
                                                <SelectItem value="6-10">6-10 people</SelectItem>
                                                <SelectItem value="10+">10+ people</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Message Textarea */}
                                    <div>
                                        <Label htmlFor="message">Special Requests or Questions</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Any dietary restrictions, accessibility needs, or special interests?"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Submit Button with Loading Indicator */}
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        size="lg" 
                                        disabled={isLoading || !date} // Disable if loading or date is not picked
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                                        ) : (
                                            "Submit Booking Request"
                                        )}
                                    </Button>

                                    <p className="text-sm text-muted-foreground text-center">
                                        We'll review your request and contact you within 24 hours to confirm availability and finalize details.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Book;