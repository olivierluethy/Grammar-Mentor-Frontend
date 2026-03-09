import type { Metadata } from "next"
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms of service for AI Grammar Mentor.",
}

export default function TermsPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "enter_terms", {
        event_category: "content",
        event_label: "Terms of Service Page View"
      });
    }
  }, []);
  return (
    <article className="px-4 py-20 lg:py-28">
      <div className="prose-invert mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 1, 2026
        </p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using AI Grammar Mentor, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, you may not
              use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p>
              AI Grammar Mentor provides AI-powered grammar checking, writing
              suggestions, and educational content designed to improve your
              writing skills. The service is available through our web
              application and browser extensions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Acceptable Use
            </h2>
            <p>
              You agree not to misuse our service, including but not limited to:
              attempting to reverse-engineer our algorithms, using our service
              for automated bulk processing without permission, or distributing
              content that violates any applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Intellectual Property
            </h2>
            <p>
              All content you submit to AI Grammar Mentor remains your property. We
              do not claim ownership of your text. Our service, including its
              design, logos, and algorithms, is protected by intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Limitation of Liability
            </h2>
            <p>
              AI Grammar Mentor is provided &quot;as is&quot; without warranties of
              any kind. We are not liable for any damages arising from your use
              of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              service after changes constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </article>
  )
}
