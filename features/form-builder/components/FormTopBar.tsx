"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Pencil, Eye, Link } from "lucide-react";
import { FormState } from "../types/form-builder.types";

const THEME = { primary: "#432DD7" };

interface FormTopBarProps {
  title: string;
  state: FormState;
  slug: string;
}

export function FormTopBar({ title, state, slug }: FormTopBarProps) {
  return (
    <div className="h-10 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold truncate max-w-[250px]">{title}</h1>
          <Badge
            variant="secondary"
            className="rounded-lg text-xs font-medium px-2 py-0.5"
            style={{
              backgroundColor: state === FormState.PUBLISHED ? "#dcfce7" : "#fef3c7",
              color: state === FormState.PUBLISHED ? "#166534" : "#92400e",
            }}
          >
            {state === FormState.PUBLISHED ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
          <Link className="w-3.5 h-3.5" />
          Copy URL
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </Button>
        <Button
          size="sm"
          className="rounded-xl gap-2 text-xs"
          style={{ backgroundColor: THEME.primary }}
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Form
        </Button>
      </div>
    </div>
  );
}
