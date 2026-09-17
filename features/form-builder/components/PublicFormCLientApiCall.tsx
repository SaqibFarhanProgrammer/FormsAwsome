"use client";
import axios from "axios";
import { useEffect } from "react";

function PublicFormCLientApiCall({ slug }: { slug: string }) {
  async function CallApi() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/forms/set-visitor-id-in-cookie`,
      { slug },
    );
  }

  useEffect(() => {
    CallApi();
  }, []);

  return null;
}

export default PublicFormCLientApiCall;
