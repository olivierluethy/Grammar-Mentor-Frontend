"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6"
        aria-label="Main navigation"
      >
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

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
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

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <button
          className="flex items-center justify-center md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                Log in
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
