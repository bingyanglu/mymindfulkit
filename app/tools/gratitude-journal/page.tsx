'use client'

import { Layout } from '../../components/Layout'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'mindfulkit_gratitude_entries'

interface JournalEntry {
  id: number
  date: string
  content: string
}

export default function GratitudeJournalPage() {
  const [currentDate, setCurrentDate] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    updateDate()
    loadEntries()
  }, [])

  useEffect(() => {
    updateWordCount()
  }, [journalContent])

  const updateDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    setCurrentDate(now.toLocaleDateString('en-US', options))
  }

  const updateWordCount = () => {
    const text = journalContent.trim()
    const words = text ? text.match(/\S+/g)?.length || 0 : 0
    setWordCount(words)
  }

  const getEntriesFromStorage = (): JournalEntry[] => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  }

  const loadEntries = () => {
    setEntries(getEntriesFromStorage())
  }

  const handlePromptClick = (promptText: string) => {
    setJournalContent(prev => prev + (prev ? '\n\n' : '') + promptText)
  }

  const saveJournal = () => {
    const content = journalContent.trim()
    if (!content) {
      showToast('Journal cannot be empty!', 'error')
      return
    }

    // Save to localStorage
    const now = new Date()
    const entry: JournalEntry = {
      id: now.getTime(),
      date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: content
    }
    
    let currentEntries = getEntriesFromStorage()
    currentEntries.unshift(entry)
    if (currentEntries.length > 20) {
      currentEntries = currentEntries.slice(0, 20)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEntries))

    // Download Markdown file
    const dateStringForFile = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const markdownContent = `# Gratitude Journal - ${entry.date}\n\n${content}`
    const fileName = `Gratitude_Journal_${dateStringForFile}.md`
    
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast('Journal saved!')
    loadEntries()
  }

  const clearJournal = () => {
    setJournalContent('')
    showToast('Cleared!', 'success')
  }

  const loadEntry = (entry: JournalEntry) => {
    setJournalContent(entry.content)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast('Loaded past entry.')
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  return (
    <Layout>
      <main className="container max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center py-24">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter max-w-4xl mx-auto text-[#3A3532] dark:text-[#E5E7EB] mb-6">
            Your Daily Gratitude Journal
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-[#706C69] dark:text-[#9CA3AF]">
            A simple, private space to reclaim focus, celebrate small wins, and build emotional clarity.
          </p>
        </section>

        {/* Journal App */}
        <section className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#EAE8E3] dark:border-[#374151]">
            <h2 className="text-xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">{currentDate}</h2>
            <span className="text-sm text-[#706C69] dark:text-[#9CA3AF] font-medium">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          </div>
          
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="What are 3 things you're grateful for today?"
            className="w-full min-h-[250px] border-none p-4 text-lg leading-relaxed font-sans text-[#3A3532] dark:text-[#E5E7EB] resize-y bg-transparent focus:outline-none focus:bg-[rgba(26,188,156,0.05)] dark:focus:bg-[rgba(79,70,229,0.05)] rounded-2xl"
          />
          
          <div className="flex gap-4 mt-4 flex-wrap">
            <button 
              onClick={() => handlePromptClick("I'm grateful for [someone] because they [did something].")}
              className="bg-[#F8F7F4] dark:bg-[#374151] border border-[#EAE8E3] dark:border-[#4B5563] px-4 py-2 rounded-full text-sm text-[#706C69] dark:text-[#9CA3AF] cursor-pointer transition-all hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] dark:hover:bg-[#4F46E5] dark:hover:border-[#4F46E5]"
            >
              Thank someone
            </button>
            <button 
              onClick={() => handlePromptClick("Today I accomplished a small thing, which was [action].")}
              className="bg-[#F8F7F4] dark:bg-[#374151] border border-[#EAE8E3] dark:border-[#4B5563] px-4 py-2 rounded-full text-sm text-[#706C69] dark:text-[#9CA3AF] cursor-pointer transition-all hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] dark:hover:bg-[#4F46E5] dark:hover:border-[#4F46E5]"
            >
              Celebrate a small win
            </button>
            <button 
              onClick={() => handlePromptClick("I noticed something beautiful today: [observation].")}
              className="bg-[#F8F7F4] dark:bg-[#374151] border border-[#EAE8E3] dark:border-[#4B5563] px-4 py-2 rounded-full text-sm text-[#706C69] dark:text-[#9CA3AF] cursor-pointer transition-all hover:bg-[#1ABC9C] hover:text-white hover:border-[#1ABC9C] dark:hover:bg-[#4F46E5] dark:hover:border-[#4F46E5]"
            >
              Find beauty
            </button>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#EAE8E3] dark:border-[#374151]">
            <span className="text-sm text-[#706C69] dark:text-[#9CA3AF] font-medium">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <div className="flex gap-4">
              <button 
                onClick={clearJournal}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F8F7F4] dark:bg-[#374151] text-[#706C69] dark:text-[#9CA3AF] border border-[#EAE8E3] dark:border-[#4B5563] font-bold cursor-pointer transition-all hover:bg-[#EAE8E3] dark:hover:bg-[#4B5563] hover:text-[#3A3532] dark:hover:text-[#E5E7EB]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear
              </button>
              <button 
                onClick={saveJournal}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold cursor-pointer transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Journal
              </button>
            </div>
          </div>
        </section>

        {/* Past Entries */}
        {entries.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#3A3532] dark:text-[#E5E7EB]">Past Entries</h2>
            <ul className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <li 
                  key={entry.id}
                  onClick={() => loadEntry(entry)}
                  className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-2xl p-4 cursor-pointer transition-all hover:border-[#1ABC9C] dark:hover:border-[#4F46E5] hover:-translate-y-0.5 shadow-sm"
                >
                  <span className="font-bold block mb-2 text-[#3A3532] dark:text-[#E5E7EB]">{entry.date}</span>
                  <p className="text-[#706C69] dark:text-[#9CA3AF] truncate">{entry.content}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content Sections */}
        <section className="py-24">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-[#3A3532] dark:text-[#E5E7EB]">Why Gratitude Works for the ADHD Brain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="feature-item">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] flex items-center justify-center text-[#1ABC9C] dark:text-[#4F46E5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Shifts Your Focus</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Actively searching for positive moments trains your brain to notice the good, countering the natural negativity bias that can often accompany ADHD.</p>
            </div>
            <div className="feature-item">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] flex items-center justify-center text-[#1ABC9C] dark:text-[#4F46E5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Builds Self-Worth</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">By celebrating small, daily wins, you create a tangible record of your accomplishments, which helps to build self-esteem and a positive self-image.</p>
            </div>
            <div className="feature-item">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] flex items-center justify-center text-[#1ABC9C] dark:text-[#4F46E5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 6H3m18 6H3m18 6H3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Creates a Simple Routine</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">This low-pressure, 2-minute habit is an easy way to build consistency and a sense of routine, which is foundational for managing ADHD.</p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white dark:bg-[#1F2937] rounded-3xl px-8">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-[#3A3532] dark:text-[#E5E7EB]">How to Start Your Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="feature-item">
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">1. Find a Quiet Moment</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Set aside just 2-5 minutes a day. It can be in the morning with your coffee, or at night before bed. Consistency is more important than duration.</p>
            </div>
            <div className="feature-item">
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">2. Start Small</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Don't pressure yourself. Use our prompts or simply list three small things that didn't go wrong today. "My wifi worked" is a perfectly valid entry!</p>
            </div>
            <div className="feature-item">
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">3. Feel, Don't Just Think</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">As you write, try to briefly re-experience the positive feeling associated with that moment. This connection is what rewires the brain over time.</p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-[#3A3532] dark:text-[#E5E7EB]">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="border-b border-[#EAE8E3] dark:border-[#374151] pb-8">
              <h3 className="text-xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Is my journal private?</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Absolutely. Everything you write is saved **only** in your own browser's local storage. We never see, store, or have access to your entries. Your privacy is paramount.</p>
            </div>
            <div className="border-b border-[#EAE8E3] dark:border-[#374151] pb-8">
              <h3 className="text-xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">How often should I write?</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Consistency is key, but don't pressure yourself. Aim for a quick entry once a day, perhaps in the morning to set a positive tone, or at night to reflect. Even a few times a week can make a big difference.</p>
            </div>
            <div className="pb-8">
              <h3 className="text-xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">What if I can't think of anything to write?</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">That's perfectly normal! Try using the prompt suggestions above. Start small. Did you enjoy your morning coffee? Did a stranger smile at you? Was there a moment of quiet? No win is too small to celebrate.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-lg font-medium transition-all ${
            toast.type === 'error' 
              ? 'bg-[#E74C3C] text-white' 
              : 'bg-[#3A3532] dark:bg-[#E5E7EB] text-[#F8F7F4] dark:text-[#111827]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </Layout>
  )
} 