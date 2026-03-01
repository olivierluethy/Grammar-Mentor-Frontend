// app/pricing/PricingClient.tsx
"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils" // ← assuming you have this helper

const LEMONSQUEEZY_LINKS = {
  free: "https://grammar-mentor.com/grammar-mentor.html",
  pro_monthly:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/f1ea24e6-4964-46a0-b442-3a659f76ed5a",
  pro_yearly:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/4f3f8322-6efa-41d6-b884-8176cbcac195",
  lifetime:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/d9b6bd65-57d6-47eb-851e-47278b468439",
}

export default function PricingClient() {
  const [isYearly, setIsYearly] = useState(true)
  const [showProFeatures, setShowProFeatures] = useState(false)     // closed by default
  const [showLifetimeFeatures, setShowLifetimeFeatures] = useState(false)

  const proPrice = isYearly ? "$6" : "$10"
  const proBillingText = isYearly
    ? "Billed yearly • $72 (save $48)"
    : "Billed monthly • $10"

  const handleProClick = () => {
    const url = isYearly ? LEMONSQUEEZY_LINKS.pro_yearly : LEMONSQUEEZY_LINKS.pro_monthly
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 antialiased pb-16">
      {/* Header + Toggle */}
      <section className="pt-10 pb-10 sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="mx-auto max-w-5xl px-5">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-gray-700 bg-[#1a1a1a] p-1.5 shadow-sm">
              <Label
                htmlFor="billing-monthly"
                className={cn(
                  "cursor-pointer rounded-lg px-5 sm:px-6 py-2.5 text-sm font-medium transition-all",
                  !isYearly
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                )}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </Label>

              <Switch
                id="billing-yearly"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-700"
              />

              <Label
                htmlFor="billing-yearly"
                className={cn(
                  "relative cursor-pointer rounded-lg px-5 sm:px-6 py-2.5 text-sm font-medium transition-all",
                  isYearly
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                )}
              >
                Yearly
                <span className="absolute -top-2 -right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                  Save 40%
                </span>
              </Label>
            </div>

            <p className="text-sm text-gray-400 text-center">
              Save <span className="text-emerald-400 font-semibold">$48/year</span> with yearly billing
            </p>
          </div>
        </div>
      </section>

      {/* Main pricing cards – centered, max 2-column on larger screens */}
      <section className="py-10 px-5">
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          {/* ──────────────── Pro Card ──────────────── */}
          <Card
            className={cn(
              "relative flex flex-col rounded-2xl border-2 transition-all duration-300",
              "border-indigo-600/70 bg-gradient-to-b from-indigo-950/60 to-purple-950/40",
              "shadow-xl shadow-indigo-950/40 hover:shadow-indigo-900/60",
              "md:scale-[1.03] lg:scale-[1.05]"
            )}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-1 text-sm font-semibold text-white shadow-md">
                Most Popular
              </span>
            </div>

            <CardHeader className="pb-4 pt-8 text-center">
              <CardTitle className="text-3xl font-bold">Pro</CardTitle>
              <CardDescription className="text-base text-gray-300 mt-1">
                For serious writers who want to improve
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-6 pb-6">
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl sm:text-6xl font-extrabold text-white">
                    {proPrice}
                  </span>
                  <span className="text-2xl text-gray-400">/mo</span>
                </div>
                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  {proBillingText}
                </p>
              </div>

              {/* Features – collapsible on mobile */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowProFeatures(!showProFeatures)}
                  className="w-full flex items-center justify-between text-left py-3 px-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/60 transition-colors md:hidden"
                >
                  <span className="font-medium">
                    {showProFeatures ? "Hide" : "Show"} features
                  </span>
                  {showProFeatures ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                <ul
                  className={cn(
                    "space-y-4 transition-all duration-300",
                    showProFeatures || "hidden md:block"
                  )}
                >
                  {[
                    { main: "Unlimited AI explanations" },
                    { main: "Advanced style checking" },
                    { main: "Unlimited document length" },
                    { main: "Unlimited snippet storage" },
                    { main: "Multilingual context awareness" },
                    { main: "Priority human support" },
                  ].map((f) => (
                    <li key={f.main} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-gray-100">{f.main}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="px-6 pb-8 pt-2">
              <Button
                onClick={handleProClick}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-900/40"
              >
                Get Pro
              </Button>
            </CardFooter>

            <p className="text-center text-xs text-gray-500 pb-6 -mt-2">
              Cancel anytime • No questions asked
            </p>
          </Card>

          {/* ──────────────── Lifetime Card ──────────────── */}
          <Card className="flex flex-col rounded-2xl border border-amber-700/40 bg-gradient-to-b from-amber-950/30 to-gray-950 p-6 shadow-xl shadow-amber-950/20">
            <CardHeader className="pb-4 pt-8 text-center">
              <CardTitle className="text-3xl font-bold">Lifetime</CardTitle>
              <CardDescription className="text-base text-gray-300 mt-1">
                One payment. Forever access.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-6 pb-6">
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl sm:text-6xl font-extrabold text-white">
                    $199
                  </span>
                  <span className="text-2xl text-gray-400">/once</span>
                </div>
                <p className="mt-2 text-base font-medium text-emerald-400">
                  Pay once • Own forever
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-700/50 bg-amber-950/60 px-4 py-2 mx-auto">
                  <span className="uppercase tracking-wide text-xs font-bold text-amber-400">
                    Limited
                  </span>
                  <span className="font-semibold text-white">First 50 people only</span>
                </div>
              </div>

              {/* Features – collapsible */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowLifetimeFeatures(!showLifetimeFeatures)}
                  className="w-full flex items-center justify-between text-left py-3 px-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/60 transition-colors md:hidden"
                >
                  <span className="font-medium">
                    {showLifetimeFeatures ? "Hide" : "Show"} features
                  </span>
                  {showLifetimeFeatures ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                <ul
                  className={cn(
                    "space-y-4 transition-all duration-300",
                    showLifetimeFeatures || "hidden md:block"
                  )}
                >
                  {[
                    { main: "Everything in Pro — forever" },
                    { main: "No recurring payments ever" },
                    { main: "All future updates included" },
                    { main: "Transferable license" },
                    { main: "Peace of mind (no sub anxiety)" },
                  ].map((f) => (
                    <li key={f.main} className="flex items-start gap-3">
                      <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-gray-100">{f.main}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="px-6 pb-8 pt-2">
              <Button
                onClick={() => (window.location.href = LEMONSQUEEZY_LINKS.lifetime)}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/30"
              >
                Get Lifetime
              </Button>
            </CardFooter>

            <p className="text-center text-xs text-gray-500 pb-6 -mt-2">
              One-time payment • Only first 50 spots
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}