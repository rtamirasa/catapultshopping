import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AisleIQ — Know if it\'s the right time to buy.',
  description: 'Scan shelf tags, track live price trends, and save money across stores with AI-powered retail price intelligence.',
  generator: 'AisleIQ',
  keywords: ['price intelligence', 'grocery savings', 'retail scanner', 'price tracker', 'smart shopping'],
  openGraph: {
    title: 'AisleIQ — Know if it\'s the right time to buy.',
    description: 'Scan shelf tags, track live price trends, and save money across stores.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#f9fafb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
