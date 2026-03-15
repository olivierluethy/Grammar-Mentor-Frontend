import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css"
import TawkToClient from '@/components/TawkToClient';

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://grammar-mentor.com'), // DEINE ECHTE DOMAIN HIER
  title: {
    default: "AI Grammar Mentor - The Grammar Checker That Teaches You",
    template: "%s | AI Grammar Mentor",
  },
  description:
    "The world's first grammar checker that actually teaches you something...",
  alternates: {
    canonical: '/', // Das setzt den Canonical-Tag standardmässig auf die aktuelle URL
  },
  icons: {
  icon: [
    { url: '/logo32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/logo192x192.png', sizes: '192x192', type: 'image/png' },
    { url: '/logo426x426.png', sizes: '426x426', type: 'image/png' },
    { url: '/logo512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  shortcut: '/favicon.ico', // Optional für alte Browser
  apple: [
    { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  ],
},
}


export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 2. Das appearance-Prop hier zentral setzen
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body className="font-sans antialiased bg-background text-foreground">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Analytics />
          <TawkToClient />
        </body>
      </html>
    </ClerkProvider>
  )
}