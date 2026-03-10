// app/terms/page.tsx
import type { Metadata } from "next"
import TermsContent from "@/components/TermsContent"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms of service for AI Grammar Mentor.",
}

// Server Component – exportiert metadata
export default function TermsPage() {
  return <TermsContent />
}