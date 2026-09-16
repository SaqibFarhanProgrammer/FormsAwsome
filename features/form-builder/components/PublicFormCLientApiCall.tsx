  "use client";
  import axios from "axios";
  import React, { useEffect } from "react";

  function PublicFormCLientApiCall() {
    async function CallApi() {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/forms/set-visitor-id-in-cookie`,
      );

    }

    useEffect(() => {
      CallApi();
    }, []);

    return null;
  }

  export default PublicFormCLientApiCall;
