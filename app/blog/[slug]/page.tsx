import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { getPostBySlug, getAllSlugs } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: post.title,
    description: post.description,
  }
}

function renderMarkdown(content: string) {
  const lines = content.trim().split("\n")
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: React.ReactNode[] = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="flex flex-col gap-1.5 pl-6 list-disc">
          {listItems}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (trimmed.startsWith("## ")) {
      flushList()
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-8 mb-3 text-xl font-bold text-foreground"
        >
          {trimmed.replace("## ", "")}
        </h2>
      )
    } else if (trimmed.startsWith("### ")) {
      flushList()
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-6 mb-2 text-lg font-semibold text-foreground"
        >
          {trimmed.replace("### ", "")}
        </h3>
      )
    } else if (trimmed.startsWith("- ")) {
      inList = true
      const content = trimmed.replace("- ", "")
      listItems.push(
        <li key={`li-${i}`}>
          <span
            dangerouslySetInnerHTML={{
              __html: content
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-foreground">$1</strong>'
                )
                .replace(/\*(.*?)\*/g, "<em>$1</em>"),
            }}
          />
        </li>
      )
    } else if (trimmed === "") {
      flushList()
    } else {
      flushList()
      elements.push(
        <p
          key={`p-${i}`}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: trimmed
              .replace(
                /\*\*(.*?)\*\*/g,
                '<strong class="text-foreground">$1</strong>'
              )
              .replace(/\*(.*?)\*/g, "<em>$1</em>"),
          }}
        />
      )
    }
  })

  flushList()
  return elements
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        <header className="mt-8">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </header>

        <div className="mt-10 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          {renderMarkdown(post.content)}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Improve your grammar with AI
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try AI Grammar Mentor free and learn from every correction.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </article>
  )
}
