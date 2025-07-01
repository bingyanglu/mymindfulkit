'use client'

import { useState, useEffect, useRef } from 'react'

// Game State Type
type GameState = {
  currentLevel: number
  trialsLeft: number
  currentTrial: number
  isWaiting: boolean
  isActive: boolean
  currentStimuli: Stimulus[]
  shouldRespond: boolean
}

// Stimulus Type
type Stimulus = {
  shape: 'circle' | 'square' | 'triangle'
  color: 'green' | 'red' | 'blue' | 'yellow'
  position: { x: number; y: number }
}

// Score Type
type Score = {
  reactionTimes: number[]
  correctActions: number
  totalActions: number
  hits: number
  falseAlarms: number
  misses: number
  correctRejections: number
}

// Feedback Type
type FeedbackType = 'correct' | 'incorrect' | 'miss' | null

export default function ImpulseControlGamePage() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    trialsLeft: 15,
    currentTrial: 0,
    isWaiting: false,
    isActive: false,
    currentStimuli: [],
    shouldRespond: false,
  })

  const [score, setScore] = useState<Score>({
    reactionTimes: [],
    correctActions: 0,
    totalActions: 0,
    hits: 0,
    falseAlarms: 0,
    misses: 0,
    correctRejections: 0,
  })

  const [currentScreen, setCurrentScreen] = useState<'start' | 'training' | 'result'>('start')
  const [feedback, setFeedback] = useState<FeedbackType>(null)
  const [isLevelUnlocked, setIsLevelUnlocked] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [totalTrials, setTotalTrials] = useState(8) // Default 8 trials, suitable for ADHD

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
  const trialStartTimeRef = useRef<number>(0)
  const hasRespondedRef = useRef<boolean>(false)
  const isRunningRef = useRef<boolean>(false) // Prevent duplicate calls
  const currentScreenRef = useRef<'start' | 'training' | 'result'>(currentScreen)

  // Generate random position
  const generateRandomPosition = (): { x: number; y: number } => ({
    x: Math.random() * 60 + 20, // 20% - 80% of screen width
    y: Math.random() * 40 + 30, // 30% - 70% of screen height
  })

  // Generate stimulus
  const generateStimulus = (isTarget: boolean = false): Stimulus => {
    if (isTarget) {
      return {
        shape: 'circle',
        color: 'green',
        position: generateRandomPosition(),
      }
    }

    const shapes: Stimulus['shape'][] = ['square', 'triangle']
    const colors: Stimulus['color'][] = ['red', 'blue', 'yellow']
    
    return {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      position: generateRandomPosition(),
    }
  }

  // Generate a set of stimuli (for Level 2)
  const generateStimuliSet = (hasTarget: boolean): Stimulus[] => {
    const count = Math.floor(Math.random() * 3) + 3 // 3-5 stimuli
    const stimuli: Stimulus[] = []
    
    // If a target is needed, add a green circle first
    if (hasTarget) {
      stimuli.push(generateStimulus(true))
    }
    
    // Fill the remaining spots
    while (stimuli.length < count) {
      stimuli.push(generateStimulus(false))
    }
    
    return stimuli
  }

  // Clear all timers
  const clearAllTimers = () => {
    if (gameTimerRef.current) {
      clearTimeout(gameTimerRef.current)
      gameTimerRef.current = null
    }
    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
      stimulusTimerRef.current = null
    }
    isRunningRef.current = false
  }

  // Start a new trial
  const startNewTrial = () => {
    console.log(`startNewTrial called, current state: currentScreen=${currentScreenRef.current}, currentTrial=${gameState.currentTrial}, totalTrials=${totalTrials}, isRunning=${isRunningRef.current}, isPaused=${isPaused}`)
    
    // Prevent duplicate calls
    if (isRunningRef.current) {
      console.log('startNewTrial is already running, ignoring call')
      return
    }

    if (isPaused) {
      console.log('Game is paused, not starting new trial')
      return // Don't start a new trial if paused
    }

    // Note: Don't check currentScreen here due to potential state update delays

    // Check if the game should end
    if (gameState.currentTrial >= totalTrials) {
      console.log('Game over!')
      endGame()
      return
    }

    isRunningRef.current = true

    hasRespondedRef.current = false
    setFeedback(null)

    // Waiting state
    setGameState(prev => ({
      ...prev,
      isWaiting: true,
      isActive: false,
      currentStimuli: [],
    }))

    // Random wait time (1-3 seconds)
    const waitTime = Math.random() * 2000 + 1000
    
    gameTimerRef.current = setTimeout(() => {
      // Check state in the timer callback - use ref to get the latest value
      if (currentScreenRef.current !== 'training') {
        console.log(`Timer check: current screen is ${currentScreenRef.current}, not training, stopping execution`)
        isRunningRef.current = false
        return
      }
      
      console.log('Timer check passed, continuing game logic')

      // Determine target probability based on level
      let targetProbability: number
      if (gameState.currentLevel === 1) {
        targetProbability = 0.5 // Level 1: 50% probability (beginner-friendly)
      } else {
        targetProbability = 0.6 // Level 2: 60% probability (more intensive)
      }
      
      const shouldShowTarget = Math.random() < targetProbability
      console.log(`Level ${gameState.currentLevel}: Target probability ${Math.round(targetProbability * 100)}%, this trial ${shouldShowTarget ? 'has' : 'does not have'} a target`)
      
      let stimuli: Stimulus[]
      if (gameState.currentLevel === 1) {
        // Level 1: Single stimulus
        stimuli = [shouldShowTarget ? generateStimulus(true) : generateStimulus(false)]
      } else {
        // Level 2: Multiple stimuli
        stimuli = generateStimuliSet(shouldShowTarget)
      }

      // Check if there is a green circle
      const hasGreenCircle = stimuli.some(s => s.shape === 'circle' && s.color === 'green')

              // Use functional update to ensure getting the latest state
        setGameState(prev => {
          const newTrialNumber = prev.currentTrial + 1

          // Extra safety check
          if (newTrialNumber > totalTrials) {
            console.log('Detected trial count exceeded limit, force ending game')
            setTimeout(() => endGame(), 0) // Async call to endGame
            return prev // Do not update state
          }

        return {
          ...prev,
          isWaiting: false,
          isActive: true,
          currentStimuli: stimuli,
          shouldRespond: hasGreenCircle,
          currentTrial: newTrialNumber,
          trialsLeft: totalTrials - newTrialNumber,
        }
      })

      trialStartTimeRef.current = Date.now()

      // 2.5 seconds later, proceed to the next trial
      stimulusTimerRef.current = setTimeout(() => {
        if (currentScreenRef.current !== 'training') {
          isRunningRef.current = false
          return
        }

        if (!hasRespondedRef.current && hasGreenCircle) {
          // Missed the target to click
          setScore(prev => ({
            ...prev,
            misses: prev.misses + 1,
            totalActions: prev.totalActions + 1,
          }))
          setFeedback('miss')
        } else if (!hasRespondedRef.current && !hasGreenCircle) {
          // Correctly ignored non-target
          setScore(prev => ({
            ...prev,
            correctRejections: prev.correctRejections + 1,
            correctActions: prev.correctActions + 1,
            totalActions: prev.totalActions + 1,
          }))
        }

        setTimeout(() => {
          setFeedback(null)
          isRunningRef.current = false // Clear running state
          if (currentScreenRef.current === 'training') {
            startNewTrial()
          }
        }, 500)
      }, 2500)
    }, waitTime)
  }

  // Handle user click
  const handleClick = () => {
    if (!gameState.isActive || hasRespondedRef.current) return

    hasRespondedRef.current = true
    const reactionTime = Date.now() - trialStartTimeRef.current

    if (gameState.shouldRespond) {
      // Correct click
      setScore(prev => ({
        ...prev,
        hits: prev.hits + 1,
        correctActions: prev.correctActions + 1,
        totalActions: prev.totalActions + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
      }))
      setFeedback('correct')
    } else {
      // Incorrect click
      setScore(prev => ({
        ...prev,
        falseAlarms: prev.falseAlarms + 1,
        totalActions: prev.totalActions + 1,
      }))
      setFeedback('incorrect')
    }

    // Clear timer
    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
    }

    // Delay to the next trial
    setTimeout(() => {
      setFeedback(null)
      isRunningRef.current = false // Clear running state
      if (currentScreenRef.current === 'training') {
        startNewTrial()
      }
    }, 500)
  }

  // Start game
  const startGame = () => {
    console.log(`Starting game, total trials set to: ${totalTrials}`)

    // Clear previous state
    clearAllTimers()

    setGameState(prev => ({
      ...prev,
      trialsLeft: totalTrials,
      currentTrial: 0,
      isWaiting: false,
      isActive: false,
      currentStimuli: [],
      shouldRespond: false,
    }))
    setScore({
      reactionTimes: [],
      correctActions: 0,
      totalActions: 0,
      hits: 0,
      falseAlarms: 0,
      misses: 0,
      correctRejections: 0,
    })
    setIsPaused(false)
    setFeedback(null)

    console.log('Setting currentScreen to training')
    setCurrentScreen('training')

    setTimeout(() => {
      console.log(`500ms later calling startNewTrial`)
      startNewTrial()
    }, 500)
  }

  // Start Level 2
  const startLevel2 = () => {
    console.log(`Starting Level 2, total trials set to: ${totalTrials}`)

    // Clear previous state
    clearAllTimers()

    setGameState(prev => ({
      ...prev,
      currentLevel: 2,
      trialsLeft: totalTrials,
      currentTrial: 0,
      isWaiting: false,
      isActive: false,
      currentStimuli: [],
      shouldRespond: false,
    }))
    setScore({
      reactionTimes: [],
      correctActions: 0,
      totalActions: 0,
      hits: 0,
      falseAlarms: 0,
      misses: 0,
      correctRejections: 0,
    })
    setIsPaused(false)
    setFeedback(null)

    console.log('Setting currentScreen to training (Level 2)')
    setCurrentScreen('training')

    setTimeout(() => {
      console.log(`500ms later calling startNewTrial (Level 2)`)
      startNewTrial()
    }, 500)
  }

  // End game
  const endGame = () => {
    console.log('endGame called, clearing timers and showing results')
    clearAllTimers() // Use the unified cleanup function

    const accuracy = score.totalActions > 0 ? Math.round((score.correctActions / score.totalActions) * 100) : 0
    console.log(`Game ended, accuracy: ${accuracy}%`)

    // Check if Level 2 is unlocked
    if (gameState.currentLevel === 1 && accuracy >= 80) {
      setIsLevelUnlocked(true)
    }

    setCurrentScreen('result')
  }

  // Restart the current level
  const restartCurrentLevel = () => {
    if (gameState.currentLevel === 1) {
      startGame()
    } else {
      startLevel2()
    }
  }

  // Get shape SVG element
  const getShapeElement = (stimulus: Stimulus) => {
    const size = 60
    const colorMap = {
      green: '#10B981',
      red: '#EF4444',
      blue: '#3B82F6',
      yellow: '#F59E0B',
    }

    const style = {
      position: 'absolute' as const,
      left: `${stimulus.position.x}%`,
      top: `${stimulus.position.y}%`,
      transform: 'translate(-50%, -50%)',
      fill: colorMap[stimulus.color],
    }

    switch (stimulus.shape) {
      case 'circle':
        return (
          <svg key={`${stimulus.position.x}-${stimulus.position.y}`} width={size} height={size} style={style}>
            <circle cx={size/2} cy={size/2} r={size/2 - 2} />
          </svg>
        )
      case 'square':
        return (
          <svg key={`${stimulus.position.x}-${stimulus.position.y}`} width={size} height={size} style={style}>
            <rect x="2" y="2" width={size-4} height={size-4} />
          </svg>
        )
      case 'triangle':
        return (
          <svg key={`${stimulus.position.x}-${stimulus.position.y}`} width={size} height={size} style={style}>
            <polygon points={`${size/2},2 2,${size-2} ${size-2},${size-2}`} />
          </svg>
        )
    }
  }

  // Get feedback text based on accuracy
  const getFeedbackText = (accuracy: number) => {
    if (accuracy >= 95) return "Lightning fast! Your inhibitory control is outstanding! ⚡️"
    if (accuracy >= 80) return "Excellent performance! Your impulse control is strong. ✨"
    if (accuracy >= 60) return "Good progress! Keep practicing to improve further. 👍"
    return "Every session is a step forward. Keep it up! 💪"
  }

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentScreen === 'training') {
        if (e.code === 'Escape') {
          e.preventDefault()
          setIsPaused(!isPaused)
        } else if (e.code === 'Space') {
          e.preventDefault()
          if (isPaused) {
            setIsPaused(false)
          } else {
            handleClick()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentScreen, isPaused])

  // Cleanup timers on pause
  useEffect(() => {
    if (isPaused) {
      clearAllTimers()
    } else if (currentScreenRef.current === 'training' && !gameState.isActive && !gameState.isWaiting) {
      // Resume game from pause
      setTimeout(() => startNewTrial(), 100)
    }
  }, [isPaused])

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  // Sync currentScreen to ref and handle screen changes
  useEffect(() => {
    const prevScreen = currentScreenRef.current
    currentScreenRef.current = currentScreen

    // Cleanup timers when exiting the training screen
    if (prevScreen === 'training' && currentScreen !== 'training') {
      clearAllTimers()
    }
  }, [currentScreen])

  // Start screen
  if (currentScreen === 'start') {
    return (
      <>
        <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111827] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-[480px] text-center">
            <div className="bg-white dark:bg-[#1F2937] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151]">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#3A3532] dark:text-[#E5E7EB]">Impulse Control Challenge</h1>
              
              <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-[16px] p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-lg font-semibold text-[#3A3532] dark:text-[#E5E7EB]">Green Circle</span>
                </div>
                <p className="text-[#706C69] dark:text-[#9CA3AF] mb-4">
                  Click the screen only when you see the <strong>Green Circle</strong>
                </p>
                <p className="text-sm text-[#706C69] dark:text-[#9CA3AF]">
                  When you see any other shape or color, inhibit the urge to click
                </p>
              </div>

              <div className="mb-6 text-left">
                <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Training Mode</h3>
                <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentLevel: 1 }))}
                    className={`flex-1 py-3 px-4 border-r border-[#EAE8E3] dark:border-[#374151] transition-all duration-200 text-sm font-medium ${
                      gameState.currentLevel === 1
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    Level 1 (Basic)
                  </button>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentLevel: 2 }))}
                    className={`flex-1 py-3 px-4 transition-all duration-200 text-sm font-medium ${
                      gameState.currentLevel === 2
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    Level 2 (Advanced)
                  </button>
                </div>
              </div>

              <div className="mb-8 text-left">
                <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Training Length</h3>
                <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                  {[
                    { value: 5, label: '5 Rounds', desc: 'Quick Start' },
                    { value: 8, label: '8 Rounds', desc: 'Standard' },
                    { value: 12, label: '12 Rounds', desc: 'Challenge' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTotalTrials(option.value)}
                      className={`flex-1 py-2 px-2 border-r border-[#EAE8E3] dark:border-[#374151] last:border-r-0 transition-all duration-200 text-sm font-medium ${
                        totalTrials === option.value
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                      }`}
                    >
                      <div className="leading-tight">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-xs opacity-80">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-[#1ABC9C] to-[#16A085] dark:from-[#4F46E5] dark:to-[#4338CA] text-white font-bold py-4 rounded-[12px] text-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_20px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
              >
                Start Training
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                💡 Tip: Press ESC key to pause the game during training.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white dark:bg-[#1F2937] border-t border-[#EAE8E3] dark:border-[#374151]">
          <div className="container max-w-4xl mx-auto px-6 py-16">
            <div className="space-y-16">
              
              {/* Scientific Principle Section */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#1ABC9C] dark:bg-[#4F46E5] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">Why Is Impulse Control Training Important for ADHD?</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Core of Executive Function</h3>
                    <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">
                      Inhibitory control is a fundamental part of executive function. It enables us to resist impulses, control our attention, and make thoughtful decisions. For individuals with ADHD, this ability is often weaker.
                    </p>
                  </div>
                  
                  <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">A Scientifically Proven Approach</h3>
                    <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">
                      The Go/No-Go task is a classic method in cognitive science. By requiring the brain to act or inhibit responses under specific conditions, it effectively trains the prefrontal cortex's inhibitory control.
                    </p>
                  </div>
                </div>
              </section>

              {/* Training Tips Section */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#F39C12] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">Training Tips</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Stay Relaxed, Trust Your Instincts",
                      description: "Don't overthink—let your brain naturally recognize the target.",
                      icon: "🧘"
                    },
                    {
                      title: "Focus on the Green Circle",
                      description: "Keep the target shape in mind and ignore distractions.",
                      icon: "🎯"
                    },
                    {
                      title: "Don't Try to Predict",
                      description: "React only to what you see; avoid preparing your response in advance.",
                      icon: "⚡"
                    },
                    {
                      title: "Mistakes Are Normal",
                      description: "Inhibitory control takes time to develop. Don't get discouraged by mistakes.",
                      icon: "💪"
                    }
                  ].map((tip, index) => (
                    <div key={index} className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start">
                        <span className="text-2xl mr-4">{tip.icon}</span>
                        <div>
                          <h3 className="font-semibold text-[#3A3532] dark:text-[#E5E7EB] mb-2">{tip.title}</h3>
                          <p className="text-[#706C69] dark:text-[#9CA3AF] text-sm leading-relaxed">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#9B59B6] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">FAQ</h2>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      question: "What is the goal of this game?",
                      answer: "The goal is to train your inhibitory control. You need to react quickly when you see a green circle, and suppress the urge to click for other shapes or colors. This helps improve impulse control in daily life."
                    },
                    {
                      question: "Why are there distractors with different shapes and colors?",
                      answer: "Distractors increase the task's difficulty and simulate real-life complexity. Your brain learns to quickly identify targets among various stimuli and suppress responses to non-targets, improving selective attention."
                    },
                    {
                      question: "What if my reaction speed is slow?",
                      answer: "Reaction speed varies from person to person. Accuracy is more important than speed. With practice, your reaction time will naturally improve. Focus on identifying the target correctly first; speed will follow as you get better."
                    },
                    {
                      question: "What's the difference between Level 1 and Level 2?",
                      answer: "Level 1 shows only one shape at a time, training basic Go/No-Go responses. Level 2 displays multiple shapes simultaneously, greatly increasing visual search difficulty and training selective attention and inhibitory control in complex environments."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6 border-l-4 border-[#1ABC9C] dark:border-[#4F46E5]">
                      <h3 className="text-lg font-semibold mb-3 text-[#3A3532] dark:text-[#E5E7EB]">{faq.question}</h3>
                      <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
              
            </div>
          </div>
        </div>
      </>
    )
  }

  // Training screen
  if (currentScreen === 'training') {
    if (focusMode) {
      // Focus Mode - Full Screen
      return (
        <div 
          className={`fixed inset-0 z-50 transition-colors duration-300 ${
            gameState.isWaiting 
              ? 'bg-red-500' 
              : gameState.isActive 
                ? 'bg-[#2c3e50]' 
                : 'bg-[#2c3e50]'
          }`}
          onClick={!isPaused ? handleClick : undefined}
        >
          {/* Exit and Pause Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsPaused(!isPaused)
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg backdrop-blur-sm"
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFocusMode(false)
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg backdrop-blur-sm"
            >
              🔙
            </button>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((totalTrials - gameState.trialsLeft) / totalTrials) * 100}%` }}
            />
          </div>

          {isPaused ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-4">Game is Paused</h2>
                <p className="text-xl mb-8">Press Space key to continue, or click the button</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg text-xl font-bold"
                >
                  Resume Game
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-screen relative">
              {gameState.isWaiting && (
                <div className="text-white text-4xl font-bold">Ready...</div>
              )}

              {gameState.isActive && gameState.currentStimuli.map(getShapeElement)}

              {feedback && (
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                  feedback === 'correct' ? 'animate-pulse' : 'animate-bounce'
                }`}>
                  {feedback === 'correct' && (
                    <div className="text-green-400 text-6xl font-bold">
                      {score.reactionTimes[score.reactionTimes.length - 1]}ms
                    </div>
                  )}
                  {feedback === 'incorrect' && (
                    <div className="text-red-400 text-4xl font-bold animate-shake">
                      Should Not Click!
                    </div>
                  )}
                  {feedback === 'miss' && (
                    <div className="text-yellow-400 text-4xl font-bold">
                      Missed!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )
    } else {
      // Normal Mode - Card Layout
      return (
        <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111827] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-[600px] text-center">
            <div className="bg-white dark:bg-[#1F2937] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
              
              {/* Header Control Area */}
              <div className="p-6 border-b border-[#EAE8E3] dark:border-[#374151] flex justify-between items-center">
                <div className="text-lg font-bold text-[#3A3532] dark:text-[#E5E7EB]">
                  Level {gameState.currentLevel} - {gameState.currentTrial} / {totalTrials}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="bg-[#F8F7F4] dark:bg-[#374151] text-[#3A3532] dark:text-[#E5E7EB] px-4 py-2 rounded-lg hover:bg-[#EAE8E3] dark:hover:bg-[#4B5563] transition-colors"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={() => setFocusMode(true)}
                    className="bg-[#1ABC9C] dark:bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#16A085] dark:hover:bg-[#4338CA] transition-colors"
                  >
                    Focus Mode
                  </button>
                  <button
                    onClick={() => setCurrentScreen('start')}
                    className="bg-[#F8F7F4] dark:bg-[#374151] text-[#706C69] dark:text-[#9CA3AF] px-4 py-2 rounded-lg hover:bg-[#EAE8E3] dark:hover:bg-[#4B5563] transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-[#F8F7F4] dark:bg-[#374151]">
                <div 
                  className="h-full bg-[#1ABC9C] dark:bg-[#4F46E5] transition-all duration-300"
                  style={{ width: `${((totalTrials - gameState.trialsLeft) / totalTrials) * 100}%` }}
                />
              </div>

              {isPaused ? (
                <div className="p-12 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Game is Paused</h2>
                  <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8">Take a break, resume training when ready</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-[#1ABC9C] dark:bg-[#4F46E5] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#16A085] dark:hover:bg-[#4338CA] transition-colors"
                  >
                    Resume Game
                  </button>
                </div>
              ) : (
                <div 
                  className={`aspect-square relative cursor-pointer transition-colors duration-300 ${
                    gameState.isWaiting 
                      ? 'bg-red-100 dark:bg-red-900' 
                      : 'bg-[#F8F7F4] dark:bg-[#111827]'
                  }`}
                  onClick={handleClick}
                >
                  {gameState.isWaiting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[#3A3532] dark:text-[#E5E7EB] text-3xl font-bold">Ready...</div>
                    </div>
                  )}

                  {gameState.isActive && gameState.currentStimuli.map(getShapeElement)}

                  {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                      feedback === 'correct' ? 'animate-pulse' : 'animate-bounce'
                    }`}>
                      {feedback === 'correct' && (
                        <div className="text-green-500 text-4xl font-bold">
                          {score.reactionTimes[score.reactionTimes.length - 1]}ms
                        </div>
                      )}
                      {feedback === 'incorrect' && (
                        <div className="text-red-500 text-3xl font-bold animate-shake">
                          Should Not Click!
                        </div>
                      )}
                      {feedback === 'miss' && (
                        <div className="text-yellow-500 text-3xl font-bold">
                          Missed!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }

  // Result screen
  if (currentScreen === 'result') {
    const accuracy = score.totalActions > 0 ? Math.round((score.correctActions / score.totalActions) * 100) : 0
    const avgReactionTime = score.reactionTimes.length > 0 
      ? Math.round(score.reactionTimes.reduce((a, b) => a + b, 0) / score.reactionTimes.length)
      : 0

    return (
      <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center px-6">
        <div className="text-center text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Level {gameState.currentLevel} Completed!
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {getFeedbackText(accuracy)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-sm opacity-70">Accuracy</div>
            </div>
            {avgReactionTime > 0 && (
              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400">{avgReactionTime}ms</div>
                <div className="text-sm opacity-70">Avg. Reaction Time</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {gameState.currentLevel === 1 && isLevelUnlocked ? (
              <button
                onClick={startLevel2}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-colors"
              >
                🎉 Challenge Level 2
              </button>
            ) : (
              <button
                onClick={restartCurrentLevel}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all"
              >
                Try This Level Again
              </button>
            )}
            
            <button
              onClick={() => setCurrentScreen('start')}
              className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-3 px-6 rounded-2xl transition-all"
            >
              Back to Settings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
} 