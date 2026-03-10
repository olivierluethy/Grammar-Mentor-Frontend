import type { Metadata } from "next"
import AboutContent from "@/components/AboutContent"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our mission to build a grammar checker that teaches you, not just corrects you.",
}

export default function AboutPage() {
  return <AboutContent />;
}