// app/privacy/page.tsx
import type { Metadata } from "next"
import PrivacyContent from "@/components/PrivacyContent"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy for AI Grammar Mentor.",
}

// Server Component – exportiert metadata
export default function PrivacyPage() {
  return <PrivacyContent />
}