import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20 shadow-inner shadow-black/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.36em] text-xs font-semibold text-muted-foreground">Refined Stewardship</p>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Mwenecho Holdings</h3>
            <p className="text-muted-foreground leading-relaxed">
              Taste Malawi's agricultural heritage through sustainable farming, cultural tourism, and curated trade services.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@mwenecho.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-4 sm:gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Explore</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                <li><Link to="/farmers-market" className="hover:text-primary transition-colors">Farmers Market</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  <span className="min-w-0 break-words text-sm">+265 993 697 706</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span className="min-w-0 break-all text-sm">info@mwenecho.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  <span className="min-w-0 break-words text-sm">Mangochi, Malawi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Mwenecho Holdings Ltd. All rights reserved.</p>
          <p className="mt-2 text-xs">Built with care — sustainable design & heritage storytelling.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
