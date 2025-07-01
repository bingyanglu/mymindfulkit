import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impulse Control Training (Go/No-Go Task) | MyMindfulKit',
  description:
    'Train and improve your impulse control online with our scientific Go/No-Go task. Designed for individuals with ADHD or anyone looking to enhance focus and reduce impulsive behavior, this tool helps you make more deliberate decisions in daily life.',
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
  ],
  alternates: { canonical: '/games/impulse-control-game' },
  openGraph: {
    title: '冲动控制训练游戏 - Go/No-Go训练 | MyMindfulKit',
    description: '专为ADHD和注意力不集中人群设计的冲动控制训练游戏。通过Go/No-Go任务提升反应抑制能力和选择性注意力，帮助改善执行功能。',
    url: 'https://mymindfulkit.com/games/impulse-control-game',
    siteName: 'MyMindfulKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '冲动控制训练游戏 - Go/No-Go训练 | MyMindfulKit',
    description: '专为ADHD和注意力不集中人群设计的冲动控制训练游戏。通过Go/No-Go任务提升反应抑制能力和选择性注意力，帮助改善执行功能。',
  },
}

export default function ImpulseControlGameLayout({ children }: { children: React.ReactNode }) {
  return children
} 