"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Save, Share2 } from "lucide-react";

export function TopBar() {
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
        <Button size="sm" className="rounded-xl gap-2" style={{ backgroundColor: "#432DD7" }}>
          <Save className="w-4 h-4" />
          Save Form
        </Button>
        <Button size="sm" className="rounded-xl  gap-2" style={{ backgroundColor: "#432DD7" }}>
          <Save className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
