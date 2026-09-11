import fixtureData from "./template-test-forms.json";
import type { FormData } from "./default-form";

export type TemplateTestForm = FormData & {
  id: string;
  type: string;
  templateType: string;
};

const fixtureMap = fixtureData as Record<string, TemplateTestForm>;

export const templateTestFormList: TemplateTestForm[] = Object.values(fixtureMap).map((form) => ({
  ...form,
  type: form.type || form.templateType || "default_contact_form",
  templateType: form.templateType || form.type || "default_contact_form",
}));

export const templateTestForms: TemplateTestForm[] = templateTestFormList;
