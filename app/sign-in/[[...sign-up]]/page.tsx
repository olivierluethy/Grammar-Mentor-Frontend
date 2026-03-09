"use client";

import { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_sign_in", {
        event_category: "auth",
        event_label: "Sign In Page View"
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      <SignIn />
    </div>
  );
}