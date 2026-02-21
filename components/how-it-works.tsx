import { PenLine, Sparkles, GraduationCap } from "lucide-react"

const steps = [
  {
    icon: PenLine,
    title: "Write naturally",
    description:
      "Type or paste your text into our editor. No special formatting required.",
  },
  {
    icon: Sparkles,
    title: "Get instant feedback",
    description:
      "Our AI highlights errors with clear, color-coded underlines and detailed explanations.",
  },
  {
    icon: GraduationCap,
    title: "Learn as you go",
    description:
      "Each suggestion comes with a grammar lesson so you never make the same mistake twice.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three simple steps to better writing.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/30"
            >
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
