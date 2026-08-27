import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const usageItems = [
  { label: "Forms Used", current: 24, total: 50, color: "bg-primary" },
  { label: "Submissions", current: 1284, total: 10000, color: "bg-emerald-500" },
  { label: "Storage", current: 2.4, total: 10, unit: "GB", color: "bg-amber-500" },
];

export function CurrentPlan() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Current Plan</h3>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Pro Plan</p>
            <p className="text-xs text-muted-foreground">$29/month</p>
          </div>
        </div>
        <div className="space-y-3">
          {usageItems.map((item) => {
            const percent = (item.current / item.total) * 100;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground">
                    {item.current} / {item.total} {item.unit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", item.color)}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <button className="w-full mt-5 h-9 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
