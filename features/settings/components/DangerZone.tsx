"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { LogOut, Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function DangerZone() {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const router = useRouter();
  const handleLogout = async () => {
    await axios.get("/api/auth/logout");
    router.push("/auth/login");
  };

  return (
    <Card className="rounded-2xl border-destructive/20 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-destructive/70">
              Irreversible actions that affect your account.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background">
          <div className="space-y-1">
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all associated data. This cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" size="sm" className="rounded-xl w-full sm:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-destructive/20">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Delete Account
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    This action is <strong>permanent and cannot be undone</strong>. All your forms,
                    submissions, and account data will be permanently deleted.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Type{" "}
                      <code className="bg-muted px-1.5 py-0.5 rounded-md text-xs">
                        delete my account
                      </code>{" "}
                      to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete my account"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleteConfirmText !== "delete my account"}
                  className="rounded-xl bg-destructive hover:bg-destructive/90 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Permanently Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-background">
          <div className="space-y-1">
            <p className="text-sm font-medium">Sign Out</p>
            <p className="text-xs text-muted-foreground">
              Sign out from all devices and end your current session.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl w-full sm:w-auto border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You will need to sign in again to access your
                  account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="rounded-xl bg-destructive hover:bg-destructive/90"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
