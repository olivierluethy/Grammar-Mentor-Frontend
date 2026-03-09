import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Grammar tips, writing advice, and language learning insights from the AI Grammar Mentor team.",
}

export default function BlogPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_blog", {
        event_category: "content",
        event_label: "Blog Page View"
      });
    }
  }, []);
  return (
    <section className="px-4 pt-2 pb-4 sm:pt-6 sm:pb-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Blog
          </h1>
          <p className="mt-1 sm:mt-3 text-sm sm:text-lg text-muted-foreground">
            Grammar tips, writing advice, and insights from our team.
          </p>
        </div>

        <div className="mt-4 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-lg sm:rounded-xl border border-border bg-card p-4 sm:p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-2 sm:mt-4 text-sm sm:text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              {/* Description */}
              <p className="mt-1.5 sm:mt-2 flex-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>

              {/* Meta */}
              <div className="mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {post.readTime}
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}