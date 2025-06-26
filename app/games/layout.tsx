import { type Metadata } from 'next'
import { Layout } from '@/app/components/Layout'

export const metadata: Metadata = {
  title: 'ADHD Brain Training Games for Focus & Memory | MyMindfulKit',
  description: 'Explore our collection of free, non-distracting online games and curated brain-training resources, designed to improve focus, memory, and cognitive skills for the neurodivergent mind.',
  alternates: {
    canonical: '/games',
  },
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
} 