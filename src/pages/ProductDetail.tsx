import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// --- Functionality Imports ---
import { fetchProductDetails, API_BASE_URL, subscribeToNewsletter, fetchRelatedProducts } from "@/service/api"; 
import useShopConfig from "@/hooks/useShopConfig";
import Lightbox from "@/components/Lightbox"; 
import ProductInquiry from "@/components/ProductInquiry";
// --- UI Component Imports ---
import { Separator } from "@/components/ui/separator"; 
import { 
    Loader2, MessageCircle, Maximize, ChevronLeft, ChevronRight, Check, Zap, 
    ArrowRight, XCircle, ArrowLeft, Mail, ExternalLink // ⭐️ ExternalLink is used for the Copy button
} from "lucide-react"; 
// ⭐️ IMPORTED Social Media Icons (Requires 'react-icons' package: npm install react-icons)
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; 
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Base URL for image path resolution
const BASE_URL = API_BASE_URL.replace('/api/', '');

// --- INTERFACES ---
interface ProductDetail {
    id: number;
    name: string;
    description: string;
    display_price: string; 
    stock: number;
    slug: string;
    category: { name: string, slug: string } | string; 
    images: string[];
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    display_price: string;
    image: string | null;
}

const initialProductState: ProductDetail = {
    id: 0,
    name: "",
    display_price: "",
    description: "",
    stock: 0,
    slug: "",
    category: { name: "", slug: "" }, 
    images: [],
};

// --- HELPER COMPONENT: Related Product Card ---
const RelatedProductCard = ({ product }: { product: RelatedProduct }) => {
    const navigate = useNavigate();
    
    const imagePath = product.image;
    const placeholderImage = 'https://via.placeholder.com/100x80?text=No+Image';
    
    const imageUrl = 
        imagePath 
        ? (imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`)
        : placeholderImage;
    

    const handleProductClick = () => {
        navigate(`/shop/${product.slug}`);
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleProductClick}>
            <img 
                src={imageUrl.replace('/storage/','/storage/app/public/')}
                alt={product.name} 
                className="w-full h-24 object-cover rounded-t-lg" 
            />
            <CardContent className="p-3">
                <p className="text-sm font-semibold truncate text-foreground">{product.name}</p>
                <p className="text-sm font-bold text-primary mt-1">{product.display_price}</p>
                <span className="text-xs text-muted-foreground mt-1 flex items-center hover:text-primary">
                    View Details <ArrowRight className="h-3 w-3 ml-1" />
                </span>
            </CardContent>
        </Card>
    );
};
// ------------------------------------------------


// --- ⭐️ NEW HELPER COMPONENT: Social Share Buttons (Consistent UI) ---
interface ShareButtonsProps {
    productName: string;
    productSlug: string; 
}

const ShareButtons = ({ productName }: ShareButtonsProps) => {
    const { toast } = useToast();
    // Get the current URL dynamically for sharing
    // NOTE: This assumes the component is rendered on the product detail page, making the current URL the share URL.
    const shareUrl = window.location.href; 
    const shareText = `Check out this amazing product: ${productName} on my shop!`;

    // Encode all components for URL safety
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    // Social media share links
    const socialLinks = [
        { 
            name: 'Facebook', 
            icon: FaFacebook, 
            // Use specific brand colors but keep consistent button shape and size
            color: 'bg-blue-600 hover:bg-blue-700', 
            // Facebook Share URL structure
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}` 
        },
        { 
            name: 'Twitter', 
            icon: FaTwitter, 
            color: 'bg-blue-400 hover:bg-blue-500', 
            // Twitter/X Share URL structure
            url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` 
        },
        { 
            name: 'LinkedIn', 
            icon: FaLinkedin, 
            color: 'bg-blue-700 hover:bg-blue-800', 
            // LinkedIn Share URL structure
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}` 
        },
        { 
            name: 'WhatsApp', 
            icon: FaWhatsapp, 
            color: 'bg-green-500 hover:bg-green-600', 
            // WhatsApp Share URL structure
            url: `https://wa.me/?text=${encodedText}%20${encodedUrl}` 
        },
    ];
    
    // Handler for the 'Copy Link' button
    const handleCopyLink = () => {
        // Use the modern clipboard API
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({ 
                title: "Link Copied!", 
                description: "Product URL copied to clipboard.",
                duration: 2000,
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({ 
                title: "Copy Failed", 
                description: "Could not copy link to clipboard.",
                variant: "destructive",
            });
        });
    };

    return (
        // Consistent spacing and text style (text-sm font-medium text-muted-foreground for labels)
        <div className="flex items-center space-x-2 mt-2 mb-4">
            <span className="text-sm font-medium text-muted-foreground">Share:</span>
            {socialLinks.map((link) => (
                <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Consistent button styling with rounded-full, fixed size (p-2 translates to a good size)
                    className={`p-2 rounded-full text-white transition-colors duration-200 ${link.color} flex items-center justify-center shadow-md`}
                    aria-label={`Share on ${link.name}`}
                >
                    <link.icon className="h-4 w-4" />
                </a>
            ))}
            {/* Copy Link Button - Using the existing Button component style (variant="outline", size="icon") */}
            <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                // H-9 w-9 for a slightly larger, accessible button with a subtle shadow
                className="ml-2 h-9 w-9 text-foreground border-border hover:bg-primary/10 shadow-md"
                aria-label="Copy link to clipboard"
            >
                <ExternalLink className="h-4 w-4" />
            </Button>
        </div>
    );
};
// ------------------------------------------------


const ProductDetail = () => {
    const { slug } = useParams<{ slug: string }>(); 
    const navigate = useNavigate();
    const { toast } = useToast();
    const { config, isConfigLoading } = useShopConfig(); 

    const [product, setProduct] = useState<ProductDetail>(initialProductState);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImageIndex, setMainImageIndex] = useState(0); 
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [subscribing, setSubscribing] = useState(false); 
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]); 


    const mainImage = product.images[mainImageIndex] || 'https://via.placeholder.com/600x400?text=No+Image';

    // --- Image Slider Navigation Handlers ---
    const goToNextImage = () => {
        if (product.images.length > 0) {
            setMainImageIndex((prevIndex) => 
                (prevIndex + 1) % product.images.length
            );
        }
    };

    const goToPrevImage = () => {
        if (product.images.length > 0) {
            setMainImageIndex((prevIndex) => 
                (prevIndex - 1 + product.images.length) % product.images.length
            );
        }
    };
    // ------------------------------------------

    // --- Data Fetching Logic (Laravel API by SLUG) ---
    const loadProduct = useCallback(async () => {
        setIsLoading(true);
        setRelatedProducts([]); 
        
        try {
            if (!slug) {
                setProduct(initialProductState);
                return;
            }
            
            // 1. Fetch Main Product Details
            const response = await fetchProductDetails(slug);
            const productData: ProductDetail = response.data;

            const fullImageUrls: string[] = productData.images.map((path: string) => `${BASE_URL}${path}`);
            setProduct({ ...productData, images: fullImageUrls });
            setMainImageIndex(0); 

            // 2. Fetch Related Products
            const categorySlug = typeof productData.category === 'string' 
                ? productData.category
                : productData.category?.slug;

            if (categorySlug) {
                try {
                    const relatedResponse = await fetchRelatedProducts(categorySlug);
                    const filteredRelated = relatedResponse.data.filter(
                        (p: RelatedProduct) => p.slug !== productData.slug
                    );
                    setRelatedProducts(filteredRelated.slice(0, 3)); 
                } catch (relatedError) {
                    console.warn("Failed to load related products:", relatedError);
                    setRelatedProducts([]);
                }
            }


        } catch (error: any) {
            console.error("Failed to load product:", error);
            setProduct(initialProductState); 
            toast({
                title: "Error Loading Product",
                description: error.response?.data?.message || `Could not find product with slug: ${slug}.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [slug, toast]); 

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0); 
    }, [loadProduct]);

    
    // --- Contact Handlers ---
    const handleWhatsAppContact = () => {
        const phoneNumber = config.whatsapp_number || '254700000000';
        const message = encodeURIComponent(`Hi, I'm interested in ${product.name}`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleEmailContact = () => {
        const emailAddress = config.sales_email || 'info@mwenecho.com';
        const subject = encodeURIComponent(`Inquiry about ${product.name}`);
        const body = encodeURIComponent(`Hi,\n\nI'm interested in learning more about ${product.name}.\n\nBest regards`);
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    };

    // --- Newsletter Form submission ---
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribing(true);
        
        if (!newsletterEmail) {
            toast({ title: "Validation Error", description: "Email is required.", variant: "destructive" });
            setSubscribing(false);
            return;
        }

        try {
            await subscribeToNewsletter(newsletterEmail);
            
            toast({
                title: "Subscribed Successfully! 🎉",
                description: "You've been added to our newsletter.",
            });
            setNewsletterEmail("");
        } catch (error: any) {
            console.error("Subscription failed:", error);
            toast({
                title: "Subscription Failed",
                description: error.response?.data?.message || "There was an error subscribing. Please check your email.",
                variant: "destructive",
                action: <XCircle className="h-5 w-5" />,
            });
        } finally {
            setSubscribing(false);
        }
    };


    // --- Render Loading/Error States ---
    if (isLoading || isConfigLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="flex flex-col items-center justify-center flex-grow py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Fetching product details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product.id) {
        return (
            <div className="min-h-screen">
                <Navigation />
                <div className="container mx-auto px-4 py-32 text-center">
                    <h1 className="text-3xl font-bold text-destructive mb-6">Product Not Found</h1>
                    <Button onClick={() => navigate("/shop")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shop
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }
    
    const categoryName = typeof product.category === 'string' 
        ? product.category 
        : product.category?.name || 'Product';

    // --- Main Render ---

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            
            <section className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/shop")}
                    className="mb-4 sm:mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shop
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-6 sm:gap-8 lg:gap-12">
                    
                    {/* LEFT COLUMN: Newsletter Card (Sticky) */}
                    <aside className="hidden lg:block">
                        <Card className="sticky top-20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl">Stay Updated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get the latest product news and exclusive offers.
                                </p>
                                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="newsletter-email">Email Address</Label>
                                        <Input
                                            id="newsletter-email"
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={subscribing}>
                                        {subscribing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Subscribe"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </aside>


                    {/* CENTER COLUMN: Main Product Details */}
                    <div className="lg:col-span-1">
                        
                        {/* Image Gallery/Slider */}
                        <div className="relative mb-4 sm:mb-6 rounded-lg overflow-hidden shadow-lg group border border-border/50">
                            <img 
                                src={mainImage.replace('/storage/','/storage/app/public/')} 
                                alt={product.name} 
                                className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-opacity duration-500 ease-in-out" 
                            />
                            {product.images.length > 1 && (
                                <>
                                    {/* Navigation buttons */}
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={goToPrevImage} 
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full h-8 w-8 z-10"
                                        aria-label="Previous Image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={goToNextImage} 
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full h-8 w-8 z-10"
                                        aria-label="Next Image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                    {/* Image counter */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                                        {mainImageIndex + 1} / {product.images.length}
                                    </div>
                                </>
                            )}
                            {/* Full-size button */}
                            {product.images.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setLightboxImage(mainImage)}
                                    className="absolute top-3 right-3 bg-white/50 hover:bg-white/80 rounded-full h-8 w-8 z-10 transition-opacity opacity-0 group-hover:opacity-100"
                                    aria-label="View Full Screen"
                                >
                                    <Maximize className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        
                        {/* Thumbnails */}
                        <div className="flex space-x-2 overflow-x-auto pb-2 justify-center mb-6">
                            {product.images.map((image, index) => (
                                <div 
                                    key={index}
                                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm ${mainImageIndex === index ? 'border-primary ring-2 ring-primary/50' : 'border-border hover:border-primary'}`}
                                    onClick={() => setMainImageIndex(index)}
                                >
                                    <img src={image.replace('/storage/','/storage/app/public/')} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 sm:p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                            {/* Category */}
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                                {categoryName}
                            </span>
                            
                            {/* Name and Price */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{product.name}</h1>
                            <p className="text-2xl sm:text-3xl font-bold text-primary mb-4">{product.display_price}</p>
                            
                            {/* ⭐️ NEW: Share Buttons Integration ⭐️ */}
                            <ShareButtons 
                                productName={product.name} 
                                productSlug={product.slug} 
                            />
                            
                            <Separator className="my-4" />
                            
                            {/* Details and Description */}
                            <h2 className="text-xl font-semibold text-foreground mb-2">Details</h2>
                            <p className="text-base text-muted-foreground mb-6 whitespace-pre-line leading-relaxed">
                                {product.description}
                            </p>
                            
                            {/* Inventory Status */}
                            <div className={`flex items-center text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? <Check className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </div>
                            
                            {/* Contact Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    onClick={handleWhatsAppContact} 
                                    className="flex-1 sm:flex-initial bg-green-500 hover:bg-green-600 text-white shadow-md" 
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    WhatsApp Inquiry
                                </Button>
                                <Button 
                                    onClick={handleEmailContact} 
                                    variant="outline" 
                                    className="flex-1 sm:flex-initial shadow-md" 
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email Us
                                </Button>
                            </div>

                            {/* Product Inquiry Form */}
                            <ProductInquiry productId={product.id} productName={product.name} />
                        </div>

                        {/* Newsletter Card for small screens */}
                        <Card className="mt-6 lg:hidden shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl">Stay Updated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Get the latest product news and exclusive offers.
                                    </p>
                                    <div>
                                        <Label htmlFor="newsletter-email-sm">Email Address</Label>
                                        <Input
                                            id="newsletter-email-sm"
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={subscribing}>
                                        {subscribing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Subscribe"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>


                    {/* RIGHT COLUMN: Related Products */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-20">
                            <h2 className="text-xl font-bold text-foreground mb-4 border-b pb-2">
                                Other Related Products
                            </h2>
                            <div className="space-y-4">
                                {relatedProducts.length > 0 ? (
                                    relatedProducts.map((p) => (
                                        <RelatedProductCard key={p.id} product={p} />
                                    ))
                                ) : (
                                    <Card className="p-4 text-center text-muted-foreground shadow-sm">
                                        No other related products found.
                                    </Card>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>
            </section>

            <Footer />

            {/* Lightbox Component */}
            <Lightbox 
                src={lightboxImage} 
                alt={product.name} 
                onClose={() => setLightboxImage(null)} 
            />
        </div>
    );
};

export default ProductDetail;