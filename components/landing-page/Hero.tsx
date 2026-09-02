"use client";

import { Play, Check } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Now with AI-powered form generation
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
              Build forms that <span className="text-primary">convert</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Create beautiful, intelligent forms in minutes. No code required. Collect submissions,
              analyze data, and grow your business — all in one place.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Start Building Free
              </button>
              <button className="h-12 px-6 rounded-xl border border-border bg-card text-base font-semibold hover:bg-accent transition-colors flex items-center gap-2">
                <Play size={18} />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check size={16} className="text-emerald-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={16} className="text-emerald-500" />
                Free forever plan
              </span>
            </div>
          </div>

          {/* Form Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="h-8 bg-muted border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="space-y-3">
                  <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
                    Full Name
                  </div>
                  <div className="h-10 rounded-lg border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
                    Email Address
                  </div>
                  <div className="h-24 rounded-lg border border-border bg-background px-3 pt-2 text-sm text-muted-foreground">
                    Your Message...
                  </div>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
