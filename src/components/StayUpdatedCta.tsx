// src/components/StayUpdatedCta.tsx

import React, { useState } from 'react';
// Assuming 'api' is your configured axios instance exported from "@/service/api"
import api from '@/service/api'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, AlertTriangle, Loader2 } from "lucide-react";


// --- INTERFACES & PROPS ---

interface StayUpdatedCtaProps {
    title?: string;
    description?: string;
    // CRITICAL: Endpoint for the subscription API call must be passed in by the consumer.
    subscriptionEndpoint: string; 
}


// --- COMPONENT ---

const StayUpdatedCta: React.FC<StayUpdatedCtaProps> = ({
    title = "Stay Updated",
    description = "Subscribe to our newsletter for the latest updates and exclusive content.",
    // NOTE: This property is now REQUIRED by the interface, ensuring it's always explicitly set.
    subscriptionEndpoint 
}) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // --- FORM SUBMISSION LOGIC ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || status === 'loading') return;

        setStatus('loading');
        setMessage('');

        try {
            // Send the subscription request using the dynamically provided endpoint
            const response = await api.post(subscriptionEndpoint, { email });

            // Set success message
            setMessage(response.data.message || 'Subscription successful! Please check your email.');
            setStatus('success');
            setEmail(''); // Clear input on success

        } catch (error) {
            console.error("Subscription failed:", error);
            // Handle specific API error messages if available
            const errorMessage = error.response?.data?.errors?.email?.[0] || error.response?.data?.message || 'Failed to subscribe. Please try again.';
            setMessage(errorMessage);
            setStatus('error');
        } finally {
            // Reset status after a few seconds for better UX
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 8000);
        }
    };
    
    // --- RENDER HELPERS ---

    const renderButtonContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                    </>
                );
            case 'success':
                return (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Subscribed!
                    </>
                );
            case 'error':
                return (
                    <>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Try Again
                    </>
                );
            case 'idle':
            default:
                return 'Subscribe';
        }
    };

    const alertVariant = status === 'success' 
        ? 'text-green-600 border-green-300' 
        : status === 'error' 
        ? 'text-red-600 border-red-300' 
        : '';

    // --- MAIN RENDER ---

    return (
        <div className="bg-muted py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                    {title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    {description}
                </p>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4 mb-4 items-stretch">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                type="email" 
                                placeholder="Your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 pr-4 py-2 h-full" 
                                disabled={status === 'loading' || status === 'success'}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            size="lg"
                            disabled={status === 'loading'}
                            className="w-full md:w-auto min-w-[150px]"
                        >
                            {renderButtonContent()}
                        </Button>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`p-3 mt-4 rounded-md text-sm font-medium border ${alertVariant}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default StayUpdatedCta;