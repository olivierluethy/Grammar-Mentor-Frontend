// app/blog/page.tsx
import type { Metadata } from "next"
import BlogContent from "@/components/BlogContent"
import { blogPosts } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Grammar tips, writing advice, and language learning insights from the AI Grammar Mentor team.",
}

// Server Component – rendert die Seite, exportiert metadata
export default function BlogPage() {
  return <BlogContent posts={blogPosts} />
}