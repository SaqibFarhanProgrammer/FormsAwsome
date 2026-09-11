"use client";

import type { ReactNode } from "react";
import {
  AppointmentBookingUI,
  CompanyAuditUI,
  ContactFormUI,
  CourseEvaluationUI,
  CustomerFeedbackUI,
  EmployeeCheckinUI,
  EmployeeOnboardingUI,
  EventRegistrationUI,
  ExpenseReimbursementUI,
  JobApplicationUI,
  LeadCaptureUI,
  LeaveRequestUI,
  NewsletterSignupUI,
  NdaAgreementUI,
  ProductOrderUI,
  QuizTestUI,
  QuoteRequestUI,
  SupportTicketUI,
  SurveyPollUI,
  WorkflowRequestUI,
} from "../templates";
import DefaultForm, {
  type FormData,
  type FormFieldItem,
  type FormSettings,
} from "../templates/default-form";

export type FieldType = string;
export type { FormData, FormFieldItem, FormSettings };

interface FormUIProps {
  formData: FormData & { hasSubmitted?: boolean };
  submitUrl: string;
  className?: string;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeField(value: unknown, index: number): FormFieldItem | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.type !== "string") {
    return null;
  }

  const rawValidation = isRecord(value.validation) ? value.validation : {};
  const rawOptions = Array.isArray(value.options) ? value.options : [];
  const options = rawOptions.flatMap((option) => {
    if (!isRecord(option)) return [];
    if (typeof option.label !== "string" || typeof option.value !== "string") return [];
    return [{ label: option.label, value: option.value }];
  });

  return {
    id: value.id,
    type: value.type,
    label: typeof value.label === "string" ? value.label : `Field ${index + 1}`,
    placeholder: typeof value.placeholder === "string" ? value.placeholder : undefined,
    helperText: typeof value.helperText === "string" ? value.helperText : undefined,
    formType: typeof value.formType === "string" ? value.formType : undefined,
    uiType: typeof value.uiType === "string" ? value.uiType : undefined,
    options,
    defaultValue:
      typeof value.defaultValue === "string" ||
      typeof value.defaultValue === "number" ||
      typeof value.defaultValue === "boolean"
        ? value.defaultValue
        : undefined,
    validation: {
      required: rawValidation.required === true,
      min: typeof rawValidation.min === "number" ? rawValidation.min : undefined,
      max: typeof rawValidation.max === "number" ? rawValidation.max : undefined,
      pattern: typeof rawValidation.pattern === "string" ? rawValidation.pattern : undefined,
    },
  };
}

function normalizeFormData(
  input: FormData & { hasSubmitted?: boolean },
): FormData & { hasSubmitted?: boolean } {
  const rawFields: unknown[] = Array.isArray(input.fields) ? input.fields : [];
  const fields = rawFields.flatMap((field, index) => {
    const normalized = normalizeField(field, index);
    return normalized ? [normalized] : [];
  });

  const rawSettings: Record<string, unknown> = isRecord(input.settings) ? input.settings : {};

  return {
    ...input,
    title: typeof input.title === "string" && input.title.trim() ? input.title : "Untitled form",
    description: typeof input.description === "string" ? input.description : "",
    fields,
    settings: {
      submitButtonText:
        typeof rawSettings["submitButtonText"] === "string" &&
        rawSettings["submitButtonText"].trim()
          ? rawSettings["submitButtonText"]
          : "Submit",
      successMessage:
        typeof rawSettings["successMessage"] === "string" && rawSettings["successMessage"].trim()
          ? rawSettings["successMessage"]
          : "Thank you for your submission!",
      redirectUrl:
        typeof rawSettings["redirectUrl"] === "string" ? rawSettings["redirectUrl"] : null,
      notifyEmail:
        typeof rawSettings["notifyEmail"] === "string" ? rawSettings["notifyEmail"] : null,
    },
  };
}

function getTemplateType(formData: FormData): string {
  return (
    formData.templateType || formData.fields.find((field) => field.formType)?.formType || "default"
  );
}

function renderTemplate(
  templateType: string,
  formData: FormData & { hasSubmitted?: boolean },
  submitUrl: string,
  className?: string,
  hasSubmitted?: boolean,
): ReactNode {
  const props = { formData, submitUrl, className, hasSubmitted };

  switch (templateType) {
    case "contact":
    case "contact_form":
      return <ContactFormUI {...props} />;
    case "lead_capture":
      return <LeadCaptureUI {...props} />;
    case "customer_feedback":
      return <CustomerFeedbackUI {...props} />;
    case "event_registration":
      return <EventRegistrationUI {...props} />;
    case "newsletter_signup":
      return <NewsletterSignupUI {...props} />;
    case "employee_checkin":
      return <EmployeeCheckinUI {...props} />;
    case "workflow_request":
      return <WorkflowRequestUI {...props} />;
    case "company_audit":
      return <CompanyAuditUI {...props} />;
    case "job_application":
      return <JobApplicationUI {...props} />;
    case "leave_request":
      return <LeaveRequestUI {...props} />;
    case "employee_onboarding":
      return <EmployeeOnboardingUI {...props} />;
    case "product_order":
      return <ProductOrderUI {...props} />;
    case "quote":
    case "quote_request":
      return <QuoteRequestUI {...props} />;
    case "support_ticket":
      return <SupportTicketUI {...props} />;
    case "appointment_booking":
      return <AppointmentBookingUI {...props} />;
    case "survey_poll":
      return <SurveyPollUI {...props} />;
    case "course_evaluation":
      return <CourseEvaluationUI {...props} />;
    case "quiz_test":
      return <QuizTestUI {...props} />;
    case "nda_agreement":
      return <NdaAgreementUI {...props} />;
    case "expense_reimbursement":
      return <ExpenseReimbursementUI {...props} />;
    default:
      return (
        <DefaultForm
          formData={formData}
          submitUrl={submitUrl}
          hasSubmitted={hasSubmitted}
          className={className}
        />
      );
  }
}

export default function FormUI({
  formData,
  submitUrl,
  className,
  hasSubmitted = false,
}: FormUIProps) {
  const normalizedFormData = normalizeFormData(formData);
  const templateType = getTemplateType(normalizedFormData);

  return renderTemplate(
    templateType,
    normalizedFormData,
    submitUrl,
    className,
    hasSubmitted || Boolean(normalizedFormData.hasSubmitted),
  );
}
