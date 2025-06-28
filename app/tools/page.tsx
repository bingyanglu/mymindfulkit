import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ADHD Tools - Productivity Apps for Focus & Organization | MyMindfulKit',
  description: 'Explore a curated collection of free online tools designed for the ADHD & neurodivergent mind. Find apps for focus, time management, and task organization.',
  alternates: { canonical: '/tools' },
}

// 定义卡片和按钮的通用样式，便于维护
const toolCardStyles = "bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
const primaryButtonStyles = "inline-block text-center bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold py-4 px-6 rounded-[16px] transition-transform hover:-translate-y-0.5"
const disabledButtonStyles = "inline-block text-center bg-[#bdc3c7] dark:bg-gray-600 text-white font-bold py-4 px-6 rounded-[16px] cursor-not-allowed"
const externalButtonStyles = "inline-block text-center bg-white dark:bg-transparent border border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-gray-200 font-bold py-4 px-6 rounded-[16px] transition-all hover:bg-gray-50 dark:hover:bg-[#374151] hover:-translate-y-0.5"

export default function ToolsPage() {
  return (
    <div className="bg-[#F8F7F4] dark:bg-[#111827]">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32">
          <div className="container max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight tracking-tighter max-w-4xl mx-auto text-[#3A3532] dark:text-[#E5E7EB]">
              A Curated Kit of ADHD Tools
            </h1>
            <p className="text-xl md:text-[1.25rem] max-w-3xl mx-auto mt-6 text-[#706C69] dark:text-[#9CA3AF]">
              Simple, effective, and beautifully designed productivity apps to help you manage focus, organize tasks, and build routines that truly work for you.
            </p>
          </div>
        </section>

        {/* Our Tools Section */}
        <section className="container max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center mt-16 mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB] mb-4">Our Tools</h2>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] max-w-2xl mx-auto">
              Crafted in-house with the neurodivergent community in mind. Simple, focused, and free to use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Featured: Dual-Task Pomodoro Timer */}
            <div className={`${toolCardStyles} md:col-span-2 lg:col-span-3 !p-12 grid md:grid-cols-2 items-center gap-12`}>
              <div className="flex flex-col">
                <span className="self-start bg-[rgba(26,188,156,0.1)] text-[#1ABC9C] text-sm font-bold rounded-full px-3 py-1 mb-4">Signature Tool</span>
                <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Dual-Task Pomodoro Timer</h3>
                <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                  Our unique timer designed for brains that crave novelty. Stay engaged by gently alternating between two different tasks, making focus feel less like a chore and more like a rhythm.
                </p>
                <Link href="/tools/dual-task-pomodoro" className={primaryButtonStyles}>Launch Timer</Link>
              </div>
              <div className="bg-[#F0F2F5] dark:bg-[#0D1117] rounded-[16px] p-4">
                <Image 
                  src="/images/pomodoro-screenshot.png"
                  alt="Dual-Task Pomodoro Timer Interface"
                  width={600}
                  height={340}
                  className="rounded-lg shadow-lg dark:hidden"
                />
                <Image 
                  src="/images/pomodoro-screenshot-dark.png"
                  alt="Dual-Task Pomodoro Timer Interface (Dark Mode)"
                  width={600}
                  height={340}
                  className="rounded-lg shadow-lg hidden dark:block"
                />
              </div>
            </div>

            {/* Gratitude Journal */}
            <div className={toolCardStyles}>
              <span className="self-start bg-[rgba(26,188,156,0.1)] text-[#1ABC9C] text-sm font-bold rounded-full px-3 py-1 mb-4">New Tool</span>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Gratitude Journal</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                Build a positive daily habit with our free gratitude journal, designed specifically for the ADHD mind. A simple, private tool to reclaim focus, celebrate small wins, and find emotional clarity.
              </p>
              <Link href="/tools/gratitude-journal" className={primaryButtonStyles}>Start Journaling</Link>
            </div>

            {/* ChronoGrid Card (Time Awareness) */}
            <div className={toolCardStyles}>
              <span className="self-start bg-[rgba(26,188,156,0.1)] text-[#1ABC9C] text-sm font-bold rounded-full px-3 py-1 mb-4">New Tool</span>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">ChronoGrid</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                A visual tool to combat time blindness. See the passage of time as tangible dots, helping you to stay grounded and reduce anxiety.
              </p>
              <Link href="/tools/time-awareness" className={primaryButtonStyles}>Try Now</Link>
            </div>

            {/* Coming Soon Cards */}
            <div className={toolCardStyles}>
              <span className="self-start bg-[rgba(112,108,105,0.1)] text-[#706C69] dark:text-gray-400 text-sm font-bold rounded-full px-3 py-1 mb-4">Coming Soon</span>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Task Slicer</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                Feeling overwhelmed by a big project? This AI-powered tool helps you break down daunting tasks into small, manageable, and actionable steps.
              </p>
              <span className={disabledButtonStyles}>Coming Soon</span>
            </div>
            <div className={toolCardStyles}>
              <span className="self-start bg-[rgba(112,108,105,0.1)] text-[#706C69] dark:text-gray-400 text-sm font-bold rounded-full px-3 py-1 mb-4">Coming Soon</span>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Emotion Logger</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                A simple, private space to track your daily mood and energy levels. Understand your patterns and build a more balanced, self-aware routine.
              </p>
              <span className={disabledButtonStyles}>Coming Soon</span>
            </div>
            <div className={toolCardStyles}>
              <span className="self-start bg-[rgba(112,108,105,0.1)] text-[#706C69] dark:text-gray-400 text-sm font-bold rounded-full px-3 py-1 mb-4">Coming Soon</span>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">ADHD Soundboard</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                A collection of focus-enhancing sounds, including brown noise, white noise, and calming rain. Block out distractions and create your ideal focus environment.
              </p>
              <span className={disabledButtonStyles}>Coming Soon</span>
            </div>
          </div>
        </section>

        {/* Curated Community Tools Section */}
        <section className="container max-w-6xl mx-auto px-6 mb-24">
          <div className="text-center mt-24 mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB] mb-4">Curated from the Community</h2>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] max-w-2xl mx-auto">
              We've hand-picked some of the best external tools that are widely loved for their ADHD-friendly features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* External Tool: Notion */}
            <div className={toolCardStyles}>
              <div className="h-16 mb-4"><div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><span className="text-gray-500 text-xs">Logo</span></div></div>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Notion</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                The ultimate all-in-one workspace. Perfect for creating custom dashboards, wikis, and task managers. Its flexibility is ideal for building a personalized system.
              </p>
              <a href="https://notion.so" target="_blank" rel="noopener noreferrer" className={externalButtonStyles}>Visit Notion</a>
            </div>

            {/* External Tool: Sunsama */}
            <div className={toolCardStyles}>
              <div className="h-16 mb-4"><div className="w-auto h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center px-4"><span className="text-gray-500 text-xs">Logo</span></div></div>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Sunsama</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                A daily planner for calm, focused work. It guides you through planning your day, helping to prevent overwhelm and promoting intentionality.
              </p>
              <a href="https://sunsama.com" target="_blank" rel="noopener noreferrer" className={externalButtonStyles}>Visit Sunsama</a>
            </div>

            {/* External Tool: Focusmate */}
            <div className={toolCardStyles}>
              <div className="h-16 mb-4"><div className="w-auto h-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center px-4"><span className="text-gray-500 text-xs">Logo</span></div></div>
              <h3 className="text-[1.75rem] font-bold text-[#3A3532] dark:text-[#E5E7EB] mb-2">Focusmate</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8 flex-grow">
                A virtual co-working platform that provides live, peer accountability (body doubling). Incredibly effective for task initiation and sustained focus.
              </p>
              <a href="https://focusmate.com" target="_blank" rel="noopener noreferrer" className={externalButtonStyles}>Visit Focusmate</a>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 