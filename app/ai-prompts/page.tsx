'use client'

import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'

// Data for the prompts
const promptsData = [
  {
      title: "The 5-Minute Daily Planner",
      category: "planning",
      prompt: "I have ADHD and struggle with executive function. Act as my friendly executive assistant. Based on my to-do list below, help me create a simple, prioritized plan for today. Break down the top 3 tasks into tiny, actionable steps (no more than 15-25 minutes each). My list: [Your To-Do List Here]",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  },
  {
      title: "The 'Un-Stuck' Prompt",
      category: "writing",
      prompt: "I'm feeling stuck writing about [Your Topic]. I have some rough ideas but can't seem to start. Act as a creative partner. Ask me three simple questions to get me thinking, and then suggest three completely different opening sentences I could use.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  },
  {
      title: "The 'Explain It To Me' Prompt",
      category: "problem-solving",
      prompt: "I have ADHD and find it hard to understand dense, complex information. Please explain the concept of [Complex Topic] to me. Use a simple analogy, avoid jargon, and structure your explanation in short, easy-to-read paragraphs with bullet points for key takeaways.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  },
  {
      title: "The Task Slicer",
      category: "planning",
      prompt: "I need to complete a large project: [Describe Your Project]. I'm feeling overwhelmed and don't know where to start. Act as a project manager. Break this project down into 5-7 high-level phases. Then, for the very first phase, break it down further into tiny, concrete next steps I can do today.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
  },
  {
      title: "The Idea Generator",
      category: "writing",
      prompt: "I want to create content about [Your Niche]. I'm out of ideas. Act as a content strategist. Give me a list of 5 interesting blog post titles. For each title, provide a short, 2-sentence summary of what the article could be about.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V6.5L15.5 2z"></path><path d="M15 2v5h5"></path><path d="M10 16s.5-1 2-1 2 1 2 1"></path><path d="M10 12s.5-1 2-1 2 1 2 1"></path></svg>
  },
  {
      title: "The 'Reframe Negative Thoughts' Prompt",
      category: "problem-solving",
      prompt: "I'm having a negative thought: '[Your Negative Thought]'. Act as a cognitive behavioral therapy (CBT) coach. Help me challenge this thought. Ask me questions to examine the evidence for and against this thought, and then help me reframe it into a more balanced and realistic perspective.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
  },
];

const PhilosophyItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="text-center">
      <div className="mx-auto mb-6 w-14 h-14 bg-[#8E44AD]/10 text-[#8E44AD] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">{title}</h3>
      <p className="text-[#706C69] dark:text-[#9CA3AF]">{description}</p>
    </div>
);

const PromptCard = ({ title, category, prompt, icon, onCopy }: { title: string, category: string, prompt: string, icon: React.ReactNode, onCopy: (prompt: string, button: HTMLButtonElement) => void }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(prompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  return (
    <div className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#8E44AD]/10 text-[#8E44AD] rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#3A3532] dark:text-[#E5E7EB]">{title}</h3>
          <p className="text-sm text-[#706C69] dark:text-[#9CA3AF] capitalize">{category}</p>
        </div>
      </div>
      <div className="bg-[#F8F7F4] dark:bg-[#111827] p-4 rounded-lg text-[#706C69] dark:text-[#9CA3AF] text-sm flex-grow mb-6 font-mono whitespace-pre-wrap">
        {prompt}
      </div>
      <button 
        onClick={handleCopy}
        className={`w-full p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
          isCopied 
            ? 'bg-[#1ABC9C] text-white border-transparent' 
            : 'bg-white dark:bg-[#1F2937] text-[#3A3532] dark:text-white border border-[#EAE8E3] dark:border-[#374151] hover:bg-[#8E44AD] hover:text-white dark:hover:bg-[#8E44AD]'
        }`}
      >
        {isCopied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Prompt</span>
          </>
        )}
      </button>
    </div>
  );
};

export default function AIPromptsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', 'planning', 'writing', 'problem-solving'];

  const filteredPrompts = promptsData.filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch = searchTerm === '' || 
                          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
      <main>
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32">
          <div className="container max-w-6xl mx-auto px-6">
            <span className="inline-block bg-[#8E44AD]/10 text-[#8E44AD] px-4 py-2 rounded-full font-bold text-sm mb-4">
              Your AI Co-pilot
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight tracking-tighter max-w-4xl mx-auto text-[#3A3532] dark:text-[#E5E7EB]">
              AI Prompts, Reimagined for the ADHD Brain
            </h1>
            <p className="text-xl md:text-[1.25rem] max-w-3xl mx-auto mt-6 text-[#706C69] dark:text-[#9CA3AF]">
              Use AI as your "external brain". This is a library of prompts designed to help you overcome executive function challenges, from planning and writing to problem-solving.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>}
              title="Executive Function Support"
              description="Prompts crafted to assist with planning, organization, and task initiation."
            />
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>}
              title="Overcome Blank Page Syndrome"
              description="Use our creativity and writing prompts to break through blocks and get your ideas flowing."
            />
            <PhilosophyItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>}
              title="Promote Positive Self-Talk"
              description="Leverage AI to challenge negative thoughts and reframe your perspective with kindness."
            />
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="container max-w-6xl mx-auto px-6 mb-12">
            <div className="flex flex-col gap-6 items-center">
                <div className="relative w-full max-w-2xl">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#706C69] dark:text-[#9CA3AF]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                      type="search" 
                      placeholder="Search prompts (e.g., 'email', 'plan', 'stuck')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-full border border-[#EAE8E3] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-lg focus:ring-2 focus:ring-[#8E44AD]/50 focus:border-[#8E44AD] outline-none transition-all"
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setFilter(cat)}
                          className={`px-5 py-2 rounded-full font-medium transition-colors text-sm ${
                            filter === cat 
                              ? 'bg-[#8E44AD] text-white' 
                              : 'bg-white dark:bg-[#1F2937] text-[#706C69] dark:text-[#9CA3AF] border border-[#EAE8E3] dark:border-[#374151] hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* Prompts Grid */}
        <section className="container max-w-6xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.length > 0 ? (
              filteredPrompts.map(p => <PromptCard key={p.title} {...p} onCopy={() => {}} />)
            ) : (
              <div className="md:col-span-3 text-center py-24">
                <p className="text-xl text-[#706C69] dark:text-[#9CA3AF]">No prompts found. Try a different search or filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>
  );
} 