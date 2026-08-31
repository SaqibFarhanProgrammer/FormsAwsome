"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/redux/features/Create-form/Form.Slice";
import { Settings, Trash2, Copy, Eye, QrCode, Plus, X, ChevronRight } from "lucide-react";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onClose: () => void;
}

export function PropertiesPanel({ selectedField, onUpdateField, onClose }: PropertiesPanelProps) {
  const [options, setOptions] = useState<string[]>(["Option 1", "Option 2", "Option 3"]);

  if (!selectedField) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Properties</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={onClose}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl  flex items-center justify-center">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No Field Selected</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click on a field to edit properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showOptions = ["select", "checkbox", "radio"].includes(selectedField.type);
  const showPlaceholder = !["heading", "divider", "toggle", "rating", "checkbox", "radio"].includes(
    selectedField.type,
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
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
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="rounded-xl h-9 text-sm flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-destructive"
                  onClick={() => setOptions(options.filter((_, i) => i !== index))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl w-full gap-2 text-xs"
              onClick={() => setOptions([...options, `Option ${options.length + 1}`])}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Option
            </Button>
          </div>
          <Separator />
        </div>
      )}

      {/* QR Code */}
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
