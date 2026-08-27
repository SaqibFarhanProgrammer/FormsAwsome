import { Plus, Users, BarChart3, Download } from "lucide-react";

const actions = [
  { icon: Plus, label: "Create New Form" },
  { icon: Users, label: "View Submissions" },
  { icon: BarChart3, label: "View Analytics" },
  { icon: Download, label: "Export Data" },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="p-3 space-y-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors text-left"
            >
              <Icon size={16} className="text-muted-foreground" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
