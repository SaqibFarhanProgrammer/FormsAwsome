"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Copy, Share2, QrCode, Globe, Trash2 } from "lucide-react";

const THEME = { primary: "#432DD7" };

interface FormActionsProps {
  slug: string;
}

export function FormActions({ slug }: FormActionsProps) {
  const formUrl = `formbuilder.com/f/${slug}`;

  return (
    <div className="space-y-4">
      {/* Share Card */}
      <Card className="rounded-2xl border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Share Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted text-sm">
            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate text-muted-foreground">{formUrl}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs h-9">
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs h-9">
              <QrCode className="w-3.5 h-3.5" />
              QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-2xl border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-destructive flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl w-full gap-2 text-xs text-destructive border-destructive/20 hover:bg-destructive/5 h-9"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Form
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
