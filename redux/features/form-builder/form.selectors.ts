import { RootState } from "@/redux/store";

/**
 * Narrow selectors for form state to prevent unnecessary re-renders.
 * Each component should use the most specific selector for its data needs.
 */

// Form Metadata selectors
export const selectFormTitle = (state: RootState): string => state.form.formTitle;

export const selectFormDescription = (state: RootState): string => state.form.formDescription;

export const selectFormMeta = (state: RootState) => ({
  title: state.form.formTitle,
  description: state.form.formDescription,
});

// Fields selectors
export const selectFormFields = (state: RootState) => state.form.fields;

export const selectFieldById = (state: RootState, fieldId: string | null) =>
  fieldId ? state.form.fields.find((f) => f.id === fieldId) : null;

// Selection selectors
export const selectSelectedFieldId = (state: RootState): string | null =>
  state.form.selectedFieldId;

export const selectSelectedField = (state: RootState) => {
  const { fields, selectedFieldId } = state.form;
  return selectedFieldId ? fields.find((f) => f.id === selectedFieldId) : null;
};

// Form slug selector
export const selectFormSlug = (state: RootState): string | null => state.form.formSlug;

// Settings selectors
export const selectFormSettings = (state: RootState) => state.form.settings;

export const selectFormSubmitButtonText = (state: RootState): string =>
  state.form.settings.submitButtonText;

export const selectFormSuccessMessage = (state: RootState): string =>
  state.form.settings.successMessage;

// Combined selectors (use sparingly - these break the subscription isolation benefit)
export const selectFormState = (state: RootState) => state.form;

// Derived selectors for specific use cases
export const selectFieldsExceptSelected = (state: RootState) => {
  const { fields, selectedFieldId } = state.form;
  return fields.filter((f) => f.id !== selectedFieldId);
};
