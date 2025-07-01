'use client'

import { useState, useEffect, useRef } from 'react'

// 游戏状态类型
type GameState = {
  currentLevel: number
  trialsLeft: number
  currentTrial: number
  isWaiting: boolean
  isActive: boolean
  currentStimuli: Stimulus[]
  shouldRespond: boolean
}

// 刺激物类型
type Stimulus = {
  shape: 'circle' | 'square' | 'triangle'
  color: 'green' | 'red' | 'blue' | 'yellow'
  position: { x: number; y: number }
}

// 分数类型
type Score = {
  reactionTimes: number[]
  correctActions: number
  totalActions: number
  hits: number
  falseAlarms: number
  misses: number
  correctRejections: number
}

// 反馈类型
type FeedbackType = 'correct' | 'incorrect' | 'miss' | null

export default function ImpulseControlGamePage() {
  // 游戏状态
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
  const [totalTrials, setTotalTrials] = useState(8) // 默认8轮，适合ADHD

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
  const trialStartTimeRef = useRef<number>(0)
  const hasRespondedRef = useRef<boolean>(false)
  const isRunningRef = useRef<boolean>(false) // 防止重复调用
  const currentScreenRef = useRef<'start' | 'training' | 'result'>(currentScreen)

  // 生成随机位置
  const generateRandomPosition = (): { x: number; y: number } => ({
    x: Math.random() * 60 + 20, // 20% - 80% 的屏幕宽度
    y: Math.random() * 40 + 30, // 30% - 70% 的屏幕高度
  })

  // 生成刺激物
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

  // 生成一组刺激物（用于第二关）
  const generateStimuliSet = (hasTarget: boolean): Stimulus[] => {
    const count = Math.floor(Math.random() * 3) + 3 // 3-5个刺激物
    const stimuli: Stimulus[] = []
    
    // 如果需要目标，先添加一个绿色圆形
    if (hasTarget) {
      stimuli.push(generateStimulus(true))
    }
    
    // 填充其余位置
    while (stimuli.length < count) {
      stimuli.push(generateStimulus(false))
    }
    
    return stimuli
  }

  // 清理所有定时器
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

  // 开始新回合
  const startNewTrial = () => {
    console.log(`startNewTrial被调用，当前状态: currentScreen=${currentScreenRef.current}, currentTrial=${gameState.currentTrial}, totalTrials=${totalTrials}, isRunning=${isRunningRef.current}, isPaused=${isPaused}`)
    
    // 防止重复调用
    if (isRunningRef.current) {
      console.log('startNewTrial已在运行，忽略调用')
      return
    }

    if (isPaused) {
      console.log('游戏已暂停，不开始新回合')
      return // 如果暂停则不开始新回合
    }

    // 注意：不在这里检查currentScreen，因为状态更新可能有延迟

    // 检查游戏是否应该结束
    if (gameState.currentTrial >= totalTrials) {
      console.log('游戏结束！')
      endGame()
      return
    }

    isRunningRef.current = true

    hasRespondedRef.current = false
    setFeedback(null)

    // 等待状态
    setGameState(prev => ({
      ...prev,
      isWaiting: true,
      isActive: false,
      currentStimuli: [],
    }))

    // 随机等待时间 (1-3秒)
    const waitTime = Math.random() * 2000 + 1000
    
    gameTimerRef.current = setTimeout(() => {
      // 在定时器回调中检查状态 - 使用ref获取最新值
      if (currentScreenRef.current !== 'training') {
        console.log(`定时器检查：当前屏幕为 ${currentScreenRef.current}，不是training，停止执行`)
        isRunningRef.current = false
        return
      }
      
      console.log('定时器检查通过，继续执行游戏逻辑')

      // 根据关卡决定目标出现概率
      let targetProbability: number
      if (gameState.currentLevel === 1) {
        targetProbability = 0.4 // 第一关：40% 概率（入门难度）
      } else {
        targetProbability = 0.6 // 第二关：60% 概率（提高训练强度）
      }
      
      const shouldShowTarget = Math.random() < targetProbability
      console.log(`关卡${gameState.currentLevel}: 目标出现概率${Math.round(targetProbability * 100)}%, 本轮${shouldShowTarget ? '有' : '无'}目标`)
      
      let stimuli: Stimulus[]
      if (gameState.currentLevel === 1) {
        // 第一关：单个刺激物
        stimuli = [shouldShowTarget ? generateStimulus(true) : generateStimulus(false)]
      } else {
        // 第二关：多个刺激物
        stimuli = generateStimuliSet(shouldShowTarget)
      }

      // 检查是否包含绿色圆形
      const hasGreenCircle = stimuli.some(s => s.shape === 'circle' && s.color === 'green')

              // 使用函数式更新来确保获取最新的状态
        setGameState(prev => {
          const newTrialNumber = prev.currentTrial + 1

          // 额外的安全检查
          if (newTrialNumber > totalTrials) {
            console.log('检测到轮数超出限制，强制结束游戏')
            setTimeout(() => endGame(), 0) // 异步调用endGame
            return prev // 不更新状态
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

      // 2.5秒后进入下一回合
      stimulusTimerRef.current = setTimeout(() => {
        if (currentScreenRef.current !== 'training') {
          isRunningRef.current = false
          return
        }

        if (!hasRespondedRef.current && hasGreenCircle) {
          // 错过了应该点击的目标
          setScore(prev => ({
            ...prev,
            misses: prev.misses + 1,
            totalActions: prev.totalActions + 1,
          }))
          setFeedback('miss')
        } else if (!hasRespondedRef.current && !hasGreenCircle) {
          // 正确忽略了非目标
          setScore(prev => ({
            ...prev,
            correctRejections: prev.correctRejections + 1,
            correctActions: prev.correctActions + 1,
            totalActions: prev.totalActions + 1,
          }))
        }

        setTimeout(() => {
          setFeedback(null)
          isRunningRef.current = false // 清除运行状态
          if (currentScreenRef.current === 'training') {
            startNewTrial()
          }
        }, 500)
      }, 2500)
    }, waitTime)
  }

  // 处理用户点击
  const handleClick = () => {
    if (!gameState.isActive || hasRespondedRef.current) return

    hasRespondedRef.current = true
    const reactionTime = Date.now() - trialStartTimeRef.current

    if (gameState.shouldRespond) {
      // 正确点击
      setScore(prev => ({
        ...prev,
        hits: prev.hits + 1,
        correctActions: prev.correctActions + 1,
        totalActions: prev.totalActions + 1,
        reactionTimes: [...prev.reactionTimes, reactionTime],
      }))
      setFeedback('correct')
    } else {
      // 错误点击
      setScore(prev => ({
        ...prev,
        falseAlarms: prev.falseAlarms + 1,
        totalActions: prev.totalActions + 1,
      }))
      setFeedback('incorrect')
    }

    // 清除定时器
    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
    }

    // 延迟进入下一回合
    setTimeout(() => {
      setFeedback(null)
      isRunningRef.current = false // 清除运行状态
      if (currentScreenRef.current === 'training') {
        startNewTrial()
      }
    }, 500)
  }

  // 开始游戏
  const startGame = () => {
    console.log(`开始游戏，总轮数设置为：${totalTrials}`)
    
    // 清理之前的状态
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
    
    console.log('设置currentScreen为training')
    setCurrentScreen('training')
    
    setTimeout(() => {
      console.log(`500ms后调用startNewTrial`)
      startNewTrial()
    }, 500)
  }

  // 开始第二关
  const startLevel2 = () => {
    console.log(`开始第二关，总轮数设置为：${totalTrials}`)
    
    // 清理之前的状态
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
    
    console.log('设置currentScreen为training（第二关）')
    setCurrentScreen('training')
    
    setTimeout(() => {
      console.log(`500ms后调用startNewTrial（第二关）`)
      startNewTrial()
    }, 500)
  }

  // 结束游戏
  const endGame = () => {
    console.log('endGame被调用，清理定时器并显示结果')
    clearAllTimers() // 使用统一的清理函数

    const accuracy = score.totalActions > 0 ? Math.round((score.correctActions / score.totalActions) * 100) : 0
    console.log(`游戏结束，正确率：${accuracy}%`)
    
    // 检查是否解锁第二关
    if (gameState.currentLevel === 1 && accuracy >= 80) {
      setIsLevelUnlocked(true)
    }

    setCurrentScreen('result')
  }

  // 重新开始当前关卡
  const restartCurrentLevel = () => {
    if (gameState.currentLevel === 1) {
      startGame()
    } else {
      startLevel2()
    }
  }

  // 获取形状SVG
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

  // 获取反馈文案
  const getFeedbackText = (accuracy: number) => {
    if (accuracy >= 95) return "快如闪电！你的抑制力非常出色！⚡️"
    if (accuracy >= 80) return "优秀表现！你的冲动控制能力很强。✨"
    if (accuracy >= 60) return "不错的进步！继续练习会更好。👍"
    return "每次练习都在进步，坚持就是胜利！💪"
  }

  // 键盘事件处理
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

  // 暂停时清理定时器
  useEffect(() => {
    if (isPaused) {
      clearAllTimers()
    } else if (currentScreenRef.current === 'training' && !gameState.isActive && !gameState.isWaiting) {
      // 从暂停恢复时，继续游戏
      setTimeout(() => startNewTrial(), 100)
    }
  }, [isPaused])

  // 清理定时器 - 组件卸载时
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  // 同步currentScreen到ref，并处理屏幕变化
  useEffect(() => {
    const prevScreen = currentScreenRef.current
    currentScreenRef.current = currentScreen
    
    // 如果从training退出到其他屏幕，清理定时器
    if (prevScreen === 'training' && currentScreen !== 'training') {
      clearAllTimers()
    }
  }, [currentScreen])

  // 开始界面
  if (currentScreen === 'start') {
    return (
      <>
        <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111827] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-[480px] text-center">
            <div className="bg-white dark:bg-[#1F2937] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151]">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#3A3532] dark:text-[#E5E7EB]">冲动控制挑战</h1>
              
              <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-[16px] p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-lg font-semibold text-[#3A3532] dark:text-[#E5E7EB]">绿色圆形</span>
                </div>
                <p className="text-[#706C69] dark:text-[#9CA3AF] mb-4">
                  当且仅当看到<strong>绿色圆形</strong>时，点击屏幕
                </p>
                <p className="text-sm text-[#706C69] dark:text-[#9CA3AF]">
                  看到其他形状或颜色时，请抑制点击的冲动
                </p>
              </div>

              <div className="mb-6 text-left">
                <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">训练模式</h3>
                <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentLevel: 1 }))}
                    className={`flex-1 py-3 px-4 border-r border-[#EAE8E3] dark:border-[#374151] transition-all duration-200 text-sm font-medium ${
                      gameState.currentLevel === 1
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    第一关（基础）
                  </button>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, currentLevel: 2 }))}
                    className={`flex-1 py-3 px-4 transition-all duration-200 text-sm font-medium ${
                      gameState.currentLevel === 2
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    第二关（进阶）
                  </button>
                </div>
              </div>

              <div className="mb-8 text-left">
                <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">训练长度</h3>
                <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                  {[
                    { value: 5, label: '5轮（快速）', desc: '适合初学者' },
                    { value: 8, label: '8轮（标准）', desc: 'ADHD推荐' },
                    { value: 12, label: '12轮（挑战）', desc: '深度训练' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTotalTrials(option.value)}
                      className={`flex-1 py-3 px-3 border-r border-[#EAE8E3] dark:border-[#374151] last:border-r-0 transition-all duration-200 text-xs font-medium ${
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
                className="w-full bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold py-6 px-8 rounded-[16px] shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)] hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-200"
              >
                开始训练
              </button>
              
              <p className="text-sm text-[#706C69] dark:text-[#9CA3AF] mt-4">
                💡 训练时按 ESC 键可以暂停游戏
              </p>
            </div>
          </div>
        </div>

        {/* SEO内容部分 */}
        <div className="bg-white dark:bg-[#1F2937] border-t border-[#EAE8E3] dark:border-[#374151]">
          <div className="container max-w-4xl mx-auto px-6 py-16">
            <div className="space-y-16">
              
              {/* 科学原理部分 */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#1ABC9C] dark:bg-[#4F46E5] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">为何冲动控制训练对ADHD重要？</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">执行功能的核心</h3>
                    <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">
                      抑制控制是执行功能的核心组成部分，它让我们能够抵制冲动、控制注意力、做出深思熟虑的决定。对于ADHD人群来说，这项能力往往较弱。
                    </p>
                  </div>
                  
                  <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">科学训练方法</h3>
                    <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">
                      Go/No-Go任务是认知科学中经典的训练方法，通过要求大脑在特定条件下执行或抑制反应，可以有效锻炼前额叶皮层的抑制控制功能。
                    </p>
                  </div>
                </div>
              </section>

              {/* 游戏技巧部分 */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#F39C12] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">训练技巧</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "保持放松，相信直觉",
                      description: "不要过度思考，让大脑自然地识别目标。",
                      icon: "🧘"
                    },
                    {
                      title: "专注于绿色圆形",
                      description: "在心中明确目标形象，忽略其他干扰。",
                      icon: "🎯"
                    },
                    {
                      title: "不要试图预判",
                      description: "只对看到的图形做出反应，避免提前准备动作。",
                      icon: "⚡"
                    },
                    {
                      title: "错误是正常的",
                      description: "抑制控制需要时间培养，不要因为错误而气馁。",
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

              {/* FAQ部分 */}
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-[#9B59B6] rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-[#3A3532] dark:text-[#E5E7EB]">常见问题</h2>
                </div>
                
                <div className="space-y-6">
                  {[
                    {
                      question: "这个游戏的目标是什么？",
                      answer: "游戏的目标是训练您的抑制控制能力。您需要学会在看到绿色圆形时快速反应，同时在看到其他形状或颜色时抑制点击的冲动，这种训练有助于改善日常生活中的冲动控制。"
                    },
                    {
                      question: "为什么会有不同形状和颜色的干扰？",
                      answer: "干扰项的存在是为了增加任务难度，模拟现实生活中的复杂环境。我们的大脑需要学会在多种刺激中快速识别目标，同时抑制对非目标刺激的反应，这种训练有助于提高选择性注意力。"
                    },
                    {
                      question: "我的反应速度慢怎么办？",
                      answer: "反应速度因人而异，重要的是准确性而非速度。随着练习的增加，您的反应速度会自然提升。建议先专注于准确识别目标，速度会随着熟练度的提高而改善。"
                    },
                    {
                      question: "第二关和第一关有什么区别？",
                      answer: "第一关每次只显示一个图形，训练基础的Go/No-Go反应。第二关会同时显示多个图形，大大增加了视觉搜索的难度，训练在复杂环境中的选择性注意力和抑制控制能力。"
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

  // 训练界面
  if (currentScreen === 'training') {
    if (focusMode) {
      // 专注模式 - 全屏
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
          {/* 退出和暂停按钮 */}
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

          {/* 进度条 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((totalTrials - gameState.trialsLeft) / totalTrials) * 100}%` }}
            />
          </div>

          {isPaused ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-4">游戏已暂停</h2>
                <p className="text-xl mb-8">按空格键继续，或点击按钮</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg text-xl font-bold"
                >
                  继续游戏
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-screen relative">
              {gameState.isWaiting && (
                <div className="text-white text-4xl font-bold">准备...</div>
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
                      不应该点击!
                    </div>
                  )}
                  {feedback === 'miss' && (
                    <div className="text-yellow-400 text-4xl font-bold">
                      错过了!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )
    } else {
      // 普通模式 - 卡片布局
      return (
        <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111827] flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-[600px] text-center">
            <div className="bg-white dark:bg-[#1F2937] rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
              
              {/* 头部控制区 */}
              <div className="p-6 border-b border-[#EAE8E3] dark:border-[#374151] flex justify-between items-center">
                <div className="text-lg font-bold text-[#3A3532] dark:text-[#E5E7EB]">
                  第 {gameState.currentLevel} 关 - {gameState.currentTrial} / {totalTrials}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="bg-[#F8F7F4] dark:bg-[#374151] text-[#3A3532] dark:text-[#E5E7EB] px-4 py-2 rounded-lg hover:bg-[#EAE8E3] dark:hover:bg-[#4B5563] transition-colors"
                  >
                    {isPaused ? '继续' : '暂停'}
                  </button>
                  <button
                    onClick={() => setFocusMode(true)}
                    className="bg-[#1ABC9C] dark:bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#16A085] dark:hover:bg-[#4338CA] transition-colors"
                  >
                    专注模式
                  </button>
                  <button
                    onClick={() => setCurrentScreen('start')}
                    className="bg-[#F8F7F4] dark:bg-[#374151] text-[#706C69] dark:text-[#9CA3AF] px-4 py-2 rounded-lg hover:bg-[#EAE8E3] dark:hover:bg-[#4B5563] transition-colors"
                  >
                    退出
                  </button>
                </div>
              </div>

              {/* 进度条 */}
              <div className="h-2 bg-[#F8F7F4] dark:bg-[#374151]">
                <div 
                  className="h-full bg-[#1ABC9C] dark:bg-[#4F46E5] transition-all duration-300"
                  style={{ width: `${((totalTrials - gameState.trialsLeft) / totalTrials) * 100}%` }}
                />
              </div>

              {isPaused ? (
                <div className="p-12 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">游戏已暂停</h2>
                  <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8">休息一下，准备好后继续训练</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-[#1ABC9C] dark:bg-[#4F46E5] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#16A085] dark:hover:bg-[#4338CA] transition-colors"
                  >
                    继续游戏
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
                      <div className="text-[#3A3532] dark:text-[#E5E7EB] text-3xl font-bold">准备...</div>
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
                          不应该点击!
                        </div>
                      )}
                      {feedback === 'miss' && (
                        <div className="text-yellow-500 text-3xl font-bold">
                          错过了!
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

  // 结果界面
  if (currentScreen === 'result') {
    const accuracy = score.totalActions > 0 ? Math.round((score.correctActions / score.totalActions) * 100) : 0
    const avgReactionTime = score.reactionTimes.length > 0 
      ? Math.round(score.reactionTimes.reduce((a, b) => a + b, 0) / score.reactionTimes.length)
      : 0

    return (
      <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center px-6">
        <div className="text-center text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            第 {gameState.currentLevel} 关 完成!
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {getFeedbackText(accuracy)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
              <div className="text-sm opacity-70">正确率</div>
            </div>
            {avgReactionTime > 0 && (
              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400">{avgReactionTime}ms</div>
                <div className="text-sm opacity-70">平均反应速度</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {gameState.currentLevel === 1 && isLevelUnlocked ? (
              <button
                onClick={startLevel2}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-colors"
              >
                🎉 挑战第二关
              </button>
            ) : (
              <button
                onClick={restartCurrentLevel}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all"
              >
                再玩一次本关
              </button>
            )}
            
            <button
              onClick={() => setCurrentScreen('start')}
              className="w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-3 px-6 rounded-2xl transition-all"
            >
              返回设置
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
} 