import { FormRenderer } from "@/features/form-builder/templates";
import { templateTestFormList } from "@/features/form-builder/templates/template-test-forms";

export default function PreviewPage() {
  if (templateTestFormList.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Preview unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">No test form templates are configured.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
      <header className="mx-auto mb-10 max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Form template preview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          All form templates
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {templateTestFormList.length} forms rendered from JSON test data and their own template
          types.
        </p>
      </header>

      <div className="mx-auto max-w-7xl space-y-8">
        {templateTestFormList.map((formData) => (
          <section
            key={formData.id}
            className="min-h-screen overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">{formData.title}</h2>
                <p className="mt-1 font-mono text-[11px] text-slate-500">
                  {formData.type || formData.templateType}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                Template preview
              </span>
            </div>

            <div className="min-h-105 bg-white p-3 sm:p-6">
              <FormRenderer formData={formData} submitUrl="/api/f/preview" hasSubmitted={false} />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
