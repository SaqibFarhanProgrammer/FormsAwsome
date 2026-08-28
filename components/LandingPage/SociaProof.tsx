export function SocialProof() {
  const logos = ["Stripe", "Notion", "Figma", "Linear", "Vercel", "Supabase"];

  return (
    <section className="py-12 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by 10,000+ teams worldwide
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
          {logos.map((logo) => (
            <span key={logo} className="text-xl font-bold text-muted-foreground">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
