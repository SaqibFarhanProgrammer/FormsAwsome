"use client";
import { RootState } from "@/redux/store";
import { fetchProfile } from "@/redux/features/profile/Profile.slice";
import { MapPin, Mail, Clock, Pencil, Settings, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export function ProfileHeader() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    // Fetch profile when component mounts (if not already loaded)
    if (!data && !loading) {
      dispatch(fetchProfile("current") as any);
    }
  }, [dispatch, data, loading]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive font-medium">Failed to load profile</p>
          <p className="text-muted-foreground text-sm">{error || "Profile data not available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-primary/5" />
      <div className="px-6 pb-6 relative">
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-2xl border-4 border-card bg-muted overflow-hidden shadow-lg">
            {data.image ? (
              <img
                src={data.image}
                alt={data.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary/40">U</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-14 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{data.name || "User"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              @{data.name?.split(" ").join("").toLowerCase() || "user"}
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg">
              Building the future of form management. Passionate about clean UI and great user
              experiences.
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              {data.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {data.email}
                </span>
              )}
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
