"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Copy, Share2, QrCode, Globe, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

interface FormActionsProps {
  slug: string;
  onDeleted: () => void;
}

export function FormActions({ slug, onDeleted }: FormActionsProps) {
  const [showQr, setShowQr] = useState(false);
  const [message, setMessage] = useState("");
  const formUrl =
    typeof window === "undefined" ? `/f/${slug}` : `${window.location.origin}/f/${slug}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(formUrl);
    setMessage("URL copied");
  };

  const deleteForm = async () => {
    if (!window.confirm("Delete this form and all of its submissions?")) return;

    const response = await fetch("/api/forms/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (!response.ok) {
      setMessage("Unable to delete form");
      return;
    }

    onDeleted();
  };

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
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 text-xs h-9"
              onClick={copyUrl}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 text-xs h-9"
              onClick={() => setShowQr(true)}
            >
              <QrCode className="w-3.5 h-3.5" />
              QR Code
            </Button>
          </div>
          {message && <p className="text-xs text-emerald-600">{message}</p>}
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
            onClick={deleteForm}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Form
          </Button>
        </CardContent>
      </Card>

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
            <div className="mb-4 flex justify-end">
              <button
                className="text-muted-foreground"
                onClick={() => setShowQr(false)}
                aria-label="Close QR code"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center rounded-xl bg-white p-4">
              <QRCodeCanvas value={formUrl} size={190} includeMargin />
            </div>
            <p className="mt-3 break-all text-xs text-muted-foreground">{formUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
}
