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
import {
  selectFormSlug,
  selectSelectedFieldId,
} from "@/redux/features/form-builder/form.selectors";

/**
 * FormBuilder Component
 *
 * Main orchestrator for the form building interface.
 *
 * Redux Subscriptions:
 * - formSlug (via selectFormSlug) - used to sync URL slug with Redux state
 * - selectedFieldId (via selectSelectedFieldId) - passed to FormCanvas for highlighting
 *
 * All other form state subscriptions are handled by child components:
 * - TopBar: subscribes to title, description, slug, settings, fields
 * - FormCanvas: subscribes to fields, title, description, settings
 * - FormMeta (inside FormCanvas): subscribes to title, description
 * - PropertiesPanel: subscribes to selectedFieldId, selectedField, fields, settings
 *
 * This separation means:
 * - FormBuilder only re-renders when slug or selectedFieldId changes
 * - Each child component only re-renders when its specific data changes
 * - Changing form title only affects FormMeta and TopBar, not FormCanvas list
 * - Changing a field only affects that field item, not form metadata
 */
export function FormBuilder() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Only subscribe to formSlug and selectedFieldId
  const formSlug = useSelector(selectFormSlug);
  const selectedFieldId = useSelector(selectSelectedFieldId);

  // Local UI state
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  // Sync URL slug with Redux state
  useEffect(() => {
    const slug = searchParams.get("slug");

    if (slug && slug !== formSlug) {
      dispatch(setFormSlug(slug));
    }
  }, [formSlug, searchParams, dispatch]);

  // Memoize callbacks to avoid unnecessary re-renders of child components
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Click to Add Fields */}
        <div className="w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
          <ElementsSidebar onAddField={handleAddField} />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 min-w-0 overflow-y-auto bg-muted/20">
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
          {propertiesOpen && <PropertiesPanel onClose={handleCloseProperties} />}
        </div>
      </div>
    </div>
  );
}
