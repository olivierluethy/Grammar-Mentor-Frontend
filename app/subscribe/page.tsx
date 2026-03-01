// app/pricing/PricingClient.tsx
"use client"

import { useState } from "react"
import { Check } from "lucide-react"
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

const LEMONSQUEEZY_LINKS = {
  free: "https://grammar-mentor.com/",
  pro_monthly:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/f1ea24e6-4964-46a0-b442-3a659f76ed5a",
  pro_yearly:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/4f3f8322-6efa-41d6-b884-8176cbcac195",
  lifetime:
    "https://grammar-mentor.lemonsqueezy.com/checkout/buy/d9b6bd65-57d6-47eb-851e-47278b468439",
}

export default function PricingClient() {
  const [isYearly, setIsYearly] = useState(true)

  const proPrice = isYearly ? "$6" : "$10"
  const proBillingText = isYearly
    ? "Billed yearly at $72 (save $48)"
    : "Billed monthly at $10"

  const handleProClick = () => {
    const url = isYearly ? LEMONSQUEEZY_LINKS.pro_yearly : LEMONSQUEEZY_LINKS.pro_monthly
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden py-8 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-[#0a0a0a]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl font-serif">
            Pricing That Makes Sense
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-6 sm:text-xl lg:text-2xl">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl mx-auto sm:mt-4 sm:text-lg">
            No hidden fees. No surprise charges. No aggressive upsells. Just honest pricing from a Swiss company that values trust.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="pb-4 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:gap-4">
            <p className="text-xs text-gray-400 sm:text-sm">Choose your billing period</p>
            <div className="inline-flex items-center gap-1 rounded-xl border border-gray-700 bg-[#1a1a1a] p-1 sm:p-1.5">
              <Label
                htmlFor="billing-monthly"
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-6 sm:py-2.5 sm:text-sm ${
                  !isYearly
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </Label>

              <Switch
                id="billing-yearly"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-indigo-600 scale-90 sm:scale-100"
              />

              <Label
                htmlFor="billing-yearly"
                className={`relative cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:px-6 sm:py-2.5 sm:text-sm ${
                  isYearly
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Yearly
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:-top-2 sm:-right-2 sm:px-2 sm:text-xs">
                  Save 40%
                </span>
              </Label>
            </div>
            <p className="text-xs text-gray-500 sm:text-sm">
              💰 Save <span className="font-semibold text-emerald-400">$48/year</span> with yearly billing
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-6 pb-10 sm:py-12 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col rounded-xl sm:rounded-2xl border border-gray-700 bg-[#1a1a1a] p-4 sm:p-8">
              <CardHeader className="mb-3 sm:mb-6 p-0">
                <CardTitle className="text-lg font-bold text-white sm:text-2xl">Registered</CardTitle>
                <CardDescription className="text-xs text-gray-400 sm:text-sm">
                  For trying it out and occasional use
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="mb-4 sm:mb-8 flex items-baseline gap-1 sm:gap-2">
                  <span className="text-3xl font-bold text-white sm:text-5xl">$0</span>
                  <span className="text-gray-500 text-sm sm:text-base">/forever</span>
                </div>
                <ul className="mb-4 sm:mb-8 space-y-2 sm:space-y-4">
                  {[
                    {
                      main: "Basic grammar checking",
                      sub: "Catch typos and common errors so you don't look careless",
                    },
                    {
                      main: "5 AI explanations per day",
                      sub: "Understand why something's wrong, not just that it is",
                    },
                    {
                      main: "Documents up to 10,000 words",
                      sub: "Plenty of room for essays, articles, and short stories",
                    },
                    {
                      main: "Core snippet storage",
                      sub: "Save up to 10 commonly used phrases",
                    },
                    {
                      main: "One-click ignore",
                      sub: "Dismiss suggestions you disagree with, no friction",
                    },
                  ].map((f) => (
                    <li key={f.main} className="flex items-start gap-2 sm:gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500 sm:h-5 sm:w-5" />
                      <div>
                        <p className="text-sm font-medium text-white sm:text-base">{f.main}</p>
                        <p className="mt-0.5 text-xs text-gray-400 sm:mt-1 sm:text-sm">{f.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 bg-[#2a2a2a] py-2.5 text-sm text-white hover:bg-[#3a3a3a] sm:py-3.5 sm:text-base"
                  asChild
                >
                  <a href={LEMONSQUEEZY_LINKS.free}>Start Free</a>
                </Button>
              </CardFooter>
              <p className="mt-2 text-center text-[10px] text-gray-500 sm:mt-3 sm:text-xs">No credit card required</p>
            </Card>

            {/* Pro */}
            <Card className="relative flex flex-col scale-100 lg:scale-105 rounded-xl sm:rounded-2xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-4 sm:p-8 shadow-xl sm:shadow-2xl shadow-indigo-900/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:-top-4">
                <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white sm:px-6 sm:py-1.5 sm:text-sm">
                  Most Popular
                </span>
              </div>
              <CardHeader className="mb-3 sm:mb-6 p-0 pt-2 sm:pt-0">
                <CardTitle className="text-lg font-bold text-white sm:text-2xl">Pro</CardTitle>
                <CardDescription className="text-xs text-gray-300 sm:text-sm">
                  For serious writers who want to improve
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="mb-4 sm:mb-8">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-3xl font-bold text-white sm:text-5xl">{proPrice}</span>
                    <span className="text-gray-400 text-sm sm:text-base">/month</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-emerald-400 sm:mt-2 sm:text-sm">{proBillingText}</p>
                </div>
                <ul className="mb-4 sm:mb-8 space-y-2 sm:space-y-4">
                  {[
                    { main: "Everything in Free, plus:" },
                    {
                      main: "Unlimited AI explanations",
                      sub: "Learn at your own pace without hitting daily limits. Actually internalize grammar rules.",
                    },
                    {
                      main: "Advanced style checking",
                      sub: "Preserve your voice while catching tone inconsistencies and awkward phrasing.",
                    },
                    {
                      main: "Unlimited document length",
                      sub: "Work on novels, theses, and large projects without worrying about file size limits.",
                    },
                    {
                      main: "Unlimited snippet storage",
                      sub: "Build your personal library of templates, sign-offs, and repeated phrases.",
                    },
                    {
                      main: "Multilingual context awareness",
                      sub: "Get suggestions that understand you're writing in your second language.",
                    },
                    {
                      main: "Priority support",
                      sub: "Get help when you need it from real people who care.",
                    },
                  ].map((f) => (
                    <li key={f.main} className="flex items-start gap-2 sm:gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400 sm:h-5 sm:w-5" />
                      <div>
                        <p className="text-sm font-medium text-white sm:text-base">{f.main}</p>
                        {f.sub && <p className="mt-0.5 text-xs text-gray-300 sm:mt-1 sm:text-sm">{f.sub}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button
                  onClick={handleProClick}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-lg sm:py-3.5 sm:text-base"
                >
                  Buy
                </Button>
              </CardFooter>
              <p className="mt-2 text-center text-[10px] text-gray-400 sm:mt-3 sm:text-xs">Cancel anytime, no questions asked</p>
            </Card>

            {/* Lifetime */}
            <Card className="flex flex-col rounded-xl sm:rounded-2xl border border-gray-700 bg-[#1a1a1a] p-4 sm:p-8">
              <CardHeader className="mb-3 sm:mb-6 p-0">
                <CardTitle className="text-lg font-bold text-white sm:text-2xl">Lifetime</CardTitle>
                <CardDescription className="text-xs text-gray-400 sm:text-sm">
                  One payment. Forever access.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-3xl font-bold text-white sm:text-5xl">$199</span>
                    <span className="text-gray-500 text-sm sm:text-base">/forever</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-emerald-400 sm:mt-2 sm:text-sm">Pay once, own it forever</p>
                  <div className="mt-3 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-amber-700/40 bg-amber-950/60 px-2.5 py-1.5 sm:px-4 sm:py-2.5">
                    <span className="uppercase tracking-wider text-[10px] font-semibold text-amber-400 sm:text-xs">
                      Limited:
                    </span>
                    <span className="text-xs font-medium text-white sm:text-sm">First 50 people only</span>
                  </div>
                </div>
                <ul className="mb-4 sm:mb-8 space-y-2 sm:space-y-4">
                  {[
                    { main: "Everything in Pro, forever" },
                    {
                      main: "No recurring payments",
                      sub: "Never worry about subscriptions, renewals, or price increases again",
                    },
                    {
                      main: "All future updates included",
                      sub: "Get every new feature and improvement as we build them",
                    },
                    {
                      main: "Peace of mind",
                      sub: "Budget once, benefit forever. No subscription anxiety.",
                    },
                    {
                      main: "Transferable license",
                      sub: "You own it. Use it on any device, keep it forever.",
                    },
                  ].map((f) => (
                    <li key={f.main} className="flex items-start gap-2 sm:gap-3">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500 sm:h-5 sm:w-5" />
                      <div>
                        <p className="text-sm font-medium text-white sm:text-base">{f.main}</p>
                        {f.sub && <p className="mt-0.5 text-xs text-gray-400 sm:mt-1 sm:text-sm">{f.sub}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Button
                  onClick={() => (window.location.href = LEMONSQUEEZY_LINKS.lifetime)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-2.5 text-sm text-white hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-900/30 sm:py-3.5 sm:text-base"
                >
                  Buy
                </Button>
              </CardFooter>
              <p className="mt-2 text-center text-[10px] text-gray-500 sm:mt-3 sm:text-xs">One-time payment • Only first 50 spots</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="features" className="py-8 sm:py-16 bg-[#1a1a1a]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 sm:mb-12 text-center text-xl font-bold text-white font-serif sm:text-3xl">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full border-collapse text-left text-gray-300 text-xs sm:text-base">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-2 font-medium text-gray-400 sm:py-4 sm:px-4">Feature</th>
                  <th className="py-2 px-2 text-center font-semibold text-white sm:py-4 sm:px-4">Free</th>
                  <th className="py-2 px-2 text-center font-semibold text-white sm:py-4 sm:px-4">Pro</th>
                  <th className="py-2 px-2 text-center font-semibold text-white sm:py-4 sm:px-4">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Basic grammar & spelling</td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">AI explanations</td>
                  <td className="py-2 px-2 text-center text-gray-500 sm:py-4 sm:px-4">5/day</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">Unlimited</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Document length</td>
                  <td className="py-2 px-2 text-center text-gray-500 sm:py-4 sm:px-4">10K</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">∞</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">∞</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Advanced style checking</td>
                  <td className="py-2 px-2 text-center text-gray-600 sm:py-4 sm:px-4">—</td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Snippet storage</td>
                  <td className="py-2 px-2 text-center text-gray-500 sm:py-4 sm:px-4">10</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">∞</td>
                  <td className="py-2 px-2 text-center font-medium text-emerald-400 sm:py-4 sm:px-4">∞</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Multilingual awareness</td>
                  <td className="py-2 px-2 text-center text-gray-600 sm:py-4 sm:px-4">—</td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Priority support</td>
                  <td className="py-2 px-2 text-center text-gray-600 sm:py-4 sm:px-4">—</td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">Future updates</td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                  <td className="py-2 px-2 text-center sm:py-4 sm:px-4">
                    <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-10 sm:py-20 bg-[#1a1a1a]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 sm:mb-12 text-center text-xl font-bold text-white font-serif sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-6">
            {[
              {
                q: "What's included in the free plan?",
                a: "The free plan includes basic grammar and spelling checks, 5 AI-powered grammar explanations per day, documents up to 10,000 words, 10 snippet slots, and the ability to ignore suggestions with one click. It's perfect for trying out the tool and occasional writing needs.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Absolutely. You can cancel with one click from your account settings. No phone calls, no retention emails, no questions asked. If you cancel, you'll keep access until the end of your billing period, and you won't be charged again.",
              },
              {
                q: "Is there a trial period for Pro?",
                a: "We don't offer traditional trials because our free plan is genuinely useful. Try the free version first—it's not limited to 7 days or designed to frustrate you into upgrading. When you're ready for unlimited explanations and advanced features, upgrade to Pro.",
              },
              {
                q: "How does billing work?",
                a: "Monthly plans are billed every month. Yearly plans are billed once per year (saving you 40%). Lifetime is a single payment with no renewals ever. You'll receive an email receipt for every charge. No auto-renewals without clear notice.",
              },
              {
                q: "Is my data safe?",
                a: "Yes. We're based in Switzerland and take privacy seriously. Your documents are encrypted in transit and at rest. We don't train AI models on your writing. We don't sell your data to third parties. We don't track you across the web. Your writing is yours, period.",
              },
              {
                q: "What happens if I downgrade from Pro to Free?",
                a: "You'll keep access to Pro features until the end of your billing period. After that, you'll return to the free plan limits. Your saved snippets beyond the first 10 will remain stored but read-only—you can still view and use them, but you won't be able to add new ones until you upgrade again or delete some.",
              },
              {
                q: "Do you offer refunds?",
                a: (
                  <>
                    Yes. If you're not satisfied within 30 days of purchase, we'll refund you in full, no questions asked. Just email us at{" "}
                    <a
                      href="mailto:hello@grammar-mentor.ch"
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      hello@grammar-mentor.ch
                    </a>.
                  </>
                ),
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-lg sm:rounded-xl border border-gray-700 bg-[#0a0a0a] p-4 sm:p-6"
              >
                <h3 className="mb-1.5 sm:mb-3 text-sm font-semibold text-white sm:text-lg">{item.q}</h3>
                <p className="leading-relaxed text-xs text-gray-400 sm:text-base">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}