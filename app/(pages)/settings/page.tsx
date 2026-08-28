"use client";

import { SettingsTabs } from "@/features/settings/components/SettingsTabs";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>
      <SettingsTabs />
    </div>
  );
}
