"use client"; // Client Component

import { useEffect } from "react";

const values = [
  { title: "Education over correction", description: "..." },
  { title: "Privacy by design", description: "..." },
  { title: "Accessible to everyone", description: "..." },
  { title: "Powered by research", description: "..." },
];

export default function AboutContent() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_about", {
        event_category: "content",
        event_label: "About Page View"
      });
    }
  }, []);

  return (
    <section className="px-4 pt-4 pb-8 sm:pt-10 sm:pb-14 lg:py-12">
      {/* Hier kommt der gesamte JSX-Code rein */}
    </section>
  )
}