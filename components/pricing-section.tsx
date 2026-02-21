import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Anonymous",
    description: "Anonymous conversions with no need to sign up",
    features: ["1 page every 24 hours"],
    price: "Free",
    isButton: false,
    borderColor: "border-slate-800",
    buttonStyles: "",
  },
  {
    name: "Registered",
    description: "Registration is free",
    features: ["5 pages every 24 hours"],
    price: "Free",
    cta: "Register",
    isButton: true,
    href: "/register",
    borderColor: "border-slate-800",
    // Indigo-Gradient für den "Free"-User
    buttonStyles: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]",
  },
  {
    name: "Subscribe",
    description: "Subscribe to learn even more from your mistakes",
    features: ["Priority Processing", "Unlimited History"],
    cta: "Subscribe",
    isButton: true,
    href: "/register",
    // Kräftiger Blau-Gradient für das Haupt-Abo
    borderColor: "border-blue-500/50",
    buttonStyles: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]",
  },
]

export function PricingSection() {
  return (
    <section className="bg-slate-950 py-20 text-slate-200">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`flex flex-1 flex-col justify-between rounded-2xl border bg-slate-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 ${tier.borderColor}`}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {tier.name}
                </h3>
                <p className="text-[16px] text-slate-400 leading-relaxed mb-8">
                  {tier.description}
                </p>
                
                {tier.features.length > 0 && (
                  <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3px]" />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-12">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">
                    {tier.price}
                  </span>
                  {tier.price && tier.price !== "Free" && (
                    <span className="text-slate-500 text-sm">/mo</span>
                  )}
                </div>
                
                {tier.isButton ? (
                  <Link href={tier.href || "#"} className="group">
                    <button
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] ${tier.buttonStyles}`}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                ) : (
                  <div className="py-3 text-center text-sm font-medium text-slate-500 border border-slate-800 rounded-xl bg-slate-900/50">
                    No Sign up required
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}