export enum FormState {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export type FieldType =
  | "short_text"
  | "long_text"
  | "email"
  | "number"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "rating"
  | "date"
  | "multiple_choice"
  | "file_upload_image"
  | "file_upload_pdf"
  | "slider"
  | "URL"
  | "image";

export type FieldOption = {
  label: string;
  value: string;
};

export type ValidationRules = {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
};

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helperText?: string;
  options?: FieldOption[]; // Array of Objects (Select / Radio choices)
  validation: ValidationRules; // Nested Object
};

export type FormFieldsType = {
  field_id: string;
  title: string;
  fields: FormField[]; // Array of FormField Objects
};
