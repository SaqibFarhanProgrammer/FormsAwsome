import { TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Forms", value: "24", trend: "+12% this month" },
  { label: "Submissions", value: "1,284", trend: "+128 today" },
  { label: "Total Views", value: "8.4k", trend: "+5.2% this week" },
  { label: "Conversion", value: "15.1%", trend: "+2.4% vs last" },
];

export function ProfileStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            {stat.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
