"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { hideAlert } from "@/redux/features/global/alertSlice";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Alert Config Map ──────────────────────────────────────────────
const alertConfig = {
  success: {
    icon: CheckCircle2,
    title: "Success",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    progressColor: "bg-emerald-500",
    shadowColor: "shadow-emerald-500/10",
  },
  danger: {
    icon: AlertCircle,
    title: "Error",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-50 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
    progressColor: "bg-red-500",
    shadowColor: "shadow-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    title: "Warning",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    progressColor: "bg-amber-500",
    shadowColor: "shadow-amber-500/10",
  },
};

export function GlobalAlert() {
  const dispatch = useDispatch();
  const { message, type, duration } = useSelector((state: RootState) => state.alert);
  
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  const config = alertConfig[type] || alertConfig.success;
  const Icon = config.icon;

  // ─── Slide In Animation ──────────────────────────────────────────
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setProgress(100);
    }
  }, [message]);

  // ─── Auto Dismiss Timer ──────────────────────────────────────────
  useEffect(() => {
    if (!message) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const pct = (remaining / duration) * 100;
      setProgress(pct);
    }, 16); // ~60fps

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [message, duration]);

  // ─── Handle Close ──────────────────────────────────────────────────
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(hideAlert());
    }, 300); // Wait for exit animation
  };

  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-[380px]">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out",
          config.bgColor,
          config.borderColor,
          config.shadowColor,
          isVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        )}
      >
        {/* ─── Close Button ──────────────────────────────────────────── */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-md p-1 text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600 dark:hover:bg-white/5 dark:hover:text-neutral-300"
        >
          <X size={14} />
        </button>

        {/* ─── Content Row ───────────────────────────────────────────── */}
        <div className="flex items-start gap-3 pr-6">
          <Icon 
            size={20} 
            className={cn("mt-0.5 shrink-0", config.iconColor)} 
          />
          
          <div className="flex-1 space-y-1">
            <h5 className="font-semibold text-sm leading-none text-neutral-900 dark:text-neutral-100">
              {config.title}
            </h5>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {message}
            </p>
          </div>
        </div>

        {/* ─── Progress Bar ──────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-black/5 dark:bg-white/5">
          <div
            className={cn("h-full transition-all ease-linear", config.progressColor)}
            style={{ 
              width: `${progress}%`,
              transitionDuration: "0ms" // Manual update via interval
            }}
          />
        </div>
      </div>
    </div>
  );
}