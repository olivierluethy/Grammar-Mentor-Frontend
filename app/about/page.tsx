import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our mission to build a grammar checker that teaches you, not just corrects you.",
}

const values = [
  {
    title: "Education over correction",
    description:
      "We believe every grammar mistake is a learning opportunity. Our tool explains the rules behind each correction so you build lasting skills.",
  },
  {
    title: "Privacy by design",
    description:
      "Your text is never stored. We process your writing in real time and immediately discard it. Your ideas belong to you.",
  },
  {
    title: "Accessible to everyone",
    description:
      "Great writing tools should not be locked behind expensive paywalls. Our free tier gives every writer the basics they need.",
  },
  {
    title: "Powered by research",
    description:
      "Our AI is built on the latest advancements in natural language processing and informed by decades of linguistics research.",
  },
]

export default function AboutPage() {
  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          About AI Grammar Mentor
        </h1>

        <div className="mt-8 flex flex-col gap-6">
          <p className="text-base leading-relaxed text-muted-foreground">
            Most grammar checkers fix your mistakes and move on. We think
            that is a missed opportunity. AI Grammar Mentor was founded on a simple
            idea: what if your grammar checker could also be your teacher?
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Our AI-powered platform does not just highlight errors. It explains
            the grammar rules behind each correction, tracks the mistakes you
            make most often, and adapts its teaching to your personal writing
            patterns.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Whether you are a student writing your first essay, a professional
            drafting important emails, or a non-native speaker building
            confidence in a new language, AI Grammar Mentor meets you where you are
            and helps you grow.
          </p>
        </div>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-foreground">
          Our values
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="text-base font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
