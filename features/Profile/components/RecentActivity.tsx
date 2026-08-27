import { Plus, Users, Pencil, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    icon: Plus,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    text: 'Created new form "Customer Feedback Survey"',
    time: "2 hours ago",
  },
  {
    icon: Users,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    text: 'Received 42 new submissions on "Newsletter Signup"',
    time: "5 hours ago",
  },
  {
    icon: Pencil,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    text: 'Updated form "Event Registration" settings',
    time: "Yesterday",
  },
  {
    icon: Settings,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    text: "Changed account password",
    time: "2 days ago",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="p-6 space-y-4">
        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  activity.iconBg,
                )}
              >
                <Icon size={14} className={activity.iconColor} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
