import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="mx-4 max-w-xl rounded-lg border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <p className="text-sm uppercase tracking-[0.36em] text-muted-foreground mb-4">Page not found</p>
        <h1 className="text-7xl font-serif font-bold text-foreground mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
        </p>
        <a href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
