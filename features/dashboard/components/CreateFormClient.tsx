"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { FormBuilder } from "@/features/forms/components/FormBuilder";

export function CreateFormClient() {
  return (
    <Provider store={store}>
      <FormBuilder />
    </Provider>
  );
}