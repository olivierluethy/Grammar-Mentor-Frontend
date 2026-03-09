import type { Metadata } from "next"
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the privacy policy for AI Grammar Mentor.",
}

export default function PrivacyPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_privacy", {
        event_category: "content",
        event_label: "Privacy Policy Page View"
      });
    }
  }, []);
  return (
    <article className="px-4 py-20 lg:py-28">
      <div className="prose-invert mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 1, 2026
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly, such as your email
              address and account preferences. When you use our grammar checker,
              your text is processed in real time but is not stored on our
              servers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to provide and improve our service,
              personalize your learning experience, send important updates about
              your account, and aggregate anonymized usage statistics to improve
              our AI models.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              data. All text submitted for grammar checking is encrypted in
              transit and is never permanently stored. We use secure, encrypted
              connections for all data transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Third-Party Services
            </h2>
            <p>
              We may use third-party analytics and infrastructure services that
              process data on our behalf. These services are bound by
              confidentiality agreements and are not permitted to use your data
              for their own purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Cookies
            </h2>
            <p>
              We use essential cookies to maintain your session and preferences.
              We also use analytics cookies to understand how our service is
              used. You can control cookie preferences through your browser
              settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data at any time. You may also request a copy of the data we hold
              about you. Contact us at privacy@AI Grammar Mentor.com to exercise these
              rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of significant changes via email or through a notice on
              our website.
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
