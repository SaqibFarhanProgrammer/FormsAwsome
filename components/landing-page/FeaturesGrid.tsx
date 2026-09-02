import { Pencil, BarChart3, Mail, Shield, Download, Users } from "lucide-react";

const featuresList = [
  {
    icon: Pencil,
    title: "Drag & Drop Builder",
    desc: "Build forms visually with our intuitive drag-and-drop interface. No coding knowledge required.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Track submissions, conversion rates, and user behavior with beautiful, actionable dashboards.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    desc: "Get instant alerts when someone submits your form. Never miss a lead or important message.",
  },
  {
    icon: Shield,
    title: "Spam Protection",
    desc: "Built-in reCAPTCHA and honeypot protection keeps your submissions clean and legitimate.",
  },
  {
    icon: Download,
    title: "Easy Export",
    desc: "Download your submissions as CSV, Excel, or PDF. Integrate with Google Sheets automatically.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Share forms with your team, assign roles, and manage permissions for seamless workflow.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to build powerful forms
          </h2>
          <p className="text-lg text-muted-foreground">
            From simple contact forms to complex surveys — we have got you covered with a complete
            toolkit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl  flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon size={22} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
