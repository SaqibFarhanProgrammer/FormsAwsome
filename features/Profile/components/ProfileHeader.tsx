"use client";

import { MapPin, Mail, Clock, Pencil, Settings } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />

      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
              alt="John"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="pt-14 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">John Smith</h1>
            <p className="text-sm text-muted-foreground mt-1">@admin</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              Building the future of form management. Passionate about clean UI and great user
              experiences.
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                john@formbuilder.com
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Joined March 2024
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
              <Pencil size={14} />
              Edit Profile
            </button>
            <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
              <Settings size={14} />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
