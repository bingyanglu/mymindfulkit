"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Brain, Users, Settings, MessageSquare, HelpCircle, Play, Clock, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"
import "./landing-sections.css"

interface LandingSectionsProps {
}

export function LandingSections({}: LandingSectionsProps) {
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null)
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaqItem(openFaqItem === index ? null : index)
  }

  const handleScrollToApp = () => {
    const mainAppEl = document.getElementById('main-app');
    if (mainAppEl) {
      mainAppEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 时间线动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimelineStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const faqItems = [
    {
      question: "What is Dual-Task Pomodoro?",
      answer: "It's a productivity technique that helps you focus better by alternating between two tasks and short breaks. It's designed to prevent burnout and keep your mind engaged.",
    },
    {
      question: "How is it different from a regular Pomodoro?",
      answer: "Traditional Pomodoro focuses on one task. Dual-Task Pomodoro introduces a second task to switch between, which can be particularly helpful for individuals who struggle with sustained attention on a single task, like those with ADHD.",
    },
    {
      question: "Can I use it for a single task?",
      answer: "Yes, the app supports single-task mode. You can simply add one task and use it as a traditional Pomodoro timer.",
    },
    {
      question: "Is my data saved?",
      answer: "Yes, your tasks and settings are saved locally in your browser's storage, so they persist even if you close the tab or browser.",
    },
  ]

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section id="hero" className="text-center space-y-6">
        <Card className="border-slate-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <CardContent className="p-8 md:p-12 relative">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white leading-tight">
                <span className="text-blue-600 dark:text-blue-400">Dual-Task Pomodoro</span> for better attention & less burnout
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                A focus tool that rotates between two tasks, built for better attention, less burnout, and gentle structure. Perfect for ADHD minds, students, and remote workers.
              </p>
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={handleScrollToApp}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Focusing Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white inline-block pb-2 border-b-2 border-blue-500">
            How It Works
          </h2>
        </div>

        <Card className="border-slate-200 dark:border-gray-700">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                  The Dual-Task Pomodoro method helps you maintain focus and prevent mental fatigue by rotating between two distinct tasks. You set up <span className="font-semibold text-blue-600 dark:text-blue-400">Task A</span> and <span className="font-semibold text-purple-600 dark:text-purple-400">Task B</span>.
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                  Each Pomodoro session, you'll focus on one task, then take a short break, and then switch to the other task. This rotation keeps your brain stimulated and reduces the risk of burnout.
                </p>
              </div>
              <div className="timeline-container">
                <div className="timeline-connector h-full absolute left-1/2 top-0 -translate-x-1/2"></div>
                <div className="flex flex-col space-y-8 relative z-10">
                  <div 
                    className={`timeline-item flex items-center space-x-4 ${activeTimelineStep === 0 ? 'ring-2 ring-blue-400 dark:ring-blue-500 scale-105' : ''}`}
                    onClick={() => setActiveTimelineStep(0)}
                  >
                    <div className={`timeline-circle timeline-circle-task-a h-16 w-16 ${activeTimelineStep === 0 ? 'timeline-pulse' : ''}`}>
                      <span className="text-xl font-bold text-white">A</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <h3 className="font-medium text-slate-800 dark:text-white text-lg">Focus on Task A</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">Work intensely on your first task.</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`timeline-item flex items-center space-x-4 ${activeTimelineStep === 1 ? 'ring-2 ring-green-400 dark:ring-green-500 scale-105' : ''}`}
                    onClick={() => setActiveTimelineStep(1)}
                  >
                    <div className={`timeline-circle timeline-circle-break h-16 w-16 ${activeTimelineStep === 1 ? 'timeline-pulse' : ''}`}>
                      <span className="text-sm font-medium text-white">Break</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        <h3 className="font-medium text-slate-800 dark:text-white text-lg">Short Break</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">Relax and recharge before the next task.</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`timeline-item flex items-center space-x-4 ${activeTimelineStep === 2 ? 'ring-2 ring-purple-400 dark:ring-purple-500 scale-105' : ''}`}
                    onClick={() => setActiveTimelineStep(2)}
                  >
                    <div className={`timeline-circle timeline-circle-task-b h-16 w-16 ${activeTimelineStep === 2 ? 'timeline-pulse' : ''}`}>
                      <span className="text-xl font-bold text-white">B</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <h3 className="font-medium text-slate-800 dark:text-white text-lg">Focus on Task B</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">Switch to your second task to keep things fresh.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((step) => (
                      <button 
                        key={step} 
                        className={`h-2 w-8 rounded-full transition-all ${activeTimelineStep === step 
                          ? 'bg-blue-500 dark:bg-blue-400 w-12' 
                          : 'bg-slate-300 dark:bg-slate-600'}`}
                        onClick={() => setActiveTimelineStep(step)}
                        aria-label={`Step ${step + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Who Is It For */}
      <section id="who-is-it-for" className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white inline-block pb-2 border-b-2 border-blue-500">
            Who Is It For?
          </h2>
        </div>

        <Card className="border-slate-200 dark:border-gray-700 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center text-slate-800 dark:text-white">
              <Users className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Perfect For...
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[{
                  text: "Individuals with <span class=\"font-semibold text-blue-600 dark:text-blue-400\">ADHD</span> or similar attention challenges who benefit from novelty and varied stimulation.",
                  icon: (
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></div>
                      <Brain className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                  ),
                  color: "from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/40",
                  borderColor: "border-blue-200 dark:border-blue-800",
                  number: 1,
                  numberBg: "bg-blue-500",
                  highlight: "ADHD"
                },
                {
                  text: "<span class=\"font-semibold text-purple-600 dark:text-purple-400\">Students</span> managing multiple assignments and study topics, needing a structured way to switch between subjects.",
                  icon: <MessageSquare className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
                  color: "from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/40",
                  borderColor: "border-purple-200 dark:border-purple-800",
                  number: 2,
                  numberBg: "bg-purple-500",
                  highlight: "Students"
                },
                {
                  text: "<span class=\"font-semibold text-green-600 dark:text-green-400\">Remote workers</span> balancing various projects and communication needs throughout their day.",
                  icon: <Users className="h-7 w-7 text-green-600 dark:text-green-400" />,
                  color: "from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/40",
                  borderColor: "border-green-200 dark:border-green-800",
                  number: 3,
                  numberBg: "bg-green-500",
                  highlight: "Remote workers"
                },
                {
                  text: "Anyone experiencing <span class=\"font-semibold text-red-600 dark:text-red-400\">burnout</span> or a decline in focus from prolonged single-tasking.",
                  icon: <HelpCircle className="h-7 w-7 text-red-600 dark:text-red-400" />,
                  color: "from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/40",
                  borderColor: "border-red-200 dark:border-red-800",
                  number: 4,
                  numberBg: "bg-red-500",
                  highlight: "burnout"
                },
              ].map((item, index) => (
                <Card
                  key={index} 
                  className={`relative overflow-hidden bg-gradient-to-br ${item.color} border ${item.borderColor}`}
                >
                  <div className={`absolute -top-4 -right-4 h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold opacity-20 ${item.numberBg}`}>
                      {item.number}
                  </div>
                  <CardContent className="flex items-start p-6">
                    <div className="flex-shrink-0 mr-4 mt-1">{item.icon}</div>
                    <p
                      className="text-slate-700 dark:text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.text.replace(new RegExp(item.highlight, 'g'), `<span class="font-semibold text-current">${item.highlight}</span>`) }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white inline-block pb-2 border-b-2 border-blue-500">
            Key Features
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
            <CardHeader>
              <Settings className="h-10 w-10 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl text-slate-800 dark:text-white">Customizable Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Adjust Pomodoro, short break, and long break durations to fit your workflow.
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
            <CardHeader>
              <Clock className="h-10 w-10 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-xl text-slate-800 dark:text-white">Task Switching</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Seamlessly rotate between Task A and Task B to keep your mind engaged and prevent fatigue.
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
            <CardHeader>
              <Brain className="h-10 w-10 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <CardTitle className="text-xl text-slate-800 dark:text-white">ADHD-Friendly Design</CardTitle>
          </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Designed with principles that can help individuals with ADHD maintain focus and productivity.
          </CardContent>
        </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white inline-block pb-2 border-b-2 border-blue-500">
            Frequently Asked Questions
          </h2>
        </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
            <Card key={index} className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader
                className="flex flex-row items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                <CardTitle className="text-lg font-medium text-slate-800 dark:text-white">
                  {item.question}
                </CardTitle>
                    {openFaqItem === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                    ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600 dark:text-gray-400" />
                    )}
              </CardHeader>
                  {openFaqItem === index && (
                <CardContent className="px-4 pb-4 text-slate-700 dark:text-slate-300">
                  {item.answer}
                </CardContent>
                  )}
            </Card>
              ))}
            </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button 
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all"
          size="icon"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
} 