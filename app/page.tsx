import { Layout } from './components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

// 添加元数据以提高SEO
export const metadata: Metadata = {
  title: 'MyMindfulKit | ADHD Tools, Games, and Resources for Focus',
  description: 'We build calm, clear, and effective digital tools to help neurodivergent minds navigate the noise, manage focus, and do their best work.',
  keywords: ['ADHD tools', 'focus games', 'neurodivergent resources', 'productivity apps', 'pomodoro timer', 'working memory', 'executive function'],
  openGraph: {
    title: 'MyMindfulKit | ADHD Tools, Games, and Resources for Focus',
    description: 'We build calm, clear, and effective digital tools to help neurodivergent minds navigate the noise, manage focus, and do their best work.',
    images: [
      {
        url: 'https://i.imgur.com/8QG3Y3a.png',
        width: 1200,
        height: 630,
        alt: 'MyMindfulKit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyMindfulKit | ADHD Tools, Games, and Resources for Focus',
    description: 'We build calm, clear, and effective digital tools to help neurodivergent minds navigate the noise, manage focus, and do their best work.',
    images: ['https://i.imgur.com/8QG3Y3a.png'],
  },
}

export default function Home() {
    return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section text-center py-24 md:py-32">
        <div className="container max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight md:leading-tight max-w-4xl mx-auto
                        text-[#3A3532] dark:text-[#E5E7EB]">
            Find your flow. <br /> A <span className="bg-gradient-to-r from-[rgba(26,188,156,0.2)] to-[rgba(26,188,156,0)] dark:from-[#4F46E5] dark:to-transparent px-3 rounded-lg">toolkit</span> for your mind.
          </h1>
          <p className="text-xl max-w-2xl mx-auto mt-7 mb-12
                      text-[#706C69] dark:text-[#9CA3AF]">
            We build calm, clear, and effective digital tools to help neurodivergent minds navigate the noise, manage focus, and do their best work.
          </p>
          <Link href="#featured" 
                className="primary-button bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA]
                          text-white font-bold py-5 px-9 rounded-xl
                          shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)]
                          hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)]
                          hover:translate-y-[-2px] transition-all duration-200">
            Explore Our First Tool
          </Link>
        </div>
      </section>

      {/* Featured Tool Section */}
      <section id="featured" className="container max-w-7xl mx-auto px-6 mb-24">
        <div className="featured-card bg-white dark:bg-[#1F2937]
                        rounded-3xl p-12
                        border border-[#EAE8E3] dark:border-[#374151]
                        shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)]
                        flex flex-col lg:flex-row items-center gap-12">
          <div className="featured-text flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4
                          text-[#3A3532] dark:text-[#E5E7EB]">
              The Dual-Task Pomodoro Timer
            </h2>
            <p className="text-lg mb-8
                        text-[#706C69] dark:text-[#9CA3AF]">
              Designed for brains that get bored easily. Our signature timer helps you stay engaged by gently alternating between two different tasks, making focus feel less like a chore and more like a rhythm.
            </p>
            <Link href="/tools/dual-task-pomodoro" 
                  className="primary-button bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA]
                            text-white font-bold py-5 px-9 rounded-xl
                            shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)]
                            hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)]
                            hover:translate-y-[-2px] transition-all duration-200">
              Start Focusing Now
            </Link>
                  </div>
          <div className="featured-image-wrapper flex-1 lg:flex-[1.2]
                          p-4 bg-[#F0F2F5] dark:bg-[#111827]
                          rounded-2xl">
            <div className="relative w-full aspect-video">
              {/* 白天主题图片 */}
              <Image 
                src="/images/pomodoro-screenshot.png" 
                alt="A screenshot of the beautiful and clean Dual-Task Pomodoro Timer interface"
                className="rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:hidden"
                fill
                style={{ objectFit: 'cover' }}
              />
              {/* 黑夜主题图片 */}
              <Image 
                src="/images/pomodoro-screenshot-dark.png" 
                alt="A screenshot of the beautiful and clean Dual-Task Pomodoro Timer interface"
                className="rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.3)] hidden dark:block"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Cards Section */}
      <section className="container max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4
                        text-[#3A3532] dark:text-[#E5E7EB]">
            Our Tools
          </h2>
          <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] max-w-2xl mx-auto">
            Simple, effective, and beautifully designed productivity apps to help you manage focus and build routines.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ToolCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            }
            title="Gratitude Journal"
            description="Build a positive daily habit with our free gratitude journal, designed specifically for the ADHD mind."
            buttonText="Start Journaling"
            href="/tools/gratitude-journal"
          />
          <ToolCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            }
            title="Task Slicer"
            description="Break down daunting tasks into small, manageable, and actionable steps with AI-powered assistance."
            buttonText="Coming Soon"
            href="#"
            disabled={true}
          />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section py-24 md:py-32 text-center">
        <div className="container max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16
                        text-[#3A3532] dark:text-[#E5E7EB]">
            A companion for your daily journey.
          </h2>
          <div className="value-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                </svg>
              }
              title="Reduce Overwhelm"
              description="Our tools help break down big tasks and provide gentle structure, so you know exactly where to start."
            />
            <ValueItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
              title="Train Your Focus"
              description="Engage with cognitive games scientifically designed to strengthen working memory and attention."
            />
            <ValueItem 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
              title="Build Routines That Stick"
              description="Create positive habits with tools that are enjoyable to use and designed to fit your unique workflow."
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

// 值项组件
function ValueItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="value-item p-6">
      <div className="icon-wrapper w-16 h-16 mx-auto mb-6 rounded-full
                    bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)]
                    flex items-center justify-center
                    text-[#1ABC9C] dark:text-[#4F46E5]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2
                  text-[#3A3532] dark:text-[#E5E7EB]">
        {title}
      </h3>
      <p className="text-[#706C69] dark:text-[#9CA3AF]">
        {description}
      </p>
    </div>
  )
}

// 工具卡片组件
function ToolCard({ icon, title, description, buttonText, href, disabled = false }: { icon: React.ReactNode, title: string, description: string, buttonText: string, href: string, disabled?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="icon-wrapper w-16 h-16 mx-auto mb-6 rounded-full
                    bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)]
                    flex items-center justify-center
                    text-[#1ABC9C] dark:text-[#4F46E5]">
        {icon}
      </div>
      <h3 className="text-[1.75rem] font-bold mb-2 text-center
                  text-[#3A3532] dark:text-[#E5E7EB]">
        {title}
      </h3>
      <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow text-center">
        {description}
      </p>
      {disabled ? (
        <span className="inline-block text-center bg-[#bdc3c7] dark:bg-gray-600 text-white font-bold py-4 px-6 rounded-[16px] cursor-not-allowed">
          {buttonText}
        </span>
      ) : (
        <Link href={href}
              className="inline-block text-center bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold py-4 px-6 rounded-[16px] transition-transform hover:-translate-y-0.5">
          {buttonText}
        </Link>
      )}
    </div>
  )
}