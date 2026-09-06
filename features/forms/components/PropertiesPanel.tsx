"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { QRCodeCanvas } from "qrcode.react";

import {
  FormSettings,
  FormFieldType,
  updateField,
  updateFormMeta,
  updateFormSettings,
  duplicateField,
  removeField,
} from "@/redux/features/form-builder/form.slice";
import {
  Settings,
  Trash2,
  Copy,
  Eye,
  QrCode,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Share2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedField,
  selectFormTitle,
  selectFormDescription,
  selectFormSettings,
  selectFormFields,
} from "@/redux/features/form-builder/form.selectors";
import { useCallback, useState } from "react";
import { showAlert } from "@/redux/features/global/alertSlice";

interface PropertiesPanelProps {
  onClose: () => void;
}

/**
 * PropertiesPanel Component
 *
 * Displays properties for the currently selected field or form settings.
 *
 * Redux Subscriptions:
 * - selectedFieldId → selectedField (via selectSelectedField) - determines what to display
 * - formTitle, formDescription (via selectors) - used only in form settings view
 * - formSettings (via selectFormSettings) - used only in form settings view
 *
 * This component subscribes narrowly to prevent unnecessary re-renders:
 * - Only subscribes to selectedField, not the entire form state
 * - When a field's label changes, other unrelated components won't re-render
 */
export function PropertiesPanel({ onClose }: PropertiesPanelProps) {
  const dispatch = useDispatch();

  const selectedField = useSelector(selectSelectedField);
  const formFields = useSelector(selectFormFields);

  // Only subscribe when needed for form settings
  const formTitle = useSelector(selectFormTitle);
  const formDescription = useSelector(selectFormDescription);
  const settings = useSelector(selectFormSettings);
  const formSlug = useSelector((state: import("@/redux/store").RootState) => state.form.formSlug);

  // Memoize the update callback to avoid unnecessary re-renders of dependents
  const handleUpdateField = useCallback(
    (id: string, updates: Partial<typeof selectedField>) => {
      dispatch(updateField({ id, ...updates }));
    },
    [dispatch],
  );

  if (!selectedField) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Form Settings</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={onClose}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Settings className="w-4 h-4" />
          <p className="text-xs">Configure what respondents see after submitting.</p>
        </div>
        <FormSettingsPanel
          title={formTitle}
          description={formDescription}
          settings={settings}
          slug={formSlug}
          onUpdateMeta={(updates) => dispatch(updateFormMeta(updates))}
          onUpdateSettings={(updates) => dispatch(updateFormSettings(updates))}
        />
      </div>
    );
  }

  const showOptions = ["select", "checkbox", "radio"].includes(selectedField.type);
  const showPlaceholder = !["heading", "divider", "toggle", "rating", "checkbox", "radio"].includes(
    selectedField.type,
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Field Properties</h3>
          <p className="text-xs text-muted-foreground capitalize">{selectedField.type} field</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={onClose}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      {/* Basic Properties */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label" className="text-xs font-medium uppercase tracking-wider">
            Label
          </Label>
          <Input
            id="label"
            value={selectedField.label}
            onChange={(e) => handleUpdateField(selectedField.id, { label: e.target.value })}
            className="rounded-xl h-9 text-sm"
          />
        </div>

        {showPlaceholder && (
          <div className="space-y-2">
            <Label htmlFor="placeholder" className="text-xs font-medium uppercase tracking-wider">
              Placeholder
            </Label>
            <Input
              id="placeholder"
              value={selectedField.placeholder || ""}
              onChange={(e) => handleUpdateField(selectedField.id, { placeholder: e.target.value })}
              className="rounded-xl h-9 text-sm"
              placeholder="Enter placeholder..."
            />
          </div>
        )}
      </div>

      <Separator />

      <FieldSettingsPanel
        field={selectedField}
        fields={formFields}
        onUpdate={(updates) => handleUpdateField(selectedField.id, updates)}
      />

      <Separator />

      <FormSettingsAccordion
        settings={settings}
        onUpdateSettings={(updates) => dispatch(updateFormSettings(updates))}
      />

      <Separator />

      {/* Options */}
      {showOptions && (
        <div className="space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider">Options</Label>
          <div className="space-y-2">
            {selectedField.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...selectedField.options!];
                    newOptions[index] = e.target.value;
                    handleUpdateField(selectedField.id, { options: newOptions });
                  }}
                  className="rounded-xl h-9 text-sm flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    dispatch(
                      updateField({
                        id: selectedField.id,
                        options: selectedField.options!.filter((_, i) => i !== index),
                      }),
                    )
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl w-full gap-2 text-xs"
              onClick={() =>
                dispatch(
                  updateField({
                    id: selectedField.id,
                    options: [...selectedField.options!, ""],
                  }),
                )
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </Button>
          </div>
          <Separator />
        </div>
      )}

      <Separator />

      {formSlug && <FormShareCard slug={formSlug} />}

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="default"
          className="rounded-xl w-full gap-2 text-xs"
          onClick={() =>
            dispatch(
              showAlert({
                message: "Use Publish in the top bar to publish this form.",
                type: "warning",
              }),
            )
          }
        >
          Publish Form
        </Button>
        <Button
          variant="outline"
          className="rounded-xl w-full gap-2 text-xs"
          onClick={() => dispatch(duplicateField(selectedField.id))}
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate Field
        </Button>
        <Button
          variant="outline"
          className="rounded-xl w-full gap-2 text-xs"
          onClick={() =>
            dispatch(
              showAlert({
                message: "Field preview is available in the Preview button.",
                type: "success",
              }),
            )
          }
        >
          <Eye className="w-3.5 h-3.5" />
          Preview Field
        </Button>
        <Button
          variant="outline"
          className="rounded-xl w-full gap-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
          onClick={() => {
            dispatch(removeField(selectedField.id));
            onClose();
            dispatch(showAlert({ message: "Field deleted", type: "success" }));
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Field
        </Button>
      </div>
    </div>
  );
}

function FieldSettingsPanel({
  field,
  fields,
  onUpdate,
}: {
  field: FormFieldType;
  fields: FormFieldType[];
  onUpdate: (updates: Partial<FormFieldType>) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const sourceFields = fields.filter((item) => item.id !== field.id && item.type !== "divider");

  return (
    <div className="rounded-xl border border-border bg-muted/20">
      <button
        type="button"
        className="flex w-full items-center justify-between p-3 text-left"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <Settings className="h-4 w-4 text-primary" />
          Field Settings
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Required</Label>
              <p className="text-xs text-muted-foreground">Respondents must fill this field</p>
            </div>
            <Switch
              checked={field.required}
              onCheckedChange={(required) => onUpdate({ required })}
            />
          </div>

          {!["heading", "divider", "checkbox", "radio", "toggle", "rating", "file"].includes(
            field.type,
          ) && (
            <FormSettingInput
              label="Default value"
              value={String(field.defaultValue ?? "")}
              placeholder="Value shown before typing"
              onChange={(defaultValue) => onUpdate({ defaultValue })}
            />
          )}

          <div className="space-y-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Conditional request</Label>
                <p className="text-xs text-muted-foreground">
                  Show this field only when a rule matches
                </p>
              </div>
              <Switch
                checked={field.logic?.enabled ?? false}
                disabled={sourceFields.length === 0}
                onCheckedChange={(enabled) =>
                  onUpdate({
                    logic: {
                      enabled,
                      sourceFieldId: field.logic?.sourceFieldId || sourceFields[0]?.id || "",
                      operator: field.logic?.operator || "equals",
                      value: field.logic?.value || "",
                    },
                  })
                }
              />
            </div>

            {field.logic?.enabled && sourceFields.length > 0 && (
              <div className="space-y-3">
                <label className="block space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider">When field</span>
                  <select
                    value={field.logic.sourceFieldId}
                    onChange={(event) =>
                      onUpdate({ logic: { ...field.logic!, sourceFieldId: event.target.value } })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    {sourceFields.map((sourceField) => (
                      <option key={sourceField.id} value={sourceField.id}>
                        {sourceField.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Condition</span>
                  <select
                    value={field.logic.operator}
                    onChange={(event) =>
                      onUpdate({
                        logic: {
                          ...field.logic!,
                          operator: event.target.value as FormFieldType["logic"] extends infer Logic
                            ? Logic extends { operator: infer Operator }
                              ? Operator
                              : never
                            : never,
                        },
                      })
                    }
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Does not equal</option>
                    <option value="contains">Contains</option>
                  </select>
                </label>
                <FormSettingInput
                  label="Value"
                  value={field.logic.value}
                  placeholder="Enter matching value"
                  onChange={(value) => onUpdate({ logic: { ...field.logic!, value } })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormSettingInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl h-9 text-sm"
      />
    </div>
  );
}

function FormSettingsAccordion({
  settings,
  onUpdateSettings,
}: {
  settings: FormSettings;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-muted/20">
      <button
        type="button"
        className="flex w-full items-center justify-between p-3 text-left"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <Settings className="h-4 w-4 text-primary" />
          Form Settings
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border p-3">
          <FormSettingInput
            label="Submit button text"
            value={settings.submitButtonText}
            onChange={(value) => onUpdateSettings({ submitButtonText: value })}
          />
          <FormSettingInput
            label="Success message"
            value={settings.successMessage}
            onChange={(value) => onUpdateSettings({ successMessage: value })}
          />
          <FormSettingInput
            label="Redirect URL (optional)"
            value={settings.redirectUrl}
            placeholder="https://example.com/thanks"
            onChange={(value) => onUpdateSettings({ redirectUrl: value })}
          />
          <FormSettingInput
            label="Notification email (optional)"
            type="email"
            value={settings.notifyEmail}
            placeholder="you@example.com"
            onChange={(value) => onUpdateSettings({ notifyEmail: value })}
          />
        </div>
      )}
    </div>
  );
}

function FormSettingsPanel({
  title,
  description,
  settings,
  slug,
  onUpdateMeta,
  onUpdateSettings,
}: {
  title: string;
  description: string;
  settings: FormSettings;
  slug: string | null;
  onUpdateMeta: (updates: { title?: string; description?: string }) => void;
  onUpdateSettings: (updates: Partial<FormSettings>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="form-title" className="text-xs font-medium uppercase tracking-wider">
          Form title
        </Label>
        <Input
          id="form-title"
          value={title}
          onChange={(event) => onUpdateMeta({ title: event.target.value })}
          className="rounded-xl h-9 text-sm"
          placeholder="Untitled Form"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-description" className="text-xs font-medium uppercase tracking-wider">
          Form description
        </Label>
        <Input
          id="form-description"
          value={description}
          onChange={(event) => onUpdateMeta({ description: event.target.value })}
          className="rounded-xl h-9 text-sm"
          placeholder="Describe your form"
        />
      </div>
      <FormSettingInput
        label="Submit button text"
        value={settings.submitButtonText}
        onChange={(value) => onUpdateSettings({ submitButtonText: value })}
      />
      <FormSettingInput
        label="Success message"
        value={settings.successMessage}
        onChange={(value) => onUpdateSettings({ successMessage: value })}
      />
      <FormSettingInput
        label="Redirect URL (optional)"
        value={settings.redirectUrl}
        placeholder="https://example.com/thanks"
        onChange={(value) => onUpdateSettings({ redirectUrl: value })}
      />
      <FormSettingInput
        label="Notification email (optional)"
        type="email"
        value={settings.notifyEmail}
        placeholder="you@example.com"
        onChange={(value) => onUpdateSettings({ notifyEmail: value })}
      />
      {slug && <FormShareCard slug={slug} />}
    </div>
  );
}

function FormShareCard({ slug }: { slug: string }) {
  const dispatch = useDispatch();
  const [showQr, setShowQr] = useState(false);
  const url = typeof window === "undefined" ? `/f/${slug}` : `${window.location.origin}/f/${slug}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    dispatch(showAlert({ message: "Form URL copied", type: "success" }));
  };

  const shareForm = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Share form", url });
      return;
    }
    await copyUrl();
  };

  return (
    <Card className="rounded-xl border-border bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          Share Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="break-all text-center text-xs text-muted-foreground">{url}</p>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 px-2 text-xs" onClick={copyUrl}>
            <Copy className="h-3.5 w-3.5" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 px-2 text-xs" onClick={shareForm}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant={showQr ? "default" : "outline"}
            size="sm"
            className="gap-1.5 px-2 text-xs"
            onClick={() => setShowQr((visible) => !visible)}
          >
            <QrCode className="h-3.5 w-3.5" />
            QR Code
          </Button>
        </div>
        {showQr && (
          <div className="flex justify-center rounded-lg bg-white p-3">
            <QRCodeCanvas value={url} size={150} includeMargin />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
