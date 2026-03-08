"use client"

import { useUser } from "@clerk/nextjs"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Anonymous",
    description: "No sign up needed",
    features: ["1 AI explanation every 24 hours"],
    price: "Free",
    isButton: false,
    borderColor: "border-slate-800",
    buttonStyles: "",
  },
  {
    name: "Registered",
    description: "Registration is free",
    features: ["5 pages AI explanations every 24 hours"],
    price: "Free",
    cta: "Register",
    isButton: true,
    href: "/sign-up",
    borderColor: "border-slate-800",
    buttonStyles: "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]",
  },
  {
    name: "Subscribe",
    description: "Subscribe to get more AI explanations",
    features: [],
    cta: "Register",
    isButton: true,
    href: "/subscribe",
    borderColor: "border-blue-500/50",
    buttonStyles: "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
  },
]

export function PricingSection() {
  const { isSignedIn } = useUser()
  return (
    <section className="bg-slate-950 py-6 sm:py-12 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Gap am Handy auf 4 reduziert */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`flex flex-1 flex-col justify-between rounded-xl border bg-slate-900/40 p-5 sm:p-8 backdrop-blur-sm transition-all duration-300 md:hover:-translate-y-2 ${tier.borderColor}`}
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
                  {tier.name}
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-4 sm:mb-8">
                  {tier.description}
                </p>
                
                {tier.features.length > 0 && (
                  <ul className="space-y-2 sm:space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 sm:gap-3 text-slate-300">
                        <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 stroke-[3px]" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* MT-6 statt MT-12 am Handy */}
              <div className="mt-6 sm:mt-12">
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {tier.price}
                  </span>
                  {tier.price && tier.price !== "Free" && (
                    <span className="text-slate-500 text-xs sm:text-sm">/mo</span>
                  )}
                </div>
                
                {(tier.name === "Registered" && !isSignedIn) || 
                 (tier.name === "Subscribe" && tier.isButton) || 
                 (tier.name !== "Registered" && tier.name !== "Subscribe" && tier.isButton) ? (
                  <Link href={tier.href || "#"} className="group">
                    <button
                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] ${tier.buttonStyles}`}
                    >
                      {tier.name === "Subscribe" && isSignedIn ? "Subscribe" : tier.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
