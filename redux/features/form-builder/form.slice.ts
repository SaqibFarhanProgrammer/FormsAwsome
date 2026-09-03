import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export interface FormFieldType {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  required: boolean;
  options?: string[];
  order: number;
  logic?: FieldLogic;
}

export interface FieldLogic {
  enabled: boolean;
  sourceFieldId: string;
  operator: "equals" | "not_equals" | "contains";
  value: string;
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl: string;
  notifyEmail: string;
}

interface FormState {
  fields: FormFieldType[];
  selectedFieldId: string | null;
  formTitle: string;
  formDescription: string;
  formSlug: string | null;
  settings: FormSettings;
  isDirty: boolean;
}

const initialState: FormState = {
  fields: [],
  selectedFieldId: null,
  formTitle: "Untitled Form",
  formDescription: "",
  formSlug: null,
  settings: {
    submitButtonText: "Submit",
    successMessage: "Thank you for your submission!",
    redirectUrl: "",
    notifyEmail: "",
  },
  isDirty: false,
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
        required?: boolean;
        options?: string[];
      }>,
    ) => {
      const newField: FormFieldType = {
        id: nanoid(),
        type: action.payload.type,
        label: action.payload.label,
        placeholder: action.payload.placeholder || `Enter ${action.payload.label.toLowerCase()}...`,
        required: action.payload.required || false,
        options: action.payload.options || [],
        order: state.fields.length,
      };
      state.fields.push(newField);
      state.selectedFieldId = newField.id;
      state.isDirty = true;
    },
    removeField: (state, action: PayloadAction<string>) => {
      const index = state.fields.findIndex((f) => f.id === action.payload);
      if (index !== -1) {
        state.fields.splice(index, 1);
        if (state.selectedFieldId === action.payload) {
          state.selectedFieldId = null;
        }
        state.isDirty = true;
      }
    },
    reorderFields: (state, action: PayloadAction<FormFieldType[]>) => {
      state.fields = action.payload.map((f, index) => ({ ...f, order: index }));
      state.isDirty = true;
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    updateField: (state, action: PayloadAction<{ id: string } & Partial<FormFieldType>>) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        const { id, order, ...updates } = action.payload;
        Object.assign(field, updates);
        state.isDirty = true;
      }
    },
    updateFormMeta: (state, action: PayloadAction<{ title?: string; description?: string }>) => {
      if (action.payload.title !== undefined) {
        state.formTitle = action.payload.title;
      }
      if (action.payload.description !== undefined) {
        state.formDescription = action.payload.description;
      }
      state.isDirty = true;
    },
    setFormSlug: (state, action: PayloadAction<string | null>) => {
      state.formSlug = action.payload;
    },
    updateFormSettings: (state, action: PayloadAction<Partial<FormSettings>>) => {
      Object.assign(state.settings, action.payload);
      state.isDirty = true;
    },
    clearForm: (state) => {
      state.fields = [];
      state.selectedFieldId = null;
      state.formTitle = "Untitled Form";
      state.formDescription = "";
      state.formSlug = null;
      state.settings = { ...initialState.settings };
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
  updateFormMeta,
  setFormSlug,
  updateFormSettings,
  clearForm,
  markSaved,
} = formSlice.actions;

export default formSlice.reducer;
