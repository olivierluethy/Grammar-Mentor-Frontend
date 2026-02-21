import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Grammar tips, writing advice, and language learning insights from the AI Grammar Mentor team.",
}

export default function BlogPage() {
  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Grammar tips, writing advice, and insights from our team.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {post.category}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
