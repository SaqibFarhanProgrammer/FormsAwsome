import { Star } from "lucide-react";

const reviews = [
  {
    text: "FormBuilder transformed how we collect customer feedback. The analytics dashboard alone saved us 10 hours a week. Absolutely essential tool.",
    name: "James Davidson",
    role: "Product Manager at Stripe",
    initials: "JD",
  },
  {
    text: "We switched from Typeform and never looked back. The pricing is fair, the forms load faster, and the data export options are incredible.",
    name: "Sarah Kim",
    role: "Marketing Lead at Notion",
    initials: "SK",
  },
  {
    text: "As a freelancer, I needed something simple but powerful. FormBuilder hits that sweet spot perfectly. My clients love the branded forms I create.",
    name: "Marcus Rivera",
    role: "Independent Designer",
    initials: "MR",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Loved by creators and teams
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our users have to say about their experience with FormBuilder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
