import { Lightbulb, BookOpen, GraduationCap } from "lucide-react"

const features = [
  {
    title: "Contextual Logic",
    description: (
      <>
        We don't just underline errors; we explain the <strong>grammatical rules</strong> behind them so you understand the "why" and never make the same mistake twice.
      </>
    ),
    icon: Lightbulb,
    colorClass: "bg-emerald-500/10 text-emerald-400",
  },
  {
    title: "Vocabulary Growth",
    description: (
      <>
        Expand your lexicon with <strong>dynamic synonyms</strong> tailored to your tone. Learn how subtle word choices change the impact of your writing.
      </>
    ),
    icon: BookOpen,
    colorClass: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Style Mentorship",
    description: (
      <>
        Our algorithms analyze your unique voice. Receive <strong>personalized tips</strong> to transition from basic writing to professional-grade storytelling.
      </>
    ),
    icon: GraduationCap,
    colorClass: "bg-purple-500/10 text-purple-400",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-gray-950 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.colorClass}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}