"use client"

import React, { useState } from "react"
import { Send, Mail, User, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setStatusMessage(null)

    try {
      const response = await fetch("https://api.grammar-mentor.com/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      let result: any = null

      try {
        result = await response.json()
      } catch {
        throw new Error("Invalid server response")
      }

      if (response.ok && result.success) {
        setIsError(false)
        setStatusMessage("Message sent successfully!")
        setFormData({ fullName: "", email: "", message: "" })
      } else {
        setIsError(true)
        setStatusMessage(result?.error || "An error has occurred.")
      }
    } catch {
      setIsError(true)
      setStatusMessage("Server unavailable. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10 sm:px-6 sm:py-20 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 text-center sm:mb-12">
          <h1 className="text-2xl font-bold tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:mt-4 sm:text-lg">
            Have a question about our bespoke services? Drop us a message below.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 shadow-xl backdrop-blur-sm sm:rounded-2xl sm:p-12">

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

            {/* Full Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 sm:h-5 sm:w-5" />
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-700 bg-gray-950 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:rounded-lg sm:py-3 sm:pl-10 sm:text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 sm:h-5 sm:w-5" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-md border border-gray-700 bg-gray-950 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:rounded-lg sm:py-3 sm:pl-10 sm:text-base"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
                Your Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-500 sm:top-4 sm:h-5 sm:w-5" />
                <textarea
                  required
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-md border border-gray-700 bg-gray-950 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:rounded-lg sm:py-3 sm:pl-10 sm:text-base"
                />
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className={`text-xs sm:text-sm ${isError ? "text-red-400" : "text-green-400"}`}>
                {statusMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 sm:w-auto sm:rounded-xl sm:px-8 sm:py-4"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
          We typically respond within 24 hours.
        </p>

      </div>
    </main>
  )
}