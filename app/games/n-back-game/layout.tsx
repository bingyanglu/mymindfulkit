import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free N-Back Training Game for Working Memory | MyMindfulKit',
  description: 'A simple and effective online N-Back game designed for ADHD & neurodivergent minds. Boost your working memory and focus with this science-backed cognitive challenge.',
  keywords: ['N-Back game', 'working memory training', 'ADHD games', 'cognitive training', 'brain games', 'focus games', 'memory games'],
  alternates: { canonical: '/games/n-back-game' },
  openGraph: {
    title: 'Free N-Back Training Game for Working Memory | MyMindfulKit',
    description: 'A simple and effective online N-Back game designed for ADHD & neurodivergent minds. Boost your working memory and focus with this science-backed cognitive challenge.',
    url: 'https://mymindfulkit.com/games/n-back-game',
    siteName: 'MyMindfulKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free N-Back Training Game for Working Memory | MyMindfulKit',
    description: 'A simple and effective online N-Back game designed for ADHD & neurodivergent minds. Boost your working memory and focus with this science-backed cognitive challenge.',
  },
}

export default function NBackGameLayout({ children }: { children: React.ReactNode }) {
  return children
} 