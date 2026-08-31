import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface FormState {
  fields: FormField[];
  selectedFieldId: string | null;
  formTitle: string;
  formDescription: string;
}

const initialState: FormState = {
  fields: [],
  selectedFieldId: null,
  formTitle: "Untitled Form",
  formDescription: "",
};

let fieldCounter = 0;

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
      }>
    ) => {
      fieldCounter += 1;
      const newField: FormField = {
        id: `field-${Date.now()}-${fieldCounter}`,
        type: action.payload.type,
        label: action.payload.label,
        placeholder: action.payload.placeholder || `Enter ${action.payload.label.toLowerCase()}...`,
        required: action.payload.required || false,
        options: action.payload.options || [],
        order: state.fields.length,
      };
      state.fields.push(newField);
      state.selectedFieldId = newField.id;
    },
    removeField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
      if (state.selectedFieldId === action.payload) {
        state.selectedFieldId = null;
      }
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload.map((f, index) => ({ ...f, order: index }));
    },
    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },
    updateField: (
      state,
      action: PayloadAction<{ id: string } & Partial<FormField>>
    ) => {
      const field = state.fields.find((f) => f.id === action.payload.id);
      if (field) {
        Object.assign(field, action.payload);
      }
    },
    updateFormMeta: (
      state,
      action: PayloadAction<{ title?: string; description?: string }>
    ) => {
      if (action.payload.title !== undefined) {
        state.formTitle = action.payload.title;
      }
      if (action.payload.description !== undefined) {
        state.formDescription = action.payload.description;
      }
    },
    clearForm: (state) => {
      state.fields = [];
      state.selectedFieldId = null;
      state.formTitle = "Untitled Form";
      state.formDescription = "";
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
  clearForm,
} = formSlice.actions;

export default formSlice.reducer;