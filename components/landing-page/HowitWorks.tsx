import { Plus, Link2, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Plus,
    title: "Create Your Form",
    desc: "Choose from 50+ templates or start from scratch. Add fields, customize styling, and set validation rules.",
  },
  {
    num: "02",
    icon: Link2,
    title: "Share the Link",
    desc: "Embed on your website, share via email, or post on social media. Your form works everywhere.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Collect & Analyze",
    desc: "Watch submissions roll in real-time. Analyze data, export reports, and take action on insights.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Build your first form in 3 simple steps
          </h2>
          <p className="text-lg text-muted-foreground">
            From idea to live form in under 5 minutes. No technical skills needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative">
                <div className="text-8xl font-bold text-primary/10 absolute -top-6 left-0 select-none">
                  {step.num}
                </div>
                <div className="relative pt-8">
                  <div className="w-14 h-14 rounded-2xl  flex items-center justify-center mb-6">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
