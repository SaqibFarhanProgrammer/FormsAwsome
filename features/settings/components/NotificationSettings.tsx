"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, FormInput, BarChart3, Shield, Zap } from "lucide-react";

interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "form-submissions",
      icon: <FormInput className="w-4 h-4" />,
      title: "Form Submissions",
      description: "Get notified when someone submits a form",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Weekly Analytics",
      description: "Receive weekly performance reports",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "security",
      icon: <Shield className="w-4 h-4" />,
      title: "Security Alerts",
      description: "Important security notifications",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "product-updates",
      icon: <Zap className="w-4 h-4" />,
      title: "Product Updates",
      description: "New features and improvements",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "team-activity",
      icon: <MessageSquare className="w-4 h-4" />,
      title: "Team Activity",
      description: "Collaboration and team updates",
      email: false,
      push: true,
      sms: false,
    },
  ]);

  const toggleNotification = (id: string, channel: "email" | "push" | "sms") => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [channel]: !item[channel] } : item)),
    );
  };

  return (
    <div className="grid gap-6">
      {/* Notification Preferences Header */}
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-6 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>Notification Type</span>
              <span className="text-center">Email</span>
              <span className="text-center">Push</span>
              <span className="text-center">SMS</span>
            </div>
            <Separator />
            {/* Table Rows */}
            {notifications.map((item, index) => (
              <div key={item.id}>
                <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={item.email}
                      onCheckedChange={() => toggleNotification(item.id, "email")}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={item.push}
                      onCheckedChange={() => toggleNotification(item.id, "push")}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={item.sms}
                      onCheckedChange={() => toggleNotification(item.id, "sms")}
                    />
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Digest Settings */}
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Email Digest</CardTitle>
              <CardDescription>Configure your email summary preferences.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <LabelWithSwitch
                label="Daily Summary"
                description="Receive a daily overview of your forms"
                defaultChecked={false}
              />
            </div>
            <div className="space-y-3">
              <LabelWithSwitch
                label="Weekly Report"
                description="Get weekly analytics and insights"
                defaultChecked={true}
              />
            </div>
            <div className="space-y-3">
              <LabelWithSwitch
                label="Monthly Overview"
                description="Comprehensive monthly performance report"
                defaultChecked={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LabelWithSwitch({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}
