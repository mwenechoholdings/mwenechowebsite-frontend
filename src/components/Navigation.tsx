import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/farmers-market", label: "Farmers Market" },
    { to: "/blog", label: "Blog" },
    { to: "/events", label: "Events" },
    { to: "/gallery", label: "Gallery" },
    { to: "/team", label: "Team" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/farmers-market") {
      return location.pathname.startsWith("/farmers-market");
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-950/[0.03] backdrop-blur-md">
      <div className="hidden border-b border-slate-100 bg-muted lg:block">
        <div className="container mx-auto flex items-center justify-between px-8 py-2 text-xs text-slate-600">
          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> Mangochi, Malawi</span>
          <span>Agriculture, culture & trade</span>
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-3 whitespace-nowrap">
            <img src={logo} alt="Mwenecho Holdings" className="h-11 w-auto" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Mwenecho</p>
              <p className="text-sm font-medium text-slate-700">Holdings Ltd</p>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`whitespace-nowrap rounded-sm px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-primary"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/book" className="hidden lg:block">
              <Button className="h-10 gap-2 rounded-sm bg-primary px-4 text-sm text-white hover:bg-primary/90">
                Plan a visit <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-sm border-slate-200 text-slate-800 xl:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <nav aria-label="Mobile navigation" className="border-t border-slate-200 py-3 xl:hidden">
            <div className="grid grid-cols-2 gap-1 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-muted text-primary"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link to="/book" onClick={() => setIsOpen(false)} className="block">
              <Button className="h-11 w-full justify-center gap-2 rounded-sm bg-primary text-white hover:bg-primary/90">
                Plan a visit <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
