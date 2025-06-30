"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Task } from "../types/task"

export interface PomodoroSettings {
  pomoDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  soundEnabled: boolean
  vibrationEnabled: boolean
  switchAfterPomodoros: number
  dualTaskMode: boolean // 新增：双任务模式开关
  notificationEnabled: boolean // 新增：浏览器通知开关
  playCompletionSound: boolean // 新增：任务完成音效开关
  playBreakSound: boolean // 新增：休息开始音效开关
}

export interface PomodoroSession {
  date: string
  taskType: "A" | "B"
  taskTitle: string
  startTime: string
  endTime: string
  completed: boolean
}

const defaultSettings: PomodoroSettings = {
  pomoDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  vibrationEnabled: true,
  switchAfterPomodoros: 2,
  dualTaskMode: true, // 默认开启双任务模式
  notificationEnabled: true, // 默认开启浏览器通知
  playCompletionSound: true, // 默认开启任务完成音效
  playBreakSound: true, // 默认开启休息开始音效
}

// 浏览器通知工具函数
const requestNotificationPermission = async (): Promise<boolean> => {
  console.log("开始请求通知权限")
  
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return false
  }

  console.log("当前通知权限状态:", Notification.permission)

  if (Notification.permission === "granted") {
    console.log("通知权限已授权")
    return true
  }

  if (Notification.permission === "denied") {
    console.log("Notification permission denied")
    return false
  }

  try {
    console.log("请求通知权限...")
    const permission = await Notification.requestPermission()
    console.log("权限请求结果:", permission)
    return permission === "granted"
  } catch (error) {
    console.error("Error requesting notification permission:", error)
    return false
  }
}

const sendNotification = (title: string, options?: NotificationOptions) => {
  console.log("sendNotification 被调用:", title, options)
  
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return
  }

  if (Notification.permission !== "granted") {
    console.log("Notification permission not granted:", Notification.permission)
    return
  }

  try {
    console.log("准备发送通知:", title, options)
    const notification = new Notification(title, {
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "pomodoro-notification",
      requireInteraction: false,
      silent: false,
      ...options,
    })
    console.log("通知已发送:", notification)
  } catch (error) {
    console.error("Error sending notification:", error)
  }
}

// 在usePomodoro函数参数中添加addTimeToTask
export function usePomodoro(activeTasks: Task[], addTimeToTask: (taskTitle: string, minutes: number) => void) {
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentTaskType, setCurrentTaskType] = useState<"A" | "B">("A")
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [currentSessionStart, setCurrentSessionStart] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(10) // 10秒自动确认

  // 用于时间校正的状态
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null)
  const [totalDuration, setTotalDuration] = useState(25 * 60) // 当前番茄钟的总时长
  const [wasHiddenTime, setWasHiddenTime] = useState<number | null>(null)

  // 新增：用于记录当前已完成的番茄钟数（用于切换任务）
  const [pomodorosSinceSwitch, setPomodorosSinceSwitch] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 获取当前任务信息
  const getCurrentTaskInfo = useCallback(() => {
    if (!settings.dualTaskMode) {
      // 单任务模式
      const firstTask = activeTasks[0]
      return {
        taskAName: firstTask?.title || "Focus Session",
        taskBName: "", // 单任务模式下不需要B任务
        hasValidTasks: true, // 单任务模式下总是有效
      }
    }

    // 双任务模式
    const taskA = activeTasks[0]
    const taskB = activeTasks[1]

    return {
      taskAName: taskA?.title || "Task A",
      taskBName: taskB?.title || "Task B",
      hasValidTasks: activeTasks.length >= 2,
    }
  }, [activeTasks, settings.dualTaskMode])

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("pomodoro-settings")
      const savedSessions = localStorage.getItem("pomodoro-sessions")
      const savedState = localStorage.getItem("pomodoro-state")

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        // 确保新的设置项有默认值
        const updatedSettings = {
          ...defaultSettings,
          ...parsed,
        }
        setSettings(updatedSettings)
        setTimeLeft(updatedSettings.pomoDuration * 60)
        setTotalDuration(updatedSettings.pomoDuration * 60)
      }

      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }

      if (savedState) {
        const state = JSON.parse(savedState)
        setCurrentRound(state.currentRound || 1)
        setCurrentTaskType(state.currentTaskType || "A")
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      // 如果加载失败，使用默认值
    }
  }, [])

  // 请求通知权限的独立 useEffect
  useEffect(() => {
    console.log("权限请求 useEffect 触发，notificationEnabled:", settings.notificationEnabled)
    if (settings.notificationEnabled) {
      console.log("开始请求通知权限...")
      requestNotificationPermission()
    }
  }, [settings.notificationEnabled])

  // Page Visibility API - 监听页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面变为不可见，记录时间
        if (isRunning) {
          setWasHiddenTime(Date.now())
        }
      } else {
        // 页面重新可见，进行时间校正
        if (isRunning && wasHiddenTime && timerStartTime) {
          const now = Date.now()
          const hiddenDuration = Math.floor((now - wasHiddenTime) / 1000) // 隐藏的秒数
          const totalElapsed = Math.floor((now - timerStartTime) / 1000) // 总经过的秒数
          const newTimeLeft = Math.max(0, totalDuration - totalElapsed)

          console.log(
            `页面重新可见，校正时间：隐藏了${hiddenDuration}秒，总共经过${totalElapsed}秒，剩余${newTimeLeft}秒`,
          )

          setTimeLeft(newTimeLeft)

          // 如果时间已经到了，触发完成逻辑
          if (newTimeLeft <= 0) {
            handleTimerComplete()
          }
        }
        setWasHiddenTime(null)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isRunning, wasHiddenTime, timerStartTime, totalDuration])

  // Save sessions to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem("pomodoro-sessions", JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving sessions to localStorage:", error)
    }
  }, [sessions])

  // Save state to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem(
        "pomodoro-state",
        JSON.stringify({
          currentRound,
          currentTaskType,
        }),
      )
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }
  }, [currentRound, currentTaskType])

  // Timer logic - 改进的计时逻辑
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        if (timerStartTime) {
          // 基于绝对时间计算剩余时间
          const now = Date.now()
          const elapsed = Math.floor((now - timerStartTime) / 1000)
          const newTimeLeft = Math.max(0, totalDuration - elapsed)
          setTimeLeft(newTimeLeft)

          // 如果时间到了，清除定时器
          if (newTimeLeft <= 0) {
            clearInterval(intervalRef.current!)
          }
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, timerStartTime, totalDuration])

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }
  }, [timeLeft, isRunning])

  const playNotification = useCallback(() => {
    console.log("playNotification 被调用")
    console.log("设置状态:", {
      soundEnabled: settings.soundEnabled,
      vibrationEnabled: settings.vibrationEnabled,
      notificationEnabled: settings.notificationEnabled
    })
    
    if (settings.soundEnabled) {
      console.log("播放声音提示")
      // 使用系统提示音或语音合成
      if (typeof window !== "undefined" && window.speechSynthesis) {
        console.log("使用语音合成播放声音")
        const utterance = new SpeechSynthesisUtterance("时间到")
        utterance.volume = 0.1
        utterance.rate = 1.2
        window.speechSynthesis.speak(utterance)
      } else {
        console.log("使用 Web Audio API 播放声音")
        // 降级方案：使用系统提示音
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        } catch (error) {
          console.log("Audio notification not supported:", error)
        }
      }
    }

    if (settings.vibrationEnabled && "vibrate" in navigator) {
      console.log("触发震动")
      navigator.vibrate([200, 100, 200])
    }

    // 发送浏览器通知
    if (settings.notificationEnabled) {
      console.log("准备发送浏览器通知")
      const { taskAName, taskBName } = getCurrentTaskInfo()
      let currentTaskTitle: string

      if (!settings.dualTaskMode) {
        currentTaskTitle = taskAName
      } else {
        currentTaskTitle = currentTaskType === "A" ? taskAName : taskBName
      }

      console.log("当前任务信息:", { currentTaskTitle, isBreak, currentTaskType })

      if (isBreak) {
        // 休息完成通知
        console.log("发送休息完成通知")
        sendNotification("休息时间结束！", {
          body: "准备开始下一个番茄钟吧！",
          tag: "break-complete",
        })
      } else {
        // 番茄钟完成通知
        console.log("发送番茄钟完成通知")
        sendNotification("番茄钟完成！", {
          body: `"${currentTaskTitle}" 已完成，该休息一下了！`,
          tag: "pomodoro-complete",
        })
      }
    } else {
      console.log("浏览器通知已禁用")
    }
  }, [settings.soundEnabled, settings.vibrationEnabled, settings.notificationEnabled, isBreak, currentTaskType, getCurrentTaskInfo])

  // 在proceedToNextPhase函数中，修正双任务切换逻辑
  const proceedToNextPhase = useCallback(() => {
    if (currentSessionStart) {
      const { taskAName, taskBName } = getCurrentTaskInfo()
      let currentTaskTitle: string

      if (!settings.dualTaskMode) {
        currentTaskTitle = taskAName
      } else {
        currentTaskTitle = currentTaskType === "A" ? taskAName : taskBName
      }

      const newSession: PomodoroSession = {
        date: new Date().toISOString().split("T")[0],
        taskType: settings.dualTaskMode ? currentTaskType : "A",
        taskTitle: currentTaskTitle,
        startTime: currentSessionStart,
        endTime: new Date().toISOString(),
        completed: true,
      }
      setSessions((prev) => [...prev, newSession])

      if (!isBreak) {
        addTimeToTask(currentTaskTitle, settings.pomoDuration)
      }

      setCurrentSessionStart(null)
    }

    if (!isBreak) {
      // 当前是工作阶段，下一个是休息
      const isLongBreak = currentRound % 4 === 0
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
      setTimeLeft(breakDuration * 60)
      setTotalDuration(breakDuration * 60)
      setIsBreak(true)
      setCurrentRound((prev) => prev + 1)
      // 休息前，增加计数
      if (settings.dualTaskMode) {
        setPomodorosSinceSwitch((prev) => prev + 1)
      }
    } else {
      // 当前是休息阶段，下一个是工作
      if (settings.dualTaskMode) {
        // 每完成 switchAfterPomodoros 个番茄钟后切换任务
        if (pomodorosSinceSwitch >= settings.switchAfterPomodoros) {
          setCurrentTaskType((prev) => (prev === "A" ? "B" : "A"))
          setPomodorosSinceSwitch(1) // 新一轮计数
        }
      }
      setTimeLeft(settings.pomoDuration * 60)
      setTotalDuration(settings.pomoDuration * 60)
      setIsBreak(false)
    }

    setShowConfirmation(false)
    setTimerStartTime(null)
  }, [currentSessionStart, currentTaskType, currentRound, settings, isBreak, getCurrentTaskInfo, addTimeToTask, pomodorosSinceSwitch])

  // skipBreak 也同步修正
  const skipBreak = useCallback(() => {
    if (settings.dualTaskMode) {
      if (pomodorosSinceSwitch >= settings.switchAfterPomodoros) {
        setCurrentTaskType((prev) => (prev === "A" ? "B" : "A"))
        setPomodorosSinceSwitch(1)
      }
    }
    setTimeLeft(settings.pomoDuration * 60)
    setTotalDuration(settings.pomoDuration * 60)
    setIsBreak(false)
    setTimerStartTime(null)
    setIsRunning(false)
  }, [settings, pomodorosSinceSwitch])

  // 在extendCurrentTask函数中也添加时间记录
  const extendCurrentTask = useCallback(() => {
    // 先记录当前番茄钟的时间
    if (!isBreak) {
      const { taskAName, taskBName } = getCurrentTaskInfo()
      let currentTaskTitle: string

      if (!settings.dualTaskMode) {
        // 单任务模式：总是使用第一个任务
        currentTaskTitle = taskAName
      } else {
        // 双任务模式：根据当前任务类型选择
        currentTaskTitle = currentTaskType === "A" ? taskAName : taskBName
      }

      addTimeToTask(currentTaskTitle, settings.pomoDuration)
    }

    const extensionTime = 5 * 60 // 5分钟
    setTimeLeft(extensionTime)
    setTotalDuration(extensionTime)
    setTimerStartTime(Date.now()) // 重新设置开始时间
    setShowConfirmation(false)
    setIsRunning(true) // 自动开始延长的时间
  }, [isBreak, currentTaskType, getCurrentTaskInfo, addTimeToTask, settings])

  const confirmBreak = useCallback(() => {
    proceedToNextPhase()
  }, [proceedToNextPhase])

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    setTimerStartTime(null)
    playNotification()

    if (!isBreak) {
      // 显示确认对话框而不是直接进入休息
      setShowConfirmation(true)
      setConfirmationTimeLeft(10)
    } else {
      // 休息结束，正常进入下一个番茄
      proceedToNextPhase()
    }
  }, [isBreak, playNotification, proceedToNextPhase])

  // 确认对话框倒计时
  useEffect(() => {
    let confirmationInterval: NodeJS.Timeout | null = null

    if (showConfirmation && confirmationTimeLeft > 0) {
      confirmationInterval = setInterval(() => {
        setConfirmationTimeLeft((prev) => {
          if (prev <= 1) {
            // 时间到了，自动进入休息
            proceedToNextPhase()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (confirmationInterval) {
        clearInterval(confirmationInterval)
      }
    }
  }, [showConfirmation, confirmationTimeLeft, proceedToNextPhase])

  const startTimer = useCallback(() => {
    const now = Date.now()
    setIsRunning(true)
    setTimerStartTime(now)

    if (!isBreak && !currentSessionStart) {
      setCurrentSessionStart(new Date().toISOString())
    }
  }, [isBreak, currentSessionStart])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
    setTimerStartTime(null)
    setWasHiddenTime(null) // 清除隐藏时间记录
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setCurrentSessionStart(null)
    setTimerStartTime(null)
    setWasHiddenTime(null)

    if (isBreak) {
      const isLongBreak = currentRound % 4 === 0
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration
      setTimeLeft(breakDuration * 60)
      setTotalDuration(breakDuration * 60)
    } else {
      setTimeLeft(settings.pomoDuration * 60)
      setTotalDuration(settings.pomoDuration * 60)
    }
  }, [isBreak, currentRound, settings])

  const updateSettings = useCallback(
    (newSettings: PomodoroSettings) => {
      setSettings(newSettings)
      try {
        localStorage.setItem("pomodoro-settings", JSON.stringify(newSettings))
      } catch (error) {
        console.error("Error saving settings to localStorage:", error)
      }

      // Update timer if not running
      if (!isRunning) {
        if (isBreak) {
          const isLongBreak = currentRound % 4 === 0
          const breakDuration = isLongBreak ? newSettings.longBreakDuration : newSettings.shortBreakDuration
          setTimeLeft(breakDuration * 60)
          setTotalDuration(breakDuration * 60)
        } else {
          setTimeLeft(newSettings.pomoDuration * 60)
          setTotalDuration(newSettings.pomoDuration * 60)
        }
      }
    },
    [isRunning, isBreak, currentRound],
  )

  // Get today's completed sessions count
  const todayCount = sessions.filter(
    (session) => session.date === new Date().toISOString().split("T")[0] && session.completed,
  ).length

  const { taskAName, taskBName, hasValidTasks } = getCurrentTaskInfo()

  // 修改当前任务显示逻辑
  let currentTask: string
  if (isBreak) {
    currentTask = "休息时间"
  } else if (!settings.dualTaskMode) {
    // 单任务模式：显示第一个任务或默认文本
    currentTask = taskAName
  } else {
    // 双任务模式：根据当前任务类型显示
    currentTask = currentTaskType === "A" ? taskAName : taskBName
  }

  return {
    // State
    currentTask,
    currentTaskType: settings.dualTaskMode ? currentTaskType : "A", // 单任务模式总是返回A
    timeLeft,
    isRunning,
    isBreak,
    currentRound,
    todayCount,
    settings,
    sessions,
    showConfirmation,
    confirmationTimeLeft,
    hasValidTasks,
    taskAName,
    taskBName,

    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    extendCurrentTask,
    confirmBreak,
    skipBreak,
  }
}
