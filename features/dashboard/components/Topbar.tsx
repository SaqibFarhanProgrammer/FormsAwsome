"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setProfile } from "@/redux/features/profile/profile.slice";

interface RecentSubmission {
  id: string;
  form: string;
  email: string;
  date: string;
}

function formatRelativeTime(date: string) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));

  if (elapsedSeconds < 60) return "Just now";
  const minutes = Math.floor(elapsedSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TopBar() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.profile);
  const [notifications, setNotifications] = useState<RecentSubmission[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (!cancelled && result?.data) {
          dispatch(
            setProfile({
              name: result.data.name,
              email: result.data.email,
              createdAt: result.data.createdAt,
              image: result.data.image ?? null,
              bio: result.data.bio ?? null,
              settings: result.data.settings,
            }),
          );
        }
      } catch {
        // Ignore profile fetch failures here; the dashboard can still render fallback UI.
      }
    };

    if (!data.isFetched) {
      void loadProfile();
    }

    return () => {
      cancelled = true;
    };
  }, [data.isFetched, dispatch]);

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const response = await fetch("/api/submissions");
        if (!response.ok) return;

        const result = await response.json();
        if (!cancelled) {
          setNotifications((result.data ?? []).slice(0, 5));
        }
      } catch {}
    };

    void loadNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="flex items-center mx-6 gap-3 shrink-0 py-2 pt-3">
      <div className="flex-1 min-w-0 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-sm">
        <p className="text-sm font-semibold text-foreground truncate">
          Good Morning, {data?.name || "User"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          Your latest system updates here
        </p>
      </div>

      <div className="relative rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="Open notifications"
          aria-expanded={isNotificationsOpen}
          onClick={() => setIsNotificationsOpen((open) => !open)}
          className="relative p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <Bell size={20} className="text-muted-foreground" />
          {notifications.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 min-w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />
          )}
        </button>
        {isNotificationsOpen && (
          <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Recent submissions</p>
              <span className="text-xs text-muted-foreground">{notifications.length}</span>
            </div>
            {notifications.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((submission) => (
                  <Link
                    key={submission.id}
                    href="/submissions"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block border-b border-border px-4 py-3 last:border-b-0 hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-medium">{submission.form}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelativeTime(submission.date)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {submission.email === "-" ? "New submission" : submission.email}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No recent submissions
              </p>
            )}
            <Link
              href="/submissions"
              onClick={() => setIsNotificationsOpen(false)}
              className="block border-t border-border px-4 py-3 text-center text-xs font-medium text-primary hover:bg-accent/50"
            >
              View all submissions
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-full bg-muted overflow-hidden">
            <img
              src={
                data?.image ||
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              }
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{data?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              @{data?.name?.split(" ").join("").toLowerCase() || "user"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
