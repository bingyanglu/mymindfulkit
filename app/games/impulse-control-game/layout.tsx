import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Go/No-Go Game for ADHD Impulse Control | MyMindfulKit',
  description:
    'Train your brain to resist impulses with our simple, science-backed Go/No-Go game. A free online tool designed to improve focus and inhibitory control for the ADHD mind.',
  keywords: [
    'impulse control training',
    'Go/No-Go game',
    'ADHD training',
    'executive function training',
    'response inhibition',
    'attention training',
    'cognitive training game',
    'ADHD tools',
    'focus exercises',
    'free ADHD game',
    'brain training',
    'inhibitory control',
  ],
  alternates: { canonical: '/games/impulse-control-game' },
  openGraph: {
    title: 'Free Go/No-Go Game for ADHD Impulse Control | MyMindfulKit',
    description: 'Train your brain to resist impulses with our simple, science-backed Go/No-Go game. A free online tool designed to improve focus and inhibitory control for the ADHD mind.',
    url: 'https://mymindfulkit.com/games/impulse-control-game',
    siteName: 'MyMindfulKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Go/No-Go Game for ADHD Impulse Control | MyMindfulKit',
    description: 'Train your brain to resist impulses with our simple, science-backed Go/No-Go game. A free online tool designed to improve focus and inhibitory control for the ADHD mind.',
  },
}

export default function ImpulseControlGameLayout({ children }: { children: React.ReactNode }) {
  return children
} 