"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export function GetProfileDataFromRedux() {
  const profileState = useSelector((state: RootState) => state.profile);
  
  return {
    data: profileState.data,
    loading: profileState.loading,
    error: profileState.error,
    lastFetched: profileState.lastFetched,
  };
}
