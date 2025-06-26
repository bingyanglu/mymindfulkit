import { Layout } from '../components/Layout'
import { Metadata } from 'next'
import { PomodoroClient } from '../components/client/pomodoro-client'

// 添加元数据以提高SEO
export const metadata: Metadata = {
  title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
  description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
  keywords: ['Pomodoro Timer', 'Dual Task', 'ADHD Focus Tool', 'Productivity Timer', 'Time Management', 'Neurodivergent', 'Study Timer'],
  openGraph: {
    title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
    description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
    images: [
      {
        url: 'https://i.imgur.com/8QG3Y3a.png',
        width: 1200,
        height: 630,
        alt: 'Dual-Task Pomodoro Timer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Dual-Task Pomodoro Timer for ADHD & Focus | MyMindfulKit',
    description: 'A free Pomodoro timer designed for the ADHD brain. Try our unique dual-task mode to stay focused, beat burnout, and build a workflow that feels good. No sign-up required.',
    images: ['https://i.imgur.com/8QG3Y3a.png'],
  },
}

export default function AppPage() {
  return (
    <Layout>
      <PomodoroClient />
    </Layout>
  )
} 