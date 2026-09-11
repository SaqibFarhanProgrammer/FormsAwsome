# Form Builder Templates

20 professionally designed form templates with theme customization, validation, and dynamic rendering.

## Quick Start

### Basic Usage

```tsx
import { FormRenderer } from "@/features/form-builder/templates";

export default function MyForm() {
  const formData = {
    id: "form-1",
    type: "contact_form", // Template type
    title: "Get in Touch",
    description: "We'd love to hear from you",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Your Name",
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
    ],
    settings: {
      submitButtonText: "Send Message",
      successMessage: "Thank you! We'll respond soon.",
      redirectUrl: "/thank-you",
    },
  };

  return <FormRenderer formData={formData} submitUrl="/api/forms/submit" hasSubmitted={false} />;
}
```

## Available Templates

| Type                    | Component              | Use Case              |
| ----------------------- | ---------------------- | --------------------- |
| `contact_form`          | ContactFormUI          | General contact forms |
| `lead_capture`          | LeadCaptureUI          | Sales/lead generation |
| `customer_feedback`     | CustomerFeedbackUI     | Surveys & feedback    |
| `event_registration`    | EventRegistrationUI    | Event sign-ups        |
| `newsletter_signup`     | NewsletterSignupUI     | Email subscriptions   |
| `employee_checkin`      | EmployeeCheckinUI      | Daily check-ins       |
| `workflow_request`      | WorkflowRequestUI      | Process requests      |
| `company_audit`         | CompanyAuditUI         | Compliance forms      |
| `job_application`       | JobApplicationUI       | Hiring forms          |
| `leave_request`         | LeaveRequestUI         | Time off requests     |
| `employee_onboarding`   | EmployeeOnboardingUI   | Onboarding flows      |
| `product_order`         | ProductOrderUI         | E-commerce orders     |
| `quote_request`         | QuoteRequestUI         | Quote requests        |
| `support_ticket`        | SupportTicketUI        | Support/helpdesk      |
| `appointment_booking`   | AppointmentBookingUI   | Scheduling            |
| `survey_poll`           | SurveyPollUI           | Surveys with progress |
| `course_evaluation`     | CourseEvaluationUI     | Course feedback       |
| `quiz_test`             | QuizTestUI             | Quiz forms            |
| `nda_agreement`         | NdaAgreementUI         | Legal agreements      |
| `expense_reimbursement` | ExpenseReimbursementUI | Expense claims        |

## Dynamic Template Selection

```tsx
import { FormRenderer, getAvailableTemplates } from "@/features/form-builder/templates";

export function FormTemplateSelector({ selectedType }) {
  const templates = getAvailableTemplates();

  return (
    <select value={selectedType}>
      {templates.map((type) => (
        <option key={type} value={type}>
          {type.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

// Then use it
<FormRenderer formData={{ ...formData, type: selectedType }} submitUrl="/api/submit" />;
```

## FormData Structure

```tsx
interface FormData {
  id: string;
  type?: string; // e.g., "contact_form", "lead_capture"
  title: string;
  description?: string;
  fields: FormFieldItem[];
  settings: {
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
}

interface FormFieldItem {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "checkbox"
    | "radio"
    | "dropdown"
    | "toggle"
    | "rating"
    | "slider"
    | "file"
    | "textarea"
    | "date"
    | "heading"
    | "divider"
    | "phone"
    | "URL"
    | "long_text"
    | "short_text"
    | "multiple_choice"
    | "file_upload_image"
    | "file_upload_pdf"
    | "image";
  label: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  validation: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

## Customization

### Individual Templates

```tsx
import { ContactFormUI } from "@/features/form-builder/templates";

export default function CustomContact() {
  return (
    <ContactFormUI
      formData={formData}
      submitUrl="/api/submit"
      className="custom-wrapper"
      hasSubmitted={false}
    />
  );
}
```

### Custom Styling with Themes

Templates use CSS variables for theming:

```tsx
const theme = {
  accent: "#3b82f6", // Primary color
  soft: "#eff6ff", // Soft background
  page: "bg-white", // Page background
  card: "bg-slate-50", // Card background
  title: "text-2xl", // Title size
  desc: "text-sm", // Description size
  inputMode: "boxed", // "boxed" | "underline"
  radioVariant: "pills", // "list" | "pills" | "letters" | "emojis" | "tags"
  checkVariant: "chips", // "list" | "chips"
  selectVariant: "slots", // "default" | "slots"
};
```

## Field Types

- **Text Input**: text, short_text, long_text, email, phone, url, date
- **Selection**: checkbox, multiple_choice, radio, dropdown, select
- **Numeric**: number, rating, slider
- **File Upload**: file, file_upload_image, file_upload_pdf, image
- **Layout**: heading, divider
- **Toggle**: toggle

## Form Submission

All forms submit to `submitUrl` via POST with JSON body:

```json
{
  "fieldId1": "value1",
  "fieldId2": "value2"
}
```

## Utilities

### Built-in Functions

```tsx
import {
  useTemplateForm, // Form state management
  buildSchema, // Zod validation schema
  buildDefaults, // Default field values
  FormRenderer, // Main component
  getAvailableTemplates,
  getTemplateName,
} from "@/features/form-builder/templates";

// Get all available templates
const templates = getAvailableTemplates();

// Get display name for template type
const displayName = getTemplateName("contact_form"); // "Contact Form"
```

## Form Validation

Forms use Zod for validation with automatic error messages:

```tsx
// Required field
{ validation: { required: true } }

// Min/max length
{ validation: { min: 3, max: 50 } }

// Pattern matching
{ validation: { pattern: "^[A-Z0-9]+$" } }

// Custom validations per type:
// - email: Email format validation
// - url: URL format validation
// - number: Min/max value validation
// - checkbox/multiple_choice: At least one selected
// - toggle: Must be true
```

## Folder Structure

```
templates/
├── contact-form.tsx
├── lead-capture.tsx
├── customer-feedback.tsx
├── event-registration.tsx
├── newsletter-signup.tsx
├── employee-checkin.tsx
├── workflow-request.tsx
├── company-audit.tsx
├── job-application.tsx
├── leave-request.tsx
├── employee-onboarding.tsx
├── product-order.tsx
├── quote-request.tsx
├── support-ticket.tsx
├── appointment-booking.tsx
├── survey-poll.tsx
├── course-evaluation.tsx
├── quiz-test.tsx
├── nda-agreement.tsx
├── expense-reimbursement.tsx
├── form-renderer.tsx      # Main dispatcher
├── components/
│   └── form-field.tsx     # Shared field components
├── utils/
│   ├── form-template.utils.ts  # Validation & form logic
│   └── ui.utils.ts             # UI utilities & themes
└── index.ts               # Exports
```

## Examples

### Lead Capture Form

```tsx
<FormRenderer
  formData={{
    type: "lead_capture",
    title: "Tell us about your project",
    fields: [
      { id: "name", type: "text", label: "Name", validation: { required: true } },
      { id: "email", type: "email", label: "Email", validation: { required: true } },
      {
        id: "budget",
        type: "slider",
        label: "Budget Range",
        validation: { required: true, min: 0, max: 100 },
      },
    ],
    settings: {
      submitButtonText: "Get Quote",
      successMessage: "Thank you! We'll contact you soon.",
    },
  }}
  submitUrl="/api/leads"
/>
```

### Quiz Form

```tsx
<FormRenderer
  formData={{
    type: "quiz_test",
    title: "Assessment Quiz",
    fields: [
      {
        id: "q1",
        type: "radio",
        label: "Question 1?",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
        validation: { required: true },
      },
    ],
    settings: { submitButtonText: "Submit Quiz" },
  }}
  submitUrl="/api/quiz-submit"
/>
```

## TypeScript Support

All components are fully typed with TypeScript. Import types for custom implementations:

```tsx
import type {
  FormData,
  FormFieldItem,
  TemplateForm,
  UITheme,
  TemplateUIProps,
} from "@/features/form-builder/templates";
```

## Performance

- Optimized re-renders with React.useMemo
- Zod validation with efficient parsing
- Lazy component loading via FormRenderer
- CSS variables for theme switching (no style recalculation)

## Browser Support

All templates support modern browsers (Chrome, Firefox, Safari, Edge) with full CSS Grid and Flexbox support.
