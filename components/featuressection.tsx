"use client"

import { useEffect, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!containerRef.current) return

    const featureElements = containerRef.current.querySelectorAll(".feature-item")
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const title = entry.target.getAttribute("data-feature-title")
            window.gtag?.("event", "feature_view", {
              event_category: "engagement",
              event_label: title,
            })
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    featureElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-gray-950 py-8 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6" ref={containerRef}>
        <div className="grid grid-cols-1 gap-6 md:gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item flex flex-col items-center md:items-center text-center"
              data-feature-title={feature.title}
            >
              <div className={`mb-3 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full ${feature.colorClass}`}>
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-1 sm:mb-3 text-lg sm:text-xl font-bold text-white">
                {feature.title}
              </h3>
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