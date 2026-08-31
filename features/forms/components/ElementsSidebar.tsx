"use client";

import { Button } from "@/components/ui/button";
import {
  Type,
  AlignLeft,
  ListFilter,
  CheckSquare,
  CircleDot,
  Mail,
  Phone,
  Calendar,
  Hash,
  Link,
  Upload,
  Star,
  ToggleLeft,
  Heading1,
  SeparatorHorizontal,
} from "lucide-react";

const elements = [
  { type: "heading", label: "Heading", icon: Heading1 },
  { type: "text", label: "Short Text", icon: Type },
  { type: "textarea", label: "Long Text", icon: AlignLeft },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "number", label: "Number", icon: Hash },
  { type: "date", label: "Date", icon: Calendar },
  { type: "url", label: "URL / Link", icon: Link },
  { type: "select", label: "Dropdown", icon: ListFilter },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio", icon: CircleDot },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "rating", label: "Rating", icon: Star },
  { type: "toggle", label: "Toggle", icon: ToggleLeft },
  { type: "divider", label: "Divider", icon: SeparatorHorizontal },
];

interface ElementsSidebarProps {
  onAddField: (type: string, label: string) => void;
}

export function ElementsSidebar({ onAddField }: ElementsSidebarProps) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Form Elements</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Click to add to canvas</p>
      </div>

      <div className="space-y-1.5">
        {elements.map((element) => {
          const Icon = element.icon;
          return (
            <Button
              key={element.type}
              variant="ghost"
              className="w-full justify-start gap-3 h-11 rounded-xl text-sm font-normal hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => onAddField(element.type, element.label)}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span>{element.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}