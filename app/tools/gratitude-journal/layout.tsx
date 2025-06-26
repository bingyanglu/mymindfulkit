import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Gratitude Journal for ADHD: A Daily Tool for Focus & Positivity | MyMindfulKit',
  description: 'Build a positive daily habit with our free gratitude journal, designed specifically for the ADHD mind. A simple, private tool to reclaim focus, celebrate small wins, and find emotional clarity. No sign-up required.',
  alternates: { canonical: '/tools/gratitude-journal' },
}

export default function GratitudeJournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 