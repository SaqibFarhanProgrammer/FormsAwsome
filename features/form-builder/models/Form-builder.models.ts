import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { FormState } from "../types/Form-builder.types";

export interface FormOption {
  label: string;
  value: string;
}

export interface FormValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  options?: FormOption[];
  validation: FormValidation;
}

interface FormBuilderState {
  fields: FormField[];
  selectedFieldId: string | null;
  formTitle: string;
  formDescription: string;
  isDirty: boolean;
  state: FormState;
}

const initialState: FormBuilderState = {
  fields: [],
  selectedFieldId: null,
  formTitle: "Untitled Form",
  formDescription: "",
  isDirty: false,
  state: FormState.DRAFT,
};

const formSlice = createSlice({
  name: "form",
  initialState,

  reducers: {
    addField: (
      state,
      action: PayloadAction<{
        type: string;
        label: string;
        placeholder?: string;
        helperText?: string;
        options?: FormOption[];
        validation?: Partial<FormValidation>;
      }>,
    ) => {
      const {
        type,
        label,
        placeholder,
        helperText,
        options,
        validation,
      } = action.payload;

      const newField: FormField = {
        id: nanoid(),
        type,
        label,
        placeholder:
          placeholder || `Enter ${label.toLowerCase()}...`,
        helperText: helperText || "",
        options: options || [],
        validation: {
          required: validation?.required ?? false,
          min: validation?.min,
          max: validation?.max,
          pattern: validation?.pattern,
        },
      };

      state.fields.push(newField);
      state.selectedFieldId = newField.id;
      state.isDirty = true;
    },

    removeField: (state, action: PayloadAction<string>) => {
      const index = state.fields.findIndex(
        (field) => field.id === action.payload,
      );

      if (index === -1) return;

      state.fields.splice(index, 1);

      if (state.selectedFieldId === action.payload) {
        state.selectedFieldId = null;
      }

      state.isDirty = true;
    },

    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload;
      state.isDirty = true;
    },

    selectField: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedFieldId = action.payload;
    },

    updateField: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<FormField, "id">>;
      }>,
    ) => {
      const field = state.fields.find(
        (field) => field.id === action.payload.id,
      );

      if (!field) return;

      Object.assign(field, action.payload.updates);
      state.isDirty = true;
    },

    updateFieldValidation: (
      state,
      action: PayloadAction<{
        id: string;
        validation: Partial<FormValidation>;
      }>,
    ) => {
      const field = state.fields.find(
        (field) => field.id === action.payload.id,
      );

      if (!field) return;

      field.validation = {
        ...field.validation,
        ...action.payload.validation,
      };

      state.isDirty = true;
    },

    updateFormMeta: (
      state,
      action: PayloadAction<{
        title?: string;
        description?: string;
      }>,
    ) => {
      if (action.payload.title !== undefined) {
        state.formTitle = action.payload.title;
      }

      if (action.payload.description !== undefined) {
        state.formDescription = action.payload.description;
      }

      state.isDirty = true;
    },

    setFormState: (
      state,
      action: PayloadAction<FormState>,
    ) => {
      state.state = action.payload;
      state.isDirty = true;
    },

    clearForm: (state) => {
      state.fields = [];
      state.selectedFieldId = null;
      state.formTitle = "Untitled Form";
      state.formDescription = "";
      state.state = FormState.DRAFT;
      state.isDirty = false;
    },

    markSaved: (state) => {
      state.isDirty = false;
    },
  },
});

export const {
  addField,
  removeField,
  reorderFields,
  selectField,
  updateField,
  updateFieldValidation,
  updateFormMeta,
  setFormState,
  clearForm,
  markSaved,
} = formSlice.actions;

export default formSlice.reducer;