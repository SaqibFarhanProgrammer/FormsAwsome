/**
 * Form Templates Index
 *
 * Exports all form template components and utilities
 *
 * Usage:
 *   import { FormRenderer, ContactFormUI, getAvailableTemplates } from "@/features/form-builder/templates";
 */

// Main renderer
export {
  FormRenderer,
  formTemplateRegistry,
  getAvailableTemplates,
  getTemplateName,
} from "./form-renderer";
export type { FormRendererProps } from "./form-renderer";
export { MinimalFormTemplate } from "./minimal-form";

// Individual templates
export { ContactFormUI } from "./contact-form";
export { LeadCaptureUI } from "./lead-capture";
export { CustomerFeedbackUI } from "./customer-feedback";
export { EventRegistrationUI } from "./event-registration";
export { NewsletterSignupUI } from "./newsletter-signup";
export { EmployeeCheckinUI } from "./employee-checkin";
export { WorkflowRequestUI } from "./workflow-request";
export { CompanyAuditUI } from "./company-audit";
export { JobApplicationUI } from "./job-application";
export { LeaveRequestUI } from "./leave-request";
export { EmployeeOnboardingUI } from "./employee-onboarding";
export { ProductOrderUI } from "./product-order";
export { QuoteRequestUI } from "./quote-request";
export { SupportTicketUI } from "./support-ticket";
export { AppointmentBookingUI } from "./appointment-booking";
export { SurveyPollUI } from "./survey-poll";
export { CourseEvaluationUI } from "./course-evaluation";
export { QuizTestUI } from "./quiz-test";
export { NdaAgreementUI } from "./nda-agreement";
export { ExpenseReimbursementUI } from "./expense-reimbursement";
export { templateTestForms, templateTestFormList } from "./template-test-forms";
export type { TemplateTestForm } from "./template-test-forms";

// Shared utilities
export { useTemplateForm, buildSchema, buildDefaults } from "./utils/form-template.utils";
export type { TemplateForm, TemplateValue } from "./utils/form-template.utils";
export { cls, SubmitBar, StatusCard, Frame, TAG_COLORS, emojiFor } from "./utils/ui.utils";
export type { UITheme, TemplateUIProps } from "./utils/ui.utils";

// Form field components
export { Controls, Field, DefaultHeader } from "./components/form-field";
