import {
  Brain,
  Zap,
  Globe,
  Lock,
  BookOpen,
  BarChart3,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced language models understand context, tone, and intent to provide smarter suggestions.",
  },
  {
    icon: Zap,
    title: "Real-Time Checking",
    description:
      "See corrections as you type with zero lag. No waiting for a full document scan.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Check grammar in over 30 languages with native-level accuracy and cultural context.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Your text is encrypted end-to-end and never stored. We process and forget.",
  },
  {
    icon: BookOpen,
    title: "Learning Mode",
    description:
      "Every correction includes a mini-lesson explaining the rule behind the fix.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "See your improvement over time with detailed analytics on your most common mistakes.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to write with confidence
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Powerful features designed to improve your writing and help you learn
            along the way.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
