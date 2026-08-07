import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Loader2, ExternalLink, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
// Note: Assuming 'react-icons/fa' is installed, but using Lucide icons for consistency.

// Use your configured imports from "@/service/api"
import { API_BASE_URL, fetchPostBySlug, fetchRelatedPostsByCategory } from "@/service/api";


// --- INTERFACES ---

interface Category {
    id: number;
    name: string;
    slug: string; // Used for fetching related posts
}

interface FullPost {
    id: number;
    title: string;
    slug: string; // Used as the URL parameter
    content: string;
    author: string; 
    date: string; 
    readTime: string;
    category: Category; 
    image: string; 
    featured: boolean;
}

// --- Image URL Helper ---

const getFullImageUrl = (imagePath: string): string => {
    // Ariel's API base is http://127.0.0.1:8000/api/, so the asset host is http://127.0.0.1:8000
    const assetHost = API_BASE_URL.replace('/api/', ''); 
    
    if (imagePath && imagePath.startsWith('/storage/')) {
        // Clean up common Laravel local storage path issues in development
        const cleanPath = imagePath.replace(/\/storage\/http:\/\/[^/]+\//, '/storage/'); 
        return `${assetHost}${cleanPath}`; 
    }
    return imagePath || ''; 
};


// --- ⭐️ EDITED HELPER COMPONENT: Content Renderer for Text Formatting (Improved Paragraph Spacing) ---

interface ContentRendererProps {
    content: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
    if (!content) return null;

    // 1. Convert simple text formatting: **bold** and *italic*
    let processedHtml = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold: **text**
        .replace(/\*(.*?)\*/g, '<em>$1</em>');           // Italic: *text*

    const lines = processedHtml.split('\n');
    let finalHtml = '';
    let inList = false;
    let currentParagraph = [];

    // Helper function to finalize and flush the current paragraph content
    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const paragraphContent = currentParagraph.join('<br/>').trim();
            if (paragraphContent) {
                finalHtml += `<p>${paragraphContent}</p>`;
            }
        }
        currentParagraph = [];
    };

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const isListItem = trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ');
        const isEmptyLine = trimmedLine === '';

        if (isListItem) {
            // End current paragraph before starting a list
            flushParagraph(); 

            const listItemContent = trimmedLine.substring(2).trim();

            if (!inList) {
                finalHtml += '<ul>';
                inList = true;
            }
            finalHtml += `<li>${listItemContent}</li>`;

        } else if (isEmptyLine) {
            // An empty line marks the end of a paragraph or a list
            if (inList) {
                finalHtml += '</ul>';
                inList = false;
            } else {
                // An empty line between text blocks should flush the current paragraph
                flushParagraph();
            }
        } else {
            // Non-list, non-empty line
            if (inList) {
                // If we were inside a list, flush it and start a new paragraph
                finalHtml += '</ul>';
                inList = false;
                flushParagraph(); // Flush any potentially hidden paragraph text

                // Start new paragraph with current line
                currentParagraph.push(trimmedLine);

            } else {
                // Continue or start a paragraph
                currentParagraph.push(trimmedLine);
            }
        }
    });

    // Final flush in case the content ended mid-list or mid-paragraph
    if (inList) {
        finalHtml += '</ul>';
    }
    flushParagraph();

    // DangerouslySetInnerHTML is used here because the content is server-rendered text
    // and we've performed minimal, controlled processing. Use with caution.
    return (
        <div 
            // The 'prose' class from Tailwind Typography is handling most styling, 
            // but the <br/> for single newlines and <p> for double newlines should fix the original issue.
            className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: finalHtml }}
        />
    );
};


// --- ⭐️ NEW HELPER COMPONENT: Social Share Buttons (Sleek UI) ---

interface ShareButtonsProps {
    postTitle: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ postTitle }) => {
    const { toast } = useToast();
    // Use a placeholder if window is undefined (e.g., during server-side rendering)
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com/blog/article-slug'; 
    const shareText = `Read this great article: ${postTitle}`;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    // Mapped Fa icons to Lucide icons
    const socialLinks = [
        { name: 'Facebook', Icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}` },
        { name: 'Twitter', Icon: Twitter, color: 'bg-blue-400 hover:bg-blue-500', url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
        { name: 'LinkedIn', Icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800', url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}` },
        { name: 'WhatsApp', Icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600', url: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    ];
    
    const handleCopyLink = () => {
        if (typeof window === 'undefined' || !navigator.clipboard) {
            toast({ 
                title: "Error", 
                description: "Clipboard access is not available in this environment.",
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({ 
                title: "Link Copied!", 
                description: "Article URL copied to clipboard.",
                duration: 2000,
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({ 
                title: "Copy Failed", 
                description: "Could not copy link.",
                variant: "destructive",
            });
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
            <span className="text-sm font-semibold text-foreground">Share Article:</span>
            
            {/* Social Media Buttons */}
            {socialLinks.map((link) => (
                <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full text-white transition-colors duration-200 ${link.color} flex items-center justify-center shadow-md`}
                    aria-label={`Share on ${link.name}`}
                >
                    <link.Icon className="h-4 w-4" />
                </a>
            ))}
            
            {/* Copy Link Button - Sleek version */}
            <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                className="h-9 w-9 text-primary border-primary/50 hover:bg-primary/10 shadow-sm"
                aria-label="Copy link to clipboard"
            >
                <ExternalLink className="h-4 w-4" />
            </Button>
        </div>
    );
};

// --- RELATED POSTS COMPONENT (Unchanged) ---

interface RelatedPostsProps {
    currentPostId: number;
    categoryName: string; 
    categorySlug: string; 
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, categoryName, categorySlug }) => {
    const [relatedPosts, setRelatedPosts] = useState<FullPost[]>([]);
    
    useEffect(() => {
        if (!categorySlug) return;

        const loadRelated = async () => {
            try {
                const posts: FullPost[] = await fetchRelatedPostsByCategory(categorySlug); 
                
                const filteredPosts = posts
                    .filter((post: FullPost) => post.id !== currentPostId)
                    .slice(0, 3);

                setRelatedPosts(filteredPosts); 
            } catch (error) {
                console.error(`Could not fetch related posts for category ${categorySlug}:`, error);
                // Optionally add a toast error here for related posts
            }
        };
        // Reset related posts on slug change to prevent flickering
        setRelatedPosts([]); 
        loadRelated();
    }, [categorySlug, currentPostId]); 

    if (relatedPosts.length === 0) return null;

    return (
        <Card className="sticky top-8 border-l-4 border-primary/50 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl">More in <span className="text-primary">{categoryName}</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {relatedPosts.map(post => (
                    <div key={post.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <Link 
                            to={`/blog/${post.slug}`} 
                            className="hover:text-primary transition-colors block"
                            // Force page reload and scroll to top for fresh component
                            onClick={() => { window.scrollTo(0, 0); setTimeout(() => window.location.reload(), 0); }} 
                        >
                            <h4 className="font-semibold text-base line-clamp-2">{post.title}</h4>
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <Button variant="link" className="p-0 h-auto text-sm">
                    <Link to={`/blog`}>View All Posts</Link>
                </Button>
            </CardContent>
        </Card>
    );
};


// --- Main BlogPost Component ---

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>(); 
    const navigate = useNavigate();
    const { toast } = useToast();

    const [post, setPost] = useState<FullPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching Logic (Unchanged) ---
    useEffect(() => {
        if (!slug) {
            setError("Missing post slug.");
            setLoading(false);
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedPost: FullPost = await fetchPostBySlug(slug); 
                setPost(fetchedPost);

            } catch (err: any) {
                console.error("Error fetching single post:", err);
                toast({
                    title: "Error",
                    description: err.response?.data?.message || "Blog post not found or an error occurred.",
                    variant: "destructive",
                });
                setError(err.response?.data?.message || "Failed to load this blog post.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate, toast]);


    // --- Render Loading/Error States (Unchanged) ---
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navigation />
                <div className="container mx-auto px-4 py-32 text-center flex-grow">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">Loading article...</p>
                </div>
                <Footer />
            </div>
        );
    }
    
    if (error || !post) {
        return (
            <div className="min-h-screen">
                <Navigation />
                <div className="container mx-auto px-4 py-32 text-center">
                    <h1 className="text-3xl font-bold text-destructive mb-6">Error: {error || "Post Not Found"}</h1>
                    <Button onClick={() => navigate("/blog")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }
    
    const imageSrc = post.image ? getFullImageUrl(post.image) : '';
    
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            
            <article className="container mx-auto px-4 py-6 sm:py-12 flex-grow">
                
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/blog")}
                    className="mb-6 sm:mb-8 text-primary hover:text-primary-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Content (2/3 width) */}
                    <div className="lg:col-span-2">
                        <div className="max-w-4xl mx-auto lg:mx-0">
                            
                            {/* Featured Image */}
                            {imageSrc && (
                                <img
                                    src={imageSrc.replace('/storage/','/storage/app/public/')}
                                    alt={post.title}
                                    className="w-full h-56 sm:h-72 lg:h-96 object-cover rounded-xl shadow-lg mb-6 sm:mb-8"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/1024x500/A5B4FC/FFFFFF?text=Image+Not+Found'; }}
                                />
                            )}
                            
                            {/* Post Meta Data */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-4 sm:mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{post.date}</span> 
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{post.readTime}</span> 
                                </div>
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium self-start">
                                    {post.category?.name || 'Uncategorized'}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 sm:mb-6 leading-tight">{post.title}</h1>
                            
                            {/* ⭐️ NEW: Share Buttons ⭐️ */}
                            <ShareButtons postTitle={post.title} />

                            {/* Content */}
                            <div className="mt-8">
                                {/* ⭐️ EDITED: ContentRenderer now handles single newlines as <br/> and double newlines as <p> tags. ⭐️ */}
                                <ContentRenderer content={post.content} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area (1/3 width) */}
                    <aside className="lg:col-span-1 pt-4 lg:pt-0">
                        {/* Integrated Related Posts Component */}
                        <RelatedPosts 
                            currentPostId={post.id} 
                            categorySlug={post.category.slug}
                            categoryName={post.category.name}
                        />
                    </aside>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPost;