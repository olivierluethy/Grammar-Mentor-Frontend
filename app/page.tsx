import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesSection } from "@/components/features-section"
import { FeaturesSection as FeaturesSection2 } from "@/components/featuressection"
import { PricingSection } from "@/components/pricing-section"
import { ContactBanner } from "@/components/contact-banner"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection2 />
      <PricingSection />
      <ContactBanner />
      
    </>
  )
}
