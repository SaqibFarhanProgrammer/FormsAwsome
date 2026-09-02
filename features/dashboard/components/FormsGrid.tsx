import Form_Card from "@/features/form-builder/components/Form_Card";

// const forms = [
//   {
//     id: 1,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 2,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 3,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 4,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 5,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 6,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 7,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 8,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 9,
//     title: "Contact Form",
//     desc: "General contact inquiries",
//     status: "Active",
//     submissions: 342,
//     views: "2.1k",
//   },
//   {
//     id: 10,
//     title: "Newsletter Signup",
//     desc: "Email subscription form",
//     status: "Active",
//     submissions: 891,
//     views: "5.4k",
//   },
//   {
//     id: 11,
//     title: "Job Application",
//     desc: "Career opportunities",
//     status: "Draft",
//     submissions: 0,
//     views: "0",
//   },
//   {
//     id: 12,
//     title: "Event Registration",
//     desc: "Summer workshop 2026",
//     status: "Active",
//     submissions: 51,
//     views: "1.2k",
//   },
// ];
export function FormsGrid({ forms }: { forms: any[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">My Forms</h2>
        <button className="h-8 px-3 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forms.map((form) => (
          <Form_Card key={form.id} form={form} />
        ))}
      </div>
    </div>
  );
}
