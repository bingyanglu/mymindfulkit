import { type Metadata } from 'next'
import { Layout } from '@/app/components/Layout'

export const metadata: Metadata = {
  title: 'AI Prompts for ADHD: ChatGPT Ideas for Focus & Creativity | MyMindfulKit',
  description: 'A library of AI prompts specifically designed to help ADHD minds overcome executive function challenges. Use our prompts for ChatGPT, Claude, and more to plan, write, and solve problems effectively.',
  alternates: {
    canonical: '/ai-prompts',
  },
}

export default function AIPromptsLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>
} 