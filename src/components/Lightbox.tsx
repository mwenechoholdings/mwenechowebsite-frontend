import React from 'react';
import BaseLightbox from 'yet-another-react-lightbox';
// This import is crucial for styles to be applied
import 'yet-another-react-lightbox/styles.css'; 
// If you want Zoom, Fullscreen, or Thumbnails plugins:
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

interface LightboxProps {
    src: string | null;
    alt: string;
    onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, onClose }) => {
    const open = !!src;
    
    // We only pass the current main image to the lightbox
    const slides = src ? [{ src, title: alt }] : [];

    return (
        <BaseLightbox
            open={open}
            close={onClose}
            slides={slides}
            // Optional: Include plugins if you installed them (e.g., Zoom for better UX)
            // plugins={[Zoom, Fullscreen]}
            // zoom={{
            //     maxZoomPixelRatio: 3,
            //     scrollToZoom: true,
            // }}
            // Customization for single image view, removing navigation buttons
            controller={{
                closeOnBackdropClick: true,
                closeOnEscape: true,
            }}
        />
    );
};

export default Lightbox;