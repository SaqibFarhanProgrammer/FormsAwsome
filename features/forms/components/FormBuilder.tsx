"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addField,
  removeField,
  selectField,
  setFormSlug,
} from "@/redux/features/form-builder/form.slice";
import { PropertiesPanel } from "./PropertiesPanel";
import { TopBar } from "./Topbar";
import { FormCanvas } from "./FormCanvas";
import { ElementsSidebar } from "./ElementsSidebar";
import { AiChatSidebar } from "./AiChatSidebar";
import {
  selectFormSlug,
  selectSelectedFieldId,
} from "@/redux/features/form-builder/form.selectors";

export function FormBuilder() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const formSlug = useSelector(selectFormSlug);
  const selectedFieldId = useSelector(selectSelectedFieldId);

  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(true);

  useEffect(() => {
    const slug = searchParams.get("slug");

    if (slug && slug !== formSlug) {
      dispatch(setFormSlug(slug));
    }
  }, [formSlug, searchParams, dispatch]);

  const handleAddField = useCallback(
    (type: string, label: string) => {
      dispatch(
        addField({
          type,
          label,
          placeholder: `Enter ${label.toLowerCase()}...`,
          required: false,
        }),
      );
      setPropertiesOpen(true);
    },
    [dispatch],
  );

  const handleSelectField = useCallback(
    (id: string) => {
      dispatch(selectField(id));
      setPropertiesOpen(true);
    },
    [dispatch],
  );

  const handleRemoveField = useCallback(
    (id: string) => {
      dispatch(removeField(id));
    },
    [dispatch],
  );

  const handleCloseProperties = useCallback(() => {
    setPropertiesOpen(false);
    dispatch(selectField(null));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Left Sidebar - Click to Add Fields */}
        <div className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
          <ElementsSidebar onAddField={handleAddField} />
        </div>

        {/* Center Canvas */}
        <div className="min-w-0 flex-1 overflow-y-auto bg-muted/20">
          <FormCanvas
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            onRemoveField={handleRemoveField}
          />
        </div>

        {/* Right Sidebar - Properties (Collapsible) */}
        <div
          className={`shrink-0 border-l border-border bg-card overflow-y-auto transition-all duration-300 ${
            propertiesOpen ? "w-80" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          {propertiesOpen && (
            <PropertiesPanel
              onClose={handleCloseProperties}
              onOpenAi={() => setAiChatOpen(true)}
              aiChatOpen={aiChatOpen}
            />
          )}
        </div>

        <AiChatSidebar isOpen={aiChatOpen} onCollapse={() => setAiChatOpen(false)} />
      </div>
    </div>
  );
}
