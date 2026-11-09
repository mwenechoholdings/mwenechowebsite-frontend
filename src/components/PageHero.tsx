interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export default function PageHero({ eyebrow, title, description, image, imageAlt = "" }: PageHeroProps) {
  const hasImage = Boolean(image);

  return (
    <section className={`relative isolate overflow-hidden border-b border-border ${hasImage ? "bg-slate-950 text-white" : "bg-muted text-foreground"}`}>
      {image && (
        <>
          <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
        </>
      )}
      <div className="container relative mx-auto px-6 py-14 sm:px-8 sm:py-16 md:py-20">
        <div className="max-w-3xl">
          <p className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/85" : "text-primary"}`}>
            <span className={`h-px w-8 ${hasImage ? "bg-amber-300" : "bg-secondary"}`} />
            {eyebrow}
          </p>
          <h1 className={`max-w-3xl font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl ${hasImage ? "text-white" : "text-foreground"}`}>
            {title}
          </h1>
          <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${hasImage ? "text-white/85" : "text-muted-foreground"}`}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
