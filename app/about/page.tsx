'use client'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function AboutPage() {
  return (
    <div className="bg-[#F8F7F4] dark:bg-[#111827] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-3xl mx-auto px-6">
          <header className="text-center py-20 border-b border-[#EAE8E3] dark:border-[#374151] mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#3A3532] dark:text-[#E5E7EB]">A place built for minds like ours.</h1>
          </header>

          <article className="mb-16">
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">If your brain feels like it has countless browser tabs open at once, with thoughts constantly jumping between them, then welcome home. You're in the right place.</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">MyMindfulKit wasn't born in a cold boardroom. It grew from a deeply personal need—the journey of a developer, with a mind that works just like yours, searching for solutions.</p>

            <h2 className="text-2xl font-bold mt-16 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-[#E5E7EB]">Our Story Started with a Single Tool</h2>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">Like many, I found that traditional productivity methods didn't always work for me. Focusing on a single task for a long time would make my brain feel "bored" and start looking for an escape route.</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">So, I built my first tool for myself: the <strong>Dual-Task Pomodoro Timer</strong>.</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">The principle was simple: it allowed me to switch rhythmically between two related tasks, which maintained my focus while providing the novelty my brain craved. After using it for a few days, I was amazed—it really worked!</p>

            <h2 className="text-2xl font-bold mt-16 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-[#E5E7EB]">From Sharing to Building a Home</h2>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">When I excitedly wanted to share this useful tool and find similar resources, I discovered a frustrating reality:</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">Most digital tools for ADHD were from large institutions with outdated interfaces, or they were complex commercial software requiring expensive subscriptions.</p>
            <blockquote className="border-l-4 border-[#1ABC9C] pl-6 my-12 text-xl italic text-[#3A3532] dark:text-[#E5E7EB] bg-transparent dark:bg-transparent">I couldn't find one place specifically designed for people like us—a clean, free, and respectful toolkit that I could use instantly.</blockquote>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">In that moment, an idea was born: "If it doesn't exist, why not build it myself?"</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">I have the ability to develop, and more importantly, I have the same lived experience as you. Thus, the vision for MyMindfulKit emerged. It's not just about sharing my own tools, but about creating a hub—a home that gathers all the beneficial tools, games, resources, and methods from across the web.</p>

            <h2 className="text-2xl font-bold mt-16 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-[#E5E7EB]">Our Promise</h2>
            <ul className="promise-list list-none p-0 space-y-8">
              <li className="flex items-start gap-4">
                <span className="icon mt-1 text-[#1ABC9C] dark:text-[#4F46E5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
                <div>
                  <strong>Core Functionality, Always Free:</strong> We promise that the core features of our basic tools will always be free. We want everyone to be able to use them without pressure to improve their daily lives.
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="icon mt-1 text-[#1ABC9C] dark:text-[#4F46E5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                </span>
                <div>
                  <strong>Designed with Empathy:</strong> Every tool we build stems from real struggles and is designed to solve the challenges we share.
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="icon mt-1 text-[#1ABC9C] dark:text-[#4F46E5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6H3m18 6H3m18 6H3"></path></svg>
                </span>
                <div>
                  <strong>Simple & Clear:</strong> We remove all unnecessary distractions to respect your valuable attention.
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="icon mt-1 text-[#1ABC9C] dark:text-[#4F46E5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </span>
                <div>
                  <strong>Private & Secure:</strong> We don't require registration. All your data belongs to you and is saved only in your local browser.
                </div>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-16 mb-6 pb-4 border-b border-[#EAE8E3] dark:border-[#374151] text-[#3A3532] dark:text-[#E5E7EB]">What's Next?</h2>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">To maintain this website and develop more powerful features that require server costs, like AI assistance, we may offer optional <strong>Pro Features</strong> for a fee in the future (e.g., cloud data sync or premium templates).</p>
            <p className="text-lg text-[#706C69] dark:text-[#9CA3AF] mb-6">But this will never change our core mission. Our primary goal is always to provide our community with as many high-quality, free-to-use tools as possible. Your support will help us build this home better.</p>
          </article>

          <section className="text-center mt-24 text-xl text-[#3A3532] dark:text-[#E5E7EB]">
            <p className="mb-4">This website is a gift—to myself, and to everyone like me. And it's just the beginning.</p>
            <p>Thank you for visiting, my partner. Welcome to our toolkit.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
} 