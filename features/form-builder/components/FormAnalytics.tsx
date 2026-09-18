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

async function fetchFormAnalytics(slug: string): Promise<AnalyticsViewModel> {
  const response = await axios.get(
    `/api/forms/get-form-analytics?slug=${encodeURIComponent(slug)}`,
  );
  const rawData = response.data?.data || response.data || {};
  console.log(response);

  return { ...emptyAnalytics, ...rawData };
}

export function FormAnalytics({ slug }: { slug: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsViewModel>(emptyAnalytics);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    void fetchFormAnalytics(slug)
      .then((data) => {
        if (!cancelled) setAnalytics(data);
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

  console.log(analytics);

  return <FormStats stats={analytics} />;
}
