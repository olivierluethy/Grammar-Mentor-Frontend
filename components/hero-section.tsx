import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import GrammarMentor from "@/components/grammar-checker-demo"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-24 lg:pt-12 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl"> 
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-none text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {"The world's first grammar checker that actually "}
            <span className="text-primary">teaches you something</span>
          </h1>

          <p className="mt-6 max-w-4xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Stop repeating the same mistakes. Our AI-powered grammar checker
            explains every correction so you become a better writer over time.
          </p>
        </div>

        {/* Minimaler Abstand für einen sauberen Übergang */}
        <div className="mt-4">
          <GrammarMentor />
        </div>
      </div>
    </section>
  )
}
