"use client"

import Link from 'next/link'
import { useTheme } from '../hooks/use-theme'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // 判断是否在番茄钟应用页面
  const isInPomodoroApp = pathname.includes('/tools/dual-task-pomodoro')
  
  // 根据当前页面生成正确的链接
  const getLink = (anchor: string) => {
    return isInPomodoroApp ? `/${anchor}` : anchor
  }
  
  return (
    <header className="main-header py-6 backdrop-blur-md border-b sticky top-0 z-10
                      bg-[#F8F7F4]/80 dark:bg-[#111827]/80
                      border-[#EAE8E3] dark:border-[#374151]">
      <div className="container max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center">
          <Link href="/" className="logo text-xl md:text-2xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB]">
            MyMindfulKit
          </Link>
        </div>
        
        <nav className="main-nav hidden md:flex items-center space-x-8">
          <Link href="/tools" className={`font-medium transition-colors ${pathname === '/tools' ? 'text-[#1ABC9C] dark:text-[#4F46E5]' : 'text-[#706C69] dark:text-[#9CA3AF] hover:text-[#3A3532] dark:hover:text-white'}`}>
            Tools
          </Link>
          <Link href="/games" className={`font-medium transition-colors ${pathname === '/games' ? 'text-[#1ABC9C] dark:text-[#4F46E5]' : 'text-[#706C69] dark:text-[#9CA3AF] hover:text-[#3A3532] dark:hover:text-white'}`}>
            Games
          </Link>
          <Link href="/ai-prompts" className={`font-medium transition-colors ${pathname === '/ai-prompts' ? 'text-[#1ABC9C] dark:text-[#4F46E5]' : 'text-[#706C69] dark:text-[#9CA3AF] hover:text-[#3A3532] dark:hover:text-white'}`}>
            AI Prompts
          </Link>
          <a href="#" className="font-medium text-[#A8A5A2] dark:text-[#6b7280] cursor-not-allowed">Resources</a>
          <Link href="/blog" className={`font-medium transition-colors ${pathname === '/blog' ? 'text-[#1ABC9C] dark:text-[#4F46E5]' : 'text-[#706C69] dark:text-[#9CA3AF] hover:text-[#3A3532] dark:hover:text-white'}`}>
            Blog
          </Link>
          <Link href="/about" className="font-bold text-[#3A3532] dark:text-[#E5E7EB] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] transition-colors ml-2"><strong>About</strong></Link>
        </nav>

        <div className="flex items-center">
          <button 
            onClick={toggleTheme} 
            className="ml-9 p-2 rounded-full hover:bg-[#EAE8E3] dark:hover:bg-[#374151] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-[#E5E7EB]" />
            ) : (
              <Moon className="h-5 w-5 text-[#3A3532]" />
            )}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-4 p-2 sm:hidden rounded-full hover:bg-[#EAE8E3] dark:hover:bg-[#374151] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#3A3532] dark:text-[#E5E7EB]" />
            ) : (
              <Menu className="h-6 w-6 text-[#3A3532] dark:text-[#E5E7EB]" />
            )}
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="sm:hidden py-4 px-6 bg-[#F8F7F4] dark:bg-[#111827] border-b border-[#EAE8E3] dark:border-[#374151]">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/tools" 
              className="font-medium text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#E5E7EB] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              href="/games" 
              className="font-medium text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#E5E7EB] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Games
            </Link>
            <Link 
              href="/ai-prompts" 
              className="font-medium text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#E5E7EB] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Prompts
            </Link>
            <a 
              href="#" 
              className="font-medium text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#E5E7EB] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </a>
            <Link 
              href="/blog" 
              className="font-medium text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#E5E7EB] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="font-bold text-[#3A3532] dark:text-[#E5E7EB] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <strong>About</strong>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
} 