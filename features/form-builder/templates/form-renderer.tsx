"use client";

import type { ReactNode } from "react";
import { ContactFormUI } from "./contact-form";
import { LeadCaptureUI } from "./lead-capture";
import { CustomerFeedbackUI } from "./customer-feedback";
import { EventRegistrationUI } from "./event-registration";
import { NewsletterSignupUI } from "./newsletter-signup";
import { EmployeeCheckinUI } from "./employee-checkin";
import { WorkflowRequestUI } from "./workflow-request";
import { CompanyAuditUI } from "./company-audit";
import { JobApplicationUI } from "./job-application";
import { LeaveRequestUI } from "./leave-request";
import { EmployeeOnboardingUI } from "./employee-onboarding";
import { ProductOrderUI } from "./product-order";
import { QuoteRequestUI } from "./quote-request";
import { SupportTicketUI } from "./support-ticket";
import { AppointmentBookingUI } from "./appointment-booking";
import { SurveyPollUI } from "./survey-poll";
import { CourseEvaluationUI } from "./course-evaluation";
import { QuizTestUI } from "./quiz-test";
import { NdaAgreementUI } from "./nda-agreement";
import { ExpenseReimbursementUI } from "./expense-reimbursement";
import DefaultForm, { type FormData } from "./default-form";
import { MinimalFormTemplate } from "./minimal-form";
import type { TemplateUIProps } from "./utils/ui.utils";

export interface FormRendererProps {
  formData: FormData & { type?: string; templateType?: string };
  submitUrl: string;
  className?: string;
  hasSubmitted?: boolean;
}

/**
 * Form Template Registry
 *
 * Maps form type to component
 * Usage: <FormRenderer formData={{...formData, type: "contact_form"}} submitUrl="/api/submit" />
 */
export const formTemplateRegistry: Record<string, (props: TemplateUIProps) => ReactNode> = {
  contact_form: ContactFormUI,
  default_contact_form: ContactFormUI,
  lead_capture: LeadCaptureUI,
  customer_feedback: CustomerFeedbackUI,
  event_registration: EventRegistrationUI,
  newsletter_signup: NewsletterSignupUI,
  employee_checkin: EmployeeCheckinUI,
  workflow_request: WorkflowRequestUI,
  company_audit: CompanyAuditUI,
  job_application: JobApplicationUI,
  leave_request: LeaveRequestUI,
  employee_onboarding: EmployeeOnboardingUI,
  product_order: ProductOrderUI,
  quote_request: QuoteRequestUI,
  support_ticket: SupportTicketUI,
  appointment_booking: AppointmentBookingUI,
  survey_poll: SurveyPollUI,
  course_evaluation: CourseEvaluationUI,
  quiz_test: QuizTestUI,
  nda_agreement: NdaAgreementUI,
  expense_reimbursement: ExpenseReimbursementUI,
};

const defaultTemplate = DefaultForm;

const minimalTemplateRegistry: Record<string, (props: TemplateUIProps) => ReactNode> =
  Object.fromEntries(Object.keys(formTemplateRegistry).map((type) => [type, MinimalFormTemplate]));

/**
 * Form Template Renderer
 * Automatically renders the correct form template based on formData.type
 * Falls back to the default form if type is not recognized
 *
 * @example
 * <FormRenderer
 *   formData={{
 *     id: "form-1",
 *     title: "Contact Us",
 *     type: "contact_form",
 *     fields: [...],
 *     settings: {...}
 *   }}
 *   submitUrl="/api/forms/submit"
 *   hasSubmitted={isSubmitted}
 * />
 */
export function FormRenderer({ formData, submitUrl, className, hasSubmitted }: FormRendererProps) {
  const type = formData.type || formData.templateType || "default_contact_form";
  const Component = minimalTemplateRegistry[type] || defaultTemplate;

  return (
    <Component
      formData={formData}
      submitUrl={submitUrl}
      className={className}
      hasSubmitted={hasSubmitted}
    />
  );
}

/**
 * Get available template types
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(formTemplateRegistry);
}

/**
 * Get template display name
 */
export function getTemplateName(type: string): string {
  const names: Record<string, string> = {
    contact_form: "Contact Form",
    lead_capture: "Lead Capture",
    customer_feedback: "Customer Feedback",
    event_registration: "Event Registration",
    newsletter_signup: "Newsletter Signup",
    employee_checkin: "Employee Check-in",
    workflow_request: "Workflow Request",
    company_audit: "Company Audit",
    job_application: "Job Application",
    leave_request: "Leave Request",
    employee_onboarding: "Employee Onboarding",
    product_order: "Product Order",
    quote_request: "Quote Request",
    support_ticket: "Support Ticket",
    appointment_booking: "Appointment Booking",
    survey_poll: "Survey Poll",
    course_evaluation: "Course Evaluation",
    quiz_test: "Quiz Test",
    nda_agreement: "NDA Agreement",
    expense_reimbursement: "Expense Reimbursement",
  };
  return names[type] || "Form";
}

export default FormRenderer;
