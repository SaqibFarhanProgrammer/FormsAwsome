const infoItems = [
  { label: "Full Name", value: "John Smith" },
  { label: "Email", value: "john@formbuilder.com" },
  { label: "Phone", value: "+1 (555) 123-4567" },
  { label: "Role", value: "Administrator" },
  { label: "Location", value: "San Francisco, CA" },
  { label: "Timezone", value: "PST (UTC-8)" },
];

export function PersonalInfo() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Personal Information</h3>
        <button className="text-xs text-primary font-medium hover:underline">Edit</button>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {infoItems.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className="text-sm font-medium text-foreground mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
