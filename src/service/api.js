import axios from 'axios';

// --- Configuration ---
// Base URL for the public API (http://127.0.0.1:8000/api/)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Public API Instance
// This is a simple axios instance used for all public GET requests.
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Important for Laravel API responses
        'Accept': 'application/json',
    },
});


// --- Exported API Functions ---
export const subscribeToNewsletter = (email) => {
    return api.post('public/subscribe', { email });
};

// ⭐️ NEW: Function to fetch related products by category slug
export const fetchRelatedProducts = (categorySlug) => {
    // Note: The API endpoint might vary. We assume it takes a category slug.
    return api.get(`/products/related/${categorySlug}`);
};
/**
 * Fetches the list of all upcoming events from the public endpoint (GET /api/events).
 * @returns {Promise<AxiosResponse<Array<Event>>>}
 */
export const fetchEvents = () => {
    // Uses the simple api instance.
    return api.get('events'); 
};
export const fetchGalleryImages = async () => {
    return api.get('/gallery-images'); // api is your configured axios instance
}
export const addBooking = async (bookingData) => {
   return api.post('/bookings', bookingData);
};
/**
 * Fetches a paginated list of blog posts (GET /api/posts?page=X).
 * @param {number} page The page number to fetch. Defaults to 1.
 * @returns {Promise<AxiosResponse<LaravelPaginationData>>}
 */
export const fetchPosts = async (page = 1) => {
    // Laravel pagination uses the ?page=X query parameter
    const url = `/posts?page=${page}`; 
    try {
        const response = await api.get(url);
        return response.data; 
        
    } catch (error) {
        // Log the actual error details to help debug network issues
        console.error("API Error fetching posts:", error.response || error.message);
        throw error; // Re-throw the error for the component to handle the error state
    }
};

/**
 * Fetches a single blog post using its URL slug (GET /api/posts/{slug}).
 * @param {string} slug The unique slug of the post.
 * @returns {Promise<PostObject>} A promise that resolves to the full post object.
 */
export const fetchPostBySlug = async (slug) => {
    try {
        const response = await api.get(`/posts/${slug}`);
        // Laravel Resource returns { data: {...post_object} }
        return response.data.data; // Return just the post object
    } catch (error) {
        console.error("Error fetching single post:", error);
        throw error;
    }
};

/**
 * 💡 NEW: Fetches a list of blog posts related to a specific category slug.
 * @param {string} categorySlug - The slug of the category to filter by.
 * @returns {Promise<Array>} A promise that resolves to an array of related blog post objects.
 */
export const fetchRelatedPostsByCategory = async (categorySlug) => {
    if (!categorySlug) {
        // Prevent unnecessary API call if slug is missing
        return []; 
    }

    try {
        // Construct the endpoint: /api/categories/{slug}/posts
        // You can also add limit here if needed, e.g., ?limit=4
        const endpoint = `/categories/${categorySlug}/posts`;
        
        const response = await api.get(endpoint);

        // Assuming your Laravel API Resource returns data in the format: { data: [...posts] }
        return response.data.data;

    } catch (error) {
        console.error(`Error fetching related posts for category ${categorySlug}:`, error.response || error.message);
        // Throw a specific error for the component to handle
        throw new Error(`Failed to retrieve related blog posts for category: ${categorySlug}`);
    }
};

/**
 * Fetches a paginated list of public products.
 * * @param {number} page The page number to fetch. Defaults to 1.
 * @returns {Promise<AxiosResponse<any>>} The API response, including pagination data.
 */
export const fetchPublicProducts = (page = 1, searchQuery = '') => {
    // Construct the URL with query parameters
    let url = `/products?page=${page}`;

    if (searchQuery) {
        // Append the search term if it exists
        url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    
    // Assuming 'api' is your configured axios instance
    return api.get(url);
};
export const fetchProductDetails=(slug)=>{
    return api.get(`products/${slug}`);
}

export const fetchServices = async () => {
    const response = await api.get('services');
    return response.data;
};

/**
 * Fetches web details (business information) from the public endpoint.
 * @returns {Promise<Object>} Web details including business name, phone, email, hours, etc.
 */
export const fetchWebDetails = async () => {
    try {
        const response = await api.get('/web-details');
        const payload = response.data;
        return payload?.data?.data ?? payload?.data ?? payload;
    } catch (error) {
        console.error('Error fetching web details:', error);
        throw error;
    }
};

/**
 * Submits an inquiry/contact form.
 * @param {Object} inquiryData - The inquiry data { type, product_id, customer_name, customer_email, customer_phone, message }
 * @returns {Promise<Object>} The created inquiry object
 */
export const submitInquiry = async (inquiryData) => {
    try {
        const response = await api.post('/inquiries', inquiryData);
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        throw error;
    }
};

// Export the instance as default
export default api;