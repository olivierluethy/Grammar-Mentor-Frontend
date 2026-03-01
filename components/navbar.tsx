"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useUser, SignOutButton } from "@clerk/nextjs"

const navLinks = [
  { href: "/subscribe", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Image src="/logo426x426.png" alt="AI Grammar Mentor Logo" width={32} height={32} />
          <span>AI Grammar Mentor</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Rechts: Auth-Bereich (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {!isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Register</Link>
              </Button>
            </>
          ) : (
            <SignOutButton>
              <Button variant="ghost" size="sm">Logout</Button>
            </SignOutButton>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu - Jetzt absolut positioniert */}
      {mobileOpen && (
        <div className="absolute left-0 top-[64px] w-full border-b border-border bg-background px-4 pb-6 shadow-xl md:hidden">
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

          <div className="mt-6 flex flex-col gap-2">
            {!isSignedIn ? (
              <>
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button size="sm" asChild className="w-full justify-start">
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </Button>
              </>
            ) : (
              <SignOutButton>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Logout
                </Button>
              </SignOutButton>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
