import type { Metadata } from "next"
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
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the plan that fits your writing needs. Free, Pro, and Team plans available.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For casual writers who want the basics.",
    features: [
      "50 grammar checks per day",
      "Basic error detection",
      "English only",
      "Browser extension",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For professionals who want to level up.",
    features: [
      "Unlimited grammar checks",
      "Advanced AI suggestions",
      "30+ languages",
      "Learning mode with lessons",
      "Progress tracking",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "per user / month",
    description: "For teams that need consistent quality.",
    features: [
      "Everything in Pro",
      "Team admin dashboard",
      "Custom style guides",
      "API access",
      "SSO integration",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
