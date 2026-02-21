"use client"

import Link from "next/link"
import { useState } from "react"
import { Sparkles, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn } from "next-auth/react"
import Image from "next/image"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})

  const [isLoading, setIsLoading] = useState(false)

  async function handleSocialSignIn(provider: "google" | "facebook") {
    setIsLoading(true)
    try {
      await signIn(provider, {
        callbackUrl: "/",
      })
    } catch (error) {
      console.error("Social sign-in error:", error)
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const newErrors: { name?: string; email?: string; password?: string } = {}

    if (!name || name.trim().length < 2) {
      newErrors.name = "Please enter your name."
    }
    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Submit logic / credentials registration would go here
      console.log("Would register:", { name, email, password })
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start writing better with AI-powered grammar checking.
          </p>

          {/* ← New incentive text added here */}
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
  <Sparkles className="h-4 w-4" />
  Increase your limits for free simply by registering.
</p>
        </div>

        {/* Social signup buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading}
          >
            <svg role="img" viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.44-3.39-7.44-7.57s3.345-7.57 7.44-7.57c2.33 0 3.918.99 4.785 1.845l3.254-3.138C18.19 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            Sign up with Google
          </Button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}