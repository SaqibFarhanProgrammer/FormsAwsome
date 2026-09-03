"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  FormFieldType,
  FormSettings,
  updateField,
  updateFormMeta,
  updateFormSettings,
} from "@/redux/features/form-builder/form.slice";
import { Settings, Trash2, Copy, Eye, QrCode, Plus, X, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PropertiesPanelProps {
  selectedField: FormFieldType | null;
  onUpdateField: (id: string, updates: Partial<FormFieldType>) => void;
  onClose: () => void;
}

export function PropertiesPanel({ selectedField, onUpdateField, onClose }: PropertiesPanelProps) {
  const dispatch = useDispatch();
  const formTitle = useSelector((state: RootState) => state.form.formTitle);
  const formDescription = useSelector((state: RootState) => state.form.formDescription);
  const settings = useSelector((state: RootState) => state.form.settings);
  const fields = useSelector((state: RootState) => state.form.fields);

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

      <FormSettingsPanel
        title={formTitle}
        description={formDescription}
        settings={settings}
        onUpdateMeta={(updates) => dispatch(updateFormMeta(updates))}
        onUpdateSettings={(updates) => dispatch(updateFormSettings(updates))}
      />

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
            onChange={(e) => onUpdateField(selectedField.id, { label: e.target.value })}
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
              onChange={(e) => onUpdateField(selectedField.id, { placeholder: e.target.value })}
              className="rounded-xl h-9 text-sm"
              placeholder="Enter placeholder..."
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Required</Label>
            <p className="text-xs text-muted-foreground">Make this field mandatory</p>
          </div>
          <Switch
            checked={selectedField.required}
            onCheckedChange={(checked) => onUpdateField(selectedField.id, { required: checked })}
          />
        </div>
      </div>

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
                    onUpdateField(selectedField.id, { options: newOptions });
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

      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wider">Field Logic</Label>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Conditional visibility</Label>
            <p className="text-xs text-muted-foreground">Show this field based on another answer</p>
          </div>
          <Switch
            checked={selectedField.logic?.enabled ?? false}
            onCheckedChange={(enabled) =>
              onUpdateField(selectedField.id, {
                logic: {
                  enabled,
                  sourceFieldId: selectedField.logic?.sourceFieldId || "",
                  operator: selectedField.logic?.operator || "equals",
                  value: selectedField.logic?.value || "",
                },
              })
            }
          />
        </div>
        <>
          <select
            value={selectedField.logic?.sourceFieldId || ""}
            onChange={(event) =>
              onUpdateField(selectedField.id, {
                logic: { ...selectedField.logic!, sourceFieldId: event.target.value },
              })
            }
            className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">Select a source field</option>
            {fields
              .filter((field) => field.id !== selectedField.id)
              .map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
          </select>
          <select
            value={selectedField.logic?.operator || "equals"}
            onChange={(event) =>
              onUpdateField(selectedField.id, {
                logic: {
                  ...selectedField.logic!,
                  operator: event.target.value as "equals" | "not_equals" | "contains",
                },
              })
            }
            className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="equals">Equals</option>
            <option value="not_equals">Does not equal</option>
            <option value="contains">Contains</option>
          </select>
          <Input
            value={selectedField.logic?.value}
            onChange={(event) =>
              onUpdateField(selectedField.id, {
                logic: { ...selectedField.logic!, value: event.target.value },
              })
            }
            className="rounded-xl h-9 text-sm"
            placeholder="Expected answer"
          />
        </>
      </div>

      <Card className="rounded-xl border-border bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" />
            QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-full aspect-square rounded-xl bg-white border border-border flex items-center justify-center">
            <div className="grid grid-cols-5 gap-0.5 w-24 h-24">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full aspect-square ${
                    [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].includes(i)
                      ? "bg-foreground"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Scan to preview this form</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="default" className="rounded-xl w-full gap-2 text-xs">
          Publish Form
        </Button>
        <Button variant="outline" className="rounded-xl w-full gap-2 text-xs">
          <Copy className="w-3.5 h-3.5" />
          Duplicate Field
        </Button>
        <Button variant="outline" className="rounded-xl w-full gap-2 text-xs">
          <Eye className="w-3.5 h-3.5" />
          Preview Field
        </Button>
        <Button
          variant="outline"
          className="rounded-xl w-full gap-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Field
        </Button>
      </div>
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

function FormSettingsPanel({
  title,
  description,
  settings,
  onUpdateMeta,
  onUpdateSettings,
}: {
  title: string;
  description: string;
  settings: FormSettings;
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
    </div>
  );
}
