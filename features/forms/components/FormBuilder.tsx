"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  addField,
  removeField,
  selectField,
  updateField,
  setFormSlug,
} from "@/redux/features/form-builder/form.slice";
import { PropertiesPanel } from "./PropertiesPanel";
import { TopBar } from "./Topbar";
import { FormCanvas } from "./FormCanvas";
import { ElementsSidebar } from "./ElementsSidebar";
import { RootState } from "@/redux/store";

export function FormBuilder() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { fields, selectedFieldId, formSlug } = useSelector((state: RootState) => state.form);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  useEffect(() => {
    const slug = searchParams.get("slug");

    if (slug && slug !== formSlug) {
      dispatch(setFormSlug(slug));
    }
  }, [formSlug, searchParams]);

  const handleAddField = (type: string, label: string) => {
    dispatch(
      addField({
        type,
        label,
        placeholder: `Enter ${label.toLowerCase()}...`,
        required: false,
      }),
    );
    setPropertiesOpen(true);
  };

  const handleSelectField = (id: string) => {
    dispatch(selectField(id));
    setPropertiesOpen(true);
  };

  const selectedField = fields.find((f: any) => f.id === selectedFieldId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Click to Add Fields */}
        <div className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
          <ElementsSidebar onAddField={handleAddField} />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-muted/20">
          <FormCanvas
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onRemoveField={(id) => dispatch(removeField(id))}
          />
        </div>

        {/* Right Sidebar - Properties (Collapsible) */}
        <div
          className={`shrink-0 border-l border-border bg-card overflow-y-auto transition-all duration-300 ${
            propertiesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <PropertiesPanel
            selectedField={selectedField!}
            onUpdateField={(id, updates) => dispatch(updateField({ id, ...updates }))}
            onClose={() => {
              setPropertiesOpen(false);
              dispatch(selectField(null));
            }}
          />
        </div>
      </div>
    </div>
  );
}
