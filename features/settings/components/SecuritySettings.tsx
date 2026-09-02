"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Key, Shield, Smartphone, Fingerprint, Eye, EyeOff, Lock, Unlock } from "lucide-react";

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Password Change */}
      <Card className="lg:col-span-2 rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="pr-10 rounded-xl border-border bg-background"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pr-10 rounded-xl border-border bg-background"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="pr-10 rounded-xl border-border bg-background"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button className="rounded-xl w-full sm:w-auto">
            <Lock className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">2FA</CardTitle>
              <CardDescription>Extra layer of security.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Two-Factor Auth</p>
              <p className="text-xs text-muted-foreground">Require code on login</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Google Authenticator</p>
                </div>
                <Badge variant="secondary" className="rounded-lg text-xs">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Fingerprint className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Biometric</p>
                  <p className="text-xs text-muted-foreground">Face ID / Touch ID</p>
                </div>
                <Badge variant="outline" className="rounded-lg text-xs">
                  Available
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="lg:col-span-3 rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <Unlock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>
                Manage devices that are currently logged into your account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              device: "MacBook Pro",
              location: "San Francisco, CA",
              browser: "Chrome",
              time: "Current session",
              isCurrent: true,
            },
            {
              device: "iPhone 15 Pro",
              location: "San Francisco, CA",
              browser: "Safari",
              time: "2 hours ago",
              isCurrent: false,
            },
            {
              device: "Windows PC",
              location: "New York, NY",
              browser: "Firefox",
              time: "3 days ago",
              isCurrent: false,
            },
          ].map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{session.device}</p>
                    {session.isCurrent && (
                      <Badge variant="secondary" className="rounded-lg text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.browser} · {session.location} · {session.time}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
