"use client";

import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_sign_up", {
        event_category: "auth",
        event_label: "Sign Up Page View"
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      <SignUp />
    </div>
  );
}