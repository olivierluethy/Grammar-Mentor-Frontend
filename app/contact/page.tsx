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
      const response = await fetch(
        "https://api.grammar-mentor.com/contact.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      let result: any = null

      try {
        result = await response.json()
      } catch {
        throw new Error("Ungültige Serverantwort")
      }

      if (response.ok && result.success) {
        setIsError(false)
        setStatusMessage("Nachricht erfolgreich gesendet!")
        setFormData({ fullName: "", email: "", message: "" })
      } else {
        setIsError(true)
        setStatusMessage(result?.error || "Ein Fehler ist aufgetreten.")
      }
    } catch (error) {
      setIsError(true)
      setStatusMessage("Server nicht erreichbar. Bitte später erneut versuchen.")
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
    <main className="min-h-screen bg-gray-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Have a question about our bespoke services? Drop us a message below.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Your Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-gray-500" />
                <textarea
                  required
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div
                className={`text-sm ${
                  isError ? "text-red-400" : "text-green-400"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          We typically respond within 24 hours.
        </p>

      </div>
    </main>
  )
}