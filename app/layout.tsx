import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

// SEO Metadata
const siteConfig = {
  name: "MyMindfulKit",
  description:
    "A focus tool that rotates between two tasks, built for better attention, less burnout, and gentle structure. Perfect for ADHD minds, students, and remote workers.",
  url: "https://mymindfulkit.com",
  ogImage: "https://mymindfulkit.com/og-image.png",
}

export const metadata: Metadata = {
  title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
  description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
  keywords: ['Pomodoro Timer', 'Dual Task', 'ADHD Focus Tool', 'Productivity Timer', 'Time Management', 'Neurodivergent', 'Study Timer'],
  authors: [{ name: "MyMindfulKit" }],
  creator: "MyMindfulKit",
  publisher: "MyMindfulKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
    description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://i.imgur.com/8QG3Y3a.png",
        width: 1200,
        height: 630,
        alt: "Dual-Task Pomodoro Timer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
    description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
    images: ["https://i.imgur.com/8QG3Y3a.png"],
    creator: "@mymindfulkit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
        
        <link rel="dns-prefetch" href="//i.imgur.com" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
