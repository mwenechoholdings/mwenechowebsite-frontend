import Navigation from "@/components/Navigation";

const SiteHeader = () => {
  return (
    <header className="bg-hero-gradient text-primary-foreground">
      <Navigation />
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm uppercase tracking-[0.36em] mb-4 text-primary">
          Agrosector Identity
        </p>
        <h1 className="text-3xl md:text-6xl font-serif font-bold leading-tight mb-4 md:whitespace-nowrap">
          Mwenecho Holdings — Agriculture, Culture & Export.
        </h1>
        <p className="mx-auto max-w-3xl text-base md:text-xl text-primary-foreground/90">
          Combining sustainable farming, heritage tourism, and trade services across Malawi.
        </p>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <a href="/book" className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-soft hover:shadow-accent transition-shadow">
            Book a Tour
          </a>
          <a href="/farmers-market" className="inline-block rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Explore Farmers Market
          </a>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
