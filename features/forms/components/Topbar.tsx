"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createForm } from "@/redux/features/Form-builder/Form-Create.slice";
import { AppDispatch } from "@/redux/store";

export function TopBar() {
  const title = useSelector((state: any) => state.form.formTitle);
  const description = useSelector((state: any) => state.form.formDescription);
  const [UiError, setUiError] = useState("");
  const { fields, selectedFieldId } = useSelector((state: any) => state.form);

  const dispatch = useDispatch<AppDispatch>();

  const handleCreateForm = async () => {
    try {
      const result = await dispatch(
        createForm({
          title,
          description,
          fields: fields ?? [],
        }),
      ).unwrap();

      console.log("Form created:", result);
    } catch (error) {
      console.error("Create form failed:", error);
    }
  };
  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
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
        <div>
          <h1 className="text-sm font-semibold">Untitled Form</h1>
          <p className="text-xs text-muted-foreground">Draft · Last edited just now</p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-lg text-xs bg-amber-50 text-amber-700 border-amber-200/50"
        >
          Draft
        </Badge>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <Button
          size="sm"
          onClick={handleCreateForm}
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
        >
          <Save className="w-4 h-4" />
          Create Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
        >
          <Save className="w-4 h-4" />
          Save Form
        </Button>
        <Button
          size="sm"
          className="rounded-xl px-5 py-2 gap-2"
          style={{ backgroundColor: "#432DD7" }}
        >
          <Save className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
