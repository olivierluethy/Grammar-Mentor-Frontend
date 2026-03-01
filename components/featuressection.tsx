import { Lightbulb, BookOpen, GraduationCap } from "lucide-react"

const features = [
  {
    title: "Contextual Logic",
    description: (
      <>
        We don't just underline errors; we explain the <strong>grammatical rules</strong> behind them.
      </>
    ),
    icon: Lightbulb,
    colorClass: "bg-emerald-500/10 text-emerald-400",
  },
  {
    title: "Vocabulary Growth",
    description: (
      <>
        Expand your lexicon with <strong>dynamic synonyms</strong> tailored to your tone.
      </>
    ),
    icon: BookOpen,
    colorClass: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Style Mentorship",
    description: (
      <>
        Our algorithms analyze your voice with <strong>personalized tips</strong> for storytelling.
      </>
    ),
    icon: GraduationCap,
    colorClass: "bg-purple-500/10 text-purple-400",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-gray-950 py-8 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Gap von 12 auf 6 reduziert für Mobile */}
        <div className="grid grid-cols-1 gap-6 md:gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center md:items-center text-center">
              {/* Icon-Box verkleinert: h-12 statt h-16 auf Mobile */}
              <div className={`mb-3 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full ${feature.colorClass}`}>
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              {/* Titel kleiner auf Mobile: text-lg statt text-xl */}
              <h3 className="mb-1 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                {feature.title}
              </h3>
              {/* Beschreibung kompakter */}
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400 max-w-[280px] sm:max-w-none">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
