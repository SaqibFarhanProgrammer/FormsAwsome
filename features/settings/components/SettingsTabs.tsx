"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./GeneralSettings";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";
import { BillingSettings } from "./BillingSettings";
import { DangerZone } from "./DangerZone";
import { User, Shield, Bell, CreditCard } from "lucide-react";

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex flex-wrap gap-1 w-fit">
          <TabsTrigger
            value="general"
            className="rounded-lg px-4 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg px-4 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg px-4 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-lg px-4 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent
            value="general"
            className="mt-0 space-y-6 animate-in fade-in-50 duration-200"
          >
            <GeneralSettings />
          </TabsContent>

          <TabsContent
            value="security"
            className="mt-0 space-y-6 animate-in fade-in-50 duration-200"
          >
            <SecuritySettings />
          </TabsContent>

          <TabsContent
            value="notifications"
            className="mt-0 space-y-6 animate-in fade-in-50 duration-200"
          >
            <NotificationSettings />
          </TabsContent>

          <TabsContent
            value="billing"
            className="mt-0 space-y-6 animate-in fade-in-50 duration-200"
          >
            <BillingSettings />
          </TabsContent>
        </div>
      </Tabs>

      <DangerZone />
    </div>
  );
}
