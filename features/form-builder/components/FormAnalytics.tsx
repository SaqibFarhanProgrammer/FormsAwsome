"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/features/global/alertSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { FormStats } from "./FormStats";

export type AnalyticsViewModel = {
  totalSubmissions: number;
  totalViews: number;
  conversionRate: number;
  avgTime: string;
  lastSubmission: string;
  todaySubmissions: number;
  weekSubmissions: number;
};

const emptyAnalytics: AnalyticsViewModel = {
  totalSubmissions: 0,
  totalViews: 0,
  conversionRate: 0,
  avgTime: "—",
  lastSubmission: "No submissions yet",
  todaySubmissions: 0,
  weekSubmissions: 0,
};

export function FormAnalytics({ slug }: { slug: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsViewModel>(emptyAnalytics);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    void axios
      .get(`/api/forms/${slug}/analytics`)
      .then((response) => {
        if (cancelled) return;

        const rawData = response.data?.data || response.data || {};
        setAnalytics({ ...emptyAnalytics, ...rawData });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch(
            showAlert({
              message: getErrorMessage(error, "Unable to load form analytics"),
              type: "danger",
            }),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, slug]);

  return <FormStats stats={analytics} />;
}
