import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | MyMindfulKit - Our Story & Mission',
  description: 'Learn the story behind MyMindfulKit. A toolkit built out of personal need by a developer with a neurodivergent mind, for the community.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | MyMindfulKit - Our Story & Mission',
    description: 'Learn the story behind MyMindfulKit. A toolkit built out of personal need by a developer with a neurodivergent mind, for the community.',
    url: 'https://mymindfulkit.com/about',
    siteName: 'MyMindfulKit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | MyMindfulKit - Our Story & Mission',
    description: 'Learn the story behind MyMindfulKit. A toolkit built out of personal need by a developer with a neurodivergent mind, for the community.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
} 