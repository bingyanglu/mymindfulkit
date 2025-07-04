'use client'

import { useState, useEffect, useRef } from 'react'

// 游戏状态类型
type GameState = {
  nLevel: number
  totalTrials: number
  currentTrial: number
  stimulusHistory: number[]
  userRespondedThisTurn: boolean
  isExpectingMatch: boolean
}

// 分数类型
type Score = {
  hits: number
  rejections: number
  misses: number
  falseAlarms: number
}

// 教程状态类型
type TutorialState = {
  step: number
  sequence: number[]
}

export default function NBackGamePage() {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    nLevel: 2,
    totalTrials: 10,
    currentTrial: 0,
    stimulusHistory: [],
    userRespondedThisTurn: false,
    isExpectingMatch: false,
  })

  const [score, setScore] = useState<Score>({ hits: 0, rejections: 0, misses: 0, falseAlarms: 0 })
  const [tutorialState, setTutorialState] = useState<TutorialState>({ step: 0, sequence: [1, 4, 7, 4] })
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'training' | 'results'>('setup')
  const [showInstructions, setShowInstructions] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const [resultAnalysis, setResultAnalysis] = useState('')
  
  // 新增：点击反馈状态
  const [buttonFeedback, setButtonFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle')

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // 使用 useRef 实时记录分数，避免 state 异步问题
  const scoreRef = useRef({ hits: 0, falseAlarms: 0 });

  // 生成一个保证至少有一次匹配的刺激序列
  const generateStimulusSequence = (nLevel: number, totalTrials: number): number[] => {
    // 1. 先生成一个完全随机的序列
    const sequence = Array.from({ length: totalTrials }, () => Math.floor(Math.random() * 9));

    // 2. 检查这个随机序列里是否已经存在匹配
    let hasMatch = false;
    if (totalTrials > nLevel) {
      for (let i = nLevel; i < totalTrials; i++) {
        if (sequence[i] === sequence[i - nLevel]) {
          hasMatch = true;
          break;
        }
      }
    }

    // 3. 如果没有匹配，并且游戏轮数足够创造一个匹配，就强制插入一个
    if (!hasMatch && totalTrials > nLevel) {
      // 随机选择一个可以插入匹配的位置
      const matchIndex = nLevel + Math.floor(Math.random() * (totalTrials - nLevel));
      // 强制让这个位置的值等于它 n-back 之前的值
      sequence[matchIndex] = sequence[matchIndex - nLevel];
    }
    
    return sequence;
  };

  // 处理用户输入
  const handleUserInput = () => {
    // 防止重复点击
    if (gameState.userRespondedThisTurn) return

    // 标记已响应
    setGameState(prev => ({ ...prev, userRespondedThisTurn: true }))

    // 评估点击
    if (gameState.isExpectingMatch) {
      scoreRef.current.hits += 1;
      setButtonFeedback('correct')
    } else {
      scoreRef.current.falseAlarms += 1;
      setButtonFeedback('incorrect')
    }

    // 重置按钮反馈
    setTimeout(() => setButtonFeedback('idle'), 500)
  }

  // 开始游戏
  const startGame = () => {
    scoreRef.current = { hits: 0, falseAlarms: 0 };
    // 预先生成本局游戏所需的所有刺激
    const stimulusHistory = generateStimulusSequence(gameState.nLevel, gameState.totalTrials);

    setGameState(prev => ({
      ...prev,
      currentTrial: 0,
      stimulusHistory: stimulusHistory, // 将生成的完整序列存入 state
      userRespondedThisTurn: false,
      isExpectingMatch: false,
    }))
    setScore({ hits: 0, rejections: 0, misses: 0, falseAlarms: 0 })
    setButtonFeedback('idle')
    setCurrentScreen('training')
    // 将完整序列传入游戏循环
    runGameLoop(stimulusHistory);
  }

  // 游戏核心循环 (现在只负责按顺序展示和判断)
  const runGameLoop = (stimulusHistory: number[]) => {
    setGameState(prev => {
      // 检查游戏是否结束
      if (prev.currentTrial >= prev.totalTrials) {
        endGame(prev);
        return prev;
      }

      // --- 核心逻辑开始 ---
      const newCurrentTrial = prev.currentTrial + 1;
      const newPosition = stimulusHistory[newCurrentTrial - 1]; // 从预生成序列中获取当前位置

      // 判断是否为"匹配"回合
      const isNowExpectingMatch = (newCurrentTrial > prev.nLevel) &&
        (newPosition === stimulusHistory[newCurrentTrial - 1 - prev.nLevel]);
      
      return {
        ...prev,
        currentTrial: newCurrentTrial,
        stimulusHistory: stimulusHistory, // 确保 state 中的 history 同步
        userRespondedThisTurn: false,
        isExpectingMatch: isNowExpectingMatch,
      };
    });

    if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    // 把序列传递给下一轮循环
    gameTimerRef.current = setTimeout(() => runGameLoop(stimulusHistory), 2500);
  };

  // 最终结果计算逻辑 (endGame)
  const endGame = (finalGameState: GameState) => {
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current);

    // 1. 计算总共有多少个"本应匹配"的回合
    let actualMatches = 0;
    for (let i = finalGameState.nLevel; i < finalGameState.totalTrials; i++) {
      if (finalGameState.stimulusHistory[i] === finalGameState.stimulusHistory[i - finalGameState.nLevel]) {
        actualMatches++;
      }
    }

    // 2. 计算最终的"错过匹配数"
    const finalMisses = actualMatches - scoreRef.current.hits;

    // 3. 计算总共有多少个"不应匹配"的回合
    const totalScorableTrials = finalGameState.totalTrials - finalGameState.nLevel;
    const totalNonMatches = totalScorableTrials - actualMatches;

    // 4. 计算"正确忽略数"
    const correctRejections = totalNonMatches - scoreRef.current.falseAlarms;
    
    // 5. 计算最终的准确率
    const totalCorrectActions = scoreRef.current.hits + correctRejections;
    const finalAccuracy = totalScorableTrials > 0 ? Math.round((totalCorrectActions / totalScorableTrials) * 100) : 0;

    const finalScore = {
      hits: scoreRef.current.hits,
      misses: finalMisses,
      falseAlarms: scoreRef.current.falseAlarms,
      rejections: correctRejections,
    };
    
    setScore(finalScore);
    setAccuracy(finalAccuracy);
    setResultAnalysis(getResultAnalysis(finalAccuracy));
    setCurrentScreen('results');
  };

  // 获取结果分析
  const getResultAnalysis = (accuracy: number) => {
    if (accuracy >= 95) return "Your focus was almost perfect! 🔥"
    if (accuracy >= 80) return "Excellent score! Your working memory is getting stronger. ✨"
    if (accuracy >= 60) return "Great effort. Your brain got a solid workout. 👍"
    return "Every training session plants a seed for future focus."
  }

  // 运行教程步骤
  const runTutorialStep = () => {
    setTutorialState(prev => ({ ...prev, step: (prev.step + 1) % 6 }))
  }

  // 处理设置选择
  const handleSettingChange = (type: 'nLevel' | 'totalTrials', value: number) => {
    setGameState(prev => ({ ...prev, [type]: value }))
  }

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentScreen === 'training' && e.code === 'Space') {
        e.preventDefault()
        handleUserInput()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentScreen, gameState.userRespondedThisTurn, gameState.isExpectingMatch])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#111827] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[420px] text-center">
        {/* 设置屏幕 */}
        {currentScreen === 'setup' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151]">
            <h1 className="text-3xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">N-Back Training</h1>
            <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8">
              A classic working memory challenge. Your only mission: press the button when the square's position matches.
            </p>

            {/* 教程容器 */}
            <div className="bg-[#F8F7F4] dark:bg-[#111827] rounded-[16px] p-6 mb-8">
              <div 
                className="flex items-center justify-center cursor-pointer text-[#1ABC9C] dark:text-[#4F46E5] font-bold"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                How to Play? Click for an example
                <svg 
                  className={`ml-2 transition-transform duration-300 ${showInstructions ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {showInstructions && (
                <div className="mt-6">
                  <div className="text-center">
                    <p className="text-[#3A3532] dark:text-[#E5E7EB] mb-4 min-h-[50px]">
                      {tutorialState.step === 0 && "Let's walk through a 2-Back example. Watch the squares."}
                      {tutorialState.step === 1 && "The first square appears. Remember its position."}
                      {tutorialState.step === 2 && "The second square appears."}
                      {tutorialState.step === 3 && "The third square. It's different from the 1st (2 steps ago). So you do nothing."}
                      {tutorialState.step === 4 && "The fourth square. Look! It's in the same spot as the 2nd square (2 steps ago)!"}
                      {tutorialState.step === 5 && "This is a match! This is when you press the 'Match' button. Got it?"}
                    </p>
                    <div className="grid grid-cols-3 gap-2 w-[180px] aspect-square mx-auto mb-4">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`rounded-[8px] transition-colors duration-200 ${
                            tutorialState.step === 1 && tutorialState.sequence[0] === i ? 'bg-[#1ABC9C] dark:bg-[#4F46E5]' :
                            tutorialState.step === 2 && tutorialState.sequence[1] === i ? 'bg-[#1ABC9C] dark:bg-[#4F46E5]' :
                            tutorialState.step === 3 && (tutorialState.sequence[0] === i || tutorialState.sequence[2] === i) ? 
                              (tutorialState.sequence[0] === i ? 'bg-[#F39C12]' : 'bg-[#1ABC9C] dark:bg-[#4F46E5]') :
                            tutorialState.step >= 4 && (tutorialState.sequence[1] === i || tutorialState.sequence[3] === i) ? 
                              (tutorialState.sequence[1] === i ? 'bg-[#F39C12]' : 'bg-[#1ABC9C] dark:bg-[#4F46E5]') :
                            'bg-[#EAE8E3] dark:bg-[#374151]'
                          }`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={runTutorialStep}
                      className="bg-white dark:bg-[#1F2937] text-[#3A3532] dark:text-[#E5E7EB] border border-[#EAE8E3] dark:border-[#374151] px-4 py-2 rounded-[8px] font-bold text-sm"
                    >
                      {tutorialState.step === 5 ? "Got it! Replay" : "Next Step"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 难度设置 */}
            <div className="mb-6 text-left">
              <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Difficulty (N-Level)</h3>
              <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                {[
                  { value: 1, label: '1-Back (Easy)' },
                  { value: 2, label: '2-Back (Normal)' },
                  { value: 3, label: '3-Back (Hard)' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSettingChange('nLevel', option.value)}
                    className={`flex-1 py-4 px-4 border-r border-[#EAE8E3] dark:border-[#374151] last:border-r-0 transition-all duration-200 text-sm font-medium ${
                      gameState.nLevel === option.value
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 轮数设置 */}
            <div className="mb-8 text-left">
              <h3 className="text-lg font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Rounds (Trials)</h3>
              <div className="flex rounded-[8px] border border-[#EAE8E3] dark:border-[#374151] overflow-hidden">
                {[10, 20, 30].map((trials) => (
                  <button
                    key={trials}
                    onClick={() => handleSettingChange('totalTrials', trials)}
                    className={`flex-1 py-4 px-4 border-r border-[#EAE8E3] dark:border-[#374151] last:border-r-0 transition-all duration-200 text-sm font-medium ${
                      gameState.totalTrials === trials
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5] text-white font-bold'
                        : 'bg-transparent text-[#706C69] dark:text-[#9CA3AF] hover:bg-[#F8F7F4] dark:hover:bg-[#1F2937]'
                    }`}
                  >
                    {trials}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold py-6 px-8 rounded-[16px] shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)] hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Training
            </button>
          </div>
        )}

        {/* 训练屏幕 */}
        {currentScreen === 'training' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151]">
            <div className="text-2xl font-bold text-[#706C69] dark:text-[#9CA3AF] h-8 mb-6">
              {gameState.currentTrial} / {gameState.totalTrials}
            </div>
            
            <div className="relative mb-8">
              <div className="grid grid-cols-3 gap-4 w-full aspect-square">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[8px] transition-colors duration-200 ${
                      gameState.currentTrial > 0 && gameState.stimulusHistory[gameState.currentTrial - 1] === i
                        ? 'bg-[#1ABC9C] dark:bg-[#4F46E5]'
                        : 'bg-[#F0F2F5] dark:bg-[#374151]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleUserInput}
              disabled={gameState.userRespondedThisTurn || buttonFeedback !== 'idle'}
              className={`w-full font-bold py-6 px-8 rounded-[16px] transition-all duration-200 ${
                buttonFeedback === 'idle' 
                  ? 'bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)] hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5' :
                buttonFeedback === 'correct'
                  ? 'bg-[#27AE60] text-white shadow-[0_4px_15px_rgba(39,174,96,0.3)] scale-95' :
                buttonFeedback === 'incorrect'
                  ? 'bg-[#E74C3C] text-white shadow-[0_4px_15px_rgba(231,76,60,0.3)] scale-95' :
                'bg-[#95A5A6] text-white cursor-not-allowed opacity-75'
              }`}
            >
              {buttonFeedback === 'correct' ? '✅ Correct!' :
               buttonFeedback === 'incorrect' ? '❌ Wrong!' :
               gameState.userRespondedThisTurn ? 'Already Responded' :
               'Match (Spacebar)'}
            </button>
          </div>
        )}

        {/* 结果屏幕 */}
        {currentScreen === 'results' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-[#EAE8E3] dark:border-[#374151]">
            <h2 className="text-2xl font-bold mb-4 text-[#3A3532] dark:text-[#E5E7EB]">Training Complete!</h2>
            <p className="text-[#706C69] dark:text-[#9CA3AF] mb-4">You made it through. That's a win! 💪</p>
            <p className="text-[#706C69] dark:text-[#9CA3AF] mb-8">{resultAnalysis}</p>

            {/* 准确率圆圈 */}
            <div className="relative w-[200px] h-[200px] mx-auto mb-4">
              <svg className="transform -rotate-90" width="200" height="200" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--theme-border)" strokeWidth="12" />
                <circle 
                  cx="60" cy="60" r="54" 
                  fill="none" 
                  stroke="#1ABC9C" 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  strokeDasharray="339.29" 
                  strokeDashoffset={339.29 - (accuracy / 100) * 339.29}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-[#3A3532] dark:text-[#E5E7EB]">
                {accuracy}%
              </div>
            </div>

            {/* 统计网格 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#F8F7F4] dark:bg-[#111827] p-4 rounded-[8px] text-center">
                <span className="text-2xl font-bold block text-[#3A3532] dark:text-[#E5E7EB]">{score.hits}</span>
                <span className="text-sm text-[#706C69] dark:text-[#9CA3AF]">✅ Correct Hits</span>
              </div>
              <div className="bg-[#F8F7F4] dark:bg-[#111827] p-4 rounded-[8px] text-center">
                <span className="text-2xl font-bold block text-[#3A3532] dark:text-[#E5E7EB]">{score.misses}</span>
                <span className="text-sm text-[#706C69] dark:text-[#9CA3AF]">❌ Missed Hits</span>
              </div>
              <div className="bg-[#F8F7F4] dark:bg-[#111827] p-4 rounded-[8px] text-center">
                <span className="text-2xl font-bold block text-[#3A3532] dark:text-[#E5E7EB]">{score.falseAlarms}</span>
                <span className="text-sm text-[#706C69] dark:text-[#9CA3AF]">🤯 False Alarms</span>
              </div>
            </div>

            {/* 结果控制按钮 */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={startGame}
                className="bg-[#1ABC9C] hover:bg-[#16A085] dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white font-bold py-6 px-8 rounded-[16px] shadow-[0_4px_15px_rgba(26,188,156,0.2)] dark:shadow-[0_4px_15px_rgba(79,70,229,0.2)] hover:shadow-[0_7px_20px_rgba(26,188,156,0.3)] dark:hover:shadow-[0_7px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Train Again
              </button>
              <button 
                onClick={() => setCurrentScreen('setup')}
                className="bg-white dark:bg-[#1F2937] text-[#3A3532] dark:text-[#E5E7EB] border border-[#EAE8E3] dark:border-[#374151] font-bold py-6 px-8 rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:bg-[#F8F7F4] dark:hover:bg-[#111827] transition-all duration-200"
              >
                Change Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="mt-16 max-w-[800px]">
        {/* 为什么 N-Back 训练有效 */}
        <section className="mb-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#3A3532] dark:text-[#E5E7EB]">Why N-Back Training Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#1F2937] p-8 rounded-[24px] border border-[#EAE8E3] dark:border-[#374151] shadow-[0_4px_6px_rgba(0,0,0,0.05)] text-center">
              <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] text-[#1ABC9C] dark:text-[#4F46E5] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Improves Focus</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Helps you sustain attention and resist distractions during a continuous task.</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] p-8 rounded-[24px] border border-[#EAE8E3] dark:border-[#374151] shadow-[0_4px_6px_rgba(0,0,0,0.05)] text-center">
              <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] text-[#1ABC9C] dark:text-[#4F46E5] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a8 8 0 0 1 8-8V2a4 4 0 0 0-4 4h.5"></path>
                  <path d="M4 11h.5a4 4 0 0 1 4 4v.5a8 8 0 0 0 8 8h1a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-1"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Boosts Working Memory</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">The core benefit, strengthening your ability to hold and manipulate information in your mind.</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] p-8 rounded-[24px] border border-[#EAE8E3] dark:border-[#374151] shadow-[0_4px_6px_rgba(0,0,0,0.05)] text-center">
              <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-[rgba(26,188,156,0.1)] dark:bg-[rgba(79,70,229,0.1)] text-[#1ABC9C] dark:text-[#4F46E5] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#3A3532] dark:text-[#E5E7EB]">Trains Impulse Control</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF]">Learning to not click when there isn't a match is a powerful exercise in self-regulation.</p>
            </div>
          </div>
        </section>

        {/* FAQ 部分 */}
        <section className="mb-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#3A3532] dark:text-[#E5E7EB]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              <summary className="text-xl font-bold p-6 cursor-pointer list-none flex justify-between items-center text-[#3A3532] dark:text-[#E5E7EB]">
                <h3>This is hard. What if my score is low?</h3>
                <span className="transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-[#706C69] dark:text-[#9CA3AF]">
                <p>That's completely normal! N-Back is designed to be challenging. The goal isn't to get a perfect score, but to persist. Every session, regardless of the score, is an effective workout for your brain. We value completion over perfection.</p>
              </div>
            </details>
            <details className="bg-white dark:bg-[#1F2937] border border-[#EAE8E3] dark:border-[#374151] rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
              <summary className="text-xl font-bold p-6 cursor-pointer list-none flex justify-between items-center text-[#3A3532] dark:text-[#E5E7EB]">
                <h3>How often should I train?</h3>
                <span className="transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-[#706C69] dark:text-[#9CA3AF]">
                <p>Studies suggest that consistent training of 15-20 minutes per day yields the best results. You can start with a few short rounds daily to build the habit. Remember, consistency is more important than duration.</p>
              </div>
            </details>
          </div>
          
          <div className="mt-8 p-6 bg-[#F8F7F4] dark:bg-[#111827] rounded-[16px] border border-[#EAE8E3] dark:border-[#374151]">
            <p className="text-[#706C69] dark:text-[#9CA3AF] text-center">
              This tool is part of our complete suite for improving executive functions. To learn the science behind it, read our <a href="https://www.mymindfulkit.com/blog/The-Ultimate-Guide-to-Brain-Games-for-ADHD-Scientifically-Improve-Focus-Memory" className="text-[#1ABC9C] dark:text-[#4F46E5] hover:underline font-medium">Ultimate Guide to Brain Games for ADHD</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
} 