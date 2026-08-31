"use client";
import { ProfileDataType } from "@/features/Profile/types/types";
import { updateProfileLocally } from "@/redux/features/profile/Profile.slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function ProfileDataSetComponent({ data }: { data: ProfileDataType }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Update Redux state with server-side fetched data
    if (data) {
      dispatch(updateProfileLocally(data));
    }
  }, [data, dispatch]);

  return null;
}
