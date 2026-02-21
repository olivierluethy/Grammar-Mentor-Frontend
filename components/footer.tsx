import Link from "next/link"
import { Sparkles } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  product: [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
      href="/"
      className="flex items-center gap-2 text-foreground font-semibold text-lg"
    >
      <Image 
        src="/logo426x426.png"       // Path to your image in the public folder
        alt="AI Grammar Mentor Logo" // Crucial for SEO and accessibility
        width={32}            // Set the width (matches h-8 approx)
        height={32}           // Set the height
        className="h-8 w-auto" // Control size with Tailwind; w-auto maintains aspect ratio
        priority              // Tells Next.js to load this immediately (LCP)
      />
      <span>AI Grammar Mentor</span>
    </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The grammar checker that teaches you something new every time you
              write.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {"© 2026 AI Grammar Mentor. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
