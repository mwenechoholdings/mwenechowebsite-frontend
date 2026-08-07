import { useState, useEffect, useCallback } from "react";
// External Components
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Loader2, Image as ImageIcon, Zap } from "lucide-react";
import Masonry from "react-masonry-css";

// API Imports (Assuming these are exported from your service file)
// Note: Adjusted the import path based on typical project structure.
import { fetchGalleryImages, API_BASE_URL } from "@/service/api"; 


const imageUrlPrefix = API_BASE_URL.replace('/api/', '');

const resolveGalleryImageUrl = (imageUrl) => {
    if (!imageUrl) return '';

    // Ensure we have a string, trim whitespace
    const normalizedUrl = imageUrl.toString().trim();

    // Some backend responses escape slashes (e.g. "https:\/\/res.cloudinary.com\/...")
    // Unescape those sequences so the URL becomes a valid browser URL.
    const unescaped = normalizedUrl.replace(/\\\//g, '/');

    // If it's already an absolute URL after unescaping, return it as-is
    if (/^https?:\/\//i.test(unescaped)) {
        return unescaped;
    }

    // Handle Laravel storage paths returned from the API
    if (unescaped.startsWith('/storage/')) {
        return imageUrlPrefix + unescaped.replace('/storage/', '/storage/app/public/');
    }

    // Fallback: prefix with API base
    return imageUrlPrefix + unescaped;
};

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to load images using the imported API utility
    const loadImages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Call the real API function
            const response = await fetchGalleryImages();
            
            // Assuming the successful API response returns { data: [...] }
            setGalleryImages(response.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error loading gallery:", err);
            // Handle error, showing a user-friendly message
            setError(err.message || "Failed to load gallery images. Check API connection.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-xl text-gray-600 font-semibold">Loading Image Data...</p>
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-12 bg-red-50 text-red-700 border-t-4 border-red-500">
                <Zap className="w-12 h-12 mb-4" />
                <h1 className="text-3xl font-bold mb-4">Error Loading Gallery</h1>
                <p className="text-lg">{error}</p>
                {API_BASE_URL && (
                    <p className="text-sm mt-4 text-red-500">Check connection to: {API_BASE_URL}</p>
                )}
            </div>
        );
    }
    
    // Breakpoint configuration for the Masonry layout
    const breakpointColumns = {
        default: 3,
        1100: 2,
        700: 1 // Single column for mobile devices below 700px
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            <Navigation />
            
            <div className="container mx-auto px-4 py-8 sm:py-12"> {/* Reduced vertical padding on mobile */}
                <div className="text-center mb-10 sm:mb-16 animate-fade-in"> {/* Reduced bottom margin on mobile */}
                    <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent mb-4
                                   bg-gradient-to-r from-primary via-primary/80 to-primary">
                        Gallery
                    </h1>
                    <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto mb-4 sm:mb-6 rounded-full"></div>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"> {/* Reduced text size on mobile */}
                        Explore the beauty of Mwenecho Holdings through images of our farm, cultural events, and eco-lodges.
                    </p>
                </div>

                {galleryImages.length > 0 ? (
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="flex -ml-4 sm:-ml-6 w-auto animate-fade-in" // Adjusted negative margin
                        columnClassName="pl-4 sm:pl-6 bg-clip-padding" // Adjusted padding
                    >
                        {galleryImages.map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedImage({ 
                                    src: resolveGalleryImageUrl(image.image_url), 
                                    alt: image.caption,
                                    category: image.category
                                })}
                                className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer mb-4 sm:mb-6
                                           bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm
                                           border border-border/50 hover:border-primary/50
                                           shadow-lg hover:shadow-2xl hover:shadow-primary/20
                                           transition-all duration-500 hover:scale-[1.02]"
                            >
                                <img 
                                    src={resolveGalleryImageUrl(image.image_url)} 
                                    alt={image.caption} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Hover Overlay (Caption) - Remains functional and readable on mobile */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                                    <div className="text-white text-left">
                                        <p className="text-md sm:text-lg font-bold line-clamp-2">{image.caption}</p>
                                        <p className="text-xs sm:text-sm opacity-75 mt-1">{image.category} (Click to zoom)</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/50
                                                rounded-2xl transition-all duration-300"></div>
                            </div>
                        ))}
                    </Masonry>
                ) : (
                    <div className="text-center p-8 sm:p-10 bg-gray-100 rounded-xl border border-gray-200">
                        <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-4"/>
                        <p className="text-xl text-gray-600">No images found. The gallery is empty.</p>
                    </div>
                )}


                <div className="mt-12 sm:mt-20 text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent
                             border border-primary/20 backdrop-blur-sm animate-fade-in">
                    <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">
                        Want to capture your own moments at Mwenecho Holdings?
                    </p>
                    {/* Reduced font size for the CTA heading on mobile */}
                    <p className="text-xl sm:text-2xl text-foreground font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Book your visit today and create lasting memories!
                    </p>
                </div>
            </div>

            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-primary/20 flex flex-col">
                    <DialogTitle className="sr-only">
                        {selectedImage?.alt}
                    </DialogTitle>
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background
                                 border border-border hover:border-primary/50 transition-all duration-300
                                 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {selectedImage && (
                        <>
                            {/* Image container: Takes up available space (flex-grow) */}
                            <div className="w-full flex-grow flex items-center justify-center p-2 sm:p-4">
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className="max-w-full max-h-full object-contain rounded-lg animate-scale-in"
                                />
                            </div>
                            {/* Caption/Footer Area: Fixed height (flex-shrink-0) */}
                            <div className="flex-shrink-0 p-4 bg-black/60 text-white text-center border-t border-primary/20">
                                <p className="text-lg sm:text-xl font-semibold mb-1">{selectedImage.alt}</p>
                                {selectedImage.category && (
                                    <p className="text-xs sm:text-sm opacity-70">Category: {selectedImage.category}</p>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Gallery;