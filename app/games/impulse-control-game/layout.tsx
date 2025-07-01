import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '冲动控制训练游戏 - Go/No-Go训练 | MyMindfulKit',
  description: '专为ADHD和注意力不集中人群设计的冲动控制训练游戏。通过Go/No-Go任务提升反应抑制能力和选择性注意力，帮助改善执行功能。',
  keywords: ['冲动控制训练', 'Go/No-Go游戏', 'ADHD训练', '执行功能训练', '反应抑制', '注意力训练', '认知训练游戏'],
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