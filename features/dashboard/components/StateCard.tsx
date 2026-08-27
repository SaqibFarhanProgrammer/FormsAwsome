import { FileText, Users, Eye, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Forms",
    value: "24",
    icon: FileText,
    trend: "+3 this week",
    trendUp: true,
  },
  {
    label: "Total Submissions",
    value: "1,284",
    icon: Users,
    trend: "+128 today",
    trendUp: true,
  },
  {
    label: "Total Views",
    value: "8,492",
    icon: Eye,
    trend: "+12% this month",
    trendUp: true,
  },
  {
    label: "Conversion Rate",
    value: "15.1%",
    icon: TrendingUp,
    trend: "+2.4% vs last month",
    trendUp: true,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <TrendingUp size={14} />
              <span>{stat.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}