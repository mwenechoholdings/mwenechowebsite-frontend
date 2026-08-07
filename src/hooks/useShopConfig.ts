import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "@/service/api";

interface ShopConfig {
    whatsapp_number: string;
    sales_email: string; // 💡 NEW: Sales email is now fetched
}

const initialConfig: ShopConfig = {
    whatsapp_number: '265888123456', // Default fallback
    sales_email: 'sales@yourcompany.com', // Default fallback
};

const useShopConfig = () => {
    const [config, setConfig] = useState<ShopConfig>(initialConfig);
    const [isConfigLoading, setIsConfigLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Assuming your Laravel endpoint is accessible here: /api/config
                const response = await axios.get(`${API_BASE_URL.replace('/api/', '')}/api/config`);
                // Ensure the response data structure matches ShopConfig
                setConfig(response.data);
            } catch (error) {
                console.error("Failed to fetch shop config. Using fallback.", error);
                // Keep the default state on error
            } finally {
                setIsConfigLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return { config, isConfigLoading };
};

export default useShopConfig;