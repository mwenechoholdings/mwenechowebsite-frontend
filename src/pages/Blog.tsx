// Blog.tsx

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// Assuming fetchPosts and API_BASE_URL are correctly defined in api.js
import { fetchPosts, API_BASE_URL } from "@/service/api"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
// Import the new reusable component
import StayUpdatedCta from "@/components/StayUpdatedCta"; // This now imports the version with the form


// --- INTERFACES ---

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface BlogPost {
    id: number;
    title: string;
    slug: string; 
    excerpt: string;
    author: string;
    date: string;
    category: Category; 
    image: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}


// --- HELPER FUNCTION ---

/**
 * Constructs the full URL for a post image using the environment's asset host.
 * This handles cases where Laravel might embed a partial or incorrect domain in the path.
 */
const getFullImageUrl = (imagePath: string): string => {
    // Get the base asset host from the API_BASE_URL (http://127.0.0.1:8000/api/)
    // and remove the '/api/' part to get the base URL (http://127.0.0.1:8000)
    const assetHost = API_BASE_URL.replace('/api/', ''); 
    
    if (imagePath && imagePath.startsWith('/storage/')) {
        // Clean up the path by removing any hardcoded domain if Laravel embedded it
        // Example: /storage/http://mwenecho.com/images/blog/636.jpg -> /storage/images/blog/636.jpg
        const cleanPath = imagePath.replace(/\/storage\/http:\/\/[^/]+\//, '/storage/');
        
        // Prepend the environment-defined asset host
        return `${assetHost}${cleanPath}`; 
    }
    return '';
};


// --- MAIN BLOG COMPONENT ---

const Blog = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State to hold the fetched posts and pagination meta
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get the current page number from the URL query parameter
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("page") || "1", 10);

    // ➡️ Effect to fetch posts when the page changes
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch posts for the current page
                const response = await fetchPosts(currentPage);

                // Assuming response is { data: [...posts], links: {...}, meta: {...} }
                setPosts(response.data); 
                setMeta(response.meta); 

            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setError("Failed to load blog posts. Please check your API connection.");
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage]); 

    // ➡️ Handler to change the page
    const handlePageChange = (page: number) => {
        navigate(`/blog?page=${page}`);
    };

    // ➡️ Helper to generate the pagination buttons
    const renderPagination = () => {
        if (!meta || meta.last_page <= 1) return null;

        const totalPages = meta.last_page;
        const pageNumbers = [];
        const maxPagesToShow = 5;

        // Logic to center the current page while staying within bounds
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center items-center space-x-2 mt-8">
                {/* Previous Button */}
                <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>

                {/* Page Number Buttons */}
                {pageNumbers.map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                    >
                        {page}
                    </Button>
                ))}

                {/* Next Button */}
                <Button 
                    variant="outline" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            {/* --- Hero Section --- */}
            <section className="bg-gradient-to-r from-primary to-secondary py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-primary-foreground mb-4">
                        Our Blog 
                    </h1>
                    <p className="text-xl text-primary-foreground opacity-95 max-w-2xl mx-auto">
                        Stories, insights, and updates from Mwenecho Holdings
                    </p>
                </div>
            </section>

            {/* --- Blog Post Grid Section --- */}
            <section className="container mx-auto px-4 py-16 flex-grow">

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                        <span className="text-lg text-primary">Loading posts...</span>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600 py-10 font-medium">
                        {error}
                    </div>
                )}

                {/* Post Grid */}
                {!loading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            // Pass ID and Image URL via Link State
                            <Link 
                                key={post.id} 
                                to={`/blog/${post.slug}`}
                                state={{ 
                                    postId: post.id, 
                                    featuredImage: getFullImageUrl(post.image) 
                                }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={getFullImageUrl(post.image).replace('/storage/','/storage/app/public/')} 
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                                {/* Use optional chaining as a fallback in case category object is missing */}
                                                {post.category?.name || 'Uncategorized'} 
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                                            {/* Turn ** into bold <b><b> */}
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{post.date}</span>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full group pointer-events-none">
                                            Read More
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {renderPagination()}

            </section>

            {/* --- Subscription CTA Section (Reusable Component) --- */}
            {/* 💡 ACTION: Customize title and description for the blog context */}
            <StayUpdatedCta 
                title="Get Our Latest Insights"
                description="Don't miss a post! Subscribe for weekly deep dives into our projects, technology, and industry trends."
                subscriptionEndpoint="public/subscribe"
            />

            <Footer />
        </div>
    );
};

export default Blog;