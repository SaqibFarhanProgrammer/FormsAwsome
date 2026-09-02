"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import { Camera, Mail, User, MapPin, Briefcase, Globe, Check } from "lucide-react";

type ThemeOption = "system" | "light" | "dark";

export function GeneralSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>("system");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile Card */}
      <Card className="lg:col-span-1 rounded-2xl border-border">
        <CardHeader className="text-center pb-2">
          <div className="relative mx-auto w-fit">
            <Avatar className="w-24 h-24 rounded-2xl">
              <AvatarImage src="/avatar.jpg" alt="John Doe" />
              <AvatarFallback className="rounded-2xl text-2xl  text-primary font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <CardTitle className="mt-4 text-lg">John Doe</CardTitle>
          <CardDescription>@johndoe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">john@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Product Designer</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">johndoe.com</span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card className="lg:col-span-2 rounded-2xl border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <CardDescription>Update your personal details and public profile.</CardDescription>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  defaultValue="John Doe"
                  disabled={!isEditing}
                  className="pl-10 rounded-xl border-border bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@johndoe"
                disabled={!isEditing}
                className="rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                  disabled={!isEditing}
                  className="pl-10 rounded-xl border-border bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                disabled={!isEditing}
                className="rounded-xl border-border bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  defaultValue="San Francisco, CA"
                  disabled={!isEditing}
                  className="pl-10 rounded-xl border-border bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="role"
                  defaultValue="Product Designer"
                  disabled={!isEditing}
                  className="pl-10 rounded-xl border-border bg-background"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              defaultValue="Passionate about building beautiful and functional user experiences. I love creating forms that people actually enjoy filling out."
              disabled={!isEditing}
              rows={4}
              className="rounded-xl border-border bg-background resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Preferences Card */}
      <Card className="lg:col-span-3 rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-lg">Interface Theme</CardTitle>
          <CardDescription>Select or customize your UI theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
            {/* System Preference */}
            <button
              onClick={() => setSelectedTheme("system")}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedTheme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 bg-card"
              }`}
            >
              {/* Checkmark badge */}
              {selectedTheme === "system" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}

              {/* Browser mockup - half light half dark */}
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-border shadow-sm">
                {/* Top bar */}
                <div className="h-4 bg-muted border-b border-border flex items-center px-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                {/* Content - split */}
                <div className="flex h-[calc(100%-1rem)]">
                  <div className="w-1/2 bg-background p-2 space-y-1.5">
                    <div className="w-6 h-1 rounded-full bg-foreground" />
                    <div className="w-10 h-0.5 rounded-full bg-muted-foreground/40" />
                    <div className="w-8 h-0.5 rounded-full bg-muted-foreground/40" />
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-6 rounded-md bg-muted" />
                      <div className="w-full h-6 rounded-md bg-muted" />
                    </div>
                  </div>
                  <div className="w-1/2 bg-[#1e293b] p-2 space-y-1.5">
                    <div className="w-6 h-1 rounded-full bg-white/80" />
                    <div className="w-10 h-0.5 rounded-full bg-white/30" />
                    <div className="w-8 h-0.5 rounded-full bg-white/30" />
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-6 rounded-md bg-white/10" />
                      <div className="w-full h-6 rounded-md bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium">System preference</span>
            </button>

            {/* Light */}
            <button
              onClick={() => setSelectedTheme("light")}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedTheme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 bg-card"
              }`}
            >
              {selectedTheme === "light" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}

              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-border shadow-sm bg-background">
                <div className="h-4 bg-muted border-b border-border flex items-center px-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-foreground" />
                    <div className="w-8 h-1 rounded-full bg-foreground" />
                    <div className="ml-auto w-6 h-2.5 rounded-md bg-foreground" />
                  </div>
                  <div className="w-10 h-0.5 rounded-full bg-muted-foreground/40" />
                  <div className="w-8 h-0.5 rounded-full bg-muted-foreground/40" />
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-6 rounded-md bg-muted" />
                    <div className="w-full h-6 rounded-md bg-muted" />
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium">Light</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => setSelectedTheme("dark")}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedTheme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 bg-card"
              }`}
            >
              {selectedTheme === "dark" && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}

              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-border shadow-sm bg-[#1e293b]">
                <div className="h-4 bg-[#0f172a] border-b border-white/10 flex items-center px-2 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/80" />
                    <div className="w-8 h-1 rounded-full bg-white/80" />
                    <div className="ml-auto w-6 h-2.5 rounded-md bg-white/80" />
                  </div>
                  <div className="w-10 h-0.5 rounded-full bg-white/30" />
                  <div className="w-8 h-0.5 rounded-full bg-white/30" />
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-6 rounded-md bg-white/10" />
                    <div className="w-full h-6 rounded-md bg-white/10" />
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium">Dark</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
