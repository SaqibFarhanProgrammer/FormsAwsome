"use client";

import { useState } from "react";
import { FormRenderer, getTemplateName } from "@/features/form-builder/templates";
import type { FormData } from "@/features/form-builder/models/FormData";
import { templateTestFormList } from "./template-test-forms";

const FORM_EXAMPLES: Record<string, FormData & { type: string }> = {
  contact_form: {
    type: "contact_form",
    title: "Contact Us",
    description: "Send us a message and we'll get back to you shortly",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        validation: { required: true, min: 2, max: 100 },
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "john@example.com",
        validation: { required: true },
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us how we can help...",
        validation: { required: true, min: 10, max: 1000 },
      },
    ],
    settings: {
      submitButtonText: "Send Message",
      successMessage: "Thank you! We'll be in touch soon.",
    },
  },

  lead_capture: {
    type: "lead_capture",
    title: "Get Your Free Quote",
    description: "Fill out a quick form to get started with your project",
    fields: [
      {
        id: "company",
        type: "text",
        label: "Company Name",
        placeholder: "Your Company",
        validation: { required: true },
      },
      {
        id: "email",
        type: "email",
        label: "Work Email",
        placeholder: "you@company.com",
        validation: { required: true },
      },
      {
        id: "budget",
        type: "slider",
        label: "Project Budget ($1000s)",
        validation: { required: true, min: 5, max: 500 },
      },
    ],
    settings: {
      submitButtonText: "Get Quote",
      successMessage: "Quote request received! Check your email for details.",
    },
  },

  survey_poll: {
    type: "survey_poll",
    title: "Customer Satisfaction Survey",
    description: "Help us improve by sharing your feedback",
    fields: [
      {
        id: "satisfaction",
        type: "rating",
        label: "How satisfied are you with our service?",
        validation: { required: true },
      },
      {
        id: "would_recommend",
        type: "radio",
        label: "Would you recommend us to a friend?",
        options: [
          { label: "Definitely", value: "yes" },
          { label: "Maybe", value: "maybe" },
          { label: "No", value: "no" },
        ],
        validation: { required: true },
      },
      {
        id: "improvements",
        type: "textarea",
        label: "What could we improve?",
        placeholder: "Your suggestions...",
        validation: { required: false },
      },
    ],
    settings: {
      submitButtonText: "Submit Feedback",
      successMessage: "Thank you for your feedback!",
    },
  },

  event_registration: {
    type: "event_registration",
    title: "Web Summit 2024",
    description: "Register for our upcoming web summit",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        validation: { required: true },
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "john@example.com",
        validation: { required: true },
      },
      {
        id: "ticket_type",
        type: "dropdown",
        label: "Ticket Type",
        options: [
          { label: "General Admission", value: "general" },
          { label: "VIP Pass", value: "vip" },
          { label: "Corporate Package", value: "corporate" },
        ],
        validation: { required: true },
      },
    ],
    settings: {
      submitButtonText: "Get my ticket",
      successMessage: "Registration confirmed! Check your email for ticket details.",
    },
  },

  quiz_test: {
    type: "quiz_test",
    title: "Knowledge Assessment",
    description: "Test your knowledge with this quick quiz",
    fields: [
      {
        id: "q1",
        type: "radio",
        label: "Question 1: What is 2 + 2?",
        options: [
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ],
        validation: { required: true },
      },
      {
        id: "q2",
        type: "checkbox",
        label: "Question 2: Select all that apply",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
          { label: "Option C", value: "c" },
        ],
        validation: { required: true },
      },
    ],
    settings: {
      submitButtonText: "Finish quiz",
      successMessage: "Quiz completed! Check your results.",
    },
  },
};

export default function FormExamplesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("contact_form");
  const templates = templateTestFormList.map((form) => form.type);
  const currentForm =
    templateTestFormList.find((form) => form.type === selectedTemplate) ||
    FORM_EXAMPLES.contact_form;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Form Builder Templates</h1>
          <p className="text-lg text-slate-600">
            Choose a template and see it in action. Select different templates to explore various
            form styles and functionality.
          </p>
        </div>

        {/* Template Selector */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <button
              key={template}
              onClick={() => setSelectedTemplate(template)}
              className={`rounded-lg border-2 p-4 text-left transition ${
                selectedTemplate === template
                  ? "border-black bg-slate-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900">{getTemplateName(template)}</div>
              <div className="text-sm text-slate-500">{template}</div>
            </button>
          ))}
        </div>

        {/* Form Display */}
        <div className="rounded-lg bg-white p-8 shadow">
          <div className="mb-6 border-b pb-6">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Preview: {getTemplateName(selectedTemplate)}
            </h2>
            <p className="text-slate-600">
              Type: <code className="font-mono text-sm">{selectedTemplate}</code>
            </p>
          </div>

          <FormRenderer
            formData={currentForm}
            submitUrl="/api/forms/submit"
            className="bg-slate-50 p-4 rounded-lg"
          />

          {/* Form JSON */}
          <div className="mt-12 border-t pt-8">
            <details className="cursor-pointer">
              <summary className="mb-4 text-lg font-semibold text-slate-900">
                View Form Data (JSON)
              </summary>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
                {JSON.stringify(currentForm, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Quick Start</h3>
            <pre className="overflow-x-auto rounded bg-slate-100 p-4 text-sm">
              {`import { FormRenderer } from "@/features/form-builder/templates";

<FormRenderer
  formData={{
    type: "contact_form",
    title: "Contact Us",
    fields: [...],
    settings: {...}
  }}
  submitUrl="/api/submit"
/>`}
            </pre>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Available Templates</h3>
            <p className="mb-4 text-slate-600">20 professionally designed form templates:</p>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {templates.slice(0, 10).map((t) => (
                <li key={t} className="text-slate-600">
                  • {getTemplateName(t)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">... and 10 more</p>
          </div>
        </div>
      </div>
    </div>
  );
}
