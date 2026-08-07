import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 💡 IMPORT INPUT
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight, Search } from "lucide-react"; // 💡 IMPORT SEARCH ICON
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Fetch function to be created/updated in service/api.js
// ASSUMPTION: fetchPublicProducts will accept (page, searchQuery)
import { fetchPublicProducts, API_BASE_URL } from "@/service/api"; 

// --- INTERFACES ---
interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    display_price: string; 
    featured_image_url: string;
    slug: string; 
}
// --------------------

const BASE_URL = API_BASE_URL.replace('/api/', ''); 

const Shop = () => {
    const navigate = useNavigate(); 
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // ⭐️ NEW: State for the search box input
    const [searchQuery, setSearchQuery] = useState(""); // ⭐️ NEW: State for the actual query to submit
    const { toast } = useToast();

    // --- Data Fetching Logic (Updated) ---
    // Added searchQuery parameter
    const loadProducts = useCallback(async (page: number, query: string) => { 
        setIsLoading(true);
        window.scrollTo(0, 0); 

        try {
            // ⭐️ PASS THE SEARCH QUERY TO THE API FUNCTION
            const response = await fetchPublicProducts(page, query); 
            
            const fetchedData = response.data.data; 

            // Update Pagination State
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);

            // Map and fix the image URL path, and ensure slug is included
            const processedProducts: Product[] = fetchedData.map((product: any) => {
                const fullImageUrl = product.featured_image_url 
                    ? `${BASE_URL}${product.featured_image_url}` 
                    : 'https://via.placeholder.com/400x300?text=No+Image';

                return {
                    ...product,
                    category: product.category,
                    featured_image_url: fullImageUrl,
                    slug: product.slug, 
                };
            });
            
            setProducts(processedProducts); 

        } catch (error) {
            console.error("Failed to load products:", error);
            toast({
                title: "Error Loading Farmers Market",
                description: "Failed to load products from the server. Please try again later.",
                variant: "destructive",
            });
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    // ⭐️ NEW: Effect to trigger data fetch when currentPage OR searchQuery changes
    useEffect(() => {
        // This will now re-run when currentPage changes OR searchQuery changes
        loadProducts(currentPage, searchQuery);
    }, [currentPage, searchQuery, loadProducts]); 
    
    // ⭐️ NEW: Handler for the search form submission
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 1. Update the official searchQuery state to the current searchTerm
        // This triggers the useEffect above.
        setSearchQuery(searchTerm.trim());

        // 2. Reset to the first page if a search is performed from another page
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
             // If already on page 1, manually trigger the product load with the new query
             loadProducts(1, searchTerm.trim());
        }
    };

    // Helper to determine the badge text
    const getCategoryName = (category: string) => {
        return category || 'General';
    }

    // Handler for pagination change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };
    
    // Handler to navigate to the product detail page
    const handleProductClick = (slug: string) => {
        navigate(`/farmers-market/${slug}`); // Assuming the route is /shop/:slug
    };
    

    // --- Render Content (Updated with search results message) ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-20 flex justify-center items-center text-xl text-muted-foreground">
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    Loading farm products...
                </div>
            );
        }

        if (products.length === 0) {
            if (searchQuery) {
                return (
                    <div className="text-center py-20 text-xl text-muted-foreground">
                        No products match your search for "<b>{searchQuery}</b>".
                    </div>
                );
            }
            return (
                <div className="text-center py-20 text-xl text-muted-foreground">
                    No products are currently available in the shop.
                </div>
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <Card 
                            key={product.id} 
                            className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" 
                            onClick={() => handleProductClick(product.slug)} 
                        >
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={product.featured_image_url.replace('/storage/','/storage/app/public/')} 
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]" 
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                                        {getCategoryName(product.category)}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                                <p className="text-2xl font-bold text-primary">{product.display_price}</p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button 
                                    className="w-full" 
                                    size="lg"
                                    onClick={() => handleProductClick(product.slug)}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        size="icon"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-foreground">
                        Page <b>{currentPage}</b> of <b>{lastPage}</b>
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === lastPage || isLoading}
                        size="icon"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            
            {/* ... (Hero Section Unchanged) ... */}
            <section className="bg-gradient-to-r from-primary to-secondary py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-primary-foreground mb-4">
                        Farmers Market
                    </h1>
                    <p className="text-xl text-primary-foreground opacity-95 max-w-2xl mx-auto">
                        Quality agricultural products for export, import, and local markets
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-16 flex-grow">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Our Products</h2>
                    <p className="text-lg text-muted-foreground">
                        We specialize in exporting premium Malawian agricultural products internationally 
                        and importing quality farming supplies and equipment. All our products meet 
                        international standards and certifications.
                    </p>
                </div>
                
                {/* ⭐️ NEW: Search Bar Component */}
                <form onSubmit={handleSearchSubmit} className="flex max-w-lg mx-auto mb-12">
                    <Input 
                        type="text" 
                        placeholder="Search products by name or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow h-11 px-4 py-2 text-lg border-r-0 rounded-r-none"
                    />
                    <Button type="submit" size="lg" className="rounded-l-none" disabled={isLoading}>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                    </Button>
                </form>

                {/* ⭐️ Display Search Query if active */}
                {searchQuery && products.length > 0 && (
                    <div className="mb-6 text-center">
                        <p className="text-xl font-semibold text-primary">
                            Showing results for: <span className="font-extrabold italic">"{searchQuery}"</span>
                        </p>
                    </div>
                )}
                

                {renderContent()}

            </section>

            {/* ... (Export & Import Services Section Unchanged) ... */}
            <section className="bg-muted py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                        Export & Import Services
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        Mwenecho Holdings facilitates international agricultural trade, connecting 
                        Malawian farmers to global markets while bringing quality farming inputs 
                        to local producers. We handle logistics, certifications, and quality assurance 
                        for seamless transactions.
                    </p>
                    <Button size="lg" asChild>
                        <a href="/contact">Contact Us for Trade Inquiries</a>
                    </Button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Shop;