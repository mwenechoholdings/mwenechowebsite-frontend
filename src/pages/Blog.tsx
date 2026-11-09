// Blog.tsx

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// Assuming fetchPosts and API_BASE_URL are correctly defined in api.js
import { fetchPosts, API_BASE_URL } from "@/service/api"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import ecoLodge from "@/assets/eco-lodge.jpg";
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
    const assetHost = API_BASE_URL.replace(/\/api\/?$/, '');

    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/src/') || imagePath.startsWith('src/')) return imagePath;
    if (imagePath.startsWith('/assets/') || imagePath.startsWith('assets/')) return imagePath;

    const normalizedPath = imagePath.startsWith('/')
        ? imagePath.replace(/\/storage\/http:\/\/[^/]+\//, '/storage/')
        : `/${imagePath}`;

    return `${assetHost}${normalizedPath}`;
};

const fallbackPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Sustainable farming and community-led agriculture',
        slug: 'sustainable-farming-community-led-agriculture',
        excerpt: 'Discover how Mwenecho Holdings blends regenerative practices, regional partnerships, and hospitality to create a lasting impact.',
        author: 'Mwenecho Holdings',
        date: 'Aug 11, 2026',
        category: { id: 1, name: 'Agriculture', slug: 'agriculture' },
        image: ecoLodge,
    },
];


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
                const response = await fetchPosts(currentPage);
                const payload = response?.data ? response : { data: response, meta: null };

                setPosts(Array.isArray(payload.data) ? payload.data : []);
                setMeta(payload.meta ?? null);
                setError(null);

            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setPosts(fallbackPosts);
                setMeta({ current_page: currentPage, last_page: 1, total: fallbackPosts.length, per_page: fallbackPosts.length });
                setError(null);
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
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />

            <PageHero
                eyebrow="Journal"
                title="Stories from our farms, exports, and sustainable projects."
                description="Explore the latest updates from Mwenecho Holdings, with insights into agriculture, local communities, and global trade."
                imageAlt="Mwenecho Holdings landscape"
            />

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
                            <Link 
                                key={post.id} 
                                to={`/blog/${post.slug}`}
                                state={{ 
                                    postId: post.id, 
                                    featuredImage: getFullImageUrl(post.image) 
                                }}
                                className="group"
                            >
                                <Card className="overflow-hidden border border-border shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={getFullImageUrl(post.image)}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                                            <span className="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs uppercase tracking-[0.32em] text-primary-foreground">
                                                {post.category?.name || 'Uncategorized'}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-serif font-semibold text-foreground mb-3 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-5 line-clamp-3 flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{post.date}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Button variant="outline" className="w-full justify-center">
                                                Read More
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
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