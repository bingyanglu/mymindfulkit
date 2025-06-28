import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visual Time Tracker for ADHD: Combat Time Blindness | MyMindfulKit',
  description: 'A visual tool to help you perceive the passage of time. Combat time blindness and stay grounded in the present moment with our dot-based time progress visualizer.',
  alternates: { canonical: '/tools/time-awareness' },
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children
} 